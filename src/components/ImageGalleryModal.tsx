import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';

interface Image {
  id: string;
  image_url: string;
  title_ru: string | null;
  title_en: string | null;
  description_ru: string | null;
  description_en: string | null;
}

interface ImageGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: Image[];
  categoryName: string;
  initialIndex?: number;
}

export const ImageGalleryModal: React.FC<ImageGalleryModalProps> = ({
  isOpen,
  onClose,
  images,
  categoryName,
  initialIndex = 0,
}) => {
  const { language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);

  const currentImage = images[currentIndex];

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    setIsZoomed(false);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    setIsZoomed(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') handlePrevious();
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === 'Escape') onClose();
  };

  if (!currentImage) return null;

  const title = language === 'ru' ? currentImage.title_ru : currentImage.title_en;
  const description = language === 'ru' ? currentImage.description_ru : currentImage.description_en;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-[95vw] max-h-[95vh] w-full h-full p-0 bg-black/95 border-none"
        onKeyDown={handleKeyDown}
      >
        <div className="relative w-full h-full flex flex-col">
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/80 to-transparent p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-bold text-lg sm:text-xl">{categoryName}</h3>
                <p className="text-white/70 text-sm">
                  {currentIndex + 1} / {images.length}
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>

          {/* Main Image */}
          <div className="flex-1 flex items-center justify-center p-4 sm:p-12 pt-20 pb-24">
            <div 
              className={`relative max-w-full max-h-full transition-transform duration-300 cursor-zoom-in ${
                isZoomed ? 'scale-150 cursor-zoom-out' : ''
              }`}
              onClick={() => setIsZoomed(!isZoomed)}
            >
              <img
                src={currentImage.image_url}
                alt={title || categoryName}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              />
              {!isZoomed && (
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full p-2">
                  <ZoomIn className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
          </div>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-colors z-10"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-colors z-10"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </>
          )}

          {/* Bottom Info & Thumbnails */}
          <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 to-transparent p-4 sm:p-6">
            {(title || description) && (
              <div className="mb-4">
                {title && <h4 className="text-white font-bold text-base sm:text-lg mb-1">{title}</h4>}
                {description && <p className="text-white/80 text-sm">{description}</p>}
              </div>
            )}

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => {
                      setCurrentIndex(index);
                      setIsZoomed(false);
                    }}
                    className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden transition-all ${
                      index === currentIndex
                        ? 'ring-2 ring-[#F5569B] scale-110'
                        : 'opacity-50 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={image.image_url}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
