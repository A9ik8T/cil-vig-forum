import { useState } from "react";
import { X, Lock, User, Eye, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast({ title: "Error", description: "Please enter both email and password.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: password.trim() });
      if (error) throw error;
      toast({ title: "Success", description: "Logged in successfully!" });
      onClose();
    } catch (err: any) {
      toast({ title: "Login Failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim() || !fullName.trim()) {
      toast({ title: "Error", description: "Please fill all fields.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
        options: { data: { full_name: fullName.trim() } },
      });
      if (error) throw error;
      toast({ title: "Success", description: "Account created! Please check your email to verify." });
      setIsSignUp(false);
    } catch (err: any) {
      toast({ title: "Sign Up Failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-8"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="relative w-full max-w-lg shadow-lg" style={{ backgroundColor: '#fff' }}>
        <div className="flex items-center justify-center gap-2 py-4"
          style={{ background: 'linear-gradient(to bottom, #a04040, #803030)' }}>
          <Lock className="text-white" size={20} />
          <span className="text-white text-xl font-normal">{isSignUp ? "Sign Up" : "Login"}</span>
        </div>

        <button onClick={onClose} className="absolute top-3 right-3 text-gray-300 hover:text-white">
          <X size={20} />
        </button>

        <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="p-6">
          {isSignUp && (
            <div className="mb-4">
              <label className="flex items-center gap-1 text-sm mb-2" style={{ color: '#333' }}>
                <User size={14} className="text-gray-600" /> Full Name
              </label>
              <input type="text" placeholder="Enter Full Name" value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border px-3 py-2 text-sm" style={{ borderColor: '#ddd', backgroundColor: '#fff' }} />
            </div>
          )}

          <div className="mb-4">
            <label className="flex items-center gap-1 text-sm mb-2" style={{ color: '#333' }}>
              <Mail size={14} className="text-gray-600" /> Email
            </label>
            <input type="email" placeholder="Enter Email" value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border px-3 py-2 text-sm" style={{ borderColor: '#ddd', backgroundColor: '#fff' }} />
          </div>

          <div className="mb-6">
            <label className="flex items-center gap-1 text-sm mb-2" style={{ color: '#333' }}>
              <Eye size={14} className="text-gray-600" /> Password
            </label>
            <input type="password" placeholder="Enter Password" value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border px-3 py-2 text-sm" style={{ borderColor: '#ddd', backgroundColor: '#fff' }} />
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-2 text-sm flex items-center justify-center gap-2 disabled:opacity-50"
            style={{ backgroundColor: '#d0d0d0', color: '#333' }}>
            {loading ? "Please wait..." : isSignUp ? "Sign Up" : "Login"}
          </button>

          <p className="text-center text-xs mt-4" style={{ color: '#666' }}>
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button type="button" onClick={() => setIsSignUp(!isSignUp)}
              className="text-blue-600 hover:underline">
              {isSignUp ? "Login" : "Sign Up"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
