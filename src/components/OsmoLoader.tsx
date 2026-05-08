import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

const IMAGES = [
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1524178232363-1fb28f74b573?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1454165833767-027ffcb950e8?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1531545517296-16616580af8a?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80',
];

export function OsmoLoader({ onComplete }: { onComplete: () => void }) {
  const [exit, setExit] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExit(true);
      setTimeout(onComplete, 1500);
    }, 6000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-[#111] flex items-center justify-center overflow-hidden"
    >
      {/* 3D Vortex Background */}
      <div className="vortex-container">
        {IMAGES.map((src, i) => {
          const angle = (360 / IMAGES.length) * i;
          const radius = 700;
          const yOffset = (i % 4 - 1.5) * 250;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={exit ? { 
                scale: 2, 
                opacity: 0,
                translateZ: 1000 
              } : { 
                opacity: 0.7, 
                scale: 1,
                translateZ: 0 
              }}
              transition={{ 
                opacity: { delay: i * 0.1, duration: 1 },
                scale: { delay: i * 0.1, duration: 1 },
                default: { duration: 1.5, ease: [0.76, 0, 0.24, 1] }
              }}
              style={{
                position: 'absolute',
                transform: `rotateY(${angle}deg) translateZ(${radius}px) translateY(${yOffset}px)`,
                transformStyle: "preserve-3d"
              }}
            >
              <img 
                src={src} 
                alt="" 
                className="vortex-photo grayscale hover:grayscale-0 transition-all duration-500 hover:scale-110" 
                style={{ backfaceVisibility: "hidden" }}
              />
            </motion.div>
          );
        })}
      </div>

      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={exit ? { 
          scale: 5, 
          opacity: 0,
          rotate: 10,
          filter: "blur(30px)"
        } : { 
          scale: 1, 
          opacity: 1,
          rotate: 0,
          filter: "blur(0px)"
        }}
        transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
        className="relative flex items-center justify-center text-center px-10 z-50"
      >
        <motion.div 
          className="title-3d text-6xl sm:text-8xl lg:text-[160px] font-black uppercase tracking-tighter z-10 whitespace-nowrap"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 1.2, ease: "easeOut" }}
        >
          AL KENDI
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
