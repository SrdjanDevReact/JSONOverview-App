import { Button, Textarea } from "@chakra-ui/react";
import { processJSONData } from "../utils/dataUtils";
import { getLayoutedElements } from "../utils/layoutUtils";

const Dropzone = ({
  setNodes,
  setEdges,
  updateFiles,
  onNewFile,
  textareaValue,
  setTextareaValue,
  setLayoutDirection,
  selectedFile,
}) => {
  const handleFilePreview = () => {
    try {
      if (!textareaValue) {
        console.error("Textarea is empty.");
        return;
      }

      const parsedData = JSON.parse(textareaValue);
      console.log("Parsed JSON from Textarea:", parsedData);
      const { allNodes, allConnections } = processJSONData(parsedData);
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        getLayoutedElements(allNodes, allConnections);

      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
      const fileKeys = Object.keys(localStorage).filter((key) =>
        key.startsWith("file-")
      );
      const fileIndex = fileKeys.length + 1;
      const fileName = `file-${fileIndex}.json`;
      localStorage.setItem(fileName, JSON.stringify(parsedData));
      updateFiles();
      onNewFile(fileName);
      setTextareaValue(JSON.stringify(parsedData, null, 2));
    } catch (error) {
      console.error("Error parsing JSON from Textarea:", error);
    }
  };

  const handleDownload = () => {
    if (!textareaValue) {
      console.error("Textarea is empty.");
      return;
    }

    const blob = new Blob([textareaValue], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    const downloadFileName = selectedFile ? `${selectedFile}` : "download.json";
    link.href = url;
    link.download = downloadFileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full relative caret-transparent">
      <div className="flex flex-row justify-between">
        <h2 className="text-[10px] pl-4 mt-1">Copy your JSON here:</h2>
        <Button
          colorScheme="green"
          size="xs"
          onClick={handleDownload}
          style={{ marginRight: "10px" }}
        >
          Download
        </Button>
      </div>
      <div className="bg-white mt-2 rounded-xl caret-transparent relative">
        <Textarea
          placeholder="Here is a JSON placeholder.."
          height="200px"
          resize={"none"}
          fontSize={"xx-small"}
          value={textareaValue}
          onChange={(e) => setTextareaValue(e.target.value)}
          style={{
            borderRadius: "9px",
            overflowY: "scroll",
            caretColor: "#c5cdd3",
            border: "2px solid #c5cdd3",
          }}
          spellCheck={false}
        />
        <Button
          colorScheme="blue"
          size="xs"
          onClick={() => {
            setLayoutDirection(true);
            handleFilePreview();
          }}
          style={{
            position: "absolute",
            bottom: "8px",
            right: "24px",
            zIndex: 10,
          }}
        >
          Preview
        </Button>
      </div>
    </div>
  );
};

export default Dropzone;
