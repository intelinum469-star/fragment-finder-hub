import { useEditMode } from '@/contexts/EditModeContext';
import { Edit3, Info } from 'lucide-react';

export const EditModeBanner = () => {
  const { isEditMode } = useEditMode();

  if (!isEditMode) return null;

  return (
    <div className="fixed top-20 left-0 right-0 z-40 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 shadow-lg">
      <div className="container max-w-[1400px] mx-auto flex items-center justify-center gap-3">
        <Edit3 className="w-5 h-5" />
        <span className="font-bold text-lg">Режим редактирования активен</span>
        <Info className="w-4 h-4" />
        <span className="text-sm">Наведите на элементы для редактирования</span>
      </div>
    </div>
  );
};
