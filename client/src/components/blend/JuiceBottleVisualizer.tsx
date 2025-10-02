import { useEffect, useState } from 'react';
import { mixJuiceColors, getBottleFillGradient, estimateOpacity } from '@/lib/colorMixing';

interface BlendIngredient {
  variantId: string;
  variantName: string;
  color: string;
  percentage: number;
}

interface JuiceBottleVisualizerProps {
  ingredients: BlendIngredient[];
  size: 'small' | 'medium' | 'large';
  animate?: boolean;
  showMeasurements?: boolean;
  maxOunces?: number;
}

export default function JuiceBottleVisualizer({
  ingredients,
  size = 'medium',
  animate = true,
  showMeasurements = true,
  maxOunces = 32,
}: JuiceBottleVisualizerProps) {
  const [currentFillLevel, setCurrentFillLevel] = useState(0);
  const [displayedIngredients, setDisplayedIngredients] = useState<BlendIngredient[]>([]);

  // Calculate dimensions based on size - with smooth scaling
  // Small (8-16oz): 180x300
  // Medium (17-32oz): 240x400
  // Large (33-64oz): 320x533
  // XLarge (65-128oz): 400x667
  const getDimensions = () => {
    if (maxOunces <= 16) return { width: 180, height: 300 };
    if (maxOunces <= 32) return { width: 240, height: 400 };
    if (maxOunces <= 64) return { width: 320, height: 533 };
    return { width: 400, height: 667 };
  };

  const dimensions = getDimensions();

  const totalPercentage = ingredients.reduce((sum, ing) => sum + ing.percentage, 0);
  const fillPercentage = Math.min(100, totalPercentage);

  // Animate filling when ingredients change
  useEffect(() => {
    if (!animate) {
      setDisplayedIngredients(ingredients);
      setCurrentFillLevel(fillPercentage);
      return;
    }

    // Gradually add ingredients
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < ingredients.length) {
        setDisplayedIngredients(prev => [...prev, ingredients[currentIndex]]);
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 300);

    return () => clearInterval(interval);
  }, [ingredients, animate, fillPercentage]);

  // Animate fill level
  useEffect(() => {
    if (!animate) return;

    const targetFill = displayedIngredients
      .filter(ing => ing && typeof ing.percentage === 'number')
      .reduce((sum, ing) => sum + ing.percentage, 0);
    const step = (targetFill - currentFillLevel) / 10;

    const interval = setInterval(() => {
      setCurrentFillLevel(prev => {
        const next = prev + step;
        if (Math.abs(next - targetFill) < 0.5) {
          clearInterval(interval);
          return targetFill;
        }
        return next;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [displayedIngredients, animate]);

  const mixedColor = mixJuiceColors(
    displayedIngredients
      .filter(ing => ing && ing.color) // Filter out any undefined ingredients
      .map(ing => ({
        color: ing.color,
        percentage: ing.percentage,
      }))
  );

  const fillGradient = getBottleFillGradient(mixedColor, currentFillLevel);
  const opacity = estimateOpacity(mixedColor);

  // Calculate ounces based on percentage
  const currentOunces = (currentFillLevel / 100) * maxOunces;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Bottle Container - with smooth transitions */}
      <div
        className="relative transition-all duration-500 ease-out"
        style={{
          width: dimensions.width,
          height: dimensions.height,
        }}
      >
        {/* Glass Bottle SVG */}
        <svg
          width={dimensions.width}
          height={dimensions.height}
          viewBox="0 0 100 160"
          className="absolute inset-0 transition-all duration-500"
        >
          {/* Bottle Outline */}
          <defs>
            {/* Glass effect filter */}
            <filter id="glass-effect" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
              <feOffset dx="2" dy="2" result="offsetblur" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.3" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Highlight gradient */}
            <linearGradient id="glass-highlight" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="white" stopOpacity="0" />
              <stop offset="30%" stopColor="white" stopOpacity="0.4" />
              <stop offset="50%" stopColor="white" stopOpacity="0.6" />
              <stop offset="70%" stopColor="white" stopOpacity="0.4" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Bottle Shape */}
          <g>
            {/* Neck */}
            <rect x="42" y="10" width="16" height="15" fill="#e8f4f8" stroke="#94a3b8" strokeWidth="1.5" rx="2" />

            {/* Cap */}
            <rect x="40" y="5" width="20" height="6" fill="#64748b" stroke="#475569" strokeWidth="1" rx="1" />

            {/* Main Body */}
            <path
              d="M 35 25 L 35 140 Q 35 150 45 150 L 55 150 Q 65 150 65 140 L 65 25 Z"
              fill="#e8f4f8"
              stroke="#94a3b8"
              strokeWidth="2"
              filter="url(#glass-effect)"
            />

            {/* Glass Highlight */}
            <ellipse cx="42" cy="60" rx="8" ry="40" fill="url(#glass-highlight)" opacity="0.5" />
          </g>

          {/* Juice Fill */}
          <defs>
            <clipPath id="bottle-clip">
              <path d="M 36 26 L 36 139 Q 36 148 45 148 L 55 148 Q 64 148 64 139 L 64 26 Z" />
            </clipPath>
          </defs>

          <g clipPath="url(#bottle-clip)">
            <rect
              x="35"
              y={150 - (currentFillLevel / 100) * 123}
              width="30"
              height={(currentFillLevel / 100) * 123}
              fill={mixedColor}
              opacity={opacity}
              style={{
                transition: animate ? 'all 0.5s ease-out' : 'none',
              }}
            />

            {/* Shimmer effect on juice */}
            {currentFillLevel > 0 && (
              <ellipse
                cx="50"
                cy={150 - (currentFillLevel / 100) * 123 + 10}
                rx="12"
                ry="3"
                fill="white"
                opacity="0.3"
              />
            )}
          </g>

          {/* Measurement Lines */}
          {showMeasurements && (
            <g>
              {[25, 50, 75, 100].map(percent => {
                const y = 150 - (percent / 100) * 123;
                return (
                  <g key={percent}>
                    <line
                      x1="30"
                      y1={y}
                      x2="35"
                      y2={y}
                      stroke="#94a3b8"
                      strokeWidth="1"
                      opacity="0.5"
                    />
                    <text
                      x="25"
                      y={y + 2}
                      fontSize="6"
                      fill="#64748b"
                      textAnchor="end"
                    >
                      {Math.round((percent / 100) * maxOunces)}oz
                    </text>
                  </g>
                );
              })}
            </g>
          )}
        </svg>

        {/* Pour Animation Overlay */}
        {animate && currentFillLevel < totalPercentage && displayedIngredients.length > 0 && (
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2"
            style={{
              width: '10px',
              height: '30px',
              background: `linear-gradient(to bottom, ${displayedIngredients[displayedIngredients.length - 1]?.color || mixedColor} 0%, transparent 100%)`,
              opacity: 0.6,
              animation: 'pour 1s ease-in-out',
            }}
          />
        )}
      </div>

      {/* Current Fill Display */}
      <div className="text-center space-y-1">
        <p className="text-2xl font-bold text-foreground">
          {currentOunces.toFixed(1)} oz
        </p>
        <p className="text-sm text-muted-foreground">
          {currentFillLevel.toFixed(0)}% Full
        </p>
      </div>

      {/* Ingredient Layers Display */}
      {displayedIngredients.length > 0 && (
        <div className="w-full space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Blend Composition
          </p>
          <div className="space-y-1">
            {displayedIngredients.filter(ing => ing && ing.color && ing.variantName).map((ing, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm">
                <div
                  className="w-4 h-4 rounded-full border border-border"
                  style={{ backgroundColor: ing.color }}
                />
                <span className="flex-1 truncate">{ing.variantName}</span>
                <span className="font-medium">{ing.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes pour {
          0% {
            transform: translateX(-50%) translateY(-20px);
            opacity: 0;
          }
          50% {
            opacity: 0.6;
          }
          100% {
            transform: translateX(-50%) translateY(0);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
