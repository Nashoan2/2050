import React from 'react';

interface LogoBadgeProps {
  size?: number; // size in px
  logoBase64?: string;
  className?: string;
}

export const AlmamlakaLogoBadge: React.FC<LogoBadgeProps> = ({
  size = 80,
  logoBase64 = '',
  className = '',
}) => {
  const imgSrc = logoBase64 ? (logoBase64.startsWith('data:') ? logoBase64 : `data:image/png;base64,${logoBase64}`) : '/app_logo.jpg';

  return (
    <div
      style={{ width: `${size}px`, height: `${size}px` }}
      className={`relative rounded-full p-[3px] bg-gradient-to-tr from-[#00F2FE] via-[#8B5CF6] to-[#EC4899] shadow-[0_0_20px_rgba(0,242,254,0.4)] flex items-center justify-center shrink-0 cursor-pointer select-none transition-transform hover:scale-105 active:scale-95 ${className}`}
    >
      <div className="w-full h-full rounded-full bg-[#04091A] p-[2px] flex items-center justify-center overflow-hidden border-2 border-[#5E258D]">
        <img
          src={imgSrc}
          alt="Almamlaka Logo"
          className="w-full h-full object-cover rounded-full"
          onError={(e) => {
            // fallback to placeholder letter if image load fails
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        <div className="hidden only:flex items-center justify-center w-full h-full bg-[#5E258D] text-white font-black text-xl">
          👑
        </div>
      </div>
    </div>
  );
};
