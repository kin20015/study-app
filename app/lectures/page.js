import Link from "next/link";
import { lectures } from "@/data/lectures";

export default function LecturesPage() {
  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="text-sm text-zinc-600 hover:text-zinc-900 mb-6 inline-block"
        >
          ← На главную
        </Link>

        <h1 className="text-3xl font-bold text-zinc-900 mb-2">📚 Лекции</h1>
        <p className="text-zinc-600 mb-8">
          Выбери лекцию, чтобы открыть материал и пройти тест
        </p>

        <div className="flex flex-col gap-3">
          {lectures.map((lecture) => (
            <Link
              key={lecture.id}
              href={`/lectures/${lecture.id}`}
              className="bg-white border border-zinc-200 hover:border-zinc-900 hover:shadow-md transition-all rounded-2xl p-5 flex items-center justify-between"
            >
              <div>
                <h2 className="text-lg font-semibold text-zinc-900">
                  {lecture.title}
                </h2>
                <p className="text-sm text-zinc-600">{lecture.description}</p>
              </div>
              <span className="text-zinc-400 text-2xl">›</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
