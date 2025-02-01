// components/not-found.tsx
"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="p-5 flex items-center w-[calc(100vw-30rem)] h-[calc(100vh-20rem)] px-4 ">
      <div className="w-full space-y-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="animate-float text-6xl font-bold text-primary mb-8">
            404
          </div>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut",
            }}
            className="absolute -top-8 right-0 text-4xl"
          >
            🚀
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-3xl font-bold text-white mb-4">
            Job Not Found!
          </h1>
          <p className="text-slate-300 mb-8">
            The job listing you're looking for doesn't exist or has been removed.
            Let's explore other opportunities!
          </p>
          
          <Link href="/jobs">
            <Button
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-8 py-4
                       transition-all duration-300 transform hover:scale-105 shadow-lg
                       hover:shadow-indigo-500/30 motion-safe:animate-pulse"
            >
              Browse Jobs
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-slate-400 text-sm"
        >
          <p>Can't find what you're looking for? Check our job search tips</p>
        </motion.div>
      </div>
    </div>
  );
}