import { describe, it, expect } from "vitest";
import { calculateMastery, buildObjectiveProgress } from "@/domain/mastery";
import { AttemptRecord } from "@/domain/types";

function makeAttempt(
  day: string,
  correct: boolean,
  hints = 0,
  errorTags: string[] = []
): AttemptRecord {
  return {
    id: Math.random().toString(),
    learnerId: "son-kg1",
    sessionId: "s1",
    objectiveId: "M-KG1-001",
    moduleType: "flash_subitizing",
    startedAt: `${day}T10:00:00Z`,
    completedAt: `${day}T10:05:00Z`,
    correctFirstTry: correct,
    attempts: correct ? 1 : 3,
    hintsUsed: hints,
    errorTags,
  };
}

describe("calculateMastery", () => {
  it("returns not_started with no records", () => {
    expect(calculateMastery([])).toBe("not_started");
  });

  it("returns emerging with inconsistent performance", () => {
    const records = [
      makeAttempt("2026-05-01", false),
      makeAttempt("2026-05-01", false),
    ];
    expect(calculateMastery(records)).toBe("emerging");
  });

  it("returns emerging with one successful session", () => {
    const records = [makeAttempt("2026-05-01", true)];
    expect(calculateMastery(records)).toBe("emerging");
  });

  it("returns developing with 2 successful sessions on different days", () => {
    const records = [
      makeAttempt("2026-05-01", true),
      makeAttempt("2026-05-02", true),
    ];
    expect(calculateMastery(records)).toBe("developing");
  });

  it("consolidated requires 3 successful sessions on different days", () => {
    const records = [
      makeAttempt("2026-05-01", true),
      makeAttempt("2026-05-02", true),
      makeAttempt("2026-05-03", true),
    ];
    expect(calculateMastery(records)).toBe("consolidated");
  });

  it("does NOT consolidate when same day repeated", () => {
    const records = [
      makeAttempt("2026-05-01", true),
      makeAttempt("2026-05-01", true),
      makeAttempt("2026-05-01", true),
    ];
    // All same day = only 1 unique successful day
    expect(calculateMastery(records)).toBe("emerging");
  });

  it("does NOT consolidate with recurring major misconception", () => {
    const records = [
      makeAttempt("2026-05-01", true, 0, ["counts_instead_of_subitizes"]),
      makeAttempt("2026-05-02", true, 0, ["counts_instead_of_subitizes"]),
      makeAttempt("2026-05-03", true, 0, ["counts_instead_of_subitizes"]),
    ];
    expect(calculateMastery(records)).not.toBe("consolidated");
  });

  it("high hint usage counts as not successful", () => {
    const records = [
      makeAttempt("2026-05-01", true, 3), // too many hints
      makeAttempt("2026-05-02", true, 2),
      makeAttempt("2026-05-03", true, 2),
    ];
    // Only records with hintsUsed <= 1 count as successful
    // Days 2 and 3 might still count
    const result = calculateMastery(records);
    expect(["developing", "emerging"]).toContain(result);
  });
});

describe("buildObjectiveProgress", () => {
  it("returns correct learnerId and objectiveId", () => {
    const prog = buildObjectiveProgress("son-kg1", "M-KG1-001", []);
    expect(prog.learnerId).toBe("son-kg1");
    expect(prog.objectiveId).toBe("M-KG1-001");
  });

  it("counts successful sessions correctly", () => {
    const records = [
      makeAttempt("2026-05-01", true),
      makeAttempt("2026-05-02", true),
    ];
    const prog = buildObjectiveProgress("son-kg1", "M-KG1-001", records);
    expect(prog.successfulSessions).toBe(2);
  });

  it("identifies recurring error tags", () => {
    const records = [
      makeAttempt("2026-05-01", false, 0, ["counts_instead_of_subitizes"]),
      makeAttempt("2026-05-02", false, 0, ["counts_instead_of_subitizes"]),
    ];
    const prog = buildObjectiveProgress("son-kg1", "M-KG1-001", records);
    expect(prog.recurringErrorTags).toContain("counts_instead_of_subitizes");
  });

  it("sets lastPracticedAt from most recent attempt", () => {
    const records = [
      makeAttempt("2026-05-01", true),
      makeAttempt("2026-05-03", true),
    ];
    const prog = buildObjectiveProgress("son-kg1", "M-KG1-001", records);
    expect(prog.lastPracticedAt).toContain("2026-05-03");
  });
});
