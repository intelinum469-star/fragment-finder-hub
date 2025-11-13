import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { DollarSign } from 'lucide-react';
import { AnimatedIcon } from './AnimatedIcon';

export const Prices: React.FC = () => {
  const { t } = useLanguage();
  return (
    <section id="prices" className="py-16 pt-24 scroll-mt-28 relative z-10">
      <div className="container max-w-[1200px] mx-auto px-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border-2 border-[#F5569B] mb-4">
            <AnimatedIcon delay={0.1}><DollarSign className="w-4 h-4 text-[#F5569B]" /></AnimatedIcon>
            <span className="text-sm font-bold text-[#F5569B] uppercase tracking-wider">{t('price_label')}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-[#F5569B] via-[#A88AED] to-[#1355B2] bg-clip-text text-transparent">{t('price_title')}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="p-8 rounded-3xl shadow-2xl bg-white hover:shadow-3xl transition-all duration-300 hover:-translate-y-1">
              <h3 className="text-2xl font-black mb-4 text-black">{t(`p_card${i}_title`)}</h3>
              <p className="text-3xl font-black text-[#F5569B] mb-4">{t(`p_card${i}_note`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
