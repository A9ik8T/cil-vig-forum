// Complete Coal India Complaint Portal - Single File
// Copy this entire file to use all components together

import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Lock, RefreshCw, X } from "lucide-react";

// ============ CONFIGURATION ============
const API_BASE_URL = "https://your-ngrok-url.ngrok-free.app"; // Change this to your ngrok URL
const API_ENDPOINTS = {
  login: `${API_BASE_URL}/coal_india/api/login.php`,
  submitComplaint: `${API_BASE_URL}/coal_india/api/submit_complaint.php`,
};

// ============ HEADER COMPONENT ============
const Header = () => {
  return (
    <header className="bg-white py-3 px-5">
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 bg-blue-900 rounded-full flex items-center justify-center text-white font-bold text-xs">
          CIL
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-xs" style={{ color: '#333' }}>कोल इण्डिया लिमिटेड</span>
          <span className="text-base font-bold" style={{ color: '#333' }}>Coal India Limited</span>
          <span className="text-[10px]" style={{ color: '#333' }}>भारत सरकार का उपक्रम</span>
          <span className="text-[10px]" style={{ color: '#333' }}>A Government of India Undertaking</span>
          <div className="flex items-center gap-1">
            <span className="text-[10px]" style={{ color: '#333' }}>एक महारत्न कंपनी</span>
            <span className="text-[10px] font-semibold" style={{ color: '#333' }}>A Maharatna Company</span>
          </div>
        </div>
      </div>
    </header>
  );
};

// ============ FOOTER COMPONENT ============
const Footer = () => {
  return (
    <footer className="h-8 w-full mt-auto" style={{ backgroundColor: '#404040' }} />
  );
};

// ============ SECTION TITLE COMPONENT ============
const SectionTitle = ({ title }: { title: string }) => {
  return (
    <div className="bg-gray-200 py-2 px-4" style={{ borderBottom: '3px solid #b32d00' }}>
      <h1 className="text-sm font-normal" style={{ color: '#b32d00' }}>{title}</h1>
    </div>
  );
};

// ============ COMPLAINT GUIDELINES COMPONENT ============
const ComplaintGuidelines = () => {
  const guidelines = [
    "Complaint can be lodged only against employees belonging to the Coal India Limited, Kolkata and its subsidiaries.",
    "While complaints against tenders may be investigated, it could not interfere in the tender process.",
    "Complaints must be brief and contain factual details, verifiable facts and related matters. They should not be vague or contain sweeping general allegations.",
    "The complaint having vigilance angle shall only be examined. The vigilance angle comprises of misuse of official position, demand and acceptance of illegal gratification, cases of misappropriation / forgery or cheating, gross and willful negligence, blatant violation of laid down systems and procedures, reckless exercise of discretion, delay in processing the cases, etc.",
    "The complaint having other than vigilance angle will be either be filed or will be referred to the concerned department of CIL and it subsidiaries."
  ];

  return (
    <div className="p-4 px-6" style={{ backgroundColor: '#d1d1d1' }}>
      <p className="text-xs mb-4" style={{ color: '#333' }}>
        Complaints regarding irregularities in CIL and it subsidiaries corruption and bungling of money involvement of Employees of CIL and it subsidiaries
      </p>
      <ul className="list-disc list-outside ml-6 space-y-2">
        {guidelines.map((guideline, index) => (
          <li key={index} className="text-xs leading-relaxed" style={{ color: '#333' }}>
            {guideline}
          </li>
        ))}
      </ul>
    </div>
  );
};

// ============ LOGIN MODAL COMPONENT ============
const LoginModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast({ title: "Error", description: "Please enter username and password", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.login, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (data.success) {
        toast({ title: "Success", description: "Login successful!" });
        localStorage.setItem("user", JSON.stringify(data.user));
        onClose();
      } else {
        toast({ title: "Error", description: data.message || "Invalid credentials", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Connection failed. Check your server.", variant: "destructive" });
    }
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b" style={{ backgroundColor: '#404040' }}>
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-white" />
            <span className="text-white font-medium">Login</span>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-300">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleLogin} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

// ============ ACTION BUTTONS COMPONENT ============
const ActionButtons = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <>
      <div className="py-6 flex flex-col items-center gap-8" style={{ backgroundColor: '#d1d1d1' }}>
        <div className="flex gap-4 items-center justify-center">
          <Link 
            to="/lodge-complaint" 
            className="px-6 py-2 text-white font-medium rounded"
            style={{ backgroundColor: '#b32d00' }}
          >
            Lodge Complaint
          </Link>
          <button 
            className="px-6 py-2 text-white font-medium rounded"
            style={{ backgroundColor: '#404040' }}
          >
            Check Your Complaint Status
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button 
            className="px-4 py-1 text-white text-sm rounded"
            style={{ backgroundColor: '#666' }}
            onClick={() => setIsLoginOpen(true)}
          >
            LOGIN
          </button>
          <span className="text-sm" style={{ color: '#333' }}>(for internal use)</span>
        </div>
      </div>
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
};

// ============ LODGE COMPLAINT PAGE ============
const LodgeComplaint = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captcha, setCaptcha] = useState(() => Math.random().toString(36).substring(2, 8).toUpperCase());
  const [captchaInput, setCaptchaInput] = useState("");
  const [formData, setFormData] = useState({
    referenceNo: "",
    company: "",
    fullName: "",
    mobile: "",
    email: "",
    address: "",
    complaintDetails: "",
  });
  const [files, setFiles] = useState<FileList | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const refreshCaptcha = () => {
    setCaptcha(Math.random().toString(36).substring(2, 8).toUpperCase());
    setCaptchaInput("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (captchaInput.toUpperCase() !== captcha) {
      toast({ title: "Error", description: "Invalid CAPTCHA", variant: "destructive" });
      return;
    }
    if (!formData.fullName || !formData.complaintDetails) {
      toast({ title: "Error", description: "Please fill required fields", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(API_ENDPOINTS.submitComplaint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: formData.fullName,
          complaint_details: formData.complaintDetails,
          email: formData.email,
          mobile: formData.mobile,
          address: formData.address,
          company: formData.company,
        }),
      });
      const data = await response.json();
      if (data.success) {
        toast({ title: "Success", description: `Complaint submitted! Reference: ${data.reference_no}` });
        setFormData({ referenceNo: "", company: "", fullName: "", mobile: "", email: "", address: "", complaintDetails: "" });
        refreshCaptcha();
      } else {
        toast({ title: "Error", description: data.message || "Submission failed", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Connection failed. Check your server.", variant: "destructive" });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <SectionTitle title="LODGE YOUR COMPLAINT" />
      <main className="flex-1 p-6" style={{ backgroundColor: '#d1d1d1' }}>
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1">Reference No (if any)</label>
              <input name="referenceNo" value={formData.referenceNo} onChange={handleInputChange} className="w-full px-3 py-2 border rounded text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Company</label>
              <select name="company" value={formData.company} onChange={handleInputChange} className="w-full px-3 py-2 border rounded text-sm">
                <option value="">Select Company</option>
                <option value="CIL">Coal India Limited</option>
                <option value="ECL">Eastern Coalfields Limited</option>
                <option value="BCCL">Bharat Coking Coal Limited</option>
                <option value="CCL">Central Coalfields Limited</option>
                <option value="NCL">Northern Coalfields Limited</option>
                <option value="WCL">Western Coalfields Limited</option>
                <option value="SECL">South Eastern Coalfields Limited</option>
                <option value="MCL">Mahanadi Coalfields Limited</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Full Name *</label>
            <input name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full px-3 py-2 border rounded text-sm" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1">Mobile</label>
              <input name="mobile" value={formData.mobile} onChange={handleInputChange} className="w-full px-3 py-2 border rounded text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Email</label>
              <input name="email" type="email" value={formData.email} onChange={handleInputChange} className="w-full px-3 py-2 border rounded text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Address</label>
            <input name="address" value={formData.address} onChange={handleInputChange} className="w-full px-3 py-2 border rounded text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Complaint Details *</label>
            <textarea name="complaintDetails" value={formData.complaintDetails} onChange={handleInputChange} rows={5} className="w-full px-3 py-2 border rounded text-sm" required />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Upload Documents</label>
            <input type="file" onChange={(e) => setFiles(e.target.files)} multiple accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" className="w-full text-sm" />
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-gray-800 text-white px-4 py-2 font-mono tracking-widest select-none">{captcha}</div>
            <button type="button" onClick={refreshCaptcha} className="p-2 hover:bg-gray-300 rounded">
              <RefreshCw className="w-5 h-5" />
            </button>
            <input
              placeholder="Enter CAPTCHA"
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value)}
              className="px-3 py-2 border rounded text-sm"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 text-white font-medium rounded disabled:opacity-50"
            style={{ backgroundColor: '#b32d00' }}
          >
            {isSubmitting ? "Submitting..." : "Submit Complaint"}
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
};

// ============ HOME PAGE ============
const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <SectionTitle title="LODGING COMPLAINTS" />
        <ComplaintGuidelines />
        <ActionButtons />
        <div className="h-32" style={{ backgroundColor: '#d1d1d1' }} />
      </main>
      <Footer />
    </div>
  );
};

// ============ NOT FOUND PAGE ============
const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="mb-4">Page not found</p>
      <Link to="/" className="text-blue-600 hover:underline">Go Home</Link>
    </div>
  </div>
);

// ============ MAIN APP ============
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/lodge-complaint" element={<LodgeComplaint />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
