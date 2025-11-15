import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Heart, Star } from 'lucide-react';
import { FormattedText } from './FormattedText';
import { AnimatedIcon } from './AnimatedIcon';

const whyCards = [
  { title: 'w_card1_title', text: 'w_card1_text', gradient: 'linear-gradient(135deg, #FFCBEB 0%, #F5569B 100%)', textColor: 'text-black' },
  { title: 'w_card2_title', text: 'w_card2_text', gradient: 'linear-gradient(135deg, #CBD83B 0%, #EFFEED 100%)', textColor: 'text-black' },
  { title: 'w_card3_title', text: 'w_card3_text', gradient: 'linear-gradient(135deg, #1355B2 0%, #A88AED 100%)', textColor: 'text-white' },
  { title: 'w_card4_title', text: 'w_card4_text', gradient: 'linear-gradient(135deg, #A88AED 0%, #FFCBEB 100%)', textColor: 'text-black' },
  { title: 'w_card5_title', text: 'w_card5_text', gradient: 'linear-gradient(135deg, #F5569B 0%, #A88AED 100%)', textColor: 'text-black' },
  { title: 'w_card6_title', text: 'w_card6_text', gradient: 'linear-gradient(135deg, #EFFEED 0%, #CBD83B 100%)', textColor: 'text-black' },
];

export const WhyMe: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="py-8 sm:py-12 relative z-10">
      <div className="container max-w-[1200px] mx-auto px-3 sm:px-4">
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border-2 border-[#A88AED] mb-4">
            <AnimatedIcon delay={0.1}>
              <Heart className="w-4 h-4 text-[#A88AED] fill-[#A88AED]" />
            </AnimatedIcon>
            <span className="text-sm font-bold text-[#A88AED] uppercase tracking-wider">
              {t('why_label')}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-[#A88AED] via-[#F5569B] to-[#CBD83B] bg-clip-text text-transparent">
            {t('why_title')}
          </h2>
          <p className="text-base sm:text-lg text-black max-w-2xl mx-auto">
            {t('why_subtitle')}
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {whyCards.map((card, index) => (
            <div
              key={index}
              className="relative rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden group"
              style={{ background: card.gradient }}
            >
              <div className={`p-4 sm:p-5 ${card.textColor}`}>
                {/* Star icon */}
                <div className="mb-3">
                  <AnimatedIcon delay={index * 0.1} yOffset={15}>
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Star className="w-6 h-6 fill-current" />
                    </div>
                  </AnimatedIcon>
                </div>
                
                {/* Text */}
                <h3 className="text-lg sm:text-xl font-black mb-2">{t(card.title)}</h3>
                <p className="text-xs sm:text-sm opacity-90 leading-relaxed">{t(card.text)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
