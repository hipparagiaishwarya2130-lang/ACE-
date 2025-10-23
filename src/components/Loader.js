import React, { useEffect } from "react";
import { motion } from "framer-motion";

// Per-character animated variants (no hooks)
const charVariants = {
  hidden: (i) => ({
    opacity: 0,
    y: 22,
    scale: 0.9,
    rotate: -2 + (i % 4) // tiny variety
  }),
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    rotate: 0,
    transition: {
      delay: 0.04 * i,
      type: "spring",
      stiffness: 500,
      damping: 30,
      mass: 0.6
    }
  })
};

// Gentle pulsing glow animation for the whole title
const glowAnimation = {
  textShadow: [
    "0 0 0px rgba(0,255,200,0.0)",
    "0 0 8px rgba(0,255,200,0.35)",
    "0 0 0px rgba(0,255,200,0.0)"
  ],
  transition: {
    repeat: Infinity,
    duration: 2.6,
    ease: "easeInOut"
  }
};

const Loader = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete && onComplete();
    }, 4500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const title = "ACE AI BASED COGNITIVE EDUCATION";

  return (
    <motion.div
      style={{
        position: "fixed",
        inset: 0,
        background: "linear-gradient(135deg, #0b0e16 0%, #121826 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        overflow: "hidden",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Rotating Rings */}
      <div
        style={{
          position: "relative",
          width: "90px",
          height: "90px",
          marginBottom: "40px",
        }}
      >
        <motion.span
          style={{
            position: "absolute",
            inset: 0,
            border: "3px solid transparent",
            borderTopColor: "#00A6FF",
            borderRadius: "50%",
          }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "linear" }}
        />
        <motion.span
          style={{
            position: "absolute",
            inset: 8,
            border: "3px solid transparent",
            borderBottomColor: "#00FFD1",
            borderRadius: "50%",
          }}
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 2.2, ease: "linear" }}
        />
      </div>

      {/* Animated Title */}
      <motion.div
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          textAlign: "center",
          gap: "4px",
          fontSize: "1.75rem",
          fontWeight: 700,
          letterSpacing: "2.5px",
          textTransform: "uppercase",
          fontFamily: "Inter, sans-serif",
          color: "#E4E7EB",
        }}
        animate={glowAnimation}
        transition={{ repeat: Infinity, duration: 2.6, ease: "easeInOut" }}
      >
        {/* Shimmer sweep overlay */}
        <motion.div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            mixBlendMode: "screen",
            background:
              "linear-gradient(110deg, transparent 0%, rgba(0,255,200,0.08) 45%, rgba(0,166,255,0.15) 50%, rgba(0,255,200,0.08) 55%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(120% 180% at 50% 50%, black 60%, transparent 65%)",
            maskImage:
              "radial-gradient(120% 180% at 50% 50%, black 60%, transparent 65%)",
          }}
          initial={{ x: "-60%", opacity: 0.6 }}
          animate={{ x: "160%", opacity: [0.2, 0.6, 0.2] }}
          transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
        />

        {/* Characters */}
        {title.split("").map((char, index) => (
          <motion.span
            key={index}
            custom={index}
            variants={charVariants}
            initial="hidden"
            animate="visible"
            style={{
              display: "inline-block",
              padding: "2px 1px",
              // Subtle per-letter gradient for non-space
              background:
                char !== " "
                  ? "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(180,245,235,0.9))"
                  : "none",
              WebkitBackgroundClip: char !== " " ? "text" : undefined,
              WebkitTextFillColor: char !== " " ? "transparent" : "transparent",
              color: char !== " " ? undefined : "transparent",
            }}
            whileHover={char !== " " ? { y: -2, scale: 1.04 } : undefined}
            transition={{ type: "spring", stiffness: 400, damping: 22, mass: 0.4 }}
          >
            {char}
          </motion.span>
        ))}
      </motion.div>

      {/* Floating Subtle Glow */}
      <motion.div
        style={{
          position: "absolute",
          bottom: "-40%",
          width: "200%",
          height: "200%",
          background:
            "radial-gradient(circle at 50% 100%, rgba(0, 166, 255, 0.1), transparent 70%)",
          transformOrigin: "bottom center",
        }}
        animate={{ scaleY: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
      />

      {/* Gentle floating effect for text */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: "58%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "60%",
          height: "2px",
          background:
            "linear-gradient(90deg, transparent, rgba(0,255,200,0.5), transparent)",
          filter: "blur(4px)",
        }}
      />
    </motion.div>
  );
};

export default Loader;
