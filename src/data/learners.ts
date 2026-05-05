import { LearnerProfile } from "@/domain/types";

export const learners: LearnerProfile[] = [
  {
    id: "daughter-grade-1",
    displayName: "Grade 1 Learner",
    ageYears: 6.5,
    schoolStage: "Grade 1",
    defaultPhase: "phase_2",
    defaultSessionMinutes: 12,
    maxSubjectsPerSession: 2,
  },
  {
    id: "son-kg1",
    displayName: "KG1 Learner",
    ageYears: 4.5,
    schoolStage: "KG1",
    defaultPhase: "phase_1",
    defaultSessionMinutes: 8,
    maxSubjectsPerSession: 1,
  },
];
