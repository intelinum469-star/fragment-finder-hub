import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Sparkles, ArrowRight } from 'lucide-react';
import { FormattedText } from './FormattedText';
import { AnimatedIcon } from './AnimatedIcon';

export const Hero: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="pt-6 xs:pt-8 sm:pt-12 md:pt-14 pb-8 sm:pb-12 md:pb-16 relative z-10">
      <div className="container max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          {/* Pill */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white/90 backdrop-blur-sm shadow-xl border-2 border-[#F5569B] mb-4 sm:mb-6">
            <AnimatedIcon delay={0.1}>
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F5569B]" />
            </AnimatedIcon>
            <span className="text-xs sm:text-sm font-bold text-[#F5569B] tracking-wider">
              {t('hero_pill')}
            </span>
          </div>

          {/* Title */}
          <div className="mb-4 sm:mb-6">
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-1 sm:mb-2 leading-tight">
              <span className="bg-gradient-to-r from-[#F5569B] to-[#A88AED] bg-clip-text text-transparent">
                {t('hero_title_1')}
              </span>
            </h1>
            <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-black leading-tight">
              {t('hero_title_2')}
            </h2>
          </div>

          {/* Subtitle */}
          <p className="text-sm xs:text-base sm:text-lg md:text-xl text-black leading-relaxed mb-6 sm:mb-8 max-w-2xl">
            <FormattedText text={t('hero_subtitle')} />
          </p>

          {/* CTAs */}
          <div className="flex flex-col xs:flex-row flex-wrap gap-3 sm:gap-4 w-full xs:w-auto justify-center mb-6 sm:mb-8">
            <button
              onClick={() => document.querySelector('#contacts')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full xs:w-auto px-5 sm:px-6 md:px-8 py-3 sm:py-3.5 md:py-4 rounded-2xl bg-gradient-to-r from-[#F5569B] to-[#A88AED] text-white font-bold text-sm sm:text-base md:text-lg shadow-2xl hover:shadow-3xl transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              {t('hero_cta1')}
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => document.querySelector('#portfolio')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full xs:w-auto px-5 sm:px-6 md:px-8 py-3 sm:py-3.5 md:py-4 rounded-2xl bg-white border-2 border-[#F5569B] text-[#F5569B] font-bold text-sm sm:text-base md:text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              {t('hero_cta2')}
            </button>
          </div>

          {/* Note */}
          <div className="p-3 sm:p-4 rounded-2xl bg-white/90 backdrop-blur-sm shadow-lg border border-[#F5569B]/20 max-w-xl">
            <p className="text-xs sm:text-sm text-black leading-relaxed">
              {t('hero_note')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
