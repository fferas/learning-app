"use client";

import { useState, useRef, useEffect } from "react";
import { LearningModuleProps } from "@/domain/types";
import { Button } from "@/components/ui/Button";

type PropertyPair = { a: string; b: string };

const propertyPairs: PropertyPair[] = [
  { a: "Rough", b: "Smooth" },
  { a: "Hard", b: "Soft" },
  { a: "Bendy", b: "Rigid" },
];

const items: { label: string; emoji: string; properties: Record<string, string> }[] = [
  {
    label: "Sandpaper",
    emoji: "📄",
    properties: { "Rough/Smooth": "Rough", "Hard/Soft": "Hard", "Bendy/Rigid": "Bendy" },
  },
  {
    label: "Pillow",
    emoji: "🛏️",
    properties: { "Rough/Smooth": "Smooth", "Hard/Soft": "Soft", "Bendy/Rigid": "Bendy" },
  },
  {
    label: "Stone",
    emoji: "🪨",
    properties: { "Rough/Smooth": "Rough", "Hard/Soft": "Hard", "Bendy/Rigid": "Rigid" },
  },
  {
    label: "Silk cloth",
    emoji: "🧣",
    properties: { "Rough/Smooth": "Smooth", "Hard/Soft": "Soft", "Bendy/Rigid": "Bendy" },
  },
  {
    label: "Rubber band",
    emoji: "🔴",
    properties: { "Rough/Smooth": "Smooth", "Hard/Soft": "Soft", "Bendy/Rigid": "Bendy" },
  },
  {
    label: "Wooden plank",
    emoji: "🪵",
    properties: { "Rough/Smooth": "Rough", "Hard/Soft": "Hard", "Bendy/Rigid": "Rigid" },
  },
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function MaterialLab({
  objective,
  onComplete,
}: LearningModuleProps) {
  const [pair] = useState(
    () => propertyPairs[Math.floor(Math.random() * propertyPairs.length)]
  );
  const [queue] = useState(() => shuffle(items).slice(0, 5));
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

  const propertyKey = `${pair.a}/${pair.b}`;
  const item = queue[current];
  const answer = item.properties[propertyKey];

  function handleSort(choice: string) {
    const correct = choice === answer;
    const newQAttempts = questionAttempts + 1;
    setQuestionAttempts(newQAttempts);
    setAttempts((a) => a + 1);

    if (correct) {
      if (newQAttempts === 1) setCorrectFirst((c) => c + 1);
      setFeedback(`Yes! ${item.label} is ${answer.toLowerCase()}! ✓`);
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
      if (!newErrors.includes("appearance_over_property"))
        newErrors.push("appearance_over_property");
      setErrorTags(newErrors);
      setFeedbackType("wrong");

      if (newQAttempts >= 2) {
        setHintsUsed((h) => h + 1);
        setFeedback(
          `Hint: imagine touching ${item.label.toLowerCase()}. Is it ${pair.a.toLowerCase()} or ${pair.b.toLowerCase()}?`
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
        setFeedback("Try again! Think about how it would feel.");
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

      <div className="bg-amber-50 rounded-2xl p-8 flex flex-col items-center gap-2">
        <span className="text-6xl">{item.emoji}</span>
        <span className="text-xl font-bold text-gray-700">{item.label}</span>
      </div>

      <p className="text-gray-600 font-semibold">
        Is it {pair.a.toLowerCase()} or {pair.b.toLowerCase()}?
      </p>

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
          variant="primary"
          onClick={() => handleSort(pair.a)}
          data-testid={`material-choice-${pair.a}`}
        >
          {pair.a}
        </Button>
        <Button
          size="lg"
          variant="ghost"
          onClick={() => handleSort(pair.b)}
          data-testid={`material-choice-${pair.b}`}
        >
          {pair.b}
        </Button>
      </div>
    </div>
  );
}
