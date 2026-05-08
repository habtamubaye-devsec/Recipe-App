"use client";

import { useEffect, useState } from "react";
import SafeScreen from "../../components/safe-screen";
import NoFavoritesFound from "../../components/no-favorites-found";
import RecipeCard from "../../components/recipe-card";
import { getFavorites, removeFavorite } from "../../lib/favorites";
import type { Recipe } from "../../lib/meal-api";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Recipe[]>([]);

  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  const handleRemove = (recipeId: string) => {
    setFavorites(removeFavorite(recipeId));
  };

  return (
    <SafeScreen className="space-y-6">
      <section className="rounded-4xl border border-orange-200 bg-white/80 p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-700">Favorites</p>
        <h1 className="mt-2 text-4xl text-orange-950" style={{ fontFamily: "var(--font-display)" }}>
          Your saved recipes
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-orange-950/65">
          Saved recipes are stored locally in this browser so you can revisit them quickly.
        </p>
      </section>

      {favorites.length === 0 ? (
        <NoFavoritesFound />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {favorites.map((recipe) => (
            <div key={recipe.id} className="space-y-3">
              <RecipeCard recipe={recipe} href={`/recipe/${recipe.id}`} footerLabel="Saved" />
              <button
                type="button"
                onClick={() => handleRemove(recipe.id)}
                className="w-full rounded-2xl border border-orange-200 bg-white px-4 py-3 text-sm font-semibold text-orange-700 transition hover:bg-orange-50"
              >
                Remove from favorites
              </button>
            </div>
          ))}
        </div>
      )}
    </SafeScreen>
  );
}
