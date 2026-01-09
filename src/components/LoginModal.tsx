import { useState } from "react";
import { X, Lock, User, Eye } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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
            className="w-full py-2 text-sm flex items-center justify-center gap-2"
            style={{ backgroundColor: '#d0d0d0', color: '#333' }}
          >
            <span style={{ fontSize: '16px' }}>⏻</span>
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;