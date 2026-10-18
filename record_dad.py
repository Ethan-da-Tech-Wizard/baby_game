#!/usr/bin/env python3
"""
🎙️ Dad's Voice Studio for Baby Game
Record your own voice in your Linux terminal so your toddler hears Dad
announcing every letter, number, and animal when they press the keyboard!
"""

import os
import sys
import json
import time
import subprocess
import argparse

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_DIR = os.path.join(SCRIPT_DIR, "audio", "dad")
MANIFEST_PATH = os.path.join(OUTPUT_DIR, "manifest.json")

# Full Key Map with Toddler Prompts
VOICE_ITEMS = [
    # Letters
    {"key": "KeyA", "title": "A - Aerodactyl / Apple", "prompt": "A! Aerodactyl! Apple!"},
    {"key": "KeyB", "title": "B - Blastoise / Ball", "prompt": "B! Blastoise! Ball!"},
    {"key": "KeyC", "title": "C - Charizard / Cat", "prompt": "C! Charizard! Cat!"},
    {"key": "KeyD", "title": "D - Dog", "prompt": "D! Dog! Woof woof!"},
    {"key": "KeyE", "title": "E - Elephant", "prompt": "E! Elephant!"},
    {"key": "KeyF", "title": "F - Frog", "prompt": "F! Frog! Ribbit!"},
    {"key": "KeyG", "title": "G - Galaxy", "prompt": "G! Galaxy!"},
    {"key": "KeyH", "title": "H - Heart", "prompt": "H! Heart! I love you!"},
    {"key": "KeyI", "title": "I - Ice Cream", "prompt": "I! Ice Cream! Yummy!"},
    {"key": "KeyJ", "title": "J - Togepi", "prompt": "J! Togepi!"},
    {"key": "KeyK", "title": "K - Kangaskhan", "prompt": "K! Kangaskhan!"},
    {"key": "KeyL", "title": "L - Lion", "prompt": "L! Lion! Roar!"},
    {"key": "KeyM", "title": "M - Monkey", "prompt": "M! Monkey! Ooh ooh aah aah!"},
    {"key": "KeyN", "title": "N - Nidoking", "prompt": "N! Nidoking!"},
    {"key": "KeyO", "title": "O - Owl", "prompt": "O! Owl! Hoo hoo!"},
    {"key": "KeyP", "title": "P - Pokémon Party", "prompt": "P! Pokémon Dance Party!"},
    {"key": "KeyQ", "title": "Q - Queen", "prompt": "Q! Queen!"},
    {"key": "KeyR", "title": "R - Rainbow", "prompt": "R! Rainbow!"},
    {"key": "KeyS", "title": "S - Starly", "prompt": "S! Starly! Tweet tweet!"},
    {"key": "KeyT", "title": "T - Baby Shark", "prompt": "T! Baby Shark! Doo doo doo doo!"},
    {"key": "KeyU", "title": "U - Unicorn", "prompt": "U! Unicorn!"},
    {"key": "KeyV", "title": "V - Venusaur", "prompt": "V! Venusaur!"},
    {"key": "KeyW", "title": "W - Water", "prompt": "W! Water! Splash splash!"},
    {"key": "KeyX", "title": "X - Xylophone", "prompt": "X! Xylophone!"},
    {"key": "KeyY", "title": "Y - Yummy Donut", "prompt": "Y! Yummy Donut!"},
    {"key": "KeyZ", "title": "Z - Zigzagoon", "prompt": "Z! Zigzagoon!"},
    # Numbers
    {"key": "Digit1", "title": "1 - One Dino", "prompt": "One! One Dino! Roar!"},
    {"key": "Digit2", "title": "2 - Two Dogs", "prompt": "Two! Two Dogs! Woof woof!"},
    {"key": "Digit3", "title": "3 - Three Cats", "prompt": "Three! Three Cats! Meow!"},
    {"key": "Digit4", "title": "4 - Four Ducks", "prompt": "Four! Four Ducks! Quack quack!"},
    {"key": "Digit5", "title": "5 - Five Lions", "prompt": "Five! Five Lions! Roar!"},
    {"key": "Digit6", "title": "6 - Six Frogs", "prompt": "Six! Six Frogs! Ribbit!"},
    {"key": "Digit7", "title": "7 - Seven Cows", "prompt": "Seven! Seven Cows! Moo!"},
    {"key": "Digit8", "title": "8 - Eight Sheep", "prompt": "Eight! Eight Sheep! Baaa!"},
    {"key": "Digit9", "title": "9 - Nine Elephants", "prompt": "Nine! Nine Elephants!"},
    {"key": "Digit0", "title": "10 - Ten Birds", "prompt": "Ten! Ten Birds! Tweet tweet!"},
    # Specials
    {"key": "Space", "title": "Space - Big Party", "prompt": "Party Time! Yay!"},
    {"key": "Enter", "title": "Enter - Earthquake", "prompt": "Earthquake! Boom!"}
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

def record_clip(key, duration=2.2):
    ensure_dirs()
    wav_path = os.path.join(OUTPUT_DIR, f"{key}.wav")
    temp_wav = os.path.join(OUTPUT_DIR, f"{key}_raw.wav")

    # Record using ffmpeg from pulse/pipewire
    cmd = [
        "ffmpeg", "-y", "-loglevel", "error",
        "-f", "pulse", "-i", "default",
        "-t", str(duration),
        "-ar", "44100", "-ac", "1",
        temp_wav
    ]
    try:
        subprocess.run(cmd, check=True)
    except Exception as e:
        print(f"❌ Recording failed with pulse: {e}. Trying ALSA fallback...")
        cmd[4] = "alsa"
        subprocess.run(cmd, check=True)

    # Normalize volume and trim slight silence
    clean_cmd = [
        "ffmpeg", "-y", "-loglevel", "error",
        "-i", temp_wav,
        "-af", "silenceremove=start_periods=1:start_threshold=-45dB,loudnorm",
        wav_path
    ]
    subprocess.run(clean_cmd, check=True)
    if os.path.exists(temp_wav):
        os.remove(temp_wav)

    # Update manifest
    manifest = load_manifest()
    manifest[key] = f"audio/dad/{key}.wav"
    save_manifest(manifest)
    print(f"  ✅ Saved: audio/dad/{key}.wav")

def play_clip(key):
    wav_path = os.path.join(OUTPUT_DIR, f"{key}.wav")
    if os.path.exists(wav_path):
        subprocess.run(["pw-play", wav_path], check=False)
    else:
        print(f"  ⚠️ No recording found for {key}")

def interactive_mode():
    print("=" * 60)
    print("🎙️  WELCOME TO DAD'S VOICE STUDIO FOR BABY GAME!  👶")
    print("=" * 60)
    print("Record prompts for your 2-year-old so when he presses any key,")
    print("he hears his dad's voice talking to him!\n")

    manifest = load_manifest()
    total = len(VOICE_ITEMS)

    for i, item in enumerate(VOICE_ITEMS, 1):
        key = item["key"]
        has_rec = key in manifest
        status_icon = "🟢" if has_rec else "⚪"

        while True:
            print(f"\n[{i}/{total}] {status_icon} Key: {item['title']}")
            print(f"   👉 Suggested Script: \"{item['prompt']}\"")

            choice = input("   Press [ENTER] to record (2.5s), [s] to skip, [p] to play existing, [q] to quit: ").strip().lower()
            if choice == 'q':
                print("\n👋 Voice studio session ended. Your recordings are saved!")
                return
            elif choice == 's':
                break
            elif choice == 'p':
                play_clip(key)
                continue

            print(f"   🔴 RECORDING NOW... SPEAK: \"{item['prompt']}\"")
            record_clip(key, duration=2.5)
            print("   ⏹️ Done! Playing it back to you...")
            play_clip(key)

            review = input("   👉 Keep this clip? [ENTER to keep & next, 'r' to REDO right now]: ").strip().lower()
            if review == 'r':
                print("   🔁 Redoing this clip...")
                continue
            else:
                status_icon = "🟢"
                break

    print("\n🎉 Manifest updated at audio/dad/manifest.json!")
    print("Commit & push or run locally to test on the Chromebook!")

def main():
    parser = argparse.ArgumentParser(description="Dad Voice Studio for Baby Game")
    parser.add_argument("--key", help="Record a specific key (e.g. KeyA, KeyB, Space)")
    parser.add_argument("--play", help="Play existing recording for a key")
    parser.add_argument("--list", action="store_true", help="List all recordings status")
    parser.add_argument("--clear", action="store_true", help="Clear all recordings to start completely fresh")
    args = parser.parse_args()

    ensure_dirs()

    if args.clear:
        confirm = input("⚠️ Are you sure you want to delete all recordings and start fresh? [y/N]: ").strip().lower()
        if confirm == 'y':
            for f in os.listdir(OUTPUT_DIR):
                if f.endswith(".wav"):
                    try:
                        os.remove(os.path.join(OUTPUT_DIR, f))
                    except Exception:
                        pass
            save_manifest({})
            print("✨ All recordings cleared! Clean slate ready.")
        return

    if args.list:
        manifest = load_manifest()
        print(f"\n📋 Dad Voice Recordings ({len(manifest)}/{len(VOICE_ITEMS)} completed):")
        for item in VOICE_ITEMS:
            key = item["key"]
            status = "✅ RECORDED" if key in manifest else "❌ MISSING"
            print(f"  {key:8} {item['title']:30} {status}")
        return

    if args.play:
        play_clip(args.play)
        return

    if args.key:
        matched = next((x for x in VOICE_ITEMS if x["key"].lower() == args.key.lower()), None)
        if matched:
            print(f"\n🎙️ Recording {matched['title']}")
            print(f"   Say: \"{matched['prompt']}\"")
            input("   Press [ENTER] to start recording...")
            print("   🔴 RECORDING NOW...")
            record_clip(matched["key"], duration=2.5)
            print("   ⏹️ Done! Playing it back:")
            play_clip(matched["key"])
        else:
            print(f"Unknown key: {args.key}")
        return

    interactive_mode()

if __name__ == "__main__":
    main()
