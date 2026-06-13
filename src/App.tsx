import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Briefcase, Shield, Clock, FileText, Globe, LogOut, User, 
  MapPin, CheckCircle2, Navigation, ArrowRight, Compass, HeartHandshake, LogIn,
  Mail, Phone, Send, Facebook, Twitter, Instagram, Linkedin, Play, Check, ChevronRight, Sparkles, Star
} from 'lucide-react';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import WorkerProfileForm from './components/WorkerProfileForm';
import ContractViewer from './components/ContractViewer';
import AdminDashboard from './components/AdminDashboard';
import TCWLogo from './components/TCWLogo';
import { User as UserType } from './types';
import { api } from './services/api';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [appView, setAppView] = useState<'landing' | 'login' | 'register' | 'dashboard'>('landing');
  const [workerTab, setWorkerTab] = useState<'profile' | 'contracts'>('profile');
  const [pendingContractsCount, setPendingContractsCount] = useState(0);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  // Landing Page Interactive Contact Form states
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [interestType, setInterestType] = useState('Trabalhar em temporadas sazonais (Candidato)');
  const [hearAbout, setHearAbout] = useState('Instagram / Facebook');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [submittingContact, setSubmittingContact] = useState(false);

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);



  // Load session from localStorage on startup
  useEffect(() => {
    const stored = localStorage.getItem('work_user_session');
    if (stored) {
      try {
        const decodedUser = JSON.parse(stored);
        setCurrentUser(decodedUser);
        setAppView('dashboard');
      } catch (err) {
        console.error('Error recovering user session', err);
      }
    }
  }, []);

  // Sync count of pending contracts for badges
  useEffect(() => {
    if (currentUser && currentUser.role === 'worker') {
      api.getContracts(currentUser.id)
        .then(contracts => {
          const pending = contracts.filter(c => c.status === 'Pendente').length;
          setPendingContractsCount(pending);
        })
        .catch(err => console.error(err));
    }
  }, [currentUser, appView, workerTab]);

  const handleLoginSuccess = (user: UserType) => {
    setCurrentUser(user);
    localStorage.setItem('work_user_session', JSON.stringify(user));
    setAppView('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('work_user_session');
    setAppView('landing');
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail) return;
    setSubmittingContact(true);
    setTimeout(() => {
      setSubmittingContact(false);
      setContactSubmitted(true);
    }, 1200);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSubmitted(true);
    setTimeout(() => {
      setNewsletterEmail('');
      setNewsletterSubmitted(false);
      alert('Sua inscrição de newsletter foi confirmada!');
    }, 2000);
  };

  const isLanding = appView === 'landing';

  return (
    <div 
      id="app-main-container" 
      className="min-h-screen bg-[#010312] text-zinc-300 selection:bg-cyan-500 selection:text-slate-950 font-sans transition-all duration-500 overflow-x-hidden relative"
    >
      {/* Dynamic Background glowing items for internal views */}
      <div className="absolute top-[10%] left-[25%] w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[45%] right-[10%] w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Header/Nav Bar */}
      <header 
        id="main-header" 
        className="border-b sticky top-0 z-40 backdrop-blur-lg border-white/5 bg-[#010312]/85 text-white shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[4.5rem] sm:min-h-[6rem] py-2 flex items-center justify-between">
          {/* Logo Brand */}
          <button 
            onClick={() => setAppView(currentUser ? 'dashboard' : 'landing')}
            className="flex items-center gap-2 hover:opacity-95 transition-opacity text-left bg-transparent border-none cursor-pointer"
          >
            <TCWLogo size="sm" showText={true} />
          </button>



          {/* Right Area - Admin/User indicator or CTA button */}
          <div className="flex items-center gap-4">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <div className="text-right hidden md:block">
                  <span className="text-xs font-bold block text-white">{currentUser.fullName}</span>
                  <span className="text-[9px] text-zinc-500 font-mono block uppercase tracking-wider">
                    {currentUser.role === 'admin' ? 'Administrativo (Comitê)' : 'Trabalhador Qualificado'}
                  </span>
                </div>

                <div 
                  onClick={() => setAppView('dashboard')}
                  className="w-9 h-9 rounded-full bg-blue-600/15 border border-blue-500/20 hover:border-cyan-400 hover:bg-blue-600/20 flex items-center justify-center text-cyan-400 cursor-pointer transition-all"
                  title="Acessar Área Interna"
                >
                  <User size={15} />
                </div>

                <button
                  id="header-logout-btn"
                  onClick={handleLogout}
                  className="flex items-center gap-1 py-1.5 px-3 rounded-full text-xs font-bold transition-all cursor-pointer bg-white/5 border border-white/10 hover:border-red-500/30 hover:bg-red-500/10 text-zinc-300 hover:text-red-400"
                >
                  <LogOut size={13} />
                  <span className="hidden sm:inline">Sair</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {appView === 'landing' ? (
                  <>
                    <button
                      id="hero-header-login"
                      onClick={() => setAppView('login')}
                      className="text-xs text-zinc-300 hover:text-white px-4 py-2 hover:bg-white/5 rounded-full transition-all cursor-pointer font-bold tracking-wider uppercase font-mono"
                    >
                      Login
                    </button>
                    {/* Celestial Blue Pill CTA - exactly aligned with 'start a project >' in design */}
                    <button
                      id="hero-header-cta"
                      onClick={() => setAppView('register')}
                      className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black tracking-widest text-[10px] uppercase px-5 py-2 rounded-full cursor-pointer flex items-center gap-1.5 transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)]"
                    >
                      Criar Conta
                      <ChevronRight size={13} className="stroke-[3]" />
                    </button>
                  </>
                ) : (
                  <button
                    id="back-to-landing-btn"
                    onClick={() => setAppView('landing')}
                    className="text-xs text-zinc-300 hover:text-white px-4 py-2 hover:bg-white/5 rounded-full transition-all cursor-pointer font-bold border border-white/10 bg-[#060a23]/40"
                  >
                    Voltar ao Início
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Layout switcher */}
      <main id="app-main-content">
        {isLanding && (
          <div id="landing-universe" className="relative">
            {/* Background glowing items directly simulating the uploaded mock design's celestial look */}
            <div className="absolute top-[10%] left-[25%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-[40%] right-[10%] w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-[10%] left-[5%] w-[450px] h-[450px] bg-violet-600/5 rounded-full blur-[130px] pointer-events-none" />

            {/* HERO SECTION CONTAINER: CLEAN TYPOGRAPHY CENTRIC DESIGNS WITHOUT THE MASSIVE FORMS */}
            <section id="hero-section" className="relative pt-24 pb-20 px-4 max-w-7xl mx-auto z-10 text-center">
              <div className="max-w-4xl mx-auto space-y-8">
                {/* 1. Header Area block with high fidelity contact tag */}
                <div className="space-y-6 pt-4">
                  
                  {/* Giant premium statement */}
                  <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-white leading-[1.1] max-w-4xl mx-auto">
                    Sua jornada internacional <br />
                    <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">começa aqui.</span>
                  </h1>
                  
                  <p className="text-base sm:text-lg text-zinc-400 max-w-3xl mx-auto leading-relaxed">
                    Na TCW, você se cadastra, mostra suas qualificações e fica disponível para oportunidades internacionais. Os contratos são sempre de temporada, com duração de 1 a 3 meses, garantindo flexibilidade e segurança. Após preencher seu perfil com fotos e vídeos, nossa equipe avalia suas habilidades e pode chamá-lo para trabalhar em diferentes países. A contratação é feita exclusivamente pelo nosso email ou por um representante, assegurando transparência e confiança.
                  </p>
                </div>


              </div>
            </section>

            {/* TWO BEAUTIFUL MOCK-DESIGN PREMIUM SECTIONS WITH TEXT/IMAGE AND TEXT/VIDEO */}
            {/* 1. IMAGE SECTION: DESCRIPTION AND PRESENTATION OF THE COMPANY */}
            <section id="about-company" className="py-20 px-4 max-w-7xl mx-auto border-t border-white/5">
              <div 
                className="bg-gradient-to-tr from-[#070d24]/90 to-[#0e163b]/30 border border-white/5 rounded-[2.5rem] p-8 lg:p-14 shadow-2xl backdrop-blur-md"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
                  
                  {/* Left Side Content */}
                  <div className="lg:col-span-6 space-y-6 text-left">
                    <div className="space-y-3">
                      <span className="text-[10px] font-mono font-black text-cyan-400 uppercase tracking-[0.2em] bg-cyan-400/5 px-3 py-1.5 rounded-full border border-cyan-400/20 inline-block">
                        APRESENTAÇÃO CORPORATIVA
                      </span>
                      <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white leading-tight">
                        Nossa História & <br />
                        Valores Globais
                      </h2>
                    </div>

                    <div className="space-y-4 text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans text-justify font-medium">
                      <p>
                        A <strong>Work</strong> é uma iniciativa estratégica inovadora, criada para atender às demandas crescentes da mobilidade internacional e da contratação de profissionais qualificados em diferentes setores. Atuamos de forma sinérgica com empresas globais, oferecendo soluções modernas e seguras para o recrutamento de trabalhadores técnicos e especializados.
                      </p>
                      <p>
                        Sob a tutela do grupo <strong>TCW (Connecting the Future)</strong>, acumulamos mais de uma década de experiência em gestão de talentos e contratos internacionais. Nosso compromisso é apoiar profissionais dinâmicos em seus objetivos de crescimento financeiro e desenvolvimento de carreira, sempre dentro de um modelo regulado e transparente.
                      </p>
                    </div>

                    {/* Action buttons list */}
                    <div className="flex flex-wrap items-center gap-4 pt-2">
                      <button 
                        onClick={() => setAppView('register')}
                        className="bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-black text-[10px] uppercase tracking-wider px-5 py-3 rounded-full hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] hover:scale-[1.02] transition-all cursor-pointer font-sans"
                      >
                        Começar Temporada
                      </button>
                    </div>


                  </div>

                  {/* Right Side Image Frame - Matches photo aspect exactly */}
                  <div className="lg:col-span-6 relative aspect-[16/10] bg-[#0c1432] rounded-[1.8rem] overflow-hidden border border-white/5 shadow-2xl">
                    <img 
                      src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80"
                      alt="TCW Corporate Hub" 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover select-none filter brightness-95 opacity-85 hover:scale-105 transition-transform duration-1000"
                    />
                    {/* Inner glowing edge overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#010414] via-transparent to-transparent pointer-events-none" />
                  </div>

                </div>
              </div>
            </section>



            {/* 2. DEDICATED OPERATIONAL VIDEO SECTION */}
            <section id="video-operational" className="py-16 px-4 max-w-7xl mx-auto border-t border-white/5">
              <div 
                className="bg-gradient-to-tr from-[#0e163b]/40 to-[#070d24]/90 border border-white/5 rounded-[2.5rem] p-8 lg:p-12 shadow-2xl backdrop-blur-md relative overflow-hidden"
              >
                {/* Subtle light leak for high-end look */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
                  
                  {/* Left Column: Testimonial & support statement */}
                  <div className="lg:col-span-5 space-y-6 text-left">
                    <div className="space-y-4">
                      {/* Breathtaking styled double quotation marks */}
                      <span className="text-cyan-400 text-6xl font-serif font-bold block leading-none select-none opacity-80 h-3">
                        “
                      </span>
                      
                      <p className="text-lg sm:text-xl text-zinc-100 font-medium leading-relaxed font-sans pt-3">
                        Na TCW, nós cuidamos de toda burocracia e logística integrada. Nossos contratos de 1 a 3 meses de temporada oferecem retorno financeiro imediato e total flexibilidade para nossos parceiros selecionados.
                      </p>
                    </div>



                    {/* Feature Highlights list */}
                    <div className="space-y-2 pt-2 text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-cyan-400 shrink-0" />
                        Alojamento Homologado & Conforto
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-cyan-400 shrink-0" />
                        Seguro de Viagem & Saúde Incluso
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-cyan-400 shrink-0" />
                        Assistência Documental & Visto Internacional
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-cyan-400 shrink-0" />
                        Gestão de Contrato & Pagamento Garantido
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-cyan-400 shrink-0" />
                        Transporte & Logística de Temporada
                      </div>
                    </div>

                    {/* Quick registration highlight */}
                    <div className="pt-2 flex flex-wrap items-center gap-4">
                      <button 
                        onClick={() => setAppView('register')}
                        className="bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-black text-[10px] uppercase tracking-wider px-5 py-3 rounded-full hover:shadow-[0_0_15px_rgba(34,211,238,0.25)] hover:scale-[1.02] transition-all cursor-pointer font-sans"
                      >
                        Começar Meu Cadastro
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Custom Web Browser Mock Video Player Frame */}
                  <div className="lg:col-span-7">
                    <div className="relative aspect-[16/10] bg-[#020412]/90 rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
                      
                      {/* Browser top-bar interface mimicking high fidelity dashboard designs */}
                      <div className="bg-[#080d24] px-4 py-2 flex items-center gap-2 border-b border-white/5 text-xs text-zinc-500 font-mono select-none">
                        <div className="flex gap-1.5 shrink-0">
                          <span className="w-2.5 h-2.5 rounded-full bg-red-500/60 inline-block" />
                          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60 inline-block" />
                          <span className="w-2.5 h-2.5 rounded-full bg-green-500/60 inline-block" />
                        </div>
                        <div className="mx-auto bg-white/5 px-6 py-0.5 rounded-md text-[9px] text-zinc-400 tracking-wider">
                          tcw_apresentacao_temporada.mp4
                        </div>
                      </div>

                      {/* Video Player content container */}
                      <div className="absolute inset-x-0 bottom-0 top-[29px] overflow-hidden">
                        {isPlayingVideo ? (
                          <iframe
                            src="https://www.youtube.com/embed/9No-FiE9ZMc?autoplay=1&modestbranding=1&rel=0&iv_load_policy=3&hl=pt"
                            title="Apresentação Geral de Temporadas Sazonais"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            className="w-full h-full border-0"
                          />
                        ) : (
                          // High Resolution Poster with Pulsating Play Button overlay
                          <div className="relative w-full h-full cursor-pointer" onClick={() => setIsPlayingVideo(true)}>
                            <img 
                              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80" 
                              alt="Apresentação de Temporada Sazonal" 
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover brightness-90 group-hover:scale-102 transition-transform duration-700"
                            />
                            {/* Translucent overlay mask */}
                            <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-colors duration-500" />
                            
                            {/* Translucent Play circle overlay centered perfectly */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 cursor-pointer duration-300 transition-all scale-100 group-hover:scale-110 active:scale-95 shadow-xl relative">
                                <div className="absolute -inset-2 bg-cyan-400/20 rounded-full blur animate-ping opacity-30" />
                                <Play size={20} className="text-white fill-white translate-x-0.5 stroke-[2.5]" />
                              </div>
                            </div>

                            {/* Live Badge overlay */}
                            <div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-[9px] font-mono font-bold text-cyan-400 uppercase tracking-widest bg-slate-950/70 border border-white/5 py-1 px-3 rounded-full">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse inline-block" />
                              PRONTOS PARA TRABALHO • ASSISTIR AGORA
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </section>



            {/* 3. DEDICATED PHOTOS SHOWCASE SECTION BELOW THE VIDEO CONTAINER */}
            <section id="photos-environment" className="pb-28 px-4 max-w-7xl mx-auto">
              <div className="space-y-12">
                {/* Centered Heading Section */}
                <div className="max-w-2xl mx-auto text-center space-y-4">
                  <span className="text-[10px] font-mono font-black text-cyan-400 uppercase tracking-[0.25em] bg-cyan-400/5 px-3 py-1.5 rounded-full border border-cyan-400/20 inline-block">
                    GALERIA DE PROFISSÕES
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-white uppercase tracking-tight font-display">
                    Nossas Frentes de Atuação
                  </h2>
                  <p className="text-sm text-zinc-400 leading-relaxed font-sans max-w-xl mx-auto">
                    Confira imagens reais dos alojamentos, frentes de transporte logística e ambientes homologados mantidos com alta qualidade e conforto pelo grupo TCW.
                  </p>
                </div>

                {/* Grid Layout containing 4 Gorgeous photo cards with custom tags */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  
                  {/* Card 1: Carpinteiros */}
                  <div className="bg-[#05081b]/40 border border-white/5 rounded-3xl overflow-hidden hover:border-cyan-500/20 transition-all duration-500 flex flex-col group justify-between">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1426927308491-6380b6a9936f?auto=format&fit=crop&w=600&q=80" 
                        alt="Carpinteiros estruturais" 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-750 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="text-[9px] font-mono font-bold text-cyan-400 uppercase tracking-wider bg-slate-950/80 px-2 py-0.5 rounded-full border border-white/5">
                          CARPINTARIA
                        </span>
                      </div>
                    </div>
                    <div className="p-4 space-y-1 text-left">
                      <h4 className="text-sm font-bold text-white uppercase tracking-tight">Carpinteiros</h4>
                      <p className="text-xs text-zinc-400 font-sans leading-normal">
                        estruturas e acabamentos de madeira para obras e montagens de eventos.
                      </p>
                    </div>
                  </div>

                  {/* Card 2: Eletricistas */}
                  <div className="bg-[#05081b]/40 border border-white/5 rounded-3xl overflow-hidden hover:border-cyan-500/20 transition-all duration-500 flex flex-col group justify-between">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80" 
                        alt="Eletricistas qualificados" 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-750 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="text-[9px] font-mono font-bold text-cyan-400 uppercase tracking-wider bg-slate-950/80 px-2 py-0.5 rounded-full border border-white/5">
                          ELETRICIDADE
                        </span>
                      </div>
                    </div>
                    <div className="p-4 space-y-1 text-left">
                      <h4 className="text-sm font-bold text-white uppercase tracking-tight">Eletricistas</h4>
                      <p className="text-xs text-zinc-400 font-sans leading-normal">
                        instalações elétricas seguras em canteiros e arenas.
                      </p>
                    </div>
                  </div>

                  {/* Card 3: Bombeiros Hidráulicos */}
                  <div className="bg-[#05081b]/40 border border-white/5 rounded-3xl overflow-hidden hover:border-cyan-500/20 transition-all duration-500 flex flex-col group justify-between">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80" 
                        alt="Instalações hidráulicas" 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-750 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="text-[9px] font-mono font-bold text-cyan-400 uppercase tracking-wider bg-slate-950/80 px-2 py-0.5 rounded-full border border-white/5">
                          HIDRÁULICA
                        </span>
                      </div>
                    </div>
                    <div className="p-4 space-y-1 text-left">
                      <h4 className="text-sm font-bold text-white uppercase tracking-tight">Bombeiros Hidráulicos</h4>
                      <p className="text-xs text-zinc-400 font-sans leading-normal">
                        sistemas hidráulicos e encanamentos em obras e estruturas temporárias.
                      </p>
                    </div>
                  </div>

                  {/* Card 4: Operadores de Empilhadeira */}
                  <div className="bg-[#05081b]/40 border border-white/5 rounded-3xl overflow-hidden hover:border-cyan-500/20 transition-all duration-500 flex flex-col group justify-between">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80" 
                        alt="Operação de Empilhadeira Logística" 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-750 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="text-[9px] font-mono font-bold text-cyan-400 uppercase tracking-wider bg-slate-950/80 px-2 py-0.5 rounded-full border border-white/5">
                          LOGÍSTICA / CARGAS
                        </span>
                      </div>
                    </div>
                    <div className="p-4 space-y-1 text-left">
                      <h4 className="text-sm font-bold text-white uppercase tracking-tight">Operadores de Empilhadeira</h4>
                      <p className="text-xs text-zinc-400 font-sans leading-normal">
                        logística e movimentação de cargas em obras e montagens de palco.
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            </section>



          </div>
        )}

        {/* AUTHENTICATION SCHEMAS */}
        {appView === 'login' && (
          <LoginForm 
            onSuccess={handleLoginSuccess}
            onNavigateToRegister={() => setAppView('register')}
          />
        )}

        {appView === 'register' && (
          <RegisterForm 
            onSuccess={handleLoginSuccess}
            onNavigateToLogin={() => setAppView('login')}
          />
        )}

        {/* AUTHORIZED REGION (DASHBOARDS) */}
        {appView === 'dashboard' && currentUser && (
          <div id="authorized-app-views" className="font-sans">
            {currentUser.role === 'admin' ? (
              /* ADMIN DASHBOARD COMPONENT */
              <AdminDashboard />
            ) : (
              /* WORKER CLIENT INTERFACE */
              <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 text-zinc-350">
                {/* Responsive welcome card */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 bg-[#060a23]/60 border border-white/5 backdrop-blur-md rounded-3xl shadow-[0_4px_30px_rgba(0,0,0,0.3)] gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-cyan-950/40 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                      <User size={18} />
                    </div>
                    <div>
                      <h4 className="font-display text-sm font-bold text-white">Bem-vindo(a), {currentUser.fullName}!</h4>
                      <p className="text-xs text-zinc-400 mt-0.5">Mantenha seu perfil completo para obter liberação imediata de visto consular.</p>
                    </div>
                  </div>

                  {/* Dynamic sub navigation tabs */}
                  <div className="flex bg-[#0b112d] p-1.5 w-full sm:w-auto rounded-2xl border border-white/5">
                    <button
                      id="worker-tab-profile-trigger"
                      onClick={() => setWorkerTab('profile')}
                      className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider ${
                        workerTab === 'profile' 
                          ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-md shadow-cyan-400/10' 
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      <User size={14} />
                      Qualificações Técnicas
                    </button>
                    <button
                      id="worker-tab-contracts-trigger"
                      onClick={() => setWorkerTab('contracts')}
                      className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer relative uppercase tracking-wider ${
                        workerTab === 'contracts' 
                          ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-md shadow-cyan-400/10' 
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      <FileText size={14} />
                      Contratos Emitidos
                      {pendingContractsCount > 0 && (
                        <span id="badge-pending" className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-red-500 text-white font-mono font-black text-[9px] flex items-center justify-center animate-pulse shadow-md">
                          {pendingContractsCount}
                        </span>
                      )}
                    </button>
                  </div>
                </div>

                {/* Sub components container rendering */}
                {workerTab === 'profile' ? (
                  <WorkerProfileForm userId={currentUser.id} />
                ) : (
                  <ContractViewer userId={currentUser.id} />
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* LUXURY TYPOGRAPHIC FOOTER MATCHING BRANDMODE LAYOUT EXACTLY ON LANDING */}
      <footer 
        id="app-main-footer" 
        className="border-t py-8 transition-all duration-500 leading-relaxed border-white/5 bg-[#010210] text-[#8e98b0]"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          {/* Legal copyrights */}
          <div className="text-center text-[10px] font-mono text-zinc-650 flex flex-col sm:flex-row items-center sm:justify-between gap-4">
            <span className="uppercase tracking-wider">
              © 2026 WORK INC. • PLATAFORMA DE EXPATRIAÇÃO REGULAR E ACORDO SAZONAL
            </span>
            <span className="text-[10px]">
              Desenvolvido sob o comitê de mobilidade consular corporativa do grupo TCW.
            </span>
          </div>

        </div>
      </footer>
    </div>
  );
}
