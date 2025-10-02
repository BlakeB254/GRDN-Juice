#!/usr/bin/env node

/**
 * Debug script for glass jar pricing issues
 * This will help identify why deposits might show as $4 for all sizes
 */

console.log('🔍 DEBUGGING GLASS JAR PRICING\n');
console.log('=' .repeat(60));

// Sample size data that should have DIFFERENT deposits
const correctSizeData = [
  { size: '8oz', ounces: 8, basePrice: 4.50, glassJarDeposit: 2.00 },
  { size: '12oz', ounces: 12, basePrice: 6.50, glassJarDeposit: 2.50 },
  { size: '16oz', ounces: 16, basePrice: 8.00, glassJarDeposit: 3.00 },
  { size: '32oz', ounces: 32, basePrice: 14.50, glassJarDeposit: 5.00 },
  { size: '64oz', ounces: 64, basePrice: 27.00, glassJarDeposit: 8.00 },
  { size: '128oz', ounces: 128, basePrice: 50.00, glassJarDeposit: 12.00 }
];

// Common mistake: All sizes have the same deposit
const incorrectSizeData = [
  { size: '8oz', ounces: 8, basePrice: 4.50, glassJarDeposit: 4.00 },
  { size: '12oz', ounces: 12, basePrice: 6.50, glassJarDeposit: 4.00 },
  { size: '16oz', ounces: 16, basePrice: 8.00, glassJarDeposit: 4.00 },
  { size: '32oz', ounces: 32, basePrice: 14.50, glassJarDeposit: 4.00 },
  { size: '64oz', ounces: 64, basePrice: 27.00, glassJarDeposit: 4.00 },
  { size: '128oz', ounces: 128, basePrice: 50.00, glassJarDeposit: 4.00 }
];

console.log('\n📊 CORRECT SIZE DATA (what you should have):');
console.log('-'.repeat(60));
console.log('Size\t\tBase Price\tGlass Jar Deposit');
console.log('-'.repeat(60));
correctSizeData.forEach(size => {
  console.log(`${size.size}\t\t$${size.basePrice.toFixed(2)}\t\t$${size.glassJarDeposit.toFixed(2)}`);
});

console.log('\n❌ INCORRECT SIZE DATA (causes $4.00 for all sizes):');
console.log('-'.repeat(60));
console.log('Size\t\tBase Price\tGlass Jar Deposit');
console.log('-'.repeat(60));
incorrectSizeData.forEach(size => {
  console.log(`${size.size}\t\t$${size.basePrice.toFixed(2)}\t\t$${size.glassJarDeposit.toFixed(2)}`);
});

console.log('\n🔧 TROUBLESHOOTING STEPS:');
console.log('-'.repeat(60));
console.log('1. Check your size data in the menu page');
console.log('2. Ensure each size has a DIFFERENT glassJarDeposit value');
console.log('3. Verify the ProductCard receives enableSizeSelection={true}');
console.log('4. Make sure sizes array is passed correctly');
console.log('5. Check browser dev tools console for any errors');

console.log('\n💡 CORRECT IMPLEMENTATION EXAMPLE:');
console.log('-'.repeat(60));
console.log(`
const productSizes = [
  { size: '8oz', ounces: 8, basePrice: 4.50, pricePerOz: 0.56, volumeDiscount: 0, glassJarDeposit: 2.00 },
  { size: '16oz', ounces: 16, basePrice: 8.00, pricePerOz: 0.50, volumeDiscount: 5, glassJarDeposit: 3.00 },
  { size: '32oz', ounces: 32, basePrice: 14.50, pricePerOz: 0.45, volumeDiscount: 10, glassJarDeposit: 5.00 },
  { size: '64oz', ounces: 64, basePrice: 27.00, pricePerOz: 0.42, volumeDiscount: 15, glassJarDeposit: 8.00 }
];

<ProductCard
  // ... other props
  enableSizeSelection={true}
  sizes={productSizes}  // ← Make sure this has different glassJarDeposit values
/>
`);

console.log('\n🧪 TESTING GLASS JAR CALCULATION:');
console.log('-'.repeat(60));
correctSizeData.forEach(size => {
  const ecoDiscount = 0.50;
  const netPrice = size.basePrice - ecoDiscount;
  const totalWithJar = netPrice + size.glassJarDeposit;
  
  console.log(`${size.size}: $${size.basePrice.toFixed(2)} - $${ecoDiscount.toFixed(2)} + $${size.glassJarDeposit.toFixed(2)} = $${totalWithJar.toFixed(2)}`);
});

console.log('\n✅ SOLUTION:');
console.log('-'.repeat(60));
console.log('If you see $4.00 for all sizes, you likely have:');
console.log('• Same glassJarDeposit value (4.00) for all sizes in your data');
console.log('• Missing size data entirely');
console.log('• enableSizeSelection not set to true');
console.log('\nFix by ensuring each size has a unique glassJarDeposit value!');

console.log('\n🔍 Check your current size data and compare with the examples above.');
console.log('=' .repeat(60));