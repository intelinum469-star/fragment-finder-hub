import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Pencil, Trash2, Plus, Upload, Loader2, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Category {
  id: string;
  name_ru: string;
  name_en: string;
  slug: string;
  main_image_url: string | null;
  order_index: number;
}

export const CategoriesManager = () => {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: categories, isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('portfolio_categories')
        .select('*')
        .order('order_index', { ascending: true });
      
      if (error) throw error;
      return data as Category[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (category: Omit<Category, 'id'>) => {
      const { error } = await supabase
        .from('portfolio_categories')
        .insert([category]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast({ title: 'Категория создана успешно!' });
      closeDialog();
    },
    onError: (error: Error) => {
      toast({ title: 'Ошибка', description: error.message, variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<Category> & { id: string }) => {
      const { error } = await supabase
        .from('portfolio_categories')
        .update(data)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast({ title: 'Категория обновлена!' });
      closeDialog();
    },
    onError: (error: Error) => {
      toast({ title: 'Ошибка', description: error.message, variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('portfolio_categories')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast({ title: 'Категория удалена!' });
    },
    onError: (error: Error) => {
      toast({ title: 'Ошибка', description: error.message, variant: 'destructive' });
    },
  });

  const handleImageUpload = async (file: File, categoryId?: string) => {
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

      if (categoryId) {
        await updateMutation.mutateAsync({ id: categoryId, main_image_url: publicUrl });
      } else if (editingCategory) {
        setEditingCategory({ ...editingCategory, main_image_url: publicUrl });
      }

      toast({ title: 'Изображение загружено!' });
    } catch (error: any) {
      toast({ title: 'Ошибка загрузки', description: error.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const openDialog = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
    } else {
      setEditingCategory({
        id: '',
        name_ru: '',
        name_en: '',
        slug: '',
        main_image_url: null,
        order_index: categories?.length || 0,
      });
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingCategory(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    if (editingCategory.id) {
      updateMutation.mutate(editingCategory);
    } else {
      const { id, main_image_url, ...data } = editingCategory;
      createMutation.mutate({ ...data, main_image_url: main_image_url || undefined });
    }
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Категории Портфолио</h2>
        <Button
          onClick={() => openDialog()}
          className="bg-gradient-to-r from-[#F5569B] to-[#A88AED] hover:opacity-90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Добавить категорию
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories?.map((category) => (
          <div
            key={category.id}
            className="border-2 border-gray-200 rounded-2xl overflow-hidden hover:border-[#F5569B] transition-all"
          >
            {category.main_image_url ? (
              <div className="relative aspect-video bg-gray-100">
                <img
                  src={category.main_image_url}
                  alt={category.name_ru}
                  className="w-full h-full object-cover"
                />
                <label className="absolute top-2 right-2 cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file, category.id);
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
                    if (file) handleImageUpload(file, category.id);
                  }}
                />
                <Upload className="w-8 h-8 text-gray-400" />
              </label>
            )}
            
            <div className="p-4 space-y-2">
              <h3 className="font-bold text-lg">{category.name_ru}</h3>
              <p className="text-sm text-gray-600">{category.name_en}</p>
              <p className="text-xs text-gray-500">Slug: {category.slug}</p>
              
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={() => openDialog(category)}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <Pencil className="w-4 h-4 mr-1" />
                  Изменить
                </Button>
                <Button
                  onClick={() => {
                    if (confirm('Удалить эту категорию?')) {
                      deleteMutation.mutate(category.id);
                    }
                  }}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingCategory?.id ? 'Редактировать категорию' : 'Новая категория'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Главное изображение</Label>
              {editingCategory?.main_image_url ? (
                <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={editingCategory.main_image_url}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setEditingCategory({ ...editingCategory, main_image_url: null })}
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
                <Label>Название (RU)</Label>
                <Input
                  value={editingCategory?.name_ru || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory!, name_ru: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>Название (EN)</Label>
                <Input
                  value={editingCategory?.name_en || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory!, name_en: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Slug (URL)</Label>
              <Input
                value={editingCategory?.slug || ''}
                onChange={(e) => setEditingCategory({ ...editingCategory!, slug: e.target.value })}
                placeholder="portraits"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Порядок сортировки</Label>
              <Input
                type="number"
                value={editingCategory?.order_index || 0}
                onChange={(e) => setEditingCategory({ ...editingCategory!, order_index: parseInt(e.target.value) })}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1 bg-gradient-to-r from-[#F5569B] to-[#A88AED]">
                {editingCategory?.id ? 'Сохранить' : 'Создать'}
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
