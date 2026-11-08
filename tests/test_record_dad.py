"""
Program: Baby Game Voice Studio Test Suite
Programmer: The Maintainer
Last Modified: 11/08/2026
Purpose: Automated unit tests for speech pause detection, WAV slicing, and
         audio manifest persistence in the Baby Game voice studio.
"""

import unittest
import math
import struct
import wave
import tempfile
import json
from pathlib import Path

import sys
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import record_dad


class TestRecordDadEngine(unittest.TestCase):
    """Test suite validating audio signal segmentation and data manifest handlers."""

    def create_synthetic_wav(self, duration_s=1.0, bursts=None, sample_rate=16000):
        """Helper to create a temporary WAV file with defined sound bursts and silence."""
        bursts = bursts or []  # List of (start_s, end_s, frequency_hz, amplitude)
        n_samples = int(duration_s * sample_rate)
        samples = [0] * n_samples

        for start_s, end_s, freq, amp in bursts:
            start_idx = int(start_s * sample_rate)
            end_idx = min(n_samples, int(end_s * sample_rate))
            for i in range(start_idx, end_idx):
                t = i / sample_rate
                samples[i] = int(amp * math.sin(2 * math.pi * freq * t))

        tmp = tempfile.NamedTemporaryFile(suffix=".wav", delete=False)
        tmp_path = Path(tmp.name)
        tmp.close()
        with wave.open(str(tmp_path), "wb") as wf:
            wf.setnchannels(1)
            wf.setsampwidth(2)
            wf.setframerate(sample_rate)
            raw = struct.pack(f"<{n_samples}h", *samples)
            wf.writeframes(raw)
        return tmp_path

    def test_author_metadata(self):
        """Verify The Maintainer authorship block in record_dad.py."""
        script_text = Path(record_dad.__file__).read_text(encoding="utf-8")
        self.assertIn("Programmer: The Maintainer", script_text)
        self.assertIn("Program: Dad's Voice Studio", script_text)

    def test_detect_speech_segments_three_words(self):
        """Test pause detection algorithm on a 3-word utterance pattern."""
        # 3 bursts representing words: [0.1 - 0.4s], [0.7 - 1.0s], [1.3 - 1.6s]
        bursts = [
            (0.1, 0.4, 440, 10000),
            (0.7, 1.0, 440, 10000),
            (1.3, 1.6, 440, 10000),
        ]
        wav_path = self.create_synthetic_wav(duration_s=2.0, bursts=bursts)
        try:
            segments, _, _, _, _ = record_dad.detect_speech_segments(str(wav_path))
            self.assertEqual(len(segments), 3, f"Expected 3 detected speech segments, got {len(segments)}")
            # Verify segments are ordered and non-overlapping
            for i in range(len(segments) - 1):
                self.assertLess(segments[i][1], segments[i + 1][0], "Segments must not overlap")
        finally:
            wav_path.unlink(missing_ok=True)

    def test_detect_speech_segments_pure_silence(self):
        """Ensure silence yields zero detected segments."""
        wav_path = self.create_synthetic_wav(duration_s=1.0, bursts=[])
        try:
            segments, _, _, _, _ = record_dad.detect_speech_segments(str(wav_path))
            self.assertEqual(len(segments), 0, "Pure silence should yield 0 speech segments")
        finally:
            wav_path.unlink(missing_ok=True)

    def test_manifest_roundtrip(self):
        """Ensure manifest save and load operations preserve data structures."""
        with tempfile.TemporaryDirectory() as tmp_dir:
            test_manifest_path = Path(tmp_dir) / "manifest.json"
            orig_path = record_dad.MANIFEST_PATH
            record_dad.MANIFEST_PATH = str(test_manifest_path)
            try:
                test_data = {"KeyA": {"title": "A", "words": ["Apple", "Aerodactyl", "Astronaut"], "recorded": True}}
                record_dad.save_manifest(test_data)
                loaded = record_dad.load_manifest()
                self.assertEqual(loaded, test_data)
            finally:
                record_dad.MANIFEST_PATH = orig_path

    def test_voice_items_catalog(self):
        """Verify voice items cover the full alphabet A-Z."""
        keys = [item["key"] for item in record_dad.VOICE_ITEMS]
        for char in "ABCDEFGHIJKLMNOPQRSTUVWXYZ":
            self.assertIn(f"Key{char}", keys, f"Missing key mapping for letter {char}")


if __name__ == "__main__":
    unittest.main()
