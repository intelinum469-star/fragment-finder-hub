import { useState } from 'react';
import { useEditMode } from '@/contexts/EditModeContext';
import { Pencil, Check, X } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';

interface EditableTextProps {
  value: string;
  onSave: (newValue: string) => Promise<void>;
  multiline?: boolean;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
}

export const EditableText = ({ 
  value, 
  onSave, 
  multiline = false, 
  className = '',
  as: Component = 'p'
}: EditableTextProps) => {
  const { isEditMode } = useEditMode();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(editValue);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  if (!isEditMode) {
    return <Component className={className}>{value}</Component>;
  }

  if (isEditing) {
    return (
      <div className="relative group">
        {multiline ? (
          <Textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className={`${className} border-2 border-primary`}
            rows={5}
          />
        ) : (
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className={`${className} border-2 border-primary`}
          />
        )}
        <div className="flex gap-2 mt-2">
          <Button 
            size="sm" 
            onClick={handleSave} 
            disabled={isSaving}
            className="bg-green-500 hover:bg-green-600"
          >
            <Check className="w-4 h-4 mr-1" />
            Сохранить
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleCancel}
            disabled={isSaving}
          >
            <X className="w-4 h-4 mr-1" />
            Отмена
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group">
      <Component className={className}>{value}</Component>
      <Button
        size="sm"
        variant="outline"
        className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white shadow-lg"
        onClick={() => setIsEditing(true)}
      >
        <Pencil className="w-4 h-4" />
      </Button>
    </div>
  );
};
