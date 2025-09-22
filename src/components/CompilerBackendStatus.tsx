import { checkCompilerStatus } from "@/actions/backendStatus";
import React from "react";

const CompilerBackendStatus = async () => {
  const response = await checkCompilerStatus();
  return (
    <div className="px-2 py-1 text-xs text-nowrap flex gap-2 w-fit bg-card rounded-full items-center">
      <span className="text-muted-foreground">Compiler Status</span>
      <div
        className="w-2 h-2 rounded-full"
        style={{
          backgroundColor: response.success
            ? "var(--color-green-500)"
            : "var(--color-red-500)",
        }}
      />
    </div>
  );
};

export default CompilerBackendStatus;
