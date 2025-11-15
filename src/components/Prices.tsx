import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { DollarSign } from 'lucide-react';
import { AnimatedIcon } from './AnimatedIcon';

export const Prices: React.FC = () => {
  const { t } = useLanguage();
  return (
    <section id="prices" className="py-12 sm:py-16 pt-20 sm:pt-24 scroll-mt-28 relative z-10">
      <div className="container max-w-[1200px] mx-auto px-3 sm:px-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border-2 border-[#F5569B] mb-4">
            <AnimatedIcon delay={0.1}><DollarSign className="w-4 h-4 text-[#F5569B]" /></AnimatedIcon>
            <span className="text-sm font-bold text-[#F5569B] uppercase tracking-wider">{t('price_label')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 bg-gradient-to-r from-[#F5569B] via-[#A88AED] to-[#1355B2] bg-clip-text text-transparent">{t('price_title')}</h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">{t('price_subtitle')}</p>
        </div>
      </div>
    </section>
  );
};
