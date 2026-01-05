import { useState } from "react";
import { Link } from "react-router-dom";
import LoginModal from "./LoginModal";

const ActionButtons = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <>
      <div className="py-6 flex flex-col items-center gap-8" style={{ backgroundColor: '#d1d1d1' }}>
        {/* Main action buttons */}
        <div className="flex gap-4 items-center justify-center">
          <Link to="/lodge-complaint" className="btn-lodge">
            Lodge Complaint
          </Link>
          <button className="btn-status">
            Check Your Complaint Status
          </button>
        </div>
        
        {/* Login section */}
        <div className="flex items-center gap-1">
          <button 
            className="btn-login"
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

export default ActionButtons;