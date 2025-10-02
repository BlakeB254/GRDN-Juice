import { useState, useEffect } from 'react';
import EnhancedBottleVisualizer from '@/components/blend/atoms/EnhancedBottleVisualizer';
import Navigation from '@/components/organisms/Navigation';
import IngredientGrid from '@/components/blend/molecules/IngredientGrid';

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

interface BlendIngredient {
  variantId: string;
  variantName: string;
  color: string;
  percentage: number;
  costPerOz: number;
}

type IngredientCategory = 'fruits' | 'vegetables' | 'herbs' | 'supplements' | 'premium';

export default function BlendBuilder() {
  const [ingredients, setIngredients] = useState<IngredientVariant[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<IngredientCategory>('fruits');
  const [blendIngredients, setBlendIngredients] = useState<BlendIngredient[]>([]);
  const [blendName, setBlendName] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedVariantForAdd, setSelectedVariantForAdd] = useState<IngredientVariant | null>(null);
  const [addMode, setAddMode] = useState<'percentage' | 'ounces'>('percentage');
  const [addAmount, setAddAmount] = useState<number>(10);
  const [containerType, setContainerType] = useState<'standard' | 'custom'>('standard');
  const [bottleSize, setBottleSize] = useState<number>(16); // Default bottle size in oz
  const [customSize, setCustomSize] = useState<number>(16);

  useEffect(() => {
    fetchIngredients();
  }, []);

  const fetchIngredients = async () => {
    try {
      // Try API first
      const response = await fetch('/api/ingredient-variants');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response');
      }

      const data = await response.json();
      console.log('Fetched ingredients from API:', data.length, 'items');
      setIngredients(data);
    } catch (error) {
      console.log('API not available, loading from static data...');

      // Fallback to static JSON file for static deployment
      try {
        const staticResponse = await fetch('/ingredient-variants.json');
        if (staticResponse.ok) {
          const data = await staticResponse.json();
          console.log('Fetched ingredients from static file:', data.length, 'items');
          setIngredients(data);
        } else {
          throw new Error('Static data file not found');
        }
      } catch (staticError) {
        console.error('Error loading static ingredients:', staticError);
        setIngredients([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Group variants by base ingredient
  const getBaseIngredients = () => {
    const categoryMap: Record<IngredientCategory, string[]> = {
      fruits: ['fruit'],
      vegetables: ['vegetable'],
      herbs: ['herb'],
      supplements: ['supplement'],
      premium: ['supplement'],
    };

    const types = categoryMap[selectedCategory];
    let filtered = ingredients.filter(ing => types.includes(ing.ingredientType));

    if (selectedCategory === 'premium') {
      filtered = filtered.filter(ing => parseFloat(ing.baseCostPerOz) >= 0.45);
    }

    if (selectedCategory === 'supplements') {
      filtered = filtered.filter(ing => parseFloat(ing.baseCostPerOz) < 0.45);
    }

    // Group by baseIngredient
    const grouped = filtered.reduce((acc: Record<string, IngredientVariant[]>, variant) => {
      const base = variant.baseIngredient;
      if (!acc[base]) {
        acc[base] = [];
      }
      acc[base].push(variant);
      return acc;
    }, {});

    return grouped;
  };

  const openAddModal = (variant: IngredientVariant) => {
    // Check if already added
    if (blendIngredients.some(bi => bi.variantId === variant.id)) {
      alert('This ingredient is already in your blend.');
      return;
    }

    // Check if blend is full
    const currentTotal = blendIngredients.reduce((sum, bi) => sum + bi.percentage, 0);
    if (currentTotal >= 100) {
      alert('Blend is already at 100%. Remove an ingredient to add more.');
      return;
    }

    setSelectedVariantForAdd(variant);
    setAddMode('percentage');
    setAddAmount(10);
  };

  const confirmAddIngredient = () => {
    if (!selectedVariantForAdd) return;

    const activeBottleSize = containerType === 'custom' ? customSize : bottleSize;

    // Calculate percentage based on mode
    let percentage = addAmount;
    if (addMode === 'ounces') {
      percentage = (addAmount / activeBottleSize) * 100;
    }

    // Check total doesn't exceed 100%
    const currentTotal = blendIngredients.reduce((sum, bi) => sum + bi.percentage, 0);
    const availablePercentage = 100 - currentTotal;

    if (percentage > availablePercentage) {
      alert(`Only ${availablePercentage.toFixed(1)}% remaining in blend. Adjusting to maximum available.`);
      percentage = availablePercentage;
    }

    if (percentage <= 0) {
      alert('Blend is already at 100%. Remove an ingredient to add more.');
      return;
    }

    const newIngredient: BlendIngredient = {
      variantId: selectedVariantForAdd.id,
      variantName: selectedVariantForAdd.name,
      color: selectedVariantForAdd.color,
      percentage: percentage,
      costPerOz: parseFloat(selectedVariantForAdd.baseCostPerOz),
    };

    setBlendIngredients([...blendIngredients, newIngredient]);
    setSelectedVariantForAdd(null);
  };

  const cancelAddModal = () => {
    setSelectedVariantForAdd(null);
  };

  const removeIngredient = (variantId: string) => {
    setBlendIngredients(blendIngredients.filter(bi => bi.variantId !== variantId));
  };

  const updatePercentage = (variantId: string, newPercentage: number) => {
    const updated = blendIngredients.map(bi =>
      bi.variantId === variantId ? { ...bi, percentage: newPercentage } : bi
    );

    // Ensure total doesn't exceed 100
    const total = updated.reduce((sum, bi) => sum + bi.percentage, 0);
    if (total > 100) {
      // Proportionally reduce other ingredients
      const excess = total - 100;
      const othersTotal = updated.reduce((sum, bi) =>
        bi.variantId !== variantId ? sum + bi.percentage : sum, 0
      );

      if (othersTotal > 0) {
        setBlendIngredients(updated.map(bi => {
          if (bi.variantId === variantId) return bi;
          const reduction = (bi.percentage / othersTotal) * excess;
          return { ...bi, percentage: Math.max(0, bi.percentage - reduction) };
        }));
      } else {
        // If this is the only ingredient, cap at 100
        setBlendIngredients(updated.map(bi =>
          bi.variantId === variantId ? { ...bi, percentage: 100 } : bi
        ));
      }
    } else {
      setBlendIngredients(updated);
    }
  };

  const calculatePrice = () => {
    const basePrice = blendIngredients.reduce((sum, bi) =>
      sum + (bi.costPerOz * bi.percentage / 100), 0
    );
    return basePrice;
  };

  const totalPercentage = blendIngredients.reduce((sum, bi) => sum + bi.percentage, 0);
  const pricePerOz = calculatePrice();

  const categories: { key: IngredientCategory; label: string; icon: string }[] = [
    { key: 'fruits', label: 'Fruits', icon: '🍎' },
    { key: 'vegetables', label: 'Vegetables', icon: '🥕' },
    { key: 'herbs', label: 'Herbs', icon: '🌿' },
    { key: 'supplements', label: 'Superfoods', icon: '⚡' },
    { key: 'premium', label: 'Premium', icon: '💎' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl">Loading ingredients...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Create Your Perfect Blend</h1>
          <p className="text-muted-foreground">
            Mix any ingredients in any ratio. Watch your blend come to life in real-time.
          </p>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Panel: Ingredient Selector */}
        <div className="lg:col-span-2 space-y-4">
          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map(cat => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategory === cat.key
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary hover:bg-secondary/80'
                }`}
              >
                <span className="mr-2">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>

          {/* Ingredient Grid - Using new component */}
          <IngredientGrid
            ingredients={Object.values(getBaseIngredients()).flat()}
            category={selectedCategory}
            onAddIngredient={openAddModal}
          />
        </div>

        {/* Right Panel: Blend Preview & Controls */}
        <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)] flex flex-col">
          {/* Single Compact Card */}
          <div className="bg-white border rounded-lg shadow-lg flex flex-col h-full">
            {/* Header with Size Selection */}
            <div className="border-b bg-gradient-to-r from-green-50 to-white p-4 flex-shrink-0">
              <h2 className="text-lg font-semibold mb-3">Your Blend Preview</h2>

              {/* Size Selection - Golden Ratio Spacing */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Container Size
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => {
                      setContainerType('standard');
                      setBottleSize(16);
                    }}
                    className={`py-1.5 px-2 text-xs rounded border-2 transition-colors ${
                      containerType === 'standard' && bottleSize === 16
                        ? 'border-green-600 bg-green-50 text-green-700 font-semibold'
                        : 'border-gray-300 hover:border-green-400'
                    }`}
                  >
                    16 oz
                  </button>
                  <button
                    onClick={() => {
                      setContainerType('standard');
                      setBottleSize(24);
                    }}
                    className={`py-1.5 px-2 text-xs rounded border-2 transition-colors ${
                      containerType === 'standard' && bottleSize === 24
                        ? 'border-green-600 bg-green-50 text-green-700 font-semibold'
                        : 'border-gray-300 hover:border-green-400'
                    }`}
                  >
                    24 oz
                  </button>
                  <button
                    onClick={() => {
                      setContainerType('standard');
                      setBottleSize(32);
                    }}
                    className={`py-1.5 px-2 text-xs rounded border-2 transition-colors ${
                      containerType === 'standard' && bottleSize === 32
                        ? 'border-green-600 bg-green-50 text-green-700 font-semibold'
                        : 'border-gray-300 hover:border-green-400'
                    }`}
                  >
                    32 oz
                  </button>
                  <button
                    onClick={() => {
                      setContainerType('standard');
                      setBottleSize(64);
                    }}
                    className={`py-1.5 px-2 text-xs rounded border-2 transition-colors ${
                      containerType === 'standard' && bottleSize === 64
                        ? 'border-green-600 bg-green-50 text-green-700 font-semibold'
                        : 'border-gray-300 hover:border-green-400'
                    }`}
                  >
                    64 oz
                    <span className="block text-[10px] text-gray-500">½ Gal</span>
                  </button>
                  <button
                    onClick={() => {
                      setContainerType('standard');
                      setBottleSize(128);
                    }}
                    className={`py-1.5 px-2 text-xs rounded border-2 transition-colors ${
                      containerType === 'standard' && bottleSize === 128
                        ? 'border-green-600 bg-green-50 text-green-700 font-semibold'
                        : 'border-gray-300 hover:border-green-400'
                    }`}
                  >
                    128 oz
                    <span className="block text-[10px] text-gray-500">1 Gal</span>
                  </button>
                  <button
                    onClick={() => setContainerType('custom')}
                    className={`py-1.5 px-2 text-xs rounded border-2 transition-colors ${
                      containerType === 'custom'
                        ? 'border-green-600 bg-green-50 text-green-700 font-semibold'
                        : 'border-gray-300 hover:border-green-400'
                    }`}
                  >
                    Custom
                  </button>
                </div>
                {containerType === 'custom' && (
                  <input
                    type="number"
                    min="4"
                    max="128"
                    step="1"
                    value={customSize}
                    onChange={(e) => setCustomSize(Math.max(4, Math.min(128, parseFloat(e.target.value) || 4)))}
                    className="w-full px-3 py-1.5 text-sm border-2 border-green-300 rounded focus:border-green-600 focus:outline-none"
                    placeholder="Enter size (4-128oz)"
                  />
                )}
              </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto p-4 min-h-0">
              {/* Bottle Visualizer */}
              <div className="flex justify-center mb-4">
                <EnhancedBottleVisualizer
                  blendIngredients={blendIngredients}
                  bottleSize={containerType === 'custom' ? customSize : bottleSize}
                  blendName={blendName}
                />
              </div>

              {/* Blend Name */}
              <div className="mb-4">
                <label className="block text-xs font-medium mb-1.5 text-muted-foreground uppercase tracking-wide">
                  Name Your Blend
                </label>
                <input
                  type="text"
                  value={blendName}
                  onChange={(e) => setBlendName(e.target.value)}
                  placeholder="e.g., Morning Energizer"
                  className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Percentage Sliders */}
              {blendIngredients.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                    Adjust Ingredients
                  </p>
                  {blendIngredients.map(bi => (
                    <div key={bi.variantId} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 flex-1 min-w-0">
                          <div
                            className="w-3 h-3 rounded-full border flex-shrink-0"
                            style={{ backgroundColor: bi.color }}
                          />
                          <span className="text-xs truncate">{bi.variantName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium w-10 text-right">
                            {bi.percentage.toFixed(0)}%
                          </span>
                          <button
                            onClick={() => removeIngredient(bi.variantId)}
                            className="text-destructive hover:text-destructive/80 text-xs w-4 h-4 flex items-center justify-center"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={bi.percentage}
                        onChange={(e) => updatePercentage(bi.variantId, parseFloat(e.target.value))}
                        className="w-full h-1"
                      />
                    </div>
                  ))}

                  {/* Total Percentage Indicator */}
                  <div className="pt-2 border-t mt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium">Total:</span>
                      <span className={`text-sm font-bold ${
                        totalPercentage === 100 ? 'text-green-600' :
                        totalPercentage > 100 ? 'text-red-600' :
                        'text-yellow-600'
                      }`}>
                        {totalPercentage.toFixed(0)}%
                      </span>
                    </div>
                    {totalPercentage !== 100 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {totalPercentage < 100
                          ? `${(100 - totalPercentage).toFixed(0)}% remaining`
                          : 'Exceeds 100%'}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground text-center py-6">
                  Select ingredients to start building your blend
                </p>
              )}
              </div>
            </div>

            {/* Footer - Price & Actions (Fixed at Bottom) */}
            {blendIngredients.length > 0 && (
              <div className="border-t bg-white p-4 space-y-3 flex-shrink-0">
                {/* Price Display */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Price (per oz):</span>
                    <span className="text-lg font-bold text-green-600">${pricePerOz.toFixed(2)}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Your {containerType === 'custom' ? customSize : bottleSize}oz: ${(pricePerOz * (containerType === 'custom' ? customSize : bottleSize)).toFixed(2)}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <button className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg hover:bg-primary/90 transition-colors font-semibold text-sm">
                    Add to Cart
                  </button>
                  <button className="w-full border border-border py-2 rounded-lg hover:bg-secondary transition-colors text-xs">
                    Save Blend
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Ingredient Modal */}
      {selectedVariantForAdd && (() => {
        const currentTotal = blendIngredients.reduce((sum, bi) => sum + bi.percentage, 0);
        const availablePercentage = 100 - currentTotal;
        const maxPercentage = Math.min(100, availablePercentage);
        const activeBottleSize = containerType === 'custom' ? customSize : bottleSize;
        const maxOunces = (maxPercentage / 100) * activeBottleSize;

        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-2xl">
              <h2 className="text-xl font-bold mb-4">Add {selectedVariantForAdd.variantName}</h2>

              {/* Available Space Indicator */}
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  <span className="font-semibold">{availablePercentage.toFixed(1)}%</span> available
                  <span className="text-blue-600 ml-2">
                    ({((availablePercentage / 100) * activeBottleSize).toFixed(1)} oz of {activeBottleSize}oz)
                  </span>
                </p>
              </div>

              {/* Mode Toggle */}
              <div className="mb-4">
                <label className="block text-xs font-medium mb-2 text-muted-foreground uppercase tracking-wide">Measurement</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setAddMode('percentage')}
                    className={`flex-1 py-2 px-3 text-sm rounded border-2 transition-colors ${
                      addMode === 'percentage'
                        ? 'border-green-600 bg-green-50 text-green-700 font-semibold'
                        : 'border-gray-300 hover:border-green-400'
                    }`}
                  >
                    Percentage
                  </button>
                  <button
                    onClick={() => setAddMode('ounces')}
                    className={`flex-1 py-2 px-3 text-sm rounded border-2 transition-colors ${
                      addMode === 'ounces'
                        ? 'border-green-600 bg-green-50 text-green-700 font-semibold'
                        : 'border-gray-300 hover:border-green-400'
                    }`}
                  >
                    Ounces
                  </button>
                </div>
              </div>

              {/* Amount Input */}
              <div className="mb-4">
                <label className="block text-xs font-medium mb-2 text-muted-foreground uppercase tracking-wide">
                  {addMode === 'percentage' ? 'Percentage' : 'Ounces'}
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={addMode === 'percentage' ? 1 : 0.5}
                    max={addMode === 'percentage' ? maxPercentage : maxOunces}
                    step={addMode === 'percentage' ? 1 : 0.5}
                    value={Math.min(addAmount, addMode === 'percentage' ? maxPercentage : maxOunces)}
                    onChange={(e) => setAddAmount(parseFloat(e.target.value))}
                    className="flex-1"
                  />
                  <input
                    type="number"
                    min={addMode === 'percentage' ? 1 : 0.5}
                    max={addMode === 'percentage' ? maxPercentage : maxOunces}
                    step={addMode === 'percentage' ? 1 : 0.5}
                    value={addAmount}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      const maxVal = addMode === 'percentage' ? maxPercentage : maxOunces;
                      setAddAmount(Math.min(val, maxVal));
                    }}
                    className="w-16 px-2 py-1.5 text-sm border rounded text-center"
                  />
                  <span className="text-xs font-medium w-6">
                    {addMode === 'percentage' ? '%' : 'oz'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">
                  {addMode === 'ounces'
                    ? `= ${((addAmount / activeBottleSize) * 100).toFixed(1)}%`
                    : `= ${((addAmount / 100) * activeBottleSize).toFixed(1)}oz`
                  }
                </p>
              </div>

              {/* Pricing Preview */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium">Cost:</span>
                  <span className="text-base font-bold text-green-600">
                    ${(
                      parseFloat(selectedVariantForAdd.baseCostPerOz) *
                      (addMode === 'percentage' ? (addAmount / 100) * activeBottleSize : addAmount)
                    ).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={cancelAddModal}
                  className="flex-1 py-2 px-3 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAddIngredient}
                  className="flex-1 py-2 px-3 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                >
                  Add to Blend
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
