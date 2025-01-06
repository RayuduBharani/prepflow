import React from "react";
import DSACarousel from "@/components/DSA/DSACarousel";

const LeetEssentials = () => {
  return (
    <div className="flex flex-col gap-2 flex-wrap flex-1">
      <h1 className="font-medium text-base flex">Essentials of Leetcode</h1>
      <DSACarousel />
    </div>
  );
};

export default LeetEssentials;
