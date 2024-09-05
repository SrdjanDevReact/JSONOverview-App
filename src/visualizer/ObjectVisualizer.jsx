import { Box, Flex, Text, Tooltip, Input } from "@chakra-ui/react";
import { Handle, Position } from "@xyflow/react";
import { useState, useEffect } from "react";

const ObjectVisualizer = ({ data, onFieldChange }) => {
  const [editingField, setEditingField] = useState(null);
  const [fieldValues, setFieldValues] = useState(
    data.fields.reduce((acc, { key, value }) => {
      acc[key] = value;
      return acc;
    }, {})
  );

  // Update fieldValues kada se data.fields promijeni
  useEffect(() => {
    const newFieldValues = data.fields.reduce((acc, { key, value }) => {
      acc[key] = value;
      return acc;
    }, {});
    setFieldValues(newFieldValues);
  }, [data.fields]);

  const handleFieldChange = (key, newValue) => {
    setFieldValues((prev) => ({
      ...prev,
      [key]: newValue,
    }));
    onFieldChange(data.id, key, newValue);
  };

  const handleFieldEdit = (key) => {
    setEditingField(key);
  };

  const handleKeyDown = (e, key) => {
    if (e.key === "Enter" || e.key === "Escape") {
      setEditingField(null);
    }
  };

  return (
    <Box borderRadius="8px" minWidth="250px" position="relative">
      <Box
        p={1}
        textAlign="center"
        borderRadius="8px 8px 0 0"
        bg={data.isChild ? "#374f7a" : "#537ac2"}
      >
        <Text fontWeight={"bold"} color="white">
          {data.isChild ? "name: " : "id:"} {data.nodeName}
        </Text>
      </Box>

      {data.isChild && (
        <Handle
          position={Position.Top}
          id={`${data.id}-top`}
          type="target"
          style={{ background: "#555", top: -8 }}
        />
      )}

      {data.fields.map(({ key, hasConnection }, index) => (
        <Tooltip
          key={index}
          label={String(fieldValues[key])}
          aria-label={`Tooltip for ${key}`}
        >
          <Flex
            _even={{ bg: "#282828" }}
            _odd={{ bg: "#232323" }}
            justifyContent={"space-between"}
            gap={"50px"}
            p={1}
            color="white"
            position="relative"
          >
            <Text>{key.length < 10 ? key : `${key.slice(0, 8)}..`}</Text>

            {editingField === key ? (
              <Input
                value={fieldValues[key]}
                onChange={(e) => handleFieldChange(key, e.target.value)}
                onBlur={() => setEditingField(null)}
                onKeyDown={(e) => handleKeyDown(e, key)}
                size="xs"
                fontSize="xs"
                color="white"
                bg="transparent"
                border="none"
                p={0}
                _focus={{ outline: "none", boxShadow: "none" }}
              />
            ) : (
              <Text
                fontSize="xs"
                onClick={() => handleFieldEdit(key)}
                cursor="pointer"
              >
                {typeof fieldValues[key] === "string" ||
                typeof fieldValues[key] === "number"
                  ? fieldValues[key].toString().length < 16
                    ? fieldValues[key]
                    : `${fieldValues[key].toString().slice(0, 16)}..`
                  : JSON.stringify(fieldValues[key])}
              </Text>
            )}

            {hasConnection && (
              <Handle
                position={Position.Right}
                id={`${data.id}-${key}`}
                type="source"
                style={{ top: 16 }}
              />
            )}
          </Flex>
        </Tooltip>
      ))}
    </Box>
  );
};

export default ObjectVisualizer;
