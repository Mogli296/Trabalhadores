import React, { useState, useEffect } from 'react';
import { Compass, Clock, Shield, HeartHandshake, FileText, LogOut, User } from 'lucide-react';
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
    <div id="app-main-container" className="min-h-screen bg-black text-gray-100 font-sans">
      {/* Header */}
      <header className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-18 flex items-center justify-between">
          <button onClick={() => setAppView(currentUser ? 'dashboard' : 'landing')} className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center font-bold text-black text-lg">W</div>
            <div>
              <span className="font-display text-lg font-extrabold text-white block">Work</span>
              <span className="text-[9px] font-mono text-emerald-400 block uppercase font-bold">Temporadas</span>
            </div>
          </button>

          <div className="flex items-center gap-4">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-white">{currentUser.fullName}</span>
                <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400">
                  <User size={16} />
                </div>
                <button onClick={handleLogout} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-905 text-xs text-zinc-400 hover:text-red-400">
                  <LogOut size={14} /> <span>Sair</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {appView === 'landing' ? (
                  <>
                    <button onClick={() => setAppView('login')} className="text-xs text-zinc-300 hover:text-white px-4 py-2">Login</button>
                    <button onClick={() => setAppView('register')} className="text-xs bg-white text-black px-4 py-2 rounded-xl">Cadastrar-se</button>
                  </>
                ) : (
                  <button onClick={() => setAppView('landing')} className="text-xs text-zinc-400 hover:text-white px-4 py-2">Voltar ao início</button>
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
            <section className="pt-12 pb-20 flex flex-col items-center">
              <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
                <span className="px-3.5 py-1.5 rounded-full text-xs font-mono bg-emerald-950 text-emerald-400">Temporadas Internacionais de 1 a 3 Meses</span>
                <h1 className="text-4xl sm:text-6xl font-extrabold text-white">Construa sua Trajetória <br /><span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">Trabalhando no Exterior</span></h1>
                <p className="text-sm sm:text-lg text-zinc-400 max-w-2xl mx-auto">A <strong>Work</strong> conecta profissionais qualificados a patrocinadores para contratos de curto prazo garantidos.</p>
              </div>
            </section>

            {/* Vídeo de Apresentação */}
            <section className="py-16 bg-zinc-950 border-t border-zinc-900">
              <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-white">Vídeo de Apresentação</h2>
                <p className="text-sm text-zinc-500">Assista ao vídeo institucional e conheça como a plataforma Work conecta profissionais qualificados.</p>
                <div className="rounded-xl overflow-hidden border border-zinc-800 shadow-lg">
                  <video controls className="w-full">
                    <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
                  </video>
                </div>
              </div>
            </section>

            {/* Galeria de Fotos */}
            <section className="py-16 bg-zinc-950/70 border-t border-zinc-900">
              <div className="max-w-6xl mx-auto px-4 text-center space-y-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-white">Fotos dos Profissionais</h2>
                <p className="text-sm text-zinc-500">Veja alguns dos trabalhadores em ação durante suas temporadas internacionais.</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  <img src="https://via.placeholder.com/300x200" alt="Profissional 1" className="rounded-xl border border-zinc-800" />
                  <img src="https://via.placeholder.com/300x200" alt="Profissional 2" className="rounded-xl border border-zinc-800" />
                  <img src="https://via.placeholder.com/300x200" alt="Profissional 3" className="rounded-xl border border-zinc-800" />
                  <img src="https://via.placeholder.com/300x200" alt="Profissional 4" className="rounded-xl border border-zinc-800" />
                </div>
              </div>
            </section>

                        {/* Seção explicativa */}
            <section className="border-t border-zinc-900 py-16 bg-zinc-950/40">
              <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-12">
                  <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
                    Como Funciona a Temporada?
                  </h2>
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
          </div> {/* fecha landing-view */}
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
              <AdminDashboard />
            ) : (
              <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
                {workerTab === 'profile' && <WorkerProfileForm user={currentUser} />}
                {workerTab === 'contracts' && <ContractViewer userId={currentUser.id} />}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-950 py-10 mt-16 bg-black text-center text-xs text-zinc-600 font-mono">
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
