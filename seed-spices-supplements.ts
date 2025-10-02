import { db } from "@db";
import { ingredientVariants } from "@db/schema";

const spicesData = [
  {
    name: "Organic Turmeric Root",
    ingredientType: "supplement" as const,
    baseIngredient: "turmeric",
    variantName: "Fresh Root",
    origin: "Specialty Imports",
    isOrganic: true,
    isLocalChicago: false,
    baseCostPerOz: "0.85",
    currentMarketPrice: "0.85",
    seasonalAvailability: ["Year-round"],
    nutritionProfile: {
      antiInflammatory: true,
      curcumin: "high",
      benefits: "Anti-inflammatory, antioxidant, supports joint health"
    },
    color: "#ff9933",
    description: "Powerful anti-inflammatory with earthy, slightly bitter flavor. Start with small amounts.",
    isActive: true
  },
  {
    name: "Cayenne Pepper",
    ingredientType: "supplement" as const,
    baseIngredient: "cayenne",
    variantName: "Ground",
    origin: "Organic Farms",
    isOrganic: true,
    isLocalChicago: false,
    baseCostPerOz: "0.75",
    currentMarketPrice: "0.75",
    seasonalAvailability: ["Year-round"],
    nutritionProfile: {
      capsaicin: "high",
      benefits: "Boosts metabolism, aids digestion, rich in Vitamin A"
    },
    color: "#e63946",
    description: "Spicy kick that boosts metabolism. A little goes a long way - recommended max 1-2% of blend.",
    isActive: true
  },
  {
    name: "Cinnamon",
    ingredientType: "supplement" as const,
    baseIngredient: "cinnamon",
    variantName: "Ceylon",
    origin: "Sri Lanka",
    isOrganic: true,
    isLocalChicago: false,
    baseCostPerOz: "0.65",
    currentMarketPrice: "0.65",
    seasonalAvailability: ["Year-round"],
    nutritionProfile: {
      antioxidants: "high",
      benefits: "Blood sugar regulation, anti-inflammatory"
    },
    color: "#8B4513",
    description: "Sweet and warming spice. Ceylon variety is milder and safer for daily use.",
    isActive: true
  },
  {
    name: "Fresh Mint",
    ingredientType: "herb" as const,
    baseIngredient: "mint",
    variantName: "Peppermint",
    origin: "Chicago Urban Farms",
    isOrganic: true,
    isLocalChicago: true,
    baseCostPerOz: "0.55",
    currentMarketPrice: "0.55",
    seasonalAvailability: ["April", "May", "June", "July", "August", "September"],
    nutritionProfile: {
      menthol: true,
      benefits: "Digestive aid, refreshing, cooling"
    },
    color: "#98FF98",
    description: "Refreshing and cooling. Perfect for green juices or citrus blends.",
    isActive: true
  },
  {
    name: "Fresh Basil",
    ingredientType: "herb" as const,
    baseIngredient: "basil",
    variantName: "Sweet Basil",
    origin: "Chicago Greenhouses",
    isOrganic: true,
    isLocalChicago: true,
    baseCostPerOz: "0.60",
    currentMarketPrice: "0.60",
    seasonalAvailability: ["Year-round"],
    nutritionProfile: {
      antioxidants: "high",
      benefits: "Anti-inflammatory, antibacterial"
    },
    color: "#228B22",
    description: "Aromatic and slightly sweet. Pairs well with tomato or green juices.",
    isActive: true
  },
  {
    name: "Spirulina Powder",
    ingredientType: "supplement" as const,
    baseIngredient: "spirulina",
    variantName: "Organic",
    origin: "Hawaii",
    isOrganic: true,
    isLocalChicago: false,
    baseCostPerOz: "1.20",
    currentMarketPrice: "1.20",
    seasonalAvailability: ["Year-round"],
    nutritionProfile: {
      protein: "60%",
      iron: "high",
      benefits: "Complete protein, detoxifying, energy boost"
    },
    color: "#006B3C",
    description: "Nutrient-dense superfood. Strong earthy flavor - use sparingly (1-2% max).",
    isActive: true
  },
  {
    name: "Wheatgrass Powder",
    ingredientType: "supplement" as const,
    baseIngredient: "wheatgrass",
    variantName: "Organic",
    origin: "Midwest Farms",
    isOrganic: true,
    isLocalChicago: false,
    baseCostPerOz: "0.95",
    currentMarketPrice: "0.95",
    seasonalAvailability: ["Year-round"],
    nutritionProfile: {
      chlorophyll: "very high",
      benefits: "Detoxifying, alkalizing, immune support"
    },
    color: "#7CFC00",
    description: "Intense green superfood. Best mixed with citrus to balance grassy flavor.",
    isActive: true
  },
  {
    name: "Activated Charcoal",
    ingredientType: "supplement" as const,
    baseIngredient: "charcoal",
    variantName: "Food Grade",
    origin: "Coconut Shell",
    isOrganic: false,
    isLocalChicago: false,
    baseCostPerOz: "1.00",
    currentMarketPrice: "1.00",
    seasonalAvailability: ["Year-round"],
    nutritionProfile: {
      benefits: "Detoxifying (use occasionally, not daily)"
    },
    color: "#36454F",
    description: "Detox support. WARNING: Can interfere with medications. Use max 0.5% of blend.",
    isActive: true
  },
  {
    name: "Chia Seeds",
    ingredientType: "supplement" as const,
    baseIngredient: "chia",
    variantName: "Whole",
    origin: "Mexico",
    isOrganic: true,
    isLocalChicago: false,
    baseCostPerOz: "0.50",
    currentMarketPrice: "0.50",
    seasonalAvailability: ["Year-round"],
    nutritionProfile: {
      omega3: "high",
      fiber: "11g per oz",
      benefits: "Heart health, sustained energy, hydration"
    },
    color: "#8B7355",
    description: "Adds texture and nutrition. Will thicken juice - let sit 10 mins before drinking.",
    isActive: true
  },
  {
    name: "Hemp Hearts",
    ingredientType: "supplement" as const,
    baseIngredient: "hemp",
    variantName: "Shelled",
    origin: "Canada",
    isOrganic: true,
    isLocalChicago: false,
    baseCostPerOz: "0.70",
    currentMarketPrice: "0.70",
    seasonalAvailability: ["Year-round"],
    nutritionProfile: {
      protein: "10g per oz",
      omega3: "high",
      benefits: "Complete protein, heart health, anti-inflammatory"
    },
    color: "#E8E4C9",
    description: "Nutty flavor and creamy texture. Great for green juices or smoothies.",
    isActive: true
  }
];

async function seed() {
  console.log("🌿 Seeding spices and supplements...");

  for (const item of spicesData) {
    await db.insert(ingredientVariants).values(item);
    console.log(`   ✓ Added ${item.name}`);
  }

  console.log("✅ Spices and supplements seeded successfully!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Error seeding spices/supplements:", error);
  process.exit(1);
});
