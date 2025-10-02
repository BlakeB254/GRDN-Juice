import { db } from "@db";
import { subscriptionPlans } from "@db/schema";

const plansData = [
  {
    name: "Juice Enthusiast",
    tier: "basic" as const,
    description: "Perfect for trying out our custom juice service",
    monthlyCommitment: 1,
    pricePerMonth: "0.00",
    discountPercentage: "0.00",
    perOzMultiplier: "1.0000",
    volumeDiscountThreshold: null,
    volumeDiscountPercentage: null,
    features: {
      benefits: [
        "Create custom blend recipes",
        "Standard delivery windows",
        "Access to seasonal ingredients",
        "Community blend discovery"
      ]
    },
    priorityDelivery: false,
    exclusiveBlends: false,
    isActive: true,
    sortOrder: 1
  },
  {
    name: "Juice Lover - Monthly",
    tier: "premium" as const,
    description: "Our most popular plan for regular juice drinkers",
    monthlyCommitment: 1,
    pricePerMonth: "29.99",
    discountPercentage: "10.00",
    perOzMultiplier: "0.9000",
    volumeDiscountThreshold: 128,
    volumeDiscountPercentage: "5.00",
    features: {
      benefits: [
        "10% off all juices",
        "Priority delivery windows",
        "Additional 5% off orders over 128oz",
        "Early access to new ingredients",
        "Save favorite blends",
        "Free delivery on orders over $50"
      ]
    },
    priorityDelivery: true,
    exclusiveBlends: false,
    isActive: true,
    sortOrder: 2
  },
  {
    name: "Juice Lover - Quarterly",
    tier: "premium" as const,
    description: "Save more with a 3-month commitment",
    monthlyCommitment: 3,
    pricePerMonth: "79.99",
    discountPercentage: "15.00",
    perOzMultiplier: "0.8500",
    volumeDiscountThreshold: 128,
    volumeDiscountPercentage: "8.00",
    features: {
      benefits: [
        "15% off all juices",
        "Priority delivery windows",
        "Additional 8% off orders over 128oz",
        "Early access to new ingredients",
        "Save unlimited favorite blends",
        "Free delivery on all orders",
        "Quarterly seasonal ingredient box"
      ]
    },
    priorityDelivery: true,
    exclusiveBlends: false,
    isActive: true,
    sortOrder: 3
  },
  {
    name: "Garden District VIP",
    tier: "vip" as const,
    description: "The ultimate juice experience for true connoisseurs",
    monthlyCommitment: 6,
    pricePerMonth: "139.99",
    discountPercentage: "20.00",
    perOzMultiplier: "0.8000",
    volumeDiscountThreshold: 64,
    volumeDiscountPercentage: "10.00",
    features: {
      benefits: [
        "20% off all juices",
        "Guaranteed priority delivery - your preferred time",
        "Additional 10% off orders over 64oz",
        "Exclusive access to limited-edition blends",
        "Access to ultra-premium ingredients",
        "Personal blend consultation monthly",
        "Free delivery on all orders",
        "Custom glass bottle engraving",
        "Monthly surprise ingredient add-on",
        "Loyalty points earn 2x faster",
        "VIP-only events and tastings"
      ]
    },
    priorityDelivery: true,
    exclusiveBlends: true,
    isActive: true,
    sortOrder: 4
  },
  {
    name: "Garden District VIP - Annual",
    tier: "vip" as const,
    description: "Our best value - commit for a year and save big",
    monthlyCommitment: 12,
    pricePerMonth: "1499.99",
    discountPercentage: "25.00",
    perOzMultiplier: "0.7500",
    volumeDiscountThreshold: 32,
    volumeDiscountPercentage: "15.00",
    features: {
      benefits: [
        "25% off all juices - our biggest discount!",
        "White-glove delivery service",
        "Additional 15% off orders over 32oz",
        "First access to all new ingredients and blends",
        "Unlimited exclusive premium ingredients",
        "Weekly personal blend consultation",
        "Free delivery always - even same-day",
        "Premium glass bottle set included",
        "Bi-weekly surprise ingredient boxes",
        "Loyalty points earn 3x faster",
        "VIP-only events, tastings, and farm tours",
        "Annual Chicago juice crawl experience",
        "Dedicated customer success manager"
      ]
    },
    priorityDelivery: true,
    exclusiveBlends: true,
    isActive: true,
    sortOrder: 5
  }
];

async function seed() {
  console.log("🌱 Seeding subscription plans...");

  for (const plan of plansData) {
    await db.insert(subscriptionPlans).values(plan);
    console.log(`   ✓ Added ${plan.name} (${plan.tier})`);
  }

  console.log("✅ Subscription plans seeded successfully!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Error seeding subscription plans:", error);
  process.exit(1);
});
