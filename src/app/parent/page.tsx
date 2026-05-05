"use client";

import { useEffect, useState } from "react";
import { learners } from "@/data/learners";
import { objectives } from "@/data/objectives";
import { LearnerId, ObjectiveProgress, AttemptRecord } from "@/domain/types";
import {
  getProgressForLearner,
  getAttemptsForLearner,
} from "@/persistence/progress-repository";
import { misconceptionCopy } from "@/data/misconception-copy";
import { generateSessionPlan } from "@/domain/session-generator";
import { SkillMap } from "@/components/parent/SkillMap";
import { SessionSummary } from "@/components/parent/SessionSummary";
import { Card } from "@/components/ui/Card";

const masteryLabels = {
  not_started: "Not started",
  emerging: "Emerging",
  developing: "Developing",
  consolidated: "Consolidated",
};

export default function ParentPage() {
  const [selectedId, setSelectedId] = useState<LearnerId>(
    "daughter-grade-1"
  );
  const [data, setData] = useState<{
    progress: ObjectiveProgress[];
    attempts: AttemptRecord[];
  }>({ progress: [], attempts: [] });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setData({
      progress: getProgressForLearner(selectedId),
      attempts: getAttemptsForLearner(selectedId),
    });
  }, [selectedId]);

  const { progress, attempts } = data;

  const learner = learners.find((l) => l.id === selectedId)!;

  // Unique sessions (by sessionId)
  const sessionIds = [...new Set(attempts.map((a) => a.sessionId))].slice(
    0,
    5
  );

  // Recurring misconceptions
  const tagCounts: Record<string, number> = {};
  for (const attempt of attempts) {
    for (const tag of attempt.errorTags) {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    }
  }
  const recurringTags = Object.entries(tagCounts)
    .filter(([, count]) => count >= 2)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([tag]) => tag);

  // Offline extension from most recent objective
  const lastAttempt = [...attempts].sort((a, b) =>
    b.completedAt.localeCompare(a.completedAt)
  )[0];
  const lastObj = lastAttempt
    ? objectives.find((o) => o.id === lastAttempt.objectiveId)
    : null;

  // Suggested next session
  const suggestedPlan =
    progress.length > 0
      ? generateSessionPlan({
          learner,
          objectiveProgress: progress,
          recentAttempts: attempts.slice(-20),
          today: new Date().toISOString().split("T")[0],
        })
      : null;

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800">Parent Dashboard</h1>
        <p className="text-gray-500 mt-1">Track your child&apos;s learning progress</p>
      </div>

      {/* Learner selector */}
      <div className="flex gap-3 justify-center">
        {learners.map((l) => (
          <button
            key={l.id}
            onClick={() => setSelectedId(l.id)}
            data-testid={`select-learner-${l.id}`}
            className={`px-5 py-2 rounded-2xl font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              selectedId === l.id
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-600 hover:bg-blue-50 border border-gray-200"
            }`}
          >
            {l.displayName}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Stats row */}
        {(
          [
            "consolidated",
            "developing",
            "emerging",
          ] as const
        ).map((state) => {
          const count = progress.filter(
            (p) => p.masteryState === state
          ).length;
          const colors = {
            consolidated: "bg-green-50 border-green-200 text-green-700",
            developing: "bg-blue-50 border-blue-200 text-blue-700",
            emerging: "bg-amber-50 border-amber-200 text-amber-700",
          };
          return (
            <div
              key={state}
              className={`rounded-2xl border p-4 text-center ${colors[state]}`}
            >
              <p className="text-3xl font-bold">{count}</p>
              <p className="text-sm font-semibold">{masteryLabels[state]}</p>
            </div>
          );
        })}
      </div>

      {/* Misconception alerts */}
      {recurringTags.length > 0 && (
        <Card>
          <h2 className="font-bold text-gray-700 mb-3">
            Learning notes for you
          </h2>
          <div className="flex flex-col gap-3">
            {recurringTags.map((tag) => (
              <div
                key={tag}
                className="bg-amber-50 border border-amber-200 rounded-xl p-3"
              >
                <p className="text-sm text-gray-700">
                  {misconceptionCopy[tag] ||
                    `Recurring pattern detected: ${tag.replace(/_/g, " ")}.`}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Offline extension */}
      {lastObj?.offlineExtension && (
        <Card>
          <h2 className="font-bold text-gray-700 mb-2">
            Try this at home tonight 🏠
          </h2>
          <p className="text-sm text-gray-600">{lastObj.offlineExtension}</p>
          <p className="text-xs text-gray-400 mt-2">
            Based on: {lastObj.title}
          </p>
        </Card>
      )}

      {/* Suggested next session */}
      {suggestedPlan && suggestedPlan.modules.length > 0 && (
        <Card>
          <h2 className="font-bold text-gray-700 mb-3">
            Suggested next session
          </h2>
          <div className="flex gap-2 flex-wrap mb-3">
            {suggestedPlan.subjects.map((s) => (
              <span
                key={s}
                className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold capitalize"
              >
                {s}
              </span>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            {suggestedPlan.modules.slice(0, 3).map((mod) => {
              const obj = objectives.find((o) => o.id === mod.objectiveId);
              if (!obj) return null;
              const prog = progress.find(
                (p) => p.objectiveId === mod.objectiveId
              );
              return (
                <div
                  key={mod.id}
                  className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2"
                >
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      prog?.masteryState === "developing"
                        ? "bg-blue-100 text-blue-700"
                        : prog?.masteryState === "consolidated"
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {masteryLabels[prog?.masteryState || "not_started"]}
                  </span>
                  <span className="text-sm text-gray-700">{obj.title}</span>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Recent sessions */}
      {sessionIds.length > 0 && (
        <Card>
          <h2 className="font-bold text-gray-700 mb-3">
            Recent sessions
          </h2>
          <div className="flex flex-col gap-2">
            {sessionIds.map((id) => (
              <SessionSummary key={id} sessionId={id} attempts={attempts} />
            ))}
          </div>
        </Card>
      )}

      {sessionIds.length === 0 && (
        <Card>
          <p className="text-gray-400 text-center">
            No sessions yet for {learner.displayName}. Start a learning session
            to see progress here!
          </p>
        </Card>
      )}

      {/* Skill map */}
      <Card>
        <h2 className="font-bold text-gray-700 mb-4">Skill map</h2>
        <SkillMap progress={progress} />
      </Card>
    </div>
  );
}
