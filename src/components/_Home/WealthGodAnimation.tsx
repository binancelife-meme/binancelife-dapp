"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, forwardRef, useImperativeHandle, useCallback } from "react";

import { BNBCoinIcon } from "../Chains";

const icons = [() => <BNBCoinIcon size={{ width: "48px", height: "48px" }} />];

interface IconInfo {
  id: number;
  component: React.ComponentType<any>;
  initialX: number;
  initialY: number;
}

export interface WealthGodAnimationHandles {
  triggerAnimation: (count?: number) => void;
}

export const WealthGodAnimation = forwardRef<WealthGodAnimationHandles, {}>((props, ref) => {
  const [iconsToRender, setIconsToRender] = useState<IconInfo[]>([]);
  const timerRef = useRef<NodeJS.Timeout | number | null>(null);

  const triggerAnimation = useCallback((count = 12) => {
    const newIcons: IconInfo[] = Array.from({ length: count }).map((_, i) => {
      const angle = Math.random() * 360;
      const radius = Math.random() * 200 + 200;
      return {
        id: Date.now() + i,
        component: icons[Math.floor(Math.random() * icons.length)],
        initialX: Math.cos((angle * Math.PI) / 180) * radius,
        initialY: Math.sin((angle * Math.PI) / 180) * radius,
      };
    });

    setIconsToRender((prev) => [...prev, ...newIcons]);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => triggerAnimation(2), 5000);
  }, []);

  useImperativeHandle(ref, () => ({
    triggerAnimation,
  }));

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (timerRef.current) {
          clearTimeout(timerRef.current as NodeJS.Timeout);
          timerRef.current = null;
        }
      } else {
        if (!timerRef.current) {
          timerRef.current = setTimeout(() => triggerAnimation(4), 5000);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    // Start the animation initially only if the page is visible
    if (!document.hidden) {
      timerRef.current = setTimeout(() => triggerAnimation(4), 5000);
    }

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (timerRef.current) {
        clearTimeout(timerRef.current as NodeJS.Timeout);
      }
    };
  }, [triggerAnimation]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
      </div>

      <AnimatePresence>
        {iconsToRender.map(({ id, component: Icon, initialX, initialY }) => (
          <motion.div
            key={id}
            initial={{ scale: 1, x: initialX, y: initialY, rotate: 0, opacity: 1, position: "absolute", top: "50%", left: "50%" }}
            animate={{
              x: 0,
              y: 0,
              rotate: 180,
              opacity: [1, 1, 0],
            }}
            exit={{ scale: 0 }}
            transition={{ duration: 2, ease: "easeOut" }}
            onAnimationComplete={() => {
              setIconsToRender((prev) => prev.filter((icon) => icon.id !== id));
            }}
            style={{ transform: "translate(-50%, -50%)" }}
          >
            <Icon />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
});

WealthGodAnimation.displayName = "WealthGodAnimation";