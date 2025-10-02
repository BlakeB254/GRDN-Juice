import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import * as schema from './db/schema';
import { ingredientVariants } from './db/schema';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import ws from 'ws';

// Load environment variables
config();

// Configure Neon for Node.js environment
neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool, schema });

async function exportData() {
  console.log('Exporting data for static deployment...');

  try {
    // Fetch all active ingredient variants
    const variants = await db.select().from(ingredientVariants);

    console.log(`Found ${variants.length} ingredient variants`);

    // Create public directory if it doesn't exist
    const publicDir = join(process.cwd(), 'client', 'public');
    mkdirSync(publicDir, { recursive: true });

    // Write to JSON file
    const dataPath = join(publicDir, 'ingredient-variants.json');
    writeFileSync(dataPath, JSON.stringify(variants, null, 2));

    console.log(`✅ Data exported to ${dataPath}`);
    console.log('Static data is ready for deployment!');

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('Error exporting data:', error);
    process.exit(1);
  }
}

exportData();
