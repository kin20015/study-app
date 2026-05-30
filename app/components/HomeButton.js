import Link from "next/link";

export default function HomeButton() {
  return (
    <div className="sticky top-0 z-50 flex justify-center py-3 bg-zinc-50/80 backdrop-blur-sm">
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm hover:border-zinc-900 hover:text-zinc-900 transition-colors"
      >
        🏠 Главное меню
      </Link>
    </div>
  );
}
