import Link from "next/link";
import { LearnerProfile } from "@/domain/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { GirlAvatar } from "@/components/ui/GirlAvatar";

const stageColors: Record<string, string> = {
  "Grade 1": "bg-blue-100 text-blue-700",
  KG1: "bg-green-100 text-green-700",
};

export function LearnerCard({ learner }: { learner: LearnerProfile }) {
  const stageColor =
    stageColors[learner.schoolStage] || "bg-gray-100 text-gray-700";

  return (
    <Card className="flex flex-col items-center gap-4 text-center hover:shadow-lg transition-shadow">
      <div role="img" aria-label={learner.displayName}>
        {learner.id === "daughter-grade-1" ? (
          <GirlAvatar size={72} />
        ) : (
          <span className="text-7xl">👦</span>
        )}
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-800">
          {learner.displayName}
        </h2>
        <span
          className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-semibold ${stageColor}`}
        >
          {learner.schoolStage}
        </span>
      </div>
      <p className="text-gray-500 text-sm">
        {learner.defaultSessionMinutes} min sessions &middot; Age{" "}
        {learner.ageYears}
      </p>
      <Link href={`/learn/${learner.id}`} className="w-full">
        <Button size="lg" className="w-full" data-testid={`start-learning-${learner.id}`}>
          Start Learning ✨
        </Button>
      </Link>
    </Card>
  );
}
