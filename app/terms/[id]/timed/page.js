import { notFound } from "next/navigation";
import { termBlocks } from "@/data/terms";
import TimedClient from "./TimedClient";

export default async function TimedPage({ params }) {
  const { id } = await params;
  const blockId = parseInt(id, 10);
  const block = termBlocks.find((b) => b.id === blockId);

  if (!block) {
    notFound();
  }

  return <TimedClient block={block} />;
}
