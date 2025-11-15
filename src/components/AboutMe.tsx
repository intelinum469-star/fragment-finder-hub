import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useEditMode } from '../contexts/EditModeContext';
import { Heart, Palette, Award } from 'lucide-react';
import { FormattedText } from './FormattedText';
import { AnimatedIcon } from './AnimatedIcon';
import { EditableImage } from './EditableImage';
import { EditableText } from './EditableText';
import nataliaPhoto from '@/assets/natalia-photo-new.jpg';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const statsCards = [
  { icon: Award, value: '30+', label: 'about_stat1', color: '#F5569B' },
  { icon: Palette, value: '100+', label: 'about_stat2', color: '#CBD83B' },
  { icon: Heart, value: '100%', label: 'about_stat4', color: '#1355B2' },
];

export const AboutMe: React.FC = () => {
  const { t, language } = useLanguage();
  const { isEditMode } = useEditMode();
  const { toast } = useToast();
  const [sectionData, setSectionData] = useState<any>(null);

  useEffect(() => {
    loadSectionData();
  }, []);

  const loadSectionData = async () => {
    const { data, error } = await supabase
      .from('sections')
      .select('*')
      .eq('key', 'about')
      .single();

    if (data) {
      setSectionData(data);
    }
  };

  const handleSaveText = async (field: string, value: string) => {
    const { error } = await supabase
      .from('sections')
      .update({ [field]: value })
      .eq('key', 'about');

    if (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить изменения',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Сохранено',
        description: 'Изменения успешно сохранены',
      });
      loadSectionData();
    }
  };

  const handleSaveImage = async (url: string) => {
    const { error } = await supabase
      .from('sections')
      .update({ image_url: url })
      .eq('key', 'about');

    if (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить изображение',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Сохранено',
        description: 'Изображение успешно обновлено',
      });
      loadSectionData();
    }
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
          {isEditMode && sectionData ? (
            <EditableText
              value={language === 'ru' ? sectionData.title_ru : sectionData.title_en}
              onSave={(value) => handleSaveText(language === 'ru' ? 'title_ru' : 'title_en', value)}
              as="h2"
              className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-[#A88AED] via-[#1355B2] to-[#1355B2] bg-clip-text text-transparent"
            />
          ) : (
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-[#A88AED] via-[#1355B2] to-[#1355B2] bg-clip-text text-transparent">
              {t('about_title')}
            </h2>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          {/* Photo on the left */}
          <div className="relative w-full">
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              {isEditMode && sectionData ? (
                <EditableImage
                  imageUrl={sectionData.image_url || nataliaPhoto}
                  onSave={handleSaveImage}
                  className="w-full h-auto object-cover"
                  alt="Natalia Egorova"
                />
              ) : (
                <img 
                  src={sectionData?.image_url || nataliaPhoto} 
                  alt="Natalia Egorova" 
                  className="w-full h-auto object-cover"
                />
              )}
            </div>
          </div>

          {/* Content on the right */}
          <div className="space-y-6">
            <h3 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-[#F5569B] to-[#A88AED] bg-clip-text text-transparent">
              {t('about_name')}
            </h3>
            <p className="text-lg sm:text-xl font-bold text-black">{t('about_subtitle')}</p>
            
            {isEditMode && sectionData ? (
              <div className="space-y-4">
                <EditableText
                  value={language === 'ru' ? sectionData.description_ru : sectionData.description_en}
                  onSave={(value) => handleSaveText(language === 'ru' ? 'description_ru' : 'description_en', value)}
                  multiline
                  className="text-base sm:text-lg text-black leading-relaxed"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-base sm:text-lg text-black leading-relaxed"><FormattedText text={t('about_p1')} /></p>
                <p className="text-base sm:text-lg text-black leading-relaxed"><FormattedText text={t('about_p2')} /></p>
                <p className="text-base sm:text-lg text-black leading-relaxed"><FormattedText text={t('about_p3')} /></p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 justify-items-center">
              {statsCards.map((stat, index) => (
                <div key={index} className="p-4 sm:p-6 rounded-3xl shadow-xl bg-white hover:shadow-2xl transition-all hover:-translate-y-1 w-full max-w-[200px] aspect-square flex flex-col items-center justify-center">
                  <AnimatedIcon delay={index * 0.1}>
                    <stat.icon className="w-10 h-10 mb-3" style={{ color: stat.color }} />
                  </AnimatedIcon>
                   <div className="text-3xl sm:text-4xl font-black mb-2" style={{ color: stat.color }}>{stat.value}</div>
                   <div className="text-xs sm:text-sm text-black font-medium">{t(stat.label)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
