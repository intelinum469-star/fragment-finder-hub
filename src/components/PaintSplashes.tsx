import React from 'react';
import watercolorBg from '@/assets/watercolor-bg-new.jpg';

export const PaintSplashes: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{ backgroundImage: `url(${watercolorBg})` }}
      />
      
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 scale-110 rotate-180"
        style={{ backgroundImage: `url(${watercolorBg})` }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-b from-[#EFFEED]/30 via-transparent to-[#EFFEED]/30" />
    </div>
  );
};
