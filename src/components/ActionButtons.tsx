const ActionButtons = () => {
  return (
    <div className="py-6 flex flex-col items-center gap-8" style={{ backgroundColor: '#d1d1d1' }}>
      {/* Main action buttons */}
      <div className="flex gap-4 items-center justify-center">
        <button className="btn-lodge">
          Lodge Complaint
        </button>
        <button className="btn-status">
          Check Your Complaint Status
        </button>
      </div>
      
      {/* Login section */}
      <div className="flex items-center gap-1">
        <button className="btn-login">
          LOGIN
        </button>
        <span className="text-sm" style={{ color: '#333' }}>(for internal use)</span>
      </div>
    </div>
  );
};

export default ActionButtons;
