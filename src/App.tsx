import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Briefcase, Shield, Clock, FileText, Globe, LogOut, User, 
  MapPin, CheckCircle2, Navigation, ArrowRight, Compass, HeartHandshake, LogIn
} from 'lucide-react';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import WorkerProfileForm from './components/WorkerProfileForm';
import ContractViewer from './components/ContractViewer';
import AdminDashboard from './components/AdminDashboard';
import { User as UserType } from './types';
import { api } from './services/api';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [appView, setAppView] = useState<'landing' | 'login' | 'register' | 'dashboard'>('landing');
  const [workerTab, setWorkerTab] = useState<'profile' | 'contracts'>('profile');
  const [pendingContractsCount, setPendingContractsCount] = useState(0);

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

  return (
    <div id="app-main-container" className="min-h-screen bg-black text-gray-100 font-sans selection:bg-emerald-500 selection:text-black">
      {/* Header */}
      <header id="main-header" className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <button 
            onClick={() => setAppView(currentUser ? 'dashboard' : 'landing')}
            className="flex items-center gap-2.5 hover:opacity-90 transition-opacity text-left bg-transparent border-none cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center font-bold text-black text-lg shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              W
            </div>
            <div>
              <span className="font-display text-lg font-extrabold tracking-tight text-white block">Work</span>
              <span className="text-[9px] font-mono tracking-wider text-emerald-400 block uppercase font-bold">Temporadas</span>
            </div>
          </button>

          <div className="flex items-center gap-4">
            {currentUser ? (
              <div className="flex items-center gap-3 sm:gap-6">
                <div className="text-right hidden sm:block">
                  <span className="text-xs font-semibold text-white block">{currentUser.fullName}</span>
                  <span className="text-[10px] text-zinc-500 font-mono block uppercase">
                    {currentUser.role === 'admin' ? 'Administrador' : 'Trabalhador Qualificado'}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
                  <User size={16} />
                </div>
                <button
                  id="header-logout-btn"
                  onClick={handleLogout}
                  title="Sair da plataforma"
                  className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-zinc-905 border border-zinc-900 hover:border-red-900/65 hover:bg-red-950/10 text-xs text-zinc-400 hover:text-red-400 transition-all cursor-pointer font-sans font-bold"
                >
                  <LogOut size={14} />
                  <span className="hidden sm:inline">Sair</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {appView === 'landing' ? (
                  <>
                    <button
                      id="hero-header-login"
                      onClick={() => setAppView('login')}
                      className="text-xs sm:text-sm text-zinc-300 hover:text-white px-4 py-2 hover:bg-zinc-900 rounded-xl transition-all cursor-pointer font-sans"
                    >
                      Login
                    </button>
                    <button
                      id="hero-header-register"
                      onClick={() => setAppView('register')}
                      className="text-xs sm:text-sm bg-white text-black font-semibold px-4 py-2 hover:bg-emerald-500 rounded-xl transition-all cursor-pointer font-sans shadow-lg shadow-white/5"
                    >
                      Cadastrar-se
                    </button>
                  </>
                ) : (
                  <button
                    id="back-to-landing-btn"
                    onClick={() => setAppView('landing')}
                    className="text-xs sm:text-sm text-zinc-400 hover:text-white px-4 py-2 hover:bg-zinc-900 rounded-xl transition-all cursor-pointer font-sans"
                  >
                    Voltar ao início
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main */}
      <main id="app-main-content">
        {appView === 'landing' && (
          <div id="landing-view">
            {/* Hero */}
            <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 flex flex-col items-center">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-gradient-radial from-emerald-950/20 to-transparent opacity-60 pointer-events-none" />
              <div className="max-w-4xl mx-auto px-4 text-center space-y-6 relative z-10">
                <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-emerald-950 text-emerald-400 border border-emerald-900 inline-flex items-center gap-1.5 animate-pulse">
                  <Compass size={14} className="animate-spin duration-1000" />
                  Temporadas Internacionais de 1 a 3 Meses
                </span>
                <h1 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
                  Construa sua Trajetória <br />
                  <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">Trabalhando no Exterior</span>
                </h1>
                <p className="text-sm sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed font-sans">
                  A <strong>Work</strong> é a plataforma oficial que conecta profissionais qualificados a patrocinadores para contratos de curto prazo garantidos. Viaje a trabalho, aprimore outro idioma e tenha subsídio de moradia e transporte coberto por empregadores contratantes!
                </p>
              </div>
            </section>

                       {/* Vídeo de Apresentação */}
            <section className="py-16 bg-zinc-950 border-t border-zinc-900">
              <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
                <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  Vídeo de Apresentação
                </h2>
                <p className="text-sm text-zinc-500 max-w-2xl mx-auto">
                  Assista ao vídeo institucional e conheça como a plataforma Work conecta profissionais qualificados a oportunidades internacionais.
                </p>
                <div className="rounded-xl overflow-hidden border border-zinc-800 shadow-lg">
                  <video controls className="w-full">
                    <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
                    Seu navegador não suporta vídeos HTML5.
                  </video>
                </div>
              </div>
            </section>

            {/* Galeria de Fotos */}
            <section className="py-16 bg-zinc-950/70 border-t border-zinc-900">
              <div className="max-w-6xl mx-auto px-4 text-center space-y-8">
                <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  Fotos dos Profissionais
                </h2>
                <p className="text-sm text-zinc-500 max-w-2xl mx-auto">
                  Veja alguns dos trabalhadores em ação durante suas temporadas internacionais.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  <img src="https://via.placeholder.com/300x200" alt="Profissional 1" className="rounded-xl border border-zinc-800 hover:opacity-90 transition" />
                  <img src="https://via.placeholder.com/300x200" alt="Profissional 2" className="rounded-xl border border-zinc-800 hover:opacity-90 transition" />
                  <img src="https://via.placeholder.com/300x200" alt="Profissional 3" className="rounded-xl border border-zinc-800 hover:opacity-90 transition" />
                  <img src="https://via.placeholder.com/300x200" alt="Profissional 4" className="rounded-xl border border-zinc-800 hover:opacity-90 transition" />
                </div>
              </div>
            </section>

            {/* Seção explicativa */}
            <section className="border-t border-zinc-900 py-16 bg-zinc-950/40">
              <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-12">
                  <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">Como Funciona a Temporada?</h2>
                  <p className="text-xs sm:text-sm text-zinc-500 mt-2 max-w-md mx-auto">
                    Tudo estruturado sob medidas de conformidade e passaporte para segurança máxima do trabalhador.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Card 1 */}
                  <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-3xl space-y-4">
                    <div className="w-12 h-12 bg-emerald-950/55 rounded-2xl border border-emerald-900 flex items-center justify-center text-emerald-400">
                      <Clock size={20} />
                    </div>
                    <h3 className="font-display font-bold text-lg text-white">Contrato Curto (1 a 3 Meses)</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                      Ideal para quem deseja acumular rendimentos consistentes e experiência multinacional sem a necessidade de migração definitiva.
                    </p>
                  </div>

                  {/* Card 2 */}
                  <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-3xl space-y-4">
                    <div className="w-12 h-12 bg-emerald-950/55 rounded-2xl border border-emerald-900 flex items-center justify-center text-emerald-400">
                      <Shield size={20} />
                    </div>
                    <h3 className="font-display font-bold text-lg text-white">Subsídios Integrais Inclusos</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                      Os contratos cobrem despesas com alojamento homologado, transporte, passagens aéreas e seguro internacional de trabalho.
                    </p>
                  </div>

                  {/* Card 3 */}
                  <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-3xl space-y-4">
                    <div className="w-12 h-12 bg-emerald-950/55 rounded-2xl border border-emerald-900 flex items-center justify-center text-emerald-400">
                      <HeartHandshake size={20} />
                    </div>
                    <h3 className="font-display font-bold text-lg text-white">Aprovação Segura</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                      Sua documentação e mídias passam por crivo especializado corporativo, blindando contra propostas fraudulentas.
                    </p>
                  </div>
                </div>
              </div>
            </section>
