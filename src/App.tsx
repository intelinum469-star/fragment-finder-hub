import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LanguageProvider } from "./contexts/LanguageContext";
import { PaintSplashes } from "./components/PaintSplashes";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { AboutMe } from "./components/AboutMe";
import { Formats } from "./components/Formats";
import { Prices } from "./components/Prices";
import { WhyMe } from "./components/WhyMe";
import { Process } from "./components/Process";
import { Portfolio } from "./components/Portfolio";
import { Contacts } from "./components/Contacts";
import { Footer } from "./components/Footer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <div className="min-h-screen bg-[#EFFEED] relative overflow-x-hidden">
          <PaintSplashes />
          <div className="relative z-10">
            <Header />
            <main>
              <Hero />
              <AboutMe />
              <Formats />
              <Prices />
              <WhyMe />
              <Process />
              <Portfolio />
              <Contacts />
            </main>
            <Footer />
          </div>
        </div>
        <Toaster />
        <Sonner />
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
