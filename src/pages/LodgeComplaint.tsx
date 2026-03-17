import { useState } from "react";
import { Link } from "react-router-dom";
import { RefreshCw } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const generateCaptcha = () => Math.floor(1000 + Math.random() * 9000).toString();

const LodgeComplaint = () => {
  const [captcha, setCaptcha] = useState(generateCaptcha);
  const [captchaInput, setCaptchaInput] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [complaintDetails, setComplaintDetails] = useState("");
  const [referenceNo, setReferenceNo] = useState("");
  const [company, setCompany] = useState("");
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setCaptchaInput("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!complaintDetails.trim()) {
      toast({ title: "Error", description: "Please enter complaint details.", variant: "destructive" });
      return;
    }
    
    if (captchaInput !== captcha) {
      toast({ title: "Error", description: "Invalid captcha code. Please try again.", variant: "destructive" });
      refreshCaptcha();
      return;
    }

    setIsSubmitting(true);

    try {
      // Insert complaint
      const { data: complaint, error } = await supabase
        .from("complaints")
        .insert({
          reference_no: referenceNo || null,
          company: company || null,
          full_name: fullName || null,
          mobile: mobile || null,
          email: email || null,
          address: address || null,
          complaint_details: complaintDetails,
        })
        .select("complaint_id")
        .single();

      if (error) throw error;

      // Upload files if any
      for (const file of files) {
        const filePath = `${complaint.complaint_id}/${file.name}`;
        await supabase.storage.from("complaint-documents").upload(filePath, file);
      }

      toast({
        title: "Complaint Submitted!",
        description: `Your Complaint ID is: ${complaint.complaint_id}. Please save this for tracking.`,
      });

      // Reset form
      setCaptchaInput("");
      setComplaintDetails("");
      setReferenceNo("");
      setCompany("");
      setFullName("");
      setMobile("");
      setEmail("");
      setAddress("");
      setFiles([]);
      refreshCaptcha();
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to submit complaint.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="h-2" style={{ background: 'linear-gradient(to bottom, #6b7b8b, #8b9bab)' }} />
      
      <main className="flex-1 bg-background">
        <form onSubmit={handleSubmit}>
          <div className="flex justify-end px-6 py-2">
            <Link to="/" className="text-blue-600 hover:underline text-sm">Back</Link>
          </div>

          <div className="px-6 pb-8 max-w-6xl mx-auto">
            <div className="py-2 px-4 mb-4" style={{ backgroundColor: '#888' }}>
              <span className="text-white text-sm font-normal">Complaint Form</span>
            </div>

            <div className="mb-4">
              <h2 className="text-base font-normal mb-3" style={{ color: '#333' }}>Your Contact Details</h2>
              
              <div className="mb-3">
                <label className="block text-xs mb-1" style={{ color: '#333' }}>
                  Reference No <span className="text-gray-500">(optional)</span> :
                </label>
                <input type="text" placeholder="Enter Reference no" value={referenceNo}
                  onChange={(e) => setReferenceNo(e.target.value)}
                  className="w-full border px-2 py-1.5 text-xs" style={{ borderColor: '#ccc', backgroundColor: '#fff' }} />
              </div>

              <div className="mb-3">
                <label className="block text-xs mb-1" style={{ color: '#333' }}>
                  Select Companies <span className="text-gray-500">(optional)</span>:
                </label>
                <select value={company} onChange={(e) => setCompany(e.target.value)}
                  className="w-full border px-2 py-1.5 text-xs appearance-none" style={{ borderColor: '#ccc', backgroundColor: '#fff' }}>
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

              <div className="mb-3">
                <label className="block text-xs mb-1" style={{ color: '#333' }}>
                  Your Full Name <span className="text-gray-500">(optional)</span> :
                </label>
                <input type="text" placeholder="Your Full Name" value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full border px-2 py-1.5 text-xs" style={{ borderColor: '#ccc', backgroundColor: '#fff' }} />
              </div>

              <div className="mb-3">
                <label className="block text-xs mb-1" style={{ color: '#333' }}>
                  Mobile Number <span className="text-gray-500">(optional)</span> :
                </label>
                <input type="text" placeholder="Enter Mobile" value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full border px-2 py-1.5 text-xs" style={{ borderColor: '#ccc', backgroundColor: '#fff' }} />
              </div>

              <div className="mb-3">
                <label className="block text-xs mb-1" style={{ color: '#333' }}>
                  Email-Id <span className="text-gray-500">(optional)</span>:
                </label>
                <input type="email" placeholder="Enter Email" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border px-2 py-1.5 text-xs" style={{ borderColor: '#ccc', backgroundColor: '#fff' }} />
              </div>

              <div className="mb-3">
                <label className="block text-xs mb-1" style={{ color: '#333' }}>
                  Your Address <span className="text-gray-500">(optional)</span>:
                </label>
                <textarea value={address} onChange={(e) => setAddress(e.target.value)}
                  className="w-full border px-2 py-1.5 text-xs resize-vertical"
                  style={{ borderColor: '#ccc', backgroundColor: '#fff', minHeight: '60px' }} rows={3} />
              </div>
            </div>

            <div className="mb-4">
              <h2 className="text-base font-normal mb-3" style={{ color: '#333' }}>
                Detail of the incident or misconduct - Your Complaint
              </h2>
              <div className="mb-3">
                <label className="block text-xs mb-1" style={{ color: '#333' }}>
                  Complaint in Details:<span className="text-red-500">*</span>
                </label>
                <textarea value={complaintDetails} onChange={(e) => setComplaintDetails(e.target.value)}
                  className="w-full border px-2 py-1.5 text-xs resize-vertical"
                  style={{ borderColor: '#ccc', backgroundColor: '#fff', minHeight: '80px' }} rows={4} required />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs mb-2" style={{ color: '#333' }}>
                Document(Only image, doc, pdf) Total File Size 12MB:
              </label>
              <div className="border p-3" style={{ borderColor: '#ccc', backgroundColor: '#f8f8f8' }}>
                <div className="flex items-center gap-2">
                  <label className="px-2 py-1 text-xs cursor-pointer border" style={{ backgroundColor: '#ddd', borderColor: '#bbb' }}>
                    Choose Files
                    <input type="file" multiple accept=".jpg,.jpeg,.png,.gif,.doc,.docx,.pdf"
                      className="hidden" onChange={handleFileChange} />
                  </label>
                  <span className="px-3 py-1 text-xs text-white" style={{ backgroundColor: '#666' }}>
                    {files.length === 0 ? "No file chosen" : `${files.length} file(s) selected`}
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs mb-1" style={{ color: '#333' }}>
                Captcha:<span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2 mb-2">
                <div className="px-2 py-1 text-lg font-bold italic"
                  style={{ background: 'linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 50%, #e0e0e0 100%)', border: '1px solid #ccc', letterSpacing: '3px' }}>
                  {captcha}
                </div>
                <button type="button" onClick={refreshCaptcha} className="text-green-600 hover:text-green-700">
                  <RefreshCw size={14} />
                </button>
              </div>
              <input type="text" placeholder="Enter Captcha Code" value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                className="w-full border px-2 py-1.5 text-xs" style={{ borderColor: '#ccc', backgroundColor: '#fff' }} required />
            </div>

            <div>
              <button type="submit" disabled={isSubmitting}
                className="px-8 py-2 text-xs text-white disabled:opacity-50"
                style={{ backgroundColor: '#5a8a5a' }}>
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
