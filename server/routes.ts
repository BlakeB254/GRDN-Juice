import type { Express } from "express";
import { createServer } from "http";
import { db } from "@db";
import { products, users, ingredientVariants, customBlendRecipes, subscriptionPlans } from "@db/schema";
import { eq } from "drizzle-orm";
import { calculateBlendPrice, calculateTierSavings, getSubscriptionPlans } from "./services/pricing";

export function registerRoutes(app: Express) {
  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Get all products
  app.get("/api/products", async (_req, res) => {
    try {
      const allProducts = await db.query.products.findMany({
        where: eq(products.isActive, true),
        orderBy: (products, { asc }) => [asc(products.sortOrder)],
        with: {
          productSizes: true,
        },
      });
      res.json(allProducts);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get single product by ID
  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await db.query.products.findFirst({
        where: eq(products.id, req.params.id),
        with: {
          productSizes: true,
        },
      });

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json(product);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ========== INGREDIENT VARIANTS ==========

  // Get all ingredient variants
  app.get("/api/ingredient-variants", async (req, res) => {
    try {
      const { type, organic, local } = req.query;

      let conditions: any = eq(ingredientVariants.isActive, true);

      // TODO: Add filtering by type, organic, local

      const variants = await db.query.ingredientVariants.findMany({
        where: conditions,
        orderBy: (fields, { asc }) => [asc(fields.baseIngredient), asc(fields.variantName)]
      });

      res.json(variants);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get ingredient variants by type
  app.get("/api/ingredient-variants/type/:type", async (req, res) => {
    try {
      const variants = await db.query.ingredientVariants.findMany({
        where: eq(ingredientVariants.ingredientType, req.params.type as any),
        orderBy: (fields, { asc }) => [asc(fields.baseIngredient), asc(fields.variantName)]
      });

      res.json(variants);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ========== CUSTOM BLENDS ==========

  // Get user's custom blends
  app.get("/api/custom-blends", async (req, res) => {
    try {
      // TODO: Add authentication middleware
      const userId = req.query.userId as string;

      if (!userId) {
        return res.status(400).json({ message: "User ID required" });
      }

      const blends = await db.query.customBlendRecipes.findMany({
        where: eq(customBlendRecipes.userId, userId),
        with: {
          blendIngredients: {
            with: {
              variant: true
            }
          }
        },
        orderBy: (fields, { desc }) => [desc(fields.createdAt)]
      });

      res.json(blends);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get public blends (community)
  app.get("/api/custom-blends/public", async (req, res) => {
    try {
      const blends = await db.query.customBlendRecipes.findMany({
        where: eq(customBlendRecipes.isPublic, true),
        with: {
          blendIngredients: {
            with: {
              variant: true
            }
          }
        },
        orderBy: (fields, { desc }) => [desc(fields.timesOrdered)]
      });

      res.json(blends);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Alias for community blends
  app.get("/api/community-blends", async (req, res) => {
    try {
      const blends = await db.query.customBlendRecipes.findMany({
        where: eq(customBlendRecipes.isPublic, true),
        with: {
          blendIngredients: {
            with: {
              variant: true
            }
          }
        },
        orderBy: (fields, { desc }) => [desc(fields.timesOrdered)]
      });

      res.json(blends);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Create custom blend
  app.post("/api/custom-blends", async (req, res) => {
    try {
      // TODO: Add authentication middleware
      const { userId, name, description, blendIngredients, tags } = req.body;

      if (!userId || !name || !blendIngredients || blendIngredients.length === 0) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // TODO: Validate blend composition and create blend with ingredients

      res.status(501).json({ message: "Create blend endpoint coming soon" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ========== PRICING ==========

  // Calculate blend price
  app.post("/api/pricing/calculate", async (req, res) => {
    try {
      const { userId, blendIngredients, ounces } = req.body;

      if (!blendIngredients || !ounces) {
        return res.status(400).json({ message: "Missing blend ingredients or ounces" });
      }

      const pricing = await calculateBlendPrice({
        userId,
        blendIngredients,
        ounces
      });

      res.json(pricing);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get subscription tier savings
  app.post("/api/pricing/tier-savings", async (req, res) => {
    try {
      const { blendIngredients, ounces } = req.body;

      if (!blendIngredients || !ounces) {
        return res.status(400).json({ message: "Missing blend ingredients or ounces" });
      }

      const savings = await calculateTierSavings(blendIngredients, ounces);

      res.json(savings);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ========== SUBSCRIPTION PLANS ==========

  // Get all subscription plans
  app.get("/api/subscription-plans", async (_req, res) => {
    try {
      const plans = await getSubscriptionPlans();
      res.json(plans);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Auth endpoint - login (placeholder)
  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // TODO: Add bcrypt password verification
      // For now, return success with user data (minus password)
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword, token: "placeholder-jwt-token" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Orders endpoint (placeholder)
  app.get("/api/orders", async (req, res) => {
    try {
      // TODO: Add authentication middleware
      // TODO: Filter by authenticated user
      res.json({ orders: [] });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
