-- Add ingredient variants for fruit/veggie customization
CREATE TABLE "ingredient_variants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"ingredient_type" ingredient_type NOT NULL,
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

-- Custom blend recipes (user-created juice formulas)
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

-- Blend ingredients junction table
CREATE TABLE "blend_ingredients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"blend_id" uuid NOT NULL,
	"variant_id" uuid NOT NULL,
	"percentage" numeric(5, 2) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- Subscription plans/tiers
CREATE TABLE "subscription_plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"tier" subscription_tier NOT NULL,
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

-- User subscriptions to plans
CREATE TABLE "user_subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"plan_id" uuid NOT NULL,
	"status" subscription_status DEFAULT 'active' NOT NULL,
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

-- Delivery schedules with recurring patterns
CREATE TABLE "delivery_schedules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"subscription_id" uuid,
	"frequency" delivery_frequency NOT NULL,
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

-- Add foreign keys
ALTER TABLE "custom_blend_recipes" ADD CONSTRAINT "custom_blend_recipes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "blend_ingredients" ADD CONSTRAINT "blend_ingredients_blend_id_custom_blend_recipes_id_fk" FOREIGN KEY ("blend_id") REFERENCES "public"."custom_blend_recipes"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "blend_ingredients" ADD CONSTRAINT "blend_ingredients_variant_id_ingredient_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."ingredient_variants"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "user_subscriptions" ADD CONSTRAINT "user_subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "user_subscriptions" ADD CONSTRAINT "user_subscriptions_plan_id_subscription_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."subscription_plans"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "delivery_schedules" ADD CONSTRAINT "delivery_schedules_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "delivery_schedules" ADD CONSTRAINT "delivery_schedules_subscription_id_user_subscriptions_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "public"."user_subscriptions"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "delivery_schedules" ADD CONSTRAINT "delivery_schedules_address_id_addresses_id_fk" FOREIGN KEY ("address_id") REFERENCES "public"."addresses"("id") ON DELETE no action ON UPDATE no action;

-- Add indexes
CREATE INDEX "ingredient_variants_type_idx" ON "ingredient_variants" USING btree ("ingredient_type");
CREATE INDEX "ingredient_variants_base_ingredient_idx" ON "ingredient_variants" USING btree ("base_ingredient");
CREATE INDEX "ingredient_variants_active_idx" ON "ingredient_variants" USING btree ("is_active");
CREATE INDEX "ingredient_variants_organic_idx" ON "ingredient_variants" USING btree ("is_organic");
CREATE INDEX "ingredient_variants_local_idx" ON "ingredient_variants" USING btree ("is_local_chicago");
CREATE UNIQUE INDEX "ingredient_variants_name_unique_idx" ON "ingredient_variants" USING btree ("base_ingredient","variant_name");

CREATE INDEX "custom_blend_recipes_user_id_idx" ON "custom_blend_recipes" USING btree ("user_id");
CREATE INDEX "custom_blend_recipes_public_idx" ON "custom_blend_recipes" USING btree ("is_public");
CREATE INDEX "custom_blend_recipes_favorite_idx" ON "custom_blend_recipes" USING btree ("is_favorite");
CREATE INDEX "custom_blend_recipes_popularity_idx" ON "custom_blend_recipes" USING btree ("times_ordered");

CREATE INDEX "blend_ingredients_blend_id_idx" ON "blend_ingredients" USING btree ("blend_id");
CREATE INDEX "blend_ingredients_variant_id_idx" ON "blend_ingredients" USING btree ("variant_id");
CREATE UNIQUE INDEX "blend_ingredients_blend_variant_unique_idx" ON "blend_ingredients" USING btree ("blend_id","variant_id");

CREATE INDEX "subscription_plans_tier_idx" ON "subscription_plans" USING btree ("tier");
CREATE INDEX "subscription_plans_active_idx" ON "subscription_plans" USING btree ("is_active");
CREATE INDEX "subscription_plans_sort_order_idx" ON "subscription_plans" USING btree ("sort_order");

CREATE INDEX "user_subscriptions_user_id_idx" ON "user_subscriptions" USING btree ("user_id");
CREATE INDEX "user_subscriptions_plan_id_idx" ON "user_subscriptions" USING btree ("plan_id");
CREATE INDEX "user_subscriptions_status_idx" ON "user_subscriptions" USING btree ("status");
CREATE INDEX "user_subscriptions_next_billing_date_idx" ON "user_subscriptions" USING btree ("next_billing_date");

CREATE INDEX "delivery_schedules_user_id_idx" ON "delivery_schedules" USING btree ("user_id");
CREATE INDEX "delivery_schedules_subscription_id_idx" ON "delivery_schedules" USING btree ("subscription_id");
CREATE INDEX "delivery_schedules_active_idx" ON "delivery_schedules" USING btree ("is_active");
CREATE INDEX "delivery_schedules_next_delivery_idx" ON "delivery_schedules" USING btree ("next_delivery_date");
