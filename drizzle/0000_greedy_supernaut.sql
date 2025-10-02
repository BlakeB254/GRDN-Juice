CREATE TYPE "public"."container_type" AS ENUM('glass_bottle', 'customer_container');--> statement-breakpoint
CREATE TYPE "public"."delivery_frequency" AS ENUM('daily', 'weekly', 'biweekly', 'monthly');--> statement-breakpoint
CREATE TYPE "public"."delivery_status" AS ENUM('scheduled', 'in_transit', 'delivered', 'failed');--> statement-breakpoint
CREATE TYPE "public"."fulfillment_method" AS ENUM('pickup', 'delivery');--> statement-breakpoint
CREATE TYPE "public"."ingredient_type" AS ENUM('fruit', 'vegetable', 'herb', 'supplement');--> statement-breakpoint
CREATE TYPE "public"."juice_type" AS ENUM('fruit', 'vegetable', 'combo', 'wellness');--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."product_category" AS ENUM('single_source', 'combo_mix', 'wellness_shot');--> statement-breakpoint
CREATE TYPE "public"."size_name" AS ENUM('8oz', '12oz', '16oz', '32oz', '64oz', '128oz');--> statement-breakpoint
CREATE TYPE "public"."subscription_status" AS ENUM('active', 'paused', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."subscription_tier" AS ENUM('basic', 'premium', 'vip');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('customer', 'admin', 'delivery', 'b2b');--> statement-breakpoint
CREATE TABLE "addresses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"street" text NOT NULL,
	"city" text NOT NULL,
	"state" text NOT NULL,
	"zip_code" text NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"delivery_instructions" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blend_ingredients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"blend_id" uuid NOT NULL,
	"variant_id" uuid NOT NULL,
	"percentage" numeric(5, 2) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "custom_blend_recipes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"blend_composition" jsonb NOT NULL,
	"total_percentage" integer DEFAULT 100 NOT NULL,
	"estimated_color" text DEFAULT '#16a34a' NOT NULL,
	"aggregated_nutrition" jsonb,
	"is_public" boolean DEFAULT false NOT NULL,
	"is_favorite" boolean DEFAULT false NOT NULL,
	"times_ordered" integer DEFAULT 0 NOT NULL,
	"average_rating" numeric(3, 2),
	"tags" text[],
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "delivery_schedules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"subscription_id" uuid,
	"frequency" "delivery_frequency" NOT NULL,
	"preferred_days" text[],
	"preferred_time_window" text,
	"address_id" uuid NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"next_delivery_date" timestamp,
	"blackout_dates" jsonb,
	"special_instructions" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dynamic_pricing_rules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"rule_name" text NOT NULL,
	"rule_type" text NOT NULL,
	"tier_multipliers" jsonb,
	"volume_discounts" jsonb,
	"seasonal_adjustments" jsonb,
	"minimum_order_ounces" integer,
	"maximum_order_ounces" integer,
	"is_active" boolean DEFAULT true NOT NULL,
	"effective_start_date" timestamp DEFAULT now() NOT NULL,
	"effective_end_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "glass_jar_pricing" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"size_name" "size_name" NOT NULL,
	"ounces" integer NOT NULL,
	"deposit_amount" numeric(10, 2) NOT NULL,
	"discount_amount" numeric(10, 2) DEFAULT '0' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "glass_jar_pricing_size_name_unique" UNIQUE("size_name")
);
--> statement-breakpoint
CREATE TABLE "ingredient_variants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"ingredient_type" "ingredient_type" NOT NULL,
	"base_ingredient" text NOT NULL,
	"variant_name" text NOT NULL,
	"origin" text,
	"is_organic" boolean DEFAULT false NOT NULL,
	"is_local_chicago" boolean DEFAULT false NOT NULL,
	"base_cost_per_oz" numeric(10, 4) NOT NULL,
	"current_market_price" numeric(10, 4),
	"seasonal_availability" text[],
	"nutrition_profile" jsonb,
	"color" text DEFAULT '#16a34a' NOT NULL,
	"description" text,
	"image_url" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"address_id" uuid NOT NULL,
	"status" "order_status" DEFAULT 'pending' NOT NULL,
	"total_amount" numeric(10, 2) NOT NULL,
	"delivery_date" timestamp NOT NULL,
	"delivery_time_window" text,
	"special_instructions" text,
	"stripe_payment_intent_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_sizes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"size_name" "size_name" NOT NULL,
	"ounces" integer NOT NULL,
	"price_per_oz" numeric(10, 4) NOT NULL,
	"total_price" numeric(10, 2) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"category" "product_category" NOT NULL,
	"juice_type" "juice_type" NOT NULL,
	"source" text,
	"color" text DEFAULT '#16a34a' NOT NULL,
	"has_pulp_options" boolean DEFAULT false NOT NULL,
	"default_pulp_level" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"image_url" text,
	"ingredients" text[],
	"nutrition_facts" jsonb,
	"allergen_info" text,
	"shelf_life_days" integer DEFAULT 7 NOT NULL,
	"storage_instructions" text DEFAULT 'Keep refrigerated at 35-40°F' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"user_agent" text,
	"ip_address" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "subscription_plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"tier" "subscription_tier" NOT NULL,
	"description" text,
	"monthly_commitment" integer NOT NULL,
	"price_per_month" numeric(10, 2) NOT NULL,
	"discount_percentage" numeric(5, 2) DEFAULT '0' NOT NULL,
	"per_oz_multiplier" numeric(5, 4) DEFAULT '1.0000' NOT NULL,
	"volume_discount_threshold" integer,
	"volume_discount_percentage" numeric(5, 2),
	"features" jsonb,
	"priority_delivery" boolean DEFAULT false NOT NULL,
	"exclusive_blends" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"plan_id" uuid NOT NULL,
	"status" "subscription_status" DEFAULT 'active' NOT NULL,
	"start_date" timestamp DEFAULT now() NOT NULL,
	"next_billing_date" timestamp NOT NULL,
	"end_date" timestamp,
	"paused_at" timestamp,
	"cancelled_at" timestamp,
	"cancellation_reason" text,
	"stripe_subscription_id" text,
	"stripe_customer_id" text,
	"current_period_start" timestamp,
	"current_period_end" timestamp,
	"loyalty_points" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"phone" text,
	"role" "user_role" DEFAULT 'customer' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"last_login_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blend_ingredients" ADD CONSTRAINT "blend_ingredients_blend_id_custom_blend_recipes_id_fk" FOREIGN KEY ("blend_id") REFERENCES "public"."custom_blend_recipes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blend_ingredients" ADD CONSTRAINT "blend_ingredients_variant_id_ingredient_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."ingredient_variants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "custom_blend_recipes" ADD CONSTRAINT "custom_blend_recipes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery_schedules" ADD CONSTRAINT "delivery_schedules_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery_schedules" ADD CONSTRAINT "delivery_schedules_subscription_id_user_subscriptions_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "public"."user_subscriptions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery_schedules" ADD CONSTRAINT "delivery_schedules_address_id_addresses_id_fk" FOREIGN KEY ("address_id") REFERENCES "public"."addresses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_address_id_addresses_id_fk" FOREIGN KEY ("address_id") REFERENCES "public"."addresses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_sizes" ADD CONSTRAINT "product_sizes_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_subscriptions" ADD CONSTRAINT "user_subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_subscriptions" ADD CONSTRAINT "user_subscriptions_plan_id_subscription_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."subscription_plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "addresses_user_id_idx" ON "addresses" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "addresses_zip_code_idx" ON "addresses" USING btree ("zip_code");--> statement-breakpoint
CREATE INDEX "addresses_is_default_idx" ON "addresses" USING btree ("is_default");--> statement-breakpoint
CREATE INDEX "blend_ingredients_blend_id_idx" ON "blend_ingredients" USING btree ("blend_id");--> statement-breakpoint
CREATE INDEX "blend_ingredients_variant_id_idx" ON "blend_ingredients" USING btree ("variant_id");--> statement-breakpoint
CREATE UNIQUE INDEX "blend_ingredients_blend_variant_unique_idx" ON "blend_ingredients" USING btree ("blend_id","variant_id");--> statement-breakpoint
CREATE INDEX "custom_blend_recipes_user_id_idx" ON "custom_blend_recipes" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "custom_blend_recipes_public_idx" ON "custom_blend_recipes" USING btree ("is_public");--> statement-breakpoint
CREATE INDEX "custom_blend_recipes_favorite_idx" ON "custom_blend_recipes" USING btree ("is_favorite");--> statement-breakpoint
CREATE INDEX "custom_blend_recipes_popularity_idx" ON "custom_blend_recipes" USING btree ("times_ordered");--> statement-breakpoint
CREATE INDEX "delivery_schedules_user_id_idx" ON "delivery_schedules" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "delivery_schedules_subscription_id_idx" ON "delivery_schedules" USING btree ("subscription_id");--> statement-breakpoint
CREATE INDEX "delivery_schedules_active_idx" ON "delivery_schedules" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "delivery_schedules_next_delivery_idx" ON "delivery_schedules" USING btree ("next_delivery_date");--> statement-breakpoint
CREATE INDEX "dynamic_pricing_rules_type_idx" ON "dynamic_pricing_rules" USING btree ("rule_type");--> statement-breakpoint
CREATE INDEX "dynamic_pricing_rules_active_idx" ON "dynamic_pricing_rules" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "dynamic_pricing_rules_effective_dates_idx" ON "dynamic_pricing_rules" USING btree ("effective_start_date","effective_end_date");--> statement-breakpoint
CREATE INDEX "ingredient_variants_type_idx" ON "ingredient_variants" USING btree ("ingredient_type");--> statement-breakpoint
CREATE INDEX "ingredient_variants_base_ingredient_idx" ON "ingredient_variants" USING btree ("base_ingredient");--> statement-breakpoint
CREATE INDEX "ingredient_variants_active_idx" ON "ingredient_variants" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "ingredient_variants_organic_idx" ON "ingredient_variants" USING btree ("is_organic");--> statement-breakpoint
CREATE INDEX "ingredient_variants_local_idx" ON "ingredient_variants" USING btree ("is_local_chicago");--> statement-breakpoint
CREATE UNIQUE INDEX "ingredient_variants_name_unique_idx" ON "ingredient_variants" USING btree ("base_ingredient","variant_name");--> statement-breakpoint
CREATE INDEX "orders_user_id_idx" ON "orders" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "orders_status_idx" ON "orders" USING btree ("status");--> statement-breakpoint
CREATE INDEX "orders_delivery_date_idx" ON "orders" USING btree ("delivery_date");--> statement-breakpoint
CREATE INDEX "orders_created_at_idx" ON "orders" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "product_sizes_product_id_idx" ON "product_sizes" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "product_sizes_size_name_idx" ON "product_sizes" USING btree ("size_name");--> statement-breakpoint
CREATE INDEX "product_sizes_active_idx" ON "product_sizes" USING btree ("is_active");--> statement-breakpoint
CREATE UNIQUE INDEX "product_sizes_product_size_unique_idx" ON "product_sizes" USING btree ("product_id","size_name");--> statement-breakpoint
CREATE INDEX "products_category_idx" ON "products" USING btree ("category");--> statement-breakpoint
CREATE INDEX "products_juice_type_idx" ON "products" USING btree ("juice_type");--> statement-breakpoint
CREATE INDEX "products_active_idx" ON "products" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "products_featured_idx" ON "products" USING btree ("is_featured");--> statement-breakpoint
CREATE INDEX "products_sort_order_idx" ON "products" USING btree ("sort_order");--> statement-breakpoint
CREATE INDEX "sessions_user_id_idx" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "sessions_token_idx" ON "sessions" USING btree ("token");--> statement-breakpoint
CREATE INDEX "sessions_expires_at_idx" ON "sessions" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "subscription_plans_tier_idx" ON "subscription_plans" USING btree ("tier");--> statement-breakpoint
CREATE INDEX "subscription_plans_active_idx" ON "subscription_plans" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "subscription_plans_sort_order_idx" ON "subscription_plans" USING btree ("sort_order");--> statement-breakpoint
CREATE INDEX "user_subscriptions_user_id_idx" ON "user_subscriptions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_subscriptions_plan_id_idx" ON "user_subscriptions" USING btree ("plan_id");--> statement-breakpoint
CREATE INDEX "user_subscriptions_status_idx" ON "user_subscriptions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "user_subscriptions_next_billing_date_idx" ON "user_subscriptions" USING btree ("next_billing_date");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "users_role_idx" ON "users" USING btree ("role");--> statement-breakpoint
CREATE INDEX "users_is_active_idx" ON "users" USING btree ("is_active");