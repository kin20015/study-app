import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { lectures } from "@/data/lectures";

function ContentBlock({ block }) {
  switch (block.type) {
    case "heading":
      return (
        <h2 className="text-2xl font-bold text-zinc-900 mt-8 mb-3 first:mt-0">
          {block.text}
        </h2>
      );

    case "subheading":
      return (
        <h3 className="text-lg font-semibold text-zinc-800 mt-5 mb-2">
          {block.text}
        </h3>
      );

    case "paragraph":
      return (
        <p className="text-zinc-700 leading-relaxed mb-4">{block.text}</p>
      );

    case "list":
      return (
        <ul className="list-disc list-inside text-zinc-700 mb-4 space-y-2 pl-2">
          {block.items.map((item, i) => (
            <li key={i} className="leading-relaxed">
              {item}
            </li>
          ))}
        </ul>
      );

    case "numbered":
      return (
        <ol className="list-decimal list-inside text-zinc-700 mb-4 space-y-2 pl-2">
          {block.items.map((item, i) => (
            <li key={i} className="leading-relaxed">
              {item}
            </li>
          ))}
        </ol>
      );

    case "definition":
      return (
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 my-4 rounded-r-lg">
          <p className="text-zinc-900">
            <span className="font-semibold">{block.term}</span>
            <span className="text-zinc-500"> — </span>
            <span className="text-zinc-700">{block.definition}</span>
          </p>
        </div>
      );

    case "quote":
      return (
        <blockquote className="border-l-4 border-zinc-400 pl-4 py-2 my-4 text-zinc-600 italic">
          {block.text}
        </blockquote>
      );

    case "image":
      return (
        <figure className="my-6">
          <div className="bg-zinc-100 rounded-xl overflow-hidden">
            <Image
              src={block.src}
              alt={block.caption || ""}
              width={800}
              height={500}
              className="w-full h-auto"
            />
          </div>
          {block.caption && (
            <figcaption className="text-sm text-zinc-500 text-center mt-2">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );

    default:
      return null;
  }
}

export default async function LecturePage({ params }) {
  const { id } = await params;
  const lectureId = parseInt(id, 10);
  const lecture = lectures.find((l) => l.id === lectureId);

  if (!lecture) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/lectures"
          className="text-sm text-zinc-600 hover:text-zinc-900 mb-6 inline-block"
        >
          ← К списку лекций
        </Link>

        <h1 className="text-3xl font-bold text-zinc-900 mb-2">
          {lecture.title}
        </h1>
        <p className="text-zinc-600 mb-8">{lecture.description}</p>

        <div className="bg-white border border-zinc-200 rounded-2xl p-6 md:p-8 mb-6">
          {lecture.content.map((block, index) => (
            <ContentBlock key={index} block={block} />
          ))}
        </div>

        <Link
          href={`/lectures/${lecture.id}/test`}
          className="block bg-zinc-900 hover:bg-zinc-800 text-white text-center font-semibold rounded-2xl p-4 transition-colors"
        >
          Пройти тест по этой лекции →
        </Link>
      </div>
    </div>
  );
}
