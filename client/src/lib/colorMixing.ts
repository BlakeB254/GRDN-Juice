/**
 * Advanced color mixing utilities for realistic juice blend visualization
 * Uses subtractive color mixing (like real pigments) rather than additive (like light)
 */

interface RGB {
  r: number;
  g: number;
  b: number;
}

interface JuiceIngredient {
  color: string; // Hex color
  percentage: number; // 0-100
}

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex: string): RGB {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

/**
 * Convert RGB to hex
 */
function rgbToHex(rgb: RGB): string {
  const toHex = (n: number) => {
    const hex = Math.round(n).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

/**
 * Convert RGB to HSL for better color manipulation
 */
function rgbToHsl(rgb: RGB): { h: number; s: number; l: number } {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

/**
 * Convert HSL back to RGB
 */
function hslToRgb(h: number, s: number, l: number): RGB {
  h = h / 360;
  s = s / 100;
  l = l / 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: r * 255,
    g: g * 255,
    b: b * 255,
  };
}

/**
 * Mix colors using weighted averaging (subtractive mixing)
 * This simulates how actual pigments mix in real life
 */
export function mixJuiceColors(ingredients: JuiceIngredient[]): string {
  if (ingredients.length === 0) return '#16a34a'; // Default green

  // Filter out ingredients with 0% and normalize percentages
  const validIngredients = ingredients.filter(i => i.percentage > 0);
  const totalPercentage = validIngredients.reduce((sum, i) => sum + i.percentage, 0);

  if (totalPercentage === 0 || validIngredients.length === 0) {
    return '#16a34a'; // Default green
  }

  // Normalize percentages to sum to 1
  const normalized = validIngredients.map(i => ({
    ...i,
    weight: i.percentage / totalPercentage,
  }));

  // Convert all colors to RGB
  const rgbColors = normalized.map(ing => ({
    rgb: hexToRgb(ing.color),
    weight: ing.weight,
  }));

  // Weighted average in RGB space (simulates subtractive mixing)
  let r = 0, g = 0, b = 0;

  for (const { rgb, weight } of rgbColors) {
    r += rgb.r * weight;
    g += rgb.g * weight;
    b += rgb.b * weight;
  }

  // Adjust saturation slightly down to simulate realistic mixing
  const hsl = rgbToHsl({ r, g, b });
  hsl.s *= 0.85; // Reduce saturation by 15% for realism
  hsl.l = Math.max(20, Math.min(80, hsl.l)); // Keep lightness in reasonable range

  const finalRgb = hslToRgb(hsl.h, hsl.s, hsl.l);

  return rgbToHex(finalRgb);
}

/**
 * Get a gradient representation for partial filling animation
 * Returns CSS linear-gradient string
 */
export function getBottleFillGradient(
  currentColor: string,
  fillPercentage: number
): string {
  const fillHeight = Math.min(100, Math.max(0, fillPercentage));

  if (fillHeight === 0) {
    return 'transparent';
  }

  // Create a subtle gradient for depth
  const rgb = hexToRgb(currentColor);
  const darker = {
    r: Math.max(0, rgb.r - 30),
    g: Math.max(0, rgb.g - 30),
    b: Math.max(0, rgb.b - 30),
  };

  const darkerHex = rgbToHex(darker);

  return `linear-gradient(to top, ${darkerHex} 0%, ${currentColor} 20%, ${currentColor} 80%, ${darkerHex} 100%)`;
}

/**
 * Estimate opacity based on juice clarity
 * Greens and darker juices are less transparent
 */
export function estimateOpacity(color: string): number {
  const rgb = hexToRgb(color);
  const hsl = rgbToHsl(rgb);

  // Darker juices are more opaque
  const lightnessOpacity = 1 - (hsl.l / 100) * 0.3;

  // Very saturated colors are more opaque
  const saturationOpacity = 0.7 + (hsl.s / 100) * 0.3;

  return Math.min(1, Math.max(0.7, (lightnessOpacity + saturationOpacity) / 2));
}

/**
 * Suggest complementary garnish color based on juice color
 */
export function suggestGarnishColor(juiceColor: string): string {
  const hsl = rgbToHsl(hexToRgb(juiceColor));

  // Return complementary color
  const compHue = (hsl.h + 180) % 360;
  const garnishRgb = hslToRgb(compHue, Math.min(100, hsl.s + 20), 50);

  return rgbToHex(garnishRgb);
}
