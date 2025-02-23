import { useCallback, useState } from "react";
import {
  applyEdgeChanges,
  applyNodeChanges,
  addEdge,
  Node,
  Edge,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
  useReactFlow,
  OnConnectEnd,
} from "@xyflow/react";
import { getId } from "./NodesEdges";

export function useNodeHandlers(setNodes: Function) {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds: Node[]) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  return { onNodesChange, onNodeClick, selectedNode, setSelectedNode };
}

export function useEdgeHandlers(setEdges: Function) {
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null)
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds: Edge[]) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onEdgeClick = useCallback((event : React.MouseEvent, edge : Edge) => {
    setSelectedEdge(edge)
  }, [selectedEdge])

  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds: Edge[]) => addEdge(connection, eds)),
    [setEdges]
  );

  return { onEdgesChange, onConnect, onEdgeClick, selectedEdge, setSelectedEdge };
}

export function useConnectEndHandler(setNodes: Function, setEdges: Function) {
  const { screenToFlowPosition } = useReactFlow();

  const onConnectEnd: OnConnectEnd = useCallback(
    (event, connectionState) => {
      if (!connectionState.isValid) {
        const id = getId();
        const { clientX, clientY } =
          "changedTouches" in event ? event.changedTouches[0] : event;

        const newNode: Node = {
          id,
          position: screenToFlowPosition({ x: clientX, y: clientY }),
          data: { label: `Node ${id}` },
          origin: [0.5, 0],
        };

        setNodes((nds: Node[]) => [...nds, newNode]);
        setEdges((eds: Edge[]) => [
          ...eds,
          { id, source: connectionState.fromNode?.id ?? "", target: id },
        ]);
      }
    },
    [screenToFlowPosition]
  );

  return onConnectEnd;
}
