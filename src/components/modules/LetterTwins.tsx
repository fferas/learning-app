"use client";

import { useState, useRef, useEffect } from "react";
import { LearningModuleProps } from "@/domain/types";

const letterPairs = [
  ["A", "a"],
  ["B", "b"],
  ["C", "c"],
  ["D", "d"],
  ["E", "e"],
  ["F", "f"],
  ["G", "g"],
  ["H", "h"],
  ["M", "m"],
  ["S", "s"],
  ["T", "t"],
  ["P", "p"],
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function LetterTwins({
  objective,
  onComplete,
}: LearningModuleProps) {
  const [pairs] = useState(() => shuffle(letterPairs).slice(0, 5));
  const [selectedUpper, setSelectedUpper] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [errorTags, setErrorTags] = useState<string[]>([]);
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState<"correct" | "wrong" | "">("");
  const [attempts, setAttempts] = useState(0);
  const [correctFirst, setCorrectFirst] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const startTimeRef = useRef<number>(0);
  useEffect(() => { startTimeRef.current = Date.now(); }, []);

  const lowers = shuffle(pairs.map((p) => p[1]));

  function handleUpper(letter: string) {
    if (matched.has(letter)) return;
    setSelectedUpper(letter);
    setFeedback("");
  }

  function handleLower(lower: string) {
    if (!selectedUpper) return;
    const pair = pairs.find((p) => p[0] === selectedUpper);
    const correct = pair && pair[1] === lower;
    setAttempts((a) => a + 1);

    if (correct) {
      const newMatched = new Set(matched);
      newMatched.add(selectedUpper);
      setMatched(newMatched);
      setFeedback(`${selectedUpper} and ${lower} are twins! ✓`);
      setFeedbackType("correct");
      setCorrectFirst((c) => c + 1);
      setSelectedUpper(null);

      if (newMatched.size === pairs.length) {
        setTimeout(() => {
          onComplete({
            correctFirstTry: correctFirst + 1 === pairs.length,
            attempts: attempts + 1,
            responseTimeMs: Date.now() - startTimeRef.current,
            hintsUsed,
            errorTags,
          });
        }, 1000);
      }
    } else {
      const newErrors = [...errorTags];
      if (!newErrors.includes("uppercase_lowercase_mismatch"))
        newErrors.push("uppercase_lowercase_mismatch");
      setErrorTags(newErrors);
      setFeedback(`Not quite. Try another lowercase letter for ${selectedUpper}.`);
      setFeedbackType("wrong");
      if (attempts > 0 && attempts % 3 === 0) {
        setHintsUsed((h) => h + 1);
      }
    }
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-lg font-bold text-gray-700 text-center">
        {objective.childFriendlyGoal}
      </p>

      <p className="text-gray-500 text-sm">
        Tap a BIG letter, then tap its little twin!
      </p>

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

      <div className="flex gap-6">
        {/* Uppercase column */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold text-gray-400 text-center">
            BIG letters
          </p>
          {pairs.map(([upper]) => (
            <button
              key={upper}
              onClick={() => handleUpper(upper)}
              disabled={matched.has(upper)}
              data-testid={`upper-${upper}`}
              className={`w-14 h-14 rounded-2xl text-2xl font-bold transition-all focus:outline-none focus:ring-2 focus:ring-blue-400
                ${matched.has(upper)
                  ? "bg-green-100 text-green-600 opacity-50"
                  : selectedUpper === upper
                  ? "bg-blue-500 text-white shadow-lg scale-105"
                  : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                }`}
              aria-label={`Uppercase ${upper}`}
            >
              {upper}
            </button>
          ))}
        </div>

        {/* Lowercase column */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold text-gray-400 text-center">
            small letters
          </p>
          {lowers.map((lower) => {
            const matchedUpper = pairs.find((p) => p[1] === lower)?.[0];
            const isMatched = matchedUpper ? matched.has(matchedUpper) : false;
            return (
              <button
                key={lower}
                onClick={() => handleLower(lower)}
                disabled={isMatched || !selectedUpper}
                data-testid={`lower-${lower}`}
                className={`w-14 h-14 rounded-2xl text-2xl font-bold transition-all focus:outline-none focus:ring-2 focus:ring-green-400
                  ${isMatched
                    ? "bg-green-100 text-green-600 opacity-50"
                    : !selectedUpper
                    ? "bg-gray-50 text-gray-400"
                    : "bg-green-50 text-green-700 hover:bg-green-100"
                  }`}
                aria-label={`Lowercase ${lower}`}
              >
                {lower}
              </button>
            );
          })}
        </div>
      </div>

      <p className="text-xs text-gray-400">
        {matched.size} of {pairs.length} matched
      </p>
    </div>
  );
}
