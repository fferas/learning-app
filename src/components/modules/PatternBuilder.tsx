"use client";

import { useState, useRef, useEffect } from "react";
import { LearningModuleProps } from "@/domain/types";
import { Button } from "@/components/ui/Button";

type PatternItem = { label: string; emoji: string };

const shapeSets: PatternItem[] = [
  { label: "circle", emoji: "🔵" },
  { label: "square", emoji: "🟥" },
  { label: "star", emoji: "⭐" },
  { label: "triangle", emoji: "🔺" },
];

const numberPatterns = [
  { sequence: [2, 4, 6, 8], answer: 10, label: "Skip count by 2s" },
  { sequence: [5, 10, 15, 20], answer: 25, label: "Skip count by 5s" },
  { sequence: [10, 20, 30, 40], answer: 50, label: "Skip count by 10s" },
  { sequence: [3, 6, 9, 12], answer: 15, label: "Count by 3s" },
  { sequence: [4, 8, 12, 16], answer: 20, label: "Count by 4s" },
];

function generateShapePattern(phase: string) {
  const [a, b] = shapeSets.slice(0, 2);
  const type = Math.random() > 0.5 ? "AB" : "AAB";
  let sequence: PatternItem[];
  let answer: PatternItem;

  if (type === "AB") {
    sequence = [a, b, a, b, a];
    answer = b;
  } else {
    sequence = [a, a, b, a, a];
    answer = b;
  }

  if (phase === "phase_2") {
    return null; // use number patterns for phase 2
  }

  return {
    shown: sequence,
    answer,
    options: shapeSets.slice(0, 4),
    isNumber: false,
  };
}

export default function PatternBuilder({
  learner,
  objective,
  onComplete,
}: LearningModuleProps) {
  const isPhase2 = learner.defaultPhase === "phase_2";

  const [pattern] = useState(() => {
    if (isPhase2) {
      const p = numberPatterns[Math.floor(Math.random() * numberPatterns.length)];
      return {
        isNumber: true,
        sequence: p.sequence,
        answer: p.answer,
        options: [p.answer - 2, p.answer, p.answer + 2, p.answer + 5].sort(
          () => Math.random() - 0.5
        ),
        label: p.label,
      };
    } else {
      const shape = generateShapePattern("phase_1");
      return shape!;
    }
  });

  const [attempts, setAttempts] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [errorTags, setErrorTags] = useState<string[]>([]);
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState<"correct" | "wrong" | "">("");
  const startTimeRef = useRef<number>(0);
  useEffect(() => { startTimeRef.current = Date.now(); }, []);
  const [done, setDone] = useState(false);

  function handleChoice(choice: PatternItem | number) {
    if (done) return;
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    const isCorrect = pattern.isNumber
      ? choice === pattern.answer
      : (choice as PatternItem).label === (pattern.answer as PatternItem).label;

    if (isCorrect) {
      setFeedback(newAttempts === 1 ? "You got it! Great pattern thinking! ✓" : "Well done! ✓");
      setFeedbackType("correct");
      setDone(true);
      setTimeout(() => {
        onComplete({
          correctFirstTry: newAttempts === 1,
          attempts: newAttempts,
          responseTimeMs: Date.now() - startTimeRef.current,
          hintsUsed,
          errorTags,
        });
      }, 1200);
    } else {
      const newErrors = [...errorTags];
      if (!newErrors.includes("copies_last_item_only")) {
        newErrors.push("copies_last_item_only");
      }
      if (pattern.isNumber && !newErrors.includes("skip_count_sequence_error")) {
        newErrors.push("skip_count_sequence_error");
      }
      setErrorTags(newErrors);
      setFeedbackType("wrong");

      if (newAttempts >= 2) {
        setHintsUsed((h) => h + 1);
        setFeedback(
          pattern.isNumber
            ? `Hint: find the gap between numbers. The answer is ${pattern.answer}.`
            : `Hint: look at what repeats in the pattern!`
        );
        setDone(true);
        setTimeout(() => {
          onComplete({
            correctFirstTry: false,
            attempts: newAttempts,
            responseTimeMs: Date.now() - startTimeRef.current,
            hintsUsed: hintsUsed + 1,
            errorTags: newErrors,
          });
        }, 2000);
      } else {
        setFeedback("Try again! Look at the pattern carefully.");
      }
    }
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-lg font-bold text-gray-700 text-center">
        {objective.childFriendlyGoal}
      </p>

      {pattern.isNumber ? (
        <div className="flex items-center gap-3 flex-wrap justify-center">
          {((pattern as { isNumber: true; sequence: number[] }).sequence).map((n, i) => (
            <span
              key={i}
              className="text-3xl font-bold bg-blue-50 rounded-xl px-4 py-2 text-blue-700"
            >
              {n}
            </span>
          ))}
          <span className="text-3xl font-bold bg-amber-50 rounded-xl px-4 py-2 text-amber-500">
            ?
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {((pattern as { isNumber: false; shown: PatternItem[] }).shown).map((item, i) => (
            <span key={i} className="text-4xl">
              {item.emoji}
            </span>
          ))}
          <span className="text-4xl bg-amber-50 rounded-xl px-3 py-1 text-amber-500 font-bold">
            ?
          </span>
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

      <div className="flex gap-3 flex-wrap justify-center">
        {pattern.isNumber
          ? (pattern.options as number[]).map((n) => (
              <Button
                key={n}
                size="xl"
                variant="ghost"
                onClick={() => handleChoice(n)}
                disabled={done}
                data-testid={`pattern-choice-${n}`}
                className="text-2xl font-bold min-w-[4rem]"
              >
                {n}
              </Button>
            ))
          : (pattern.options as PatternItem[]).map((item) => (
              <Button
                key={item.label}
                size="xl"
                variant="ghost"
                onClick={() => handleChoice(item)}
                disabled={done}
                data-testid={`pattern-choice-${item.label}`}
                className="text-3xl"
              >
                {item.emoji}
              </Button>
            ))}
      </div>
    </div>
  );
}
