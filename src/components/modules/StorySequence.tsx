"use client";

import { useState, useRef, useEffect } from "react";
import { LearningModuleProps } from "@/domain/types";
import { Button } from "@/components/ui/Button";

type StoryCard = { emoji: string; label: string; order: number };

const stories = [
  {
    title: "Growing a Plant",
    cards: [
      { emoji: "🌱", label: "Plant a seed", order: 1 },
      { emoji: "💧", label: "Water it", order: 2 },
      { emoji: "🌿", label: "Sprout appears", order: 3 },
      { emoji: "🌻", label: "Flower blooms", order: 4 },
    ],
  },
  {
    title: "Making a Sandwich",
    cards: [
      { emoji: "🍞", label: "Get the bread", order: 1 },
      { emoji: "🧈", label: "Spread butter", order: 2 },
      { emoji: "🥗", label: "Add filling", order: 3 },
      { emoji: "😋", label: "Eat the sandwich", order: 4 },
    ],
  },
  {
    title: "Washing Hands",
    cards: [
      { emoji: "🚰", label: "Turn on tap", order: 1 },
      { emoji: "🧼", label: "Use soap", order: 2 },
      { emoji: "👐", label: "Rub hands", order: 3 },
      { emoji: "🏁", label: "Dry hands", order: 4 },
    ],
  },
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function StorySequence({
  objective,
  onComplete,
}: LearningModuleProps) {
  const [story] = useState(() => stories[Math.floor(Math.random() * stories.length)]);
  const [arranged, setArranged] = useState<(StoryCard | null)[]>([
    null,
    null,
    null,
    null,
  ]);
  const [pool, setPool] = useState(() => shuffle(story.cards));
  const [attempts, setAttempts] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [errorTags, setErrorTags] = useState<string[]>([]);
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState<"correct" | "wrong" | "">("");
  const startTimeRef = useRef<number>(0);
  useEffect(() => { startTimeRef.current = Date.now(); }, []);
  const [selected, setSelected] = useState<StoryCard | null>(null);

  function handlePoolSelect(card: StoryCard) {
    setSelected(card);
    setFeedback("");
  }

  function handleSlotClick(slotIdx: number) {
    if (!selected) return;

    const newArranged = [...arranged];
    const newPool = [...pool];

    // If slot is occupied, return current card to pool
    if (newArranged[slotIdx]) {
      newPool.push(newArranged[slotIdx]!);
    }

    // Remove selected from pool
    const poolIdx = newPool.findIndex((c) => c.label === selected.label);
    if (poolIdx !== -1) newPool.splice(poolIdx, 1);

    newArranged[slotIdx] = selected;
    setArranged(newArranged);
    setPool(newPool);
    setSelected(null);
  }

  function handleCheck() {
    setAttempts((a) => a + 1);
    const allFilled = arranged.every((c) => c !== null);
    if (!allFilled) {
      setFeedback("Place all the pictures first!");
      setFeedbackType("wrong");
      return;
    }

    const correct = arranged.every((c, i) => c?.order === i + 1);

    if (correct) {
      setFeedback("Brilliant! You got the story in order! ✓");
      setFeedbackType("correct");
      setTimeout(() => {
        onComplete({
          correctFirstTry: attempts === 0,
          attempts: attempts + 1,
          responseTimeMs: Date.now() - startTimeRef.current,
          hintsUsed,
          errorTags,
        });
      }, 1500);
    } else {
      const newErrors = [...errorTags];
      if (!newErrors.includes("sequence_beginning_middle_end_confusion"))
        newErrors.push("sequence_beginning_middle_end_confusion");
      setErrorTags(newErrors);
      setFeedbackType("wrong");

      if (attempts >= 1) {
        setHintsUsed((h) => h + 1);
        setFeedback(
          `Hint: think about what happens first in "${story.title}". Try again!`
        );
      } else {
        setFeedback("Not quite! Think about the order. Try again!");
      }
    }
  }

  return (
    <div className="flex flex-col items-center gap-5">
      <p className="text-lg font-bold text-gray-700 text-center">
        {objective.childFriendlyGoal}
      </p>
      <p className="text-blue-600 font-semibold">{story.title}</p>

      <p className="text-gray-500 text-sm">
        Tap a picture, then tap a slot to place it.
      </p>

      {/* Pool */}
      <div className="flex gap-3 flex-wrap justify-center">
        {pool.map((card) => (
          <button
            key={card.label}
            onClick={() => handlePoolSelect(card)}
            data-testid={`story-pool-${card.order}`}
            className={`flex flex-col items-center gap-1 p-3 rounded-2xl border-2 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400
              ${selected?.label === card.label
                ? "border-blue-500 bg-blue-50 shadow-lg"
                : "border-gray-200 bg-white hover:border-blue-300"
              }`}
            aria-label={card.label}
          >
            <span className="text-4xl">{card.emoji}</span>
            <span className="text-xs font-semibold text-gray-500">
              {card.label}
            </span>
          </button>
        ))}
      </div>

      {/* Slots */}
      <div className="flex gap-3 flex-wrap justify-center">
        {arranged.map((card, i) => (
          <button
            key={i}
            onClick={() => handleSlotClick(i)}
            data-testid={`story-slot-${i + 1}`}
            className={`flex flex-col items-center gap-1 p-3 rounded-2xl border-2 min-w-[5rem] min-h-[6rem] transition-all focus:outline-none focus:ring-2 focus:ring-green-400
              ${card
                ? "border-green-400 bg-green-50"
                : selected
                ? "border-dashed border-blue-400 bg-blue-50"
                : "border-dashed border-gray-300 bg-gray-50"
              }`}
            aria-label={`Slot ${i + 1}: ${card ? card.label : "empty"}`}
          >
            <span className="text-xs font-bold text-gray-400 mb-1">
              {i + 1}
            </span>
            {card ? (
              <>
                <span className="text-4xl">{card.emoji}</span>
                <span className="text-xs font-semibold text-gray-600">
                  {card.label}
                </span>
              </>
            ) : (
              <span className="text-3xl text-gray-200">?</span>
            )}
          </button>
        ))}
      </div>

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

      <Button
        size="lg"
        variant="primary"
        onClick={handleCheck}
        data-testid="story-check"
      >
        Check Order ✓
      </Button>
    </div>
  );
}
