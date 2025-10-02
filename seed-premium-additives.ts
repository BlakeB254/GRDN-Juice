import { db } from "@db";
import { ingredientVariants } from "@db/schema";

const premiumAdditivesData = [
  {
    name: "Raw Chicago Honey",
    ingredientType: "supplement" as const,
    baseIngredient: "honey",
    variantName: "Local Raw",
    origin: "Chicago Beekeepers",
    isOrganic: false,
    isLocalChicago: true,
    baseCostPerOz: "0.95",
    currentMarketPrice: "0.95",
    seasonalAvailability: ["Year-round"],
    nutritionProfile: {
      calories: 64,
      sugar: 17,
      benefits: "Natural energy, antioxidants, local allergen immunity"
    },
    color: "#FFB347",
    description: "Raw unfiltered honey from Chicago urban hives. Adds natural sweetness and supports local beekeepers. Premium upcharge.",
    isActive: true
  },
  {
    name: "Organic Apple Cider Vinegar",
    ingredientType: "supplement" as const,
    baseIngredient: "apple-cider-vinegar",
    variantName: "With Mother",
    origin: "Organic Farms",
    isOrganic: true,
    isLocalChicago: false,
    baseCostPerOz: "0.45",
    currentMarketPrice: "0.45",
    seasonalAvailability: ["Year-round"],
    nutritionProfile: {
      probiotics: true,
      benefits: "Digestive health, blood sugar support, alkalizing"
    },
    color: "#DEB887",
    description: "Unfiltered with 'the mother'. Aids digestion and balances pH. Use sparingly (1-3% recommended). Premium upcharge.",
    isActive: true
  },
  {
    name: "Alkaline Spring Water",
    ingredientType: "supplement" as const,
    baseIngredient: "alkaline-water",
    variantName: "pH 9.5+",
    origin: "Natural Springs",
    isOrganic: false,
    isLocalChicago: false,
    baseCostPerOz: "0.25",
    currentMarketPrice: "0.25",
    seasonalAvailability: ["Year-round"],
    nutritionProfile: {
      pH: 9.5,
      benefits: "Hydration, alkalizing, mineral-rich"
    },
    color: "#E0F7FA",
    description: "High pH alkaline water for dilution (if desired) or pH balancing. Premium upcharge per oz added.",
    isActive: true
  },
  {
    name: "Chia Seeds (Whole)",
    ingredientType: "supplement" as const,
    baseIngredient: "chia",
    variantName: "Whole Seeds",
    origin: "Mexico",
    isOrganic: true,
    isLocalChicago: false,
    baseCostPerOz: "0.50",
    currentMarketPrice: "0.50",
    seasonalAvailability: ["Year-round"],
    nutritionProfile: {
      omega3: "high",
      fiber: "11g per oz",
      protein: "4g per oz",
      benefits: "Heart health, sustained energy, hydration boost"
    },
    color: "#8B7355",
    description: "Superfood seeds that expand and thicken your juice. Let sit 10 mins for gel texture. Premium upcharge.",
    isActive: true
  }
];

async function seed() {
  console.log("💎 Seeding premium additives...");

  for (const additive of premiumAdditivesData) {
    await db.insert(ingredientVariants).values(additive);
    console.log(`   ✓ Added ${additive.name} (Premium Upcharge)`);
  }

  console.log("✅ Premium additives seeded successfully!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Error seeding premium additives:", error);
  process.exit(1);
});
