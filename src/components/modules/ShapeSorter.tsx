"use client";

import { useState, useRef, useEffect } from "react";
import { LearningModuleProps } from "@/domain/types";
import { Button } from "@/components/ui/Button";

type Shape = { name: string; svg: React.ReactNode; color: string };

const shapes: Shape[] = [
  {
    name: "circle",
    svg: <circle cx="40" cy="40" r="35" />,
    color: "fill-blue-400",
  },
  {
    name: "square",
    svg: <rect x="8" y="8" width="64" height="64" />,
    color: "fill-green-400",
  },
  {
    name: "triangle",
    svg: <polygon points="40,5 75,70 5,70" />,
    color: "fill-amber-400",
  },
  {
    name: "rectangle",
    svg: <rect x="5" y="20" width="70" height="40" />,
    color: "fill-purple-400",
  },
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function ShapeSorter({
  objective,
  onComplete,
}: LearningModuleProps) {
  const [queue] = useState(() => shuffle(shapes).slice(0, 4));
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

  const shape = queue[current];
  const options = shuffle(shapes.map((s) => s.name));

  function handleSort(chosen: string) {
    const correct = chosen === shape.name;
    const newQAttempts = questionAttempts + 1;
    setQuestionAttempts(newQAttempts);
    setAttempts((a) => a + 1);

    if (correct) {
      if (newQAttempts === 1) setCorrectFirst((c) => c + 1);
      setFeedback(`Yes! That's a ${shape.name}! ✓`);
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
      if (!newErrors.includes("property_classification_error"))
        newErrors.push("property_classification_error");
      setErrorTags(newErrors);
      setFeedbackType("wrong");

      if (newQAttempts >= 2) {
        setHintsUsed((h) => h + 1);
        setFeedback(`Hint: look at the edges. It's a ${shape.name}!`);
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
        setFeedback("Try again! Look at the shape carefully.");
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

      <div className="bg-amber-50 rounded-2xl p-8 flex items-center justify-center">
        <svg width="80" height="80" viewBox="0 0 80 80" className={shape.color}>
          {shape.svg}
        </svg>
      </div>

      <p className="text-gray-600 font-semibold">What shape is this?</p>

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

      <div className="grid grid-cols-2 gap-3">
        {options.map((name) => (
          <Button
            key={name}
            size="lg"
            variant="ghost"
            onClick={() => handleSort(name)}
            data-testid={`shape-choice-${name}`}
            className="capitalize"
          >
            {name}
          </Button>
        ))}
      </div>
    </div>
  );
}
