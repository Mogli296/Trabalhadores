import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, ShieldCheck, MapPin, Globe, Compass, Star, Video, Play, FileText, 
  CheckCircle2, ChevronRight, Mail, Phone, Award, FileCheck, Calendar, Briefcase, Plus, X, ArrowUpRight, Sparkles, AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import { WorkerProfile } from '../types';

const professionDisplayNames: Record<string, string> = {
  'All': 'All Trades',
  'Produção de Eventos': 'Event Production',
  'Montagem de Estruturas': 'Scaffolding & Rigging',
  'Operador de Empilhadeira': 'Forklift Operator',
  'Eletricista': 'Electrician',
  'Soldador': 'Welder',
  'Mecânico': 'Mechanic',
  'Motorista': 'Professional Driver',
  'Logística': 'Logistics & Warehouse',
  'Limpeza Industrial': 'Industrial Cleaning',
  'Hotelaria': 'Hospitality / Hotel Services',
  'Garçom': 'Waiter / Server',
  'Segurança': 'Security Guard',
  'Cozinha': 'Kitchen / Cook',
  'Atendimento ao Público': 'Customer Service / Host'
};

const countryDisplayNames: Record<string, string> = {
  'Holanda': 'Netherlands',
  'Alemanha': 'Germany',
  'Bélgica': 'Belgium',
  'Espanha': 'Spain',
  'Estados Unidos': 'United States',
  'Canadá': 'Canada',
  'Austrália': 'Australia',
  'Brasil': 'Brazil'
};

const experienceDisplayNames: Record<string, string> = {
  'Menos de 1 ano': 'Less than 1 year',
  '1 a 3 anos': '1 to 3 years',
  '3 a 5 anos': '3 to 5 years',
  'Mais de 5 anos': 'Over 5 years'
};

const availabilityDisplayNames: Record<string, string> = {
  'Imediata': 'Immediate (Ready to fly)',
  '30 dias': '30 Days Notice',
  '60 dias': '60 Days Notice',
  '90 dias': '90 Days Notice'
};

const languageNameDisplay: Record<string, string> = {
  'português': 'Portuguese',
  'inglês': 'English',
  'espanhol': 'Spanish',
  'holandês': 'Dutch',
  'alemão': 'German',
  'portuguese': 'Portuguese',
  'english': 'English',
  'spanish': 'Spanish',
  'dutch': 'Dutch',
  'german': 'German',
  'Português': 'Portuguese',
  'Inglês': 'English',
  'Espanhol': 'Spanish',
  'Holandês': 'Dutch',
  'Alemão': 'German'
};

const languageLevelDisplay: Record<string, string> = {
  'Básico': 'Basic / A1-A2',
  'Intermediário': 'Intermediate / B1-B2',
  'Avançado': 'Advanced / C1',
  'Fluente': 'Fluent / C2 / Native'
};

const genderDisplayNames: Record<string, string> = {
  'Masculino': 'Male',
  'Feminino': 'Female',
  'Outro': 'Other'
};

const displayProfession = (prof: string) => professionDisplayNames[prof] || prof || "Industrial Trade";
const displayCountry = (c: string) => countryDisplayNames[c] || c || "Brazil";
const displayCountryList = (countries: string[]) => {
  if (!countries || countries.length === 0) return 'Germany, Netherlands';
  return countries.map(c => countryDisplayNames[c] || c).join(', ');
};
const displayExperience = (exp: string) => experienceDisplayNames[exp] || exp || '1 to 3 years';
const displayAvailability = (avail: string) => availabilityDisplayNames[avail] || avail || 'Immediate';
const displayLanguageName = (lang: string) => languageNameDisplay[lang] || lang;
const displayLanguageLevel = (lvl: string) => languageLevelDisplay[lvl] || lvl;
const displayGender = (g: string) => genderDisplayNames[g] || g || 'Male';

export default function WorkerCatalog() {
  const [profiles, setProfiles] = useState<WorkerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchProfession, setSearchProfession] = useState('All');
  const [searchLanguage, setSearchLanguage] = useState('All');
  const [searchRank, setSearchRank] = useState('All');
  const [selectedProfile, setSelectedProfile] = useState<WorkerProfile | null>(null);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    const loadProfiles = async () => {
      try {
        setLoading(true);
        const data = await api.getPublicProfiles();
        setProfiles(data);
      } catch (err) {
        console.error("Error loading public catalog profiles:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProfiles();
  }, []);

  const professionsList = [
    { key: 'All', display: 'All' },
    { key: 'Produção de Eventos', display: 'Event Production' },
    { key: 'Montagem de Estruturas', display: 'Scaffolding & Rigging' },
    { key: 'Operador de Empilhadeira', display: 'Forklift Operator' },
    { key: 'Eletricista', display: 'Electrician' },
    { key: 'Soldador', display: 'Welder' },
    { key: 'Mecânico', display: 'Mechanic' },
    { key: 'Motorista', display: 'Professional Driver' },
    { key: 'Logística', display: 'Logistics' },
    { key: 'Limpeza Industrial', display: 'Industrial Cleaning' },
    { key: 'Hotelaria', display: 'Hospitality' }
  ];

  const languagesList = [
    { key: 'All', display: 'All' },
    { key: 'Inglês', display: 'English' },
    { key: 'Espanhol', display: 'Spanish' },
    { key: 'Alemão', display: 'German' },
    { key: 'Holandês', display: 'Dutch' }
  ];

  const ranksList = [
    { key: 'All', display: 'All' },
    { key: 'Premium', display: '🥇 Premium' },
    { key: 'Verified', display: '🥈 Verified' },
    { key: 'Available', display: '🥉 Available' }
  ];

  const filteredProfiles = profiles.filter(p => {
    // 1. Profession filter
    let matchesProfession = searchProfession === 'All';
    if (!matchesProfession && p.profession) {
      matchesProfession = p.profession.toLowerCase().includes(searchProfession.toLowerCase());
    }

    // 2. Language filter
    let matchesLanguage = searchLanguage === 'All';
    if (!matchesLanguage) {
      const searchLangVal = searchLanguage === 'Inglês' ? 'inglês' : searchLanguage === 'Espanhol' ? 'espanhol' : searchLanguage === 'Alemão' ? 'alemão' : 'holandês';
      
      const hasLanguageMatch = p.languages && p.languages.some(l => 
        l.language?.toLowerCase() === searchLangVal
      );
      
      const hasEnglishLevel = searchLanguage === 'Inglês' && p.englishLevel && p.englishLevel !== 'Non-verbal' && p.englishLevel !== 'Não fala';
      matchesLanguage = !!(hasLanguageMatch || hasEnglishLevel);
    }

    // 3. Rank Filter
    let matchesRank = searchRank === 'All';
    if (!matchesRank) {
      matchesRank = p.ranking === searchRank;
    }

    return matchesProfession && matchesLanguage && matchesRank;
  });

  return (
    <div id="worker-catalog-page" className="min-h-screen pt-12 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 relative z-10 text-zinc-350">
      
      {/* Cinematic Header Block */}
      <div className="space-y-4 text-center max-w-3xl mx-auto">
        <span className="text-[10px] font-mono font-black text-cyan-400 bg-cyan-950/40 border border-cyan-500/20 px-4 py-1.5 rounded-full inline-block uppercase tracking-[0.25em]">
          TCW INTERNATIONAL TALENT DIRECTORY
        </span>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold uppercase tracking-tight text-white">
          Global Talent Pool
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans max-w-xl mx-auto">
          Consult verified professional operational profiles, watch 30-second video presentation pitches, evaluate technical licensing, and connect with candidates ready for immediate deployment.
        </p>
      </div>

      {/* Filter and search utilities */}
      <div className="bg-[#030614]/70 border border-white/5 p-6 rounded-3xl max-w-5xl mx-auto space-y-5 shadow-2xl">
        {/* Category Filters */}
        <div className="flex flex-col md:flex-row md:items-start gap-3 text-left">
          <span className="text-[10px] font-mono font-black text-zinc-400 uppercase tracking-widest shrink-0 w-32 md:pt-2.5">
            Profession / Trade:
          </span>
          <div className="flex flex-wrap gap-2">
            {professionsList.map((prof) => (
              <button
                key={prof.key}
                onClick={() => setSearchProfession(prof.key)}
                className={`px-3.5 py-2 text-[9px] sm:text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer border ${
                  (searchProfession === prof.key)
                    ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 border-transparent shadow-[0_0_15px_rgba(34,211,238,0.15)]'
                    : 'bg-[#020412]/40 text-zinc-400 border-white/5 hover:text-white hover:border-white/10'
                }`}
              >
                {prof.display}
              </button>
            ))}
          </div>
        </div>

        {/* Language Fluency Filters */}
        <div className="flex flex-col md:flex-row md:items-start gap-3 text-left pt-4 border-t border-white/[0.04]">
          <span className="text-[10px] font-mono font-black text-zinc-400 uppercase tracking-widest shrink-0 w-32 md:pt-2">
            Languages Spoken:
          </span>
          <div className="flex flex-wrap gap-2">
            {languagesList.map((lang) => (
              <button
                key={lang.key}
                onClick={() => setSearchLanguage(lang.key)}
                className={`px-3.5 py-2 text-[9px] sm:text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer border ${
                  (searchLanguage === lang.key)
                    ? 'bg-gradient-to-r from-emerald-400 to-cyan-500 text-slate-950 border-transparent shadow-[0_0_15px_rgba(52,211,153,0.15)]'
                    : 'bg-[#020412]/40 text-zinc-400 border-white/5 hover:text-white hover:border-white/10'
                }`}
              >
                {lang.display}
              </button>
            ))}
          </div>
        </div>

        {/* Rank filters */}
        <div className="flex flex-col md:flex-row md:items-start gap-3 text-left pt-4 border-t border-white/[0.04]">
          <span className="text-[10px] font-mono font-black text-zinc-400 uppercase tracking-widest shrink-0 w-32 md:pt-2">
            TCW Safety Badge:
          </span>
          <div className="flex flex-wrap gap-2">
            {ranksList.map((rank) => (
              <button
                key={rank.key}
                onClick={() => setSearchRank(rank.key)}
                className={`px-3.5 py-2 text-[9px] sm:text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer border ${
                  (searchRank === rank.key)
                    ? 'bg-[#060e2e]/90 border-[#22d3ee]/40 text-cyan-200'
                    : 'bg-[#020412]/40 text-zinc-400 border-white/5 hover:text-white hover:border-white/10'
                }`}
              >
                {rank.display}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-24 text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-t-2 border-r-2 border-cyan-400 animate-spin mx-auto" />
          <p className="text-xs font-mono uppercase text-zinc-500 tracking-widest">Sincronizando banco de vistos, contratos e talentos...</p>
        </div>
      ) : filteredProfiles.length === 0 ? (
        <div className="py-16 text-center bg-[#04081e]/60 border border-white/5 rounded-[2rem] max-w-xl mx-auto">
          <span className="text-4xl block">🔍</span>
          <h3 className="text-sm font-bold text-white uppercase tracking-tight mt-4">Nenhum talento encontrado</h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-xs mx-auto leading-relaxed">
            Nenhum perfil de candidato atende a esta combinação exata de filtros no momento. Tente expandir ou redefinir suas categorias acima.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProfiles.map((profile) => {
            const profilePhoto = profile.avatarPhoto || (profile.photos && profile.photos.length > 0 ? profile.photos[0] : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80");
            const videoUrl = profile.videos?.presentation || null;

            return (
              <motion.div
                key={profile.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-[#030614]/85 border border-white/5 rounded-3xl overflow-hidden flex flex-col justify-between group shadow-2xl hover:border-cyan-500/20 transition-all duration-300 relative"
              >
                {/* Ranking Ribbon */}
                <div className="absolute top-4 right-4 z-10">
                  <span className={`text-[9px] font-mono font-black uppercase px-2.5 py-1 rounded-full shadow-lg ${
                    profile.ranking === 'Premium' ? 'bg-[#061e38] border border-cyan-500/20 text-[#22d3ee]' :
                    profile.ranking === 'Verified' ? 'bg-amber-950/30 border border-amber-500/20 text-amber-400' :
                    'bg-zinc-900 border border-zinc-800 text-zinc-400'
                  }`}>
                    {profile.ranking === 'Premium' ? '🥇 Premium' : profile.ranking === 'Verified' ? '🥈 Verified' : '🥉 Available'}
                  </span>
                </div>

                {/* Card Avatar / Title Header */}
                <div className="p-5 pb-3 flex items-start gap-4 border-b border-white/[0.04] bg-[#050920]/45 relative">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-neutral-950 border border-white/10 shadow-lg group-hover:border-cyan-500/35 transition-colors">
                    <img 
                      src={profilePhoto} 
                      alt={profile.fullName} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 filter brightness-95"
                    />
                    
                    {videoUrl && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveVideoUrl(videoUrl);
                        }}
                        className="absolute inset-0 bg-black/45 hover:bg-black/60 flex items-center justify-center transition-all cursor-pointer group/vid"
                        title="Ver Vídeo de Apresentação"
                      >
                        <Play size={11} className="fill-white text-white animate-pulse" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-1 flex-1 min-w-0 pr-16">
                    <span className="text-[8px] font-mono font-black text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/15 uppercase tracking-wider inline-block max-w-full truncate">
                      {displayProfession(profile.profession)}
                    </span>
                    <h3 className="text-sm font-black text-white uppercase tracking-tight truncate leading-tight group-hover:text-cyan-400 transition-colors">
                      {profile.fullName}
                    </h3>
                    <span className="text-[8px] text-zinc-550 font-mono block uppercase tracking-wider leading-none">
                      👤 {profile.city || 'Candidate'} • {displayCountry(profile.country)}
                    </span>
                  </div>
                </div>

                {/* Details list */}
                <div className="p-5 pt-4 text-left space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-[10px] font-mono font-bold text-zinc-400 bg-white/[0.01] border border-white/[0.04] p-3 rounded-2xl">
                      <div>
                        <span className="text-[7.5px] text-zinc-500 block uppercase tracking-widest font-black leading-none">Age / Gender</span>
                        <span className="text-white text-[11px] font-sans leading-relaxed">{profile.age || 25} yrs • {displayGender(profile.gender)}</span>
                      </div>
                      <div>
                        <span className="text-[7.5px] text-zinc-500 block uppercase tracking-widest font-black leading-none">Languages</span>
                        <span className="text-cyan-400 text-[10px] font-sans leading-relaxed block truncate">
                          {profile.languages && profile.languages.length > 0 
                            ? profile.languages.map(l => displayLanguageName(l.language)).join(' / ') 
                            : 'Portuguese / English'}
                        </span>
                      </div>
                      <div className="col-span-2 pt-1.5 border-t border-white/[0.03]">
                        <span className="text-[7.5px] text-zinc-500 block uppercase tracking-widest font-black leading-none">Driving / Equipment</span>
                        <span className="text-zinc-300 font-sans block truncate text-[10px] mt-0.5">
                          🚘 License: {profile.licenseType || 'None'} {profile.drivesMachinery === 'Yes' ? '• Forklift Operator' : ''}
                        </span>
                      </div>
                      <div className="col-span-2 pt-1.5 border-t border-white/[0.03]">
                        <span className="text-[7.5px] text-zinc-500 block uppercase tracking-widest font-black leading-none">Target Destinations</span>
                        <span className="text-white font-sans text-[10px] block truncate mt-0.5">
                          ✈️ {displayCountryList(profile.countriesOfInterest)}
                        </span>
                      </div>
                    </div>

                    {/* Certifications or descriptions snippet */}
                    {profile.certifications && profile.certifications.length > 0 && (
                      <div className="p-2.5 bg-[#0a231d]/20 border border-emerald-500/10 rounded-xl flex items-start gap-1.5 text-left">
                        <CheckCircle2 size={12} className="text-emerald-400 shrink-0 mt-0.5" />
                        <div className="min-w-0">
                          <span className="text-[8px] font-mono font-black text-emerald-400 uppercase tracking-widest block leading-none">Global Certifications</span>
                          <span className="text-[9.5px] text-zinc-300 font-sans font-bold leading-tight block truncate mt-0.5 font-mono">
                            {profile.certifications.join(' • ')}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Corporate Inquiry Button & Action */}
                  <div className="pt-4 border-t border-white/[0.04] space-y-2.5">
                    <button
                      onClick={() => setSelectedProfile(profile)}
                      className="w-full py-2 bg-white/5 group-hover:bg-[#22d3ee]/10 text-zinc-300 group-hover:text-[#22d3ee] border border-white/5 hover:border-cyan-500/20 text-[10px] font-mono font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Review Case File & Dossier</span>
                      <ArrowUpRight size={12} />
                    </button>
                    
                    <span className="block text-[8px] font-mono text-zinc-500 text-center leading-normal">
                      Intake Inquiry: <span className="text-white">speakai.agency@gmail.com</span> (ID: {profile.id})
                    </span>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>
      )}

      {/* Compliance Dossiê Popup Modal */}
      <AnimatePresence>
        {selectedProfile && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#030614] border border-white/10 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative text-left"
            >
              {/* Header Bar */}
              <div className="sticky top-0 bg-[#080d24] px-6 py-4 border-b border-white/5 flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                  <span className="text-gold text-lg">🥇</span>
                  <span className="text-[11px] font-display font-black text-white uppercase tracking-wider">
                    Professional Dossier • TCW Group Recruitment
                  </span>
                </div>
                <button
                  onClick={() => setSelectedProfile(null)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/5 cursor-pointer font-bold"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-8">
                
                {/* 1. Header Hero with Avatar & Portrait Side by Side */}
                <div className="flex flex-col md:flex-row gap-6 p-6 bg-[#0b112d]/50 border border-white/5 rounded-2xl">
                  {/* Portrait photo */}
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border border-cyan-400/20 bg-[#060a23] shrink-0 mx-auto md:mx-0">
                    <img 
                      referrerPolicy="no-referrer" 
                      src={selectedProfile.avatarPhoto || (selectedProfile.photos && selectedProfile.photos.length > 0 ? selectedProfile.photos[0] : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80")} 
                      alt="Portrait" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  
                  {/* Bio brief */}
                  <div className="flex-1 space-y-3 font-sans text-center md:text-left">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                      <span className="text-xl font-display font-black text-white uppercase tracking-tight">{selectedProfile.fullName}</span>
                      <span className={`text-[9px] font-mono font-black uppercase px-2.5 py-0.5 rounded-full ${
                        selectedProfile.ranking === 'Premium' ? 'bg-cyan-500/10 text-cyan-400' :
                        selectedProfile.ranking === 'Verified' ? 'bg-amber-400/10 text-amber-400' :
                        'bg-zinc-800 text-zinc-400'
                      }`}>
                        TCW badge: {selectedProfile.ranking || 'Available Candidate'}
                      </span>
                    </div>

                    <p className="text-[#22d3ee] font-mono text-xs uppercase font-extrabold pb-2 border-b border-white/5 tracking-wider">
                      🛠️ Trade / Profession: {displayProfession(selectedProfile.profession)}
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-2 text-xs text-zinc-400">
                      <div>
                        <span className="text-[9px] font-mono text-zinc-500 block uppercase font-bold text-left md:text-left">Origin City</span>
                        <span className="text-white font-semibold">{selectedProfile.city || 'Not specified'}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-mono text-zinc-500 block uppercase font-bold text-left md:text-left">Date of Birth</span>
                        <span className="text-white font-semibold">{selectedProfile.birthDate || 'Awaiting validation'}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-mono text-zinc-500 block uppercase font-bold text-left md:text-left">Nationality</span>
                        <span className="text-white font-semibold">{displayCountry(selectedProfile.nationality)}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-mono text-zinc-500 block uppercase font-bold text-left md:text-left">Official WhatsApp</span>
                        <span className="text-white font-semibold font-mono">{selectedProfile.phone || 'Private / Verified'}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-mono text-zinc-500 block uppercase font-bold text-left md:text-left">Email Address</span>
                        <span className="text-white font-semibold truncate block">{selectedProfile.email || 'Awaiting Validation'}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-mono text-zinc-500 block uppercase font-bold text-left md:text-left">Availability</span>
                        <span className="text-[#22d3ee] font-black">{displayAvailability(selectedProfile.travelAvailability)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Passport & Driving Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Document checking */}
                  <div className="p-5 bg-[#0b112d]/30 border border-white/5 rounded-2xl space-y-4">
                    <span className="block text-[10px] uppercase font-mono tracking-widest font-black text-[#22d3ee]">📄 Travel Documentation</span>
                    <div className="space-y-3 text-xs">
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span className="text-zinc-500">Valid Passport:</span>
                        <span className="text-white font-bold">{selectedProfile.hasPassport === 'Yes' ? 'Yes' : 'No'}</span>
                      </div>
                      {selectedProfile.passportNumber && (
                        <>
                          <div className="flex justify-between py-1 border-b border-white/5">
                            <span className="text-zinc-500">Passport Number:</span>
                            <span className="text-white font-mono font-black">{selectedProfile.passportNumber}</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-white/5">
                            <span className="text-zinc-500">Passport Expiry:</span>
                            <span className="text-white font-semibold">{selectedProfile.passportValidity || 'Not specified'}</span>
                          </div>
                        </>
                      )}
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span className="text-zinc-500">National ID Card:</span>
                        <span className="text-white font-semibold">{selectedProfile.rgNumber || 'Verified on file'}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span className="text-zinc-500">Tax Registration ID:</span>
                        <span className="text-white font-semibold">{selectedProfile.cpfNumber || 'Verified on file'}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-zinc-500">Driver\'s License Class:</span>
                        <span className="text-white font-semibold">{selectedProfile.licenseType || 'None / Commuter'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Visa and Destination countries */}
                  <div className="p-5 bg-[#0b112d]/30 border border-white/5 rounded-2xl space-y-4">
                    <span className="block text-[10px] uppercase font-mono tracking-widest font-black text-[#22d3ee]">✈️ Destination Profile & Visa Status</span>
                    <div className="space-y-3 text-xs">
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span className="text-zinc-500">Target Markets:</span>
                        <span className="text-[#22d3ee] font-bold">
                          {displayCountryList(selectedProfile.countriesOfInterest)}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span className="text-zinc-500">Has Active European Visa?</span>
                        <span className="text-white font-bold">{selectedProfile.hasVisa === 'Yes' ? 'Yes' : 'No'}</span>
                      </div>
                      {selectedProfile.hasVisa === 'Yes' && selectedProfile.visaCountry && (
                        <>
                          <div className="flex justify-between py-1 border-b border-white/5">
                            <span className="text-zinc-500">Visa Country:</span>
                            <span className="text-white font-semibold">{displayCountry(selectedProfile.visaCountry)}</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-white/5">
                            <span className="text-zinc-500">Visa Expiry:</span>
                            <span className="text-white font-semibold">{selectedProfile.visaValidity}</span>
                          </div>
                        </>
                      )}
                      <div className="flex justify-between py-1">
                        <span className="text-zinc-500">Ready to Travel:</span>
                        <span className="text-white font-black uppercase text-[10px]">{displayAvailability(selectedProfile.travelAvailability)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Professional Experience Detailed Display */}
                <div className="p-5 bg-[#0b112d]/30 border border-white/5 rounded-2xl space-y-4">
                  <span className="block text-[10px] uppercase font-mono tracking-widest font-black text-[#22d3ee]">💼 Detailed Professional History</span>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pb-4 border-b border-white/5">
                    <div>
                      <span className="text-zinc-500 block uppercase text-[8px] tracking-wider mb-0.5">Total Years of Experience</span>
                      <span className="text-white font-black text-sm">{displayExperience(selectedProfile.experienceYears)}</span>
                    </div>
                    {selectedProfile.lastCompany && (
                      <>
                        <div>
                          <span className="text-zinc-500 block uppercase text-[8px] tracking-wider mb-0.5">Last Place of Employment</span>
                          <span className="text-white font-bold text-sm truncate block">{selectedProfile.lastCompany}</span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block uppercase text-[8px] tracking-wider mb-0.5">Period & Role Covered</span>
                          <span className="text-white font-mono text-[11px] block">{selectedProfile.lastRole || 'Operator'} ({selectedProfile.lastPeriod})</span>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="space-y-1">
                    <span className="text-zinc-500 text-[10px] uppercase tracking-wider block font-bold">Experience Summary & Key Responsibilities:</span>
                    <p className="text-zinc-300 text-xs leading-relaxed italic bg-black/25 p-3 rounded-xl border border-white/5">
                      {selectedProfile.experienceDescription || 'No additional work details registered by the candidate.'}
                    </p>
                  </div>
                </div>

                {/* 4. Certifications List & Languages spoken */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Certifications and NR licenses */}
                  <div className="p-5 bg-[#0b112d]/30 border border-white/5 rounded-2xl space-y-4">
                    <span className="block text-[10px] uppercase font-mono tracking-widest font-black text-[#22d3ee]">🏗️ Certifications & Technical Licenses</span>
                    
                    {selectedProfile.certifications && selectedProfile.certifications.length > 0 ? (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {selectedProfile.certifications.map(cert => (
                          <span key={cert} className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono font-bold text-[10px] rounded-lg">
                            🏗️ {cert}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-zinc-500 font-medium">No special certificates registered.</p>
                    )}

                    {selectedProfile.certificationFiles && selectedProfile.certificationFiles.length > 0 && (
                      <div className="pt-3 border-t border-white/5 space-y-2">
                        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">Diploma Attachments (ID Verified)</span>
                        <div className="flex flex-wrap gap-2">
                          {selectedProfile.certificationFiles.map((fUrl, i) => (
                            <a
                              key={i}
                              href={fUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 bg-black border border-white/10 hover:border-cyan-400 text-zinc-300 hover:text-white rounded-lg text-[9px] font-mono flex items-center gap-1 leading-none shadow"
                            >
                              <FileText size={11} className="text-cyan-400" />
                              <span>Verified_Diploma_{i+1}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Languages spoken */}
                  <div className="p-5 bg-[#0b112d]/30 border border-white/5 rounded-2xl space-y-4">
                    <span className="block text-[10px] uppercase font-mono tracking-widest font-black text-[#22d3ee]">🗣️ Language Skills & Proficiency</span>
                    
                    <div className="space-y-2">
                      {selectedProfile.languages && selectedProfile.languages.length > 0 ? (
                        selectedProfile.languages.map(l => (
                          <div key={l.language} className="flex items-center justify-between p-2 bg-black/20 rounded-xl border border-white/5 text-xs text-zinc-300">
                            <span className="font-bold">{displayLanguageName(l.language)}</span>
                            <span className="text-cyan-400 font-mono font-black border border-cyan-500/20 bg-cyan-950/20 px-2 py-0.5 rounded-md">{displayLanguageLevel(l.level)}</span>
                          </div>
                        ))
                      ) : (
                        <div className="flex items-center justify-between p-2 bg-black/20 rounded-xl border border-white/5 text-xs text-zinc-300">
                          <span className="font-bold">Portuguese</span>
                          <span className="text-cyan-400 font-mono font-black border border-cyan-500/20 bg-cyan-950/20 px-2 py-0.5 rounded-md">Fluent / Native</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 5. Multimedia Media Showcase (Full Body Photo + Showcase photos grid) */}
                <div className="p-5 bg-[#0b112d]/30 border border-white/5 rounded-2xl space-y-4">
                  <span className="block text-[10px] uppercase font-mono tracking-widest font-black text-[#22d3ee]">📸 Dossier Image Gallery</span>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {/* Full body snapshot */}
                    {selectedProfile.fullBodyPhoto && (
                      <div className="space-y-1">
                        <span className="text-[8px] font-mono text-zinc-500 block uppercase tracking-widest text-center">FULL BODY</span>
                        <div className="aspect-[3/4] rounded-xl overflow-hidden border border-white/10 bg-black">
                          <img referrerPolicy="no-referrer" src={selectedProfile.fullBodyPhoto} alt="Full Body" className="w-full h-full object-cover" />
                        </div>
                      </div>
                    )}
                    
                    {/* Showcase gallery items */}
                    {selectedProfile.photos && selectedProfile.photos.map((pUrl, i) => (
                      <div key={i} className="space-y-1">
                        <span className="text-[8px] font-mono text-zinc-500 block uppercase tracking-widest text-center">PORTFOLIO #{i+1}</span>
                        <div className="aspect-[3/4] rounded-xl overflow-hidden border border-white/10 bg-black">
                          <img referrerPolicy="no-referrer" src={pUrl} alt={`Showcase ${i}`} className="w-full h-full object-cover" />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Resume attachments scan */}
                  {selectedProfile.resumePhoto && (
                    <div className="pt-4 border-t border-white/5 space-y-2">
                      <span className="text-[9px] font-mono text-zinc-550 uppercase tracking-widest block font-bold text-center sm:text-left">Candidate Professional Resume (CV)</span>
                      <div className="max-w-md mx-auto aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 bg-black shadow-inner">
                        <img referrerPolicy="no-referrer" src={selectedProfile.resumePhoto} alt="CV" className="w-full h-full object-contain" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Video pitch if available */}
                {selectedProfile.videos?.presentation && (
                  <div className="p-5 bg-black/60 border border-white/5 rounded-2xl space-y-3">
                    <span className="block text-[10px] uppercase font-mono tracking-widest font-black text-[#22d3ee] text-center">🎥 30-Second Video Presentation Pitch</span>
                    <div className="max-w-md mx-auto aspect-video rounded-xl overflow-hidden bg-black border border-white/5 shadow-inner">
                      <video src={selectedProfile.videos.presentation} controls className="w-full h-full object-cover" />
                    </div>
                  </div>
                )}

              </div>

              {/* Footer CTA */}
              <div className="p-6 bg-[#080d24] border-t border-white/5 text-xs text-zinc-400 font-sans flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-cyan-400" />
                  <span>To hire this professional, reach out to us at: <strong className="text-white font-mono break-all">speakai.agency@gmail.com</strong></span>
                </div>
                <button
                  onClick={() => setSelectedProfile(null)}
                  className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-black rounded-xl text-[10px] uppercase tracking-wider cursor-pointer font-mono"
                >
                  Close Dossier
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Video Overlay Modal playback (Legacy / secondary helper) */}
      <AnimatePresence>
        {activeVideoUrl && (
          <div className="fixed inset-0 bg-[#01020d]/85 z-50 flex items-center justify-center p-4 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#030614] border border-white/10 rounded-3xl max-w-3xl w-full text-left overflow-hidden shadow-2xl relative"
            >
              <div className="bg-[#080d24] px-4 py-3 border-b border-white/5 flex items-center justify-between text-xs font-mono">
                <span className="text-white font-bold block">CANDIDATE VIDEO PRESENTATION</span>
                <button
                  onClick={() => setActiveVideoUrl(null)}
                  className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-all cursor-pointer font-bold border border-white/5"
                >
                  ✕
                </button>
              </div>

              <div className="aspect-video bg-black flex items-center justify-center">
                <video src={activeVideoUrl} controls autoPlay className="w-full h-full" />
              </div>

              <div className="p-4 bg-[#0b112d]/60 border-t border-white/5 text-[10px] text-zinc-500 font-sans flex items-center justify-between">
                <span>SECURE AND VERIFIED INTERNATIONAL RECRUITMENT</span>
                <span className="text-cyan-400 font-mono font-black tracking-widest">speakai.agency@gmail.com</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
