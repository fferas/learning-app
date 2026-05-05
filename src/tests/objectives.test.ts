import { describe, it, expect } from "vitest";
import { objectives } from "@/data/objectives";

describe("objectives seed data", () => {
  it("has no duplicate IDs", () => {
    const ids = objectives.map((o) => o.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it("all objectives have non-empty IDs", () => {
    for (const o of objectives) {
      expect(o.id).toBeTruthy();
    }
  });

  it("all objectives have at least one module type", () => {
    for (const o of objectives) {
      expect(o.moduleTypes.length).toBeGreaterThan(0);
    }
  });

  it("all objectives have success criteria", () => {
    for (const o of objectives) {
      expect(o.successCriteria.length).toBeGreaterThan(0);
    }
  });

  it("all objectives have a child-friendly goal", () => {
    for (const o of objectives) {
      expect(o.childFriendlyGoal).toBeTruthy();
    }
  });

  it("all objectives have a source note", () => {
    for (const o of objectives) {
      expect(o.sourceNote).toBeTruthy();
    }
  });

  it("all objectives have a valid subject", () => {
    const validSubjects = ["maths", "literacy", "science"];
    for (const o of objectives) {
      expect(validSubjects).toContain(o.subject);
    }
  });

  it("all objectives have a valid phase", () => {
    const validPhases = ["phase_1", "phase_2"];
    for (const o of objectives) {
      expect(validPhases).toContain(o.phase);
    }
  });

  it("all objectives have a non-empty title", () => {
    for (const o of objectives) {
      expect(o.title).toBeTruthy();
    }
  });

  it("all objectives have a non-empty strand", () => {
    for (const o of objectives) {
      expect(o.strand).toBeTruthy();
    }
  });

  it("has 20 total objectives", () => {
    expect(objectives.length).toBe(20);
  });

  it("has phase_1 objectives for KG1", () => {
    const phase1 = objectives.filter((o) => o.phase === "phase_1");
    expect(phase1.length).toBeGreaterThan(0);
  });

  it("has phase_2 objectives for Grade 1", () => {
    const phase2 = objectives.filter((o) => o.phase === "phase_2");
    expect(phase2.length).toBeGreaterThan(0);
  });

  it("each subject has at least one objective per phase", () => {
    const subjects = ["maths", "literacy", "science"];
    const phases = ["phase_1", "phase_2"];
    for (const subject of subjects) {
      for (const phase of phases) {
        const found = objectives.filter(
          (o) => o.subject === subject && o.phase === phase
        );
        expect(found.length).toBeGreaterThan(0);
      }
    }
  });

  it("all module types referenced in objectives are valid", () => {
    const validModuleTypes = [
      "flash_subitizing",
      "drag_count_cardinality",
      "pattern_builder",
      "shape_sorter",
      "rhyme_detective",
      "initial_sound_finder",
      "letter_twins",
      "print_concept_sorter",
      "sound_builder_cvc",
      "sight_word_lightning",
      "sentence_picture_match",
      "story_sequence",
      "living_nonliving_sort",
      "material_lab",
      "day_night_wheel",
      "life_cycle_sequence",
      "predict_o_meter",
      "recycling_sort",
    ];
    for (const o of objectives) {
      for (const mt of o.moduleTypes) {
        expect(validModuleTypes).toContain(mt);
      }
    }
  });
});
