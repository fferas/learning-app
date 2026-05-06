import SessionPage from "./SessionPage";

export function generateStaticParams() {
  return [{ learnerId: "daughter-grade-1" }, { learnerId: "son-kg1" }];
}

export default function Page({
  params,
}: {
  params: Promise<{ learnerId: string }>;
}) {
  return <SessionPage params={params} />;
}
