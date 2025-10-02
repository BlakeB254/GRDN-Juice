// Shared types between client and server
export type UserRole = 'customer' | 'admin' | 'delivery' | 'b2b';
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
export type ProductCategory = 'single_source' | 'combo_mix' | 'wellness_shot';
export type JuiceType = 'fruit' | 'vegetable' | 'combo' | 'wellness';
export type SizeName = '8oz' | '12oz' | '16oz' | '32oz' | '64oz' | '128oz';
export type SubscriptionTier = 'basic' | 'premium' | 'vip';
export type SubscriptionStatus = 'active' | 'paused' | 'cancelled';
export type IngredientType = 'fruit' | 'vegetable' | 'herb' | 'supplement';
export type DeliveryFrequency = 'daily' | 'weekly' | 'biweekly' | 'monthly';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  category: ProductCategory;
  juiceType: JuiceType;
  source?: string;
  color: string;
  isActive: boolean;
  isFeatured: boolean;
  imageUrl?: string;
  ingredients?: string[];
  productSizes?: ProductSize[];
}

export interface ProductSize {
  id: string;
  productId: string;
  sizeName: SizeName;
  ounces: number;
  pricePerOz: string;
  totalPrice: string;
  isActive: boolean;
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  totalAmount: string;
  deliveryDate: string;
  deliveryTimeWindow?: string;
  specialInstructions?: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  tier: SubscriptionTier;
  description?: string;
  monthlyCommitment: number;
  pricePerMonth: string;
  discountPercentage: string;
  perOzMultiplier: string;
  volumeDiscountThreshold?: number;
  volumeDiscountPercentage?: string;
  features?: Record<string, any>;
  priorityDelivery: boolean;
  exclusiveBlends: boolean;
  isActive: boolean;
  sortOrder: number;
}

export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  status: SubscriptionStatus;
  startDate: string;
  nextBillingDate: string;
  endDate?: string;
  loyaltyPoints: number;
  plan?: SubscriptionPlan;
}

export interface IngredientVariant {
  id: string;
  name: string;
  ingredientType: IngredientType;
  baseIngredient: string;
  variantName: string;
  origin?: string;
  isOrganic: boolean;
  isLocalChicago: boolean;
  baseCostPerOz: string;
  currentMarketPrice?: string;
  seasonalAvailability?: string[];
  nutritionProfile?: Record<string, any>;
  color: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
}

export interface BlendComposition {
  variantId: string;
  percentage: number;
  variant?: IngredientVariant;
}

export interface CustomBlendRecipe {
  id: string;
  userId: string;
  name: string;
  description?: string;
  blendComposition: BlendComposition[];
  totalPercentage: number;
  estimatedColor: string;
  aggregatedNutrition?: Record<string, any>;
  isPublic: boolean;
  isFavorite: boolean;
  timesOrdered: number;
  averageRating?: string;
  tags?: string[];
  createdAt: string;
}

export interface DeliverySchedule {
  id: string;
  userId: string;
  subscriptionId?: string;
  frequency: DeliveryFrequency;
  preferredDays?: string[];
  preferredTimeWindow?: string;
  addressId: string;
  isActive: boolean;
  nextDeliveryDate?: string;
  blackoutDates?: Record<string, any>;
  specialInstructions?: string;
}

export interface DynamicPricingRule {
  id: string;
  ruleName: string;
  ruleType: string;
  tierMultipliers?: Record<SubscriptionTier, number>;
  volumeDiscounts?: Array<{ threshold: number; discount: number }>;
  seasonalAdjustments?: Record<string, number>;
  minimumOrderOunces?: number;
  maximumOrderOunces?: number;
  isActive: boolean;
  effectiveStartDate: string;
  effectiveEndDate?: string;
}

export interface BlendPriceCalculation {
  basePrice: number;
  subscriptionDiscount: number;
  volumeDiscount: number;
  finalPrice: number;
  priceBreakdown: Array<{
    variantName: string;
    percentage: number;
    costContribution: number;
  }>;
}
