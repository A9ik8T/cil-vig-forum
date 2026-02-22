import { useState } from "react";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StatusCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const StatusCheckModal = ({ isOpen, onClose }: StatusCheckModalProps) => {
  const [searchInput, setSearchInput] = useState("");
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleCheck = () => {
    const sanitized = searchInput.trim();
    if (!sanitized) {
      toast({
        title: "Error",
        description: "Please enter a Complaint ID, Mobile No, Email Id, or Name.",
        variant: "destructive",
      });
      return;
    }
    if (sanitized.length > 200) {
      toast({
        title: "Error",
        description: "Input is too long. Please enter a valid identifier.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Status Check",
      description: "No complaint found with the given details.",
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl shadow-lg"
        style={{ backgroundColor: "#fff" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="py-4 text-center"
          style={{
            background: "linear-gradient(to bottom, #a04040, #803030)",
          }}
        >
          <span className="text-white text-2xl font-normal">Status Check</span>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-300 hover:text-white"
          aria-label="Close status check"
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div className="p-8">
          <label
            className="block text-sm font-bold mb-3"
            style={{ color: "#333" }}
          >
            Enter Your Complaint ID/Mobile No/Email Id/Name :
          </label>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full border px-3 py-2 text-sm mb-4"
            style={{ borderColor: "#ccc", backgroundColor: "#fff" }}
            maxLength={200}
          />
          <button
            type="button"
            onClick={handleCheck}
            className="px-6 py-2 text-sm border"
            style={{
              backgroundColor: "#e8e8e8",
              borderColor: "#bbb",
              color: "#333",
            }}
          >
            Check
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusCheckModal;
