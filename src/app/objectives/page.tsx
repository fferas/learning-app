"use client";

import { useState } from "react";
import { objectives } from "@/data/objectives";
import { Subject, LearnerPhase } from "@/domain/types";
import { Card } from "@/components/ui/Card";

const masteryColors: Record<string, string> = {
  phase_1: "bg-green-100 text-green-700",
  phase_2: "bg-blue-100 text-blue-700",
};

const subjectColors: Record<Subject, string> = {
  maths: "bg-purple-100 text-purple-700",
  literacy: "bg-pink-100 text-pink-700",
  science: "bg-teal-100 text-teal-700",
};

export default function ObjectivesPage() {
  const [subjectFilter, setSubjectFilter] = useState<Subject | "all">("all");
  const [phaseFilter, setPhaseFilter] = useState<LearnerPhase | "all">("all");

  const filtered = objectives.filter(
    (o) =>
      (subjectFilter === "all" || o.subject === subjectFilter) &&
      (phaseFilter === "all" || o.phase === phaseFilter)
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800">
          Objective Library
        </h1>
        <p className="text-gray-500 mt-1">
          All {objectives.length} learning objectives in this app
        </p>
      </div>

      {/* Filters */}
      <Card padding="sm">
        <div className="flex gap-4 flex-wrap items-center">
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase mr-2">
              Subject:
            </label>
            {(["all", "maths", "literacy", "science"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSubjectFilter(s)}
                className={`mr-2 px-3 py-1 rounded-full text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  subjectFilter === s
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase mr-2">
              Phase:
            </label>
            {(["all", "phase_1", "phase_2"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPhaseFilter(p)}
                className={`mr-2 px-3 py-1 rounded-full text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  phaseFilter === p
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {p === "all" ? "All" : p === "phase_1" ? "Phase 1 (KG1)" : "Phase 2 (Grade 1)"}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <p className="text-sm text-gray-400">
        Showing {filtered.length} of {objectives.length} objectives
      </p>

      <div className="flex flex-col gap-4">
        {filtered.map((obj) => (
          <Card key={obj.id} padding="sm">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono text-gray-400">{obj.id}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-semibold ${subjectColors[obj.subject]}`}
                >
                  {obj.subject}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-semibold ${masteryColors[obj.phase]}`}
                >
                  {obj.phase === "phase_1" ? "KG1" : "Grade 1"}
                </span>
                <span className="text-xs text-gray-400">{obj.strand}</span>
              </div>
            </div>

            <h3 className="font-bold text-gray-800 mb-1">{obj.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{obj.objective}</p>

            <div className="bg-amber-50 rounded-lg px-3 py-2 mb-2">
              <p className="text-xs font-bold text-amber-600 uppercase mb-0.5">
                Child goal
              </p>
              <p className="text-sm text-gray-700">{obj.childFriendlyGoal}</p>
            </div>

            {obj.offlineExtension && (
              <div className="bg-blue-50 rounded-lg px-3 py-2 mb-2">
                <p className="text-xs font-bold text-blue-600 uppercase mb-0.5">
                  Try at home
                </p>
                <p className="text-sm text-gray-700">{obj.offlineExtension}</p>
              </div>
            )}

            <div className="text-xs text-gray-400 mt-1">
              Modules: {obj.moduleTypes.join(", ")}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
