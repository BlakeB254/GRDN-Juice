import { useState } from 'react';
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { Product, CustomBlendRecipe, IngredientVariant } from "../../../shared/types";
import Navigation from "@/components/organisms/Navigation";
import { getCategoryImage } from "@/components/blend/atoms/IngredientCard";

type MenuCategory = 'single_source' | 'our_blends' | 'community';

export default function Menu() {
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory>('single_source');

  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: ingredients, isLoading: ingredientsLoading } = useQuery<IngredientVariant[]>({
    queryKey: ["/api/ingredient-variants"],
  });

  const { data: communityBlends, isLoading: blendsLoading } = useQuery<CustomBlendRecipe[]>({
    queryKey: ["/api/community-blends"],
  });

  const categories = [
    { key: 'single_source' as MenuCategory, label: 'Single Source Juices', icon: '🍊' },
    { key: 'our_blends' as MenuCategory, label: 'Our Signature Blends', icon: '🌈' },
    { key: 'community' as MenuCategory, label: 'Community Creations', icon: '👥' },
  ];

  // Group ingredients by base ingredient for single source
  const getSingleSourceItems = () => {
    if (!ingredients) return [];

    const grouped = ingredients.reduce((acc: Record<string, IngredientVariant[]>, variant) => {
      const base = variant.baseIngredient;
      if (!acc[base]) {
        acc[base] = [];
      }
      acc[base].push(variant);
      return acc;
    }, {});

    return Object.entries(grouped).map(([baseIngredient, variants]) => ({
      id: baseIngredient,
      name: baseIngredient.charAt(0).toUpperCase() + baseIngredient.slice(1),
      description: variants[0]?.description || 'Fresh cold-pressed juice',
      color: variants[0]?.color || '#16a34a',
      imageUrl: getCategoryImage(baseIngredient, 'fruits'),
      variants: variants.length,
      ingredientType: variants[0]?.ingredientType,
    }));
  };

  // Get signature blends from products
  const getOurBlends = () => {
    if (!products) return [];
    return products.filter(p => p.category === 'combo_mix' || p.category === 'wellness_shot');
  };

  // Get community blends
  const getCommunityBlends = () => {
    if (!communityBlends) return [];
    return communityBlends.filter(b => b.isPublic);
  };

  const renderContent = () => {
    const isLoading = productsLoading || ingredientsLoading || blendsLoading;

    if (isLoading) {
      return (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
          <p className="text-gray-600 mt-4">Loading menu...</p>
        </div>
      );
    }

    if (selectedCategory === 'single_source') {
      const items = getSingleSourceItems();
      if (items.length === 0) {
        return (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No single source juices available.</p>
          </div>
        );
      }

      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <Link key={item.id} href={`/blend-builder?ingredient=${item.id}`}>
              <a className="group">
                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100">
                  <div className="h-48 w-full overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 capitalize">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500 uppercase tracking-wide">
                        {item.variants} {item.variants === 1 ? 'variety' : 'varieties'}
                      </span>
                      <span className="text-green-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                        Create →
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            </Link>
          ))}
        </div>
      );
    }

    if (selectedCategory === 'our_blends') {
      const blends = getOurBlends();
      if (blends.length === 0) {
        return (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No signature blends available yet.</p>
            <p className="text-gray-500 text-sm mt-2">Check back soon for our curated blends!</p>
          </div>
        );
      }

      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blends.map((product) => (
            <Link key={product.id} href={`/product/${product.id}`}>
              <a className="group">
                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100">
                  <div
                    className="h-48 w-full"
                    style={{ backgroundColor: product.color }}
                  />
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {product.description || "Fresh cold-pressed juice blend"}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500 uppercase tracking-wide">
                        {product.category.replace("_", " ")}
                      </span>
                      <span className="text-green-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                        View Details →
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            </Link>
          ))}
        </div>
      );
    }

    if (selectedCategory === 'community') {
      const blends = getCommunityBlends();
      if (blends.length === 0) {
        return (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">No community blends shared yet.</p>
            <p className="text-gray-500 text-sm mb-6">
              Create your own blend and share it with the community!
            </p>
            <Link href="/blend-builder">
              <a className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                Create Your Blend
              </a>
            </Link>
          </div>
        );
      }

      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blends.map((blend) => (
            <div key={blend.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100">
              <div
                className="h-48 w-full"
                style={{ backgroundColor: blend.estimatedColor }}
              />
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {blend.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {blend.description || "Community created blend"}
                </p>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs text-gray-500">
                    {blend.blendComposition.length} ingredients
                  </span>
                  <span className="text-xs text-gray-500">
                    ⭐ {blend.averageRating || 'N/A'}
                  </span>
                </div>
                <button className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                  Try This Blend
                </button>
              </div>
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Our Menu</h1>
          <p className="text-gray-600">
            Explore our fresh cold-pressed juices and community creations
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-6 py-3 rounded-lg whitespace-nowrap transition-all duration-300 font-medium ${
                selectedCategory === cat.key
                  ? 'bg-green-600 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
              }`}
            >
              <span className="mr-2">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {renderContent()}
      </main>
    </div>
  );
}
