import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, EyeOff, User, Mail, Lock, Phone, ArrowRight } from 'lucide-react';
import { api } from '../services/api';

interface RegisterFormProps {
  onSuccess: (userData: any) => void;
  onNavigateToLogin: () => void;
}

export default function RegisterForm({ onSuccess, onNavigateToLogin }: RegisterFormProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !email.trim() || !password || !phone.trim()) {
      setError('Todos os campos são obrigatórios.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.register({
        fullName,
        email,
        password,
        phone,
      });
      onSuccess(response.user);
    } catch (err: any) {
      setError(err.message || 'Erro ao realizar o cadastro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="register-root" className="min-h-screen bg-black grid grid-cols-1 lg:grid-cols-12 text-white">
      {/* Lado Esquerdo - Fundo com gradiente verde escuro e etapas do cadastro */}
      <div id="register-left-panel" className="lg:col-span-4 bg-gradient-to-b from-emerald-950 via-emerald-900 to-black p-10 lg:p-12 flex flex-col justify-between border-r border-emerald-800/30 relative">
        {/* Top Section */}
        <div className="relative z-10 space-y-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-400 rounded-sm flex items-center justify-center">
              <div className="w-4 h-4 bg-emerald-950 rounded-full"></div>
            </div>
            <span className="font-display text-2xl font-bold tracking-tighter text-white">WORK</span>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <h1 className="font-display text-4xl font-extrabold leading-tight text-white">
              Comece com<br/>a Work.
            </h1>
            <p className="text-emerald-400/80 text-sm font-sans tracking-wide">
              Encontre contratos sazonais de 1 a 3 meses ao redor do mundo.
            </p>
          </motion.div>
        </div>

        {/* Middle Section - Etapas do Cadastro com design geométrico */}
        <div className="relative z-10 my-10 lg:my-0 space-y-8">
          {/* Step 1 */}
          <div className="flex items-start gap-4">
            <div className="w-6 h-6 rounded-full bg-emerald-400 flex items-center justify-center text-xs text-emerald-950 font-bold shadow-[0_0_15px_rgba(52,211,153,0.4)] shrink-0">
              1
            </div>
            <div>
              <h3 className="font-semibold text-sm">Criar conta</h3>
              <p className="text-xs text-emerald-450/60 font-sans">Dados básicos de acesso</p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-4 opacity-50">
            <div className="w-6 h-6 rounded-full border border-emerald-400 flex items-center justify-center text-xs text-white font-sans shrink-0">
              2
            </div>
            <div>
              <h3 className="font-semibold text-sm">Configurar perfil</h3>
              <p className="text-xs text-emerald-400/60 font-sans">Experiência e habilidades</p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-4 opacity-40">
            <div className="w-6 h-6 rounded-full border border-emerald-400 flex items-center justify-center text-xs text-white font-sans shrink-0">
              3
            </div>
            <div>
              <h3 className="font-semibold text-sm">Enviar documentos</h3>
              <p className="text-xs text-emerald-400/60 font-sans">Passaportes e vistos</p>
            </div>
          </div>
        </div>

        {/* Bottom footer note */}
        <div className="relative z-10 pt-4 text-[10px] text-emerald-700/50 uppercase tracking-[0.2em] font-mono">
          © 2026 Work - Trabalhadores Qualificados
        </div>
      </div>

      {/* Lado Direito - Formulário de cadastro com fundo preto e campos de alta usabilidade */}
      <div id="register-right-panel" className="lg:col-span-8 bg-black p-8 lg:p-16 flex flex-col justify-center overflow-hidden">
        <div className="max-w-xl mx-auto w-full space-y-6">
          <div className="space-y-1 mb-4 text-center">
            <h2 className="text-2xl font-semibold">Criar Conta Profissional</h2>
            <p className="text-gray-400 text-xs uppercase tracking-widest">Informações necessárias para recrutamento</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3 bg-red-950/40 border border-red-900/60 text-red-300 text-xs rounded-none font-mono"
              id="register-error"
            >
              {error}
            </motion.div>
          )}

          <form id="register-form" onSubmit={handleSubmit} className="space-y-4">
            {/* Nome completo */}
            <div className="space-y-1">
              <label htmlFor="fullName" className="block text-[10px] text-gray-500 uppercase tracking-wider">
                Nome Completo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                  <User size={16} />
                </div>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  placeholder="Seu nome oficial para contratos"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 p-2.5 text-sm pl-9 text-white focus:border-emerald-500 outline-none rounded-none transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label htmlFor="email" className="block text-[10px] text-gray-500 uppercase tracking-wider">
                E-mail
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                  <Mail size={16} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="Seu e-mail profissional"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 p-2.5 text-sm pl-9 text-white focus:border-emerald-500 outline-none rounded-none transition-all"
                />
              </div>
            </div>

            {/* Celular */}
            <div className="space-y-1">
              <label htmlFor="phone" className="block text-[10px] text-gray-500 uppercase tracking-wider">
                Número de Celular (Obrigatório)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                  <Phone size={16} />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  placeholder="Ex: +55 (11) 99999-9999"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 p-2.5 text-sm pl-9 text-white focus:border-emerald-500 outline-none rounded-none transition-all"
                />
              </div>
              <p className="text-[10px] text-zinc-550 font-sans">Utilizado pelo comitê internacional de recrutamento para convocação via WhatsApp.</p>
            </div>

            {/* Senha */}
            <div className="space-y-1">
              <label htmlFor="password" className="block text-[10px] text-gray-500 uppercase tracking-wider">
                Senha de Acesso
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                  <Lock size={16} />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Sua senha de segurança"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 p-2.5 text-sm pl-9 pr-10 text-white focus:border-emerald-500 outline-none rounded-none transition-all"
                />
                <button
                  type="button"
                  id="register-toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Botão de cadastro */}
            <div className="pt-4">
              <button
                type="submit"
                id="register-submit-button"
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3 text-sm transition-all shadow-[0_4px_20px_rgba(16,185,129,0.2)] rounded-none flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
              >
                {loading ? 'PROCESSANDO...' : 'CRIAR MINHA CONTA'}
                {!loading && <ArrowRight size={16} />}
              </button>
            </div>
          </form>

          {/* Opção para navegar para o login */}
          <div className="mt-8 text-center border-t border-zinc-900 pt-6">
            <span className="text-xs text-gray-400 uppercase tracking-widest">Já possui uma conta na Work? </span>
            <button
              id="register-goto-login"
              onClick={onNavigateToLogin}
              className="text-xs text-emerald-400 font-bold hover:text-emerald-300 uppercase tracking-widest ml-1 cursor-pointer"
            >
              Fazer Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
