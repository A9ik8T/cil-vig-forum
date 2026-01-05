import coalIndiaLogo from "@/assets/coal-india-logo.svg";

const Header = () => {
  return (
    <header className="bg-background py-3 px-5">
      <div className="flex items-center gap-3">
        <img 
          src={coalIndiaLogo} 
          alt="Coal India Limited Logo" 
          className="w-14 h-14"
        />
        <div className="flex flex-col leading-tight">
          <span className="font-hindi text-xs" style={{ color: '#333' }}>कोल इण्डिया लिमिटेड</span>
          <span className="text-base font-bold" style={{ color: '#333' }}>Coal India Limited</span>
          <span className="font-hindi text-[10px]" style={{ color: '#333' }}>भारत सरकार का उपक्रम</span>
          <span className="text-[10px]" style={{ color: '#333' }}>A Government of India Undertaking</span>
          <div className="flex items-center gap-1">
            <span className="font-hindi text-[10px]" style={{ color: '#333' }}>एक महारत्न कंपनी</span>
            <span className="text-[10px] font-semibold" style={{ color: '#333' }}>A Maharatna Company</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
