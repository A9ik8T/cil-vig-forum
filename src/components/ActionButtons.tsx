import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserCheck } from "lucide-react";
import LoginModal from "./LoginModal";
import StatusCheckModal from "./StatusCheckModal";
import { supabase } from "@/integrations/supabase/client";

const ActionButtons = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);

  // Listen to auth state changes across the app
  useEffect(() => {
    // Check on mount
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setLoggedInUser(user.user_metadata?.full_name || user.email || "User");
      }
    });

    // Listen for login/logout events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setLoggedInUser(
          session.user.user_metadata?.full_name || session.user.email || "User"
        );
      } else {
        setLoggedInUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
      <div
        className="py-6 flex flex-col items-center gap-6"
        style={{ backgroundColor: "#d1d1d1" }}
      >
        {/* Main action buttons */}
        <div className="flex gap-4 items-center justify-center flex-wrap">
          <Link to="/lodge-complaint" className="btn-lodge">
            Lodge Complaint
          </Link>
          <button className="btn-status" onClick={() => setIsStatusOpen(true)}>
            Check Your Complaint Status
          </button>
        </div>

        {/* Login section */}
        <div className="flex items-center gap-2">
          {loggedInUser ? (
            // Show who is logged in — clicking opens the modal to log out
            <button
              className="flex items-center gap-1.5 px-3 py-1 text-sm border"
              style={{
                borderColor: "#4caf50",
                color: "#1b5e20",
                backgroundColor: "#f0fdf4",
              }}
              onClick={() => setIsLoginOpen(true)}
              title="Click to manage your session"
            >
              <UserCheck size={14} />
              {loggedInUser}
            </button>
          ) : (
            <button
              className="btn-login"
              onClick={() => setIsLoginOpen(true)}
            >
              LOGIN
            </button>
          )}
          <span className="text-sm" style={{ color: "#333" }}>
            (for internal use)
          </span>
        </div>
      </div>

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />
      <StatusCheckModal
        isOpen={isStatusOpen}
        onClose={() => setIsStatusOpen(false)}
      />
    </>
  );
};

export default ActionButtons;
