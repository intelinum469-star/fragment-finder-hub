import { PaintSplashes } from "@/components/PaintSplashes";
import { Header } from "@/components/Header";
import { EditModeBanner } from "@/components/EditModeBanner";
import { Hero } from "@/components/Hero";
import { AboutMe } from "@/components/AboutMe";
import { Formats } from "@/components/Formats";
import { Prices } from "@/components/Prices";
import { WhyMe } from "@/components/WhyMe";
import { Process } from "@/components/Process";
import { Portfolio } from "@/components/Portfolio";
import { EditablePortfolio } from "@/components/EditablePortfolio";
import { Contacts } from "@/components/Contacts";
import { Footer } from "@/components/Footer";
import { useEditMode } from "@/contexts/EditModeContext";

const Index = () => {
  const { isEditMode } = useEditMode();
  
  return (
    <div className="min-h-screen bg-[#EFFEED] relative overflow-x-hidden">
      <PaintSplashes />
      <div className="relative z-10">
        <Header />
        <EditModeBanner />
        <main className="pt-24 md:pt-28">
          <Hero />
          <AboutMe />
          <Formats />
          <Prices />
          <WhyMe />
          <Process />
          {isEditMode ? <EditablePortfolio /> : <Portfolio />}
          <Contacts />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Index;
