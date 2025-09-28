import React from "react";
import CompleteProjectIdeas from "./CompleteProjectIdeas";
import { useRouter, useSearchParams } from "next/navigation";
import { ideas } from "./Data";

const IdeaDetailsPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ideaId = Number(searchParams.get("id"));
  // Use static data from Data.ts for hydration safety
  const idea = ideas.find((i) => i.id === ideaId);

  if (!idea) {
    return <div className="p-8 text-center text-red-600">Idea not found.</div>;
  }

  return (
    <CompleteProjectIdeas idea={idea} onBack={() => router.back()} />
  );
};

export default IdeaDetailsPage;
