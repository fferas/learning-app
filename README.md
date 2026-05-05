# IB PYP Learning Practice App

A child-friendly, playful home-practice web app for early years learners in a Dubai IB school. Designed for a Grade 1 learner (age 6.5) and a KG1 learner (age 4.5) to practice maths, literacy, and science in short daily sessions.

---

> **Important notice:** This app is an independent home-practice tool inspired by IB PYP learning principles. It is not an official International Baccalaureate product, does not represent any specific school's Programme of Inquiry, and should not be used as a replacement for school instruction.

---

## Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS 4**
- **Vitest** for unit tests
- **localStorage** for client-side progress persistence (no server required)

## How to Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Test

```bash
npm test
```

Tests cover:
- `generateSessionPlan` — subject limits, ordering, module count
- `calculateMastery` — emerging/developing/consolidated thresholds
- `buildObjectiveProgress` — session counts, error tag detection
- Objective seed data validity — no duplicate IDs, valid module types, non-empty fields

## Where Objectives Live

All learning objectives are defined in:

```
src/data/objectives.ts
```

Each objective has:
- A unique ID (e.g., `M-KG1-001`, `L-G1-002`)
- Subject, phase, strand, title
- Child-friendly goal (shown in the module UI)
- Success criteria
- Misconception tags
- At least one offline extension prompt
- A source note referencing the PYP scope document

## How to Add a New Objective

1. Open `src/data/objectives.ts`
2. Add a new `LearningObjective` object to the `objectives` array
3. Use the existing IDs as a guide for naming: `{Subject}-{Learner}-{NNN}`
4. Assign at least one `moduleType` from the `ModuleType` union in `src/domain/types.ts`
5. Provide `successCriteria`, `misconceptionTags`, and `offlineExtension`

Example:
```ts
{
  id: "M-KG1-005",
  subject: "maths",
  phase: "phase_1",
  strand: "Measurement",
  title: "Compare lengths",
  objective: "Compare and order objects by length using direct comparison.",
  childFriendlyGoal: "Which one is longer?",
  prerequisiteObjectiveIds: [],
  misconceptionTags: ["sorts_by_color_not_shape"],
  moduleTypes: ["shape_sorter"],
  successCriteria: ["Compares two objects directly", "Uses words longer, shorter, same"],
  offlineExtension: "Compare two pencils. Which is longer?",
  sourceNote: "PYP Mathematics Phase 1 Measurement.",
}
```

## How to Add a New Module

1. Create a new file in `src/components/modules/MyNewModule.tsx`
2. The component must accept `LearningModuleProps` from `src/domain/types.ts`
3. Call `onComplete({ correctFirstTry, attempts, hintsUsed, errorTags })` when done
4. Add a `"use client"` directive at the top
5. Add `data-testid` attributes to interactive elements
6. Register the module in `src/domain/module-registry.ts`
7. Add the new `ModuleType` string to the `ModuleType` union in `src/domain/types.ts`
8. Reference the new module type in at least one objective in `src/data/objectives.ts`

## File Structure

```
src/
  app/
    page.tsx                    # Home — learner picker
    learn/[learnerId]/page.tsx  # Session flow
    parent/page.tsx             # Parent dashboard
    objectives/page.tsx         # Objective library
    settings/page.tsx           # Settings
  components/
    modules/                    # 18 interactive learning modules
    ui/                         # Button, Card, ProgressBar
    learner/                    # LearnerCard
    parent/                     # SessionSummary, SkillMap
  data/
    learners.ts                 # Two learner profiles
    objectives.ts               # 20 seed objectives
    misconception-copy.ts       # Parent-friendly misconception text
  domain/
    types.ts                    # All TypeScript types
    session-generator.ts        # Deterministic session planner
    mastery.ts                  # Mastery calculator
    module-registry.ts          # Maps ModuleType → React component
  persistence/
    progress-repository.ts      # localStorage read/write
  tests/
    session-generator.test.ts
    mastery.test.ts
    objectives.test.ts
```

## PYP Alignment

Objectives are organised by PYP phase (Phase 1 = KG1, Phase 2 = Grade 1) and strand, following the public PYP Mathematics, Language, and Science scope and sequence documents. Mastery is tracked as **emerging → developing → consolidated** rather than percentages or grades, in keeping with IB's emphasis on learner growth over time.

## Privacy

All progress data is stored locally in the browser using `localStorage`. No data is transmitted to any server. You can clear all data from the Settings page.
