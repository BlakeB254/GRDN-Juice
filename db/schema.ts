import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  integer,
  decimal,
  jsonb,
  varchar,
  pgEnum,
  index,
  uniqueIndex
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const userRoleEnum = pgEnum('user_role', ['customer', 'admin', 'delivery', 'b2b']);
export const subscriptionStatusEnum = pgEnum('subscription_status', ['active', 'paused', 'cancelled']);
export const orderStatusEnum = pgEnum('order_status', ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled']);
export const containerTypeEnum = pgEnum('container_type', ['glass_bottle', 'customer_container']);
export const deliveryStatusEnum = pgEnum('delivery_status', ['scheduled', 'in_transit', 'delivered', 'failed']);
export const productCategoryEnum = pgEnum('product_category', ['single_source', 'combo_mix', 'wellness_shot']);
export const sizeNameEnum = pgEnum('size_name', ['8oz', '12oz', '16oz', '32oz', '64oz', '128oz']);
export const juiceTypeEnum = pgEnum('juice_type', ['fruit', 'vegetable', 'combo', 'wellness']);
export const fulfillmentMethodEnum = pgEnum('fulfillment_method', ['pickup', 'delivery']);
export const subscriptionTierEnum = pgEnum('subscription_tier', ['basic', 'premium', 'vip']);
export const ingredientTypeEnum = pgEnum('ingredient_type', ['fruit', 'vegetable', 'herb', 'supplement']);
export const deliveryFrequencyEnum = pgEnum('delivery_frequency', ['daily', 'weekly', 'biweekly', 'monthly']);

// Users table
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  phone: text('phone'),
  role: userRoleEnum('role').default('customer').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  lastLoginAt: timestamp('last_login_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  emailIdx: uniqueIndex('users_email_idx').on(table.email),
  roleIdx: index('users_role_idx').on(table.role),
  isActiveIdx: index('users_is_active_idx').on(table.isActive),
}));

// Sessions table for refresh tokens
export const sessions = pgTable('sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  userAgent: text('user_agent'),
  ipAddress: text('ip_address'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('sessions_user_id_idx').on(table.userId),
  tokenIdx: uniqueIndex('sessions_token_idx').on(table.token),
  expiresAtIdx: index('sessions_expires_at_idx').on(table.expiresAt),
}));

// Products table
export const products = pgTable('products', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  category: productCategoryEnum('category').notNull(),
  juiceType: juiceTypeEnum('juice_type').notNull(),
  source: text('source'),
  color: text('color').default('#16a34a').notNull(),
  hasPulpOptions: boolean('has_pulp_options').default(false).notNull(),
  defaultPulpLevel: integer('default_pulp_level').default(0).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  isFeatured: boolean('is_featured').default(false).notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
  imageUrl: text('image_url'),
  ingredients: text('ingredients').array(),
  nutritionFacts: jsonb('nutrition_facts'),
  allergenInfo: text('allergen_info'),
  shelfLifeDays: integer('shelf_life_days').default(7).notNull(),
  storageInstructions: text('storage_instructions').default('Keep refrigerated at 35-40°F').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  categoryIdx: index('products_category_idx').on(table.category),
  juiceTypeIdx: index('products_juice_type_idx').on(table.juiceType),
  activeIdx: index('products_active_idx').on(table.isActive),
  featuredIdx: index('products_featured_idx').on(table.isFeatured),
  sortOrderIdx: index('products_sort_order_idx').on(table.sortOrder),
}));

// Product sizes table
export const productSizes = pgTable('product_sizes', {
  id: uuid('id').defaultRandom().primaryKey(),
  productId: uuid('product_id').references(() => products.id).notNull(),
  sizeName: sizeNameEnum('size_name').notNull(),
  ounces: integer('ounces').notNull(),
  pricePerOz: decimal('price_per_oz', { precision: 10, scale: 4 }).notNull(),
  totalPrice: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  productIdIdx: index('product_sizes_product_id_idx').on(table.productId),
  sizeNameIdx: index('product_sizes_size_name_idx').on(table.sizeName),
  activeIdx: index('product_sizes_active_idx').on(table.isActive),
  productSizeUniqueIdx: uniqueIndex('product_sizes_product_size_unique_idx').on(table.productId, table.sizeName),
}));

// Additional tables shortened for brevity - include all from source
export const glassJarPricing = pgTable('glass_jar_pricing', {
  id: uuid('id').defaultRandom().primaryKey(),
  sizeName: sizeNameEnum('size_name').notNull().unique(),
  ounces: integer('ounces').notNull(),
  depositAmount: decimal('deposit_amount', { precision: 10, scale: 2 }).notNull(),
  discountAmount: decimal('discount_amount', { precision: 10, scale: 2 }).default('0').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const addresses = pgTable('addresses', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  street: text('street').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  zipCode: text('zip_code').notNull(),
  isDefault: boolean('is_default').default(false).notNull(),
  deliveryInstructions: text('delivery_instructions'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('addresses_user_id_idx').on(table.userId),
  zipCodeIdx: index('addresses_zip_code_idx').on(table.zipCode),
  isDefaultIdx: index('addresses_is_default_idx').on(table.isDefault),
}));

export const orders = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  addressId: uuid('address_id').references(() => addresses.id).notNull(),
  status: orderStatusEnum('status').default('pending').notNull(),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  deliveryDate: timestamp('delivery_date').notNull(),
  deliveryTimeWindow: text('delivery_time_window'),
  specialInstructions: text('special_instructions'),
  stripePaymentIntentId: text('stripe_payment_intent_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('orders_user_id_idx').on(table.userId),
  statusIdx: index('orders_status_idx').on(table.status),
  deliveryDateIdx: index('orders_delivery_date_idx').on(table.deliveryDate),
  createdAtIdx: index('orders_created_at_idx').on(table.createdAt),
}));

// Subscription Plans table
export const subscriptionPlans = pgTable('subscription_plans', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  tier: subscriptionTierEnum('tier').notNull(),
  description: text('description'),
  monthlyCommitment: integer('monthly_commitment').notNull(),
  pricePerMonth: decimal('price_per_month', { precision: 10, scale: 2 }).notNull(),
  discountPercentage: decimal('discount_percentage', { precision: 5, scale: 2 }).default('0').notNull(),
  perOzMultiplier: decimal('per_oz_multiplier', { precision: 5, scale: 4 }).default('1.0000').notNull(),
  volumeDiscountThreshold: integer('volume_discount_threshold'),
  volumeDiscountPercentage: decimal('volume_discount_percentage', { precision: 5, scale: 2 }),
  features: jsonb('features'),
  priorityDelivery: boolean('priority_delivery').default(false).notNull(),
  exclusiveBlends: boolean('exclusive_blends').default(false).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  tierIdx: index('subscription_plans_tier_idx').on(table.tier),
  activeIdx: index('subscription_plans_active_idx').on(table.isActive),
  sortOrderIdx: index('subscription_plans_sort_order_idx').on(table.sortOrder),
}));

// User Subscriptions table
export const userSubscriptions = pgTable('user_subscriptions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  planId: uuid('plan_id').references(() => subscriptionPlans.id).notNull(),
  status: subscriptionStatusEnum('status').default('active').notNull(),
  startDate: timestamp('start_date').defaultNow().notNull(),
  nextBillingDate: timestamp('next_billing_date').notNull(),
  endDate: timestamp('end_date'),
  pausedAt: timestamp('paused_at'),
  cancelledAt: timestamp('cancelled_at'),
  cancellationReason: text('cancellation_reason'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  stripeCustomerId: text('stripe_customer_id'),
  currentPeriodStart: timestamp('current_period_start'),
  currentPeriodEnd: timestamp('current_period_end'),
  loyaltyPoints: integer('loyalty_points').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('user_subscriptions_user_id_idx').on(table.userId),
  planIdIdx: index('user_subscriptions_plan_id_idx').on(table.planId),
  statusIdx: index('user_subscriptions_status_idx').on(table.status),
  nextBillingDateIdx: index('user_subscriptions_next_billing_date_idx').on(table.nextBillingDate),
}));

// Ingredient Variants table
export const ingredientVariants = pgTable('ingredient_variants', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  ingredientType: ingredientTypeEnum('ingredient_type').notNull(),
  baseIngredient: text('base_ingredient').notNull(),
  variantName: text('variant_name').notNull(),
  origin: text('origin'),
  isOrganic: boolean('is_organic').default(false).notNull(),
  isLocalChicago: boolean('is_local_chicago').default(false).notNull(),
  baseCostPerOz: decimal('base_cost_per_oz', { precision: 10, scale: 4 }).notNull(),
  currentMarketPrice: decimal('current_market_price', { precision: 10, scale: 4 }),
  seasonalAvailability: text('seasonal_availability').array(),
  nutritionProfile: jsonb('nutrition_profile'),
  color: text('color').default('#16a34a').notNull(),
  description: text('description'),
  imageUrl: text('image_url'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  ingredientTypeIdx: index('ingredient_variants_type_idx').on(table.ingredientType),
  baseIngredientIdx: index('ingredient_variants_base_ingredient_idx').on(table.baseIngredient),
  activeIdx: index('ingredient_variants_active_idx').on(table.isActive),
  organicIdx: index('ingredient_variants_organic_idx').on(table.isOrganic),
  localIdx: index('ingredient_variants_local_idx').on(table.isLocalChicago),
  nameUniqueIdx: uniqueIndex('ingredient_variants_name_unique_idx').on(table.baseIngredient, table.variantName),
}));

// Custom Blend Recipes table
export const customBlendRecipes = pgTable('custom_blend_recipes', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  name: text('name').notNull(),
  description: text('description'),
  blendComposition: jsonb('blend_composition').notNull(),
  totalPercentage: integer('total_percentage').default(100).notNull(),
  estimatedColor: text('estimated_color').default('#16a34a').notNull(),
  aggregatedNutrition: jsonb('aggregated_nutrition'),
  isPublic: boolean('is_public').default(false).notNull(),
  isFavorite: boolean('is_favorite').default(false).notNull(),
  timesOrdered: integer('times_ordered').default(0).notNull(),
  averageRating: decimal('average_rating', { precision: 3, scale: 2 }),
  tags: text('tags').array(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('custom_blend_recipes_user_id_idx').on(table.userId),
  publicIdx: index('custom_blend_recipes_public_idx').on(table.isPublic),
  favoriteIdx: index('custom_blend_recipes_favorite_idx').on(table.isFavorite),
  popularityIdx: index('custom_blend_recipes_popularity_idx').on(table.timesOrdered),
}));

// Blend Ingredients junction table
export const blendIngredients = pgTable('blend_ingredients', {
  id: uuid('id').defaultRandom().primaryKey(),
  blendId: uuid('blend_id').references(() => customBlendRecipes.id).notNull(),
  variantId: uuid('variant_id').references(() => ingredientVariants.id).notNull(),
  percentage: decimal('percentage', { precision: 5, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  blendIdIdx: index('blend_ingredients_blend_id_idx').on(table.blendId),
  variantIdIdx: index('blend_ingredients_variant_id_idx').on(table.variantId),
  blendVariantUniqueIdx: uniqueIndex('blend_ingredients_blend_variant_unique_idx').on(table.blendId, table.variantId),
}));

// Delivery Schedules table
export const deliverySchedules = pgTable('delivery_schedules', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  subscriptionId: uuid('subscription_id').references(() => userSubscriptions.id),
  frequency: deliveryFrequencyEnum('frequency').notNull(),
  preferredDays: text('preferred_days').array(),
  preferredTimeWindow: text('preferred_time_window'),
  addressId: uuid('address_id').references(() => addresses.id).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  nextDeliveryDate: timestamp('next_delivery_date'),
  blackoutDates: jsonb('blackout_dates'),
  specialInstructions: text('special_instructions'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('delivery_schedules_user_id_idx').on(table.userId),
  subscriptionIdIdx: index('delivery_schedules_subscription_id_idx').on(table.subscriptionId),
  activeIdx: index('delivery_schedules_active_idx').on(table.isActive),
  nextDeliveryIdx: index('delivery_schedules_next_delivery_idx').on(table.nextDeliveryDate),
}));

// Dynamic Pricing Rules table
export const dynamicPricingRules = pgTable('dynamic_pricing_rules', {
  id: uuid('id').defaultRandom().primaryKey(),
  ruleName: text('rule_name').notNull(),
  ruleType: text('rule_type').notNull(),
  tierMultipliers: jsonb('tier_multipliers'),
  volumeDiscounts: jsonb('volume_discounts'),
  seasonalAdjustments: jsonb('seasonal_adjustments'),
  minimumOrderOunces: integer('minimum_order_ounces'),
  maximumOrderOunces: integer('maximum_order_ounces'),
  isActive: boolean('is_active').default(true).notNull(),
  effectiveStartDate: timestamp('effective_start_date').defaultNow().notNull(),
  effectiveEndDate: timestamp('effective_end_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  ruleTypeIdx: index('dynamic_pricing_rules_type_idx').on(table.ruleType),
  activeIdx: index('dynamic_pricing_rules_active_idx').on(table.isActive),
  effectiveDatesIdx: index('dynamic_pricing_rules_effective_dates_idx').on(table.effectiveStartDate, table.effectiveEndDate),
}));

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  addresses: many(addresses),
  orders: many(orders),
  sessions: many(sessions),
  subscriptions: many(userSubscriptions),
  customBlends: many(customBlendRecipes),
  deliverySchedules: many(deliverySchedules),
}));

export const productsRelations = relations(products, ({ many }) => ({
  productSizes: many(productSizes),
}));

export const productSizesRelations = relations(productSizes, ({ one }) => ({
  product: one(products, { fields: [productSizes.productId], references: [products.id] }),
}));

export const addressesRelations = relations(addresses, ({ one, many }) => ({
  user: one(users, { fields: [addresses.userId], references: [users.id] }),
  orders: many(orders),
  deliverySchedules: many(deliverySchedules),
}));

export const ordersRelations = relations(orders, ({ one }) => ({
  user: one(users, { fields: [orders.userId], references: [users.id] }),
  address: one(addresses, { fields: [orders.addressId], references: [orders.id] }),
}));

export const subscriptionPlansRelations = relations(subscriptionPlans, ({ many }) => ({
  userSubscriptions: many(userSubscriptions),
}));

export const userSubscriptionsRelations = relations(userSubscriptions, ({ one, many }) => ({
  user: one(users, { fields: [userSubscriptions.userId], references: [users.id] }),
  plan: one(subscriptionPlans, { fields: [userSubscriptions.planId], references: [subscriptionPlans.id] }),
  deliverySchedules: many(deliverySchedules),
}));

export const ingredientVariantsRelations = relations(ingredientVariants, ({ many }) => ({
  blendIngredients: many(blendIngredients),
}));

export const customBlendRecipesRelations = relations(customBlendRecipes, ({ one, many }) => ({
  user: one(users, { fields: [customBlendRecipes.userId], references: [users.id] }),
  blendIngredients: many(blendIngredients),
}));

export const blendIngredientsRelations = relations(blendIngredients, ({ one }) => ({
  blend: one(customBlendRecipes, { fields: [blendIngredients.blendId], references: [customBlendRecipes.id] }),
  variant: one(ingredientVariants, { fields: [blendIngredients.variantId], references: [ingredientVariants.id] }),
}));

export const deliverySchedulesRelations = relations(deliverySchedules, ({ one }) => ({
  user: one(users, { fields: [deliverySchedules.userId], references: [users.id] }),
  subscription: one(userSubscriptions, { fields: [deliverySchedules.subscriptionId], references: [userSubscriptions.id] }),
  address: one(addresses, { fields: [deliverySchedules.addressId], references: [addresses.id] }),
}));
