import { useState } from "react";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface StatusCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const StatusCheckModal = ({ isOpen, onClose }: StatusCheckModalProps) => {
  const [searchInput, setSearchInput] = useState("");
  const [result, setResult] = useState<any>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleCheck = async () => {
    const sanitized = searchInput.trim();
    if (!sanitized) {
      toast({ title: "Error", description: "Please enter a Complaint ID, Mobile No, Email Id, or Name.", variant: "destructive" });
      return;
    }

    setLoading(true);
    setSearched(true);
    setResult(null);

    try {
      const { data, error } = await supabase
        .from("complaints")
        .select("*")
        .or(`complaint_id.eq.${sanitized},mobile.eq.${sanitized},email.eq.${sanitized},full_name.ilike.%${sanitized}%`)
        .limit(5);

      if (error) throw error;

      if (data && data.length > 0) {
        setResult(data);
      } else {
        setResult(null);
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to search.", variant: "destructive" });
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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }} onClick={handleClose}>
      <div className="relative w-full max-w-xl shadow-lg" style={{ backgroundColor: "#fff" }}
        onClick={(e) => e.stopPropagation()}>
        <div className="py-4 text-center" style={{ background: "linear-gradient(to bottom, #a04040, #803030)" }}>
          <span className="text-white text-2xl font-normal">Status Check</span>
        </div>

        <button onClick={handleClose} className="absolute top-3 right-3 text-gray-300 hover:text-white" aria-label="Close">
          <X size={20} />
        </button>

        <div className="p-8">
          <label className="block text-sm font-bold mb-3" style={{ color: "#333" }}>
            Enter Your Complaint ID/Mobile No/Email Id/Name :
          </label>
          <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
            className="w-full border px-3 py-2 text-sm mb-4" style={{ borderColor: "#ccc", backgroundColor: "#fff" }}
            maxLength={200} onKeyDown={(e) => e.key === "Enter" && handleCheck()} />
          <button type="button" onClick={handleCheck} disabled={loading}
            className="px-6 py-2 text-sm border" style={{ backgroundColor: "#e8e8e8", borderColor: "#bbb", color: "#333" }}>
            {loading ? "Checking..." : "Check"}
          </button>

          {searched && !loading && !result && (
            <div className="mt-4 p-3 border text-sm" style={{ backgroundColor: "#fff3cd", borderColor: "#ffc107", color: "#856404" }}>
              No complaint found with the given details. Please check and try again.
            </div>
          )}

          {result && result.length > 0 && (
            <div className="mt-4 space-y-3">
              {result.map((c: any) => (
                <div key={c.id} className="border p-3 text-xs" style={{ borderColor: "#ccc" }}>
                  <p><strong>Complaint ID:</strong> {c.complaint_id}</p>
                  <p><strong>Status:</strong> <span className="font-semibold" style={{ color: c.status === 'Resolved' ? 'green' : c.status === 'Rejected' ? 'red' : '#b8860b' }}>{c.status}</span></p>
                  <p><strong>Name:</strong> {c.full_name || "N/A"}</p>
                  <p><strong>Company:</strong> {c.company || "N/A"}</p>
                  <p><strong>Filed on:</strong> {new Date(c.created_at).toLocaleDateString()}</p>
                  <p><strong>Details:</strong> {c.complaint_details.substring(0, 100)}{c.complaint_details.length > 100 ? "..." : ""}</p>
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
