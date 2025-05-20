import { motion } from "framer-motion";
import { Music, Star } from "lucide-react";

// This is a standalone component to overlay floating musical elements
export const FloatingMusicElements = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 60 }).map((_, i) => {
        // Randomly select different musical elements
        const musicElement = Math.floor(Math.random() * 10); // 0-9: variety of instruments and notes
        const opacityValue = 0.6 + Math.random() * 0.3; // High opacity between 0.6 and 0.9
        const size = 25 + Math.random() * 50; // Larger sizes for visibility
        const xPos = Math.random() * 100; // Position across entire width
        const startY = Math.random() * 100; // Random vertical starting position
        const duration = 12 + Math.random() * 18; // Animation duration
        const delay = Math.random() * 8; // Random delay for staggered effect

        return (
          <motion.div
            key={i}
            className="absolute z-50"
            style={{
              opacity: opacityValue,
              top: `${startY}%`,
              left: `${xPos}%`,
              color: '#f0b428', // Explicit color to ensure visibility
              filter: 'drop-shadow(0 0 8px rgba(240, 180, 40, 0.5))',
            }}
            initial={{ 
              y: 0, 
              opacity: 0,
              scale: 0.7,
              rotate: Math.random() * 20 - 10
            }}
            animate={{
              y: -500, // Move upward a significant amount
              opacity: [0, opacityValue, 0],
              scale: [0.7, 1.2, 0.7],
              rotate: [Math.random() * 20 - 10, Math.random() * 40 - 20, Math.random() * 20 - 10]
            }}
            transition={{
              repeat: Infinity,
              duration: duration,
              delay: delay,
              ease: "easeInOut"
            }}
          >
            {/* Simple notes */}
            {musicElement === 0 && (
              <span style={{ fontSize: `${size}px` }}>♪</span>
            )}
            {musicElement === 1 && (
              <span style={{ fontSize: `${size}px` }}>♫</span>
            )}
            {musicElement === 2 && (
              <span style={{ fontSize: `${size}px` }}>♬</span>
            )}
            {musicElement === 3 && (
              <span style={{ fontSize: `${size}px` }}>♩</span>
            )}
            
            {/* Guitar SVG */}
            {musicElement === 4 && (
              <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                  d="M14.5 2.5c1 .5 2 2 2 3.5m-6 18c-2.5 0-5.5-2-5.5-6 0-2 .5-4.5 2.5-6.5 1-1 2-1.5 3-1.5 1.5 0 2.5 1 3 2 .5 1 .5 2.5-.5 3.5s-1.5 1-2 1c-.5 0-1.5 0-1.5-1 0-1 1-1 1-1" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  fill={Math.random() > 0.5 ? "rgba(240, 180, 40, 0.2)" : "none"}
                />
                <path 
                  d="m8.5 8.5 3-3m1 4 1-1m-1 4 1-1" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            )}
            
            {/* Drum SVG */}
            {musicElement === 5 && (
              <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                  d="M12 14a4 4 0 0 1 0-8 4 4 0 0 1 0 8z" 
                  stroke="currentColor" 
                  strokeWidth="1.5"
                  fill={Math.random() > 0.5 ? "rgba(240, 180, 40, 0.2)" : "none"} 
                />
                <path 
                  d="M12 14v8m-8-8h16" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                />
                <path 
                  d="M6 6c-1.5 1.5-2 3-2 8s.5 6.5 2 8h12c1.5-1.5 2-3 2-8s-.5-6.5-2-8H6z" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  fill={Math.random() > 0.7 ? "rgba(240, 180, 40, 0.2)" : "none"}
                />
              </svg>
            )}
            
            {/* Saxophone SVG */}
            {musicElement === 6 && (
              <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                  d="M16.5 21.5c-1-.5-1.5-2-1.5-3.5 0-2 3-7 3-12.5 0-1.5-.5-2.5-1.5-3.5" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                />
                <path 
                  d="M11.5 21.5c-3 0-7-1.5-7-5.5 0-2.5 2-5.5 4.5-5.5 1.5 0 2.5 1 2.5 2 0 1.5-1 2.5-2.5 2.5" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  fill={Math.random() > 0.5 ? "rgba(240, 180, 40, 0.2)" : "none"}
                />
                <path 
                  d="M16.5 9.5 11 15m0-1.5c0 1.5-1 2.5-2.5 2.5" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                />
              </svg>
            )}
            
            {/* Piano/Keyboard SVG */}
            {musicElement === 7 && (
              <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect 
                  x="2" 
                  y="4" 
                  width="20" 
                  height="16" 
                  rx="2" 
                  stroke="currentColor" 
                  strokeWidth="1.5"
                  fill={Math.random() > 0.6 ? "rgba(240, 180, 40, 0.2)" : "none"} 
                />
                <path 
                  d="M2 10h20M7 10v10M12 10v10M17 10v10M9 4v6M14 4v6" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                />
              </svg>
            )}
            
            {/* Headphones SVG */}
            {musicElement === 8 && (
              <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                  d="M4 13.5V13c0-4.97 3.582-9 8-9s8 4.03 8 9v.5" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
                <path 
                  d="M2 17.438v-4.875a2 2 0 0 1 2-2h1.5a2 2 0 0 1 2 2v4.875a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2Z" 
                  stroke="currentColor" 
                  strokeWidth="1.5"
                  fill={Math.random() > 0.5 ? "rgba(240, 180, 40, 0.2)" : "none"} 
                />
                <path 
                  d="M22 17.438v-4.875a2 2 0 0 0-2-2h-1.5a2 2 0 0 0-2 2v4.875a2 2 0 0 0 2 2H20a2 2 0 0 0 2-2Z" 
                  stroke="currentColor" 
                  strokeWidth="1.5"
                  fill={Math.random() > 0.5 ? "rgba(240, 180, 40, 0.2)" : "none"} 
                />
              </svg>
            )}
            
            {/* Microphone SVG */}
            {musicElement === 9 && (
              <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                  d="M12 19v3m-4-3h8" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
                <rect 
                  x="8" 
                  y="2" 
                  width="8" 
                  height="13" 
                  rx="4" 
                  stroke="currentColor" 
                  strokeWidth="1.5"
                  fill={Math.random() > 0.5 ? "rgba(240, 180, 40, 0.2)" : "none"} 
                />
                <path 
                  d="M19 10v1a7 7 0 0 1-7 7v0a7 7 0 0 1-7-7v-1" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
              </svg>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};