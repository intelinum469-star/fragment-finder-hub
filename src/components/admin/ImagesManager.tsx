import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Pencil, Trash2, Plus, Upload, Loader2, X, ChevronLeft, Star } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Category {
  id: string;
  name_ru: string;
  name_en: string;
  main_image_url: string | null;
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

export const ImagesManager = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [editingImage, setEditingImage] = useState<PortfolioImage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [bulkUploading, setBulkUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const bulkInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: categories } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('portfolio_categories')
        .select('id, name_ru, name_en, main_image_url')
        .order('order_index', { ascending: true });
      
      if (error) throw error;
      return data as Category[];
    },
  });

  const { data: images, isLoading } = useQuery({
    queryKey: ['admin-images', selectedCategoryId],
    queryFn: async () => {
      if (!selectedCategoryId) return [];
      
      const { data, error } = await supabase
        .from('portfolio_images')
        .select('*')
        .eq('category_id', selectedCategoryId)
        .order('order_index', { ascending: true });
      
      if (error) throw error;
      return data as PortfolioImage[];
    },
    enabled: !!selectedCategoryId,
  });

  const createMutation = useMutation({
    mutationFn: async (image: Omit<PortfolioImage, 'id'>) => {
      const { error } = await supabase
        .from('portfolio_images')
        .insert([image]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-images'] });
      toast({ title: 'Изображение добавлено!' });
      closeDialog();
    },
    onError: (error: Error) => {
      toast({ title: 'Ошибка', description: error.message, variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<PortfolioImage> & { id: string }) => {
      const { error } = await supabase
        .from('portfolio_images')
        .update(data)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-images'] });
      toast({ title: 'Изображение обновлено!' });
      closeDialog();
    },
    onError: (error: Error) => {
      toast({ title: 'Ошибка', description: error.message, variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('portfolio_images')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-images'] });
      toast({ title: 'Изображение удалено!' });
    },
    onError: (error: Error) => {
      toast({ title: 'Ошибка', description: error.message, variant: 'destructive' });
    },
  });

  const setMainImageMutation = useMutation({
    mutationFn: async ({ categoryId, imageUrl }: { categoryId: string; imageUrl: string }) => {
      const { error } = await supabase
        .from('portfolio_categories')
        .update({ main_image_url: imageUrl })
        .eq('id', categoryId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast({ title: 'Главное изображение установлено!' });
    },
    onError: (error: Error) => {
      toast({ title: 'Ошибка', description: error.message, variant: 'destructive' });
    },
  });

  const handleImageUpload = async (file: File) => {
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

      if (editingImage) {
        const isVideo = file.type.startsWith('video/');
        setEditingImage({ 
          ...editingImage, 
          image_url: publicUrl,
          media_type: isVideo ? 'video' : 'image'
        });
      }

      toast({ title: 'Файл загружен!' });
    } catch (error: any) {
      toast({ title: 'Ошибка загрузки', description: error.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const handleBulkUpload = async (files: FileList) => {
    setBulkUploading(true);
    setUploadProgress({ current: 0, total: files.length });

    const results = { success: 0, failed: 0 };
    
    const maxOrderIndex = images?.reduce((max, img) => Math.max(max, img.order_index), 0) || 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setUploadProgress({ current: i + 1, total: files.length });

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

        const isVideo = file.type.startsWith('video/');

        const { error: insertError } = await supabase
          .from('portfolio_images')
          .insert({
            category_id: selectedCategoryId!,
            image_url: publicUrl,
            title_ru: null,
            title_en: null,
            description_ru: null,
            description_en: null,
            order_index: maxOrderIndex + i + 1,
            media_type: isVideo ? 'video' : 'image',
          });

        if (insertError) throw insertError;

        results.success++;
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);
        results.failed++;
      }
    }

    setBulkUploading(false);
    setUploadProgress({ current: 0, total: 0 });
    queryClient.invalidateQueries({ queryKey: ['admin-images'] });

    toast({
      title: 'Массовая загрузка завершена',
      description: `Успешно: ${results.success}, Ошибок: ${results.failed}`,
    });
  };

  const openDialog = (image?: PortfolioImage) => {
    if (image) {
      setEditingImage(image);
    } else {
      setEditingImage({
        id: '',
        category_id: selectedCategoryId || '',
        image_url: '',
        title_ru: '',
        title_en: '',
        description_ru: '',
        description_en: '',
        order_index: images?.length || 0,
        media_type: 'image',
      });
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingImage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingImage || !editingImage.image_url) {
      toast({ title: 'Ошибка', description: 'Загрузите изображение', variant: 'destructive' });
      return;
    }

    if (editingImage.id) {
      updateMutation.mutate(editingImage);
    } else {
      const { id, title_ru, title_en, description_ru, description_en, ...required } = editingImage;
      createMutation.mutate({
        ...required,
        title_ru: title_ru || null,
        title_en: title_en || null,
        description_ru: description_ru || null,
        description_en: description_en || null,
      });
    }
  };

  const selectedCategory = categories?.find(c => c.id === selectedCategoryId);

  if (!selectedCategoryId) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Изображения в Портфолио</h2>
        <p className="text-gray-600">Выберите категорию для управления изображениями:</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories?.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategoryId(category.id)}
              className="border-2 border-gray-200 rounded-2xl overflow-hidden hover:border-[#F5569B] transition-all text-left"
            >
              {category.main_image_url && (
                <div className="aspect-video bg-gray-100">
                  <img
                    src={category.main_image_url}
                    alt={category.name_ru}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <h3 className="font-bold text-lg">{category.name_ru}</h3>
                <p className="text-sm text-gray-600">{category.name_en}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          onClick={() => setSelectedCategoryId(null)}
          variant="outline"
          size="sm"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Назад
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold">{selectedCategory?.name_ru}</h2>
          <p className="text-gray-600">{selectedCategory?.name_en}</p>
        </div>
        <input
          ref={bulkInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleBulkUpload(e.target.files);
            }
          }}
          disabled={bulkUploading}
        />
        <Button
          onClick={() => bulkInputRef.current?.click()}
          variant="outline"
          disabled={bulkUploading}
        >
          {bulkUploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {uploadProgress.current} / {uploadProgress.total}
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Загрузить несколько
            </>
          )}
        </Button>
        <Button
          onClick={() => openDialog()}
          className="bg-gradient-to-r from-[#F5569B] to-[#A88AED] hover:opacity-90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Добавить изображение
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-[#F5569B]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images?.map((image) => (
            <div
              key={image.id}
              className="border-2 border-gray-200 rounded-2xl overflow-hidden hover:border-[#F5569B] transition-all"
            >
              <div className="aspect-video bg-gray-100 relative">
                <img
                  src={image.image_url}
                  alt={image.title_ru || ''}
                  className="w-full h-full object-cover"
                />
                {selectedCategory?.main_image_url === image.image_url && (
                  <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold">
                    <Star className="w-3 h-3 fill-white" />
                    Главное
                  </div>
                )}
              </div>
              
              <div className="p-4 space-y-2">
                {image.title_ru && <h3 className="font-bold">{image.title_ru}</h3>}
                {image.description_ru && (
                  <p className="text-sm text-gray-600 line-clamp-2">{image.description_ru}</p>
                )}
                
                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={() => setMainImageMutation.mutate({
                      categoryId: selectedCategoryId!,
                      imageUrl: image.image_url,
                    })}
                    variant="outline"
                    size="sm"
                    className="flex-1 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                    disabled={selectedCategory?.main_image_url === image.image_url}
                  >
                    <Star className="w-4 h-4 mr-1" />
                    Главное
                  </Button>
                  <Button
                    onClick={() => openDialog(image)}
                    variant="outline"
                    size="sm"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => {
                      if (confirm('Удалить это изображение?')) {
                        deleteMutation.mutate(image.id);
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
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingImage?.id ? 'Редактировать изображение' : 'Новое изображение'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Изображение *</Label>
              {editingImage?.image_url ? (
                <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={editingImage.image_url}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setEditingImage({ ...editingImage, image_url: '' })}
                    className="absolute top-2 right-2 bg-white p-2 rounded-lg shadow-lg hover:bg-gray-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="aspect-video bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200 rounded-lg border-2 border-dashed border-gray-300">
                  <input
                    type="file"
                    accept="image/*,video/*"
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
                  value={editingImage?.title_ru || ''}
                  onChange={(e) => setEditingImage({ ...editingImage!, title_ru: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Заголовок (EN)</Label>
                <Input
                  value={editingImage?.title_en || ''}
                  onChange={(e) => setEditingImage({ ...editingImage!, title_en: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Описание (RU)</Label>
              <Textarea
                value={editingImage?.description_ru || ''}
                onChange={(e) => setEditingImage({ ...editingImage!, description_ru: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Описание (EN)</Label>
              <Textarea
                value={editingImage?.description_en || ''}
                onChange={(e) => setEditingImage({ ...editingImage!, description_en: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Порядок отображения</Label>
              <Input
                type="number"
                value={editingImage?.order_index || 0}
                onChange={(e) => setEditingImage({ ...editingImage!, order_index: parseInt(e.target.value) })}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={closeDialog}>
                Отмена
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-[#F5569B] to-[#A88AED] hover:opacity-90"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Сохранение...
                  </>
                ) : (
                  'Сохранить'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
