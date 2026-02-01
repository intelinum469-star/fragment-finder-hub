import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Sparkles, ArrowRight } from 'lucide-react';
import { FormattedText } from './FormattedText';
import { AnimatedIcon } from './AnimatedIcon';

export const Hero: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="pt-10 sm:pt-12 md:pt-14 pb-12 sm:pb-16 relative z-10">
      <div className="container max-w-[1200px] mx-auto px-3 sm:px-4">
        <div className="grid grid-cols-1 gap-8 lg:gap-12 items-center max-w-2xl mx-auto">
          {/* Left Content */}
          <div className="space-y-6">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/90 backdrop-blur-sm shadow-xl border-2 border-[#F5569B]">
              <AnimatedIcon delay={0.1}>
                <Sparkles className="w-4 h-4 text-[#F5569B]" />
              </AnimatedIcon>
              <span className="text-sm font-bold text-[#F5569B] tracking-wider">
                {t('hero_pill')}
              </span>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-2 leading-tight">
                <span className="bg-gradient-to-r from-[#F5569B] to-[#A88AED] bg-clip-text text-transparent">
                  {t('hero_title_1')}
                </span>
              </h1>
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-black leading-tight">
                {t('hero_title_2')}
              </h2>
            </div>

            {/* Subtitle */}
            <p className="text-base sm:text-lg md:text-xl text-black leading-relaxed">
              <FormattedText text={t('hero_subtitle')} />
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-4">
              <button
                onClick={() => document.querySelector('#contacts')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-2xl bg-gradient-to-r from-[#F5569B] to-[#A88AED] text-white font-bold text-base sm:text-lg shadow-2xl hover:shadow-3xl transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                {t('hero_cta1')}
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => document.querySelector('#portfolio')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-2xl bg-white border-2 border-[#F5569B] text-[#F5569B] font-bold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                {t('hero_cta2')}
              </button>
            </div>

            {/* Note */}
            <div className="p-4 rounded-2xl bg-white/90 backdrop-blur-sm shadow-lg border border-[#F5569B]/20">
              <p className="text-sm text-black">
                {t('hero_note')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
