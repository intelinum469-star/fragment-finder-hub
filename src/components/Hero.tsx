import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Sparkles, ArrowRight } from 'lucide-react';
import { FormattedText } from './FormattedText';
import { AnimatedIcon } from './AnimatedIcon';
import { ImageGalleryModal } from './ImageGalleryModal';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import nataliaPhoto from '@/assets/natalia-photo.jpg';
import portraitPainting from '@/assets/portrait-painting.jpg';
import fashionDress from '@/assets/fashion-dress.jpg';
import interiorMural from '@/assets/interior-mural.jpg';

const heroCards = [
  {
    bg: 'linear-gradient(135deg, #FFCBEB 0%, #F5569B 100%)',
    tag: 'hero_card1_tag',
    title: 'hero_card1_title',
    text: 'hero_card1_text',
    offer: 'hero_card1_offer',
    image: portraitPainting,
    rotate: 'hover:rotate-3',
    textColor: 'text-white',
    categorySlug: 'portraits', // связь с категорией портфолио
  },
  {
    bg: 'linear-gradient(135deg, #CBD83B 0%, #EFFEED 100%)',
    tag: 'hero_card2_tag',
    title: 'hero_card2_title',
    text: 'hero_card2_text',
    image: fashionDress,
    rotate: 'hover:-rotate-2',
    textColor: 'text-black',
    categorySlug: 'children',
  },
  {
    bg: 'linear-gradient(135deg, #1355B2 0%, #A88AED 100%)',
    tag: 'hero_card3_tag',
    title: 'hero_card3_title',
    text: 'hero_card3_text',
    image: interiorMural,
    rotate: 'hover:rotate-2',
    textColor: 'text-white',
    categorySlug: 'family',
  },
  {
    bg: 'linear-gradient(135deg, #EFFEED 0%, #CBD83B 100%)',
    tag: 'hero_card4_tag',
    title: 'hero_card4_title',
    text: 'hero_card4_text',
    image: 'https://images.unsplash.com/photo-1750330079974-223fc6114e90?w=400',
    rotate: 'hover:-rotate-3',
    textColor: 'text-black',
    categorySlug: 'events',
  },
];

export const Hero: React.FC = () => {
  const { t, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<{ slug: string; name: string } | null>(null);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);

  // Загрузка категорий портфолио
  const { data: categories } = useQuery({
    queryKey: ['portfolio-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('portfolio_categories')
        .select('*')
        .order('order_index', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  // Загрузка изображений для выбранной категории
  const { data: images } = useQuery({
    queryKey: ['portfolio-images', selectedCategory?.slug],
    queryFn: async () => {
      if (!selectedCategory) return [];
      
      const category = categories?.find(c => c.slug === selectedCategory.slug);
      if (!category) return [];

      const { data, error } = await supabase
        .from('portfolio_images')
        .select('*')
        .eq('category_id', category.id)
        .order('order_index', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedCategory && !!categories,
  });

  const handleCardClick = (categorySlug: string, cardTitle: string) => {
    const category = categories?.find(c => c.slug === categorySlug);
    if (category) {
      const categoryName = language === 'ru' ? category.name_ru : category.name_en;
      setSelectedCategory({ slug: categorySlug, name: categoryName });
    }
  };

  const handleCloseModal = () => {
    setSelectedCategory(null);
    setGalleryImages([]);
  };

  return (
    <section className="pt-10 sm:pt-12 md:pt-14 pb-12 sm:pb-16 relative z-10">
      <div className="container max-w-[1200px] mx-auto px-3 sm:px-4">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 lg:-mt-32">
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

          {/* Right - Cards Grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {heroCards.slice(0, 3).map((card, index) => (
              <div
                key={index}
                className={`relative rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 hover:scale-105 ${card.rotate} ${index === 2 ? 'col-span-2' : ''}`}
                style={{ background: card.bg }}
              >
                <div className={`${index === 2 ? 'aspect-[2/1]' : 'aspect-square'} relative overflow-hidden`}>
                  <img
                    src={card.image}
                    alt={t(card.title)}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className={`p-3 sm:p-4 ${card.textColor}`}>
                  <div className="text-xs sm:text-sm font-bold uppercase tracking-wider opacity-80 mb-1">
                    {t(card.tag)}
                  </div>
                  <div className="text-base sm:text-lg font-black mb-1">{t(card.title)}</div>
                  <div className="text-xs sm:text-sm opacity-90">{t(card.text)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Image Gallery Modal */}
        {selectedCategory && images && (
          <ImageGalleryModal
            isOpen={!!selectedCategory}
            onClose={handleCloseModal}
            images={images}
            categoryName={selectedCategory.name}
          />
        )}
      </div>
    </section>
  );
};
