import { db } from "@db";
import { ingredientVariants, subscriptionPlans, userSubscriptions } from "@db/schema";
import { eq, and } from "drizzle-orm";

export interface BlendIngredient {
  variantId: string;
  percentage: number;
}

export interface PriceCalculationParams {
  userId?: string;
  blendIngredients: BlendIngredient[];
  ounces: number;
}

export interface PriceBreakdownItem {
  variantName: string;
  percentage: number;
  costPerOz: number;
  costContribution: number;
}

export interface PriceCalculationResult {
  basePrice: number;
  subscriptionDiscount: number;
  volumeDiscount: number;
  finalPrice: number;
  pricePerOz: number;
  subscriptionTier?: string;
  priceBreakdown: PriceBreakdownItem[];
}

/**
 * Calculate the price for a custom juice blend based on:
 * - Ingredient variant costs
 * - User's subscription tier (if any)
 * - Volume discounts
 */
export async function calculateBlendPrice(
  params: PriceCalculationParams
): Promise<PriceCalculationResult> {
  const { userId, blendIngredients, ounces } = params;

  // 1. Get ingredient costs
  const variantIds = blendIngredients.map(bi => bi.variantId);
  const variants = await db.query.ingredientVariants.findMany({
    where: (fields, { inArray }) => inArray(fields.id, variantIds)
  });

  // 2. Calculate base price per oz based on ingredient composition
  let basePricePerOz = 0;
  const priceBreakdown: PriceBreakdownItem[] = [];

  for (const ingredient of blendIngredients) {
    const variant = variants.find(v => v.id === ingredient.variantId);
    if (!variant) {
      throw new Error(`Variant ${ingredient.variantId} not found`);
    }

    const costPerOz = parseFloat(variant.baseCostPerOz);
    const percentage = ingredient.percentage / 100;
    const contribution = costPerOz * percentage;

    basePricePerOz += contribution;

    priceBreakdown.push({
      variantName: variant.name,
      percentage: ingredient.percentage,
      costPerOz,
      costContribution: contribution * ounces
    });
  }

  // 3. Calculate base price
  const basePrice = basePricePerOz * ounces;

  // 4. Get user's subscription tier (if logged in)
  let subscriptionTier: string | undefined;
  let perOzMultiplier = 1.0;
  let volumeDiscountThreshold: number | null = null;
  let volumeDiscountPercentage = 0;

  if (userId) {
    const userSub = await db.query.userSubscriptions.findFirst({
      where: and(
        eq(userSubscriptions.userId, userId),
        eq(userSubscriptions.status, 'active')
      ),
      with: {
        plan: true
      }
    });

    if (userSub && userSub.plan) {
      subscriptionTier = userSub.plan.tier;
      perOzMultiplier = parseFloat(userSub.plan.perOzMultiplier);
      volumeDiscountThreshold = userSub.plan.volumeDiscountThreshold;
      volumeDiscountPercentage = userSub.plan.volumeDiscountPercentage
        ? parseFloat(userSub.plan.volumeDiscountPercentage)
        : 0;
    }
  }

  // 5. Apply subscription discount
  const priceAfterSubscription = basePrice * perOzMultiplier;
  const subscriptionDiscount = basePrice - priceAfterSubscription;

  // 6. Apply volume discount (if applicable)
  let volumeDiscount = 0;
  if (volumeDiscountThreshold && ounces >= volumeDiscountThreshold && volumeDiscountPercentage > 0) {
    volumeDiscount = priceAfterSubscription * (volumeDiscountPercentage / 100);
  }

  // 7. Calculate final price
  const finalPrice = priceAfterSubscription - volumeDiscount;
  const finalPricePerOz = finalPrice / ounces;

  return {
    basePrice: parseFloat(basePrice.toFixed(2)),
    subscriptionDiscount: parseFloat(subscriptionDiscount.toFixed(2)),
    volumeDiscount: parseFloat(volumeDiscount.toFixed(2)),
    finalPrice: parseFloat(finalPrice.toFixed(2)),
    pricePerOz: parseFloat(finalPricePerOz.toFixed(4)),
    subscriptionTier,
    priceBreakdown
  };
}

/**
 * Get all active subscription plans with pricing details
 */
export async function getSubscriptionPlans() {
  return await db.query.subscriptionPlans.findMany({
    where: eq(subscriptionPlans.isActive, true),
    orderBy: (fields, { asc }) => [asc(fields.sortOrder)]
  });
}

/**
 * Calculate savings for each subscription tier for a given blend
 */
export async function calculateTierSavings(
  blendIngredients: BlendIngredient[],
  ounces: number
) {
  const plans = await getSubscriptionPlans();
  const baseCalc = await calculateBlendPrice({ blendIngredients, ounces });

  const savings = await Promise.all(
    plans.map(async (plan) => {
      // Temporarily calculate as if user has this plan
      const variantIds = blendIngredients.map(bi => bi.variantId);
      const variants = await db.query.ingredientVariants.findMany({
        where: (fields, { inArray }) => inArray(fields.id, variantIds)
      });

      let basePricePerOz = 0;
      for (const ingredient of blendIngredients) {
        const variant = variants.find(v => v.id === ingredient.variantId);
        if (variant) {
          const costPerOz = parseFloat(variant.baseCostPerOz);
          const percentage = ingredient.percentage / 100;
          basePricePerOz += costPerOz * percentage;
        }
      }

      const basePrice = basePricePerOz * ounces;
      const perOzMultiplier = parseFloat(plan.perOzMultiplier);
      const priceAfterSubscription = basePrice * perOzMultiplier;

      let volumeDiscount = 0;
      if (plan.volumeDiscountThreshold && ounces >= plan.volumeDiscountThreshold && plan.volumeDiscountPercentage) {
        volumeDiscount = priceAfterSubscription * (parseFloat(plan.volumeDiscountPercentage) / 100);
      }

      const finalPrice = priceAfterSubscription - volumeDiscount;
      const savings = basePrice - finalPrice;
      const savingsPercentage = (savings / basePrice) * 100;

      return {
        planId: plan.id,
        planName: plan.name,
        tier: plan.tier,
        monthlyFee: parseFloat(plan.pricePerMonth),
        finalPrice: parseFloat(finalPrice.toFixed(2)),
        savings: parseFloat(savings.toFixed(2)),
        savingsPercentage: parseFloat(savingsPercentage.toFixed(2))
      };
    })
  );

  return {
    basePrice: baseCalc.basePrice,
    tierSavings: savings
  };
}
