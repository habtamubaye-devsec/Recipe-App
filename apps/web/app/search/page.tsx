"use client";

import { useEffect, useState } from "react";
import { MealAPI, type Recipe } from "../../lib/meal-api";
import { useDebounce } from "../../hooks/use-debounce";
import SafeScreen from "../../components/safe-screen";
import LoadingSpinner from "../../components/loading-spinner";
import RecipeCard from "../../components/recipe-card";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    const loadInitialRecipes = async () => {
      setLoading(true);
      try {
        const randomMeals = await MealAPI.getRandomMeals(12);
        setRecipes(randomMeals.map((meal) => MealAPI.transformMealData(meal)).filter((meal): meal is Recipe => meal !== null));
      } finally {
        setLoading(false);
      }
    };

    loadInitialRecipes();
  }, []);

  useEffect(() => {
    const performSearch = async () => {
      if (loading) return;

      setSearching(true);
      try {
        const query = debouncedSearchQuery.trim();

        if (!query) {
          const randomMeals = await MealAPI.getRandomMeals(12);
          setRecipes(
            randomMeals.map((meal) => MealAPI.transformMealData(meal)).filter((meal): meal is Recipe => meal !== null)
          );
          return;
        }

        const nameResults = await MealAPI.searchMealsByName(query);
        const ingredientResults = nameResults.length > 0 ? [] : await MealAPI.filterByIngredient(query);
        const sourceResults = nameResults.length > 0 ? nameResults : ingredientResults;

        setRecipes(
          sourceResults
            .slice(0, 12)
            .map((meal) => MealAPI.transformMealData(meal))
            .filter((meal): meal is Recipe => meal !== null)
        );
      } finally {
        setSearching(false);
      }
    };

    performSearch();
  }, [debouncedSearchQuery, loading]);

  if (loading) return <LoadingSpinner message="Loading recipes..." />;

  return (
    <SafeScreen className="space-y-6">
      <section className="rounded-4xl border border-orange-200 bg-white/80 p-6 shadow-sm">
        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-700">Search</p>
            <h1 className="mt-2 text-4xl text-orange-950" style={{ fontFamily: "var(--font-display)" }}>
              Find recipes by name or ingredient
            </h1>
          </div>

          <label className="flex items-center gap-3 rounded-2xl border border-orange-200 bg-white px-4 py-3 shadow-sm">
            <span className="text-lg text-orange-700">⌕</span>
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search recipes, ingredients, cuisines"
              className="w-full bg-transparent text-sm outline-none placeholder:text-orange-950/40"
            />
          </label>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl text-orange-950" style={{ fontFamily: "var(--font-display)" }}>
              {searchQuery.trim() ? `Results for "${searchQuery.trim()}"` : "Popular recipes"}
            </h2>
            <p className="mt-1 text-sm text-orange-950/60">{recipes.length} recipes found</p>
          </div>
          {searching ? <p className="text-sm text-orange-700">Searching...</p> : null}
        </div>

        {recipes.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} href={`/recipe/${recipe.id}`} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-orange-200 bg-white/70 px-6 py-16 text-center text-orange-950/60">
            No recipes found. Try a different search term.
          </div>
        )}
      </section>
    </SafeScreen>
  );
}
