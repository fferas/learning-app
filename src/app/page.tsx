import { learners } from "@/data/learners";
import { LearnerCard } from "@/components/learner/LearnerCard";

export default function Home() {
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Who is learning today? 🌟
        </h1>
        <p className="text-gray-500 text-lg">
          Pick your name to start your learning session!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-xl">
        {learners.map((learner) => (
          <LearnerCard key={learner.id} learner={learner} />
        ))}
      </div>

      <div className="mt-4 bg-white rounded-3xl shadow-sm p-6 max-w-xl w-full">
        <h2 className="font-bold text-gray-700 mb-3">About this app</h2>
        <p className="text-sm text-gray-500 leading-relaxed">
          Short, playful learning sessions designed for early years learners.
          Practice maths, literacy, and science in a fun, supportive way.
          Sessions take 8–15 minutes — just right for little learners!
        </p>
      </div>
    </div>
  );
}
