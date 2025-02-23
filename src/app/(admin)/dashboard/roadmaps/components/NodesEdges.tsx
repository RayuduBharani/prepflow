import { Node, Edge, DefaultEdgeOptions } from "@xyflow/react";

export const initialNodes: Node[] = [
  { id: "0", data: { label: "Start" }, position: { x: 0, y: 50 } },
];

let id = 1;
export const getId = () => `${id++}`;

export const initialEdges: Edge[] = [];

export const defaultEdgeOptions: DefaultEdgeOptions = {
  animated: true,
};
