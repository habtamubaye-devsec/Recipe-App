"use client";

import { useEffect, useMemo, useState } from "react";

const THEMEALDB_BASE = "https://www.themealdb.com/api/json/v1/1";

const featuredAreas = ["Italian", "Mexican", "Indian", "Thai", "Mediterranean", "Japanese"];

const statCards = [
  { label: "Live recipes", value: "500+" },
  { label: "Fast filters", value: "12" },
  { label: "Saved for later", value: "Local" },
];

type Meal = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory?: string;
  strArea?: string;
  strInstructions?: string;
  strYoutube?: string | null;
};

type Category = {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
};

export default function Home() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [categories, setCategories] = useState<Category[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [featuredMeal, setFeaturedMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [categoriesResponse, randomMealsResponse, featuredResponse] = await Promise.all([
          fetch(`${THEMEALDB_BASE}/categories.php`),
          Promise.all(Array.from({ length: 8 }, () => fetch(`${THEMEALDB_BASE}/random.php`))),
          fetch(`${THEMEALDB_BASE}/random.php`),
        ]);

        const categoriesData = await categoriesResponse.json();
        const randomMealsData = await Promise.all(randomMealsResponse.map((response) => response.json()));
        const featuredData = await featuredResponse.json();

        setCategories((categoriesData.categories || []).slice(0, 8));
        setMeals(
          randomMealsData
            .map((item) => item.meals?.[0])
            .filter((meal): meal is Meal => Boolean(meal))
        );
        setFeaturedMeal(featuredData.meals?.[0] || null);
      } catch (loadError) {
        console.error("Failed to load recipe data", loadError);
        setError("The recipe feed could not be loaded right now.");
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  useEffect(() => {
    const searchMeals = async () => {
      if (!query.trim() && activeFilter === "All") {
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = query.trim()
          ? await fetch(`${THEMEALDB_BASE}/search.php?s=${encodeURIComponent(query.trim())}`)
          : await fetch(`${THEMEALDB_BASE}/filter.php?c=${encodeURIComponent(activeFilter)}`);

        const data = await response.json();
        setMeals((data.meals || []).slice(0, 12));
      } catch (searchError) {
        console.error("Failed to search recipes", searchError);
        setError("Search failed. Try again in a moment.");
      } finally {
        setLoading(false);
      }
    };

    if (query.trim() || activeFilter !== "All") {
      searchMeals();
    }
  }, [query, activeFilter]);

  const visibleMeals = useMemo(() => meals, [meals]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
      <section className="relative overflow-hidden rounded-4xl border border-orange-200 bg-white/80 p-6 shadow-[0_24px_80px_rgba(104,52,28,0.12)] backdrop-blur md:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(232,93,49,0.18),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(255,184,140,0.22),transparent_24%)]" />
        <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/70 px-4 py-2 text-sm font-semibold text-orange-900 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-orange-500" />
              Recipe Atlas
            </div>

            <div className="space-y-4">
              <h1
                className="max-w-2xl text-5xl leading-[0.95] tracking-[-0.04em] text-orange-950 sm:text-6xl lg:text-7xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Find the meal you want before the cravings cool down.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-[rgba(31,19,15,0.74)] sm:text-lg">
                Browse live recipes, switch categories instantly, and open a rich meal feed that feels
                closer to an editorial cookbook than a starter template.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <label className="flex items-center gap-3 rounded-2xl border border-orange-200 bg-white/80 px-4 py-3 shadow-sm">
                <span className="text-lg">⌕</span>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search recipes, ingredients, or cuisines"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-[rgba(31,19,15,0.45)]"
                />
              </label>
              <button
                type="button"
                onClick={() => setActiveFilter("All")}
                className="rounded-2xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
              >
                Reset filters
              </button>
            </div>

            <div className="flex flex-wrap gap-3">
              {featuredAreas.map((area) => (
                <button
                  key={area}
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setActiveFilter(area);
                  }}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                    activeFilter === area
                      ? "border-transparent bg-orange-950 text-white"
                      : "border-orange-200 bg-white/75 text-orange-950 hover:bg-white"
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {statCards.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-orange-200 bg-white/75 px-4 py-4 shadow-sm"
                >
                  <p className="text-2xl font-semibold text-orange-950">{stat.value}</p>
                  <p className="mt-1 text-sm text-[rgba(31,19,15,0.65)]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -left-8 top-6 h-24 w-24 rounded-full bg-[rgba(232,93,49,0.2)] blur-2xl" />
            <div className="absolute -right-10 bottom-2 h-32 w-32 rounded-full bg-[rgba(255,184,140,0.28)] blur-2xl" />
            <article className="relative overflow-hidden rounded-4xl border border-orange-200 bg-orange-50 p-4 shadow-[0_28px_70px_rgba(104,52,28,0.15)]">
              {featuredMeal ? (
                <>
                  <img
                    src={featuredMeal.strMealThumb}
                    alt={featuredMeal.strMeal}
                    className="h-80 w-full rounded-3xl object-cover"
                  />
                  <div className="mt-4 space-y-3 p-2">
                    <div className="flex items-center justify-between gap-4 text-sm text-[rgba(31,19,15,0.6)]">
                      <span>{featuredMeal.strCategory || "Featured"}</span>
                      <span>{featuredMeal.strArea || "Global"}</span>
                    </div>
                    <h2
                      className="text-3xl leading-tight text-foreground"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {featuredMeal.strMeal}
                    </h2>
                    <p className="text-sm leading-6 text-[rgba(31,19,15,0.68)]">
                      A hand-picked meal worth opening when you want something comforting, colorful,
                      and immediately useful.
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex h-128 items-center justify-center rounded-3xl bg-white/70 text-sm text-[rgba(31,19,15,0.58)]">
                  Loading featured recipe...
                </div>
              )}
            </article>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-4xl border border-orange-200 bg-white/75 p-6 shadow-[0_18px_50px_rgba(104,52,28,0.08)]">
          <h3 className="text-lg font-semibold uppercase tracking-[0.18em] text-[rgba(31,19,15,0.55)]">
            Categories
          </h3>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            {categories.map((category) => (
              <button
                key={category.idCategory}
                type="button"
                onClick={() => {
                  setQuery("");
                  setActiveFilter(category.strCategory);
                }}
                className={`group overflow-hidden rounded-3xl border p-3 text-left transition hover:-translate-y-1 ${
                  activeFilter === category.strCategory
                    ? "border-transparent bg-orange-950 text-white"
                    : "border-orange-200 bg-white/80 text-orange-950"
                }`}
              >
                <img
                  src={category.strCategoryThumb}
                  alt={category.strCategory}
                  className="h-20 w-full rounded-2xl object-cover transition duration-300 group-hover:scale-[1.03]"
                />
                <p className="mt-3 text-sm font-semibold leading-5">{category.strCategory}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-4xl border border-orange-200 bg-white/75 p-6 shadow-[0_18px_50px_rgba(104,52,28,0.08)]">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3
                className="text-3xl text-orange-950"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {query.trim()
                  ? `Search results for “${query.trim()}”`
                  : activeFilter === "All"
                    ? "Recommended recipes"
                    : `${activeFilter} recipes`}
              </h3>
              <p className="mt-2 text-sm text-[rgba(31,19,15,0.62)]">
                Tap a card and keep exploring with the next search or category choice.
              </p>
            </div>
            <div className="text-sm text-[rgba(31,19,15,0.55)]">{visibleMeals.length} items</div>
          </div>

          {error && (
            <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {loading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-72 animate-pulse rounded-3xl border border-orange-200 bg-white/75"
                  />
                ))
              : visibleMeals.map((meal) => (
                  <article
                    key={meal.idMeal}
                    className="group overflow-hidden rounded-3xl border border-orange-200 bg-white/85 shadow-sm transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(104,52,28,0.12)]"
                  >
                    <img
                      src={meal.strMealThumb}
                      alt={meal.strMeal}
                      className="h-44 w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                    />
                    <div className="space-y-3 p-4">
                      <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.16em] text-[rgba(31,19,15,0.5)]">
                        <span>{meal.strCategory || "Recipe"}</span>
                        <span>{meal.strArea || "Global"}</span>
                      </div>
                      <h4 className="text-xl leading-tight text-orange-950" style={{ fontFamily: "var(--font-display)" }}>
                        {meal.strMeal}
                      </h4>
                      <p className="line-clamp-3 text-sm leading-6 text-[rgba(31,19,15,0.68)]">
                        {meal.strInstructions || "Open the card to find the full recipe details."}
                      </p>
                    </div>
                  </article>
                ))}
          </div>
        </div>
      </section>
    </main>
  );
}
