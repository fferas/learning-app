"use client";

import { learners } from "@/data/learners";
import { clearProgress } from "@/persistence/progress-repository";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useState } from "react";

export default function SettingsPage() {
  const [cleared, setCleared] = useState(false);

  function handleClear() {
    if (
      window.confirm(
        "This will delete all progress data. Are you sure?"
      )
    ) {
      clearProgress();
      setCleared(true);
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-lg mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-500 mt-1">Learner profiles and preferences</p>
      </div>

      <Card>
        <h2 className="font-bold text-gray-700 mb-4">Learner Profiles</h2>
        <div className="flex flex-col gap-4">
          {learners.map((l) => (
            <div
              key={l.id}
              className="flex items-center justify-between bg-gray-50 rounded-2xl p-4"
            >
              <div>
                <p className="font-bold text-gray-700">{l.displayName}</p>
                <p className="text-sm text-gray-400">
                  {l.schoolStage} &middot; Age {l.ageYears} &middot;{" "}
                  {l.defaultSessionMinutes} min sessions &middot; Up to{" "}
                  {l.maxSubjectsPerSession} subject
                  {l.maxSubjectsPerSession > 1 ? "s" : ""}
                </p>
              </div>
              <Link href={`/learn/${l.id}`}>
                <Button size="sm" variant="primary">
                  Start
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="font-bold text-gray-700 mb-4">Session Lengths</h2>
        <div className="text-sm text-gray-600 flex flex-col gap-2">
          <p>
            <strong>KG1 (4-5 years):</strong> 8 minutes, 1 subject per session.
            Short, playful, no timers.
          </p>
          <p>
            <strong>Grade 1 (6-7 years):</strong> 12 minutes, up to 2 subjects.
            Optional timed challenges.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Session lengths follow IB PYP early years guidelines for age-appropriate practice.
          </p>
        </div>
      </Card>

      <Card>
        <h2 className="font-bold text-gray-700 mb-2">Accessibility</h2>
        <p className="text-sm text-gray-500 mb-3">
          This app supports reduced motion (via OS settings), high contrast,
          keyboard navigation, and large touch targets.
        </p>
        <p className="text-xs text-gray-400">
          Reduced motion is automatically applied when enabled in your device settings.
        </p>
      </Card>

      <Card>
        <h2 className="font-bold text-gray-700 mb-2">Data &amp; Privacy</h2>
        <p className="text-sm text-gray-500 mb-4">
          All progress data is stored locally in your browser (localStorage).
          No data is sent to any server. You can clear all progress below.
        </p>
        {cleared && (
          <p className="text-emerald-600 text-sm font-semibold mb-3">
            All progress data cleared!
          </p>
        )}
        <Button size="sm" variant="warning" onClick={handleClear}>
          Clear All Progress
        </Button>
      </Card>

      <Card>
        <h2 className="font-bold text-gray-700 mb-2">About</h2>
        <p className="text-xs text-gray-400 leading-relaxed">
          This app is an independent home-practice tool inspired by IB PYP
          learning principles. It is not an official International Baccalaureate
          product, does not represent any specific school&apos;s Programme of
          Inquiry, and should not be used as a replacement for school
          instruction.
        </p>
      </Card>
    </div>
  );
}
