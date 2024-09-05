import { groupByIds } from "./utils";

export const processJSONData = (parsedData) => {
  const { allNodes, connections } = groupByIds(parsedData);

  const allConnections = connections.map((connection, index) => ({
    id: `edge-${index + 1}`,
    source: `${connection.source}`,
    sourceHandle: `${connection.source}-${connection.name}`,
    target: `${connection.target}`,
    targetHandle: `${connection.target}-top`,
    animated: true,
  }));

  return { allNodes, allConnections };
};
