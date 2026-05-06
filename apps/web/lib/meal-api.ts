export type Recipe = {
  id: string;
  title: string;
  description: string;
  image: string;
  cookTime: string;
  servings: number;
  category: string;
  area?: string;
  ingredients: string[];
  instructions: string[];
  youtubeUrl?: string | null;
};

type RawMeal = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory?: string | null;
  strArea?: string | null;
  strInstructions?: string | null;
  strYoutube?: string | null;
  [key: string]: unknown;
};

type CategoriesResponse = {
  categories?: Array<{
    idCategory: string;
    strCategory: string;
    strCategoryThumb: string;
    strCategoryDescription: string;
  }>;
};

const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

async function requestJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  return response.json();
}

export const MealAPI = {
  searchMealsByName: async (query: string): Promise<RawMeal[]> => {
    try {
      const data = await requestJson<{ meals: RawMeal[] | null }>(
        `${BASE_URL}/search.php?s=${encodeURIComponent(query)}`
      );
      return data.meals || [];
    } catch (error) {
      console.error("Error searching meals by name:", error);
      return [];
    }
  },

  getMealById: async (id: string): Promise<RawMeal | null> => {
    try {
      const data = await requestJson<{ meals: RawMeal[] | null }>(`${BASE_URL}/lookup.php?i=${id}`);
      return data.meals ? data.meals[0] : null;
    } catch (error) {
      console.error("Error getting meal by id:", error);
      return null;
    }
  },

  getRandomMeal: async (): Promise<RawMeal | null> => {
    try {
      const data = await requestJson<{ meals: RawMeal[] | null }>(`${BASE_URL}/random.php`);
      return data.meals ? data.meals[0] : null;
    } catch (error) {
      console.error("Error getting random meal:", error);
      return null;
    }
  },

  getRandomMeals: async (count = 6): Promise<RawMeal[]> => {
    try {
      const meals = await Promise.all(Array.from({ length: count }, () => MealAPI.getRandomMeal()));
      return meals.filter((meal): meal is RawMeal => meal !== null);
    } catch (error) {
      console.error("Error getting random meals:", error);
      return [];
    }
  },

  getCategories: async () => {
    try {
      const data = await requestJson<CategoriesResponse>(`${BASE_URL}/categories.php`);
      return data.categories || [];
    } catch (error) {
      console.error("Error getting categories:", error);
      return [];
    }
  },

  filterByIngredient: async (ingredient: string): Promise<RawMeal[]> => {
    try {
      const data = await requestJson<{ meals: RawMeal[] | null }>(
        `${BASE_URL}/filter.php?i=${encodeURIComponent(ingredient)}`
      );
      return data.meals || [];
    } catch (error) {
      console.error("Error filtering by ingredient:", error);
      return [];
    }
  },

  filterByCategory: async (category: string): Promise<RawMeal[]> => {
    try {
      const data = await requestJson<{ meals: RawMeal[] | null }>(
        `${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`
      );
      return data.meals || [];
    } catch (error) {
      console.error("Error filtering by category:", error);
      return [];
    }
  },

  transformMealData: (meal: RawMeal | null): Recipe | null => {
    if (!meal) return null;

    const ingredients: string[] = [];
    for (let index = 1; index <= 20; index += 1) {
      const ingredient = String(meal[`strIngredient${index}` as keyof RawMeal] || "");
      const measure = String(meal[`strMeasure${index}` as keyof RawMeal] || "");

      if (ingredient.trim()) {
        const measureText = measure.trim() ? `${measure.trim()} ` : "";
        ingredients.push(`${measureText}${ingredient.trim()}`);
      }
    }

    const instructions = meal.strInstructions
      ? meal.strInstructions.split(/\r?\n/).filter((step) => step.trim())
      : [];

    return {
      id: meal.idMeal,
      title: meal.strMeal,
      description: meal.strInstructions
        ? `${meal.strInstructions.substring(0, 120)}...`
        : "Delicious meal from TheMealDB",
      image: meal.strMealThumb,
      cookTime: "30 minutes",
      servings: 4,
      category: meal.strCategory || "Main Course",
      area: meal.strArea || undefined,
      ingredients,
      instructions,
      youtubeUrl: meal.strYoutube || null,
    };
  },
};
