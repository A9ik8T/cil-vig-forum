import { useState } from "react";
import { Link } from "react-router-dom";
import { RefreshCw, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { API_ENDPOINTS, apiCall } from "@/config/api";

const generateCaptcha = () => Math.floor(1000 + Math.random() * 9000).toString();

const LodgeComplaint = () => {
  const [captcha, setCaptcha] = useState(generateCaptcha);
  const [captchaInput, setCaptchaInput] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [complaintDetails, setComplaintDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    referenceNo: "",
    company: "",
    fullName: "",
    mobile: "",
    email: "",
    address: "",
  });
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

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
      toast({
        title: "Error",
        description: "Please enter complaint details.",
        variant: "destructive",
      });
      return;
    }
    
    if (captchaInput !== captcha) {
      toast({
        title: "Error",
        description: "Invalid captcha code. Please try again.",
        variant: "destructive",
      });
      refreshCaptcha();
      return;
    }

    setIsSubmitting(true);

    try {
      const complaintData = {
        ...formData,
        complaintDetails,
        filesCount: files.length,
      };

      const response = await apiCall(API_ENDPOINTS.submitComplaint, {
        method: 'POST',
        body: JSON.stringify(complaintData),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: `Your complaint has been submitted! Reference: ${data.referenceId || 'N/A'}`,
        });
        
        // Reset form
        setCaptchaInput("");
        setComplaintDetails("");
        setFiles([]);
        setFormData({
          referenceNo: "",
          company: "",
          fullName: "",
          mobile: "",
          email: "",
          address: "",
        });
        refreshCaptcha();
      } else {
        toast({
          title: "Submission Failed",
          description: data.message || "Failed to submit complaint. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to connect to server. Please try again.",
        variant: "destructive",
      });
      console.error("Complaint submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      {/* Blue/Gray gradient bar */}
      <div className="h-2" style={{ background: 'linear-gradient(to bottom, #6b7b8b, #8b9bab)' }} />
      
      <main className="flex-1 bg-background">
        <form onSubmit={handleSubmit}>
          {/* Back link */}
          <div className="flex justify-end px-6 py-2">
            <Link to="/" className="text-blue-600 hover:underline text-sm">Back</Link>
          </div>

          {/* Form container */}
          <div className="px-6 pb-8 max-w-6xl mx-auto">
            {/* Complaint Form header */}
            <div className="py-2 px-4 mb-4" style={{ backgroundColor: '#888' }}>
              <span className="text-white text-sm font-normal">Complaint Form</span>
            </div>

            {/* Your Contact Details section */}
            <div className="mb-4">
              <h2 className="text-base font-normal mb-3" style={{ color: '#333' }}>Your Contact Details</h2>
              
              {/* Reference No */}
              <div className="mb-3">
                <label className="block text-xs mb-1" style={{ color: '#333' }}>
                  Reference No <span className="text-gray-500">(optional)</span> :
                </label>
                <input 
                  type="text"
                  name="referenceNo"
                  value={formData.referenceNo}
                  onChange={handleInputChange}
                  placeholder="Enter Reference no"
                  className="w-full border px-2 py-1.5 text-xs"
                  style={{ borderColor: '#ccc', backgroundColor: '#fff' }}
                />
              </div>

              {/* Select Companies */}
              <div className="mb-3">
                <label className="block text-xs mb-1" style={{ color: '#333' }}>
                  Select Companies <span className="text-gray-500">(optional)</span>:
                </label>
                <select
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full border px-2 py-1.5 text-xs appearance-none"
                  style={{ borderColor: '#ccc', backgroundColor: '#fff' }}
                >
                  <option value="">Select Companies</option>
                  <option value="ecl">Eastern Coalfields Limited</option>
                  <option value="bccl">Bharat Coking Coal Limited</option>
                  <option value="ccl">Central Coalfields Limited</option>
                  <option value="ncl">Northern Coalfields Limited</option>
                  <option value="wcl">Western Coalfields Limited</option>
                  <option value="secl">South Eastern Coalfields Limited</option>
                  <option value="mcl">Mahanadi Coalfields Limited</option>
                  <option value="cil">Coal India Limited (HQ)</option>
                </select>
              </div>

              {/* Your Full Name */}
              <div className="mb-3">
                <label className="block text-xs mb-1" style={{ color: '#333' }}>
                  Your Full Name <span className="text-gray-500">(optional)</span> :
                </label>
                <input 
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Your Full Name"
                  className="w-full border px-2 py-1.5 text-xs"
                  style={{ borderColor: '#ccc', backgroundColor: '#fff' }}
                />
              </div>

              {/* Mobile Number */}
              <div className="mb-3">
                <label className="block text-xs mb-1" style={{ color: '#333' }}>
                  Mobile Number <span className="text-gray-500">(optional)</span> :
                </label>
                <input 
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  placeholder="Enter Mobile"
                  className="w-full border px-2 py-1.5 text-xs"
                  style={{ borderColor: '#ccc', backgroundColor: '#fff' }}
                />
              </div>

              {/* Email-Id */}
              <div className="mb-3">
                <label className="block text-xs mb-1" style={{ color: '#333' }}>
                  Email-Id <span className="text-gray-500">(optional)</span>:
                </label>
                <input 
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter Email"
                  className="w-full border px-2 py-1.5 text-xs"
                  style={{ borderColor: '#ccc', backgroundColor: '#fff' }}
                />
              </div>

              {/* Your Address */}
              <div className="mb-3">
                <label className="block text-xs mb-1" style={{ color: '#333' }}>
                  Your Address <span className="text-gray-500">(optional)</span>:
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full border px-2 py-1.5 text-xs resize-vertical"
                  style={{ borderColor: '#ccc', backgroundColor: '#fff', minHeight: '60px' }}
                  rows={3}
                />
              </div>
            </div>

            {/* Detail of the incident section */}
            <div className="mb-4">
              <h2 className="text-base font-normal mb-3" style={{ color: '#333' }}>
                Detail of the incident or misconduct - Your Complaint
              </h2>
              
              {/* Complaint in Details */}
              <div className="mb-3">
                <label className="block text-xs mb-1" style={{ color: '#333' }}>
                  Complaint in Details:<span className="text-red-500">*</span>
                </label>
                <textarea 
                  value={complaintDetails}
                  onChange={(e) => setComplaintDetails(e.target.value)}
                  className="w-full border px-2 py-1.5 text-xs resize-vertical"
                  style={{ borderColor: '#ccc', backgroundColor: '#fff', minHeight: '80px' }}
                  rows={4}
                  required
                />
              </div>
            </div>

            {/* Document upload section */}
            <div className="mb-4">
              <label className="block text-xs mb-2" style={{ color: '#333' }}>
                Document(Only image, doc, pdf) Total File Size 12MB:
              </label>
              <div className="border p-3" style={{ borderColor: '#ccc', backgroundColor: '#f8f8f8' }}>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    <label 
                      className="px-2 py-1 text-xs cursor-pointer border"
                      style={{ backgroundColor: '#ddd', borderColor: '#bbb' }}
                    >
                      Choose Files
                      <input 
                        type="file" 
                        multiple 
                        accept=".jpg,.jpeg,.png,.gif,.doc,.docx,.pdf"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                    <span 
                      className="px-3 py-1 text-xs text-white"
                      style={{ backgroundColor: '#666' }}
                    >
                      Select files...
                      {files.length === 0 && " No file chosen"}
                    </span>
                  </div>
                  <span className="text-xs" style={{ color: '#333' }}>
                    Files uploaded: {files.map(f => f.name).join(', ')}
                  </span>
                </div>
              </div>
            </div>

            {/* Captcha section */}
            <div className="mb-4">
              <label className="block text-xs mb-1" style={{ color: '#333' }}>
                Captcha:<span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2 mb-2">
                <div 
                  className="px-2 py-1 text-lg font-bold italic"
                  style={{ 
                    background: 'linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 50%, #e0e0e0 100%)',
                    border: '1px solid #ccc',
                    letterSpacing: '3px'
                  }}
                >
                  {captcha}
                </div>
                <button 
                  type="button" 
                  onClick={refreshCaptcha}
                  className="text-green-600 hover:text-green-700"
                >
                  <RefreshCw size={14} />
                </button>
              </div>
              <input 
                type="text" 
                placeholder="Enter Captcha Code"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                className="w-full border px-2 py-1.5 text-xs"
                style={{ borderColor: '#ccc', backgroundColor: '#fff' }}
                required
              />
            </div>

            {/* Submit button */}
            <div>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-2 text-xs text-white flex items-center gap-2 disabled:opacity-50"
                style={{ backgroundColor: '#5a8a5a' }}
              >
                {isSubmitting && <Loader2 className="animate-spin" size={14} />}
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