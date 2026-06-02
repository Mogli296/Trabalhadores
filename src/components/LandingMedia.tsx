import React, { useState, useRef } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, Video, ExternalLink
} from 'lucide-react';

const VIDEO_DATA = {
  id: "showcase",
  title: "Apresentação: Ofício e Carpintaria Sazonal",
  url: "https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-craftsman-working-with-wood-42261-large.mp4",
  subtitle: "A preparação minuciosa do trabalhador de ofício para garantir resultados perfeitos no exterior."
};

export default function LandingMedia() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.error("Video play error:", err);
      });
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className="space-y-12 max-w-4xl mx-auto px-4 py-6">
      {/* HEADER SECTION */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-950/40 border border-emerald-950 text-emerald-400 text-[10px] font-mono tracking-widest uppercase rounded-none">
          <Video size={12} />
          Vídeo de Apresentação
        </div>
        <h2 className="text-2xl sm:text-3xl font-semibold uppercase tracking-wider text-white">
          Vídeo de Apresentação
        </h2>
        <p className="text-xs text-zinc-500 max-w-lg mx-auto uppercase tracking-wide">
          Assista a demonstrações de alta definição dos ofícios e técnicas sazonais executados em nossos programas integrados.
        </p>
      </div>

      {/* VIDEO PLAYER CONTAINER */}
      <div className="bg-zinc-950 border border-zinc-900 rounded-none overflow-hidden relative group shadow-2xl">
        <video 
          ref={videoRef}
          src={VIDEO_DATA.url}
          loop
          muted={isMuted}
          playsInline
          onClick={togglePlay}
          className="w-full aspect-video object-cover bg-black cursor-pointer"
        />
        
        {/* Ambient vignette gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

        {/* Subtitles Overlay */}
        <div className="absolute bottom-16 left-4 right-4 md:left-8 md:right-8 text-center pointer-events-none">
          <span className="bg-black/90 text-white px-3 py-1.5 text-xs font-mono border border-zinc-800 tracking-wide uppercase leading-relaxed inline-block">
            {VIDEO_DATA.subtitle}
          </span>
        </div>

        {/* Custom controls overlay panel */}
        <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black to-transparent flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={togglePlay}
              className="w-10 h-10 rounded-none bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center cursor-pointer transition-all focus:outline-none"
              title={isPlaying ? "Pausar Apresentação" : "Iniciar Apresentação"}
            >
              {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
            </button>

            <button 
              onClick={toggleMute}
              className="w-10 h-10 rounded-none bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white flex items-center justify-center cursor-pointer transition-all focus:outline-none"
              title={isMuted ? "Ativar Áudio" : "Desativar Áudio"}
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>

            <div className="text-left pl-1">
              <span className="text-[9px] text-zinc-500 font-mono uppercase block tracking-wider">APRESENTAÇÃO COMPLETA</span>
              <span className="text-xs text-white font-medium block truncate max-w-xs">{VIDEO_DATA.title}</span>
            </div>
          </div>

          {/* Loop Status indicator */}
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">TRANSMISSÃO HD</span>
          </div>
        </div>

        {/* Overlay Play Hint when stopped */}
        {!isPlaying && (
          <div 
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer group-hover:bg-black/50 transition-colors"
          >
            <div className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center shadow-2xl transform group-hover:scale-105 transition-all">
              <Play size={26} fill="currentColor" className="ml-1" />
            </div>
          </div>
        )}
      </div>

      {/* ADDITIONAL LINK LINK / CREDENTIALS (e por link) */}
      <div className="text-center pt-2">
        <a 
          href={VIDEO_DATA.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 border border-zinc-800 hover:border-emerald-500/50 bg-zinc-950 hover:bg-zinc-90 w-auto text-zinc-450 hover:text-emerald-450 font-mono text-xs uppercase tracking-wider transition-all"
        >
          <span>Abrir link direto do vídeo</span>
          <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );
}
