import Link from "next/link";
import { termBlocks } from "@/data/terms";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="text-sm text-zinc-600 hover:text-zinc-900 mb-6 inline-block"
        >
          ← На главную
        </Link>

        <h1 className="text-3xl font-bold text-zinc-900 mb-2">📖 Термины</h1>
        <p className="text-zinc-600 mb-8">
          Выбери блок, чтобы тренировать термины
        </p>

        <div className="flex flex-col gap-3">
          {termBlocks.map((block) => (
            <Link
              key={block.id}
              href={`/terms/${block.id}`}
              className="bg-white border border-zinc-200 hover:border-zinc-900 hover:shadow-md transition-all rounded-2xl p-5 flex items-center justify-between"
            >
              <div>
                <h2 className="text-lg font-semibold text-zinc-900">
                  {block.title}
                </h2>
                <p className="text-sm text-zinc-600">{block.description}</p>
                <p className="text-xs text-zinc-400 mt-1">
                  {block.terms.length} терминов
                </p>
              </div>
              <span className="text-zinc-400 text-2xl">›</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
