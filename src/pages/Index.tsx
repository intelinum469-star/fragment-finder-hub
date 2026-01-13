import { PaintSplashes } from "@/components/PaintSplashes";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { AboutMe } from "@/components/AboutMe";
import { Formats } from "@/components/Formats";
import { Prices } from "@/components/Prices";
import { WhyMe } from "@/components/WhyMe";
import { Process } from "@/components/Process";
import { Portfolio } from "@/components/Portfolio";
import { Contacts } from "@/components/Contacts";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-[#EFFEED] relative overflow-x-hidden">
      <PaintSplashes />
      <div className="relative z-10">
        <Header />
        <main className="pt-24 md:pt-28">
          <Hero />
          <AboutMe />
          <Portfolio />
          <Formats />
          <Prices />
          <WhyMe />
          <Process />
          <Contacts />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Index;
