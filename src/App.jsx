import { Button } from "@chakra-ui/react";
import {
  addEdge,
  Background,
  MiniMap,
  Panel,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useEffect, useMemo, useState } from "react";
import Sidebar from "./components/Sidebar";
import TableView from "./components/TableView";
import { getLayoutedElements } from "./utils/layoutUtils";
import ObjectVisualizer from "./visualizer/ObjectVisualizer";

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [layoutDirection, setLayoutDirection] = useState(true);
  const [showTableView, setShowTableView] = useState(false);
  const [jsonData, setJsonData] = useState(null);
  const [files, setFiles] = useState([]);

  const nodeTypes = useMemo(
    () => ({
      objectVisualizer: (props) => (
        <ObjectVisualizer {...props} onFieldChange={handleFieldChange} />
      ),
    }),
    []
  );

  useEffect(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      nodes,
      edges
    );
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, []);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onLayout = useCallback(
    (direction) => {
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        getLayoutedElements(nodes, edges, direction);

      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
    },
    [nodes, edges]
  );

  const handleFileSelection = (data) => {
    setJsonData(data);
    setShowTableView(false);
  };

  const handleFieldChange = (nodeId, key, newValue) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              fields: node.data.fields.map((field) =>
                field.key === key ? { ...field, value: newValue } : field
              ),
            },
          };
        }
        return node;
      })
    );
  };

  const buildNestedJSON = (nodeId, nodesMap, isRoot = true) => {
    const node = nodesMap[nodeId];
    if (!node) return null;

    const obj = {};
    node.data.fields.forEach((field) => {
      if (field.type === "nodeLink" && nodesMap[field.value]) {
        obj[field.key] = buildNestedJSON(field.value, nodesMap, false);
      } else {
        obj[field.key] = field.value;
      }
    });

    if (!isRoot) {
      delete obj.id;
    }

    return obj;
  };

  const saveNodesToLocalStorage = () => {
    const nodesMap = nodes.reduce((acc, node) => {
      acc[node.id] = node;
      return acc;
    }, {});

    const jsonOutput = nodes
      .filter((node) => !node.data.isChild)
      .map((node) => buildNestedJSON(node.id, nodesMap, true));

    const fileKeys = Object.keys(localStorage).filter((key) =>
      key.startsWith("file-")
    );
    const fileIndex = fileKeys.length + 1;

    const fileName = `file-${fileIndex}.json`;
    localStorage.setItem(fileName, JSON.stringify(jsonOutput, null, 2));

    setFiles((prevFiles) => [...prevFiles, fileName]);
    handleFileSelection(jsonOutput);
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        style={{ backgroundColor: "#2f325a" }}
        attributionPosition="bottom-left"
        fitView
      >
        <Panel position="top-left" className="mt-10">
          <Sidebar
            setNodes={setNodes}
            setEdges={setEdges}
            setLayoutDirection={setLayoutDirection}
            onFileSelect={handleFileSelection}
            files={files}
            setFiles={setFiles}
          />
        </Panel>
        <Panel position="top-right" style={{ display: "flex", gap: "10px" }}>
          {showTableView && jsonData && <TableView data={jsonData} />}
          <Button onClick={() => setShowTableView((prev) => !prev)}>
            {showTableView ? "Hide Table View" : "Table View"}
          </Button>
          <Button colorScheme="green" onClick={saveNodesToLocalStorage}>
            Save Changes
          </Button>
          <Button
            colorScheme="blue"
            size="md"
            onClick={() => {
              onLayout(layoutDirection ? "TB" : "LR");
              setLayoutDirection(!layoutDirection);
            }}
            isActive={!layoutDirection}
            shadow={"xl"}
          >
            {layoutDirection ? "Vertical" : "Horizontal"}
          </Button>
        </Panel>

        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}
