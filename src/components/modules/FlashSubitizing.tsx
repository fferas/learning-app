"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { LearningModuleProps } from "@/domain/types";
import { Button } from "@/components/ui/Button";

function generateDotArray(count: number) {
  return Array.from({ length: count }, (_, i) => i);
}

function DotGrid({ count }: { count: number }) {
  const dots = generateDotArray(count);
  return (
    <div
      className="flex flex-wrap gap-3 justify-center items-center w-40 h-40 bg-blue-50 rounded-2xl p-4"
      aria-hidden="true"
    >
      {dots.map((i) => (
        <div
          key={i}
          className="w-8 h-8 bg-blue-500 rounded-full"
        />
      ))}
    </div>
  );
}

export default function FlashSubitizing({
  learner,
  objective,
  difficulty,
  onComplete,
}: LearningModuleProps) {
  const maxNum = learner.defaultPhase === "phase_1" ? 5 : 7;
  const flashMs = Math.max(800, 2000 - difficulty * 250);

  const [targetCount, setTargetCount] = useState(0);
  const [phase, setPhase] = useState<"flash" | "choose" | "feedback">("flash");
  const [attempts, setAttempts] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [errorTags, setErrorTags] = useState<string[]>([]);
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const startTimeRef = useRef<number>(0);
  useEffect(() => { startTimeRef.current = Date.now(); }, []);

  const newRound = useCallback(() => {
    const count = Math.floor(Math.random() * (maxNum + 1));
    setTargetCount(count);
    setPhase("flash");
  }, [maxNum]);

  useEffect(() => {
    newRound();
  }, [newRound]);

  useEffect(() => {
    if (phase === "flash") {
      const timer = setTimeout(() => setPhase("choose"), flashMs);
      return () => clearTimeout(timer);
    }
  }, [phase, flashMs]);

  const options = Array.from({ length: maxNum + 1 }, (_, i) => i);

  function handleChoice(num: number) {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (num === targetCount) {
      const isFirst = attempts === 0;
      setFeedbackMsg(isFirst ? "Great job! You got it! ✓" : "Well done! ✓");
      setPhase("feedback");

      setTimeout(() => {
        onComplete({
          correctFirstTry: isFirst,
          attempts: newAttempts,
          responseTimeMs: Date.now() - startTimeRef.current,
          hintsUsed,
          errorTags,
        });
      }, 1200);
    } else {
      const newErrors = [...errorTags];
      if (!newErrors.includes("counts_instead_of_subitizes")) {
        newErrors.push("counts_instead_of_subitizes");
      }
      if (Math.abs(num - targetCount) > 1) {
        if (!newErrors.includes("quantity_numeral_mismatch")) {
          newErrors.push("quantity_numeral_mismatch");
        }
      }
      setErrorTags(newErrors);

      if (newAttempts >= 2) {
        setHintsUsed((h) => h + 1);
        setFeedbackMsg(`The answer was ${targetCount}. Let's try again!`);
        setPhase("feedback");
        setTimeout(() => newRound(), 1800);
        setAttempts(0);
      } else {
        setFeedbackMsg("Try again! Think about what you saw.");
      }
    }
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-lg font-bold text-gray-700 text-center">
        {objective.childFriendlyGoal}
      </p>

      {phase === "flash" && (
        <div className="flex flex-col items-center gap-4">
          <p className="text-blue-600 font-semibold">Look carefully!</p>
          <DotGrid count={targetCount} />
        </div>
      )}

      {phase === "choose" && (
        <div className="flex flex-col items-center gap-4">
          <p className="text-gray-600 font-semibold">How many dots did you see?</p>
          {feedbackMsg && (
            <p
              className="text-amber-600 font-semibold text-center"
              aria-live="polite"
            >
              {feedbackMsg}
            </p>
          )}
          <div className="grid grid-cols-3 gap-3 mt-2">
            {options.map((num) => (
              <Button
                key={num}
                size="xl"
                variant="ghost"
                onClick={() => handleChoice(num)}
                data-testid={`choice-${num}`}
                className="text-2xl font-bold min-w-[4rem]"
              >
                {num}
              </Button>
            ))}
          </div>
        </div>
      )}

      {phase === "feedback" && (
        <div
          className="flex flex-col items-center gap-4"
          aria-live="polite"
        >
          <p className="text-2xl font-bold text-emerald-600">{feedbackMsg}</p>
        </div>
      )}
    </div>
  );
}
