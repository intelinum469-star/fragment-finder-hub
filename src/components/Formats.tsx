import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Sparkles } from 'lucide-react';
import { AnimatedIcon } from './AnimatedIcon';

const formatCards = [
  { gradient: 'linear-gradient(135deg, #FFCBEB 0%, #F5569B 100%)', title: 'f_card1_title', text: 'f_card1_text', tag: 'f_card1_tag', textColor: 'text-white' },
  { gradient: 'linear-gradient(135deg, #CBD83B 0%, #EFFEED 100%)', title: 'f_card2_title', text: 'f_card2_text', tag: 'f_card2_tag', textColor: 'text-black' },
  { gradient: 'linear-gradient(135deg, #1355B2 0%, #A88AED 100%)', title: 'f_card3_title', text: 'f_card3_text', tag: 'f_card3_tag', textColor: 'text-white' },
  { gradient: 'linear-gradient(135deg, #A88AED 0%, #FFCBEB 100%)', title: 'f_card4_title', text: 'f_card4_text', tag: 'f_card4_tag', textColor: 'text-white' },
];

export const Formats: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="formats" className="py-12 sm:py-16 pt-20 sm:pt-24 scroll-mt-28 relative z-10">
      <div className="container max-w-[1200px] mx-auto px-3 sm:px-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border-2 border-[#CBD83B] mb-4">
            <AnimatedIcon delay={0.1}>
              <Sparkles className="w-4 h-4 text-[#CBD83B]" />
            </AnimatedIcon>
            <span className="text-sm font-bold text-black uppercase tracking-wider">{t('f_label')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-[#CBD83B] via-[#F5569B] to-[#A88AED] bg-clip-text text-transparent">
            {t('f_title')}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {formatCards.map((card, index) => (
            <div key={index} className="rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden" style={{ background: card.gradient }}>
              <div className={`p-6 ${card.textColor}`}>
                <div className="text-xs font-bold uppercase tracking-wider opacity-80 mb-2">{t(card.tag)}</div>
                <h3 className="text-2xl font-black mb-3">{t(card.title)}</h3>
                <p className="text-base opacity-90 leading-relaxed">{t(card.text)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
