"use client";

import { useState, useRef, useEffect } from "react";
import { LearningModuleProps } from "@/domain/types";
import { Button } from "@/components/ui/Button";

type Stage = { emoji: string; label: string; order: number };

const lifeCycles: { name: string; stages: Stage[] }[] = [
  {
    name: "Butterfly",
    stages: [
      { emoji: "🥚", label: "Egg", order: 1 },
      { emoji: "🐛", label: "Caterpillar", order: 2 },
      { emoji: "🫘", label: "Chrysalis", order: 3 },
      { emoji: "🦋", label: "Butterfly", order: 4 },
    ],
  },
  {
    name: "Frog",
    stages: [
      { emoji: "🥚", label: "Egg", order: 1 },
      { emoji: "🐟", label: "Tadpole", order: 2 },
      { emoji: "🐸", label: "Froglet", order: 3 },
      { emoji: "🐊", label: "Frog", order: 4 },
    ],
  },
  {
    name: "Plant",
    stages: [
      { emoji: "🌱", label: "Seed", order: 1 },
      { emoji: "🌿", label: "Sprout", order: 2 },
      { emoji: "🌳", label: "Young plant", order: 3 },
      { emoji: "🌻", label: "Flower", order: 4 },
    ],
  },
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function LifeCycleSequence({
  objective,
  onComplete,
}: LearningModuleProps) {
  const [cycle] = useState(
    () => lifeCycles[Math.floor(Math.random() * lifeCycles.length)]
  );
  const [pool, setPool] = useState(() => shuffle(cycle.stages));
  const [arranged, setArranged] = useState<(Stage | null)[]>([
    null,
    null,
    null,
    null,
  ]);
  const [selected, setSelected] = useState<Stage | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [errorTags, setErrorTags] = useState<string[]>([]);
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState<"correct" | "wrong" | "">("");
  const startTimeRef = useRef<number>(0);
  useEffect(() => { startTimeRef.current = Date.now(); }, []);

  function handlePoolSelect(stage: Stage) {
    setSelected(stage);
    setFeedback("");
  }

  function handleSlotClick(i: number) {
    if (!selected) return;
    const newArranged = [...arranged];
    const newPool = [...pool];

    if (newArranged[i]) {
      newPool.push(newArranged[i]!);
    }

    const poolIdx = newPool.findIndex((s) => s.label === selected.label);
    if (poolIdx !== -1) newPool.splice(poolIdx, 1);

    newArranged[i] = selected;
    setArranged(newArranged);
    setPool(newPool);
    setSelected(null);
  }

  function handleCheck() {
    setAttempts((a) => a + 1);
    const allFilled = arranged.every((s) => s !== null);
    if (!allFilled) {
      setFeedback("Place all the stages first!");
      setFeedbackType("wrong");
      return;
    }

    const correct = arranged.every((s, i) => s?.order === i + 1);

    if (correct) {
      setFeedback(`Amazing! You know the ${cycle.name} life cycle! ✓`);
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
      if (!newErrors.includes("life_cycle_order_confusion"))
        newErrors.push("life_cycle_order_confusion");
      setErrorTags(newErrors);
      setFeedbackType("wrong");

      if (attempts >= 1) {
        setHintsUsed((h) => h + 1);
        setFeedback(
          `Hint: the ${cycle.name} life cycle starts with an egg! Try rearranging.`
        );
      } else {
        setFeedback("Not quite! Think about what happens first. Try again!");
      }
    }
  }

  return (
    <div className="flex flex-col items-center gap-5">
      <p className="text-lg font-bold text-gray-700 text-center">
        {objective.childFriendlyGoal}
      </p>
      <p className="text-blue-600 font-semibold">{cycle.name} Life Cycle</p>
      <p className="text-gray-400 text-sm">
        Tap a stage, then tap a slot to place it.
      </p>

      {/* Pool */}
      <div className="flex gap-3 flex-wrap justify-center">
        {pool.map((stage) => (
          <button
            key={stage.label}
            onClick={() => handlePoolSelect(stage)}
            data-testid={`cycle-pool-${stage.order}`}
            className={`flex flex-col items-center gap-1 p-3 rounded-2xl border-2 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400
              ${selected?.label === stage.label
                ? "border-blue-500 bg-blue-50 shadow-lg"
                : "border-gray-200 bg-white hover:border-blue-300"
              }`}
          >
            <span className="text-4xl">{stage.emoji}</span>
            <span className="text-xs font-semibold text-gray-500">
              {stage.label}
            </span>
          </button>
        ))}
      </div>

      {/* Slots */}
      <div className="flex gap-3 flex-wrap justify-center">
        {arranged.map((stage, i) => (
          <button
            key={i}
            onClick={() => handleSlotClick(i)}
            data-testid={`cycle-slot-${i + 1}`}
            className={`flex flex-col items-center gap-1 p-3 rounded-2xl border-2 min-w-[5rem] min-h-[6rem] transition-all focus:outline-none focus:ring-2 focus:ring-green-400
              ${stage
                ? "border-green-400 bg-green-50"
                : selected
                ? "border-dashed border-blue-400 bg-blue-50"
                : "border-dashed border-gray-300 bg-gray-50"
              }`}
            aria-label={`Stage ${i + 1}: ${stage ? stage.label : "empty"}`}
          >
            <span className="text-xs font-bold text-gray-400 mb-1">
              {i + 1}
            </span>
            {stage ? (
              <>
                <span className="text-4xl">{stage.emoji}</span>
                <span className="text-xs font-semibold text-gray-600">
                  {stage.label}
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
        data-testid="cycle-check"
      >
        Check Order ✓
      </Button>
    </div>
  );
}
