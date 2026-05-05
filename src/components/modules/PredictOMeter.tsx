"use client";

import { useState, useRef, useEffect } from "react";
import { LearningModuleProps } from "@/domain/types";
import { Button } from "@/components/ui/Button";

type Scenario = {
  question: string;
  emoji: string;
  options: string[];
  correct: number;
  result: string;
};

const scenarios: Scenario[] = [
  {
    question: "What will happen if we add water to a wilting plant?",
    emoji: "🌱",
    options: ["It will droop more", "It will stand up again"],
    correct: 1,
    result:
      "The plant drank the water and stood up straight again! Plants need water to survive.",
  },
  {
    question: "What happens if we put an ice cube in a warm room?",
    emoji: "🧊",
    options: ["It gets bigger", "It melts into water"],
    correct: 1,
    result:
      "The ice melted! Heat changed the solid ice into liquid water.",
  },
  {
    question: "What will a balloon do if we let go of it outside?",
    emoji: "🎈",
    options: ["It flies up", "It stays still"],
    correct: 0,
    result:
      "The balloon flew up! Air inside is lighter than the air outside.",
  },
  {
    question:
      "What happens when we mix yellow and blue paint together?",
    emoji: "🎨",
    options: ["We get red", "We get green"],
    correct: 1,
    result:
      "Yellow and blue make green! Mixing colours creates new colours.",
  },
  {
    question:
      "What happens to a paper boat placed in water?",
    emoji: "🚢",
    options: ["It floats", "It sinks right away"],
    correct: 0,
    result:
      "The paper boat floats! Air trapped inside helps it stay on top of the water.",
  },
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

type Phase = "predict" | "result" | "compare";

export default function PredictOMeter({
  objective,
  onComplete,
}: LearningModuleProps) {
  const [queue] = useState(() => shuffle(scenarios).slice(0, 3));
  const [current, setCurrent] = useState(0);
  const [phase, setPhase] = useState<Phase>("predict");
  const [prediction, setPrediction] = useState<number | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [hintsUsed] = useState(0);
  const [errorTags, setErrorTags] = useState<string[]>([]);
  const startTimeRef = useRef<number>(0);
  useEffect(() => { startTimeRef.current = Date.now(); }, []);

  const scenario = queue[current];

  function handlePredict(idx: number) {
    setPrediction(idx);
    setAttempts((a) => a + 1);
    setPhase("result");
  }

  function handleCompare() {
    const wasCorrect = prediction === scenario.correct;
    if (!wasCorrect) {
      const newErrors = [...errorTags];
      if (!newErrors.includes("prediction_not_evidence_based"))
        newErrors.push("prediction_not_evidence_based");
      setErrorTags(newErrors);
    }

    const next = current + 1;
    if (next >= queue.length) {
      onComplete({
        correctFirstTry: wasCorrect && current === 0,
        attempts: attempts,
        responseTimeMs: Date.now() - startTimeRef.current,
        hintsUsed,
        errorTags,
      });
    } else {
      setCurrent(next);
      setPhase("predict");
      setPrediction(null);
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

      <div className="text-6xl">{scenario.emoji}</div>

      <div className="bg-blue-50 rounded-2xl px-6 py-4 text-center max-w-sm">
        <p className="text-gray-700 font-semibold">{scenario.question}</p>
      </div>

      {phase === "predict" && (
        <>
          <p className="text-blue-600 font-bold">What do you think will happen?</p>
          <div className="flex gap-4 flex-wrap justify-center">
            {scenario.options.map((opt, i) => (
              <Button
                key={opt}
                size="lg"
                variant="primary"
                onClick={() => handlePredict(i)}
                data-testid={`predict-choice-${i}`}
              >
                {opt}
              </Button>
            ))}
          </div>
        </>
      )}

      {phase === "result" && (
        <div className="flex flex-col items-center gap-4">
          <div className="bg-green-50 rounded-2xl p-5 max-w-sm text-center">
            <p className="text-green-700 font-semibold text-sm mb-2">
              What actually happened:
            </p>
            <p className="text-gray-700">{scenario.result}</p>
          </div>

          <div
            className={`rounded-2xl px-4 py-2 text-sm font-semibold ${
              prediction === scenario.correct
                ? "bg-emerald-100 text-emerald-700"
                : "bg-amber-100 text-amber-700"
            }`}
            aria-live="polite"
          >
            {prediction === scenario.correct
              ? "Your prediction matched! Great thinking! ✓"
              : `Your prediction was different — that's OK! Scientists learn from all predictions.`}
          </div>

          <p className="text-xs text-gray-500">
            You predicted: <strong>{scenario.options[prediction!]}</strong>
          </p>

          <Button
            size="lg"
            variant="secondary"
            onClick={handleCompare}
            data-testid="predict-next"
          >
            {current + 1 < queue.length ? "Next Prediction ➜" : "Finish ✓"}
          </Button>
        </div>
      )}
    </div>
  );
}
