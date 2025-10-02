import { seedIngredients } from './ingredients';

async function runSeed() {
  console.log('🌱 Starting database seeding...\n');

  try {
    await seedIngredients();
    console.log('\n✅ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error during seeding:', error);
    process.exit(1);
  }
}

runSeed();
