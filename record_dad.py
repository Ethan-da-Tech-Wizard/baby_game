#!/usr/bin/env python3
"""
🎙️ Dad's Voice Studio for Baby Game (with 3-Word Auto-Splitter!)
Record 3 words per key (e.g., "Apple! Aerodactyl! Astronaut!").
The script automatically detects pauses, slices each word into separate clips:
  - KeyA_1.wav (Word 1)
  - KeyA_2.wav (Word 2)
  - KeyA_3.wav (Word 3)
And puts them directly into the game for your toddler!
"""

import os
import sys
import json
import time
import math
import wave
import struct
import subprocess
import argparse

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_DIR = os.path.join(SCRIPT_DIR, "audio", "dad")
MANIFEST_PATH = os.path.join(OUTPUT_DIR, "manifest.json")

# 3-Word Prompts matching the 3-item cycling game engine
VOICE_ITEMS = [
    # Letters (A-Z)
    {"key": "KeyA", "title": "A", "words": ["Apple", "Aerodactyl", "Astronaut"], "prompt": "Apple! Aerodactyl! Astronaut!"},
    {"key": "KeyB", "title": "B", "words": ["Ball", "Blastoise", "Butterfly"], "prompt": "Ball! Blastoise! Butterfly!"},
    {"key": "KeyC", "title": "C", "words": ["Cat", "Charizard", "Car"], "prompt": "Cat! Charizard! Car!"},
    {"key": "KeyD", "title": "D", "words": ["Dog", "Dinosaur", "Drum"], "prompt": "Dog! Dinosaur! Drum!"},
    {"key": "KeyE", "title": "E", "words": ["Elephant", "Electricity", "Earth"], "prompt": "Elephant! Electricity! Earth!"},
    {"key": "KeyF", "title": "F", "words": ["Frog", "Fireworks", "Fire Truck"], "prompt": "Frog! Fireworks! Fire Truck!"},
    {"key": "KeyG", "title": "G", "words": ["Galaxy", "Giraffe", "Guitar"], "prompt": "Galaxy! Giraffe! Guitar!"},
    {"key": "KeyH", "title": "H", "words": ["Heart", "Horse", "Helicopter"], "prompt": "Heart! Horse! Helicopter!"},
    {"key": "KeyI", "title": "I", "words": ["Ice Cream", "Igloo", "Island"], "prompt": "Ice Cream! Igloo! Island!"},
    {"key": "KeyJ", "title": "J", "words": ["Togepi", "Jump", "Juice"], "prompt": "Togepi! Jump! Juice!"},
    {"key": "KeyK", "title": "K", "words": ["Kangaskhan", "Kite", "Koala"], "prompt": "Kangaskhan! Kite! Koala!"},
    {"key": "KeyL", "title": "L", "words": ["Lion", "Lightning", "Lollipop"], "prompt": "Lion! Lightning! Lollipop!"},
    {"key": "KeyM", "title": "M", "words": ["Monkey", "Moon", "Music"], "prompt": "Monkey! Moon! Music!"},
    {"key": "KeyN", "title": "N", "words": ["Nidoking", "Ninja", "Nest"], "prompt": "Nidoking! Ninja! Nest!"},
    {"key": "KeyO", "title": "O", "words": ["Owl", "Octopus", "Orange"], "prompt": "Owl! Octopus! Orange!"},
    {"key": "KeyP", "title": "P", "words": ["Pikachu", "Puppy", "Party"], "prompt": "Pikachu! Puppy! Party!"},
    {"key": "KeyQ", "title": "Q", "words": ["Queen", "Quack", "Quiet"], "prompt": "Queen! Quack! Quiet!"},
    {"key": "KeyR", "title": "R", "words": ["Rainbow", "Rocket", "Robot"], "prompt": "Rainbow! Rocket! Robot!"},
    {"key": "KeyS", "title": "S", "words": ["Starly", "Sun", "Super Saiyan"], "prompt": "Starly! Sun! Super Saiyan!"},
    {"key": "KeyT", "title": "T", "words": ["Baby Shark", "Train", "Turtle"], "prompt": "Baby Shark! Train! Turtle!"},
    {"key": "KeyU", "title": "U", "words": ["Unicorn", "Umbrella", "UFO"], "prompt": "Unicorn! Umbrella! UFO!"},
    {"key": "KeyV", "title": "V", "words": ["Venusaur", "Victory", "Volcano"], "prompt": "Venusaur! Victory! Volcano!"},
    {"key": "KeyW", "title": "W", "words": ["Water", "Whale", "Wind"], "prompt": "Water! Whale! Wind!"},
    {"key": "KeyX", "title": "X", "words": ["Xylophone", "X-Ray", "Treasure"], "prompt": "Xylophone! X-Ray! Treasure!"},
    {"key": "KeyY", "title": "Y", "words": ["Donut", "Yoyo", "Yacht"], "prompt": "Donut! Yoyo! Yacht!"},
    {"key": "KeyZ", "title": "Z", "words": ["Zigzagoon", "Zebra", "Zap"], "prompt": "Zigzagoon! Zebra! Zap!"},
    # Numbers (1-0)
    {"key": "Digit1", "title": "1", "words": ["One", "Dino", "Uno"], "prompt": "One! Dino! Uno!"},
    {"key": "Digit2", "title": "2", "words": ["Two", "Puppy", "Dogs"], "prompt": "Two! Puppy! Dogs!"},
    {"key": "Digit3", "title": "3", "words": ["Three", "Cats", "Kittens"], "prompt": "Three! Cats! Kittens!"},
    {"key": "Digit4", "title": "4", "words": ["Four", "Ducks", "Quack"], "prompt": "Four! Ducks! Quack!"},
    {"key": "Digit5", "title": "5", "words": ["Five", "Lions", "Roar"], "prompt": "Five! Lions! Roar!"},
    {"key": "Digit6", "title": "6", "words": ["Six", "Frogs", "Ribbit"], "prompt": "Six! Frogs! Ribbit!"},
    {"key": "Digit7", "title": "7", "words": ["Seven", "Cows", "Moo"], "prompt": "Seven! Cows! Moo!"},
    {"key": "Digit8", "title": "8", "words": ["Eight", "Sheep", "Baa"], "prompt": "Eight! Sheep! Baa!"},
    {"key": "Digit9", "title": "9", "words": ["Nine", "Elephants", "Stomp"], "prompt": "Nine! Elephants! Stomp!"},
    {"key": "Digit0", "title": "10", "words": ["Ten", "Birds", "Chirp"], "prompt": "Ten! Birds! Chirp!"},
    # Specials
    {"key": "Space", "title": "Space", "words": ["Party", "Woohoo", "Celebrate"], "prompt": "Party! Woohoo! Celebrate!"},
    {"key": "Enter", "title": "Enter", "words": ["Earthquake", "Boom", "Explosion"], "prompt": "Earthquake! Boom! Explosion!"}
]

def ensure_dirs():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

def load_manifest():
    if os.path.exists(MANIFEST_PATH):
        try:
            with open(MANIFEST_PATH, "r") as f:
                return json.load(f)
        except Exception:
            return {}
    return {}

def save_manifest(manifest):
    with open(MANIFEST_PATH, "w") as f:
        json.dump(manifest, f, indent=2)

def detect_speech_segments(wav_path):
    """Detect pauses and return list of (start_sample, end_sample)."""
    with wave.open(wav_path, 'rb') as wf:
        n_channels = wf.getnchannels()
        sampwidth = wf.getsampwidth()
        framerate = wf.getframerate()
        n_frames = wf.getnframes()
        raw = wf.readframes(n_frames)

    fmt = f"<{n_frames * n_channels}h"
    samples = struct.unpack(fmt, raw)
    if n_channels == 2:
        samples = samples[0::2]

    block_size = int(framerate * 0.02) # 20ms
    energies = []
    for i in range(0, len(samples), block_size):
        chunk = samples[i:i+block_size]
        if not chunk: continue
        rms = math.sqrt(sum(s*s for s in chunk) / len(chunk))
        energies.append(rms)

    max_e = max(energies) if energies else 1
    threshold = max(200.0, max_e * 0.12)
    is_speech = [e > threshold for e in energies]

    segments = []
    in_seg = False
    start = 0
    silence_count = 0
    min_silence_blocks = int(0.18 / 0.02) # 180ms pause = word boundary

    for idx, sp in enumerate(is_speech):
        if sp:
            if not in_seg:
                start = max(0, idx - 2)
                in_seg = True
            silence_count = 0
        else:
            if in_seg:
                silence_count += 1
                if silence_count >= min_silence_blocks:
                    end = min(len(is_speech), idx - silence_count + 3)
                    if (end - start) * 0.02 >= 0.22:
                        segments.append((start * block_size, end * block_size))
                    in_seg = False
                    silence_count = 0

    if in_seg:
        end = min(len(is_speech), len(is_speech))
        if (end - start) * 0.02 >= 0.22:
            segments.append((start * block_size, end * block_size))

    return segments, framerate, n_channels, sampwidth, samples

def record_and_split(key, words, duration=3.5):
    ensure_dirs()
    temp_wav = os.path.join(OUTPUT_DIR, f"{key}_full.wav")

    # Record from microphone
    cmd = [
        "ffmpeg", "-y", "-loglevel", "error",
        "-f", "pulse", "-i", "default",
        "-t", str(duration),
        "-ar", "44100", "-ac", "1",
        temp_wav
    ]
    try:
        subprocess.run(cmd, check=True)
    except Exception:
        cmd[4] = "alsa"
        subprocess.run(cmd, check=True)

    # Detect spoken segments
    segments, framerate, n_channels, sampwidth, samples = detect_speech_segments(temp_wav)
    manifest = load_manifest()

    # Always save full take
    full_target = os.path.join(OUTPUT_DIR, f"{key}.wav")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", temp_wav, "-af", "loudnorm", full_target], check=True)
    manifest[key] = f"audio/dad/{key}.wav"

    split_files = []

    # If exactly 3 chunks detected, slice them perfectly!
    if len(segments) == 3:
        for idx, (st, en) in enumerate(segments, 1):
            chunk_samples = samples[st:en]
            raw_chunk = struct.pack(f"<{len(chunk_samples)}h", *chunk_samples)
            part_wav = os.path.join(OUTPUT_DIR, f"{key}_{idx}.wav")
            with wave.open(part_wav, 'wb') as wf:
                wf.setnchannels(1)
                wf.setsampwidth(sampwidth)
                wf.setframerate(framerate)
                wf.writeframes(raw_chunk)
            # Loudnorm slice
            subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", part_wav, "-af", "loudnorm", part_wav + ".tmp.wav"], check=False)
            if os.path.exists(part_wav + ".tmp.wav"):
                os.replace(part_wav + ".tmp.wav", part_wav)
            manifest[f"{key}_{idx}"] = f"audio/dad/{key}_{idx}.wav"
            split_files.append((words[idx-1], part_wav))
    else:
        # Fallback: assign full take or evenly split
        for idx in range(1, 4):
            part_wav = os.path.join(OUTPUT_DIR, f"{key}_{idx}.wav")
            manifest[f"{key}_{idx}"] = f"audio/dad/{key}.wav"
        split_files.append((f"Full Take ({len(segments)} chunks detected)", full_target))

    save_manifest(manifest)
    if os.path.exists(temp_wav):
        os.remove(temp_wav)

    return split_files

def play_file(path):
    if os.path.exists(path):
        subprocess.run(["pw-play", path], check=False)

def interactive_mode(default_dur=3.5):
    print("=" * 65)
    print("🎙️  DAD'S VOICE STUDIO: 3-WORD CYCLING RECORDER  👶")
    print("=" * 65)
    print("For each key, speak the 3 words with a small natural pause between them.")
    print("Example for 'A': \"Apple\" (pause) \"Aerodactyl\" (pause) \"Astronaut\"")
    print(f"Recording window: {default_dur} seconds per key.\n")

    manifest = load_manifest()
    total = len(VOICE_ITEMS)

    for i, item in enumerate(VOICE_ITEMS, 1):
        key = item["key"]
        has_rec = key in manifest
        status_icon = "🟢" if has_rec else "⚪"

        while True:
            print(f"\n[{i}/{total}] {status_icon} Key: {item['title']} -> {', '.join(item['words'])}")
            print(f"   👉 Say: \"{item['prompt']}\"")

            choice = input(f"   Press [ENTER] to record ({default_dur}s), [s] to skip, [q] to quit: ").strip().lower()
            if choice == 'q':
                print("\n👋 Studio session saved! Great job, Dad!")
                return
            elif choice == 's':
                break

            print(f"   🔴 RECORDING ({default_dur}s)... Speak: \"{item['prompt']}\"")
            splits = record_and_split(key, item["words"], duration=default_dur)
            print("   ⏹️ Done recording! Playing back split words:")

            for w_name, w_path in splits:
                print(f"      ▶️ {w_name}...")
                play_file(w_path)
                time.sleep(0.15)

            review = input("   👉 Sound good? [ENTER to keep & continue, 'r' to REDO right now]: ").strip().lower()
            if review == 'r':
                print("   🔁 Redoing this key...")
                continue
            else:
                status_icon = "🟢"
                break

    print("\n🎉 All recordings saved and manifest updated at audio/dad/manifest.json!")

def main():
    parser = argparse.ArgumentParser(description="Dad Voice Studio with 3-Word Auto-Splitter")
    parser.add_argument("--key", help="Record a specific key (e.g. KeyA, KeyB, Space)")
    parser.add_argument("--dur", type=float, default=3.5, help="Recording duration in seconds (default: 3.5)")
    parser.add_argument("--clear", action="store_true", help="Clear all recordings to start fresh")
    parser.add_argument("--list", action="store_true", help="List all recordings status")
    args = parser.parse_args()

    ensure_dirs()

    if args.clear:
        confirm = input("⚠️ Clear all recordings and start fresh? [y/N]: ").strip().lower()
        if confirm == 'y':
            for f in os.listdir(OUTPUT_DIR):
                if f.endswith(".wav"):
                    try: os.remove(os.path.join(OUTPUT_DIR, f))
                    except Exception: pass
            save_manifest({})
            print("✨ All recordings cleared! Clean slate ready.")
        return

    if args.list:
        manifest = load_manifest()
        print(f"\n📋 Dad Voice Recordings ({len(manifest)} clips mapped):")
        for item in VOICE_ITEMS:
            key = item["key"]
            status = "✅ RECORDED" if key in manifest else "❌ MISSING"
            print(f"  {key:8} {item['title']:12} -> {', '.join(item['words']):35} {status}")
        return

    if args.key:
        matched = next((x for x in VOICE_ITEMS if x["key"].lower() == args.key.lower()), None)
        if matched:
            print(f"\n🎙️ Recording {matched['title']}: \"{matched['prompt']}\"")
            input(f"   Press [ENTER] to record ({args.dur}s)...")
            print(f"   🔴 RECORDING ({args.dur}s)... Speak: \"{matched['prompt']}\"")
            splits = record_and_split(matched["key"], matched["words"], duration=args.dur)
            print("   ⏹️ Done! Playing back:")
            for w_name, w_path in splits:
                print(f"      ▶️ {w_name}...")
                play_file(w_path)
        else:
            print(f"Unknown key: {args.key}")
        return

    interactive_mode(default_dur=args.dur)

if __name__ == "__main__":
    main()
