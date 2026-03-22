import { useState } from "react";
import { X, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface StatusCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const statusColor = (status: string) => {
  if (status === "Resolved")    return "#2e7d32";
  if (status === "Rejected")    return "#c62828";
  if (status === "In Progress") return "#1565c0";
  return "#b8860b"; // Pending
};

const StatusCheckModal = ({ isOpen, onClose }: StatusCheckModalProps) => {
  const [searchInput, setSearchInput] = useState("");
  const [result, setResult] = useState<any[] | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleCheck = async () => {
    const sanitized = searchInput.trim();
    if (!sanitized) {
      toast({
        title: "Error",
        description: "Please enter a Complaint ID, Mobile No, Email Id, or Name.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setSearched(true);
    setResult(null);

    try {
      const { data, error } = await supabase
        .from("complaints")
        .select("*")
        .or(
          `complaint_id.eq.${sanitized},mobile.eq.${sanitized},email.eq.${sanitized},full_name.ilike.%${sanitized}%`
        )
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      setResult(data && data.length > 0 ? data : null);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to search. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSearchInput("");
    setResult(null);
    setSearched(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-12 px-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-xl shadow-lg"
        style={{ backgroundColor: "#fff", maxHeight: "85vh", overflowY: "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="py-4 text-center sticky top-0 z-10"
          style={{ background: "linear-gradient(to bottom, #a04040, #803030)" }}
        >
          <span className="text-white text-2xl font-normal">Status Check</span>
        </div>

        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-300 hover:text-white z-20"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          <label className="block text-sm font-bold mb-3" style={{ color: "#333" }}>
            Enter Your Complaint ID / Mobile No / Email Id / Name :
          </label>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="e.g. CIL-100001 or your mobile number"
              className="flex-1 border px-3 py-2 text-sm"
              style={{ borderColor: "#ccc", backgroundColor: "#fff" }}
              onKeyDown={(e) => e.key === "Enter" && handleCheck()}
            />
            <button
              type="button"
              onClick={handleCheck}
              disabled={loading}
              className="px-4 py-2 text-sm border flex items-center gap-1 disabled:opacity-50"
              style={{ backgroundColor: "#e8e8e8", borderColor: "#bbb", color: "#333" }}
            >
              <Search size={14} />
              {loading ? "..." : "Check"}
            </button>
          </div>

          {/* Not found */}
          {searched && !loading && !result && (
            <div
              className="p-4 border text-sm"
              style={{ backgroundColor: "#fff3cd", borderColor: "#ffc107", color: "#856404" }}
            >
              <strong>No complaint found.</strong><br />
              No records match your search. Please check and try again. If you
              haven't lodged a complaint yet, click{" "}
              <strong>"Lodge Complaint"</strong>.
            </div>
          )}

          {/* Results — uses company_name column */}
          {result && result.length > 0 && (
            <div className="space-y-3 mt-2">
              <p className="text-xs" style={{ color: "#666" }}>
                Found {result.length} complaint{result.length > 1 ? "s" : ""}:
              </p>
              {result.map((c: any) => (
                <div
                  key={c.id}
                  className="border p-4 text-xs space-y-1"
                  style={{ borderColor: "#ccc", borderLeft: "4px solid #a04040" }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm font-mono" style={{ color: "#a04040" }}>
                      {c.complaint_id}
                    </span>
                    <span
                      className="px-2 py-0.5 text-white text-xs font-semibold"
                      style={{ backgroundColor: statusColor(c.status) }}
                    >
                      {c.status}
                    </span>
                  </div>

                  {c.full_name    && <p><strong>Name:</strong> {c.full_name}</p>}
                  {c.company_name && <p><strong>Company:</strong> {c.company_name}</p>}
                  {c.mobile       && <p><strong>Mobile:</strong> {c.mobile}</p>}
                  {c.reference_no && <p><strong>Ref No:</strong> {c.reference_no}</p>}

                  <p>
                    <strong>Filed on:</strong>{" "}
                    {new Date(c.created_at).toLocaleDateString("en-IN", {
                      day: "2-digit", month: "short", year: "numeric",
                    })}
                  </p>
                  <p>
                    <strong>Complaint:</strong>{" "}
                    {c.complaint_details.length > 120
                      ? c.complaint_details.substring(0, 120) + "..."
                      : c.complaint_details}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatusCheckModal;
