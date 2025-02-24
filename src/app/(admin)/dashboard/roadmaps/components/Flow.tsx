"use client";
import { useCallback, useEffect } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  ColorMode,
  useNodesState,
  useEdgesState,
  Panel,
} from "@xyflow/react";
import { useTheme } from "next-themes";
import { initialNodes, initialEdges, defaultEdgeOptions } from "./NodesEdges";
import {
  useNodeHandlers,
  useEdgeHandlers,
  useConnectEndHandler,
} from "./handlers";
import { Button } from "@/components/ui/button";

export default function Flow() {
  const { theme } = useTheme();
  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges, setEdges] = useEdgesState(initialEdges);

  const { onNodesChange, onNodeClick, selectedNode, setSelectedNode } =
    useNodeHandlers(setNodes);
  const {
    onEdgesChange,
    onConnect,
    onEdgeClick,
    selectedEdge,
    setSelectedEdge,
  } = useEdgeHandlers(setEdges);
  const onConnectEnd = useConnectEndHandler(setNodes, setEdges);

  const onDeleteNode = useCallback(() => {
    if (!selectedNode) {
      return;
    }
    setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
    setEdges((eds) =>
      eds.filter(
        (edge) =>
          edge.source !== selectedNode.id && edge.target !== selectedNode.id
      )
    );
    setSelectedNode(null);
  }, [selectedNode, setNodes, setEdges, setSelectedNode]);

  const onEditNode = useCallback(() => {
    if (!selectedNode) return;
    const newLabel = prompt(
      "Edit node label:",
      selectedNode.data.label as string
    );
    if (newLabel !== null) {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === selectedNode.id ? { ...n, data: { label: newLabel } } : n
        )
      );
    }
  }, [selectedNode, setNodes]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        !(event.target as HTMLElement).closest(
          ".react-flow__node, .react-flow__edge"
        )
      ) {
        setSelectedNode(null);
        setSelectedEdge(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [setSelectedNode, setSelectedEdge]);

  return (
    <div className="w-full h-full relative">
      <ReactFlow
        colorMode={theme as ColorMode}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgeClick={onEdgeClick}
        onNodeDoubleClick={onEditNode}
        onConnectEnd={onConnectEnd}
        onNodeClick={onNodeClick}
        fitView
        snapToGrid
        defaultEdgeOptions={defaultEdgeOptions}
      >
        {selectedNode && (
          <Panel
            className="z-10 p-2 bg-white dark:bg-gray-800 rounded shadow-md"
            position="top-right"
          >
            <div className="flex flex-col gap-2">
              <Button onClick={onEditNode} variant={"default"}>
                Edit
              </Button>
              <Button onClick={onDeleteNode} variant={"destructive"}>
                Delete
              </Button>
            </div>
          </Panel>
        )}
        {selectedEdge && (
            <Panel position="top-right" className="z-10 bg-background rounded-md p-4">
                <Button size={'sm'}>Edit</Button>
            </Panel>
        )}
        <Background variant={BackgroundVariant.Cross} size={3} />
      </ReactFlow>
    </div>
  );
}
