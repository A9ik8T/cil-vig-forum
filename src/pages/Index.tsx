import Header from "@/components/Header";
import SectionTitle from "@/components/SectionTitle";
import ComplaintGuidelines from "@/components/ComplaintGuidelines";
import ActionButtons from "@/components/ActionButtons";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <SectionTitle title="LODGING COMPLAINTS" />
        <ComplaintGuidelines />
        <ActionButtons />
        {/* Gray spacing area */}
        <div className="h-32" style={{ backgroundColor: '#d1d1d1' }} />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
