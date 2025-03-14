'use client'

import Link from "next/link";
import { Coffee } from "lucide-react";
import { Button } from "./ui/button";

const RazorpayButton = () => {
  return (
    <Link target="_blank" href="https://pages.razorpay.com/pl_Q6YgOtfRryE6lq/view">
      <Button 
        icon={Coffee} 
        className="relative text-xs overflow-hidden bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 animate-gradient text-white font-semibold rounded-lg px-6 py-3 shadow-lg hover:scale-105 transition-all duration-300"
        iconPlacement="right"
        size={'sm'}
        effect="gooeyRight"
      >
        Buy me a Coffee
      </Button>
    </Link>
  );
};

export default RazorpayButton;
