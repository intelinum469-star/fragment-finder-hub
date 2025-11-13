import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Images, ArrowRight } from 'lucide-react';
import { AnimatedIcon } from './AnimatedIcon';

const portfolioItems = [
  {
    image: 'https://images.unsplash.com/photo-1588979355313-6711a095465f?w=600',
    caption: 'port_cap1',
    gradient: 'linear-gradient(135deg, rgba(255,203,235,0.9) 0%, rgba(245,86,155,0.9) 100%)',
  },
  {
    image: 'https://images.unsplash.com/photo-1743080331451-6560592e5ef6?w=600',
    caption: 'port_cap2',
    gradient: 'linear-gradient(135deg, rgba(203,216,59,0.9) 0%, rgba(239,254,237,0.9) 100%)',
  },
  {
    image: 'https://images.unsplash.com/photo-1577176434922-803273eba97a?w=600',
    caption: 'port_cap3',
    gradient: 'linear-gradient(135deg, rgba(19,85,178,0.9) 0%, rgba(168,138,237,0.9) 100%)',
  },
  {
    image: 'https://images.unsplash.com/photo-1743080331451-6560592e5ef6?w=600',
    caption: 'port_cap4',
    gradient: 'linear-gradient(135deg, rgba(168,138,237,0.9) 0%, rgba(255,203,235,0.9) 100%)',
  },
  {
    image: 'https://images.unsplash.com/photo-1701958213864-2307a737e853?w=600',
    caption: 'port_cap5',
    gradient: 'linear-gradient(135deg, rgba(245,86,155,0.9) 0%, rgba(168,138,237,0.9) 100%)',
  },
  {
    image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=600',
    caption: 'port_cap6',
    gradient: 'linear-gradient(135deg, rgba(239,254,237,0.9) 0%, rgba(203,216,59,0.9) 100%)',
  },
];

export const Portfolio: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="portfolio" className="py-16 relative z-10">
      <div className="container max-w-[1200px] mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border-2 border-[#A88AED] mb-4">
            <AnimatedIcon delay={0.1}>
              <Images className="w-4 h-4 text-[#A88AED]" />
            </AnimatedIcon>
            <span className="text-sm font-bold text-[#A88AED] uppercase tracking-wider">
              {t('port_label')}
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-[#A88AED] via-[#F5569B] to-[#CBD83B] bg-clip-text text-transparent">
            {t('port_title')}
          </h2>
          <p className="text-lg text-black max-w-2xl mx-auto">
            {t('port_subtitle')}
          </p>
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {portfolioItems.map((item, index) => (
            <div
              key={index}
              className="group relative rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="aspect-square relative overflow-hidden">
                <img
                  src={item.image}
                  alt={t(item.caption)}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: item.gradient }}
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-white font-bold text-lg">{t(item.caption)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button
            onClick={() => document.querySelector('#contacts')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#A88AED] to-[#F5569B] text-white font-bold text-lg shadow-2xl hover:shadow-3xl transition-all hover:scale-105 inline-flex items-center gap-2"
          >
            {t('hero_cta1')}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};
