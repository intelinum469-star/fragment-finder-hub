import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Palette, Home, Images, DollarSign, ListChecks, Mail, Globe, Menu, X, User } from 'lucide-react';
import { AnimatedIcon } from './AnimatedIcon';

export const Header: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.querySelector(id);
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const langNames = {
    ru: 'RU',
    it: 'IT',
    en: 'EN',
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b-4 border-[#F5569B]">
      <div className="container max-w-[1200px] mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div 
              className="w-14 h-14 rounded-2xl flex items-center justify-center relative overflow-hidden shadow-lg transform hover:rotate-6 transition-transform cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #F5569B 0%, #A88AED 50%, #CBD83B 100%)',
              }}
            >
              <span className="text-white text-2xl font-black relative z-10">NE</span>
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
            </div>
            <div className="hidden md:block">
              <div className="font-black text-xl text-black">
                Natalia Egorova
              </div>
              <div className="text-xs text-gray-700 tracking-wider">Artist & Designer</div>
            </div>
          </div>

          {/* Desktop Navigation - Icons */}
          <nav className="hidden lg:flex items-center gap-6">
            <button
              onClick={() => scrollToSection('#about')}
              className="group flex flex-col items-center gap-1 transition-all hover:scale-110"
              title="About"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFCBEB] to-[#F5569B]/70 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <AnimatedIcon delay={0.1} yOffset={10}>
                  <User className="w-6 h-6 text-white" />
                </AnimatedIcon>
              </div>
            </button>
            <button
              onClick={() => scrollToSection('#formats')}
              className="group flex flex-col items-center gap-1 transition-all hover:scale-110"
              title="Formats"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#CBD83B] to-[#EFFEED] flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <AnimatedIcon delay={0.15} yOffset={10}>
                  <Palette className="w-6 h-6 text-black" />
                </AnimatedIcon>
              </div>
            </button>
            <button
              onClick={() => scrollToSection('#prices')}
              className="group flex flex-col items-center gap-1 transition-all hover:scale-110"
              title="Prices"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1355B2] to-[#A88AED] flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <AnimatedIcon delay={0.2} yOffset={10}>
                  <DollarSign className="w-6 h-6 text-white" />
                </AnimatedIcon>
              </div>
            </button>
            <button
              onClick={() => scrollToSection('#process')}
              className="group flex flex-col items-center gap-1 transition-all hover:scale-110"
              title="Process"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#A88AED] to-[#FFCBEB] flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <AnimatedIcon delay={0.25} yOffset={10}>
                  <ListChecks className="w-6 h-6 text-white" />
                </AnimatedIcon>
              </div>
            </button>
            <button
              onClick={() => scrollToSection('#portfolio')}
              className="group flex flex-col items-center gap-1 transition-all hover:scale-110"
              title="Portfolio"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#F5569B] to-[#A88AED] flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <AnimatedIcon delay={0.3} yOffset={10}>
                  <Images className="w-6 h-6 text-white" />
                </AnimatedIcon>
              </div>
            </button>
            <button
              onClick={() => scrollToSection('#contacts')}
              className="group flex flex-col items-center gap-1 transition-all hover:scale-110"
              title="Contacts"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#CBD83B] to-[#F5569B] flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <AnimatedIcon delay={0.35} yOffset={10}>
                  <Mail className="w-6 h-6 text-white" />
                </AnimatedIcon>
              </div>
            </button>
          </nav>

          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow font-bold text-black border-2 border-[#F5569B]"
            >
              <Globe className="w-5 h-5" />
              <span>{langNames[language]}</span>
            </button>
            
            {isLangOpen && (
              <div className="absolute top-full mt-2 right-0 bg-white rounded-xl shadow-2xl overflow-hidden border-2 border-[#F5569B]">
                {Object.entries(langNames).map(([lang, name]) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setLanguage(lang as 'ru' | 'it' | 'en');
                      setIsLangOpen(false);
                    }}
                    className={`block w-full px-6 py-3 text-left font-bold transition-colors ${
                      language === lang
                        ? 'bg-[#F5569B] text-white'
                        : 'hover:bg-[#FFCBEB] text-black'
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-[#F5569B] text-white"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="lg:hidden pb-4 flex flex-col gap-2">
            <button
              onClick={() => scrollToSection('#about')}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-[#FFCBEB] to-[#F5569B] text-white font-bold hover:shadow-lg transition-shadow"
            >
              <User className="w-5 h-5" />
              About
            </button>
            <button
              onClick={() => scrollToSection('#formats')}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-[#CBD83B] to-[#EFFEED] text-black font-bold hover:shadow-lg transition-shadow"
            >
              <Palette className="w-5 h-5" />
              Formats
            </button>
            <button
              onClick={() => scrollToSection('#prices')}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-[#1355B2] to-[#A88AED] text-white font-bold hover:shadow-lg transition-shadow"
            >
              <DollarSign className="w-5 h-5" />
              Prices
            </button>
            <button
              onClick={() => scrollToSection('#process')}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-[#A88AED] to-[#FFCBEB] text-black font-bold hover:shadow-lg transition-shadow"
            >
              <ListChecks className="w-5 h-5" />
              Process
            </button>
            <button
              onClick={() => scrollToSection('#portfolio')}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-[#F5569B] to-[#A88AED] text-white font-bold hover:shadow-lg transition-shadow"
            >
              <Images className="w-5 h-5" />
              Portfolio
            </button>
            <button
              onClick={() => scrollToSection('#contacts')}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-[#CBD83B] to-[#F5569B] text-black font-bold hover:shadow-lg transition-shadow"
            >
              <Mail className="w-5 h-5" />
              Contacts
            </button>
          </nav>
        )}
      </div>
    </header>
  );
};
