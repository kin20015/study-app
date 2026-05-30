import { notFound } from "next/navigation";
import { termBlocks } from "@/data/terms";
import PairsClient from "./PairsClient";

export default async function PairsPage({ params }) {
  const { id } = await params;
  const blockId = parseInt(id, 10);
  const block = termBlocks.find((b) => b.id === blockId);

  if (!block) {
    notFound();
  }

  return <PairsClient block={block} />;
}
