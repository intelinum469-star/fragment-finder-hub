import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Pencil, Upload, Loader2, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Section {
  id: string;
  key: string;
  title_ru: string | null;
  title_en: string | null;
  description_ru: string | null;
  description_en: string | null;
  image_url: string | null;
  order_index: number;
}

export const SectionsManager = () => {
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: sections, isLoading } = useQuery({
    queryKey: ['admin-sections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sections')
        .select('*')
        .order('order_index', { ascending: true });
      
      if (error) throw error;
      return data as Section[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<Section> & { id: string }) => {
      const { error } = await supabase
        .from('sections')
        .update(data)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-sections'] });
      toast({ title: 'Секция обновлена!' });
      closeDialog();
    },
    onError: (error: Error) => {
      toast({ title: 'Ошибка', description: error.message, variant: 'destructive' });
    },
  });

  const handleImageUpload = async (file: File, sectionId?: string) => {
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('portfolio-images')
        .getPublicUrl(filePath);

      if (sectionId) {
        await updateMutation.mutateAsync({ id: sectionId, image_url: publicUrl });
      } else if (editingSection) {
        setEditingSection({ ...editingSection, image_url: publicUrl });
      }

      toast({ title: 'Изображение загружено!' });
    } catch (error: any) {
      toast({ title: 'Ошибка загрузки', description: error.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const openDialog = (section: Section) => {
    setEditingSection(section);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingSection(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSection) return;
    updateMutation.mutate(editingSection);
  };

  const getSectionName = (key: string) => {
    const names: Record<string, string> = {
      'about': 'О себе',
      'formats': 'Форматы',
      'prices': 'Цены',
      'why-me': 'Почему я',
      'process': 'Процесс',
      'contacts': 'Контакты',
    };
    return names[key] || key;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-[#F5569B]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Секции сайта</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections?.map((section) => (
          <div
            key={section.id}
            className="border-2 border-gray-200 rounded-2xl overflow-hidden hover:border-[#F5569B] transition-all"
          >
            {section.image_url ? (
              <div className="relative aspect-video bg-gray-100">
                <img
                  src={section.image_url}
                  alt={section.title_ru || ''}
                  className="w-full h-full object-cover"
                />
                <label className="absolute top-2 right-2 cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file, section.id);
                    }}
                  />
                  <div className="bg-white p-2 rounded-lg shadow-lg hover:bg-gray-100">
                    <Upload className="w-4 h-4" />
                  </div>
                </label>
              </div>
            ) : (
              <label className="aspect-video bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file, section.id);
                  }}
                />
                <Upload className="w-8 h-8 text-gray-400" />
              </label>
            )}
            
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg">{getSectionName(section.key)}</h3>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {section.key}
                </span>
              </div>
              {section.title_ru && <p className="text-sm font-medium">{section.title_ru}</p>}
              {section.description_ru && (
                <p className="text-sm text-gray-600 line-clamp-2">{section.description_ru}</p>
              )}
              
              <Button
                onClick={() => openDialog(section)}
                variant="outline"
                size="sm"
                className="w-full mt-2"
              >
                <Pencil className="w-4 h-4 mr-1" />
                Редактировать
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Редактировать: {editingSection && getSectionName(editingSection.key)}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Изображение</Label>
              {editingSection?.image_url ? (
                <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={editingSection.image_url}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setEditingSection({ ...editingSection, image_url: null })}
                    className="absolute top-2 right-2 bg-white p-2 rounded-lg shadow-lg hover:bg-gray-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="aspect-video bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200 rounded-lg border-2 border-dashed border-gray-300">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file);
                    }}
                    disabled={uploading}
                  />
                  {uploading ? (
                    <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                  ) : (
                    <Upload className="w-8 h-8 text-gray-400" />
                  )}
                </label>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Заголовок (RU)</Label>
                <Input
                  value={editingSection?.title_ru || ''}
                  onChange={(e) => setEditingSection({ ...editingSection!, title_ru: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Заголовок (EN)</Label>
                <Input
                  value={editingSection?.title_en || ''}
                  onChange={(e) => setEditingSection({ ...editingSection!, title_en: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Описание (RU)</Label>
              <Textarea
                value={editingSection?.description_ru || ''}
                onChange={(e) => setEditingSection({ ...editingSection!, description_ru: e.target.value })}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Описание (EN)</Label>
              <Textarea
                value={editingSection?.description_en || ''}
                onChange={(e) => setEditingSection({ ...editingSection!, description_en: e.target.value })}
                rows={4}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1 bg-gradient-to-r from-[#F5569B] to-[#A88AED]">
                Сохранить
              </Button>
              <Button type="button" variant="outline" onClick={closeDialog}>
                Отмена
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
