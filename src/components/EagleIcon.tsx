interface EagleIconProps {
  className?: string;
  size?: number;
}

export function EagleIcon({ className = "", size = 48 }: EagleIconProps) {
  return (
    <div 
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      <img 
        src="/eagle.png" 
        alt="Kazakh Eagle"
        className="w-full h-full object-contain filter drop-shadow-lg"
        style={{
          filter: 'brightness(1.1) contrast(1.05) drop-shadow(0 0 8px rgba(251, 191, 36, 0.3))'
        }}
      />
    </div>
  );
}
