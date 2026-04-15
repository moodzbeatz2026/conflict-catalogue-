import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight text-gray-900">
          Conflict Catalogue
        </Link>
        <nav className="flex gap-6 text-sm font-medium text-gray-600">
          <Link href="/timeline" className="hover:text-gray-900 transition-colors">
            Timeline
          </Link>
        </nav>
      </div>
    </header>
  );
}
