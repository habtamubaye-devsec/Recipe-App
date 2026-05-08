"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import LoadingSpinner from "../../../components/loading-spinner";
import SafeScreen from "../../../components/safe-screen";
import { addFavorite, isFavorite, removeFavorite } from "../../../lib/favorites";
import { MealAPI, type Recipe } from "../../../lib/meal-api";

export default function RecipeDetailPage() {
  const params = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const loadRecipe = async () => {
      setLoading(true);

      try {
        const meal = await MealAPI.getMealById(params.id);
        const transformed = MealAPI.transformMealData(meal);

        setRecipe(transformed);
        setSaved(transformed ? isFavorite(transformed.id) : false);
      } finally {
        setLoading(false);
      }
    };

    loadRecipe();
  }, [params.id]);

  const handleToggleSave = () => {
    if (!recipe) return;

    if (saved) {
      removeFavorite(recipe.id);
      setSaved(false);
      return;
    }

    addFavorite(recipe);
    setSaved(true);
  };

  if (loading) return <LoadingSpinner message="Loading recipe details..." />;

  if (!recipe) {
    return (
      <SafeScreen className="py-16">
        <div className="rounded-4xl border border-orange-200 bg-white/80 px-6 py-12 text-center shadow-sm">
          <h1 className="text-3xl text-orange-950" style={{ fontFamily: "var(--font-display)" }}>
            Recipe not found
          </h1>
          <p className="mt-3 text-sm leading-6 text-orange-950/65">
            The meal could not be loaded from TheMealDB.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-2xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white"
          >
            Back home
          </Link>
        </div>
      </SafeScreen>
    );
  }

  return (
    <SafeScreen className="space-y-6 pb-10">
      <section className="grid gap-6 overflow-hidden rounded-4xl border border-orange-200 bg-white/80 p-4 shadow-sm lg:grid-cols-[1fr_1.1fr] lg:p-6">
        <div className="relative overflow-hidden rounded-3xl">
          <img src={recipe.image} alt={recipe.title} className="h-full min-h-90 w-full object-cover" />
        </div>

        <div className="flex flex-col justify-between gap-6 p-2 lg:p-4">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-orange-700">
              <Link href="/" className="rounded-full border border-orange-200 bg-orange-50 px-3 py-2">
                Back to recipes
              </Link>
              <span>{recipe.category}</span>
              {recipe.area ? <span>{recipe.area}</span> : null}
            </div>

            <h1 className="text-4xl text-orange-950" style={{ fontFamily: "var(--font-display)" }}>
              {recipe.title}
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-orange-950/70">{recipe.description}</p>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border border-orange-200 bg-orange-50 px-4 py-4">
                <p className="text-xs uppercase tracking-[0.18em] text-orange-700">Cook time</p>
                <p className="mt-1 text-lg font-semibold text-orange-950">{recipe.cookTime}</p>
              </div>
              <div className="rounded-3xl border border-orange-200 bg-orange-50 px-4 py-4">
                <p className="text-xs uppercase tracking-[0.18em] text-orange-700">Servings</p>
                <p className="mt-1 text-lg font-semibold text-orange-950">{recipe.servings}</p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleToggleSave}
            className={`rounded-2xl px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5 ${
              saved ? "bg-orange-950 text-white" : "bg-orange-600 text-white"
            }`}
          >
            {saved ? "Remove from favorites" : "Add to favorites"}
          </button>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-4xl border border-orange-200 bg-white/80 p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl text-orange-950" style={{ fontFamily: "var(--font-display)" }}>
              Ingredients
            </h2>
            <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-700">
              {recipe.ingredients.length}
            </span>
          </div>

          <div className="mt-5 grid gap-3">
            {recipe.ingredients.map((ingredient, index) => (
              <div key={`${ingredient}-${index}`} className="flex items-start gap-3 rounded-2xl bg-orange-50 px-4 py-3">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-600 text-sm font-semibold text-white">
                  {index + 1}
                </div>
                <p className="text-sm leading-6 text-orange-950/75">{ingredient}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-4xl border border-orange-200 bg-white/80 p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl text-orange-950" style={{ fontFamily: "var(--font-display)" }}>
              Instructions
            </h2>
            <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-700">
              {recipe.instructions.length}
            </span>
          </div>

          <div className="mt-5 grid gap-4">
            {recipe.instructions.map((instruction, index) => (
              <div key={`${index}-${instruction}`} className="flex gap-4 rounded-2xl bg-orange-50 px-4 py-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-600 text-sm font-semibold text-white">
                  {index + 1}
                </div>
                <p className="text-sm leading-7 text-orange-950/75">{instruction}</p>
              </div>
            ))}
          </div>

          {recipe.youtubeUrl ? (
            <div className="mt-6 overflow-hidden rounded-3xl border border-orange-200">
              <iframe
                title={`${recipe.title} video tutorial`}
                src={`https://www.youtube.com/embed/${recipe.youtubeUrl.split("v=")[1]}`}
                className="aspect-video w-full"
                allowFullScreen
              />
            </div>
          ) : null}
        </div>
      </section>
    </SafeScreen>
  );
}
