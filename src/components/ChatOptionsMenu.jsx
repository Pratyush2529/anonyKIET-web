import { useEffect, useRef, useState } from "react";
import { MoreVertical, Trash2, Ban } from "lucide-react";

const ChatOptionsMenu = ({ onDelete, onBlock, onUnblock }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };

    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        className="p-2 rounded-lg hover:bg-gray-100"
      >
        <MoreVertical className="w-5 h-5" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-xl shadow-md z-50">
          <button
            onClick={() => {
              onDelete();
              setOpen(false);
            }}
            className="flex items-center w-full px-4 py-2 "
          >
            <Trash2 className="w-4 h-4 mr-3" />
            Delete Chat
          </button>

          {/* <button
            onClick={() => {
              onBlock();
              setOpen(false);
            }}
            className="flex items-center w-full px-4 py-2"
          >
            <Ban className="w-4 h-4 mr-3" />
            Block User
          </button>
          <button
            onClick={() => {
              onUnblock();
              setOpen(false);
            }}
            className="flex items-center w-full px-4 py-2"
          >
            <Ban className="w-4 h-4 mr-3" />
            Unblock User
          </button> */}
        </div>
      )}
    </div>
  );
};

export default ChatOptionsMenu;
