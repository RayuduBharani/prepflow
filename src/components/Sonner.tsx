"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

const Sonner = () => {
  const params = useSearchParams();
  const error = params.get("error");
  if (error) {
    toast("Auth Error", {
      description: error,
      className: "bg-background text-muted-foreground",
    });
  }
  return <></>;
};

export default Sonner;
