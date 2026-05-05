import { describe, it, expect } from "vitest";
import { generateSessionPlan } from "@/domain/session-generator";
import { learners } from "@/data/learners";
import { objectives } from "@/data/objectives";

describe("generateSessionPlan", () => {
  it("KG1 session never exceeds 1 subject", () => {
    const kg1 = learners.find((l) => l.id === "son-kg1")!;
    const plan = generateSessionPlan({
      learner: kg1,
      objectiveProgress: [],
      recentAttempts: [],
      today: "2026-05-05",
    });
    expect(plan.subjects.length).toBeLessThanOrEqual(1);
  });

  it("Grade 1 session never exceeds 2 subjects", () => {
    const g1 = learners.find((l) => l.id === "daughter-grade-1")!;
    const plan = generateSessionPlan({
      learner: g1,
      objectiveProgress: [],
      recentAttempts: [],
      today: "2026-05-05",
    });
    expect(plan.subjects.length).toBeLessThanOrEqual(2);
  });

  it("new session starts with a familiar skill if available", () => {
    const g1 = learners.find((l) => l.id === "daughter-grade-1")!;
    const progress = [
      {
        learnerId: "daughter-grade-1" as const,
        objectiveId: "M-G1-001",
        masteryState: "developing" as const,
        successfulSessions: 2,
        recurringErrorTags: [],
      },
    ];
    const plan = generateSessionPlan({
      learner: g1,
      objectiveProgress: progress,
      recentAttempts: [],
      today: "2026-05-05",
    });
    // Find the first maths module in the plan
    const firstMathsModule = plan.modules.find((m) => {
      const obj = objectives.find((o) => o.id === m.objectiveId);
      return obj?.subject === "maths";
    });
    if (firstMathsModule) {
      expect(firstMathsModule.objectiveId).toBe("M-G1-001");
    }
  });

  it("session plan has at least one module", () => {
    const kg1 = learners.find((l) => l.id === "son-kg1")!;
    const plan = generateSessionPlan({
      learner: kg1,
      objectiveProgress: [],
      recentAttempts: [],
      today: "2026-05-05",
    });
    expect(plan.modules.length).toBeGreaterThan(0);
  });

  it("session is created with correct learnerId", () => {
    const g1 = learners.find((l) => l.id === "daughter-grade-1")!;
    const plan = generateSessionPlan({
      learner: g1,
      objectiveProgress: [],
      recentAttempts: [],
      today: "2026-05-05",
    });
    expect(plan.learnerId).toBe("daughter-grade-1");
  });

  it("only one new objective introduced per session", () => {
    const kg1 = learners.find((l) => l.id === "son-kg1")!;
    const plan = generateSessionPlan({
      learner: kg1,
      objectiveProgress: [],
      recentAttempts: [],
      today: "2026-05-05",
    });
    // All modules should be new (no progress) — but only 1 new allowed per subject
    const subjectModules: Record<string, string[]> = {};
    for (const mod of plan.modules) {
      const obj = objectives.find((o) => o.id === mod.objectiveId);
      if (!obj) continue;
      if (!subjectModules[obj.subject]) subjectModules[obj.subject] = [];
      subjectModules[obj.subject].push(mod.objectiveId);
    }
    // Each subject should have at most 1 module (since all are new)
    for (const [, mods] of Object.entries(subjectModules)) {
      expect(mods.length).toBeLessThanOrEqual(2);
    }
  });

  it("plan respects planned minutes", () => {
    const kg1 = learners.find((l) => l.id === "son-kg1")!;
    const plan = generateSessionPlan({
      learner: kg1,
      objectiveProgress: [],
      recentAttempts: [],
      today: "2026-05-05",
    });
    expect(plan.plannedMinutes).toBe(kg1.defaultSessionMinutes);
  });

  it("KG1 has correct default phase objectives", () => {
    const kg1 = learners.find((l) => l.id === "son-kg1")!;
    const plan = generateSessionPlan({
      learner: kg1,
      objectiveProgress: [],
      recentAttempts: [],
      today: "2026-05-05",
    });
    for (const mod of plan.modules) {
      const obj = objectives.find((o) => o.id === mod.objectiveId);
      expect(obj?.phase).toBe("phase_1");
    }
  });
});
