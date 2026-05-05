export type LearnerId = "daughter-grade-1" | "son-kg1";
export type LearnerPhase = "phase_1" | "phase_2";
export type Subject = "maths" | "literacy" | "science";
export type MasteryState = "not_started" | "emerging" | "developing" | "consolidated";
export type Reflection = "easy" | "just_right" | "tricky";

export type LearnerProfile = {
  id: LearnerId;
  displayName: string;
  ageYears: number;
  schoolStage: "KG1" | "Grade 1";
  defaultPhase: LearnerPhase;
  defaultSessionMinutes: number;
  maxSubjectsPerSession: 1 | 2;
};

export type ModuleType =
  | "flash_subitizing"
  | "drag_count_cardinality"
  | "pattern_builder"
  | "shape_sorter"
  | "rhyme_detective"
  | "initial_sound_finder"
  | "letter_twins"
  | "print_concept_sorter"
  | "sound_builder_cvc"
  | "sight_word_lightning"
  | "sentence_picture_match"
  | "story_sequence"
  | "living_nonliving_sort"
  | "material_lab"
  | "day_night_wheel"
  | "life_cycle_sequence"
  | "predict_o_meter"
  | "recycling_sort";

export type LearningObjective = {
  id: string;
  subject: Subject;
  phase: LearnerPhase;
  strand: string;
  title: string;
  objective: string;
  childFriendlyGoal: string;
  prerequisiteObjectiveIds: string[];
  misconceptionTags: string[];
  moduleTypes: ModuleType[];
  successCriteria: string[];
  offlineExtension?: string;
  sourceNote: string;
};

export type SessionPlan = {
  id: string;
  learnerId: LearnerId;
  plannedMinutes: number;
  subjects: Subject[];
  modules: PlannedModule[];
};

export type PlannedModule = {
  id: string;
  objectiveId: string;
  moduleType: ModuleType;
  estimatedMinutes: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
};

export type AttemptRecord = {
  id: string;
  learnerId: LearnerId;
  sessionId: string;
  objectiveId: string;
  moduleType: ModuleType;
  startedAt: string;
  completedAt: string;
  correctFirstTry: boolean;
  attempts: number;
  responseTimeMs?: number;
  hintsUsed: number;
  errorTags: string[];
  reflection?: Reflection;
};

export type ObjectiveProgress = {
  learnerId: LearnerId;
  objectiveId: string;
  masteryState: MasteryState;
  successfulSessions: number;
  lastPracticedAt?: string;
  recurringErrorTags: string[];
};

export type LearningModuleProps = {
  learner: LearnerProfile;
  objective: LearningObjective;
  difficulty: 1 | 2 | 3 | 4 | 5;
  onComplete: (result: {
    correctFirstTry: boolean;
    attempts: number;
    responseTimeMs?: number;
    hintsUsed: number;
    errorTags: string[];
  }) => void;
};
