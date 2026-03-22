import { useState, useEffect } from "react";
import { X, Lock, User, Eye, Mail, LogOut, CheckCircle } from "lucide-react";
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
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { toast } = useToast();

  // Check if someone is already logged in when modal opens
  useEffect(() => {
    if (!isOpen) return;
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUser(user);
    });
  }, [isOpen]);

  if (!isOpen) return null;

  const resetFields = () => {
    setEmail("");
    setPassword("");
    setFullName("");
  };

  // ── Already logged in: show user info + logout ──────────────
  if (currentUser) {
    const displayName =
      currentUser.user_metadata?.full_name || currentUser.email;

    const handleLogout = async () => {
      setLoading(true);
      await supabase.auth.signOut();
      setCurrentUser(null);
      toast({ title: "Logged out", description: "You have been signed out." });
      onClose();
      setLoading(false);
    };

    return (
      <div
        className="fixed inset-0 z-50 flex items-start justify-center pt-8"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-lg shadow-lg"
          style={{ backgroundColor: "#fff" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="flex items-center justify-center gap-2 py-4"
            style={{ background: "linear-gradient(to bottom, #a04040, #803030)" }}
          >
            <Lock className="text-white" size={20} />
            <span className="text-white text-xl font-normal">Internal Login</span>
          </div>

          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-300 hover:text-white"
          >
            <X size={20} />
          </button>

          <div className="p-8 text-center">
            <CheckCircle size={48} className="mx-auto mb-3" style={{ color: "#4caf50" }} />
            <p className="text-sm font-semibold mb-1" style={{ color: "#333" }}>
              Signed in as
            </p>
            <p className="text-base font-bold mb-1" style={{ color: "#a04040" }}>
              {displayName}
            </p>
            <p className="text-xs mb-6" style={{ color: "#888" }}>
              {currentUser.email}
            </p>

            <button
              onClick={handleLogout}
              disabled={loading}
              className="flex items-center gap-2 mx-auto px-6 py-2 text-sm text-white disabled:opacity-50"
              style={{ backgroundColor: "#a04040" }}
            >
              <LogOut size={14} />
              {loading ? "Signing out..." : "Sign Out"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Login form ──────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast({
        title: "Error",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        // Give friendly messages
        if (error.message.includes("Invalid login credentials")) {
          throw new Error(
            "Account not found or wrong password. Please check your details or Sign Up first."
          );
        }
        throw error;
      }

      const { data: { user } } = await supabase.auth.getUser();
      toast({
        title: "Login Successful!",
        description: `Welcome back, ${user?.user_metadata?.full_name || user?.email}`,
      });
      resetFields();
      onClose();
    } catch (err: any) {
      toast({ title: "Login Failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // ── Sign Up form ────────────────────────────────────────────
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim() || !fullName.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters.",
        variant: "destructive",
      });
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

      toast({
        title: "Account Created!",
        description:
          "Please check your email to verify your account, then log in.",
      });
      resetFields();
      setIsSignUp(false); // Switch to login view
    } catch (err: any) {
      toast({
        title: "Sign Up Failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-8"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg shadow-lg"
        style={{ backgroundColor: "#fff" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-center gap-2 py-4"
          style={{ background: "linear-gradient(to bottom, #a04040, #803030)" }}
        >
          <Lock className="text-white" size={20} />
          <span className="text-white text-xl font-normal">
            {isSignUp ? "Sign Up" : "Login"}
          </span>
        </div>

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-300 hover:text-white"
        >
          <X size={20} />
        </button>

        <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="p-6">
          {/* Full Name (Sign Up only) */}
          {isSignUp && (
            <div className="mb-4">
              <label
                className="flex items-center gap-1 text-sm mb-2"
                style={{ color: "#333" }}
              >
                <User size={14} className="text-gray-600" /> Full Name
              </label>
              <input
                type="text" placeholder="Enter Full Name" value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border px-3 py-2 text-sm"
                style={{ borderColor: "#ddd", backgroundColor: "#fff" }}
              />
            </div>
          )}

          {/* Email */}
          <div className="mb-4">
            <label
              className="flex items-center gap-1 text-sm mb-2"
              style={{ color: "#333" }}
            >
              <Mail size={14} className="text-gray-600" /> Email
            </label>
            <input
              type="email" placeholder="Enter Email" value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border px-3 py-2 text-sm"
              style={{ borderColor: "#ddd", backgroundColor: "#fff" }}
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label
              className="flex items-center gap-1 text-sm mb-2"
              style={{ color: "#333" }}
            >
              <Eye size={14} className="text-gray-600" /> Password
            </label>
            <input
              type="password" placeholder="Enter Password" value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border px-3 py-2 text-sm"
              style={{ borderColor: "#ddd", backgroundColor: "#fff" }}
            />
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full py-2 text-sm flex items-center justify-center gap-2 disabled:opacity-50"
            style={{ backgroundColor: "#d0d0d0", color: "#333" }}
          >
            {loading ? "Please wait..." : isSignUp ? "Sign Up" : "Login"}
          </button>

          <p className="text-center text-xs mt-4" style={{ color: "#666" }}>
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                resetFields();
              }}
              className="text-blue-600 hover:underline"
            >
              {isSignUp ? "Login" : "Sign Up"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
