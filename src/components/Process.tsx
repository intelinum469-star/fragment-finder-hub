import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ListChecks } from 'lucide-react';
import { AnimatedIcon } from './AnimatedIcon';

export const Process: React.FC = () => {
  const { t } = useLanguage();
  return (
    <section id="process" className="py-16 relative z-10">
      <div className="container max-w-[1200px] mx-auto px-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border-2 border-[#1355B2] mb-4">
            <AnimatedIcon delay={0.1}><ListChecks className="w-4 h-4 text-[#1355B2]" /></AnimatedIcon>
            <span className="text-sm font-bold text-[#1355B2] uppercase tracking-wider">{t('process_label')}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-[#1355B2] via-[#A88AED] to-[#F5569B] bg-clip-text text-transparent">{t('process_title')}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { num: 1, bg: 'bg-gradient-to-br from-[#F5569B]/80 to-[#F5569B]/60', iconBg: 'bg-white/30' },
            { num: 2, bg: 'bg-gradient-to-br from-[#D4E157]/80 to-[#D4E157]/60', iconBg: 'bg-black/20' },
            { num: 3, bg: 'bg-gradient-to-br from-[#1355B2]/80 to-[#5B7FDB]/60', iconBg: 'bg-white/30', textWhite: true },
            { num: 4, bg: 'bg-gradient-to-br from-[#A88AED]/80 to-[#C5B3F5]/60', iconBg: 'bg-white/30' }
          ].map(({ num, bg, iconBg, textWhite }) => (
            <div key={num} className={`p-8 rounded-3xl shadow-2xl ${bg} backdrop-blur-sm relative overflow-hidden`}>
              <div className={`w-16 h-16 ${iconBg} backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4`}>
                <div className={`text-4xl font-black ${textWhite ? 'text-white' : 'text-black/70'}`}>{num}</div>
              </div>
              <h3 className={`text-xl font-black mb-3 ${textWhite ? 'text-white' : 'text-black'}`}>{t(`step${num}_title`)}</h3>
              <p className={`text-sm leading-relaxed ${textWhite ? 'text-white/90' : 'text-black/80'}`}>{t(`step${num}_text`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
