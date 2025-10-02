/**
 * IngredientGrid Molecule Component
 *
 * Follows Atomic Design principles
 * Responsive grid layout with golden ratio spacing
 */

import IngredientCard from '../atoms/IngredientCard';

interface IngredientVariant {
  id: string;
  name: string;
  ingredientType: 'fruit' | 'vegetable' | 'herb' | 'supplement';
  baseIngredient: string;
  variantName: string;
  origin: string;
  isOrganic: boolean;
  isLocalChicago: boolean;
  baseCostPerOz: string;
  currentMarketPrice: string;
  seasonalAvailability: string[];
  color: string;
  description: string;
  isActive: boolean;
}

interface IngredientGridProps {
  ingredients: IngredientVariant[];
  category: 'fruits' | 'vegetables' | 'herbs' | 'supplements' | 'premium';
  onAddIngredient: (variant: IngredientVariant) => void;
}

export default function IngredientGrid({
  ingredients,
  category,
  onAddIngredient,
}: IngredientGridProps) {
  // Group variants by base ingredient
  const groupedIngredients = ingredients.reduce((acc: Record<string, IngredientVariant[]>, variant) => {
    const base = variant.baseIngredient;
    if (!acc[base]) {
      acc[base] = [];
    }
    acc[base].push(variant);
    return acc;
  }, {});

  const ingredientGroups = Object.entries(groupedIngredients);

  if (ingredientGroups.length === 0) {
    return (
      <div className="col-span-full text-center py-16">
        <div className="text-gray-400 mb-4">
          <svg
            className="w-16 h-16 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        </div>
        <p className="text-gray-500 text-lg font-medium">No ingredients available in this category</p>
        <p className="text-gray-400 text-sm mt-2">Check back soon for new additions!</p>
      </div>
    );
  }

  return (
    <>
      {/* Grid with responsive columns and golden ratio gap (21px) */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 justify-items-center"
        style={{ gap: '21px' }}
      >
        {ingredientGroups.map(([baseIngredient, variants]) => (
          <IngredientCard
            key={baseIngredient}
            baseIngredient={baseIngredient}
            variants={variants}
            category={category}
            onAddVariant={onAddIngredient}
          />
        ))}
      </div>
    </>
  );
}
