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

  return (
    <div id="app-main-container" className="min-h-screen bg-black text-gray-100 font-sans selection:bg-emerald-500 selection:text-black">
      {/* Header/Nav Bar */}
      <header id="main-header" className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Logo Brand */}
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

          {/* Nav Links / Actions */}
          <div className="flex items-center gap-4">
            {currentUser ? (
              <div className="flex items-center gap-3 sm:gap-6">
                {/* User Info Capsule */}
                <div className="text-right hidden sm:block">
                  <span className="text-xs font-semibold text-white block">{currentUser.fullName}</span>
                  <span className="text-[10px] text-zinc-500 font-mono block uppercase">
                    {currentUser.role === 'admin' ? 'Administrador' : 'Trabalhador Qualificado'}
                  </span>
                </div>

                {/* Role Icon indicators */}
                <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
                  <User size={16} />
                </div>

                {/* Logout */}
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

      {/* Main Content Layout switcher */}
      <main id="app-main-content">
        {appView === 'landing' && (
          <div id="landing-view">
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 flex flex-col items-center">
              {/* Decorative radial overlay */}
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

                <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-4">
                  <button
                    id="hero-register-cta"
                    onClick={() => setAppView('register')}
                    className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-2xl text-sm transition-all duration-300 transform hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-emerald-950/20"
                  >
                    Cadastre suas Qualificações
                    <ArrowRight size={16} />
                  </button>
                  
                  <button
                    id="hero-login-cta"
                    onClick={() => setAppView('login')}
                    className="w-full sm:w-auto px-8 py-4 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-white font-semibold rounded-2xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Acessar Área Restrita
                    <LogIn size={16} className="text-zinc-500" />
                  </button>
                </div>
              </div>
            </section>

            {/* Why Temporary/Season contracts? Bento Grid */}
            <section className="border-t border-zinc-900 py-16 bg-zinc-950/40">
              <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-12">
                  <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">Como Funciona a Temporada?</h2>
                  <p className="text-xs sm:text-sm text-zinc-500 mt-2 max-w-md mx-auto">Tudo estruturado sob medidas de conformidade e passaporte para segurança máxima do trabalhador.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Card 1 */}
                  <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-3xl space-y-4">
                    <div className="w-12 h-12 bg-emerald-950/55 rounded-2xl border border-emerald-900 flex items-center justify-center text-emerald-400">
                      <Clock size={20} />
                    </div>
                    <h3 className="font-display font-bold text-lg text-white">Contato Curto (1 a 3 Meses)</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                      Ideal para quem deseja acumular rendimentos consistentes e experiência multinacional sem a necessidade de migração definitiva. Formato cíclico e escalável de trabalho temporário.
                    </p>
                  </div>

                  {/* Card 2 */}
                  <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-3xl space-y-4">
                    <div className="w-12 h-12 bg-emerald-950/55 rounded-2xl border border-emerald-900 flex items-center justify-center text-emerald-400">
                      <Shield size={20} />
                    </div>
                    <h3 className="font-display font-bold text-lg text-white">Subsídios Integrais Inclusos</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                      Os contratos cobrem despesas com alojamento homologado, transporte até as frentes de trabalho locais, passagens aéreas e seguro internacional de trabalho para sua total isenção financeira.
                    </p>
                  </div>

                  {/* Card 3 */}
                  <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-3xl space-y-4">
                    <div className="w-12 h-12 bg-emerald-950/55 rounded-2xl border border-emerald-900 flex items-center justify-center text-emerald-400">
                      <HeartHandshake size={20} />
                    </div>
                    <h3 className="font-display font-bold text-lg text-white">Aprovação Segura</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                      Sua documentação e mídias passam por crivo especializado corporativo, blindando o trabalhador contra propostas fraudulentas. Dossiê técnico submetido a contratantes oficiais sérios.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

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

        {appView === 'dashboard' && currentUser && (
          <div id="authorized-app-views">
            {currentUser.role === 'admin' ? (
              /* ADMIN INTERFACE */
              <AdminDashboard />
            ) : (
              /* WORKER INTERFACE */
              <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
                {/* Visual worker navigation headers */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-zinc-950 border border-zinc-900 rounded-3xl gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-850 flex items-center justify-center text-emerald-500">
                      <User size={18} />
                    </div>
                    <div>
                      <h4 className="font-display text-sm font-bold text-white">Bem-vindo(a), {currentUser.fullName}!</h4>
                      <p className="text-xs text-zinc-500 mt-0.5">Gerencie suas credenciais qualicadas e valide seu embarque sazonal.</p>
                    </div>
                  </div>

                  {/* Tab switches */}
                  <div className="flex bg-zinc-900 p-1 rounded-xl w-full sm:w-auto">
                    <button
                      id="worker-tab-profile-trigger"
                      onClick={() => setWorkerTab('profile')}
                      className={`flex-1 sm:flex-initial px-5 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${workerTab === 'profile' ? 'bg-white text-black font-extrabold shadow-lg' : 'text-zinc-500 hover:text-white'}`}
                    >
                      <User size={14} />
                      Qualificações Técnicas
                    </button>
                    <button
                      id="worker-tab-contracts-trigger"
                      onClick={() => setWorkerTab('contracts')}
                      className={`flex-1 sm:flex-initial px-5 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer relative ${workerTab === 'contracts' ? 'bg-white text-black font-extrabold shadow-lg' : 'text-zinc-500 hover:text-white'}`}
                    >
                      <FileText size={14} />
                      Contratos de Temporada
                      {pendingContractsCount > 0 && (
                        <span id="badge-pending" className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-yellow-500 text-black font-mono font-black text-[9px] flex items-center justify-center animate-bounce shadow-md">
                          {pendingContractsCount}
                        </span>
                      )}
                    </button>
                  </div>
                </div>

                {/* Body Component Rendering */}
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

      {/* Elegant minimalist page footer */}
      <footer id="app-main-footer" className="border-t border-zinc-950 py-10 mt-16 bg-black text-center text-xs text-zinc-600 font-mono tracking-wide leading-relaxed">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-bold text-zinc-500">WORK - PLATAFORMA DE CONTRATOS REGULARES DE TEMPORADA</p>
          <div className="flex justify-center gap-4 text-[10px] text-zinc-500">
            <span>SUA PORTA DE ENTRADA PARA O MERCADO GLOBAL</span>
            <span>•</span>
            <span>CONFORMIDADE DE VISTOS</span>
            <span>•</span>
            <span>DESPESAS PAGAS</span>
          </div>
          <p className="text-[10px] text-zinc-700 pt-2">© 2026 Work Inc. Desenvolvido para mobilidade consular internacional de trabalhadores técnicos.</p>
        </div>
      </footer>
    </div>
  );
}
