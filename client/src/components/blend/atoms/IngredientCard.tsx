/**
 * IngredientCard Atom Component
 *
 * Follows Atomic Design principles and Golden Ratio spacing
 * Card dimensions: 280px × 453px (1:1.618 ratio)
 * Image height: 172px (golden ratio of content area)
 * Spacing: 8px, 13px, 21px, 34px (Fibonacci sequence)
 */

import { useState } from 'react';

interface IngredientVariant {
  id: string;
  name: string;
  variantName: string;
  origin: string;
  isOrganic: boolean;
  isLocalChicago: boolean;
  baseCostPerOz: string;
  color: string;
  description: string;
}

interface IngredientCardProps {
  baseIngredient: string;
  variants: IngredientVariant[];
  category: 'fruits' | 'vegetables' | 'herbs' | 'supplements' | 'premium';
  onAddVariant: (variant: IngredientVariant) => void;
}

// Comprehensive ingredient image mapping synchronized with seed data
const getCategoryImage = (baseIngredient: string, category: string): string => {
  const imageMap: Record<string, string> = {
    // Fruits
    'apple': 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=400&h=300&fit=crop&q=80',
    'orange': 'https://images.unsplash.com/photo-1547514701-42782101795e?w=400&h=300&fit=crop&q=80',
    'strawberry': 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=300&fit=crop&q=80',
    'blueberry': 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=400&h=300&fit=crop&q=80',
    'raspberry': 'https://images.unsplash.com/photo-1577069861033-55d04cec4ef5?w=400&h=300&fit=crop&q=80',
    'blackberry': 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=400&h=300&fit=crop&q=80',
    'mango': 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&h=300&fit=crop&q=80',
    'pineapple': 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400&h=300&fit=crop&q=80',
    'papaya': 'https://images.unsplash.com/photo-1566768974211-fc43f28a5c6b?w=400&h=300&fit=crop&q=80',
    'dragon fruit': 'https://images.unsplash.com/photo-1527325678964-54921661f888?w=400&h=300&fit=crop&q=80',
    'lemon': 'https://images.unsplash.com/photo-1587486937402-c5e871b0b0c5?w=400&h=300&fit=crop&q=80',
    'lime': 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&h=300&fit=crop&q=80',
    'grapefruit': 'https://images.unsplash.com/photo-1609704104247-7ee1beca90a1?w=400&h=300&fit=crop&q=80',
    'peach': 'https://images.unsplash.com/photo-1629828874514-d5e3b46f7c6e?w=400&h=300&fit=crop&q=80',
    'watermelon': 'https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?w=400&h=300&fit=crop&q=80',
    'pomegranate': 'https://images.unsplash.com/photo-1615485737213-2743e8b74ebe?w=400&h=300&fit=crop&q=80',

    // Vegetables
    'carrot': 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=300&fit=crop&q=80',
    'beet': 'https://images.unsplash.com/photo-1594950492064-65dc1dac9c89?w=400&h=300&fit=crop&q=80',
    'kale': 'https://images.unsplash.com/photo-1582635563229-7718e11874ab?w=400&h=300&fit=crop&q=80',
    'spinach': 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=300&fit=crop&q=80',
    'celery': 'https://images.unsplash.com/photo-1549068106-47be0db8e84a?w=400&h=300&fit=crop&q=80',
    'cucumber': 'https://images.unsplash.com/photo-1604077350854-e6d37b9566a1?w=400&h=300&fit=crop&q=80',
    'tomato': 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&h=300&fit=crop&q=80',
    'bell pepper': 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&h=300&fit=crop&q=80',

    // Herbs
    'mint': 'https://images.unsplash.com/photo-1628556276791-53f3c6847a8c?w=400&h=300&fit=crop&q=80',
    'basil': 'https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=400&h=300&fit=crop&q=80',
    'ginger': 'https://images.unsplash.com/photo-1582977248394-9a8e83e7b00e?w=400&h=300&fit=crop&q=80',
    'turmeric': 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&h=300&fit=crop&q=80',
    'cilantro': 'https://images.unsplash.com/photo-1639164690869-fa38e6da5da0?w=400&h=300&fit=crop&q=80',
    'parsley': 'https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?w=400&h=300&fit=crop&q=80',

    // Supplements
    'chia': 'https://images.unsplash.com/photo-1576843815584-ad95b89d76c9?w=400&h=300&fit=crop&q=80',
    'cayenne': 'https://images.unsplash.com/photo-1583662016800-bd2bfaf8a5b0?w=400&h=300&fit=crop&q=80',
    'honey': 'https://images.unsplash.com/photo-1587049352846-4a222e784acc?w=400&h=300&fit=crop&q=80',
    'spirulina': 'https://images.unsplash.com/photo-1642647391072-6a2416f048e5?w=400&h=300&fit=crop&q=80',
    'chlorella': 'https://images.unsplash.com/photo-1638441473209-d10f8034df93?w=400&h=300&fit=crop&q=80',
    'wheatgrass': 'https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?w=400&h=300&fit=crop&q=80',
    'charcoal': 'https://images.unsplash.com/photo-1547992542-d152a96e93e4?w=400&h=300&fit=crop&q=80',
    'activated charcoal': 'https://images.unsplash.com/photo-1547992542-d152a96e93e4?w=400&h=300&fit=crop&q=80',
    'cacao': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop&q=80',
    'matcha': 'https://images.unsplash.com/photo-1536013416354-f84e328884c3?w=400&h=300&fit=crop&q=80',
  };

  return imageMap[baseIngredient.toLowerCase()] || `https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=400&h=300&fit=crop&q=80`;
};

// Export this function for use in Menu component to ensure consistency
export { getCategoryImage };

export default function IngredientCard({
  baseIngredient,
  variants,
  category,
  onAddVariant,
}: IngredientCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const primaryVariant = variants[0];
  const imageUrl = getCategoryImage(baseIngredient, category);

  return (
    <div
      className="group bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl border border-gray-100"
      style={{
        width: '280px',
        minHeight: expanded ? 'auto' : '453px',
      }}
    >
      {/* Image Section - Golden Ratio: 172px height */}
      <div
        className="relative w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50"
        style={{ height: '172px' }}
      >
        {/* Loading skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 animate-pulse bg-gray-200" />
        )}

        {/* Actual image */}
        <img
          src={imageUrl}
          alt={`${baseIngredient}s`}
          className={`w-full h-full object-cover transition-all duration-500 ${
            imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          } group-hover:scale-105`}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />

        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        {/* Variant count badge */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-md">
          <span className="text-xs font-semibold text-gray-700">
            {variants.length} {variants.length === 1 ? 'variety' : 'varieties'}
          </span>
        </div>
      </div>

      {/* Content Section - Golden Ratio spacing: 8px, 13px, 21px, 34px */}
      <div className="p-5" style={{ paddingTop: '21px', paddingBottom: '21px' }}>
        {/* Title - 21px bottom margin */}
        <h3 className="font-bold text-xl capitalize mb-2 text-gray-900">
          {baseIngredient}{variants.length > 1 ? 's' : ''}
        </h3>

        {/* Price range - 13px bottom margin */}
        <div className="mb-3">
          <span className="text-sm font-semibold text-green-600">
            ${Math.min(...variants.map(v => parseFloat(v.baseCostPerOz))).toFixed(2)} -
            ${Math.max(...variants.map(v => parseFloat(v.baseCostPerOz))).toFixed(2)}/oz
          </span>
        </div>

        {/* Primary variant description - 13px bottom margin */}
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
          {primaryVariant.description}
        </p>

        {/* Expand/Collapse button - 21px bottom margin */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full text-xs font-medium text-primary hover:text-primary/80 transition-colors mb-5 text-left flex items-center gap-1"
        >
          {expanded ? '▼' : '▶'} {expanded ? 'Hide' : 'Show'} Varieties
        </button>

        {/* Variants List - with smooth expansion */}
        <div
          className={`space-y-2 transition-all duration-300 overflow-hidden ${
            expanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          {variants.map(variant => (
            <div
              key={variant.id}
              className="p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 border border-gray-100"
              style={{ padding: '13px' }}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                {/* Variant name and badges */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 truncate mb-1">
                    {variant.variantName}
                  </h4>

                  {/* Badges - 8px gap */}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {variant.isOrganic && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium">
                        Organic
                      </span>
                    )}
                    {variant.isLocalChicago && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium">
                        Local
                      </span>
                    )}
                  </div>

                  {/* Origin and price */}
                  <p className="text-xs text-gray-500 mb-1">{variant.origin}</p>
                  <p className="text-sm text-green-600 font-bold">
                    ${parseFloat(variant.baseCostPerOz).toFixed(2)}/oz
                  </p>
                </div>

                {/* Add button */}
                <button
                  onClick={() => onAddVariant(variant)}
                  className="flex-shrink-0 bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-green-700 active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Add
                </button>
              </div>

              {/* Color indicator */}
              <div className="flex items-center gap-2 mt-2">
                <div
                  className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: variant.color }}
                />
                <span className="text-xs text-gray-400">Color preview</span>
              </div>
            </div>
          ))}
        </div>

        {/* Quick add for single variant - only show when collapsed */}
        {!expanded && variants.length === 1 && (
          <button
            onClick={() => onAddVariant(primaryVariant)}
            className="w-full bg-green-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-green-700 active:scale-98 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Add {primaryVariant.variantName}
          </button>
        )}
      </div>
    </div>
  );
}
