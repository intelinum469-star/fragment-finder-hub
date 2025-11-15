import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Images, ArrowRight, Loader2 } from 'lucide-react';
import { AnimatedIcon } from './AnimatedIcon';
import { ImageGalleryModal } from './ImageGalleryModal';

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
}

export const Portfolio: React.FC = () => {
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

  const { data: images, isLoading: imagesLoading } = useQuery({
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
    <section id="portfolio" className="py-12 sm:py-16 pt-20 sm:pt-24 scroll-mt-28 relative z-10">
      <div className="container max-w-[1200px] mx-auto px-3 sm:px-4">
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
            {categories?.map((category, index) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category)}
                className="group relative rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-2 text-left"
              >
                <div className="aspect-square relative overflow-hidden">
                  {category.main_image_url ? (
                    <img
                      src={category.main_image_url}
                      alt={getCategoryName(category)}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#A88AED] to-[#F5569B] flex items-center justify-center">
                      <Images className="w-16 h-16 text-white opacity-50" />
                    </div>
                  )}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: 'linear-gradient(135deg, rgba(168,138,237,0.9) 0%, rgba(245,86,155,0.9) 100%)' }}
                  />
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
    </section>
  );
};
