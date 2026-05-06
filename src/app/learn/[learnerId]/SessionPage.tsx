"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { learners } from "@/data/learners";
import { objectives } from "@/data/objectives";
import {
  LearnerProfile,
  SessionPlan,
  PlannedModule,
  AttemptRecord,
  Reflection,
} from "@/domain/types";
import { generateSessionPlan } from "@/domain/session-generator";
import { moduleComponents } from "@/domain/module-registry";
import {
  getProgressForLearner,
  getRecentAttempts,
  saveAttempt,
} from "@/persistence/progress-repository";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";

type PagePhase =
  | "loading"
  | "session-intro"
  | "module"
  | "reflection"
  | "complete";

export default function SessionPage({
  params,
}: {
  params: Promise<{ learnerId: string }>;
}) {
  const { learnerId } = use(params);
  const router = useRouter();

  type SessionState = {
    learner: LearnerProfile | null;
    sessionPlan: SessionPlan | null;
    phase: PagePhase;
  };

  const [sessionState, setSessionState] = useState<SessionState>({
    learner: null,
    sessionPlan: null,
    phase: "loading",
  });
  const [moduleIndex, setModuleIndex] = useState(0);
  const [pendingResult, setPendingResult] = useState<Omit<
    AttemptRecord,
    "reflection"
  > | null>(null);
  const [sessionAttempts, setSessionAttempts] = useState<AttemptRecord[]>([]);

  const { learner, sessionPlan, phase } = sessionState;

  function setPhase(p: PagePhase) {
    setSessionState((prev) => ({ ...prev, phase: p }));
  }

  useEffect(() => {
    const found = learners.find((l) => l.id === learnerId);
    if (!found) {
      router.push("/");
      return;
    }

    const progress = getProgressForLearner(found.id);
    const recentAttempts = getRecentAttempts(found.id);
    const plan = generateSessionPlan({
      learner: found,
      objectiveProgress: progress,
      recentAttempts,
      today: new Date().toISOString().split("T")[0],
    });

    setSessionState({ learner: found, sessionPlan: plan, phase: "session-intro" });
  }, [learnerId, router]);

  function startSession() {
    setPhase("module");
  }

  function handleModuleComplete(result: {
    correctFirstTry: boolean;
    attempts: number;
    responseTimeMs?: number;
    hintsUsed: number;
    errorTags: string[];
  }) {
    if (!sessionPlan || !learner) return;

    const mod: PlannedModule = sessionPlan.modules[moduleIndex];
    const now = new Date().toISOString();

    const attempt: Omit<AttemptRecord, "reflection"> = {
      id: `attempt-${Date.now()}`,
      learnerId: learner.id,
      sessionId: sessionPlan.id,
      objectiveId: mod.objectiveId,
      moduleType: mod.moduleType,
      startedAt: now,
      completedAt: now,
      correctFirstTry: result.correctFirstTry,
      attempts: result.attempts,
      responseTimeMs: result.responseTimeMs,
      hintsUsed: result.hintsUsed,
      errorTags: result.errorTags,
    };

    setPendingResult(attempt);
    setPhase("reflection");
  }

  function handleReflection(reflection: Reflection) {
    if (!pendingResult) return;

    const attempt: AttemptRecord = { ...pendingResult, reflection };
    saveAttempt(attempt);
    setSessionAttempts((prev) => [...prev, attempt]);
    setPendingResult(null);

    const nextIndex = moduleIndex + 1;
    if (nextIndex >= (sessionPlan?.modules.length || 0)) {
      setPhase("complete");
    } else {
      setModuleIndex(nextIndex);
      setPhase("module");
    }
  }

  if (phase === "loading") {
    return (
      <div className="flex justify-center items-center min-h-64">
        <p className="text-gray-400 text-lg">Getting your session ready...</p>
      </div>
    );
  }

  if (!learner || !sessionPlan) return null;

  const subjectLabels: Record<string, string> = {
    maths: "🔢 Maths",
    literacy: "📚 Literacy",
    science: "🔬 Science",
  };

  if (phase === "session-intro") {
    return (
      <div className="flex flex-col items-center gap-6 max-w-lg mx-auto">
        <Card className="w-full text-center">
          <div className="flex justify-center mb-4">
            <span className="text-5xl">
              {learner.id === "son-kg1" ? "👦" : "👧"}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Hi, {learner.displayName}!
          </h1>
          <p className="text-gray-500 mb-4">
            Today&apos;s session will take about{" "}
            <strong>{learner.defaultSessionMinutes} minutes</strong>.
          </p>

          <div className="flex gap-2 justify-center mb-4 flex-wrap">
            {sessionPlan.subjects.map((s) => (
              <span
                key={s}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold"
              >
                {subjectLabels[s] || s}
              </span>
            ))}
          </div>

          <div className="text-sm text-gray-400 mb-6">
            {sessionPlan.modules.length} module
            {sessionPlan.modules.length !== 1 ? "s" : ""} today
          </div>

          <Button
            size="xl"
            className="w-full"
            onClick={startSession}
            data-testid="start-session"
          >
            Let&apos;s go! 🚀
          </Button>
        </Card>
      </div>
    );
  }

  if (phase === "module") {
    const mod = sessionPlan.modules[moduleIndex];
    const objective = objectives.find((o) => o.id === mod.objectiveId);
    if (!objective) return null;

    const ModuleComponent = moduleComponents[mod.moduleType];
    const progress = Math.round(
      (moduleIndex / sessionPlan.modules.length) * 100
    );

    return (
      <div className="flex flex-col gap-4 max-w-lg mx-auto">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>
            Module {moduleIndex + 1} of {sessionPlan.modules.length}
          </span>
          <span className="capitalize">{objective.subject}</span>
        </div>

        <ProgressBar value={progress} />

        <Card>
          <ModuleComponent
            learner={learner}
            objective={objective}
            difficulty={mod.difficulty}
            onComplete={handleModuleComplete}
          />
        </Card>
      </div>
    );
  }

  if (phase === "reflection") {
    return (
      <div className="flex flex-col items-center gap-6 max-w-lg mx-auto">
        <Card className="w-full text-center">
          <p className="text-4xl mb-4">🤔</p>
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            How was that activity?
          </h2>
          <div className="flex gap-3 justify-center flex-wrap">
            {[
              { label: "Easy! 😊", value: "easy" as Reflection },
              { label: "Just right! 👍", value: "just_right" as Reflection },
              { label: "Tricky! 🤔", value: "tricky" as Reflection },
            ].map(({ label, value }) => (
              <Button
                key={value}
                size="lg"
                variant="ghost"
                onClick={() => handleReflection(value)}
                data-testid={`reflection-${value}`}
              >
                {label}
              </Button>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  if (phase === "complete") {
    const successCount = sessionAttempts.filter(
      (a) => a.correctFirstTry || a.attempts <= 2
    ).length;

    return (
      <div className="flex flex-col items-center gap-6 max-w-lg mx-auto">
        <Card className="w-full text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            All done! Great work!
          </h1>
          <p className="text-gray-500 mb-4">
            You completed {sessionAttempts.length} module
            {sessionAttempts.length !== 1 ? "s" : ""} today.{" "}
            {successCount > 0 && (
              <>
                You got <strong>{successCount}</strong> right!
              </>
            )}
          </p>
          <div className="text-4xl mb-6">⭐ ⭐ ⭐</div>

          {sessionPlan.modules[sessionPlan.modules.length - 1] && (() => {
            const lastObjId =
              sessionPlan.modules[sessionPlan.modules.length - 1].objectiveId;
            const lastObj = objectives.find((o) => o.id === lastObjId);
            return lastObj?.offlineExtension ? (
              <div className="bg-amber-50 rounded-2xl p-4 mb-4 text-left">
                <p className="text-xs font-bold text-amber-600 uppercase mb-1">
                  Try at home tonight
                </p>
                <p className="text-sm text-gray-600">
                  {lastObj.offlineExtension}
                </p>
              </div>
            ) : null;
          })()}

          <div className="flex gap-3 flex-wrap justify-center">
            <Button
              size="lg"
              variant="primary"
              onClick={() => router.push("/")}
              data-testid="go-home"
            >
              Home 🏠
            </Button>
            <Button
              size="lg"
              variant="ghost"
              onClick={() => router.push("/parent")}
            >
              Parent view
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return null;
}
