import {
  ChevronRightIcon,
  DocumentIcon,
  FolderIcon,
  TrashIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/solid";
import { useState } from "react";

export function FilesystemItem({
  node,
  onClick,
  onDelete,
  onRename,
  isSelected,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(node.name);

  const handleClick = () => {
    onClick();
  };

  const handleRenameSubmit = (e) => {
    e.preventDefault();
    setIsRenaming(false);
    if (newName !== node.name) {
      onRename(newName);
    }
  };

  return (
    <li key={node.name} className="w-[100%]">
      <div
        className={`flex items-center gap-1.5 py-1  cursor-pointer ${
          isSelected ? "bg-blue-300" : ""
        }`}
      >
        <span
          className={`flex items-center gap-1.5 flex-grow ${
            isRenaming ? "caret-slate-600" : "caret-transparent"
          } `}
          onClick={handleClick}
        >
          {node.nodes && node.nodes.length > 0 && (
            <button onClick={() => setIsOpen(!isOpen)} className="p-1 -m-1">
              <ChevronRightIcon
                className={`size-4 text-gray-500 ${isOpen ? "rotate-90" : ""}`}
              />
            </button>
          )}
          {node.nodes ? (
            <FolderIcon
              className={`size-6 text-sky-500 ${
                node.nodes.length === 0 ? "ml-[22px]" : ""
              }`}
            />
          ) : (
            <DocumentIcon className="ml-[22px] size-6 text-gray-900" />
          )}
          {isRenaming ? (
            <form onSubmit={handleRenameSubmit}>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="border rounded px-1 text-xs"
                autoFocus
              />
            </form>
          ) : (
            node.name
          )}
        </span>
        <button
          className="p-1"
          onClick={() => setIsRenaming(!isRenaming)}
          title="Rename"
        >
          <PencilSquareIcon className="size-4 text-gray-500 hover:text-gray-700" />
        </button>
        <button className="p-1" onClick={onDelete} title="Delete">
          <TrashIcon className="size-4 text-red-500 hover:text-red-700" />
        </button>
      </div>
      {isOpen && node.nodes && (
        <ul className="pl-6">
          {node.nodes.map((childNode) => (
            <FilesystemItem
              node={childNode}
              key={childNode.name}
              onClick={onClick}
              onDelete={onDelete}
              onRename={onRename}
              isSelected={isSelected}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
