import { notFound } from "next/navigation";
import { termBlocks } from "@/data/terms";
import CardsClient from "./CardsClient";

export default async function CardsPage({ params }) {
  const { id } = await params;
  const blockId = parseInt(id, 10);
  const block = termBlocks.find((b) => b.id === blockId);

  if (!block) {
    notFound();
  }

  return <CardsClient block={block} />;
}
