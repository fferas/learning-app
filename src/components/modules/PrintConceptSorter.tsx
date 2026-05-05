"use client";

import { useState, useRef, useEffect } from "react";
import { LearningModuleProps } from "@/domain/types";
import { Button } from "@/components/ui/Button";

type PrintCategory = "Letter" | "Number" | "Word" | "Picture";

const items: { display: string; category: PrintCategory; description: string }[] = [
  { display: "A", category: "Letter", description: "the letter A" },
  { display: "3", category: "Number", description: "the number 3" },
  { display: "CAT", category: "Word", description: "the word CAT" },
  { display: "🌸", category: "Picture", description: "a picture of a flower" },
  { display: "B", category: "Letter", description: "the letter B" },
  { display: "7", category: "Number", description: "the number 7" },
  { display: "DOG", category: "Word", description: "the word DOG" },
  { display: "🚗", category: "Picture", description: "a picture of a car" },
  { display: "M", category: "Letter", description: "the letter M" },
  { display: "5", category: "Number", description: "the number 5" },
  { display: "SUN", category: "Word", description: "the word SUN" },
  { display: "⭐", category: "Picture", description: "a picture of a star" },
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

const categories: PrintCategory[] = ["Letter", "Number", "Word", "Picture"];

export default function PrintConceptSorter({
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

  function handleSort(cat: PrintCategory) {
    const correct = cat === item.category;
    const newQAttempts = questionAttempts + 1;
    setQuestionAttempts(newQAttempts);
    setAttempts((a) => a + 1);

    if (correct) {
      if (newQAttempts === 1) setCorrectFirst((c) => c + 1);
      setFeedback(`Yes! "${item.display}" is a ${item.category}! ✓`);
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
      setFeedback(`Try again! Is it a letter, number, word, or picture?`);
      setFeedbackType("wrong");
      setErrorTags((prev) =>
        prev.includes("print_concept_confusion")
          ? prev
          : [...prev, "print_concept_confusion"]
      );

      if (newQAttempts >= 2) {
        setHintsUsed((h) => h + 1);
        setFeedback(`Hint: this is ${item.description}.`);
        setTimeout(() => {
          const next = current + 1;
          if (next >= queue.length) {
            onComplete({
              correctFirstTry: false,
              attempts: attempts + 1,
              responseTimeMs: Date.now() - startTimeRef.current,
              hintsUsed: hintsUsed + 1,
              errorTags,
            });
          } else {
            setCurrent(next);
            setFeedback("");
            setFeedbackType("");
            setQuestionAttempts(0);
          }
        }, 2000);
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

      <div className="bg-amber-50 rounded-2xl p-8 flex items-center justify-center min-h-[8rem]">
        <span className="text-5xl font-bold text-gray-700">{item.display}</span>
      </div>

      <p className="text-gray-600 font-semibold">What is this?</p>

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

      <div className="grid grid-cols-2 gap-3">
        {categories.map((cat) => (
          <Button
            key={cat}
            size="lg"
            variant="ghost"
            onClick={() => handleSort(cat)}
            data-testid={`print-choice-${cat}`}
          >
            {cat}
          </Button>
        ))}
      </div>
    </div>
  );
}
