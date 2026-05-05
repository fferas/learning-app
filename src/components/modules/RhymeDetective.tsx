"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { LearningModuleProps } from "@/domain/types";
import { Button } from "@/components/ui/Button";

const rhymePairs = [
  { words: ["cat", "hat"], rhymes: true, emojis: ["🐱", "🎩"] },
  { words: ["dog", "log"], rhymes: true, emojis: ["🐶", "🪵"] },
  { words: ["sun", "fun"], rhymes: true, emojis: ["☀️", "🎉"] },
  { words: ["big", "pig"], rhymes: true, emojis: ["🔵", "🐷"] },
  { words: ["tree", "bee"], rhymes: true, emojis: ["🌳", "🐝"] },
  { words: ["ball", "wall"], rhymes: true, emojis: ["⚽", "🧱"] },
  { words: ["ship", "chip"], rhymes: true, emojis: ["🚢", "🍟"] },
  { words: ["cake", "lake"], rhymes: true, emojis: ["🎂", "🏞️"] },
  { words: ["dog", "cat"], rhymes: false, emojis: ["🐶", "🐱"] },
  { words: ["sun", "moon"], rhymes: false, emojis: ["☀️", "🌙"] },
  { words: ["hat", "dog"], rhymes: false, emojis: ["🎩", "🐶"] },
  { words: ["tree", "rock"], rhymes: false, emojis: ["🌳", "🪨"] },
  { words: ["ball", "fish"], rhymes: false, emojis: ["⚽", "🐟"] },
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function RhymeDetective({
  objective,
  onComplete,
}: LearningModuleProps) {
  const [queue] = useState(() => shuffle(rhymePairs).slice(0, 5));
  const [current, setCurrent] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [totalCorrectFirst, setTotalCorrectFirst] = useState(0);
  const [errorTags, setErrorTags] = useState<string[]>([]);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState<"correct" | "wrong" | "">("");
  const startTimeRef = useRef<number>(0);
  useEffect(() => { startTimeRef.current = Date.now(); }, []);
  const [questionAttempts, setQuestionAttempts] = useState(0);

  const pair = queue[current];

  const advance = useCallback(() => {
    const next = current + 1;
    if (next >= queue.length) {
      onComplete({
        correctFirstTry: totalCorrectFirst === queue.length,
        attempts,
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
  }, [current, queue.length, onComplete, totalCorrectFirst, attempts, hintsUsed, errorTags]);

  function handleAnswer(answer: boolean) {
    const correct = answer === pair.rhymes;
    const newQAttempts = questionAttempts + 1;
    setQuestionAttempts(newQAttempts);
    setAttempts((a) => a + 1);

    if (correct) {
      if (newQAttempts === 1) {
        setTotalCorrectFirst((t) => t + 1);
        setFeedback(`Yes! "${pair.words[0]}" and "${pair.words[1]}" ${pair.rhymes ? "rhyme! 🎵" : "don't rhyme."} ✓`);
      } else {
        setFeedback(`That's right! ✓`);
      }
      setFeedbackType("correct");
      setTimeout(advance, 1400);
    } else {
      const newErrors = [...errorTags];
      if (!newErrors.includes("focuses_on_meaning_not_sound")) {
        newErrors.push("focuses_on_meaning_not_sound");
      }
      setErrorTags(newErrors);

      if (newQAttempts >= 2) {
        setHintsUsed((h) => h + 1);
        setFeedback(
          `Tip: listen to the ending sounds. "${pair.words[0].slice(-2)}" and "${pair.words[1].slice(-2)}" — ${pair.rhymes ? "they match!" : "they don't match."}`
        );
        setFeedbackType("wrong");
        setTimeout(advance, 2000);
      } else {
        setFeedback("Listen again to the word endings. Try once more!");
        setFeedbackType("wrong");
      }
    }
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-lg font-bold text-gray-700 text-center">
        {objective.childFriendlyGoal}
      </p>

      <div className="flex items-center justify-center gap-2 text-sm text-blue-500 font-semibold">
        {queue.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full ${i < current ? "bg-green-400" : i === current ? "bg-blue-500" : "bg-gray-200"}`}
          />
        ))}
      </div>

      <div className="flex gap-8 items-center justify-center">
        {pair.words.map((word, i) => (
          <div
            key={word}
            className="flex flex-col items-center gap-2 bg-amber-50 rounded-2xl p-6 min-w-[7rem]"
          >
            <span className="text-5xl">{pair.emojis[i]}</span>
            <span className="text-xl font-bold text-gray-700">{word}</span>
          </div>
        ))}
      </div>

      {feedback && (
        <p
          className={`text-center font-semibold px-4 ${
            feedbackType === "correct"
              ? "text-emerald-600"
              : "text-amber-600"
          }`}
          aria-live="polite"
        >
          {feedback}
        </p>
      )}

      <div className="flex gap-4">
        <Button
          size="lg"
          variant="secondary"
          onClick={() => handleAnswer(true)}
          data-testid="rhymes-yes"
        >
          Rhymes! 🎵
        </Button>
        <Button
          size="lg"
          variant="ghost"
          onClick={() => handleAnswer(false)}
          data-testid="rhymes-no"
        >
          Doesn&#39;t rhyme
        </Button>
      </div>

      <p className="text-xs text-gray-400">
        {current + 1} of {queue.length}
      </p>
    </div>
  );
}
