import { useState } from "react";
import { X, Lock, User, Eye, Loader2 } from "lucide-react";
import { API_ENDPOINTS, apiCall } from "@/config/api";
import { useToast } from "@/hooks/use-toast";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      toast({
        title: "Error",
        description: "Please enter both username and password.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await apiCall(API_ENDPOINTS.login, {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Success",
          description: "Login successful!",
        });
        // Store user session if needed
        localStorage.setItem('user', JSON.stringify(data.user));
        onClose();
        setUsername("");
        setPassword("");
      } else {
        toast({
          title: "Login Failed",
          description: data.message || "Invalid username or password.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to connect to server. Please try again.",
        variant: "destructive",
      });
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-8"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <div 
        className="relative w-full max-w-lg shadow-lg"
        style={{ backgroundColor: '#fff' }}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-center gap-2 py-4"
          style={{ 
            background: 'linear-gradient(to bottom, #a04040, #803030)'
          }}
        >
          <Lock className="text-white" size={20} />
          <span className="text-white text-xl font-normal">Login</span>
        </div>

        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-300 hover:text-white"
        >
          <X size={20} />
        </button>

        {/* Form content */}
        <div className="p-6">
          {/* Username field */}
          <div className="mb-4">
            <label className="flex items-center gap-1 text-sm mb-2" style={{ color: '#333' }}>
              <User size={14} className="text-gray-600" />
              Username
            </label>
            <input 
              type="text"
              placeholder="Enter User Id"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border px-3 py-2 text-sm"
              style={{ borderColor: '#ddd', backgroundColor: '#fff' }}
            />
          </div>

          {/* Password field */}
          <div className="mb-6">
            <label className="flex items-center gap-1 text-sm mb-2" style={{ color: '#333' }}>
              <Eye size={14} className="text-gray-600" />
              Password
            </label>
            <input 
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border px-3 py-2 text-sm"
              style={{ borderColor: '#ddd', backgroundColor: '#fff' }}
            />
          </div>

          {/* Login button */}
          <button 
            type="submit"
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full py-2 text-sm flex items-center justify-center gap-2 disabled:opacity-50"
            style={{ backgroundColor: '#d0d0d0', color: '#333' }}
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <span style={{ fontSize: '16px' }}>⏻</span>
            )}
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;