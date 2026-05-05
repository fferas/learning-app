"use client";

import { useState, useRef, useEffect } from "react";
import { LearningModuleProps } from "@/domain/types";

const questions = [
  {
    sentence: "The cat sits on the mat.",
    options: [
      { emoji: "🐱", label: "Cat on mat", correct: true },
      { emoji: "🐶", label: "Dog in box", correct: false },
      { emoji: "🐟", label: "Fish in bowl", correct: false },
    ],
  },
  {
    sentence: "The dog runs in the park.",
    options: [
      { emoji: "🏠", label: "Dog in house", correct: false },
      { emoji: "🐶", label: "Dog running", correct: true },
      { emoji: "🐱", label: "Cat sitting", correct: false },
    ],
  },
  {
    sentence: "A red bird sits on a tree.",
    options: [
      { emoji: "🐦", label: "Bird on tree", correct: true },
      { emoji: "🦋", label: "Butterfly on flower", correct: false },
      { emoji: "🐸", label: "Frog on lily pad", correct: false },
    ],
  },
  {
    sentence: "The sun shines on the flowers.",
    options: [
      { emoji: "🌧️", label: "Rain on flowers", correct: false },
      { emoji: "🌻", label: "Flowers with sun", correct: true },
      { emoji: "❄️", label: "Snow on ground", correct: false },
    ],
  },
  {
    sentence: "A fish swims in the blue sea.",
    options: [
      { emoji: "🐟", label: "Fish in sea", correct: true },
      { emoji: "🐢", label: "Turtle on sand", correct: false },
      { emoji: "🦀", label: "Crab on beach", correct: false },
    ],
  },
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function SentencePictureMatch({
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

  function handlePick(correct: boolean) {
    const newQAttempts = questionAttempts + 1;
    setQuestionAttempts(newQAttempts);
    setAttempts((a) => a + 1);

    if (correct) {
      if (newQAttempts === 1) setCorrectFirst((c) => c + 1);
      setFeedback(`Great reading! That's the right picture! ✓`);
      setFeedbackType("correct");

      setTimeout(() => {
        const next = current + 1;
        if (next >= queue.length) {
          onComplete({
            correctFirstTry: correctFirst + (newQAttempts === 1 ? 1 : 0) === queue.length,
            attempts: attempts + 1,
            responseTimeMs: Date.now() - startTimeRef.current,
            hintsUsed,
            errorTags,
          });
        } else {
          setCurrent(next);
          setFeedback("");
          setFeedbackType("");
          setQuestionAttempts(0);
        }
      }, 1300);
    } else {
      const newErrors = [...errorTags];
      if (!newErrors.includes("guesses_from_first_word"))
        newErrors.push("guesses_from_first_word");
      if (!newErrors.includes("misses_key_detail"))
        newErrors.push("misses_key_detail");
      setErrorTags(newErrors);
      setFeedbackType("wrong");

      if (newQAttempts >= 2) {
        setHintsUsed((h) => h + 1);
        setFeedback("Read every word carefully. Which picture matches all the words?");
        setTimeout(() => {
          const next = current + 1;
          if (next >= queue.length) {
            onComplete({
              correctFirstTry: false,
              attempts: attempts + 1,
              responseTimeMs: Date.now() - startTimeRef.current,
              hintsUsed: hintsUsed + 1,
              errorTags: newErrors,
            });
          } else {
            setCurrent(next);
            setFeedback("");
            setFeedbackType("");
            setQuestionAttempts(0);
          }
        }, 2000);
      } else {
        setFeedback("Read again carefully and try another picture.");
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

      <div className="bg-blue-50 rounded-2xl px-6 py-4 text-center max-w-xs">
        <p className="text-xl font-bold text-gray-700">{q.sentence}</p>
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

      <div className="flex gap-4 flex-wrap justify-center">
        {q.options.map((opt) => (
          <button
            key={opt.label}
            onClick={() => handlePick(opt.correct)}
            data-testid={`sentence-choice-${opt.label.replace(/\s/g, "-")}`}
            className="flex flex-col items-center gap-2 bg-white rounded-2xl p-5 shadow hover:shadow-md transition-shadow border-2 border-gray-100 hover:border-blue-300 min-w-[7rem] focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label={opt.label}
          >
            <span className="text-5xl">{opt.emoji}</span>
            <span className="text-xs font-semibold text-gray-500">
              {opt.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
