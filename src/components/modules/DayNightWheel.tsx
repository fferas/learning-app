"use client";

import { useState, useRef, useEffect } from "react";
import { LearningModuleProps } from "@/domain/types";
import { Button } from "@/components/ui/Button";

const activities = [
  { label: "Wake up", emoji: "⏰", time: "Day" },
  { label: "Eat breakfast", emoji: "🥣", time: "Day" },
  { label: "Go to school", emoji: "🏫", time: "Day" },
  { label: "Play outside", emoji: "⚽", time: "Day" },
  { label: "See the sun", emoji: "☀️", time: "Day" },
  { label: "Lunch time", emoji: "🍱", time: "Day" },
  { label: "Sleep in bed", emoji: "😴", time: "Night" },
  { label: "See the moon", emoji: "🌙", time: "Night" },
  { label: "Look at stars", emoji: "⭐", time: "Night" },
  { label: "Read bedtime story", emoji: "📖", time: "Night" },
  { label: "Turn off lights", emoji: "💡", time: "Night" },
  { label: "Dream", emoji: "💭", time: "Night" },
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function DayNightWheel({
  objective,
  onComplete,
}: LearningModuleProps) {
  const [queue] = useState(() => shuffle(activities).slice(0, 6));
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

  const activity = queue[current];

  function handleSort(choice: string) {
    const correct = choice === activity.time;
    const newQAttempts = questionAttempts + 1;
    setQuestionAttempts(newQAttempts);
    setAttempts((a) => a + 1);

    if (correct) {
      if (newQAttempts === 1) setCorrectFirst((c) => c + 1);
      setFeedback(
        `Yes! We ${activity.label.toLowerCase()} during the ${activity.time.toLowerCase()}! ✓`
      );
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
      if (!newErrors.includes("day_night_activity_mismatch"))
        newErrors.push("day_night_activity_mismatch");
      setErrorTags(newErrors);
      setFeedbackType("wrong");

      if (newQAttempts >= 2) {
        setHintsUsed((h) => h + 1);
        setFeedback(
          `Hint: we ${activity.label.toLowerCase()} when it is ${activity.time === "Day" ? "sunny" : "dark"}!`
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
        setFeedback("Try again! Does this happen in the day or at night?");
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

      <div className="flex flex-col items-center gap-2 bg-amber-50 rounded-2xl p-8">
        <span className="text-6xl">{activity.emoji}</span>
        <span className="text-xl font-bold text-gray-700">{activity.label}</span>
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
          variant="primary"
          onClick={() => handleSort("Day")}
          data-testid="time-choice-day"
        >
          ☀️ Day
        </Button>
        <Button
          size="lg"
          variant="ghost"
          onClick={() => handleSort("Night")}
          data-testid="time-choice-night"
        >
          🌙 Night
        </Button>
      </div>

      <p className="text-xs text-gray-400">
        {current + 1} of {queue.length}
      </p>
    </div>
  );
}
