/**
 * EnhancedBottleVisualizer Component
 * Clean, instant visualization of juice blends
 */

interface BlendIngredient {
  variantId: string;
  variantName: string;
  color: string;
  percentage: number;
}

interface EnhancedBottleVisualizerProps {
  blendIngredients: BlendIngredient[];
  bottleSize: number;
  blendName?: string;
}

const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : { r: 0, g: 0, b: 0 };
};

const mixColors = (colors: string[], percentages: number[]): string => {
  if (colors.length === 0) return '#f0f0f0';
  if (colors.length === 1) return colors[0];

  let r = 0, g = 0, b = 0;
  const totalPercentage = percentages.reduce((sum, p) => sum + p, 0);

  colors.forEach((color, i) => {
    const rgb = hexToRgb(color);
    const weight = percentages[i] / totalPercentage;
    r += rgb.r * rgb.r * weight;
    g += rgb.g * rgb.g * weight;
    b += rgb.b * rgb.b * weight;
  });

  return `rgb(${Math.round(Math.sqrt(r))}, ${Math.round(Math.sqrt(g))}, ${Math.round(Math.sqrt(b))})`;
};

export default function EnhancedBottleVisualizer({
  blendIngredients,
  bottleSize,
  blendName,
}: EnhancedBottleVisualizerProps) {

  const dims = {
    width: 140 * Math.min(1 + (bottleSize - 16) / 256, 1.6),
    height: 226 * Math.min(1 + (bottleSize - 16) / 256, 1.6),
    neckHeight: 35,
    neckWidth: 45,
  };

  const totalPercentage = blendIngredients.reduce((sum, ing) => sum + ing.percentage, 0);
  const fillHeight = Math.min(totalPercentage, 100);
  const finalColor = mixColors(
    blendIngredients.map(i => i.color),
    blendIngredients.map(i => i.percentage)
  );

  const isEmpty = blendIngredients.length === 0;

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Bottle Container */}
      <div className="relative" style={{ width: dims.width + 80, height: dims.height + dims.neckHeight + 80 }}>

        {/* Bottle cap */}
        <div
          className="absolute left-1/2 -translate-x-1/2 z-20"
          style={{
            width: dims.neckWidth + 8,
            height: 24,
            top: -10,
            background: 'linear-gradient(135deg, #059669 0%, #047857 50%, #065f46 100%)',
            borderRadius: '8px 8px 4px 4px',
            boxShadow: '0 3px 10px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.4)',
          }}
        >
          <div className="absolute inset-x-2 top-1 h-1 bg-white/30 rounded-full" />
          <div className="absolute inset-x-3 top-3 h-0.5 bg-black/10 rounded-full" />
        </div>

        {/* Bottle neck */}
        <div
          className="absolute left-1/2 -translate-x-1/2 z-10"
          style={{
            width: dims.neckWidth,
            height: dims.neckHeight,
            top: 8,
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.3) 100%)',
            borderRadius: '6px 6px 0 0',
            border: '3px solid rgba(255,255,255,0.7)',
            borderBottom: 'none',
            boxShadow: 'inset -5px 0 8px rgba(255,255,255,0.5), inset 5px 0 8px rgba(0,0,0,0.05)',
          }}
        />

        {/* Main bottle */}
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            width: dims.width,
            height: dims.height,
            top: dims.neckHeight + 8,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.4) 100%)',
            borderRadius: '20px',
            border: '4px solid rgba(255,255,255,0.75)',
            overflow: 'hidden',
            boxShadow: isEmpty
              ? '0 8px 32px rgba(0,0,0,0.15), inset -8px 0 16px rgba(255,255,255,0.5), inset 8px 0 16px rgba(0,0,0,0.03)'
              : `0 12px 40px rgba(0,0,0,0.2), 0 0 30px ${finalColor}30, inset -10px 0 20px rgba(255,255,255,0.6), inset 10px 0 20px rgba(0,0,0,0.04)`,
            transition: 'all 0.5s ease-out',
          }}
        >
          {/* Juice content - instant fill */}
          <div
            className="absolute bottom-0 left-0 right-0 transition-all duration-300"
            style={{
              height: `${fillHeight}%`,
            }}
          >

            {/* Mixed juice color */}
            <div
              className="absolute inset-0"
              style={{
                backgroundColor: finalColor,
              }}
            >
              {/* Subtle shimmer on surface */}
              <div
                className="absolute top-0 left-0 right-0 h-5"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%)',
                  animation: 'shimmer 3.5s ease-in-out infinite',
                }}
              />
              {/* Gentle wave on surface */}
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{
                  background: 'rgba(255,255,255,0.25)',
                  animation: 'gentleWave 3s ease-in-out infinite',
                }}
              />
            </div>

            {/* Surface highlight */}
            <div
              className="absolute top-0 left-0 right-0 h-4"
              style={{
                background: 'linear-gradient(to bottom, rgba(255,255,255,0.45) 0%, transparent 100%)',
              }}
            />
          </div>

          {/* Enhanced glass reflections */}
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute left-8 top-0 w-16 h-full"
              style={{
                background: 'linear-gradient(to right, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.1) 80%, transparent 100%)',
                borderRadius: '16px',
                filter: 'blur(3px)',
              }}
            />
            <div
              className="absolute right-6 top-0 w-10 h-full"
              style={{
                background: 'linear-gradient(to left, rgba(255,255,255,0.3) 0%, transparent 100%)',
                borderRadius: '12px',
                filter: 'blur(2px)',
              }}
            />
          </div>

          {/* Empty state */}
          {isEmpty && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl mb-3">🥤</div>
                <p className="text-gray-400 text-sm font-medium">
                  Add ingredients<br />to create your blend
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Size label */}
        <div className="absolute left-1/2 -translate-x-1/2 text-center" style={{ bottom: -35 }}>
          <div className="text-sm font-semibold text-gray-700">{bottleSize} oz</div>
        </div>
      </div>

      <style>{`
        @keyframes gentleWave {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(2px); }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); opacity: 0.3; }
          50% { opacity: 0.6; }
          100% { transform: translateX(200%); opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
