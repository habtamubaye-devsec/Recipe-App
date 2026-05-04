import Link from "next/link";

const navItems = [
  { href: "/", label: "Recipes" },
  { href: "/search", label: "Search" },
  { href: "/favorites", label: "Favorites" },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-orange-200/80 bg-white/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-600 text-sm font-bold text-white shadow-sm">
            RA
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-700">
              Recipe Atlas
            </p>
            <p className="text-xs text-orange-950/60">Cookbook-style meal browser</p>
          </div>
        </Link>

        <nav className="flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 p-1 text-sm font-medium text-orange-950">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 transition hover:bg-white hover:shadow-sm"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
