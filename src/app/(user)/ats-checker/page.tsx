import { TextAnimate } from "@/components/magicui/text-animate";
import React from "react";
import Upload from "./Upload";
import { AuroraText } from "@/components/magicui/aurora-text";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";

const AtsPage = () => {
  return (
    <div className="w-screen px-6 max-md:px-3 h-svh pt-[5rem]">
      <div className="flex justify-center items-center gap-3">
        <AuroraText className="w-fit">
          <TextAnimate
            className="font-bold w-fit text-xl"
            by="character"
            as={"h1"}
            duration={0.6}
            delay={0.1}
            animation="scaleDown"
          >
            ATS Checker
          </TextAnimate>
        </AuroraText>
        <AnimatedShinyText shimmerWidth={20} className="w-fit mx-0 text-xs border rounded-full p-1 px-2">
          Supports .pdf, .docx
        </AnimatedShinyText>
      </div>
      <Upload />
    </div>
  );
};

export default AtsPage;
