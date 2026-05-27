import Link from "next/link";
import { notFound } from "next/navigation";
import { termBlocks } from "@/data/terms";

export default async function BlockPage({ params }) {
  const { id } = await params;
  const blockId = parseInt(id, 10);
  const block = termBlocks.find((b) => b.id === blockId);

  if (!block) {
    notFound();
  }

  const modes = [
    {
      id: "cards",
      icon: "🎴",
      title: "Карточки",
      description: "Переворачивай карточки и запоминай определения",
      available: true,
    },
    {
      id: "pairs",
      icon: "🔗",
      title: "Пары",
      description: "Соединяй термин с правильным определением",
      available: false,
    },
    {
      id: "timed",
      icon: "⏱️",
      title: "Тест на 60 секунд",
      description: "Ответь на максимум вопросов за минуту",
      available: false,
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/terms"
          className="text-sm text-zinc-600 hover:text-zinc-900 mb-6 inline-block"
        >
          ← К блокам терминов
        </Link>

        <h1 className="text-3xl font-bold text-zinc-900 mb-2">{block.title}</h1>
        <p className="text-zinc-600 mb-8">
          {block.description} · {block.terms.length} терминов
        </p>

        <h2 className="text-lg font-semibold text-zinc-900 mb-3">
          Выбери режим тренировки
        </h2>

        <div className="flex flex-col gap-3">
          {modes.map((mode) =>
            mode.available ? (
              <Link
                key={mode.id}
                href={`/terms/${block.id}/${mode.id}`}
                className="bg-white border border-zinc-200 hover:border-zinc-900 hover:shadow-md transition-all rounded-2xl p-5 flex items-center gap-4"
              >
                <span className="text-3xl">{mode.icon}</span>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-zinc-900">
                    {mode.title}
                  </h3>
                  <p className="text-sm text-zinc-600">{mode.description}</p>
                </div>
                <span className="text-zinc-400 text-2xl">›</span>
              </Link>
            ) : (
              <div
                key={mode.id}
                className="bg-zinc-100 border border-zinc-200 rounded-2xl p-5 flex items-center gap-4 opacity-60"
              >
                <span className="text-3xl grayscale">{mode.icon}</span>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-zinc-700">
                    {mode.title}
                  </h3>
                  <p className="text-sm text-zinc-500">{mode.description}</p>
                  <p className="text-xs text-zinc-400 mt-1">🚧 Скоро</p>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
