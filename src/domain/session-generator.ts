import {
  LearnerProfile,
  ObjectiveProgress,
  AttemptRecord,
  SessionPlan,
  PlannedModule,
  Subject,
} from "./types";
import { objectives } from "@/data/objectives";

export function generateSessionPlan(params: {
  learner: LearnerProfile;
  objectiveProgress: ObjectiveProgress[];
  recentAttempts: AttemptRecord[];
  today: string;
}): SessionPlan {
  const { learner, objectiveProgress, recentAttempts } = params;

  // Filter objectives for this learner's phase
  const eligibleObjectives = objectives.filter(
    (o) => o.phase === learner.defaultPhase
  );

  // Get progress map
  const progressMap = new Map(
    objectiveProgress.map((p) => [p.objectiveId, p])
  );

  // Determine subjects for session
  const allSubjects: Subject[] = ["maths", "literacy", "science"];

  // Rotate subjects to ensure variety; start with least recently practiced
  const subjectLastPracticed: Record<Subject, string | null> = {
    maths: null,
    literacy: null,
    science: null,
  };

  for (const attempt of recentAttempts) {
    const obj = objectives.find((o) => o.id === attempt.objectiveId);
    if (obj) {
      const existing = subjectLastPracticed[obj.subject];
      if (!existing || attempt.completedAt > existing) {
        subjectLastPracticed[obj.subject] = attempt.completedAt;
      }
    }
  }

  const sortedSubjects = [...allSubjects].sort((a, b) => {
    const aTime = subjectLastPracticed[a] || "0";
    const bTime = subjectLastPracticed[b] || "0";
    return aTime.localeCompare(bTime);
  });

  const sessionSubjects: Subject[] = [];
  for (const subject of sortedSubjects) {
    if (sessionSubjects.length < learner.maxSubjectsPerSession) {
      sessionSubjects.push(subject);
    }
  }

  // Build modules
  const modules: PlannedModule[] = [];
  const minutesPerSubject = Math.floor(
    learner.defaultSessionMinutes / sessionSubjects.length
  );

  for (const subject of sessionSubjects) {
    const subjectObjectives = eligibleObjectives.filter(
      (o) => o.subject === subject
    );

    // Find recurring misconceptions in recent attempts for this subject
    const recentSubjectAttempts = recentAttempts.filter((a) => {
      const obj = objectives.find((o) => o.id === a.objectiveId);
      return obj?.subject === subject;
    });

    const misconceptionCounts: Record<string, number> = {};
    for (const attempt of recentSubjectAttempts) {
      for (const tag of attempt.errorTags) {
        misconceptionCounts[tag] = (misconceptionCounts[tag] || 0) + 1;
      }
    }
    const recurringMisconceptions = Object.entries(misconceptionCounts)
      .filter(([, count]) => count >= 2)
      .map(([tag]) => tag);

    // Order: developing first (familiar), then emerging, then not_started (new)
    const developing = subjectObjectives.filter((o) => {
      const p = progressMap.get(o.id);
      return p?.masteryState === "developing";
    });
    const emerging = subjectObjectives.filter((o) => {
      const p = progressMap.get(o.id);
      return p?.masteryState === "emerging";
    });
    const notStarted = subjectObjectives.filter((o) => {
      const p = progressMap.get(o.id);
      return !p || p.masteryState === "not_started";
    });
    // Also include consolidated for occasional revisit, but deprioritize
    const consolidated = subjectObjectives.filter((o) => {
      const p = progressMap.get(o.id);
      return p?.masteryState === "consolidated";
    });

    const ordered = [
      ...developing,
      ...emerging,
      ...notStarted,
      ...consolidated,
    ];

    let addedNew = false;
    let minutesUsed = 0;

    for (const obj of ordered) {
      if (minutesUsed >= minutesPerSubject) break;

      const progress = progressMap.get(obj.id);
      const isNew =
        !progress || progress.masteryState === "not_started";

      // Only one new objective per session
      if (isNew && addedNew) continue;

      const hasMisconception = recurringMisconceptions.some((tag) =>
        obj.misconceptionTags.includes(tag)
      );

      const moduleType = obj.moduleTypes[0];
      const estimatedMinutes = 3;

      if (minutesUsed + estimatedMinutes > minutesPerSubject + 2) break;

      const difficultyBase = Math.min(
        5,
        (progress?.successfulSessions || 0) + 1
      ) as 1 | 2 | 3 | 4 | 5;

      modules.push({
        id: `${obj.id}-${Date.now()}-${modules.length}`,
        objectiveId: obj.id,
        moduleType,
        estimatedMinutes,
        difficulty: hasMisconception ? 1 : difficultyBase,
      });

      minutesUsed += estimatedMinutes;
      if (isNew) addedNew = true;
    }
  }

  return {
    id: `session-${Date.now()}`,
    learnerId: learner.id,
    plannedMinutes: learner.defaultSessionMinutes,
    subjects: sessionSubjects,
    modules,
  };
}
