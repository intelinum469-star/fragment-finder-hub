import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Instagram, Facebook, Heart } from 'lucide-react';
import { AnimatedIcon } from './AnimatedIcon';
import neLogo from '../assets/ne-logo.png';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="relative py-8 sm:py-12 mt-12 sm:mt-20 border-t-4 border-[#F5569B]">
      <div className="container max-w-[1200px] mx-auto px-3 sm:px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Logo & Description */}
          <div>
            <img 
              src={neLogo} 
              alt="Natalia Egorova Logo" 
              className="w-16 h-16 rounded-2xl mb-4"
            />
            <h3 className="font-black text-lg sm:text-xl text-black mb-2">
              Natalia Egorova
            </h3>
            <p className="text-sm text-black">
              {t('footer_copy')}
            </p>
          </div>

          {/* Social Media */}
          <div className="flex flex-col items-start md:items-center justify-center">
            <h4 className="font-bold text-base sm:text-lg mb-4 flex items-center gap-2 text-black">
              <AnimatedIcon delay={0.1}>
                <Heart className="w-5 h-5 text-[#F5569B] fill-[#F5569B]" />
              </AnimatedIcon>
              Follow Me
            </h4>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/nataly_art_italy/"
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#F5569B] to-[#FFCBEB] flex items-center justify-center shadow-lg hover:shadow-2xl transition-all hover:scale-110">
                  <AnimatedIcon delay={0.2} yOffset={15}>
                    <Instagram className="w-7 h-7 text-white" />
                  </AnimatedIcon>
                </div>
                <div className="text-center mt-1 text-xs text-black group-hover:text-[#F5569B] transition-colors">
                  Instagram
                </div>
              </a>
              <a
                href="https://www.facebook.com/share/19pmmBeKo3/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#1355B2] to-[#A88AED] flex items-center justify-center shadow-lg hover:shadow-2xl transition-all hover:scale-110">
                  <AnimatedIcon delay={0.3} yOffset={15}>
                    <Facebook className="w-7 h-7 text-white" />
                  </AnimatedIcon>
                </div>
                <div className="text-center mt-1 text-xs text-black group-hover:text-[#1355B2] transition-colors">
                  Facebook
                </div>
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col items-start md:items-end">
            <h4 className="font-bold text-base sm:text-lg mb-4 text-black">Contact</h4>
            <div className="text-sm text-black text-left md:text-right">
              <p className="mb-2 font-medium">online · USA / Italy</p>
              <p className="mb-2">RU / IT / EN</p>
              <a href="mailto:eg.nati74@gmail.com" className="hover:text-[#F5569B] transition-colors">
                eg.nati74@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-sm text-gray-600 pt-6 border-t border-gray-200">
          <p>© {new Date().getFullYear()} Natalia Egorova. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
