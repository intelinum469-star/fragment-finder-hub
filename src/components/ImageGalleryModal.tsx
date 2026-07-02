import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, Grid3X3, Maximize2, ArrowLeft } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';

interface Image {
  id: string;
  image_url: string;
  title_ru: string | null;
  title_en: string | null;
  description_ru: string | null;
  description_en: string | null;
  media_type?: string;
}

interface ImageGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: Image[];
  categoryName: string;
  initialIndex?: number;
}

type ViewMode = 'single' | 'grid';

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
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const thumbsRef = useRef<HTMLDivElement>(null);
  const gridItemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const currentImage = images[currentIndex];

  // Scroll grid to the current image when entering grid view
  useEffect(() => {
    if (viewMode === 'grid') {
      const el = gridItemRefs.current[currentIndex];
      if (el) {
        requestAnimationFrame(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
        });
      }
    }
  }, [viewMode, currentIndex]);

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setIsZoomed(false);
      setViewMode('grid');
    }
  }, [isOpen, initialIndex]);

  // Auto-scroll thumbnail strip to current item
  useEffect(() => {
    if (viewMode === 'single' && thumbsRef.current) {
      const thumb = thumbsRef.current.children[currentIndex] as HTMLElement;
      if (thumb) {
        thumb.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [currentIndex, viewMode]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    setIsZoomed(false);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    setIsZoomed(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (viewMode === 'grid') {
      if (e.key === 'Escape') {
        if (isZoomed) setIsZoomed(false);
        else setViewMode('single');
      }
      return;
    }
    if (e.key === 'ArrowLeft') handlePrevious();
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === 'Escape') {
      if (isZoomed) setIsZoomed(false);
      else onClose();
    }
  };

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd || isZoomed) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) handleNext();
    else if (distance < -minSwipeDistance) handlePrevious();
  };

  if (!currentImage && viewMode === 'single') return null;

  const getTitle = (img: Image) => language === 'ru' ? img.title_ru : img.title_en;
  const getDescription = (img: Image) => language === 'ru' ? img.description_ru : img.description_en;

  const isVideo = (img: Image) =>
    img.media_type === 'video' || /\.(mp4|mov|webm|ogg)(\?.*)?$/i.test(img.image_url);

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
    setIsZoomed(false);
    setViewMode('single');
  };

  const handleGridItemClick = (index: number) => {
    setCurrentIndex(index);
    setViewMode('single');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-[100vw] max-h-[100vh] w-full h-full p-0 bg-black/95 border-none rounded-none"
        onKeyDown={handleKeyDown}
      >
        <DialogTitle className="sr-only">{categoryName}</DialogTitle>
        <DialogDescription className="sr-only">Media viewer with gallery navigation</DialogDescription>

        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-30 bg-gradient-to-b from-black/80 to-transparent px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between">
          <div>
            <h3 className="text-white font-bold text-base sm:text-lg">{categoryName}</h3>
            {viewMode === 'single' && images.length > 1 && (
              <p className="text-white/60 text-xs sm:text-sm">
                {currentIndex + 1} / {images.length}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {images.length > 1 && (
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'single' : 'grid')}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-colors"
                title={viewMode === 'grid' ? 'Single view' : 'Back to grid'}
              >
                {viewMode === 'grid' ? (
                  <Maximize2 className="w-5 h-5 text-white" />
                ) : (
                  <ArrowLeft className="w-5 h-5 text-white" />
                )}
              </button>
            )}
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-colors"
              title="Close"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* ===== GRID VIEW ===== */}
        {viewMode === 'grid' && (
          <div className="w-full h-full pt-16 pb-6 px-4 overflow-y-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => handleGridItemClick(index)}
                  className="relative aspect-square rounded-xl overflow-hidden bg-neutral-900 hover:ring-2 hover:ring-[#F5569B] transition-all group"
                >
                  {isVideo(image) ? (
                    <video
                      src={image.image_url}
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                      preload="metadata"
                    />
                  ) : (
                    <img
                      src={image.image_url}
                      alt={getTitle(image) || `${categoryName} ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ===== SINGLE VIEW ===== */}
        {viewMode === 'single' && currentImage && (
          <div
            className="relative w-full h-full flex flex-col"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Main Media */}
            <div className="flex-1 flex items-center justify-center px-2 sm:px-6 pt-16 pb-36 sm:pb-40">
              {isVideo(currentImage) ? (
                <div className="relative w-full h-full flex items-center justify-center" style={{ maxHeight: 'calc(100vh - 220px)' }}>
                  <video
                    key={currentImage.id}
                    src={currentImage.image_url}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full max-w-full max-h-full object-contain rounded-lg"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : (
                <div
                  className={`relative w-full h-full flex items-center justify-center transition-transform duration-300 ${
                    isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
                  }`}
                  onClick={() => setIsZoomed(!isZoomed)}
                  style={{ maxHeight: 'calc(100vh - 220px)' }}
                >
                  <img
                    src={currentImage.image_url}
                    alt={getTitle(currentImage) || categoryName}
                    className="w-full h-full max-w-full max-h-full object-contain rounded-lg"
                  />
                  {!isZoomed && (
                    <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm rounded-full p-2">
                      <ZoomIn className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Navigation arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevious}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-colors z-10"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-colors z-10"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </button>
              </>
            )}

            {/* Bottom panel */}
            <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-4 pb-4 pt-8 sm:px-6 sm:pb-6 sm:pt-10">
              {/* Title & description */}
              {(getTitle(currentImage) || getDescription(currentImage)) && (
                <div className="mb-3">
                  {getTitle(currentImage) && (
                    <h4 className="text-white font-bold text-sm sm:text-base mb-0.5">
                      {getTitle(currentImage)}
                    </h4>
                  )}
                  {getDescription(currentImage) && (
                    <p className="text-white/70 text-xs sm:text-sm line-clamp-2">
                      {getDescription(currentImage)}
                    </p>
                  )}
                </div>
              )}

              {/* Thumbnail strip */}
              {images.length > 1 && (
                <div
                  ref={thumbsRef}
                  className="flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
                >
                  {images.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => handleThumbnailClick(index)}
                      className={`flex-shrink-0 rounded-lg overflow-hidden transition-all ${
                        index === currentIndex
                          ? 'ring-2 ring-[#F5569B] scale-110'
                          : 'opacity-50 hover:opacity-100'
                      }`}
                      style={{ width: 'clamp(56px, 12vw, 80px)', height: 'clamp(56px, 12vw, 80px)' }}
                    >
                      {isVideo(image) ? (
                        <video
                          src={image.image_url}
                          className="w-full h-full object-cover"
                          muted
                          playsInline
                          preload="metadata"
                        />
                      ) : (
                        <img
                          src={image.image_url}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
