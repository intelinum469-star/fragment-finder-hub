import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Heart, Palette, Award, Users } from 'lucide-react';
import { FormattedText } from './FormattedText';
import { AnimatedIcon } from './AnimatedIcon';
import nataliaPhoto from '@/assets/natalia-photo.jpg';

const statsCards = [
  { icon: Award, value: '30+', label: 'about_stat1', color: '#F5569B' },
  { icon: Palette, value: '100+', label: 'about_stat2', color: '#CBD83B' },
  { icon: Users, value: '23', label: 'about_stat3', color: '#A88AED' },
  { icon: Heart, value: '100%', label: 'about_stat4', color: '#1355B2' },
];

export const AboutMe: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-16 pt-24 scroll-mt-28 relative z-10">
      <div className="container max-w-[1200px] mx-auto px-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border-2 border-[#F5569B] mb-4">
            <AnimatedIcon delay={0.1}>
              <Heart className="w-4 h-4 text-[#F5569B] fill-[#F5569B]" />
            </AnimatedIcon>
            <span className="text-sm font-bold text-[#F5569B] uppercase tracking-wider">
              {t('about_label')}
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-[#A88AED] via-[#1355B2] to-[#1355B2] bg-clip-text text-transparent">
            {t('about_title')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          {/* Photo on the left */}
          <div className="relative w-full">
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src={nataliaPhoto} 
                alt="Natalia Egorova" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Content on the right */}
          <div className="space-y-6">
            <h3 className="text-3xl font-black bg-gradient-to-r from-[#F5569B] to-[#A88AED] bg-clip-text text-transparent">
              {t('about_name')}
            </h3>
            <p className="text-xl font-bold text-black">{t('about_subtitle')}</p>
            
            <div className="space-y-4">
              <p className="text-lg text-black leading-relaxed"><FormattedText text={t('about_p1')} /></p>
              <p className="text-lg text-black leading-relaxed"><FormattedText text={t('about_p2')} /></p>
              <p className="text-lg text-black leading-relaxed"><FormattedText text={t('about_p3')} /></p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8">
              {statsCards.map((stat, index) => (
                <div key={index} className="p-6 rounded-3xl shadow-xl bg-white hover:shadow-2xl transition-all hover:-translate-y-1">
                  <AnimatedIcon delay={index * 0.1}>
                    <stat.icon className="w-10 h-10 mb-3" style={{ color: stat.color }} />
                  </AnimatedIcon>
                  <div className="text-4xl font-black mb-2" style={{ color: stat.color }}>{stat.value}</div>
                  <div className="text-sm text-black font-medium">{t(stat.label)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
