import Link from "next/link";

export default function ExamPage() {
  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="text-sm text-zinc-600 hover:text-zinc-900 mb-6 inline-block"
        >
          ← На главную
        </Link>

        <h1 className="text-3xl font-bold text-zinc-900 mb-2">📝 Экзамен</h1>
        <p className="text-zinc-600 mb-8">
          Итоговый тест и работа над частыми ошибками
        </p>

        <div className="bg-white border border-zinc-200 rounded-2xl p-8 text-center">
          <p className="text-zinc-500 mb-2">🚧 Раздел в разработке</p>
          <p className="text-zinc-700">
            Здесь появится итоговый тест по всему материалу<br />
            и блок «Часто совершаемые ошибки» с разжёвывалками.
          </p>
        </div>
      </div>
    </div>
  );
}
