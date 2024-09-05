function generateUniqueId(prefix, index) {
  return `${prefix}-${index}`;
}

export function parseObjectToFieldsAndNodes(
  obj,
  prefix = "",
  parentId = null,
  index = 0
) {
  let fields = [];
  let nodes = [];
  let connections = [];

  Object.entries(obj).forEach(([key, value], idx) => {
    const fullKey = prefix ? key : key;
    const currentIndex = index + idx;

    if (typeof value === "object" && !Array.isArray(value) && value !== null) {
      const nestedId = generateUniqueId(
        parentId ? parentId : key,
        currentIndex
      );

      const {
        fields: nestedFields,
        nodes: nestedNodes,
        connections: nestedConnections,
      } = parseObjectToFieldsAndNodes(value, "", nestedId, currentIndex);

      if (parentId !== null) {
        nestedFields.unshift({
          key: "id",
          value: nestedId,
          hasConnection: false,
        });
      }

      nodes.push({
        id: nestedId,
        data: {
          fields: nestedFields,
          id: nestedId,
          parentId,
          nodeName: key,
          isChild: true,
          nodeValueType: "object",
        },
        position: { x: Math.random() * 400, y: Math.random() * 400 },
        type: "objectVisualizer",
      });

      fields.push({
        key: fullKey,
        value: nestedId,
        type: "nodeLink",
        hasConnection: true,
      });

      connections.push({
        source: parentId,
        target: nestedId,
        name: key,
      });

      nodes = nodes.concat(nestedNodes);
      connections = connections.concat(nestedConnections);
    } else if (Array.isArray(value)) {
      value.forEach((item, arrayIndex) => {
        const arrayKey = `${fullKey}[${arrayIndex}]`;
        if (typeof item === "object" && item !== null) {
          const nestedId = generateUniqueId(
            parentId ? `${parentId}-${key}` : key,
            arrayIndex
          );
          const {
            fields: nestedFields,
            nodes: nestedNodes,
            connections: nestedConnections,
          } = parseObjectToFieldsAndNodes(item, "", nestedId, arrayIndex);

          if (parentId !== null) {
            nestedFields.unshift({
              key: "id",
              value: nestedId,
              hasConnection: false,
            });
          }

          nodes.push({
            id: nestedId,
            data: {
              fields: nestedFields,
              id: nestedId,
              parentId,
              nodeName: `${key}[${arrayIndex}]`,
              isChild: true,
              nodeValueType: "array",
            },
            position: { x: Math.random() * 400, y: Math.random() * 400 },
            type: "objectVisualizer",
          });

          fields.push({
            key: arrayKey,
            value: nestedId,
            type: "nodeLink",
            hasConnection: true,
          });

          connections.push({
            source: parentId,
            target: nestedId,
            name: `${key}[${arrayIndex}]`,
          });

          nodes = nodes.concat(nestedNodes);
          connections = connections.concat(nestedConnections);
        } else {
          fields.push({ key: arrayKey, value: item, hasConnection: false });
        }
      });
    } else {
      fields.push({ key: fullKey, value: value, hasConnection: false });
    }
  });

  return { fields, nodes, connections };
}

export function groupByIds(data) {
  let allNodes = [];
  let allConnections = [];

  if (!Array.isArray(data)) {
    data = [data];
  }

  data.forEach((obj, index) => {
    const rootId = obj.id ? `root-${obj.id}` : generateUniqueId("root", index);
    const { fields, nodes, connections } = parseObjectToFieldsAndNodes(
      obj,
      "",
      rootId
    );

    allNodes.push({
      id: rootId,
      data: {
        fields,
        id: rootId,
        parentId: null,
        nodeName: "root",
        isChild: false,
        nodeValueType: "object",
      },
      position: { x: 0, y: 0 },
      type: "objectVisualizer",
    });

    allNodes = allNodes.concat(nodes);
    allConnections = allConnections.concat(connections);
  });

  return { allNodes, connections: allConnections };
}
