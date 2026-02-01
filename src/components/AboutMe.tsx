import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Heart, Palette, Award, Images, ArrowRight, Loader2 } from 'lucide-react';
import { FormattedText } from './FormattedText';
import { AnimatedIcon } from './AnimatedIcon';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ImageGalleryModal } from './ImageGalleryModal';
import nataliaPhoto from '@/assets/natalia-photo-new.jpg';
import logoTransparent from '@/assets/ne-logo-new.png';

interface Category {
  id: string;
  name_ru: string;
  name_en: string;
  slug: string;
  main_image_url: string | null;
  order_index: number;
}

interface PortfolioImage {
  id: string;
  category_id: string;
  image_url: string;
  title_ru: string | null;
  title_en: string | null;
  description_ru: string | null;
  description_en: string | null;
  order_index: number;
  media_type?: string;
}

const statsCards = [
  { icon: Award, value: '30+', label: 'about_stat1', color: '#F5569B' },
  { icon: Palette, value: '100+', label: 'about_stat2', color: '#CBD83B' },
  { icon: Heart, value: '100%', label: 'about_stat4', color: '#1355B2' },
];

export const AboutMe: React.FC = () => {
  const { t, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['portfolio-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('portfolio_categories')
        .select('*')
        .order('order_index', { ascending: true });
      
      if (error) throw error;
      return data as Category[];
    },
  });

  const { data: images } = useQuery({
    queryKey: ['portfolio-images', selectedCategory?.id],
    queryFn: async () => {
      if (!selectedCategory) return [];
      
      const { data, error } = await supabase
        .from('portfolio_images')
        .select('*')
        .eq('category_id', selectedCategory.id)
        .order('order_index', { ascending: true });
      
      if (error) throw error;
      return data as PortfolioImage[];
    },
    enabled: !!selectedCategory && isModalOpen,
  });

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  const getCategoryName = (category: Category) => {
    return language === 'ru' ? category.name_ru : category.name_en;
  };

  return (
    <section id="about" className="py-12 sm:py-16 pt-20 sm:pt-24 scroll-mt-28 relative z-10">
      <div className="container max-w-[1200px] mx-auto px-3 sm:px-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border-2 border-[#F5569B] mb-4">
            <AnimatedIcon delay={0.1}>
              <Heart className="w-4 h-4 text-[#F5569B] fill-[#F5569B]" />
            </AnimatedIcon>
            <span className="text-sm font-bold text-[#F5569B] uppercase tracking-wider">
              {t('about_label')}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-[#A88AED] via-[#1355B2] to-[#1355B2] bg-clip-text text-transparent">
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
            <h3 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-[#F5569B] to-[#A88AED] bg-clip-text text-transparent">
              {t('about_name')}
            </h3>
            <p className="text-lg sm:text-xl font-bold text-black">{t('about_subtitle')}</p>
            
            <div className="space-y-4">
              <p className="text-base sm:text-lg text-black leading-relaxed"><FormattedText text={t('about_p1')} /></p>
              <p className="text-base sm:text-lg text-black leading-relaxed"><FormattedText text={t('about_p2')} /></p>
              <p className="text-base sm:text-lg text-black leading-relaxed"><FormattedText text={t('about_p3')} /></p>
              <p className="text-base sm:text-lg text-black leading-relaxed"><FormattedText text={t('about_p4')} /></p>
            </div>

            {/* Stats - horizontal compact on mobile, cards on desktop */}
            <div className="mt-8">
              {/* Mobile: single horizontal strip */}
              <div className="sm:hidden p-4 rounded-2xl shadow-xl bg-white flex justify-around items-center">
                {statsCards.map((stat, index) => (
                  <div key={index} className="flex flex-col items-center text-center px-2">
                    <stat.icon className="w-6 h-6 mb-1" style={{ color: stat.color }} />
                    <div className="text-xl font-black" style={{ color: stat.color }}>{stat.value}</div>
                    <div className="text-[10px] text-black font-medium leading-tight">{t(stat.label)}</div>
                  </div>
                ))}
              </div>
              
              {/* Desktop: individual cards */}
              <div className="hidden sm:grid sm:grid-cols-3 gap-4 justify-items-center">
                {statsCards.map((stat, index) => (
                  <div key={index} className="p-6 rounded-3xl shadow-xl bg-white hover:shadow-2xl transition-all hover:-translate-y-1 w-full max-w-[200px] aspect-square flex flex-col items-center justify-center text-center">
                    <AnimatedIcon delay={index * 0.1}>
                      <stat.icon className="w-10 h-10 mb-3" style={{ color: stat.color }} />
                    </AnimatedIcon>
                    <div className="text-4xl font-black mb-2" style={{ color: stat.color }}>{stat.value}</div>
                    <div className="text-sm text-black font-medium leading-tight px-2">{t(stat.label)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Portfolio Section - Right after about text */}
        <div id="portfolio" className="mt-16 scroll-mt-28">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border-2 border-[#A88AED] mb-4">
              <AnimatedIcon delay={0.1}>
                <Images className="w-4 h-4 text-[#A88AED]" />
              </AnimatedIcon>
              <span className="text-sm font-bold text-[#A88AED] uppercase tracking-wider">
                {t('port_label')}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-[#A88AED] via-[#F5569B] to-[#CBD83B] bg-clip-text text-transparent">
              {t('port_title')}
            </h2>
            <p className="text-base sm:text-lg text-black max-w-2xl mx-auto">
              {t('port_subtitle')}
            </p>
          </div>

          {/* Portfolio Grid */}
          {categoriesLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#A88AED]" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {categories?.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category)}
                  className="group relative rounded-3xl overflow-hidden shadow-2xl md:hover:shadow-3xl transition-all duration-300 md:hover:-translate-y-2 text-left touch-manipulation active:scale-95"
                >
                  <div className="aspect-square relative overflow-hidden">
                    {category.main_image_url ? (
                      category.main_image_url.includes('.mp4') || category.main_image_url.includes('.mov') || category.main_image_url.includes('.webm') ? (
                        <video
                          src={category.main_image_url}
                          className="w-full h-full object-cover md:group-hover:scale-110 transition-transform duration-500"
                          preload="metadata"
                          muted
                          playsInline
                        />
                      ) : (
                        <img
                          src={category.main_image_url}
                          alt={getCategoryName(category)}
                          className="w-full h-full object-cover md:group-hover:scale-110 transition-transform duration-500"
                        />
                      )
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#A88AED] to-[#F5569B] flex items-center justify-center">
                        <Images className="w-16 h-16 text-white opacity-50" />
                      </div>
                    )}
                    <div className="absolute inset-0 opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 bg-white/20 backdrop-blur-sm flex items-center justify-center pointer-events-none">
                      <img 
                        src={logoTransparent} 
                        alt="NE Logo" 
                        className="w-32 h-32 opacity-60"
                      />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-white font-bold text-base sm:text-lg">{getCategoryName(category)}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* CTA Button */}
          <div className="text-center mt-10">
            <button
              onClick={() => document.querySelector('#contacts')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-2xl bg-gradient-to-r from-[#A88AED] to-[#F5569B] text-white font-bold text-base sm:text-lg shadow-2xl hover:shadow-3xl transition-all hover:scale-105 inline-flex items-center justify-center gap-2"
            >
              {t('hero_cta1')}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Image Gallery Modal */}
        {selectedCategory && (
          <ImageGalleryModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            images={images || []}
            categoryName={getCategoryName(selectedCategory)}
            initialIndex={0}
          />
        )}
      </div>
    </section>
  );
};
