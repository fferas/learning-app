"use client";

import { ModuleType } from "./types";
import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { LearningModuleProps } from "./types";

export const moduleComponents: Record<
  ModuleType,
  ComponentType<LearningModuleProps>
> = {
  flash_subitizing: dynamic(
    () => import("@/components/modules/FlashSubitizing")
  ),
  drag_count_cardinality: dynamic(
    () => import("@/components/modules/DragCountCardinality")
  ),
  pattern_builder: dynamic(
    () => import("@/components/modules/PatternBuilder")
  ),
  shape_sorter: dynamic(() => import("@/components/modules/ShapeSorter")),
  rhyme_detective: dynamic(
    () => import("@/components/modules/RhymeDetective")
  ),
  initial_sound_finder: dynamic(
    () => import("@/components/modules/InitialSoundFinder")
  ),
  letter_twins: dynamic(() => import("@/components/modules/LetterTwins")),
  print_concept_sorter: dynamic(
    () => import("@/components/modules/PrintConceptSorter")
  ),
  sound_builder_cvc: dynamic(
    () => import("@/components/modules/SoundBuilderCvc")
  ),
  sight_word_lightning: dynamic(
    () => import("@/components/modules/SoundBuilderCvc")
  ),
  sentence_picture_match: dynamic(
    () => import("@/components/modules/SentencePictureMatch")
  ),
  story_sequence: dynamic(
    () => import("@/components/modules/StorySequence")
  ),
  living_nonliving_sort: dynamic(
    () => import("@/components/modules/LivingNonlivingSort")
  ),
  material_lab: dynamic(() => import("@/components/modules/MaterialLab")),
  day_night_wheel: dynamic(
    () => import("@/components/modules/DayNightWheel")
  ),
  life_cycle_sequence: dynamic(
    () => import("@/components/modules/LifeCycleSequence")
  ),
  predict_o_meter: dynamic(
    () => import("@/components/modules/PredictOMeter")
  ),
  recycling_sort: dynamic(
    () => import("@/components/modules/RecyclingSort")
  ),
};
