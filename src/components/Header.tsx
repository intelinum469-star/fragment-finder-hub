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
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b-4 border-[#F5569B]">
      <div className="container max-w-[1400px] mx-auto px-6">
        <div className="flex items-center justify-between py-3">
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
          <nav className="hidden lg:flex items-center gap-4">
            <button
              onClick={() => scrollToSection('#about')}
              className="group flex flex-col items-center transition-all hover:scale-105"
              title="About"
            >
              <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-[#FFCBEB] to-[#F5569B] flex items-center justify-center shadow-md group-hover:shadow-lg transition-all">
                <AnimatedIcon delay={0.1} yOffset={10}>
                  <User className="w-7 h-7 text-white" />
                </AnimatedIcon>
              </div>
            </button>
            <button
              onClick={() => scrollToSection('#formats')}
              className="group flex flex-col items-center transition-all hover:scale-105"
              title="Formats"
            >
              <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-[#E8F279] to-[#CBD83B] flex items-center justify-center shadow-md group-hover:shadow-lg transition-all">
                <AnimatedIcon delay={0.15} yOffset={10}>
                  <Palette className="w-7 h-7 text-white" />
                </AnimatedIcon>
              </div>
            </button>
            <button
              onClick={() => scrollToSection('#portfolio')}
              className="group flex flex-col items-center transition-all hover:scale-105"
              title="Portfolio"
            >
              <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-[#B8A3F5] to-[#A88AED] flex items-center justify-center shadow-md group-hover:shadow-lg transition-all">
                <AnimatedIcon delay={0.2} yOffset={10}>
                  <Images className="w-7 h-7 text-white" />
                </AnimatedIcon>
              </div>
            </button>
            <button
              onClick={() => scrollToSection('#prices')}
              className="group flex flex-col items-center transition-all hover:scale-105"
              title="Prices"
            >
              <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-[#F782B9] to-[#F5569B] flex items-center justify-center shadow-md group-hover:shadow-lg transition-all">
                <AnimatedIcon delay={0.25} yOffset={10}>
                  <DollarSign className="w-6 h-6 text-white" />
                </AnimatedIcon>
              </div>
            </button>
            <button
              onClick={() => scrollToSection('#process')}
              className="group flex flex-col items-center transition-all hover:scale-105"
              title="Process"
            >
              <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-[#4A8BD9] to-[#1355B2] flex items-center justify-center shadow-md group-hover:shadow-lg transition-all">
                <AnimatedIcon delay={0.25} yOffset={10}>
                  <ListChecks className="w-7 h-7 text-white" />
                </AnimatedIcon>
              </div>
            </button>
            <button
              onClick={() => scrollToSection('#contacts')}
              className="group flex flex-col items-center transition-all hover:scale-105"
              title="Contacts"
            >
              <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-[#FFCBEB] to-[#FFA4D1] flex items-center justify-center shadow-md group-hover:shadow-lg transition-all">
                <AnimatedIcon delay={0.3} yOffset={10}>
                  <Mail className="w-7 h-7 text-white" />
                </AnimatedIcon>
              </div>
            </button>
          </nav>

          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-400 transition-all hover:scale-105"
            >
              <Globe className="w-6 h-6" />
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
          <nav className="lg:hidden pb-4 grid grid-cols-6 gap-3">
            <button
              onClick={() => scrollToSection('#about')}
              aria-label="About"
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FFCBEB] to-[#F5569B] flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all"
            >
              <User className="w-6 h-6" />
            </button>
            <button
              onClick={() => scrollToSection('#formats')}
              aria-label="Formats"
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#CBD83B] to-[#EFFEED] flex items-center justify-center text-black shadow-lg hover:shadow-xl transition-all"
            >
              <Palette className="w-6 h-6" />
            </button>
            <button
              onClick={() => scrollToSection('#portfolio')}
              aria-label="Portfolio"
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F5569B] to-[#A88AED] flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all"
            >
              <Images className="w-6 h-6" />
            </button>
            <button
              onClick={() => scrollToSection('#prices')}
              aria-label="Prices"
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FFCBEB] to-[#F5569B] flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all"
            >
              <DollarSign className="w-6 h-6" />
            </button>
            <button
              onClick={() => scrollToSection('#process')}
              aria-label="Process"
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1355B2] to-[#A88AED] flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all"
            >
              <ListChecks className="w-6 h-6" />
            </button>
            <button
              onClick={() => scrollToSection('#contacts')}
              aria-label="Contacts"
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#CBD83B] to-[#F5569B] flex items-center justify-center text-black shadow-lg hover:shadow-xl transition-all"
            >
              <Mail className="w-6 h-6" />
            </button>
          </nav>
        )}
      </div>
    </header>
  );
};
