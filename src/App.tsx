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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo Brand */}
          <button 
            onClick={() => setAppView(currentUser ? 'dashboard' : 'landing')}
            className="flex items-center gap-2 hover:opacity-95 transition-opacity text-left bg-transparent border-none cursor-pointer"
          >
            <TCWLogo size="sm" showText={true} />
          </button>

          {/* Navigation Links - Centered (matches layout image menu) */}
          {isLanding && (
            <nav className="hidden lg:flex items-center gap-8 text-[11px] font-bold text-zinc-400 uppercase tracking-[0.18em]">
              <a href="#hero-section" className="text-white hover:text-cyan-400 transition-colors">Home</a>
              <a href="#about-company" className="hover:text-cyan-400 text-zinc-400 transition-colors">Quem Somos</a>
              <a href="#video-operational" className="hover:text-cyan-400 text-zinc-400 transition-colors">Como Funciona</a>
              <a href="#contact-section" className="hover:text-cyan-400 text-zinc-400 transition-colors">Contato</a>
            </nav>
          )}

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
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 text-cyan-400 text-[10px] font-mono tracking-widest uppercase rounded-full shadow-[0_0_15px_rgba(59,130,246,0.15)]">
                    <Sparkles size={11} className="text-blue-400 rotate-12" />
                    BEM-VINDO AO TCW WORK
                  </div>
                  
                  {/* Giant premium statement */}
                  <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-white leading-[1.1] max-w-4xl mx-auto">
                    Trabalhe no exterior. <br />
                    <span className="font-light text-zinc-400 font-sans">Mas </span>
                    <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">você primeiro.</span>
                  </h1>
                  
                  <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                    A plataforma oficial de qualificação técnica para frentes operacionais internacionais reguladas por patrocinadores credenciados do grupo TCW.
                  </p>
                </div>

                {/* Hero Actions */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-4">
                  <button
                    id="hero-register-btn"
                    onClick={() => setAppView('register')}
                    className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 hover:from-cyan-300 hover:via-blue-400 hover:to-indigo-500 text-slate-950 font-black tracking-widest text-xs uppercase px-8 py-4 rounded-full cursor-pointer flex items-center gap-2 transition-all shadow-[0_0_30px_rgba(34,211,238,0.25)] hover:scale-[1.02] active:scale-95"
                  >
                    Começar Temporada
                    <ChevronRight size={14} className="stroke-[3]" />
                  </button>
                  <a
                    href="#contact-section"
                    className="bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white px-8 py-4 rounded-full transition-all cursor-pointer font-bold border border-white/5 tracking-wider uppercase text-xs font-mono"
                  >
                    Falar com Consultores
                  </a>
                </div>

                {/* Optional subtle platform metrics to fill space elegantly without clutter */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-12 border-t border-white/5">
                  <div>
                    <span className="block text-2xl font-black text-white">100%</span>
                    <span className="block text-[9px] font-mono uppercase text-zinc-500 tracking-wider">Conformidade Legal</span>
                  </div>
                  <div>
                    <span className="block text-2xl font-black text-white">1 a 3</span>
                    <span className="block text-[9px] font-mono uppercase text-zinc-500 tracking-wider">Meses de Temporada</span>
                  </div>
                  <div>
                    <span className="block text-2xl font-black text-white">+10 Anos</span>
                    <span className="block text-[9px] font-mono uppercase text-zinc-500 tracking-wider font-bold">De Atuação Global</span>
                  </div>
                  <div>
                    <span className="block text-2xl font-black text-white">0%</span>
                    <span className="block text-[9px] font-mono uppercase text-zinc-500 tracking-wider">Custos Ocultos</span>
                  </div>
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
                        A <strong>Work</strong> é uma iniciativa estratégica inovadora, atuando de maneira sinérgica à mobilidade internacional sob a tutela do grupo <strong>TCW (Connecting the Future)</strong>. Há mais de uma década, o comitê gerencia soluções de recrutamento de trabalhadores técnicos altamente qualificados.
                      </p>
                      <p>
                        Apoiamos profissionais dinâmicos nos seus anseios de ascensão financeira através de contratos regulados com duração de <strong>1 a 3 meses</strong>. Todas as etapas de conformidade, obtenção de passaportes e liberação física são fiscalizadas rigorosamente.
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
                      
                      <a 
                        href="#contact-section"
                        className="text-[10px] uppercase font-bold tracking-wider hover:text-white text-zinc-400 transition-colors py-3"
                      >
                        Falar com Consultores
                      </a>
                    </div>

                    {/* Social icons list aligned in the left col inside the Our Studio style */}
                    <div className="pt-4 border-t border-white/5">
                      <span className="text-[9px] text-zinc-500 font-mono uppercase block font-bold tracking-widest mb-3">Siga-nos nas Redes</span>
                      <div className="flex items-center gap-3">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-zinc-400 hover:text-cyan-400 hover:border-cyan-400/30 transition-all hover:scale-105">
                          <Facebook size={14} />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-zinc-400 hover:text-cyan-400 hover:border-cyan-400/30 transition-all hover:scale-105">
                          <Twitter size={14} />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-zinc-400 hover:text-cyan-400 hover:border-cyan-400/30 transition-all hover:scale-105">
                          <Instagram size={14} />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-zinc-400 hover:text-cyan-400 hover:border-cyan-400/30 transition-all hover:scale-105">
                          <Linkedin size={14} />
                        </a>
                      </div>
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

            {/* 2. VIDEO SECTION: DETAILED DESCRIPTION AND INTEGRATED YOUTUBE PLAYER */}
            <section id="video-operational" className="pb-24 px-4 max-w-7xl mx-auto">
              <div 
                className="bg-gradient-to-tr from-[#0e163b]/30 to-[#070d24]/90 border border-white/5 rounded-[2.5rem] p-8 lg:p-14 shadow-2xl backdrop-blur-md"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
                  
                  {/* Left Side Content */}
                  <div className="lg:col-span-6 space-y-6 text-left lg:order-last">
                    <div className="space-y-3">
                      <span className="text-[10px] font-mono font-black text-cyan-400 uppercase tracking-[0.2em] bg-cyan-400/5 px-3 py-1.5 rounded-full border border-cyan-400/20 inline-block">
                        PROCESSO OPERACIONAL EM VÍDEO
                      </span>
                      <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white leading-tight">
                        Vivência & Logística <br />
                        das Atividades Sazonais
                      </h2>
                    </div>

                    <div className="space-y-4 text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans text-justify font-medium">
                      <p>
                        Preparamos esse material multimídia explicativo para desmistificar o funcionamento prático das frentes produtivas. Inscrevendo seu interesse, você terá acesso a toda infraestrutura oficial de moradia compartilhada e alimentação em vinhedos, almoxarifados ou construções.
                      </p>
                      <p>
                        A mobilidade com a <strong>Work</strong> elimina as propostas informais enganosas: todo e-mail de patrocínio é emitido eletronicamente via sistema seguro após certificação de segurança civil interna e checagem de antecedentes.
                      </p>
                    </div>

                    {/* Features checklist */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-cyan-400 shrink-0" />
                        Alojamento Homologado
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-cyan-400 shrink-0" />
                        Passagem de Ida/Volta
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-cyan-400 shrink-0" />
                        Seguro-Saúde Garantido
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-cyan-400 shrink-0" />
                        Repouso Semanal Pago
                      </div>
                    </div>

                    {/* Click CTA to platform */}
                    <div className="pt-4 flex items-center gap-4 border-t border-white/5">
                      <button 
                        onClick={() => setAppView('register')}
                        className="bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-black text-[10px] uppercase tracking-wider px-5 py-3 rounded-full hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] hover:scale-[1.02] transition-all cursor-pointer font-sans"
                      >
                        Criar Cadastro Grátis
                      </button>
                      <span className="flex items-center gap-1 text-[9px] font-mono font-black text-cyan-400 uppercase tracking-widest bg-cyan-400/5 px-2.5 py-1 rounded-full border border-cyan-400/10">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse inline-block" />
                        HD 1080P ACTIVE
                      </span>
                    </div>
                  </div>

                  {/* Right Side Video Player Frame - Aligned beautifully */}
                  <div className="lg:col-span-6 relative aspect-[16/10] bg-slate-950 rounded-[1.8rem] overflow-hidden border border-white/5 shadow-2xl">
                    <iframe
                      src="https://www.youtube.com/embed/9No-FiE9ZMc?modestbranding=1&rel=0&iv_load_policy=3&hl=pt"
                      title="Work Presentation Guide video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="w-full h-full border-0 object-cover"
                    />
                  </div>

                </div>
              </div>
            </section>

            {/* CONTACT SECTION AT THE END OF THE PAGE NO RODA PE */}
            <section id="contact-section" className="py-20 px-4 max-w-7xl mx-auto border-t border-white/5">
              <div className="space-y-12 max-w-5xl mx-auto">
                {/* Header for the section */}
                <div className="text-center space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 text-cyan-400 text-[10px] font-mono tracking-widest uppercase rounded-full shadow-[0_0_15px_rgba(59,130,246,0.15)]">
                    <Sparkles size={11} className="text-blue-400 rotate-12" />
                    CONTE CONOSCO
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">
                    Fale com Nossos Consultores
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-400 max-w-sm mx-auto uppercase tracking-wide leading-relaxed font-semibold">
                    Envie sua mensagem ou visite a nossa matriz governamental para obter total conformidade consular.
                  </p>
                </div>

                <div id="contact-block" className="max-w-3xl mx-auto w-full">
                  
                  {/* Contact form */}
                  <div className="space-y-4">
                    <div className="bg-[#060a23]/30 border border-white/5 bg-gradient-to-tr from-[#05081b] to-transparent rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl relative">
                      {/* Form status / success switch */}
                      <AnimatePresence mode="wait">
                        {!contactSubmitted ? (
                          <form onSubmit={handleContactSubmit} className="space-y-6">
                            
                            {/* Row 1: Name & Email */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <label className="text-zinc-500 font-mono uppercase text-[9px] font-bold tracking-wider block">
                                  Olá, meu nome é:
                                </label>
                                <input
                                  type="text"
                                  required
                                  placeholder="Nome Completo"
                                  value={contactName}
                                  onChange={(e) => setContactName(e.target.value)}
                                  className="w-full bg-[#0b112d] border border-white/5 focus:border-[#22d3ee] outline-none text-white px-4 py-3 placeholder-zinc-650 text-xs sm:text-sm rounded-xl transition-all font-sans font-medium"
                                />
                              </div>

                              <div className="space-y-1.5">
                                <label className="text-zinc-500 font-mono uppercase text-[9px] font-bold tracking-wider block">
                                  Meu melhor e-mail é:
                                </label>
                                <input
                                  type="email"
                                  required
                                  placeholder="nome@provedor.com"
                                  value={contactEmail}
                                  onChange={(e) => setContactEmail(e.target.value)}
                                  className="w-full bg-[#0b112d] border border-white/5 focus:border-[#22d3ee] outline-none text-white px-4 py-3 placeholder-zinc-650 text-xs sm:text-sm rounded-xl transition-all font-sans font-medium"
                                />
                              </div>
                            </div>

                            {/* Row 2: Interest & Discovery channels */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <label className="text-zinc-500 font-mono uppercase text-[9px] font-bold tracking-wider block">
                                  Tenho interesse em:
                                </label>
                                <select
                                  value={interestType}
                                  onChange={(e) => setInterestType(e.target.value)}
                                  className="w-full bg-[#0b112d] border border-white/5 focus:border-[#22d3ee] outline-none text-white px-3 py-3 text-xs sm:text-sm rounded-xl transition-all font-sans font-semibold appearance-none"
                                >
                                  <option value="Trabalhar em temporadas sazonais (Candidato)">Temporada Sazonal (Candidato)</option>
                                  <option value="Processo de Patrocínio de Vagas (Empregador)">Patrocinar Trabalhador (Sponsor)</option>
                                  <option value="Outros Assuntos de Mobilidade Consular">Suporte Geral do Comitê</option>
                                </select>
                              </div>

                              <div className="space-y-1.5">
                                <label className="text-zinc-500 font-mono uppercase text-[9px] font-bold tracking-wider block">
                                  Como nos conheceu?
                                </label>
                                <select
                                  value={hearAbout}
                                  onChange={(e) => setHearAbout(e.target.value)}
                                  className="w-full bg-[#0b112d] border border-white/5 focus:border-[#22d3ee] outline-none text-white px-3 py-3 text-xs sm:text-sm rounded-xl transition-all font-sans font-semibold appearance-none"
                                >
                                  <option value="Instagram / Facebook">Instagram / Facebook</option>
                                  <option value="Mecanismo de Busca Google">Busca do Google</option>
                                  <option value="Contato Direto no WhatsApp">Suporte no WhatsApp</option>
                                  <option value="Indicação de Colega">Indicação Directa</option>
                                </select>
                              </div>
                            </div>

                            {/* Row 3: About interest */}
                            <div className="space-y-1.5">
                              <label className="text-zinc-500 font-mono uppercase text-[9px] font-bold tracking-wider block">
                                Sobre os seus objetivos:
                                <span className="text-[8px] text-zinc-650 ml-1 italic">(Informativo opcional)</span>
                              </label>
                              <textarea
                                rows={4}
                                placeholder="Descreva brevemente seus objetivos profissionais ou o tipo de mão de obra sazonal que necessita..."
                                value={contactMessage}
                                onChange={(e) => setContactMessage(e.target.value)}
                                className="w-full bg-[#0b112d] border border-white/5 focus:border-[#22d3ee] outline-none text-white px-4 py-3 placeholder-zinc-650 text-xs sm:text-sm rounded-xl transition-all font-sans font-medium resize-none leading-relaxed"
                              />
                            </div>

                            {/* Celestial Submit button */}
                            <button
                              type="submit"
                              disabled={submittingContact}
                              className="w-full flex items-center justify-center py-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 hover:from-cyan-300 hover:via-blue-400 hover:to-indigo-500 text-slate-950 font-black text-xs uppercase tracking-widest transition-all cursor-pointer rounded-xl hover:shadow-[0_0_25px_rgba(34,211,238,0.25)] active:scale-95 disabled:opacity-50"
                            >
                              {submittingContact ? (
                                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent animate-spin rounded-full" />
                              ) : (
                                "Enviar Mensagem"
                              )}
                            </button>
                          </form>
                        ) : (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-10 space-y-6"
                          >
                            <div className="w-14 h-14 bg-cyan-500/10 border border-cyan-400/30 text-cyan-400 rounded-full flex items-center justify-center mx-auto shadow-md">
                              <Check size={26} className="stroke-[3]" />
                            </div>
                            <div className="space-y-2">
                              <h3 className="text-lg font-bold text-white uppercase tracking-tight">Obrigado pelo contato, {contactName}!</h3>
                              <p className="text-zinc-400 text-xs leading-relaxed max-w-sm mx-auto font-medium">
                                Seus objetivos foram registrados em nossa fila corporativa. Gostaríamos de sugerir que complete o seu cadastro seguro na plataforma para poder obter seu dossiê completo.
                              </p>
                            </div>
                            
                            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                              <button
                                onClick={() => setAppView('register')}
                                className="bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-black text-xs uppercase px-6 py-3 rounded-xl hover:shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                              >
                                Cadastrar Minha Conta
                              </button>
                              <button
                                onClick={() => {
                                  setContactSubmitted(false);
                                  setContactName('');
                                  setContactEmail('');
                                  setContactMessage('');
                                }}
                                className="bg-white/5 hover:bg-white/10 text-zinc-300 font-bold text-xs uppercase px-5 py-3 rounded-xl transition-all cursor-pointer border border-white/5"
                              >
                                Nova Mensagem
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
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
        className="border-t py-16 md:py-20 transition-all duration-500 leading-relaxed border-white/5 bg-[#010210] text-[#8e98b0]"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          {/* Main Footer Triple grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-white/5 text-left">
            
            {/* Col 1: Hero talk (matches left 'Let's talk about your project') */}
            <div className="md:col-span-4 space-y-6">
              <div className="space-y-4">
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-[0.25em] block">
                  HELLO! WE'RE LISTENING
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight uppercase font-display tracking-tight">
                  Construa sua <br />
                  trajetória de <br />
                  <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">temporada.</span>
                </h2>
                <p className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider block">
                  SOUND GOOD? LET'S CONNECT!
                </p>
              </div>

              {/* Bottom logo brand */}
              <div className="pt-4 flex items-center gap-1 select-none">
                <span className="text-lg font-black tracking-normal text-white uppercase font-display">
                  TCW <span className="text-cyan-400">WORK.</span>
                </span>
              </div>
            </div>

            {/* Col 2: Connections and Newsletter (matches center of the design image) */}
            <div className="md:col-span-4 space-y-8">
              <div className="space-y-3">
                <h3 className="text-xs font-mono font-black text-cyan-400 uppercase tracking-widest">
                  Connect with us
                </h3>
                <div className="space-y-2 text-xs sm:text-sm">
                  <p className="font-semibold text-white">contato@tcwgroup.com</p>
                  <p className="font-semibold text-zinc-400">+55 (11) 3280-4950</p>
                </div>
              </div>

              {/* Newsletter block */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono font-black text-cyan-400 uppercase tracking-widest">
                  Join our newsletter
                </h3>
                <form onSubmit={handleNewsletterSubmit} className="relative max-w-sm">
                  <input
                    type="email"
                    required
                    placeholder="Seu endereço de e-mail"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/5 focus:border-cyan-400/50 outline-none text-white px-4 py-3 placeholder-zinc-600 text-xs rounded-xl transition-all font-sans"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1.5 w-9 h-9 rounded-lg bg-cyan-400 text-slate-950 flex items-center justify-center hover:bg-cyan-300 transition-colors cursor-pointer"
                    title="Inscrever-se"
                  >
                    <Send size={12} className="stroke-[2.5]" />
                  </button>
                </form>
              </div>
            </div>

            {/* Col 3: Address and social follow us list (matches right of the design image) */}
            <div className="md:col-span-4 space-y-8">
              <div className="space-y-3">
                <h3 className="text-xs font-mono font-black text-cyan-400 uppercase tracking-widest">
                  Address
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed font-sans text-zinc-300 font-semibold">
                  Av. Paulista, 1000, 14º Andar <br />
                  Bela Vista, São Paulo, SP, Brasil <br />
                  <span className="text-zinc-500 font-mono text-[10px] uppercase font-bold mt-1 block">Segunda à Sexta, das 9h às 17h</span>
                </p>
              </div>

              {/* Simple follow list (matches design list on bottom-right) */}
              <div className="space-y-2">
                <h3 className="text-xs font-mono font-black text-cyan-400 uppercase tracking-widest block mb-3">
                  Follow us
                </h3>
                <div className="grid grid-cols-2 gap-2 text-xs font-sans">
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-cyan-400 transition-colors font-medium">Facebook</a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-cyan-400 transition-colors font-medium">Twitter</a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-cyan-400 transition-colors font-medium">Instagram</a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-cyan-400 transition-colors font-medium">LinkedIn</a>
                </div>
              </div>
            </div>

          </div>

          {/* Legal copyrights */}
          <div className="pt-8 text-center text-[10px] font-mono text-zinc-650 flex flex-col sm:flex-row items-center sm:justify-between gap-4">
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
