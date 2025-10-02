import { db } from "@db";
import { ingredientVariants } from "@db/schema";

const variantsData = [
  // APPLES
  {
    name: "Honeycrisp Apple",
    ingredientType: "fruit" as const,
    baseIngredient: "apple",
    variantName: "Honeycrisp",
    origin: "Chicago Local Farms",
    isOrganic: true,
    isLocalChicago: true,
    baseCostPerOz: "0.35",
    currentMarketPrice: "0.35",
    seasonalAvailability: ["September", "October", "November", "December"],
    nutritionProfile: {
      calories: 95,
      sugar: 19,
      fiber: 4,
      vitaminC: 14
    },
    color: "#f4d03f",
    description: "Sweet, crisp, and juicy with a perfect balance of flavor",
    isActive: true
  },
  {
    name: "Granny Smith Apple",
    ingredientType: "fruit" as const,
    baseIngredient: "apple",
    variantName: "Granny Smith",
    origin: "Midwest Orchards",
    isOrganic: false,
    isLocalChicago: false,
    baseCostPerOz: "0.25",
    currentMarketPrice: "0.25",
    seasonalAvailability: ["Year-round"],
    nutritionProfile: {
      calories: 80,
      sugar: 15,
      fiber: 4,
      vitaminC: 12
    },
    color: "#8db600",
    description: "Tart and crisp, perfect for adding tang to blends",
    isActive: true
  },
  {
    name: "Gala Apple",
    ingredientType: "fruit" as const,
    baseIngredient: "apple",
    variantName: "Gala",
    origin: "Local Illinois Farms",
    isOrganic: true,
    isLocalChicago: true,
    baseCostPerOz: "0.30",
    currentMarketPrice: "0.30",
    seasonalAvailability: ["August", "September", "October"],
    nutritionProfile: {
      calories: 90,
      sugar: 17,
      fiber: 3,
      vitaminC: 10
    },
    color: "#e8a838",
    description: "Mildly sweet with a vanilla-like flavor",
    isActive: true
  },

  // CARROTS
  {
    name: "Organic Rainbow Carrots",
    ingredientType: "vegetable" as const,
    baseIngredient: "carrot",
    variantName: "Rainbow",
    origin: "Urban Chicago Farms",
    isOrganic: true,
    isLocalChicago: true,
    baseCostPerOz: "0.40",
    currentMarketPrice: "0.40",
    seasonalAvailability: ["Year-round"],
    nutritionProfile: {
      calories: 52,
      sugar: 6,
      fiber: 3,
      vitaminA: 334
    },
    color: "#ff8c00",
    description: "Vibrant mix of purple, yellow, and orange carrots",
    isActive: true
  },
  {
    name: "Standard Orange Carrots",
    ingredientType: "vegetable" as const,
    baseIngredient: "carrot",
    variantName: "Orange",
    origin: "Midwest Farms",
    isOrganic: false,
    isLocalChicago: false,
    baseCostPerOz: "0.20",
    currentMarketPrice: "0.20",
    seasonalAvailability: ["Year-round"],
    nutritionProfile: {
      calories: 50,
      sugar: 6,
      fiber: 3,
      vitaminA: 334
    },
    color: "#ed9121",
    description: "Classic sweet and earthy carrot flavor",
    isActive: true
  },

  // ORANGES
  {
    name: "Valencia Orange",
    ingredientType: "fruit" as const,
    baseIngredient: "orange",
    variantName: "Valencia",
    origin: "Florida Groves",
    isOrganic: true,
    isLocalChicago: false,
    baseCostPerOz: "0.45",
    currentMarketPrice: "0.45",
    seasonalAvailability: ["March", "April", "May", "June", "July"],
    nutritionProfile: {
      calories: 62,
      sugar: 12,
      fiber: 3,
      vitaminC: 93
    },
    color: "#ff8c00",
    description: "Sweet and juicy, perfect for fresh juice",
    isActive: true
  },
  {
    name: "Blood Orange",
    ingredientType: "fruit" as const,
    baseIngredient: "orange",
    variantName: "Blood Orange",
    origin: "California",
    isOrganic: true,
    isLocalChicago: false,
    baseCostPerOz: "0.65",
    currentMarketPrice: "0.65",
    seasonalAvailability: ["December", "January", "February", "March"],
    nutritionProfile: {
      calories: 70,
      sugar: 14,
      fiber: 3,
      vitaminC: 88
    },
    color: "#c91f37",
    description: "Rich, berry-like flavor with deep red color",
    isActive: true
  },

  // BEETS
  {
    name: "Red Beets",
    ingredientType: "vegetable" as const,
    baseIngredient: "beet",
    variantName: "Red",
    origin: "Local Chicago Gardens",
    isOrganic: true,
    isLocalChicago: true,
    baseCostPerOz: "0.38",
    currentMarketPrice: "0.38",
    seasonalAvailability: ["June", "July", "August", "September", "October"],
    nutritionProfile: {
      calories: 58,
      sugar: 9,
      fiber: 3,
      folate: 37
    },
    color: "#a32638",
    description: "Earthy and sweet, rich in antioxidants",
    isActive: true
  },
  {
    name: "Golden Beets",
    ingredientType: "vegetable" as const,
    baseIngredient: "beet",
    variantName: "Golden",
    origin: "Illinois Organic Farms",
    isOrganic: true,
    isLocalChicago: true,
    baseCostPerOz: "0.42",
    currentMarketPrice: "0.42",
    seasonalAvailability: ["June", "July", "August", "September"],
    nutritionProfile: {
      calories: 58,
      sugar: 9,
      fiber: 3,
      folate: 37
    },
    color: "#f39c12",
    description: "Milder, sweeter flavor than red beets",
    isActive: true
  },

  // CELERY
  {
    name: "Organic Celery",
    ingredientType: "vegetable" as const,
    baseIngredient: "celery",
    variantName: "Organic",
    origin: "Chicago Urban Farms",
    isOrganic: true,
    isLocalChicago: true,
    baseCostPerOz: "0.28",
    currentMarketPrice: "0.28",
    seasonalAvailability: ["Year-round"],
    nutritionProfile: {
      calories: 16,
      sugar: 2,
      fiber: 2,
      vitaminK: 29
    },
    color: "#7cb342",
    description: "Fresh, crisp celery with natural hydrating properties",
    isActive: true
  },

  // GINGER
  {
    name: "Fresh Ginger Root",
    ingredientType: "herb" as const,
    baseIngredient: "ginger",
    variantName: "Fresh",
    origin: "Specialty Imports",
    isOrganic: true,
    isLocalChicago: false,
    baseCostPerOz: "0.55",
    currentMarketPrice: "0.55",
    seasonalAvailability: ["Year-round"],
    nutritionProfile: {
      calories: 80,
      sugar: 2,
      fiber: 2,
      antiInflammatory: true
    },
    color: "#d4a574",
    description: "Spicy and warming, aids digestion",
    isActive: true
  },

  // KALE
  {
    name: "Lacinato Kale",
    ingredientType: "vegetable" as const,
    baseIngredient: "kale",
    variantName: "Lacinato",
    origin: "Chicago Greenhouses",
    isOrganic: true,
    isLocalChicago: true,
    baseCostPerOz: "0.50",
    currentMarketPrice: "0.50",
    seasonalAvailability: ["Year-round"],
    nutritionProfile: {
      calories: 33,
      sugar: 1,
      fiber: 3,
      vitaminK: 684
    },
    color: "#2d5016",
    description: "Milder and sweeter than curly kale",
    isActive: true
  },
  {
    name: "Curly Kale",
    ingredientType: "vegetable" as const,
    baseIngredient: "kale",
    variantName: "Curly",
    origin: "Local Illinois Farms",
    isOrganic: true,
    isLocalChicago: true,
    baseCostPerOz: "0.45",
    currentMarketPrice: "0.45",
    seasonalAvailability: ["Year-round"],
    nutritionProfile: {
      calories: 33,
      sugar: 1,
      fiber: 3,
      vitaminK: 684
    },
    color: "#355e3b",
    description: "Classic kale with robust flavor",
    isActive: true
  },

  // SPINACH
  {
    name: "Baby Spinach",
    ingredientType: "vegetable" as const,
    baseIngredient: "spinach",
    variantName: "Baby",
    origin: "Chicago Indoor Farms",
    isOrganic: true,
    isLocalChicago: true,
    baseCostPerOz: "0.48",
    currentMarketPrice: "0.48",
    seasonalAvailability: ["Year-round"],
    nutritionProfile: {
      calories: 23,
      sugar: 0,
      fiber: 2,
      iron: 15
    },
    color: "#4a7c59",
    description: "Tender and mild, nutrient-dense",
    isActive: true
  },

  // LEMON
  {
    name: "Meyer Lemon",
    ingredientType: "fruit" as const,
    baseIngredient: "lemon",
    variantName: "Meyer",
    origin: "California",
    isOrganic: true,
    isLocalChicago: false,
    baseCostPerOz: "0.60",
    currentMarketPrice: "0.60",
    seasonalAvailability: ["November", "December", "January", "February", "March"],
    nutritionProfile: {
      calories: 29,
      sugar: 2,
      fiber: 3,
      vitaminC: 53
    },
    color: "#ffd700",
    description: "Sweeter and less acidic than regular lemons",
    isActive: true
  },

  // CUCUMBER
  {
    name: "English Cucumber",
    ingredientType: "vegetable" as const,
    baseIngredient: "cucumber",
    variantName: "English",
    origin: "Chicago Greenhouses",
    isOrganic: true,
    isLocalChicago: true,
    baseCostPerOz: "0.30",
    currentMarketPrice: "0.30",
    seasonalAvailability: ["Year-round"],
    nutritionProfile: {
      calories: 16,
      sugar: 2,
      fiber: 1,
      hydration: 96
    },
    color: "#98fb98",
    description: "Mild, crisp, and ultra-hydrating",
    isActive: true
  }
];

async function seed() {
  console.log("🌱 Seeding ingredient variants...");

  for (const variant of variantsData) {
    await db.insert(ingredientVariants).values(variant);
    console.log(`   ✓ Added ${variant.name}`);
  }

  console.log("✅ Ingredient variants seeded successfully!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Error seeding ingredient variants:", error);
  process.exit(1);
});
