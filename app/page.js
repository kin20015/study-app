import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <h1 className="text-4xl font-bold text-center text-zinc-900 mb-2">
          Учебное приложение
        </h1>
        <p className="text-center text-zinc-600 mb-12">
          Выбери раздел, чтобы начать
        </p>

        <div className="flex flex-col gap-4">
          <Link
            href="/lectures"
            className="bg-white border border-zinc-200 hover:border-zinc-900 hover:shadow-md transition-all rounded-2xl p-6 flex items-center gap-4"
          >
            <span className="text-3xl">📚</span>
            <div>
              <h2 className="text-xl font-semibold text-zinc-900">Лекции</h2>
              <p className="text-sm text-zinc-600">
                Материалы по каждой лекции и тесты
              </p>
            </div>
          </Link>

          <Link
            href="/terms"
            className="bg-white border border-zinc-200 hover:border-zinc-900 hover:shadow-md transition-all rounded-2xl p-6 flex items-center gap-4"
          >
            <span className="text-3xl">📖</span>
            <div>
              <h2 className="text-xl font-semibold text-zinc-900">Термины</h2>
              <p className="text-sm text-zinc-600">
                Карточки, пары, тест на 60 секунд
              </p>
            </div>
          </Link>

          <Link
            href="/exam"
            className="bg-white border border-zinc-200 hover:border-zinc-900 hover:shadow-md transition-all rounded-2xl p-6 flex items-center gap-4"
          >
            <span className="text-3xl">📝</span>
            <div>
              <h2 className="text-xl font-semibold text-zinc-900">Экзамен</h2>
              <p className="text-sm text-zinc-600">
                Итоговый тест и часто совершаемые ошибки
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
