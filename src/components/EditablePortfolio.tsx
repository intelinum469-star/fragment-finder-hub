import React, { useState } from 'react';
import { useEditMode } from '@/contexts/EditModeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Images, Plus, Pencil, Trash2 } from 'lucide-react';
import { AnimatedIcon } from './AnimatedIcon';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useToast } from '@/hooks/use-toast';

export const EditablePortfolio: React.FC = () => {
  const { t, language } = useLanguage();
  const { isEditMode } = useEditMode();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);

  const { data: categories, refetch: refetchCategories } = useQuery({
    queryKey: ['portfolio-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('portfolio_categories')
        .select('*')
        .order('order_index');
      
      if (error) throw error;
      return data;
    },
  });

  const { data: images, refetch: refetchImages } = useQuery({
    queryKey: ['portfolio-images', selectedCategory],
    queryFn: async () => {
      if (!selectedCategory) return [];
      
      const { data, error } = await supabase
        .from('portfolio_images')
        .select('*')
        .eq('category_id', selectedCategory)
        .order('order_index');
      
      if (error) throw error;
      return data;
    },
    enabled: !!selectedCategory,
  });

  const handleAddCategory = async (formData: FormData) => {
    const name_ru = formData.get('name_ru') as string;
    const name_en = formData.get('name_en') as string;
    const slug = formData.get('slug') as string;

    const { error } = await supabase
      .from('portfolio_categories')
      .insert({ name_ru, name_en, slug });

    if (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось добавить категорию',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Успешно',
        description: 'Категория добавлена',
      });
      setIsDialogOpen(false);
      refetchCategories();
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Удалить категорию?')) return;

    const { error } = await supabase
      .from('portfolio_categories')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить категорию',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Успешно',
        description: 'Категория удалена',
      });
      refetchCategories();
    }
  };

  const handleDeleteImage = async (id: string) => {
    if (!confirm('Удалить изображение?')) return;

    const { error } = await supabase
      .from('portfolio_images')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить изображение',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Успешно',
        description: 'Изображение удалено',
      });
      refetchImages();
    }
  };

  if (!isEditMode) {
    return null;
  }

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
            Управление Портфолио
          </h2>
        </div>

        {!selectedCategory ? (
          <>
            {/* Categories View */}
            <div className="mb-6 flex justify-between items-center">
              <h3 className="text-2xl font-black">Категории</h3>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Добавить категорию
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories?.map((category) => (
                <div key={category.id} className="bg-white rounded-2xl shadow-lg p-6 relative group">
                  {category.main_image_url && (
                    <img
                      src={category.main_image_url}
                      alt={language === 'ru' ? category.name_ru : category.name_en}
                      className="w-full h-48 object-cover rounded-xl mb-4"
                    />
                  )}
                  <h4 className="text-xl font-bold mb-2">
                    {language === 'ru' ? category.name_ru : category.name_en}
                  </h4>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => setSelectedCategory(category.id)}
                      className="flex-1"
                    >
                      Открыть
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Images View */}
            <div className="mb-6 flex justify-between items-center">
              <div>
                <Button variant="outline" onClick={() => setSelectedCategory(null)} className="mb-2">
                  ← Назад к категориям
                </Button>
                <h3 className="text-2xl font-black">
                  {categories?.find((c) => c.id === selectedCategory)?.[language === 'ru' ? 'name_ru' : 'name_en']}
                </h3>
              </div>
              <Button onClick={() => setIsImageDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Добавить изображение
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {images?.map((image) => (
                <div key={image.id} className="bg-white rounded-2xl shadow-lg overflow-hidden relative group">
                  <img
                    src={image.image_url}
                    alt={language === 'ru' ? image.title_ru || '' : image.title_en || ''}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-4">
                    <p className="font-bold mb-2">
                      {language === 'ru' ? image.title_ru : image.title_en}
                    </p>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteImage(image.id)}
                      className="w-full"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Удалить
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Add Category Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Добавить категорию</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddCategory(new FormData(e.currentTarget));
              }}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="name_ru">Название (RU)</Label>
                <Input id="name_ru" name="name_ru" required />
              </div>
              <div>
                <Label htmlFor="name_en">Название (EN)</Label>
                <Input id="name_en" name="name_en" required />
              </div>
              <div>
                <Label htmlFor="slug">Slug (URL)</Label>
                <Input id="slug" name="slug" required />
              </div>
              <Button type="submit" className="w-full">
                Добавить
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};
