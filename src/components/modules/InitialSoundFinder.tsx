"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { LearningModuleProps } from "@/domain/types";

const questions = [
  {
    sound: "b",
    options: [
      { label: "Ball", emoji: "⚽" },
      { label: "Cat", emoji: "🐱" },
      { label: "Dog", emoji: "🐶" },
    ],
    answer: "Ball",
  },
  {
    sound: "s",
    options: [
      { label: "Sun", emoji: "☀️" },
      { label: "Fish", emoji: "🐟" },
      { label: "Cake", emoji: "🎂" },
    ],
    answer: "Sun",
  },
  {
    sound: "d",
    options: [
      { label: "Cat", emoji: "🐱" },
      { label: "Dog", emoji: "🐶" },
      { label: "Apple", emoji: "🍎" },
    ],
    answer: "Dog",
  },
  {
    sound: "f",
    options: [
      { label: "Fish", emoji: "🐟" },
      { label: "Bird", emoji: "🐦" },
      { label: "Moon", emoji: "🌙" },
    ],
    answer: "Fish",
  },
  {
    sound: "t",
    options: [
      { label: "Rose", emoji: "🌹" },
      { label: "Tree", emoji: "🌳" },
      { label: "House", emoji: "🏠" },
    ],
    answer: "Tree",
  },
  {
    sound: "m",
    options: [
      { label: "Moon", emoji: "🌙" },
      { label: "Sun", emoji: "☀️" },
      { label: "Bird", emoji: "🐦" },
    ],
    answer: "Moon",
  },
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function InitialSoundFinder({
  objective,
  onComplete,
}: LearningModuleProps) {
  const [queue] = useState(() => shuffle(questions).slice(0, 4));
  const [current, setCurrent] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [correctFirst, setCorrectFirst] = useState(0);
  const [errorTags, setErrorTags] = useState<string[]>([]);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState<"correct" | "wrong" | "">("");
  const startTimeRef = useRef<number>(0);
  useEffect(() => { startTimeRef.current = Date.now(); }, []);
  const [questionAttempts, setQuestionAttempts] = useState(0);

  const q = queue[current];

  const advance = useCallback(
    (success: boolean, extraHints = 0, extraErrors: string[] = []) => {
      const next = current + 1;
      if (next >= queue.length) {
        onComplete({
          correctFirstTry: success && correctFirst + 1 === queue.length,
          attempts,
          responseTimeMs: Date.now() - startTimeRef.current,
          hintsUsed: hintsUsed + extraHints,
          errorTags: [...errorTags, ...extraErrors],
        });
      } else {
        setCurrent(next);
        setFeedback("");
        setFeedbackType("");
        setQuestionAttempts(0);
      }
    },
    [current, queue.length, onComplete, correctFirst, attempts, hintsUsed, errorTags]
  );

  function handlePick(label: string) {
    const correct = label === q.answer;
    const newQAttempts = questionAttempts + 1;
    setQuestionAttempts(newQAttempts);
    setAttempts((a) => a + 1);

    if (correct) {
      if (newQAttempts === 1) setCorrectFirst((c) => c + 1);
      setFeedback(`Yes! "${q.answer}" starts with /${q.sound}/! ✓`);
      setFeedbackType("correct");
      setTimeout(() => advance(true), 1300);
    } else {
      const newErrors = [...errorTags];
      if (!newErrors.includes("initial_sound_not_isolated"))
        newErrors.push("initial_sound_not_isolated");
      setErrorTags(newErrors);
      setFeedbackType("wrong");

      if (newQAttempts >= 2) {
        setHintsUsed((h) => h + 1);
        setFeedback(
          `The /${q.sound}/ sound is at the start of "${q.answer}". Listen: /${q.sound}/ - ${q.answer.toLowerCase()}`
        );
        setTimeout(() => advance(false, 1, []), 2000);
      } else {
        setFeedback(`Try again! Which one starts with the /${q.sound}/ sound?`);
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

      <div className="bg-blue-50 rounded-2xl px-8 py-4 text-center">
        <p className="text-gray-600 font-semibold mb-1">
          Which picture starts with
        </p>
        <p className="text-5xl font-bold text-blue-600">/{q.sound}/</p>
      </div>

      {feedback && (
        <p
          className={`text-center font-semibold px-4 ${
            feedbackType === "correct" ? "text-emerald-600" : "text-amber-600"
          }`}
          aria-live="polite"
        >
          {feedback}
        </p>
      )}

      <div className="flex gap-4">
        {q.options.map((opt) => (
          <button
            key={opt.label}
            onClick={() => handlePick(opt.label)}
            data-testid={`sound-choice-${opt.label}`}
            className="flex flex-col items-center gap-2 bg-white rounded-2xl p-4 shadow hover:shadow-md transition-shadow border-2 border-gray-100 hover:border-blue-300 min-w-[6rem] focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label={opt.label}
          >
            <span className="text-5xl">{opt.emoji}</span>
            <span className="text-sm font-semibold text-gray-600">
              {opt.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
