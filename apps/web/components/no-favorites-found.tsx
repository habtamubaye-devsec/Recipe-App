import Link from "next/link";

export default function NoFavoritesFound() {
  return (
    <div className="flex min-h-[38vh] flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-orange-200 bg-white/70 px-6 py-12 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 text-3xl text-orange-700">
        Fav
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl" style={{ fontFamily: "var(--font-display)" }}>
          No favorites yet
        </h2>
        <p className="max-w-md text-sm leading-6 text-orange-950/65">
          Save recipes from the home screen or search results, and they will show up here.
        </p>
      </div>
      <Link
        href="/"
        className="rounded-2xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
      >
        Explore Recipes
      </Link>
    </div>
  );
}
