'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

export function Starfield() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    // Generate random stars on client side only (avoids hydration mismatch)
    const generatedStars: Star[] = [];
    const starCount = 50; // Adjust for density

    for (let i = 0; i < starCount; i++) {
      generatedStars.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1, // 1-3px
        duration: Math.random() * 3 + 2, // 2-5s twinkle
        delay: Math.random() * 5,
        opacity: Math.random() * 0.5 + 0.3, // 0.3-0.8
      });
    }

    setStars(generatedStars);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
          }}
          initial={{ opacity: star.opacity, scale: 1 }}
          animate={{
            opacity: [star.opacity, star.opacity * 0.3, star.opacity],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      
      {/* Occasional shooting star */}
      <ShootingStar />
    </div>
  );
}

function ShootingStar() {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const triggerShootingStar = () => {
      setIsActive(true);
      setTimeout(() => setIsActive(false), 1000);
      
      // Random interval between 8-20 seconds
      const nextTime = Math.random() * 12000 + 8000;
      setTimeout(triggerShootingStar, nextTime);
    };

    const initialDelay = Math.random() * 5000 + 3000;
    const timer = setTimeout(triggerShootingStar, initialDelay);

    return () => clearTimeout(timer);
  }, []);

  if (!isActive) return null;

  const startY = Math.random() * 30; // Top 30% of screen
  const startX = Math.random() * 50; // Left side

  return (
    <motion.div
      className="absolute h-px bg-gradient-to-r from-transparent via-white to-transparent"
      style={{
        top: `${startY}%`,
        left: `${startX}%`,
        width: 100,
        height: 2,
        rotate: 45,
      }}
      initial={{ opacity: 0, x: 0, y: 0 }}
      animate={{
        opacity: [0, 1, 0],
        x: [0, 200],
        y: [0, 200],
      }}
      transition={{ duration: 1, ease: "easeOut" }}
    />
  );
}