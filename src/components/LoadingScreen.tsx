import React, { useState, useEffect, useRef } from 'react';
import { Loader2, Gamepad2 } from 'lucide-react';

const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const updateCanvasSize = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    updateCanvasSize();
    const observer = new ResizeObserver(updateCanvasSize);
    observer.observe(container);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const chars = '01';
    const fontSize = 10;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#00ff00';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);

    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 opacity-20"
        style={{ filter: 'blur(0.5px)' }}
      />
    </div>
  );
};

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const [loadingText, setLoadingText] = useState('INITIALIZING SYSTEMS');
  const [progress, setProgress] = useState(0);
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);

  useEffect(() => {
    const texts = [
      'INITIALIZING SYSTEMS',
      'CONNECTING TO NETWORK',
      'LOADING GAME ASSETS',
      'PREPARING RUNTIME'
    ];
    let currentIndex = 0;

    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % texts.length;
      setLoadingText(texts[currentIndex]);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Запускаем прогресс загрузки
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsLoadingComplete(true);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(progressInterval);
  }, []);

  useEffect(() => {
    if (isLoadingComplete) {
      // Даем немного времени пользователю увидеть заполненную полосу
      setTimeout(() => {
        onLoadingComplete();
      }, 500);
    }
  }, [isLoadingComplete, onLoadingComplete]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center overflow-hidden">
      {/* Animated Background Lines */}
      <div className="absolute inset-0 grid-pattern opacity-10">
        <div className="absolute inset-0 animate-pulse-fast">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute h-px bg-[#00ff00]/20"
              style={{
                top: `${20 * i}%`,
                left: '-100%',
                right: '100%',
                animation: `scan-line 3s ${i * 0.5}s linear infinite`
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Main Content */}
      <div className="relative">
        {/* Outer Glow */}
        <div className="absolute inset-0 bg-[#00ff00] blur-[100px] opacity-20 animate-pulse" />
        
        {/* Loading Container */}
        <div className="relative glass-effect pixel-corners p-8 md:p-12 min-w-[320px] md:min-w-[400px] overflow-hidden">
          {/* Matrix Rain Effect */}
          <MatrixRain />
          
          {/* Content */}
          <div className="relative flex flex-col items-center">
            {/* Game Icon */}
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-[#00ff00] blur-md opacity-30 animate-pulse" />
              <Gamepad2 className="w-16 h-16 md:w-20 md:h-20 text-[#00ff00] relative z-10 animate-float" />
            </div>

            {/* Loading Indicator */}
            <div className="flex items-center gap-3 mb-6">
              <Loader2 className="w-5 h-5 text-[#00ff00] animate-spin" />
              <h2 className="text-[#00ff00] text-sm md:text-base font-medium tracking-wider animate-pulse">
                {loadingText}
              </h2>
            </div>
            
            {/* Loading Bar */}
            <div className="w-full h-1.5 bg-black/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#00ff00] relative transition-all duration-200"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 energy-bar opacity-30" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
