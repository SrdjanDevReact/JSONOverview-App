import { FolderIcon } from "@heroicons/react/24/solid";
import Dropzone from "./Dropzone";
import { FilesystemItem } from "./FileSystemItem";
import { useEffect, useState } from "react";
import { processJSONData } from "../utils/dataUtils";
import { getLayoutedElements } from "../utils/layoutUtils";

export default function Sidebar({
  setNodes,
  setEdges,
  setLayoutDirection,
  onFileSelect,
  files,
  setFiles,
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [textareaValue, setTextareaValue] = useState("");

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = () => {
    const allFiles = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.endsWith(".json")) {
        allFiles.push(key);
      }
    }
    setFiles(allFiles);
  };

  const handleFileClick = (fileName) => {
    setSelectedFile(fileName);
    const fileData = localStorage.getItem(fileName);
    if (fileData) {
      const parsedData = JSON.parse(fileData);
      const { allNodes, allConnections } = processJSONData(parsedData);
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        getLayoutedElements(allNodes, allConnections);
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
      setTextareaValue(JSON.stringify(parsedData, null, 2));
      onFileSelect(parsedData);
    }
  };

  const handleDeleteFile = (fileName) => {
    localStorage.removeItem(fileName);
    loadFiles();
    if (selectedFile === fileName) {
      setSelectedFile(null);
      setNodes([]);
      setEdges([]);
      setTextareaValue("");
    }
  };

  const handleRenameFile = (oldName, newName) => {
    const fileData = localStorage.getItem(oldName);
    if (fileData) {
      localStorage.setItem(newName, fileData);
      localStorage.removeItem(oldName);
      loadFiles();
      if (selectedFile === oldName) {
        setSelectedFile(newName);
      }
    }
  };

  const handleNewFileSelection = (fileName) => {
    handleFileClick(fileName);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/json") {
      const reader = new FileReader();
      reader.onload = (e) => {
        localStorage.setItem(file.name, e.target.result);
        loadFiles();
        handleNewFileSelection(file.name);
      };
      reader.readAsText(file);
    }
    setLayoutDirection(true);
  };

  return (
    <div className="bg-slate-300 w-fit rounded-md min-w-[260px] py-4 px-4 border border-gray-400 min-h-[50vh] h-fit shadow-xl shadow-slate-800 flex flex-col justify-between">
      <div className="flex flex-col h-full">
        <ul className="flex-grow" autoFocus={false}>
          <li className="relative">
            <span className="flex items-center gap-1.5 py-4">
              <FolderIcon className="size-6 text-sky-500" />
              All Files
            </span>
            <ul
              className="overflow-y-auto"
              style={{
                maxHeight: "30vh",
                minHeight: "30vh",
                marginBottom: "30px",
                paddingBottom: "6px",
                paddingTop: "",
                backgroundColor: "#d7d9e6",
                borderRadius: "8px",
                caretColor: "transparent",
              }}
            >
              {files.map((file) => (
                <FilesystemItem
                  node={{ name: file }}
                  key={file}
                  onClick={() => {
                    setLayoutDirection(true);
                    handleFileClick(file);
                  }}
                  onDelete={() => handleDeleteFile(file)}
                  onRename={(newName) => handleRenameFile(file, newName)}
                  isSelected={selectedFile === file}
                />
              ))}
            </ul>

            <form className="absolute top-3 right-0 pt-1 ">
              <input
                type="file"
                name="file"
                accept=".json"
                onChange={handleFileUpload}
                id="fileInput"
                style={{ display: "none" }}
              />
              <label
                htmlFor="fileInput"
                className="bg-blue-500 rounded-full w-5 h-5 flex pb-1 items-center justify-center text-white text-lg font-bold hover:bg-blue-600 hover:cursor-pointer caret-transparent"
                title="Upload File"
              >
                +
              </label>
            </form>
          </li>
        </ul>
      </div>

      <Dropzone
        setNodes={setNodes}
        setEdges={setEdges}
        updateFiles={loadFiles}
        onNewFile={handleNewFileSelection}
        textareaValue={textareaValue}
        setTextareaValue={setTextareaValue}
        setLayoutDirection={setLayoutDirection}
        selectedFile={selectedFile}
      />
    </div>
  );
}
