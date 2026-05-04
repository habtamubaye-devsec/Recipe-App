import type { ReactNode } from "react";

type Category = {
  id: string;
  name: string;
  image?: string;
  description?: string;
};

type CategoryFilterProps = {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  leadingSlot?: ReactNode;
};

export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
  leadingSlot,
}: CategoryFilterProps) {
  return (
    <div className="space-y-4">
      {leadingSlot}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {categories.map((category) => {
          const isSelected = selectedCategory === category.name;

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onSelectCategory(category.name)}
              style={{ minWidth: 140 }}
              className={`flex flex-col gap-3 rounded-3xl border p-3 text-left transition hover:-translate-y-1 ${
                isSelected
                  ? "border-transparent bg-orange-950 text-white"
                  : "border-orange-200 bg-white/85 text-orange-950"
              }`}
            >
              {category.image ? (
                <img
                  src={category.image}
                  alt={category.name}
                  className="h-20 w-full rounded-2xl object-cover"
                />
              ) : (
                <div className="flex h-20 w-full items-center justify-center rounded-2xl bg-orange-100 text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">
                  {category.name.slice(0, 10)}
                </div>
              )}
              <div>
                <p className="text-sm font-semibold leading-5">{category.name}</p>
                {category.description ? (
                  <p className={`mt-1 line-clamp-2 text-xs leading-5 ${isSelected ? "text-white/70" : "text-orange-950/65"}`}>
                    {category.description}
                  </p>
                ) : null}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
