import {
  AttemptRecord,
  MasteryState,
  ObjectiveProgress,
  LearnerId,
} from "./types";

export function calculateMastery(records: AttemptRecord[]): MasteryState {
  if (records.length === 0) return "not_started";

  const successfulRecords = records.filter(
    (r) => (r.correctFirstTry || r.attempts <= 2) && r.hintsUsed <= 1
  );

  if (successfulRecords.length === 0) return "emerging";

  // Get unique days with successful sessions
  const successDays = new Set(
    successfulRecords.map((r) => r.completedAt.split("T")[0])
  );

  if (successDays.size >= 3) {
    // Check for no recurring major misconceptions
    const allErrorTags = records.flatMap((r) => r.errorTags);
    const tagCounts: Record<string, number> = {};
    for (const tag of allErrorTags) {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    }
    const hasRecurringMisconception = Object.values(tagCounts).some(
      (count) => count >= 3
    );

    if (!hasRecurringMisconception) return "consolidated";
  }

  if (successDays.size >= 2) return "developing";

  return "emerging";
}

export function buildObjectiveProgress(
  learnerId: LearnerId,
  objectiveId: string,
  records: AttemptRecord[]
): ObjectiveProgress {
  const objectiveRecords = records.filter(
    (r) => r.learnerId === learnerId && r.objectiveId === objectiveId
  );

  const masteryState = calculateMastery(objectiveRecords);

  const successfulSessions = new Set(
    objectiveRecords
      .filter((r) => r.correctFirstTry || r.attempts <= 2)
      .map((r) => r.completedAt.split("T")[0])
  ).size;

  const sortedRecords = [...objectiveRecords].sort((a, b) =>
    b.completedAt.localeCompare(a.completedAt)
  );
  const lastPracticedAt = sortedRecords[0]?.completedAt;

  const tagCounts: Record<string, number> = {};
  for (const r of objectiveRecords) {
    for (const tag of r.errorTags) {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    }
  }
  const recurringErrorTags = Object.entries(tagCounts)
    .filter(([, count]) => count >= 2)
    .map(([tag]) => tag);

  return {
    learnerId,
    objectiveId,
    masteryState,
    successfulSessions,
    lastPracticedAt,
    recurringErrorTags,
  };
}
