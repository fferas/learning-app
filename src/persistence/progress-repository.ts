import { AttemptRecord, LearnerId, ObjectiveProgress } from "@/domain/types";
import { buildObjectiveProgress } from "@/domain/mastery";
import { objectives } from "@/data/objectives";

const ATTEMPTS_KEY = "pyp_attempt_records";

export function saveAttempt(attempt: AttemptRecord): void {
  if (typeof window === "undefined") return;
  const existing = getAttempts();
  localStorage.setItem(
    ATTEMPTS_KEY,
    JSON.stringify([...existing, attempt])
  );
}

export function getAttempts(): AttemptRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ATTEMPTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getAttemptsForLearner(
  learnerId: LearnerId
): AttemptRecord[] {
  return getAttempts().filter((a) => a.learnerId === learnerId);
}

export function getProgressForLearner(
  learnerId: LearnerId
): ObjectiveProgress[] {
  const attempts = getAttemptsForLearner(learnerId);
  const learnerObjectives = objectives.filter((o) =>
    learnerId === "daughter-grade-1"
      ? o.phase === "phase_2"
      : o.phase === "phase_1"
  );

  return learnerObjectives.map((obj) =>
    buildObjectiveProgress(learnerId, obj.id, attempts)
  );
}

export function getRecentAttempts(
  learnerId: LearnerId,
  limit = 50
): AttemptRecord[] {
  const all = getAttemptsForLearner(learnerId);
  return all
    .sort((a, b) => b.completedAt.localeCompare(a.completedAt))
    .slice(0, limit);
}

export function clearProgress(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ATTEMPTS_KEY);
}
