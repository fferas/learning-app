"use client";

import { useState, useRef, useEffect } from "react";
import { LearningModuleProps } from "@/domain/types";
import { Button } from "@/components/ui/Button";

const cvcWords = [
  { word: "cat", sounds: ["c", "a", "t"], emoji: "🐱" },
  { word: "dog", sounds: ["d", "o", "g"], emoji: "🐶" },
  { word: "sun", sounds: ["s", "u", "n"], emoji: "☀️" },
  { word: "hat", sounds: ["h", "a", "t"], emoji: "🎩" },
  { word: "bed", sounds: ["b", "e", "d"], emoji: "🛏️" },
  { word: "cup", sounds: ["c", "u", "p"], emoji: "☕" },
  { word: "pig", sounds: ["p", "i", "g"], emoji: "🐷" },
  { word: "bug", sounds: ["b", "u", "g"], emoji: "🐛" },
  { word: "bin", sounds: ["b", "i", "n"], emoji: "🗑️" },
  { word: "hop", sounds: ["h", "o", "p"], emoji: "🐸" },
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function SoundBuilderCvc({
  objective,
  onComplete,
}: LearningModuleProps) {
  const [queue] = useState(() => shuffle(cvcWords).slice(0, 3));
  const [current, setCurrent] = useState(0);
  const [tapped, setTapped] = useState<Set<number>>(new Set());
  const [blended, setBlended] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [errorTags, setErrorTags] = useState<string[]>([]);
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState<"correct" | "wrong" | "">("");
  const startTimeRef = useRef<number>(0);
  useEffect(() => { startTimeRef.current = Date.now(); }, []);
  const [correctFirst, setCorrectFirst] = useState(0);

  const wordData = queue[current];

  function handleTapSound(i: number) {
    setTapped((prev) => new Set([...prev, i]));
  }

  function handleBlend() {
    setAttempts((a) => a + 1);
    const allTapped = tapped.size >= wordData.sounds.length;
    if (allTapped) {
      setBlended(true);
      const isFirst = attempts === 0;
      if (isFirst) setCorrectFirst((c) => c + 1);
      setFeedback(`${wordData.word.toUpperCase()}! ${wordData.emoji} Great blending! ✓`);
      setFeedbackType("correct");

      setTimeout(() => {
        const next = current + 1;
        if (next >= queue.length) {
          onComplete({
            correctFirstTry: correctFirst + (isFirst ? 1 : 0) === queue.length,
            attempts: attempts + 1,
            responseTimeMs: Date.now() - startTimeRef.current,
            hintsUsed,
            errorTags,
          });
        } else {
          setCurrent(next);
          setTapped(new Set());
          setBlended(false);
          setFeedback("");
          setFeedbackType("");
        }
      }, 1500);
    } else {
      const newErrors = [...errorTags];
      if (!newErrors.includes("cannot_blend")) newErrors.push("cannot_blend");
      setErrorTags(newErrors);
      setFeedback("Tap each sound tile first, then blend!");
      setFeedbackType("wrong");
      if (attempts >= 1) {
        setHintsUsed((h) => h + 1);
      }
    }
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-lg font-bold text-gray-700 text-center">
        {objective.childFriendlyGoal}
      </p>

      <div className="flex items-center gap-2">
        {queue.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full ${i < current ? "bg-green-400" : i === current ? "bg-blue-500" : "bg-gray-200"}`}
          />
        ))}
      </div>

      <p className="text-gray-500 text-sm">
        Tap each sound, then press Blend!
      </p>

      <div className="flex gap-4">
        {wordData.sounds.map((sound, i) => (
          <button
            key={i}
            onClick={() => handleTapSound(i)}
            data-testid={`sound-tile-${i}`}
            className={`w-16 h-16 rounded-2xl text-2xl font-bold transition-all focus:outline-none focus:ring-2 focus:ring-blue-400
              ${tapped.has(i)
                ? "bg-blue-500 text-white shadow-lg"
                : "bg-blue-50 text-blue-700 hover:bg-blue-100"
              }`}
            aria-label={`Sound ${sound}`}
          >
            {sound}
          </button>
        ))}
      </div>

      {blended && (
        <div className="text-center">
          <p className="text-4xl">{wordData.emoji}</p>
          <p className="text-2xl font-bold text-blue-600 mt-2">
            {wordData.word}
          </p>
        </div>
      )}

      {feedback && (
        <p
          className={`text-center font-semibold ${
            feedbackType === "correct" ? "text-emerald-600" : "text-amber-600"
          }`}
          aria-live="polite"
        >
          {feedback}
        </p>
      )}

      <Button
        size="xl"
        variant="primary"
        onClick={handleBlend}
        disabled={blended}
        data-testid="blend-button"
      >
        Blend! 🎵
      </Button>
    </div>
  );
}
