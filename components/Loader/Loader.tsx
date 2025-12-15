import React, { useState, useEffect } from "react";

interface BlueBuffLoaderProps {
  /** Progress percentage (0-100) */
  progress?: number;
  /** Duration in milliseconds for simulated loading */
  duration?: number;
  /** Callback when loading completes */
  onComplete?: () => void;
  /** Show loading text */
  showText?: boolean;
  /** Custom loading text */
  text?: string;
}

export default function BlueBuffLoader({
  progress = 0,
  duration = 3000,
  onComplete,
  showText = true,
  text = "Summoning Blue Buff"
}: BlueBuffLoaderProps) {
  const [internalProgress, setInternalProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);

  // Handle progress simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    let timeout: NodeJS.Timeout;

    if (progress > 0) {
      // Use provided progress value
      setInternalProgress(progress);
      
      if (progress >= 100) {
        setIsComplete(true);
        timeout = setTimeout(() => {
          setIsAnimating(false);
          onComplete?.();
        }, 800);
      }
    } else {
      // Simulate loading progress
      let currentProgress = 0;
      const increment = 100 / (duration / 50); // Update every 50ms

      interval = setInterval(() => {
        currentProgress += increment;
        if (currentProgress >= 100) {
          currentProgress = 100;
          clearInterval(interval);
          setIsComplete(true);
          
          timeout = setTimeout(() => {
            setIsAnimating(false);
            onComplete?.();
          }, 800);
        }
        setInternalProgress(Math.min(currentProgress, 100));
      }, 50);
    }

    return () => {
      if (interval) clearInterval(interval);
      if (timeout) clearTimeout(timeout);
    };
  }, [progress, duration, onComplete]);

  // Dynamic color based on progress
  const getProgressColor = (pct: number) => {
    if (pct < 30) return "var(--accent)";
    if (pct < 70) return "#22d3ee";
    return "#10b981"; // Green for completion
  };

  // Calculate active elements based on progress
  const activeParticles = Math.floor(internalProgress / 16.67);
  const pulseIntensity = 0.5 + (internalProgress / 200);

  return (
    <div
      className={`
        fixed inset-0 z-50 flex flex-col items-center justify-center
        bg-[var(--background)]
        transition-all duration-500
        ${isAnimating ? "opacity-100" : "opacity-0 pointer-events-none"}
      `}
    >
      {/* Main Loader Container */}

      
      <div className="relative w-48 h-48">
        {/* ================= HEX PROGRESS RING ================= */}
        <div
          className="absolute inset-0 animate-spin"
          style={{ animationDuration: "3s" }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={getProgressColor(internalProgress)} />
                <stop offset="100%" stopColor="#22d3ee" />
              </linearGradient>
              
              {/* Progress gradient */}
              <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={getProgressColor(internalProgress)} />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
              
              {/* Glow filter */}
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Background hex (dimmed) */}
            <polygon
              points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5"
              fill="none"
              stroke="var(--muted)"
              strokeWidth="2"
              opacity="0.2"
            />

            {/* Animated hex border */}
            <polygon
              points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5"
              fill="none"
              stroke="url(#grad1)"
              strokeWidth="3"
              strokeDasharray="20 10"
              opacity="0.6"
              style={{
                filter: "url(#glow)",
              }}
            />

            {/* Progress hex (segmented) */}
            <g className="transition-all duration-300">
              {[...Array(6)].map((_, i) => {
                const segmentProgress = Math.max(0, Math.min(100, internalProgress - (i * 16.67)));
                const isActive = segmentProgress > 0;
                const opacity = isActive ? segmentProgress / 100 : 0.1;
                
                return (
                  <polygon
                    key={i}
                    points={getHexSegmentPath(i, 45, 50, 50)}
                    fill="none"
                    stroke={getProgressColor(internalProgress)}
                    strokeWidth="4"
                    strokeLinecap="round"
                    opacity={opacity}
                    style={{
                      filter: "url(#glow)",
                      transition: "opacity 0.3s ease",
                    }}
                  />
                );
              })}
            </g>
          </svg>
        </div>

        {/* ================= DYNAMIC ORBIT PARTICLES ================= */}
        <div className="absolute inset-0">
          {[0, 60, 120, 180, 240, 300].map((deg, i) => (
            <div
              key={i}
              className="absolute inset-0"
              style={{
                animation: i < activeParticles 
                  ? `spin ${2 + i * 0.3}s linear infinite`
                  : "none",
                animationDelay: `${i * 0.1}s`,
              }}
            >
              {/* Particle trail */}
              <div
                className="absolute w-1 h-1 rounded-full transition-all duration-500"
                style={{
                  top: "50%",
                  left: "50%",
                  transform: `rotate(${deg + 15}deg) translateX(${28 + (internalProgress / 30)}px) translateY(-50%)`,
                  background: getProgressColor(internalProgress),
                  opacity: 0.3,
                  filter: "blur(1px)",
                }}
              />
              
              {/* Main particle */}
              <div
                className="absolute w-3 h-3 rounded-full transition-all duration-300"
                style={{
                  top: "50%",
                  left: "50%",
                  transform: `rotate(${deg}deg) translateX(${35 + (internalProgress / 20)}px) translateY(-50%)`,
                  background: getProgressColor(internalProgress),
                  boxShadow: `0 0 ${10 + (internalProgress / 10)}px ${getProgressColor(internalProgress)}`,
                  opacity: i < activeParticles ? 1 : 0.1,
                  scale: i < activeParticles ? 1 : 0.5,
                }}
              />
            </div>
          ))}
        </div>

        {/* ================= CENTRAL SHIELD WITH PERCENTAGE ================= */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Animated glow aura */}
            <div
              className="absolute inset-0 rounded-full transition-all duration-500"
              style={{
                background: `radial-gradient(circle, ${getProgressColor(internalProgress)}20 0%, transparent 70%)`,
                opacity: pulseIntensity,
                animation: "pulse 2s ease-in-out infinite",
                filter: "blur(20px)",
                transform: `scale(${1 + (internalProgress / 400)})`,
              }}
            />

            {/* Shield container */}
            <div className="relative w-24 h-24">
              {/* Shield outline with progress glow */}
              <div
                className="absolute inset-0 transition-all duration-500"
                style={{
                  opacity: 0.7,
                  filter: `drop-shadow(0 0 ${8 + (internalProgress / 12.5)}px ${getProgressColor(internalProgress)})`,
                }}
              >
                <svg viewBox="0 0 64 64" className="w-full h-full">
                  <defs>
                    <linearGradient
                      id="shieldGrad"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor={getProgressColor(internalProgress)} />
                      <stop offset="100%" stopColor="#22d3ee" />
                    </linearGradient>
                  </defs>

                  <path
                    d="M32 4 L8 14 L8 30 Q8 45 32 60 Q56 45 56 30 L56 14 Z"
                    fill="none"
                    stroke="url(#shieldGrad)"
                    strokeWidth="2.5"
                  />
                </svg>
              </div>

              {/* Shield fill (progress based) */}
              <div
                className="absolute inset-0 overflow-hidden transition-all duration-300"
                style={{
                  clipPath: `polygon(0 ${100 - internalProgress}%, 100% ${100 - internalProgress}%, 100% 100%, 0 100%)`,
                }}
              >
                <svg viewBox="0 0 64 64" className="w-full h-full">
                  <path
                    d="M32 4 L8 14 L8 30 Q8 45 32 60 Q56 45 56 30 L56 14 Z"
                    fill="url(#shieldGrad)"
                    opacity="0.8"
                  />
                </svg>
              </div>

              {/* Percentage display - Modern design */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {/* Percentage background glow */}
                  <div
                    className="absolute -inset-4 rounded-full blur-xl transition-all duration-300"
                    style={{
                      background: getProgressColor(internalProgress),
                      opacity: 0.2,
                    }}
                  />
                  
                  {/* Percentage text */}
                  <div className="relative">
                    <span
                      className="font-bold text-2xl tracking-tighter transition-all duration-300"
                      style={{
                        color: "var(--foreground)",
                        textShadow: `0 0 ${10 + (internalProgress / 10)}px ${getProgressColor(internalProgress)}`,
                        opacity: isComplete ? 0 : 1,
                        scale: isComplete ? 0.8 : 1,
                      }}
                    >
                      {Math.round(internalProgress)}%
                    </span>
                    
                    {/* Decorative dots around percentage */}
                    <div className="absolute -top-2 -right-2 flex space-x-1">
                      {[0, 1].map((i) => (
                        <div
                          key={i}
                          className="w-1 h-1 rounded-full transition-all duration-300"
                          style={{
                            background: getProgressColor(internalProgress),
                            opacity: internalProgress > (i + 1) * 50 ? 1 : 0.3,
                            scale: internalProgress > (i + 1) * 50 ? 1 : 0.5,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* Checkmark on completion */}
                  <div
                    className="absolute inset-0 flex items-center justify-center transition-all duration-500"
                    style={{
                      opacity: isComplete ? 1 : 0,
                      scale: isComplete ? 1 : 0.5,
                    }}
                  >
                    <div className="relative">
                      <div
                        className="absolute -inset-4 rounded-full blur-md"
                        style={{
                          background: "#10b981",
                          opacity: 0.3,
                        }}
                      />
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M20 6L9 17L4 12"
                          stroke="#10b981"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= ENHANCED ENERGY RINGS ================= */}
        <div
          className="absolute inset-0 animate-spin"
          style={{ 
            animationDuration: `${4 - (internalProgress / 50)}s`,
            animationDirection: "reverse",
          }}
        >
          {/* Outer ring */}
          <div
            className="absolute inset-0 rounded-full transition-all duration-500"
            style={{
              border: `2px solid transparent`,
              borderTopColor: getProgressColor(internalProgress),
              borderRightColor: "#22d3ee",
              opacity: 0.3 + (internalProgress / 200),
              filter: `blur(${internalProgress / 100}px)`,
            }}
          />
          
          {/* Inner ring trail */}
          <div
            className="absolute inset-3 rounded-full transition-all duration-300"
            style={{
              border: `1px solid ${getProgressColor(internalProgress)}`,
              opacity: 0.2,
              filter: "blur(1px)",
            }}
          />
        </div>

        {/* ================= FLOATING CORNER ORBS ================= */}
        {[0, 90, 180, 270].map((angle, i) => {
          const isActive = internalProgress > (i * 25);
          
          return (
            <div key={i} className="absolute">
              {/* Orb glow */}
              <div
                className="absolute rounded-full transition-all duration-500"
                style={{
                  width: `${8 + (internalProgress / 25)}px`,
                  height: `${8 + (internalProgress / 25)}px`,
                  top: "50%",
                  left: "50%",
                  transform: `rotate(${angle}deg) translateX(60px) translateY(-50%)`,
                  background: getProgressColor(internalProgress),
                  opacity: isActive ? 0.2 : 0.05,
                  filter: "blur(6px)",
                  animation: isActive ? `pulse 2s ease-in-out ${i * 0.3}s infinite` : "none",
                }}
              />
              
              {/* Orb */}
              <div
                className="absolute rounded-full transition-all duration-300"
                style={{
                  width: "6px",
                  height: "6px",
                  top: "50%",
                  left: "50%",
                  transform: `rotate(${angle}deg) translateX(${55 + (internalProgress / 20)}px) translateY(-50%)`,
                  background: getProgressColor(internalProgress),
                  opacity: isActive ? 1 : 0.3,
                  scale: isActive ? 1 : 0.7,
                  boxShadow: isActive 
                    ? `0 0 ${8 + (internalProgress / 12.5)}px ${getProgressColor(internalProgress)}`
                    : "none",
                  animation: isActive ? `ping 2s cubic-bezier(0, 0, 0.2, 1) ${i * 0.5}s infinite` : "none",
                }}
              />
            </div>
          );
        })}

        {/* ================= PROGRESS INDICATOR DOTS ================= */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {[...Array(5)].map((_, i) => {
            const dotProgress = Math.max(0, Math.min(100, internalProgress - (i * 20)));
            const isActive = dotProgress > 0;
            
            return (
              <div
                key={i}
                className="transition-all duration-300"
                style={{
                  width: isActive ? "12px" : "6px",
                  height: "6px",
                  borderRadius: "3px",
                  background: isActive 
                    ? getProgressColor(internalProgress)
                    : "var(--muted)",
                  opacity: isActive ? 1 : 0.3,
                  boxShadow: isActive 
                    ? `0 0 ${4 + (internalProgress / 25)}px ${getProgressColor(internalProgress)}`
                    : "none",
                }}
              />
            );
          })}
        </div>
      </div>

      {/* ================= STATUS TEXT ================= */}
      {showText && (
        <div className="mt-12 text-center">
          <p className="text-lg font-semibold mb-2 transition-all duration-300">
            <span style={{ color: getProgressColor(internalProgress) }}>
              {text}
            </span>
            {internalProgress < 100 && (
              <span className="inline-block ml-2">
                <span className="animate-pulse">.</span>
                <span className="animate-pulse" style={{ animationDelay: "0.2s" }}>.</span>
                <span className="animate-pulse" style={{ animationDelay: "0.4s" }}>.</span>
              </span>
            )}
          </p>
          
          {/* Subtle status message */}
          <p className="text-sm text-[var(--foreground)] opacity-60 transition-all duration-300">
            {internalProgress < 30 && "Initializing..."}
            {internalProgress >= 30 && internalProgress < 60 && "Empowering..."}
            {internalProgress >= 60 && internalProgress < 90 && "Almost ready..."}
            {internalProgress >= 90 && internalProgress < 100 && "Finalizing..."}
            {isComplete && "Complete!"}
          </p>
        </div>
      )}
    </div>
  );
}

// Helper function to create hex segments for progress display
function getHexSegmentPath(index: number, size: number, cx: number, cy: number): string {
  const angle = (index * 60) * Math.PI / 180;
  const nextAngle = ((index + 1) * 60) * Math.PI / 180;
  
  const x1 = cx + size * Math.cos(angle);
  const y1 = cy + size * Math.sin(angle);
  const x2 = cx + size * Math.cos(nextAngle);
  const y2 = cy + size * Math.sin(nextAngle);
  
  return `${cx},${cy} ${x1},${y1} ${x2},${y2}`;
}