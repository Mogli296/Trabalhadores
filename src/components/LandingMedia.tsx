import React from 'react';
import { Video, ImageIcon } from 'lucide-react';

interface PhotoItem {
  id: number;
  title: string;
  image: string;
  description: string;
}

const PHOTOS_DATA: PhotoItem[] = [
  {
    id: 1,
    title: "Colheita de Frutas em Pomares",
    image: "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=800&q=80",
    description: "Colheita manual de precisão e seleção de frutas em pomares de alta escala durante a alta temporada."
  },
  {
    id: 2,
    title: "Carpintaria de Estruturas",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
    description: "Montagem de estruturas de madeira, esquadrias e suporte técnico em projetos residenciais de grande porte."
  },
  {
    id: 3,
    title: "Copa e Cozinhas Industriais",
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80",
    description: "Suporte operacional na preparação de insumos e logística interna de grandes cozinhas comerciais."
  },
  {
    id: 4,
    title: "Operação de Empilhadeiras e Logística",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
    description: "Conferência de mercadorias, movimentação de cargas e organização de estoques em centros logísticos automatizados."
  },
  {
    id: 5,
    title: "Trabalho em Vinhedos e Terroirs",
    image: "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80",
    description: "Atividades de cultivo, manutenção fitossanitária e colheita sazonal de videiras finas."
  },
  {
    id: 6,
    title: "Montagem e Soldagem de Estruturas",
    image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80",
    description: "Processos industriais básicos de soldagem e corte aplicados à fixação de partes metálicas complexas."
  }
];

const YOUTUBE_VIDEO_ID = "9No-FiE9ZMc"; // Inspiring travel & dynamic seasonal visual
const VIDEO_TITLE = "Apresentação de Práticas Operacionais & Vivência Internacional";

export default function LandingMedia() {
  return (
    <div className="space-y-16 max-w-5xl mx-auto px-4 py-4 text-zinc-300 bg-transparent">
      
      {/* SECTION 1: VIDEO DE APRESENTAÇÃO */}
      <section id="presentation-video-section" className="space-y-6 max-w-4xl mx-auto">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-950/40 border border-cyan-500/20 text-[#22d3ee] text-[10px] font-mono tracking-widest uppercase rounded-full">
            <Video size={11} className="text-cyan-400 animate-pulse" />
            Vencedores & Oportunidades Sazonais
          </div>
          <h2 className="text-xl sm:text-3xl font-extrabold uppercase tracking-tight text-white">
            Vídeo de Apresentação
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto uppercase tracking-wide leading-relaxed font-semibold">
            Assista ao vídeo demonstrativo direto do YouTube apresentando as atividades e oportunidades internacionais da plataforma.
          </p>
        </div>

        {/* Video Player Box - Plays YouTube Embed */}
        <div className="bg-[#060a23]/60 border border-white/5 rounded-3xl overflow-hidden relative shadow-2xl">
          <div className="w-full aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?modestbranding=1&rel=0&iv_load_policy=3&hl=pt`}
              title={VIDEO_TITLE}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full border-0"
            />
          </div>

          {/* Subtext info under the premium box */}
          <div className="p-4 bg-[#0b112d]/60 border-t border-white/5 flex items-center justify-between gap-4">
            <div className="text-left">
              <span className="text-[9px] text-zinc-500 font-mono uppercase block tracking-wider font-bold">APRESENTAÇÃO COMPLETA</span>
              <span className="text-xs text-white font-bold block truncate max-w-xs">{VIDEO_TITLE}</span>
            </div>

            {/* Loop Status tag */}
            <div className="flex items-center gap-1.5 shrink-0 bg-cyan-950/40 px-2 py-0.5 rounded-full border border-cyan-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[9px] font-mono text-cyan-400 font-bold uppercase tracking-widest">TRANSMISSÃO HD</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: SESSÃO DE FOTOS */}
      <section id="photo-session-section" className="space-y-8 border-t border-white/5 pt-12 max-w-4xl mx-auto">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-950/40 border border-cyan-500/20 text-[#22d3ee] text-[10px] font-mono tracking-widest uppercase rounded-full">
            <ImageIcon size={11} className="text-cyan-400" />
            Galeria de Atividades
          </div>
          <h2 className="text-xl sm:text-3xl font-extrabold uppercase tracking-tight text-white">
            Sessão de Fotos Sazonais
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto uppercase tracking-wide leading-relaxed font-semibold">
            Retratos fiéis das frentes operacionais integradas conduzidas pelos profissionais da nossa comunidade internacional.
          </p>
        </div>

        {/* Clean Photos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PHOTOS_DATA.map((photo) => (
            <div
              key={photo.id}
              className="bg-[#060a23]/60 border border-white/5 rounded-3xl overflow-hidden flex flex-col h-full group shadow-2xl transition-all duration-300"
            >
              <div className="aspect-[4/3] bg-zinc-950 overflow-hidden relative">
                <img 
                  src={photo.image} 
                  alt={photo.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent pointer-events-none" />
              </div>

              {/* Text content only: title & legend (description) */}
              <div className="p-5 flex-1 text-left space-y-1 bg-[#0b112d]/55 border-t border-white/5">
                <h4 className="text-xs font-extrabold text-white uppercase tracking-wider group-hover:text-cyan-400 transition-colors">
                  {photo.title}
                </h4>
                <p className="text-[11px] text-zinc-400 font-sans leading-relaxed font-semibold">
                  {photo.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
