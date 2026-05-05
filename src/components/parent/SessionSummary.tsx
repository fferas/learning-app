import { AttemptRecord } from "@/domain/types";
import { objectives } from "@/data/objectives";

interface SessionSummaryProps {
  sessionId: string;
  attempts: AttemptRecord[];
}

export function SessionSummary({ sessionId, attempts }: SessionSummaryProps) {
  const sessionAttempts = attempts.filter((a) => a.sessionId === sessionId);
  if (sessionAttempts.length === 0) return null;

  const date = new Date(sessionAttempts[0].startedAt).toLocaleDateString(
    "en-AE",
    { weekday: "short", month: "short", day: "numeric" }
  );

  const subjects = new Set(
    sessionAttempts.map((a) => {
      const obj = objectives.find((o) => o.id === a.objectiveId);
      return obj?.subject || "unknown";
    })
  );

  const successCount = sessionAttempts.filter(
    (a) => a.correctFirstTry || a.attempts <= 2
  ).length;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-gray-700">{date}</span>
        <div className="flex gap-2">
          {[...subjects].map((s) => (
            <span
              key={s}
              className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 capitalize font-semibold"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
      <p className="text-sm text-gray-500">
        {sessionAttempts.length} module{sessionAttempts.length !== 1 ? "s" : ""}{" "}
        &middot; {successCount} of {sessionAttempts.length} succeeded
      </p>
    </div>
  );
}
