"use client";
import { ReactFlowProvider } from "@xyflow/react";
import Flow from "./components/Flow";
import '@xyflow/react/dist/style.css'

export default function RoadmapsBuilder() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}
