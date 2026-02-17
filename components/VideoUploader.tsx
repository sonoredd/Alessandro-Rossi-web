
import React, { useRef, useState } from 'react';

interface VideoProjectProps {
  url: string;
  title: string;
  onRemove?: () => void;
  isEditing?: boolean;
}

export const VideoProjectItem: React.FC<VideoProjectProps> = ({ url, title, onRemove, isEditing }) => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div 
      className="relative flex-shrink-0 w-[85vw] md:w-[60vw] aspect-video bg-neutral-900 group overflow-hidden rounded-sm select-none"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <video 
        src={url} 
        className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000" 
        autoPlay 
        muted 
        loop
        playsInline
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
      
      <div className="absolute bottom-8 left-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
        <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/50 mb-2">Project</p>
        <h3 className="text-xl md:text-3xl font-light tracking-tight italic serif text-white">{title}</h3>
      </div>

      {isEditing && onRemove && (
        <button 
          onClick={onRemove}
          className="absolute top-4 right-4 bg-white/10 hover:bg-red-500/80 backdrop-blur-md text-white px-4 py-2 text-[8px] font-bold uppercase tracking-widest transition-all rounded-full"
        >
          Rimuovi
        </button>
      )}
    </div>
  );
};

interface AddProjectProps {
  onUpload: (url: string) => void;
}

export const AddProjectCard: React.FC<AddProjectProps> = ({ onUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onUpload(url);
    }
  };

  return (
    <div 
      onClick={() => fileInputRef.current?.click()}
      className="flex-shrink-0 w-[85vw] md:w-[60vw] aspect-video border border-white/5 bg-neutral-900/20 hover:bg-neutral-900/40 cursor-pointer flex flex-col items-center justify-center space-y-4 transition-all group"
    >
      <div className="w-16 h-16 border border-white/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-6 h-6 text-white/20">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </div>
      <span className="text-[9px] font-bold tracking-[0.5em] uppercase text-white/20">Aggiungi Progetto</span>
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="video/*" 
        onChange={handleFileChange} 
      />
    </div>
  );
};
