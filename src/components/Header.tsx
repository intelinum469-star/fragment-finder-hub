import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Palette, Home, Images, DollarSign, ListChecks, Mail, Globe, Menu, X, User } from 'lucide-react';
import { AnimatedIcon } from './AnimatedIcon';
import logoImage from '../assets/ne-logo.png';

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
    en: 'EN',
    it: 'IT',
    ru: 'RU',
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b-4 border-[#F5569B]">
      <div className="container max-w-[1400px] mx-auto px-6">
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img 
              src={logoImage} 
              alt="NE Logo" 
              className="w-14 h-14 rounded-2xl shadow-lg transform hover:rotate-6 transition-transform cursor-pointer"
            />
            <div className="hidden md:block">
              <div className="font-black text-xl text-black">
                Natalia Egorova
              </div>
              <div className="text-xs text-gray-700 tracking-wider">Artist & Designer</div>
            </div>
          </div>

          {/* Desktop Navigation - Icons */}
          <nav className="hidden md:flex items-center gap-4 overflow-x-auto sm:gap-5">
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

          {/* Mobile & Desktop Language + Menu */}
          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center justify-center w-14 h-14 rounded-3xl bg-gradient-to-br from-[#F4F6F8] to-[#E9EEF3] text-gray-700 shadow-md hover:shadow-lg transition-all"
              >
                <Globe className="w-6 h-6" />
              </button>
              
              {isLangOpen && (
                <div className="absolute top-full mt-2 right-0 bg-white rounded-xl shadow-2xl overflow-hidden border-2 border-[#F5569B] z-50">
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
              className="md:hidden flex items-center justify-center w-14 h-14 rounded-3xl bg-gradient-to-br from-[#F5569B] to-[#A88AED] text-white shadow-md hover:shadow-lg transition-all"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col gap-2">
              <button
                onClick={() => scrollToSection('#about')}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#FFCBEB] transition-colors"
              >
                <User className="w-5 h-5 text-[#F5569B]" />
                <span className="font-bold text-black">About</span>
              </button>
              <button
                onClick={() => scrollToSection('#formats')}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#FFCBEB] transition-colors"
              >
                <Palette className="w-5 h-5 text-[#CBD83B]" />
                <span className="font-bold text-black">Formats</span>
              </button>
              <button
                onClick={() => scrollToSection('#portfolio')}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#FFCBEB] transition-colors"
              >
                <Images className="w-5 h-5 text-[#A88AED]" />
                <span className="font-bold text-black">Portfolio</span>
              </button>
              <button
                onClick={() => scrollToSection('#prices')}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#FFCBEB] transition-colors"
              >
                <DollarSign className="w-5 h-5 text-[#F5569B]" />
                <span className="font-bold text-black">Prices</span>
              </button>
              <button
                onClick={() => scrollToSection('#process')}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#FFCBEB] transition-colors"
              >
                <ListChecks className="w-5 h-5 text-[#1355B2]" />
                <span className="font-bold text-black">Process</span>
              </button>
              <button
                onClick={() => scrollToSection('#contacts')}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#FFCBEB] transition-colors"
              >
                <Mail className="w-5 h-5 text-[#F5569B]" />
                <span className="font-bold text-black">Contacts</span>
              </button>
            </nav>
          </div>
        )}

      </div>
    </header>
  );
};
