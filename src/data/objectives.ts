import { LearningObjective } from "@/domain/types";

export const objectives: LearningObjective[] = [
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
      "Can match the quantity to the numeral",
    ],
    offlineExtension:
      "Show 1-5 fingers quickly and ask: how many did you see?",
    sourceNote:
      "PYP Mathematics Phase 1 Number: subitizing 0-5, one-to-one correspondence, numeral-quantity connection.",
  },
  {
    id: "M-KG1-002",
    subject: "maths",
    phase: "phase_1",
    strand: "Number",
    title: "Count with one-to-one correspondence",
    objective:
      "Count objects with one-to-one correspondence and answer 'how many?'",
    childFriendlyGoal: "Count each object and tell me: how many are there?",
    prerequisiteObjectiveIds: ["M-KG1-001"],
    misconceptionTags: [
      "skips_object_when_counting",
      "double_counts_object",
      "last_number_not_cardinality",
    ],
    moduleTypes: ["drag_count_cardinality"],
    successCriteria: [
      "Counts up to 10 objects accurately, one touch per object",
      "States the total without re-counting after counting",
      "Understands that the last number said is 'how many'",
    ],
    offlineExtension:
      "Count grapes or raisins together. Ask: how many did you count? Does the number change if I mix them up?",
    sourceNote:
      "PYP Mathematics Phase 1 Number: one-to-one correspondence, cardinality principle.",
  },
  {
    id: "M-KG1-003",
    subject: "maths",
    phase: "phase_1",
    strand: "Pattern and Function",
    title: "Extend AB and AAB patterns",
    objective: "Extend AB and AAB repeating patterns.",
    childFriendlyGoal: "What comes next in the pattern?",
    prerequisiteObjectiveIds: [],
    misconceptionTags: [
      "copies_last_item_only",
      "does_not_detect_unit_of_repeat",
    ],
    moduleTypes: ["pattern_builder"],
    successCriteria: [
      "Identifies the repeating unit in a simple AB pattern",
      "Extends an AB or AAB pattern by at least two more elements",
      "Can create their own AB pattern",
    ],
    offlineExtension:
      "Clap-snap-clap-snap together. Ask: what comes next? Make a pattern with cups and spoons.",
    sourceNote:
      "PYP Mathematics Phase 1 Pattern and Function: repeating patterns, identifying units of repeat.",
  },
  {
    id: "M-KG1-004",
    subject: "maths",
    phase: "phase_1",
    strand: "Shape and Space",
    title: "Sort shapes by observable properties",
    objective: "Sort simple shapes by observable properties.",
    childFriendlyGoal: "Can you sort these shapes into groups?",
    prerequisiteObjectiveIds: [],
    misconceptionTags: ["sorts_by_color_not_shape", "confuses_2d_3d"],
    moduleTypes: ["shape_sorter"],
    successCriteria: [
      "Identifies circles, squares, triangles, and rectangles by name",
      "Groups shapes by the same property consistently",
      "Can say why a shape belongs in a group",
    ],
    offlineExtension:
      "Go on a shape hunt at home. Find things that are round, square, or triangle-shaped.",
    sourceNote:
      "PYP Mathematics Phase 1 Shape and Space: sorting by shape properties, 2D shape recognition.",
  },
  {
    id: "L-KG1-001",
    subject: "literacy",
    phase: "phase_1",
    strand: "Oral Language",
    title: "Identify rhyming words",
    objective: "Identify whether two words rhyme.",
    childFriendlyGoal: "Do these two words rhyme? Listen to the endings!",
    prerequisiteObjectiveIds: [],
    misconceptionTags: [
      "focuses_on_meaning_not_sound",
      "initial_sound_confusion",
    ],
    moduleTypes: ["rhyme_detective"],
    successCriteria: [
      "Correctly identifies matching and non-matching word endings",
      "Can produce a rhyming word when given a prompt",
      "Explains that rhyming means the endings sound the same",
    ],
    offlineExtension:
      "Play 'rhyme or not?' during bath time or a car ride. Say two words; ask if they rhyme.",
    sourceNote:
      "PYP Language Phase 1 Oral Language: phonological awareness, rhyme recognition.",
  },
  {
    id: "L-KG1-002",
    subject: "literacy",
    phase: "phase_1",
    strand: "Reading Readiness",
    title: "Match uppercase and lowercase letters",
    objective: "Match uppercase and lowercase letters.",
    childFriendlyGoal: "Find the little letter that matches the big letter!",
    prerequisiteObjectiveIds: [],
    misconceptionTags: [
      "uppercase_lowercase_mismatch",
      "visually_similar_letter_confusion",
    ],
    moduleTypes: ["letter_twins"],
    successCriteria: [
      "Matches all 26 uppercase letters to their lowercase partners",
      "Distinguishes visually similar pairs (b/d, p/q, m/w)",
      "Names letters consistently",
    ],
    offlineExtension:
      "Use alphabet fridge magnets. Ask your child to find the big letter and its little twin.",
    sourceNote:
      "PYP Language Phase 1 Reading: letter recognition, uppercase-lowercase correspondence.",
  },
  {
    id: "L-KG1-003",
    subject: "literacy",
    phase: "phase_1",
    strand: "Print Concepts",
    title: "Distinguish letters, numbers, words, and pictures",
    objective: "Distinguish picture, letter, number, and word.",
    childFriendlyGoal: "Is this a picture, a letter, a number, or a word?",
    prerequisiteObjectiveIds: [],
    misconceptionTags: [],
    moduleTypes: ["print_concept_sorter"],
    successCriteria: [
      "Correctly labels examples of letters, numbers, words, and pictures",
      "Understands that words are made of letters",
      "Knows that print carries meaning",
    ],
    offlineExtension:
      "Look at a cereal box together. Point to a letter, a number, a word. Ask: what is this?",
    sourceNote:
      "PYP Language Phase 1 Print Concepts: print awareness, forms of print.",
  },
  {
    id: "S-KG1-001",
    subject: "science",
    phase: "phase_1",
    strand: "Living Things",
    title: "Sort living and non-living things",
    objective: "Sort living and non-living things using observable criteria.",
    childFriendlyGoal: "Is it alive or not alive? Let's sort!",
    prerequisiteObjectiveIds: [],
    misconceptionTags: [
      "plants_not_living",
      "movement_equals_living",
      "natural_equals_living",
    ],
    moduleTypes: ["living_nonliving_sort"],
    successCriteria: [
      "Sorts living and non-living correctly using criteria like growth, needs food/water",
      "Includes plants in the living category",
      "Can justify their sorting with an observable reason",
    ],
    offlineExtension:
      "Walk around your home or garden. Point to things and ask: is this alive? How do you know?",
    sourceNote:
      "PYP Science Phase 1 Living Things: characteristics of living things, basic classification.",
  },
  {
    id: "S-KG1-002",
    subject: "science",
    phase: "phase_1",
    strand: "Materials and Matter",
    title: "Sort materials by properties",
    objective:
      "Sort materials by rough/smooth, hard/soft, bendy/rigid.",
    childFriendlyGoal: "Let's sort things by how they feel!",
    prerequisiteObjectiveIds: [],
    misconceptionTags: [
      "material_means_fabric_only",
      "appearance_over_property",
    ],
    moduleTypes: ["material_lab"],
    successCriteria: [
      "Sorts household objects by at least two contrasting properties",
      "Uses property words (rough, smooth, hard, soft, bendy, rigid) accurately",
      "Understands that the same object can have multiple properties",
    ],
    offlineExtension:
      "Collect 5 household objects. Feel each one. Is it hard or soft? Rough or smooth?",
    sourceNote:
      "PYP Science Phase 1 Materials and Matter: observable material properties.",
  },
  {
    id: "S-KG1-003",
    subject: "science",
    phase: "phase_1",
    strand: "Earth and Space",
    title: "Identify day/night activities and cycles",
    objective:
      "Identify day/night activities and simple cycles.",
    childFriendlyGoal: "Which things happen in the day, and which at night?",
    prerequisiteObjectiveIds: [],
    misconceptionTags: ["cycle_order_confusion", "day_night_activity_mismatch"],
    moduleTypes: ["day_night_wheel"],
    successCriteria: [
      "Correctly matches daily activities to day or night",
      "Understands that day and night follow a cycle",
      "Can describe a simple daily routine using time words",
    ],
    offlineExtension:
      "At bedtime, talk through what happened during the day. Tomorrow, talk about what will happen tonight.",
    sourceNote:
      "PYP Science Phase 1 Earth and Space: observable patterns of day and night.",
  },
  {
    id: "M-G1-001",
    subject: "maths",
    phase: "phase_2",
    strand: "Number",
    title: "Model numbers to 100",
    objective:
      "Model numbers to 100 using tens and ones.",
    childFriendlyGoal: "How many tens and ones make this number?",
    prerequisiteObjectiveIds: ["M-KG1-002"],
    misconceptionTags: [
      "quantity_numeral_mismatch",
      "last_number_not_cardinality",
    ],
    moduleTypes: ["drag_count_cardinality"],
    successCriteria: [
      "Represents two-digit numbers using tens and ones",
      "Reads and writes numbers to 100",
      "Understands that the digit position affects its value",
    ],
    offlineExtension:
      "Use bundles of 10 pencils and single pencils to build two-digit numbers.",
    sourceNote:
      "PYP Mathematics Phase 2 Number: place value, two-digit numbers, tens and ones.",
  },
  {
    id: "M-G1-002",
    subject: "maths",
    phase: "phase_2",
    strand: "Operations",
    title: "Add and subtract within 20",
    objective:
      "Add and subtract within 20 using visual part-whole strategies.",
    childFriendlyGoal: "How many altogether? How many are left?",
    prerequisiteObjectiveIds: ["M-G1-001"],
    misconceptionTags: [
      "operation_inverse_confusion",
      "last_number_not_cardinality",
    ],
    moduleTypes: ["drag_count_cardinality"],
    successCriteria: [
      "Adds two groups to find a total within 20",
      "Subtracts from a group and states what is left",
      "Uses a part-whole model to show addition and subtraction",
    ],
    offlineExtension:
      "Use small toys or fruit pieces. Make two groups, count all, then take some away.",
    sourceNote:
      "PYP Mathematics Phase 2 Operations: addition and subtraction within 20, part-whole thinking.",
  },
  {
    id: "M-G1-003",
    subject: "maths",
    phase: "phase_2",
    strand: "Pattern and Function",
    title: "Skip count by 2s, 5s, and 10s",
    objective: "Skip count by 2s, 5s, and 10s.",
    childFriendlyGoal: "Let's count in jumps! 2, 4, 6... what comes next?",
    prerequisiteObjectiveIds: ["M-KG1-003"],
    misconceptionTags: ["skip_count_sequence_error", "does_not_detect_unit_of_repeat"],
    moduleTypes: ["pattern_builder"],
    successCriteria: [
      "Skip counts by 2s to 20",
      "Skip counts by 5s to 50",
      "Skip counts by 10s to 100",
    ],
    offlineExtension:
      "Count your fingers by 2s, 5s, or 10s while jumping on the spot.",
    sourceNote:
      "PYP Mathematics Phase 2 Pattern and Function: number patterns, skip counting.",
  },
  {
    id: "M-G1-004",
    subject: "maths",
    phase: "phase_2",
    strand: "Measurement",
    title: "Tell time to the hour and half-hour",
    objective: "Tell time to the hour and half-hour.",
    childFriendlyGoal: "What time does the clock show?",
    prerequisiteObjectiveIds: [],
    misconceptionTags: ["cycle_order_confusion"],
    moduleTypes: ["pattern_builder"],
    successCriteria: [
      "Reads analog clock to the hour",
      "Reads analog clock to the half-hour",
      "Connects times to daily routine events",
    ],
    offlineExtension:
      "Ask your child to read the clock when you have a meal or activity. Set an alarm together and read the time.",
    sourceNote:
      "PYP Mathematics Phase 2 Measurement: time, telling time to the hour and half-hour.",
  },
  {
    id: "L-G1-001",
    subject: "literacy",
    phase: "phase_2",
    strand: "Phonics",
    title: "Decode CVC words",
    objective: "Decode CVC words by blending sounds.",
    childFriendlyGoal: "Tap each sound, then blend them into a word!",
    prerequisiteObjectiveIds: ["L-KG1-002"],
    misconceptionTags: [
      "cannot_blend",
      "medial_vowel_confusion",
      "final_sound_omission",
    ],
    moduleTypes: ["sound_builder_cvc"],
    successCriteria: [
      "Segments a CVC word into three sounds",
      "Blends three sounds into a recognizable word",
      "Decodes at least 10 CVC words accurately",
    ],
    offlineExtension:
      "Play 'robot talk'. Say a word in sounds (c-a-t) and ask your child to say it fast.",
    sourceNote:
      "PYP Language Phase 2 Phonics: CVC word decoding, phoneme blending.",
  },
  {
    id: "L-G1-002",
    subject: "literacy",
    phase: "phase_2",
    strand: "Reading",
    title: "Match sentence to picture",
    objective:
      "Read a simple sentence and match it to a picture.",
    childFriendlyGoal: "Read the sentence, then find the right picture!",
    prerequisiteObjectiveIds: ["L-G1-001"],
    misconceptionTags: [
      "guesses_from_first_word",
      "misses_key_detail",
      "decoding_blocks_comprehension",
    ],
    moduleTypes: ["sentence_picture_match"],
    successCriteria: [
      "Reads a simple 4-6 word sentence accurately",
      "Identifies the picture that matches all key details",
      "Rereads if the first guess doesn't match the picture",
    ],
    offlineExtension:
      "Read a simple picture book. Point to a sentence. Ask: which picture matches this?",
    sourceNote:
      "PYP Language Phase 2 Reading: simple sentence reading, picture-text matching.",
  },
  {
    id: "L-G1-003",
    subject: "literacy",
    phase: "phase_2",
    strand: "Comprehension",
    title: "Sequence story events",
    objective: "Sequence 3-4 story events.",
    childFriendlyGoal: "Put the story pictures in the right order!",
    prerequisiteObjectiveIds: ["L-G1-002"],
    misconceptionTags: [
      "sequence_beginning_middle_end_confusion",
      "cause_effect_confusion",
    ],
    moduleTypes: ["story_sequence"],
    successCriteria: [
      "Places 3 events in correct story order",
      "Uses words like 'first, then, last' to describe the order",
      "Can explain why one event comes before another",
    ],
    offlineExtension:
      "After reading a book, draw 3 pictures of what happened. Put them in order and retell the story.",
    sourceNote:
      "PYP Language Phase 2 Comprehension: story sequence, narrative structure.",
  },
  {
    id: "S-G1-001",
    subject: "science",
    phase: "phase_2",
    strand: "Living Things",
    title: "Sequence life cycles",
    objective:
      "Sequence simple plant or animal life cycles.",
    childFriendlyGoal: "Put the life cycle stages in the right order!",
    prerequisiteObjectiveIds: ["S-KG1-001"],
    misconceptionTags: [
      "life_cycle_order_confusion",
      "growth_not_understood",
    ],
    moduleTypes: ["life_cycle_sequence"],
    successCriteria: [
      "Places 4 life cycle stages in correct order",
      "Names the stages of at least one life cycle",
      "Understands that growth is a change over time",
    ],
    offlineExtension:
      "Look at photos of a family member (or plant) growing from baby to now. Arrange them in order.",
    sourceNote:
      "PYP Science Phase 2 Living Things: life cycles, growth and change.",
  },
  {
    id: "S-G1-002",
    subject: "science",
    phase: "phase_2",
    strand: "Inquiry Skills",
    title: "Predict and compare results",
    objective:
      "Make a prediction and compare it with an observed result.",
    childFriendlyGoal: "What do you think will happen? Let's find out!",
    prerequisiteObjectiveIds: [],
    misconceptionTags: [
      "prediction_not_evidence_based",
      "cause_effect_confusion",
    ],
    moduleTypes: ["predict_o_meter"],
    successCriteria: [
      "States a prediction before seeing the result",
      "Uses clues or prior knowledge to justify the prediction",
      "Compares prediction to actual result without embarrassment",
    ],
    offlineExtension:
      "Before watering a wilting plant, ask: what do you think will happen? Check again tomorrow.",
    sourceNote:
      "PYP Science Phase 2 Inquiry Skills: prediction, observation, comparison.",
  },
  {
    id: "S-G1-003",
    subject: "science",
    phase: "phase_2",
    strand: "Materials and Matter",
    title: "Sort objects for reuse and recycling",
    objective:
      "Sort objects for reuse/recycling by material properties.",
    childFriendlyGoal: "Which bin does this belong in?",
    prerequisiteObjectiveIds: ["S-KG1-002"],
    misconceptionTags: [
      "material_category_confusion",
      "reuse_recycle_bin_confusion",
    ],
    moduleTypes: ["recycling_sort"],
    successCriteria: [
      "Correctly sorts paper, glass, plastic, and food waste",
      "Explains why a material goes in a specific bin",
      "Distinguishes between items to reuse and items to recycle",
    ],
    offlineExtension:
      "Sort this week's recyclables together. Ask: what is this made of? Where should it go?",
    sourceNote:
      "PYP Science Phase 2 Materials and Matter: material properties, environmental responsibility.",
  },
];
