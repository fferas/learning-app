"use client";

import { useState, useRef, useEffect } from "react";
import { LearningModuleProps } from "@/domain/types";

type Bin = "Paper" | "Glass" | "Plastic" | "Food" | "Landfill";

const items: { label: string; emoji: string; bin: Bin }[] = [
  { label: "Newspaper", emoji: "📰", bin: "Paper" },
  { label: "Glass bottle", emoji: "🍶", bin: "Glass" },
  { label: "Banana peel", emoji: "🍌", bin: "Food" },
  { label: "Plastic bag", emoji: "🛍️", bin: "Landfill" },
  { label: "Cardboard box", emoji: "📦", bin: "Paper" },
  { label: "Plastic bottle", emoji: "🥤", bin: "Plastic" },
  { label: "Apple core", emoji: "🍎", bin: "Food" },
  { label: "Jam jar", emoji: "🫙", bin: "Glass" },
  { label: "Crisp packet", emoji: "🍿", bin: "Landfill" },
  { label: "Tin can", emoji: "🥫", bin: "Glass" },
  { label: "Magazine", emoji: "📓", bin: "Paper" },
  { label: "Plastic cup", emoji: "🥛", bin: "Plastic" },
];

const bins: { name: Bin; emoji: string; color: string }[] = [
  { name: "Paper", emoji: "📄", color: "bg-blue-100 border-blue-400" },
  { name: "Glass", emoji: "🍶", color: "bg-green-100 border-green-400" },
  { name: "Plastic", emoji: "🥤", color: "bg-yellow-100 border-yellow-400" },
  { name: "Food", emoji: "🥬", color: "bg-amber-100 border-amber-400" },
  { name: "Landfill", emoji: "🗑️", color: "bg-gray-100 border-gray-400" },
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function RecyclingSort({
  objective,
  onComplete,
}: LearningModuleProps) {
  const [queue] = useState(() => shuffle(items).slice(0, 6));
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

  const item = queue[current];

  function handleSort(bin: Bin) {
    const correct = bin === item.bin;
    const newQAttempts = questionAttempts + 1;
    setQuestionAttempts(newQAttempts);
    setAttempts((a) => a + 1);

    if (correct) {
      if (newQAttempts === 1) setCorrectFirst((c) => c + 1);
      setFeedback(`${item.label} goes in the ${bin} bin! ✓`);
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
      }, 1200);
    } else {
      const newErrors = [...errorTags];
      if (!newErrors.includes("material_category_confusion"))
        newErrors.push("material_category_confusion");
      setErrorTags(newErrors);
      setFeedbackType("wrong");

      if (newQAttempts >= 2) {
        setHintsUsed((h) => h + 1);
        setFeedback(
          `Hint: ${item.label} is made of ${item.bin === "Landfill" ? "mixed materials and cannot be recycled" : item.bin.toLowerCase()}!`
        );
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
        setFeedback("Try again! What is it made of?");
      }
    }
  }

  return (
    <div className="flex flex-col items-center gap-5">
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

      <div className="flex flex-col items-center gap-2 bg-amber-50 rounded-2xl p-6">
        <span className="text-6xl">{item.emoji}</span>
        <span className="text-xl font-bold text-gray-700">{item.label}</span>
      </div>

      <p className="text-gray-600 font-semibold">Which bin does this go in?</p>

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

      <div className="grid grid-cols-3 gap-3">
        {bins.map((bin) => (
          <button
            key={bin.name}
            onClick={() => handleSort(bin.name)}
            data-testid={`recycle-bin-${bin.name}`}
            className={`flex flex-col items-center gap-1 p-3 rounded-2xl border-2 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 hover:scale-105 ${bin.color}`}
            aria-label={`${bin.name} bin`}
          >
            <span className="text-3xl">{bin.emoji}</span>
            <span className="text-xs font-bold text-gray-600">{bin.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
