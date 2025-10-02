# Menu Card Glass Jar Pricing Implementation

## ✅ What's Been Implemented

I've enhanced your product cards to show glass jar pricing associated with the currently selected size. Here's what's available:

### 1. Enhanced ProductCard Component
- **Size Selection**: Choose from multiple bottle sizes (8oz, 12oz, 16oz, 32oz, 64oz, 128oz)
- **Container Type**: Switch between glass bottle and customer container
- **Dynamic Pricing**: Real-time price updates based on size and container selection
- **Glass Jar Breakdown**: Detailed pricing showing base price, eco-discount, and jar deposit

### 2. ProductCardWithSizing Component
- **Dedicated component** for enhanced sizing functionality
- **Comprehensive pricing display** with glass jar cost breakdown
- **Volume discount badges** for larger sizes
- **Deposit refund information** clearly displayed

### 3. Enhanced ProductPricing Component
- **Glass jar pricing section** with detailed breakdown
- **Eco-discount highlighting** for sustainability messaging
- **Deposit information** with refund terms
- **Responsive pricing** that updates with size selection

## 🎯 How to Use in Menu Pages

### Option 1: Enable Size Selection on Existing ProductCard

```tsx
// In your menu page component
import { ProductCard } from '@/components/organisms/ProductCard';

// Sample size data for a product
const productSizes = [
  { size: '8oz', ounces: 8, basePrice: 4.50, pricePerOz: 0.56, volumeDiscount: 0, glassJarDeposit: 2.00 },
  { size: '12oz', ounces: 12, basePrice: 6.50, pricePerOz: 0.54, volumeDiscount: 2, glassJarDeposit: 2.50 },
  { size: '16oz', ounces: 16, basePrice: 8.00, pricePerOz: 0.50, volumeDiscount: 5, glassJarDeposit: 3.00 },
  { size: '32oz', ounces: 32, basePrice: 14.50, pricePerOz: 0.45, volumeDiscount: 10, glassJarDeposit: 4.00 },
  { size: '64oz', ounces: 64, basePrice: 27.00, pricePerOz: 0.42, volumeDiscount: 15, glassJarDeposit: 6.00 },
  { size: '128oz', ounces: 128, basePrice: 50.00, pricePerOz: 0.39, volumeDiscount: 20, glassJarDeposit: 10.00 }
];

// In your JSX
<ProductCard
  id="orange-juice"
  name="Fresh Orange Juice"
  category="single_source"
  source="orange"
  costPerOz={0.56}
  cost8oz={4.50}
  groceryComparison="8oz Tropicana"
  color="#f59e0b"
  isFeatured={true}
  onAddToCart={(id, selectedSize, containerType) => {
    console.log('Adding to cart:', { id, selectedSize, containerType });
    // Handle cart logic here
  }}
  enableSizeSelection={true}
  sizes={productSizes}
/>
```

### Option 2: Use Dedicated ProductCardWithSizing Component

```tsx
// Import the specialized component
import { ProductCardWithSizing } from '@/components/organisms/ProductCardWithSizing';

<ProductCardWithSizing
  id="orange-juice"
  name="Fresh Orange Juice"
  category="single_source"
  source="orange"
  color="#f59e0b"
  isFeatured={true}
  description="Pure Valencia oranges cold-pressed daily for maximum nutrition"
  hasPulpOptions={true}
  sizes={productSizes}
  onAddToCart={(id, selectedSize) => {
    console.log('Adding to cart:', { id, selectedSize });
  }}
/>
```

## 💡 Key Features

### Glass Jar Pricing Display
When glass bottle is selected, customers see:
- **Base price**: Original product price
- **Eco-discount**: $0.50 savings for choosing glass
- **Glass jar deposit**: Refundable amount (varies by size)
- **Total with jar**: Complete cost including deposit
- **Refund notice**: Clear explanation of deposit system

### Size-Based Pricing
- **Progressive discounts**: 0% (8oz) to 20% (128oz)
- **Price per ounce**: Always visible for comparison
- **Volume savings**: Clear percentage savings display
- **Popular size badges**: Highlight recommended sizes

### Container Options
- **Glass Bottle**: Shows deposit + eco-discount
- **Your Container**: No deposit, no eco-discount
- **Real-time pricing**: Updates immediately on selection

## 📊 Example Glass Jar Pricing Display

```
Glass Jar Pricing
┌─────────────────────────────┐
│ Base price:        $8.00    │
│ Eco-discount:     -$0.50    │
│ Glass jar deposit: +$3.00   │
├─────────────────────────────┤
│ Total with jar:    $10.50   │
└─────────────────────────────┘
Deposit refunded when jar is returned clean
```

## 🔧 Integration with Your Menu

To integrate this with your existing menu page:

1. **Import the enhanced components** in your menu page
2. **Fetch size data** from your database (productSizes table)
3. **Pass sizing data** to the ProductCard component
4. **Handle cart events** with size and container information
5. **Enable the feature** with `enableSizeSelection={true}`

The system automatically handles all pricing calculations, volume discounts, and glass jar cost breakdowns based on the selected size and container type.

Your customers will now see transparent, detailed pricing that encourages larger purchases while promoting your eco-friendly glass jar system!