"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { LearningModuleProps } from "@/domain/types";
import { Button } from "@/components/ui/Button";

const objectEmojis = ["🍎", "⭐", "🐸", "🦋", "🍪", "🌸", "🚗", "🎈"];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function DragCountCardinality({
  learner,
  objective,
  difficulty,
  onComplete,
}: LearningModuleProps) {
  const maxCount = learner.defaultPhase === "phase_1" ? 10 : 20;
  const minCount = difficulty <= 2 ? 1 : difficulty <= 4 ? 5 : 10;

  const [targetCount] = useState(
    () => Math.floor(Math.random() * (Math.min(maxCount, minCount + 8) - minCount + 1)) + minCount
  );
  const [emoji] = useState(() => shuffle(objectEmojis)[0]);
  const [attempts, setAttempts] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [errorTags, setErrorTags] = useState<string[]>([]);
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState<"correct" | "wrong" | "">("");
  const startTimeRef = useRef<number>(0);
  useEffect(() => { startTimeRef.current = Date.now(); }, []);
  const [done, setDone] = useState(false);

  const optionBase = Math.max(0, targetCount - 2);
  const options = Array.from({ length: 5 }, (_, i) => optionBase + i).filter(
    (n) => n >= 0
  );

  const handleChoice = useCallback(
    (num: number) => {
      if (done) return;
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (num === targetCount) {
        setFeedback(
          newAttempts === 1 ? "Brilliant! You counted them all! ✓" : "Well done! ✓"
        );
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
        if (num > targetCount) {
          if (!newErrors.includes("double_counts_object"))
            newErrors.push("double_counts_object");
        } else {
          if (!newErrors.includes("skips_object_when_counting"))
            newErrors.push("skips_object_when_counting");
        }
        setErrorTags(newErrors);

        if (newAttempts >= 2) {
          setHintsUsed((h) => h + 1);
          setFeedback(`Hint: count slowly, touching each one. There are ${targetCount}.`);
          setFeedbackType("wrong");
          setTimeout(() => {
            onComplete({
              correctFirstTry: false,
              attempts: newAttempts,
              responseTimeMs: Date.now() - startTimeRef.current,
              hintsUsed: hintsUsed + 1,
              errorTags: newErrors,
            });
          }, 2000);
          setDone(true);
        } else {
          setFeedback("Try again! Count each one carefully.");
          setFeedbackType("wrong");
        }
      }
    },
    [done, attempts, targetCount, hintsUsed, errorTags, onComplete]
  );

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-lg font-bold text-gray-700 text-center">
        {objective.childFriendlyGoal}
      </p>

      <div className="flex flex-wrap gap-3 justify-center bg-amber-50 rounded-2xl p-6 max-w-xs">
        {Array.from({ length: targetCount }).map((_, i) => (
          <span key={i} className="text-3xl" role="img" aria-label={emoji}>
            {emoji}
          </span>
        ))}
      </div>

      <p className="text-gray-600 font-semibold">How many are there?</p>

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
        {options.map((num) => (
          <Button
            key={num}
            size="xl"
            variant="ghost"
            onClick={() => handleChoice(num)}
            disabled={done}
            data-testid={`count-choice-${num}`}
            className="text-2xl font-bold min-w-[4rem]"
          >
            {num}
          </Button>
        ))}
      </div>
    </div>
  );
}
