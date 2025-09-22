"use client";
import { toTitleCase } from "@/lib/utils";
import { useLanguageStore } from "@/store/compilerStore";
import React from "react";

const DisplayLoader = () => {
  const { language } = useLanguageStore();
  return <p className="text-sm">Executing {toTitleCase(language)} code...</p>;
};

export default DisplayLoader;
