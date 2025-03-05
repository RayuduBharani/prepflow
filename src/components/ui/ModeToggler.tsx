"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant={"outline"}
      size={"icon"}
      className="[&_svg]:shrink [&_svg]:size-5 hover:bg-opacity-80 transition-all"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Change Light/Dark Mode"
    >
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          filter:
            theme === "light"
              ? "drop-shadow(0 0 8px rgba(255, 215, 0, 0.6))"
              : "drop-shadow(0 0 8px rgba(0, 0, 0, 0.6))",
        }}
      >
        {/* Moon Path */}
        <motion.path
          initial={{ rotate: 0, scale: 1, opacity: 0 }}
          animate={
            theme === "light"
              ? { rotate: 90, scale: 0, opacity: 0, stroke: "#6b7280" } // Gray for dark mode
              : { rotate: 0, scale: 1, opacity: 1, stroke: "#6b7280", fill : '#6b7280' } // Yellow for light mode
          }
          transition={{ duration: 0.5, ease: "easeInOut" }}
          d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"
        />
        {/* Sun Circle */}
        <motion.circle
          initial={{ scale: 0, opacity: 0 }}
          animate={
            theme === "light"
              ? { scale: 1, opacity: 1, stroke: "#f59e0b" } // Yellow for light mode
              : { scale: 0, opacity: 0, stroke: "#6b7280" } // Gray for dark mode
          }
          transition={{ duration: 0.5, ease: "easeInOut" }}
          cx="12"
          cy="12"
          r="4"
        />
        {/* Sun Rays */}
        <motion.path
          initial={{ opacity: 0, y: -10, rotate: 0 }}
          animate={
            theme === "light"
              ? { opacity: 1, y: 0, rotate: 0, stroke: "#f59e0b" } // Yellow for light mode
              : { opacity: 0, y: -10, rotate: -45, stroke: "#6b7280" } // Gray for dark mode
          }
          transition={{ duration: 0.5, ease: "easeInOut" }}
          d="M12 2v2"
        />
        <motion.path
          initial={{ opacity: 0, y: 10, rotate: 0 }}
          animate={
            theme === "light"
              ? { opacity: 1, y: 0, rotate: 0, stroke: "#f59e0b" } // Yellow for light mode
              : { opacity: 0, y: 10, rotate: 45, stroke: "#6b7280" } // Gray for dark mode
          }
          transition={{ duration: 0.5, ease: "easeInOut" }}
          d="M12 20v2"
        />
        <motion.path
          initial={{ opacity: 0, x: -10, rotate: 0 }}
          animate={
            theme === "light"
              ? { opacity: 1, x: 0, rotate: 0, stroke: "#f59e0b" } // Yellow for light mode
              : { opacity: 0, x: -10, rotate: -45, stroke: "#6b7280" } // Gray for dark mode
          }
          transition={{ duration: 0.5, ease: "easeInOut" }}
          d="m4.93 4.93 1.41 1.41"
        />
        <motion.path
          initial={{ opacity: 0, x: 10, rotate: 0 }}
          animate={
            theme === "light"
              ? { opacity: 1, x: 0, rotate: 0, stroke: "#f59e0b" } // Yellow for light mode
              : { opacity: 0, x: 10, rotate: 45, stroke: "#6b7280" } // Gray for dark mode
          }
          transition={{ duration: 0.5, ease: "easeInOut" }}
          d="m17.66 17.66 1.41 1.41"
        />
        <motion.path
          initial={{ opacity: 0, x: -10, rotate: 0 }}
          animate={
            theme === "light"
              ? { opacity: 1, x: 0, rotate: 0, stroke: "#f59e0b" } // Yellow for light mode
              : { opacity: 0, x: -10, rotate: -45, stroke: "#6b7280" } // Gray for dark mode
          }
          transition={{ duration: 0.5, ease: "easeInOut" }}
          d="M2 12h2"
        />
        <motion.path
          initial={{ opacity: 0, x: 10, rotate: 0 }}
          animate={
            theme === "light"
              ? { opacity: 1, x: 0, rotate: 0, stroke: "#f59e0b" } // Yellow for light mode
              : { opacity: 0, x: 10, rotate: 45, stroke: "#6b7280" } // Gray for dark mode
          }
          transition={{ duration: 0.5, ease: "easeInOut" }}
          d="M20 12h2"
        />
        <motion.path
          initial={{ opacity: 0, rotate: -90 }}
          animate={
            theme === "light"
              ? { opacity: 1, rotate: 0, stroke: "#f59e0b" } // Yellow for light mode
              : { opacity: 0, rotate: -90, stroke: "#6b7280" } // Gray for dark mode
          }
          transition={{ duration: 0.5, ease: "easeInOut" }}
          d="m6.34 17.66-1.41 1.41"
        />
        <motion.path
          initial={{ opacity: 0, rotate: 90 }}
          animate={
            theme === "light"
              ? { opacity: 1, rotate: 0, stroke: "#f59e0b" } // Yellow for light mode
              : { opacity: 0, rotate: 90, stroke: "#6b7280" } // Gray for dark mode
          }
          transition={{ duration: 0.5, ease: "easeInOut" }}
          d="m19.07 4.93-1.41 1.41"
        />
      </motion.svg>
    </Button>
  );
}
