import { ObjectiveProgress, Subject } from "@/domain/types";
import { objectives } from "@/data/objectives";

interface SkillMapProps {
  progress: ObjectiveProgress[];
}

const masteryColors = {
  not_started: "bg-gray-100 text-gray-500",
  emerging: "bg-amber-100 text-amber-700",
  developing: "bg-blue-100 text-blue-700",
  consolidated: "bg-green-100 text-green-700",
};

const masteryLabels = {
  not_started: "Not started",
  emerging: "Emerging",
  developing: "Developing",
  consolidated: "Consolidated",
};

const subjectEmojis: Record<Subject, string> = {
  maths: "🔢",
  literacy: "📚",
  science: "🔬",
};

export function SkillMap({ progress }: SkillMapProps) {
  const subjects: Subject[] = ["maths", "literacy", "science"];

  return (
    <div className="flex flex-col gap-6">
      {subjects.map((subject) => {
        const subjectObjectives = objectives.filter(
          (o) => o.subject === subject
        );
        const subjectProgress = subjectObjectives.map((obj) => ({
          obj,
          prog: progress.find((p) => p.objectiveId === obj.id),
        }));

        const counts = {
          not_started: subjectProgress.filter(
            (s) => !s.prog || s.prog.masteryState === "not_started"
          ).length,
          emerging: subjectProgress.filter(
            (s) => s.prog?.masteryState === "emerging"
          ).length,
          developing: subjectProgress.filter(
            (s) => s.prog?.masteryState === "developing"
          ).length,
          consolidated: subjectProgress.filter(
            (s) => s.prog?.masteryState === "consolidated"
          ).length,
        };

        return (
          <div key={subject}>
            <h3 className="font-bold text-gray-700 mb-3 capitalize flex items-center gap-2">
              <span>{subjectEmojis[subject]}</span>
              {subject}
            </h3>

            <div className="flex gap-2 mb-3 flex-wrap">
              {Object.entries(counts)
                .filter(([, count]) => count > 0)
                .map(([state, count]) => (
                  <span
                    key={state}
                    className={`text-xs px-3 py-1 rounded-full font-semibold ${masteryColors[state as keyof typeof masteryColors]}`}
                  >
                    {count} {masteryLabels[state as keyof typeof masteryLabels]}
                  </span>
                ))}
            </div>

            <div className="flex flex-col gap-2">
              {subjectProgress.map(({ obj, prog }) => {
                const state = prog?.masteryState || "not_started";
                return (
                  <div
                    key={obj.id}
                    className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2"
                  >
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold ${masteryColors[state]}`}
                    >
                      {masteryLabels[state]}
                    </span>
                    <span className="text-sm text-gray-700">{obj.title}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
