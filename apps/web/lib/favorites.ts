import type { Recipe } from "./meal-api";

const STORAGE_KEY = "recipe-atlas:favorites";

function readFavorites(): Recipe[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as Recipe[]) : [];
  } catch (error) {
    console.error("Failed to read favorites", error);
    return [];
  }
}

function writeFavorites(favorites: Recipe[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}

export function getFavorites() {
  return readFavorites();
}

export function isFavorite(recipeId: string) {
  return readFavorites().some((favorite) => favorite.id === recipeId);
}

export function addFavorite(recipe: Recipe) {
  const favorites = readFavorites();
  const nextFavorites = favorites.some((item) => item.id === recipe.id)
    ? favorites
    : [recipe, ...favorites];

  writeFavorites(nextFavorites);
  return nextFavorites;
}

export function removeFavorite(recipeId: string) {
  const nextFavorites = readFavorites().filter((favorite) => favorite.id !== recipeId);
  writeFavorites(nextFavorites);
  return nextFavorites;
}

export function toggleFavorite(recipe: Recipe) {
  if (isFavorite(recipe.id)) {
    removeFavorite(recipe.id);
    return false;
  }

  addFavorite(recipe);
  return true;
}
