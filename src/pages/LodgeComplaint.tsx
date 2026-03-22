import { useState } from "react";
import { Link } from "react-router-dom";
import { RefreshCw, CheckCircle, Copy, X } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const generateCaptcha = () => Math.floor(1000 + Math.random() * 9000).toString();

// ── Success Popup ─────────────────────────────────────────────
const SuccessModal = ({
  complaintId,
  onClose,
}: {
  complaintId: string;
  onClose: () => void;
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(complaintId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
    >
      <div
        className="relative w-full max-w-md mx-4 shadow-2xl rounded-sm overflow-hidden"
        style={{ backgroundColor: "#fff" }}
      >
        {/* Header */}
        <div
          className="py-4 px-6 flex items-center gap-2"
          style={{ background: "linear-gradient(to bottom, #2e7d32, #1b5e20)" }}
        >
          <CheckCircle className="text-white" size={22} />
          <span className="text-white text-lg font-semibold">
            Complaint Submitted Successfully!
          </span>
        </div>

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-300 hover:text-white"
        >
          <X size={20} />
        </button>

        {/* Body */}
        <div className="p-8 text-center">
          <p className="text-sm mb-2" style={{ color: "#555" }}>
            Your complaint has been registered. Please save your Complaint ID for tracking:
          </p>

          {/* CIL-XXXXXX box */}
          <div
            className="flex items-center justify-center gap-3 my-5 px-5 py-4 rounded"
            style={{ backgroundColor: "#f0fdf4", border: "2px solid #4caf50" }}
          >
            <span
              className="text-2xl font-bold tracking-widest"
              style={{ color: "#1b5e20", fontFamily: "monospace" }}
            >
              {complaintId}
            </span>
            <button
              onClick={handleCopy}
              title="Copy to clipboard"
              className="text-green-700 hover:text-green-900"
            >
              <Copy size={18} />
            </button>
          </div>

          {copied && (
            <p className="text-xs mb-3" style={{ color: "#2e7d32" }}>
              ✓ Copied to clipboard!
            </p>
          )}

          <p className="text-xs mb-6" style={{ color: "#888" }}>
            Use this ID to check your complaint status anytime using the{" "}
            <strong>"Check Your Complaint Status"</strong> button on the home page.
          </p>

          <div className="flex gap-3 justify-center">
            <Link
              to="/"
              onClick={onClose}
              className="px-5 py-2 text-sm text-white rounded-sm"
              style={{ backgroundColor: "#1b5e20" }}
            >
              Go to Home
            </Link>
            <button
              onClick={onClose}
              className="px-5 py-2 text-sm border rounded-sm"
              style={{ borderColor: "#ccc", color: "#555" }}
            >
              Lodge Another
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────
const LodgeComplaint = () => {
  const [captcha, setCaptcha] = useState(generateCaptcha);
  const [captchaInput, setCaptchaInput] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [complaintDetails, setComplaintDetails] = useState("");
  const [referenceNo, setReferenceNo] = useState("");
  const [companyName, setCompanyName] = useState("");   // ← company_name
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successComplaintId, setSuccessComplaintId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(Array.from(e.target.files));
  };

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setCaptchaInput("");
  };

  const resetForm = () => {
    setCaptchaInput("");
    setComplaintDetails("");
    setReferenceNo("");
    setCompanyName("");
    setFullName("");
    setMobile("");
    setEmail("");
    setAddress("");
    setFiles([]);
    refreshCaptcha();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!complaintDetails.trim()) {
      toast({ title: "Error", description: "Please enter complaint details.", variant: "destructive" });
      return;
    }

    if (captchaInput !== captcha) {
      toast({ title: "Error", description: "Invalid captcha. Please try again.", variant: "destructive" });
      refreshCaptcha();
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { data: complaint, error } = await supabase
        .from("complaints")
        .insert({
          reference_no:      referenceNo.trim()      || null,
          company_name:      companyName             || null,  // ← company_name
          full_name:         fullName.trim()         || null,
          mobile:            mobile.trim()           || null,
          email:             email.trim()            || null,
          address:           address.trim()          || null,
          complaint_details: complaintDetails.trim(),
          user_id:           user?.id               || null,
        })
        .select("complaint_id")
        .single();

      if (error) throw error;

      // Upload documents if any
      for (const file of files) {
        const filePath = `${complaint.complaint_id}/${Date.now()}_${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("complaint-documents")
          .upload(filePath, file);
        if (uploadError) console.warn("File upload warning:", uploadError.message);
      }

      setSuccessComplaintId(complaint.complaint_id);
      resetForm();
    } catch (err: any) {
      toast({
        title: "Submission Failed",
        description: err.message || "Could not submit complaint. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="h-2" style={{ background: "linear-gradient(to bottom, #6b7b8b, #8b9bab)" }} />

      {successComplaintId && (
        <SuccessModal
          complaintId={successComplaintId}
          onClose={() => setSuccessComplaintId(null)}
        />
      )}

      <main className="flex-1 bg-background">
        <form onSubmit={handleSubmit}>
          <div className="flex justify-end px-6 py-2">
            <Link to="/" className="text-blue-600 hover:underline text-sm">Back</Link>
          </div>

          <div className="px-6 pb-8 max-w-6xl mx-auto">
            <div className="py-2 px-4 mb-4" style={{ backgroundColor: "#888" }}>
              <span className="text-white text-sm font-normal">Complaint Form</span>
            </div>

            {/* Contact Details */}
            <div className="mb-4">
              <h2 className="text-base font-normal mb-3" style={{ color: "#333" }}>
                Your Contact Details
              </h2>

              {/* reference_no */}
              <div className="mb-3">
                <label className="block text-xs mb-1" style={{ color: "#333" }}>
                  Reference No <span className="text-gray-500">(optional)</span> :
                </label>
                <input
                  type="text" placeholder="Enter Reference no" value={referenceNo}
                  onChange={(e) => setReferenceNo(e.target.value)}
                  className="w-full border px-2 py-1.5 text-xs"
                  style={{ borderColor: "#ccc", backgroundColor: "#fff" }}
                />
              </div>

              {/* company_name */}
              <div className="mb-3">
                <label className="block text-xs mb-1" style={{ color: "#333" }}>
                  Select Companies <span className="text-gray-500">(optional)</span>:
                </label>
                <select
                  value={companyName} onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full border px-2 py-1.5 text-xs appearance-none"
                  style={{ borderColor: "#ccc", backgroundColor: "#fff" }}
                >
                  <option value="">Select Companies</option>
                  <option value="Eastern Coalfields Limited">Eastern Coalfields Limited</option>
                  <option value="Bharat Coking Coal Limited">Bharat Coking Coal Limited</option>
                  <option value="Central Coalfields Limited">Central Coalfields Limited</option>
                  <option value="Northern Coalfields Limited">Northern Coalfields Limited</option>
                  <option value="Western Coalfields Limited">Western Coalfields Limited</option>
                  <option value="South Eastern Coalfields Limited">South Eastern Coalfields Limited</option>
                  <option value="Mahanadi Coalfields Limited">Mahanadi Coalfields Limited</option>
                  <option value="Coal India Limited (HQ)">Coal India Limited (HQ)</option>
                </select>
              </div>

              {/* full_name */}
              <div className="mb-3">
                <label className="block text-xs mb-1" style={{ color: "#333" }}>
                  Your Full Name <span className="text-gray-500">(optional)</span> :
                </label>
                <input
                  type="text" placeholder="Your Full Name" value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full border px-2 py-1.5 text-xs"
                  style={{ borderColor: "#ccc", backgroundColor: "#fff" }}
                />
              </div>

              {/* mobile */}
              <div className="mb-3">
                <label className="block text-xs mb-1" style={{ color: "#333" }}>
                  Mobile Number <span className="text-gray-500">(optional)</span> :
                </label>
                <input
                  type="text" placeholder="Enter Mobile" value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full border px-2 py-1.5 text-xs"
                  style={{ borderColor: "#ccc", backgroundColor: "#fff" }}
                />
              </div>

              {/* email */}
              <div className="mb-3">
                <label className="block text-xs mb-1" style={{ color: "#333" }}>
                  Email-Id <span className="text-gray-500">(optional)</span>:
                </label>
                <input
                  type="email" placeholder="Enter Email" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border px-2 py-1.5 text-xs"
                  style={{ borderColor: "#ccc", backgroundColor: "#fff" }}
                />
              </div>

              {/* address */}
              <div className="mb-3">
                <label className="block text-xs mb-1" style={{ color: "#333" }}>
                  Your Address <span className="text-gray-500">(optional)</span>:
                </label>
                <textarea
                  value={address} onChange={(e) => setAddress(e.target.value)}
                  className="w-full border px-2 py-1.5 text-xs resize-vertical"
                  style={{ borderColor: "#ccc", backgroundColor: "#fff", minHeight: "60px" }}
                  rows={3}
                />
              </div>
            </div>

            {/* complaint_details */}
            <div className="mb-4">
              <h2 className="text-base font-normal mb-3" style={{ color: "#333" }}>
                Detail of the incident or misconduct - Your Complaint
              </h2>
              <div className="mb-3">
                <label className="block text-xs mb-1" style={{ color: "#333" }}>
                  Complaint in Details:<span className="text-red-500">*</span>
                </label>
                <textarea
                  value={complaintDetails} onChange={(e) => setComplaintDetails(e.target.value)}
                  className="w-full border px-2 py-1.5 text-xs resize-vertical"
                  style={{ borderColor: "#ccc", backgroundColor: "#fff", minHeight: "80px" }}
                  rows={4} required
                />
              </div>
            </div>

            {/* File upload */}
            <div className="mb-4">
              <label className="block text-xs mb-2" style={{ color: "#333" }}>
                Document(Only image, doc, pdf) Total File Size 12MB:
              </label>
              <div className="border p-3" style={{ borderColor: "#ccc", backgroundColor: "#f8f8f8" }}>
                <div className="flex items-center gap-2">
                  <label className="px-2 py-1 text-xs cursor-pointer border" style={{ backgroundColor: "#ddd", borderColor: "#bbb" }}>
                    Choose Files
                    <input
                      type="file" multiple accept=".jpg,.jpeg,.png,.gif,.doc,.docx,.pdf"
                      className="hidden" onChange={handleFileChange}
                    />
                  </label>
                  <span className="px-3 py-1 text-xs text-white" style={{ backgroundColor: "#666" }}>
                    {files.length === 0 ? "No file chosen" : `${files.length} file(s) selected`}
                  </span>
                </div>
              </div>
            </div>

            {/* Captcha */}
            <div className="mb-4">
              <label className="block text-xs mb-1" style={{ color: "#333" }}>
                Captcha:<span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="px-2 py-1 text-lg font-bold italic select-none"
                  style={{
                    background: "linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 50%, #e0e0e0 100%)",
                    border: "1px solid #ccc",
                    letterSpacing: "3px",
                  }}
                >
                  {captcha}
                </div>
                <button type="button" onClick={refreshCaptcha} className="text-green-600 hover:text-green-700">
                  <RefreshCw size={14} />
                </button>
              </div>
              <input
                type="text" placeholder="Enter Captcha Code" value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                className="w-full border px-2 py-1.5 text-xs"
                style={{ borderColor: "#ccc", backgroundColor: "#fff" }}
                required
              />
            </div>

            {/* Submit */}
            <div>
              <button
                type="submit" disabled={isSubmitting}
                className="px-8 py-2 text-xs text-white disabled:opacity-50"
                style={{ backgroundColor: "#5a8a5a" }}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default LodgeComplaint;
