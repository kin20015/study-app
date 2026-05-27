import Link from "next/link";
import { notFound } from "next/navigation";
import { lectures } from "@/data/lectures";
import { tests } from "@/data/tests";
import TestClient from "./TestClient";

export default async function TestPage({ params }) {
  const { id } = await params;
  const lectureId = parseInt(id, 10);
  const lecture = lectures.find((l) => l.id === lectureId);
  const test = tests.find((t) => t.lectureId === lectureId);

  if (!lecture) {
    notFound();
  }

  // Если теста для этой лекции ещё нет — показываем заглушку
  if (!test) {
    return (
      <div className="min-h-screen bg-zinc-50 px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Link
            href={`/lectures/${lecture.id}`}
            className="text-sm text-zinc-600 hover:text-zinc-900 mb-6 inline-block"
          >
            ← К лекции
          </Link>
          <div className="bg-white border border-zinc-200 rounded-2xl p-8 text-center">
            <div className="text-4xl mb-3">🚧</div>
            <h1 className="text-xl font-bold text-zinc-900 mb-2">
              Тест в разработке
            </h1>
            <p className="text-zinc-600">
              Тест по «{lecture.title}» скоро появится.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <TestClient lecture={lecture} test={test} />;
}
