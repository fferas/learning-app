# Claude Code Build Instructions: IB PYP Learning Practice App

## Mission

Build a simple, polished, child-friendly web application for two learners in a Dubai IB school:

- Daughter: 6.5 years old, Grade 1
- Son: 4.5 years old, KG1
- Subjects: maths, English reading/literacy, and science/inquiry
- Daily-use constraint: short sessions only

The app must support playful, gamified, developmentally appropriate practice. It must not present itself as an official IB product, a full school curriculum, or a replacement for teacher-led instruction. The IB PYP is phase-based and inquiry-based rather than a fixed grade checklist, so model learning objectives by learner phase, subject, strand, and skill rather than by rigid grade-only standards ([IB PYP curriculum framework](https://www.ibo.org/programmes/primary-years-programme/curriculum/)).

## Source of Truth

Use the curriculum research report as the source of truth:

```text
ib-pyp-learning-app-research-and-prd.pplx.md
```

If the report is not present in the repo, create the app from the requirements in this instruction file. Do not browse random curriculum blogs to invent new learning goals. Use the embedded objective seed list and the PYP-aligned logic below.

Authoritative curriculum anchors:

- The PYP is a student-centered, inquiry-based programme for children aged 3 to 12 ([IB Primary Years Programme](https://www.ibo.org/programmes/primary-years-programme/)).
- PYP learning emphasizes learner agency, self-efficacy, inquiry, and action ([IB PYP curriculum framework](https://www.ibo.org/programmes/primary-years-programme/curriculum/)).
- Public PYP mathematics scope documents organize early learning through strands such as Number, Pattern and Function, Measurement, Shape and Space, and Data Handling ([PYP Mathematics Scope and Sequence](https://www.ic.edu.lb/uploaded/programs/IB_PYP_Program/PYP_math_scope_and_sequence.pdf)).
- Public PYP language scope documents organize early language through oral language, visual language, reading, and writing ([PYP Language Scope and Sequence](https://www.ic.edu.lb/uploaded/programs/IB_PYP_Program/PYP_language_scope_and_sequence.pdf)).
- PYP science is best treated as inquiry skills plus broad strands such as Living Things, Earth and Space, Materials and Matter, and Forces/Energy, with school-specific units of inquiry ([PYP Science Scope and Sequence](https://gjovikis.no/wp-content/uploads/2015/11/SCIENCE.pdf)).
- Early years practice must feel playful, inquiry-led, and respectful of child agency, because IB early years materials emphasize play as the basis for inquiry and learning ([IB Early Years brochure](https://ibo.org/globalassets/new-structure/interactive-development-toolkit/pdfs/pypeyheader-ib-brochure.pdf), [Inquiry through Play](https://ibo.org/contentassets/117bf04eac9f45eda7d6b7afaf671ba0/inquiry-through-play-supporting-pyp-parents.pdf)).

## How to Use This With Claude Code

Copy this file into the project root as:

```text
CLAUDE.md
```

Then start Claude Code in the repo and paste this command:

```text
Read CLAUDE.md and implement the MVP exactly as specified. First inspect the repository and identify the existing stack. If the repository is empty, scaffold a Next.js + TypeScript + Tailwind app. Create a short implementation plan, then build in the order specified under "Implementation Order." Do not add features listed under "Future Enhancements After MVP." After implementation, run lint, typecheck, tests, and a production build. Report exactly what was built, what files changed, and which checks passed or failed.
```

If the full research file is available, copy it into the repo root too:

```text
ib-pyp-learning-app-research-and-prd.pplx.md
```

Claude Code should treat the research file as reference context and this `CLAUDE.md` file as the executable implementation instruction.

## Product Definition

Create a browser-based learning practice app with:

- Two child profiles
- A daily session generator
- Short gamified modules
- Skill progress tracking
- Parent dashboard
- Objective library seeded with IB PYP Phase 1 and Phase 2 objectives
- Clear separation between curriculum data, game logic, UI, and progress state

The first version should run locally and persist progress. If the repo has no persistence setup, use a simple local database such as SQLite through Prisma or the existing project’s persistence layer. If persistence is too much for the first pass, implement the full data model in code and use in-memory mock data behind a repository interface, but leave the interface ready for database persistence.

## Recommended Tech Stack

If starting from an empty repo, use:

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui or a small in-house component layer
- Prisma + SQLite for local persistence
- Zod for validation
- Vitest or Jest for unit tests
- Playwright for browser-level smoke tests if available

If the repo already has a stack, adapt to it. Do not rewrite the project just to match the recommended stack.

## Non-Negotiable Design Principles

### Child Experience

- Keep KG1 sessions to 8-10 minutes.
- Keep Grade 1 sessions to 12-15 minutes.
- KG1 should practice one subject per session.
- Grade 1 may practice up to two subjects per session.
- Do not use punitive wording, red failure screens, or public ranking.
- Do not use addictive mechanics such as infinite streak pressure, loot boxes, random rewards, or unlimited retry loops.
- Always end sessions with a calm stopping point.
- Use large tap targets, simple prompts, high contrast, and audio-ready copy.

### PYP Alignment

- Model by phase and skill, not only by grade.
- Treat science as inquiry plus broad concepts, not a fixed content checklist.
- Include off-screen “try this at home” prompts when appropriate.
- Track evidence over time instead of one-off scores.
- Use “emerging,” “developing,” and “consolidated” rather than grades or percentages in parent-facing summaries.

### Parent Experience

- Show what skill was practiced.
- Show what went well.
- Show one misconception or next step if detected.
- Show one short offline extension prompt.
- Avoid educational jargon unless paired with plain-language explanation.

## Initial Information Architecture

Create these main routes or screens:

```text
/
  Home / learner picker

/learn/:learnerId
  Daily session start screen
  Subject/module sequence
  End-of-session reflection

/parent
  Parent dashboard
  Child progress overview
  Recent sessions
  Misconception alerts
  Weekly plan

/objectives
  Developer/parent-readable objective library
  Filter by learner, subject, phase, strand

/settings
  Child profiles
  Session length preferences
  Audio on/off
  Reduced motion
```

If using hash routing or an existing app router, adapt route names while preserving these screens.

## Core Data Model

Implement equivalent types in TypeScript. Keep these concepts stable even if the database schema differs.

```ts
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
```

## Seed Learner Profiles

```ts
export const learners: LearnerProfile[] = [
  {
    id: "daughter-grade-1",
    displayName: "Grade 1 learner",
    ageYears: 6.5,
    schoolStage: "Grade 1",
    defaultPhase: "phase_2",
    defaultSessionMinutes: 12,
    maxSubjectsPerSession: 2,
  },
  {
    id: "son-kg1",
    displayName: "KG1 learner",
    ageYears: 4.5,
    schoolStage: "KG1",
    defaultPhase: "phase_1",
    defaultSessionMinutes: 8,
    maxSubjectsPerSession: 1,
  },
];
```

## Seed Learning Objectives

Create a data file such as:

```text
src/data/objectives.ts
```

Use this seed list for V1. Add more objectives only after the app structure works.

| ID | Learner | Subject | Phase | Strand | Objective | Module Type |
|---|---|---|---|---|---|---|
| M-KG1-001 | KG1 | maths | phase_1 | Number | Recognize quantities 0-5 without counting | flash_subitizing |
| M-KG1-002 | KG1 | maths | phase_1 | Number | Count objects with one-to-one correspondence and answer “how many?” | drag_count_cardinality |
| M-KG1-003 | KG1 | maths | phase_1 | Pattern and Function | Extend AB and AAB repeating patterns | pattern_builder |
| M-KG1-004 | KG1 | maths | phase_1 | Shape and Space | Sort simple shapes by observable properties | shape_sorter |
| L-KG1-001 | KG1 | literacy | phase_1 | Oral Language | Identify whether two words rhyme | rhyme_detective |
| L-KG1-002 | KG1 | literacy | phase_1 | Reading Readiness | Match uppercase and lowercase letters | letter_twins |
| L-KG1-003 | KG1 | literacy | phase_1 | Print Concepts | Distinguish picture, letter, number, and word | print_concept_sorter |
| S-KG1-001 | KG1 | science | phase_1 | Living Things | Sort living and non-living things using observable criteria | living_nonliving_sort |
| S-KG1-002 | KG1 | science | phase_1 | Materials and Matter | Sort materials by rough/smooth, hard/soft, bendy/rigid | material_lab |
| S-KG1-003 | KG1 | science | phase_1 | Earth and Space | Identify day/night activities and simple cycles | day_night_wheel |
| M-G1-001 | Grade 1 | maths | phase_2 | Number | Model numbers to 100 using tens and ones | drag_count_cardinality |
| M-G1-002 | Grade 1 | maths | phase_2 | Operations | Add and subtract within 20 using visual part-whole strategies | drag_count_cardinality |
| M-G1-003 | Grade 1 | maths | phase_2 | Pattern and Function | Skip count by 2s, 5s, and 10s | pattern_builder |
| M-G1-004 | Grade 1 | maths | phase_2 | Measurement | Tell time to the hour and half-hour | pattern_builder |
| L-G1-001 | Grade 1 | literacy | phase_2 | Phonics | Decode CVC words by blending sounds | sound_builder_cvc |
| L-G1-002 | Grade 1 | literacy | phase_2 | Reading | Read a simple sentence and match it to a picture | sentence_picture_match |
| L-G1-003 | Grade 1 | literacy | phase_2 | Comprehension | Sequence 3-4 story events | story_sequence |
| S-G1-001 | Grade 1 | science | phase_2 | Living Things | Sequence simple plant or animal life cycles | life_cycle_sequence |
| S-G1-002 | Grade 1 | science | phase_2 | Inquiry Skills | Make a prediction and compare it with an observed result | predict_o_meter |
| S-G1-003 | Grade 1 | science | phase_2 | Materials and Matter | Sort objects for reuse/recycling by material properties | recycling_sort |

Each objective must include:

- A child-friendly prompt
- A short parent explanation
- Success criteria
- Misconception tags
- At least one offline extension prompt

Example objective:

```ts
{
  id: "M-KG1-001",
  subject: "maths",
  phase: "phase_1",
  strand: "Number",
  title: "Subitize 0-5",
  objective: "Recognize quantities from 0 to 5 without counting.",
  childFriendlyGoal: "Can you spot how many dots there are super fast?",
  prerequisiteObjectiveIds: [],
  misconceptionTags: ["counts_instead_of_subitizes", "quantity_numeral_mismatch"],
  moduleTypes: ["flash_subitizing"],
  successCriteria: [
    "Identifies quantities 0-5 from dot arrays without counting",
    "Maintains accuracy across at least 3 separate sessions",
    "Can match the quantity to the numeral"
  ],
  offlineExtension: "Show 1-5 fingers quickly and ask: how many did you see?",
  sourceNote: "PYP Mathematics Phase 1 Number: subitizing 0-5, one-to-one correspondence, numeral-quantity connection."
}
```

## Module Specifications

### Shared Module Contract

Every module component must accept:

```ts
type LearningModuleProps = {
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
```

Every module must:

- Display one clear child-friendly goal.
- Keep instructions to one sentence.
- Provide immediate feedback.
- Allow at most 2 hints before simplifying.
- Emit structured error tags.
- Avoid long text for KG1.
- Include `data-testid` attributes on all interactive controls.

### Maths Modules

#### `flash_subitizing`

Purpose: recognize quantities without counting.

Behavior:

- Show a dot array for a brief moment.
- Hide it.
- Ask the child to choose the number.
- For KG1, use 0-5 only.
- For Grade 1, optionally use structured 5-10 arrays later.

Error tags:

- `counts_instead_of_subitizes`
- `quantity_numeral_mismatch`
- `random_guess`

#### `drag_count_cardinality`

Purpose: one-to-one correspondence, cardinality, part-whole, and early operations.

Behavior:

- Child drags objects into a container.
- App asks “How many are there?”
- For Grade 1, show two groups and ask for the total or missing part.

Error tags:

- `skips_object_when_counting`
- `double_counts_object`
- `last_number_not_cardinality`
- `operation_inverse_confusion`

#### `pattern_builder`

Purpose: repeat and extend patterns, then later skip-count patterns.

Behavior:

- KG1: complete AB, AAB, ABC patterns with shapes, colors, sounds, or objects.
- Grade 1: complete number patterns such as 2, 4, 6, __ or 5, 10, 15, __.

Error tags:

- `copies_last_item_only`
- `does_not_detect_unit_of_repeat`
- `skip_count_sequence_error`

#### `shape_sorter`

Purpose: sort and classify shapes by observable properties.

Behavior:

- KG1: sort simple 2D/3D shapes by color, size, or shape family.
- Grade 1 later: sort by sides, corners, faces, edges, or symmetry.

Error tags:

- `sorts_by_color_not_shape`
- `confuses_2d_3d`
- `property_classification_error`

### Literacy Modules

#### `rhyme_detective`

Purpose: phonological awareness.

Behavior:

- Play or show two words.
- Child chooses “rhyme” or “not rhyme.”
- Use picture support for KG1.

Error tags:

- `focuses_on_meaning_not_sound`
- `initial_sound_confusion`

#### `initial_sound_finder`

Purpose: identify first sounds in words.

Behavior:

- Show 3 pictures.
- Play a target sound.
- Child taps the picture beginning with that sound.

Error tags:

- `letter_name_sound_confusion`
- `initial_sound_not_isolated`

#### `letter_twins`

Purpose: match uppercase and lowercase letters.

Behavior:

- Show uppercase cards and lowercase cards.
- Child matches pairs.

Error tags:

- `uppercase_lowercase_mismatch`
- `visually_similar_letter_confusion`

#### `sound_builder_cvc`

Purpose: Grade 1 CVC blending.

Behavior:

- Present three letter tiles.
- Child taps each sound, then blends into the word.
- Show matching image after answer.

Error tags:

- `cannot_blend`
- `medial_vowel_confusion`
- `final_sound_omission`

#### `sentence_picture_match`

Purpose: simple reading comprehension.

Behavior:

- Show one simple sentence.
- Show 3 pictures.
- Child selects the matching picture.

Error tags:

- `guesses_from_first_word`
- `misses_key_detail`
- `decoding_blocks_comprehension`

#### `story_sequence`

Purpose: sequence and comprehension.

Behavior:

- Show 3-4 picture cards.
- Child drags them into story order.

Error tags:

- `sequence_beginning_middle_end_confusion`
- `cause_effect_confusion`

### Science Modules

#### `living_nonliving_sort`

Purpose: living vs non-living criteria.

Behavior:

- Child sorts items into living and non-living.
- Include plants to address the misconception that plants are not alive.

Error tags:

- `plants_not_living`
- `movement_equals_living`
- `natural_equals_living`

#### `material_lab`

Purpose: classify materials by observable properties.

Behavior:

- Child sorts objects by rough/smooth, hard/soft, bendy/rigid, waterproof/not waterproof.
- Use familiar household materials.

Error tags:

- `material_means_fabric_only`
- `appearance_over_property`

#### `day_night_wheel`

Purpose: cycles, day/night, and routines.

Behavior:

- Child rotates a simple Earth/day-night visual or sorts activities into day/night.
- KG1 should focus on observable routines and cycles, not abstract astronomy.

Error tags:

- `cycle_order_confusion`
- `day_night_activity_mismatch`

#### `life_cycle_sequence`

Purpose: sequence living thing stages.

Behavior:

- Grade 1 drags butterfly, frog, plant, or chicken stages into order.

Error tags:

- `life_cycle_order_confusion`
- `growth_not_understood`

#### `predict_o_meter`

Purpose: inquiry cycle.

Behavior:

- Present a scenario: “What will happen if we add water to the plant?”
- Child predicts.
- App shows result.
- Child compares prediction and result.

Error tags:

- `prediction_not_evidence_based`
- `cause_effect_confusion`

#### `recycling_sort`

Purpose: material properties and environmental responsibility.

Behavior:

- Child sorts paper, plastic, metal, glass, food waste, and non-recyclables.
- Keep local rules generic unless a Dubai-specific recycling rule is explicitly added later.

Error tags:

- `material_category_confusion`
- `reuse_recycle_bin_confusion`

## Session Generator Rules

Implement a deterministic function:

```ts
generateSessionPlan({
  learner,
  objectiveProgress,
  recentAttempts,
  today,
}): SessionPlan
```

Rules:

1. KG1:
   - 8 minutes default.
   - 1 subject only.
   - 1-2 modules.
   - No timers.
   - Prefer visual/audio prompts.
2. Grade 1:
   - 12 minutes default.
   - 2 subjects maximum.
   - 2-3 modules.
   - Timed “challenge” only if optional and non-punitive.
3. Always begin with a familiar skill.
4. Introduce at most one new objective per session.
5. If a misconception tag recurs twice in recent attempts, include a remediation module.
6. Mark a skill “consolidated” only after success across at least 3 different sessions on different days.
7. Every fifth exposure to a skill should be a transfer task with different visuals or context.

## Mastery Logic

Implement a simple mastery calculation:

```ts
function calculateMastery(records: AttemptRecord[]): MasteryState {
  // not_started: no records
  // emerging: attempted but inconsistent or high hint usage
  // developing: at least 2 successful sessions with low hint usage
  // consolidated: at least 3 successful sessions on different days, low hints, no recurring major misconception
}
```

Define success as:

- Correct first try or corrected after one hint
- No severe misconception tag
- Completed module without abandonment

Do not expose raw percentages to the child. Parent dashboard may show counts, but the primary labels must be emerging/developing/consolidated.

## Parent Dashboard Requirements

Show:

- Child selector
- This week’s completed sessions
- Current focus skills
- Skill map by subject
- Recent misconception tags translated into parent-friendly language
- One offline extension prompt
- Suggested next session

Parent-friendly misconception examples:

```ts
const misconceptionCopy = {
  counts_instead_of_subitizes:
    "Your child may be counting each dot instead of recognizing small quantities instantly. Try flashing 1-5 fingers quickly and asking how many they saw.",
  last_number_not_cardinality:
    "Your child can recite numbers, but may not yet know that the last number counted tells the total amount.",
  letter_name_sound_confusion:
    "Your child may be mixing up letter names with letter sounds. Practice the sound the letter makes separately from its name.",
  plants_not_living:
    "Your child may think only things that move are alive. Try observing a plant over several days to notice growth and change.",
};
```

## Visual and Interaction Direction

Use a calm, warm, playful visual style:

- Rounded shapes
- Large tap targets
- Soft but high-contrast colors
- Friendly illustrations using CSS/SVG/simple shapes
- Motion that helps explain, not distract
- No generic AI gradient overload
- No cluttered dashboard
- No dark patterns

Suggested palette:

- Background: warm cream
- Primary: bright but soft blue
- Secondary: leafy green
- Accent: sunny yellow or coral
- Feedback success: green
- Feedback retry: amber, not red

Use accessible contrast. Use reduced-motion support.

## Accessibility Requirements

- All interactive elements must be keyboard reachable.
- All buttons need accessible labels.
- Text must meet WCAG AA contrast.
- Provide large touch targets.
- Avoid relying on color alone.
- Add `aria-live` for feedback messages where appropriate.
- Respect reduced motion.
- Include `data-testid` on interactive elements and key dynamic content.

## Implementation Order

Follow this exact order:

1. Create project scaffold or adapt existing app.
2. Add domain types.
3. Add learner seed data.
4. Add objective seed data.
5. Add session generator.
6. Add mastery calculator.
7. Build home learner picker.
8. Build session shell.
9. Implement 3 modules first:
   - `flash_subitizing`
   - `rhyme_detective`
   - `living_nonliving_sort`
10. Wire attempt recording.
11. Build parent dashboard.
12. Add remaining MVP modules.
13. Add tests.
14. Polish visual design.
15. Run full verification.

Do not start with the dashboard before the module and progress core exists.

## Recommended File Structure

If using Next.js:

```text
src/
  app/
    page.tsx
    learn/[learnerId]/page.tsx
    parent/page.tsx
    objectives/page.tsx
    settings/page.tsx
  components/
    layout/
    learner/
    modules/
      FlashSubitizing.tsx
      DragCountCardinality.tsx
      PatternBuilder.tsx
      ShapeSorter.tsx
      RhymeDetective.tsx
      InitialSoundFinder.tsx
      LetterTwins.tsx
      PrintConceptSorter.tsx
      SoundBuilderCvc.tsx
      SentencePictureMatch.tsx
      StorySequence.tsx
      LivingNonlivingSort.tsx
      MaterialLab.tsx
      DayNightWheel.tsx
      LifeCycleSequence.tsx
      PredictOMeter.tsx
      RecyclingSort.tsx
    parent/
    ui/
  data/
    learners.ts
    objectives.ts
    misconception-copy.ts
  domain/
    types.ts
    session-generator.ts
    mastery.ts
    module-registry.ts
  persistence/
    progress-repository.ts
  tests/
```

If using another framework, preserve the same domain separation.

## Testing Requirements

Add unit tests for:

- `generateSessionPlan`
- `calculateMastery`
- objective data validity
- module result emission
- misconception remediation selection

Minimum test cases:

1. KG1 session never exceeds 1 subject.
2. Grade 1 session never exceeds 2 subjects.
3. New session starts with a familiar or developing skill if available.
4. Consolidated requires 3 successful sessions on different days.
5. A repeated misconception triggers a remediation objective.
6. Objective seed data has no missing IDs, duplicate IDs, missing module types, or empty success criteria.

Add smoke tests if possible:

- Home loads.
- Learner can start a session.
- Completing a module records progress.
- Parent dashboard shows updated progress.

## Definition of Done

The task is complete only when:

- The app runs locally.
- Both learner profiles exist.
- Objective seed data is implemented.
- At least 3 module types are playable end-to-end.
- Session generator works for both learners.
- Attempt records update progress.
- Parent dashboard shows progress and parent-friendly next steps.
- Tests pass.
- The UI is child-friendly and accessible.
- The README explains how to run, test, and extend the module library.

## README Requirements

Create or update `README.md` with:

- Project purpose
- Stack
- How to run
- How to test
- Where objectives live
- How to add a new objective
- How to add a new module
- PYP alignment caveat
- Privacy note for child data

Include this caveat:

```md
This app is an independent home-practice tool inspired by IB PYP learning principles. It is not an official International Baccalaureate product, does not represent any specific school’s Programme of Inquiry, and should not be used as a replacement for school instruction.
```

## Claude Code Working Rules

When implementing:

1. First inspect the repo and identify the stack.
2. If empty, scaffold the recommended Next.js TypeScript app.
3. Create a concise implementation plan before editing.
4. Implement in small commits or logical checkpoints.
5. Keep curriculum data separate from UI components.
6. Do not hard-code all module content inside components.
7. Do not add external paid APIs.
8. Do not add user authentication in V1 unless the repo already has it.
9. Do not use AI-generated reading passages in V1 unless explicitly requested.
10. Run tests and lint/build before reporting completion.

## Future Enhancements After MVP

Do not implement these in the first pass unless everything above is complete:

- School Unit of Inquiry alignment
- Teacher/tutor export
- Parent-created practice playlists
- Voice narration with recorded audio
- AI-generated adaptive content
- Supabase/cloud sync
- Printable offline activity cards
- Multi-language literacy support
- More detailed phonics programme alignment
