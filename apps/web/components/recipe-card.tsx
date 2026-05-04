import Link from "next/link";
import type { Recipe } from "../lib/meal-api";

type RecipeCardProps = {
  recipe: Recipe;
  href: string;
  footerLabel?: string;
};

export default function RecipeCard({ recipe, href, footerLabel }: RecipeCardProps) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-orange-200 bg-white/90 shadow-sm transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(104,52,28,0.12)]">
      <Link href={href} className="block">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="h-44 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        <div className="space-y-3 p-4">
          <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.16em] text-orange-950/50">
            <span>{recipe.category}</span>
            <span>{recipe.area || "Global"}</span>
          </div>
          <h3 className="text-xl leading-tight text-orange-950" style={{ fontFamily: "var(--font-display)" }}>
            {recipe.title}
          </h3>
          <p className="line-clamp-3 text-sm leading-6 text-orange-950/68">{recipe.description}</p>
        </div>
      </Link>

      <div className="flex items-center justify-between border-t border-orange-100 px-4 py-3 text-sm text-orange-950/70">
        <span>{recipe.cookTime}</span>
        <span>{recipe.servings} servings</span>
        {footerLabel ? <span className="font-medium text-orange-700">{footerLabel}</span> : null}
      </div>
    </article>
  );
}
