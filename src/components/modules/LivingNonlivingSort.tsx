"use client";

import { useState, useRef, useEffect } from "react";
import { LearningModuleProps } from "@/domain/types";
import { Button } from "@/components/ui/Button";

const items = [
  { label: "Tree", emoji: "🌳", living: true },
  { label: "Rock", emoji: "🪨", living: false },
  { label: "Dog", emoji: "🐶", living: true },
  { label: "Chair", emoji: "🪑", living: false },
  { label: "Flower", emoji: "🌸", living: true },
  { label: "Book", emoji: "📚", living: false },
  { label: "Fish", emoji: "🐟", living: true },
  { label: "Car", emoji: "🚗", living: false },
  { label: "Bird", emoji: "🐦", living: true },
  { label: "Cloud", emoji: "☁️", living: false },
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function LivingNonlivingSort({
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

  function handleSort(isLiving: boolean) {
    const correct = isLiving === item.living;
    const newQAttempts = questionAttempts + 1;
    setQuestionAttempts(newQAttempts);
    setAttempts((a) => a + 1);

    if (correct) {
      if (newQAttempts === 1) {
        setCorrectFirst((c) => c + 1);
        setFeedback(`Yes! A ${item.label.toLowerCase()} is ${item.living ? "living" : "not living"}. ✓`);
      } else {
        setFeedback("Well done! ✓");
      }
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
      if (item.label === "Flower" || item.label === "Tree") {
        if (!newErrors.includes("plants_not_living")) {
          newErrors.push("plants_not_living");
        }
      }
      if (!newErrors.includes("movement_equals_living")) {
        newErrors.push("movement_equals_living");
      }
      setErrorTags(newErrors);
      setFeedbackType("wrong");

      if (newQAttempts >= 2) {
        setHintsUsed((h) => h + 1);
        setFeedback(
          item.living
            ? `Hint: living things grow, need water, and change over time.`
            : `Hint: non-living things don't grow or need food.`
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
        setFeedback("Think again! Does it grow and need food?");
      }
    }
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-lg font-bold text-gray-700 text-center">
        {objective.childFriendlyGoal}
      </p>

      <div className="flex items-center gap-2 text-sm text-blue-500 font-semibold">
        {queue.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full ${i < current ? "bg-green-400" : i === current ? "bg-blue-500" : "bg-gray-200"}`}
          />
        ))}
      </div>

      <div className="flex flex-col items-center gap-3 bg-amber-50 rounded-2xl p-8">
        <span className="text-7xl">{item.emoji}</span>
        <span className="text-2xl font-bold text-gray-700">{item.label}</span>
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
        <Button
          size="lg"
          variant="secondary"
          onClick={() => handleSort(true)}
          data-testid="sort-living"
        >
          Living 🌱
        </Button>
        <Button
          size="lg"
          variant="ghost"
          onClick={() => handleSort(false)}
          data-testid="sort-nonliving"
        >
          Not Living 🪨
        </Button>
      </div>

      <p className="text-xs text-gray-400">
        {current + 1} of {queue.length}
      </p>
    </div>
  );
}
