import { useState, useRef } from 'react';
import { useEditMode } from '@/contexts/EditModeContext';
import { Upload, Loader2, Check, X } from 'lucide-react';
import { Button } from './ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EditableImageProps {
  imageUrl: string | null;
  onSave: (newUrl: string) => Promise<void>;
  className?: string;
  alt?: string;
  bucket?: string;
}

export const EditableImage = ({ 
  imageUrl, 
  onSave, 
  className = '',
  alt = 'Image',
  bucket = 'portfolio-images'
}: EditableImageProps) => {
  const { isEditMode } = useEditMode();
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Ошибка',
        description: 'Пожалуйста, выберите изображение',
        variant: 'destructive',
      });
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from(bucket)
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      await onSave(publicUrl);
      
      setPreviewUrl(null);
      setSelectedFile(null);
      
      toast({
        title: 'Успешно',
        description: 'Изображение обновлено',
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить изображение',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!isEditMode) {
    return imageUrl ? (
      <img src={imageUrl} alt={alt} className={className} />
    ) : (
      <div className={`${className} bg-gray-200 flex items-center justify-center`}>
        <span className="text-gray-400">Нет изображения</span>
      </div>
    );
  }

  return (
    <div className="relative group">
      <img 
        src={previewUrl || imageUrl || '/placeholder.svg'} 
        alt={alt} 
        className={`${className} ${previewUrl ? 'border-4 border-primary' : ''}`} 
      />
      
      {!previewUrl && (
        <Button
          size="sm"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white text-black hover:bg-gray-100 shadow-lg"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-4 h-4 mr-1" />
          Загрузить
        </Button>
      )}

      {previewUrl && (
        <div className="absolute bottom-2 left-2 right-2 flex gap-2">
          <Button
            size="sm"
            onClick={handleUpload}
            disabled={isUploading}
            className="flex-1 bg-green-500 hover:bg-green-600"
          >
            {isUploading ? (
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
            ) : (
              <Check className="w-4 h-4 mr-1" />
            )}
            Сохранить
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCancel}
            disabled={isUploading}
            className="bg-white"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};
