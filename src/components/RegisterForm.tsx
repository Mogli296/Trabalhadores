import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, EyeOff, User, Mail, Lock, Phone, ArrowRight } from 'lucide-react';
import { api } from '../services/api';
import TCWLogo from './TCWLogo';

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
    <div id="register-root" className="min-h-screen grid grid-cols-1 lg:grid-cols-12 text-zinc-300 bg-[#010312]">
      {/* Lado Esquerdo - Fundo com gradiente azul corporativo premium e etapas do cadastro */}
      <div id="register-left-panel" className="lg:col-span-4 bg-gradient-to-b from-[#010312] via-[#050920] to-[#010312] p-10 lg:p-12 flex flex-col justify-between border-r border-white/5 relative overflow-hidden">
        
        {/* Subtle mesh details */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none" />

        {/* Top Section */}
        <div className="relative z-10 space-y-8">
          <div className="flex items-center gap-2">
            <TCWLogo size="sm" showText={false} />
            <span className="font-display text-2xl font-black tracking-tighter text-white uppercase">WORK.</span>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <h1 className="font-display text-4xl font-extrabold leading-tight text-white uppercase tracking-tight">
              Comece com<br/>a Work.
            </h1>
            <p className="text-zinc-400 text-sm font-sans tracking-wide font-medium leading-relaxed">
              Encontre contratos sazonais de 1 a 3 meses ao redor do mundo através do grupo TCW.
            </p>
          </motion.div>
        </div>

        {/* Middle Section - Etapas do Cadastro com design geométrico */}
        <div className="relative z-10 my-10 lg:my-0 space-y-8">
          {/* Step 1 */}
          <div className="flex items-start gap-4">
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center text-xs text-slate-950 font-black shadow-md shrink-0 font-mono">
              1
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Criar conta</h3>
              <p className="text-xs text-zinc-400 font-semibold font-sans">Dados básicos de acesso</p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-4 opacity-50">
            <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center text-xs text-zinc-400 font-mono shrink-0">
              2
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Configurar perfil</h3>
              <p className="text-xs text-zinc-400 font-sans font-medium">Experiência e habilidades</p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-4 opacity-40">
            <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center text-xs text-zinc-400 font-mono shrink-0">
              3
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Enviar documentos</h3>
              <p className="text-xs text-zinc-400 font-sans font-medium">Passaportes e vistos</p>
            </div>
          </div>
        </div>

        {/* Bottom footer note */}
        <div className="relative z-10 pt-4 text-[10px] text-zinc-500 font-mono tracking-widest font-black uppercase">
          © 2026 TCW GROUP - RECRUTAMENTO GLOBAL
        </div>
      </div>

      {/* Lado Direito - Formulário de cadastro com fundo branco e campos de alta usabilidade */}
      <div id="register-right-panel" className="lg:col-span-8 bg-[#010312] p-8 lg:p-16 flex flex-col justify-center overflow-hidden relative">
        <div className="absolute top-[15%] right-[25%] w-[350px] h-[350px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-xl mx-auto w-full space-y-6 relative z-10">
          <div className="space-y-1 mb-6 text-center">
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">Criar Conta Profissional</h2>
            <p className="text-cyan-400 text-[10px] uppercase font-mono tracking-widest font-bold">Informações necessárias para recrutamento corporativo</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl font-mono font-semibold"
              id="register-error"
            >
              {error}
            </motion.div>
          )}

          <div className="bg-[#060a23]/40 border border-white/5 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/40">
            <form id="register-form" onSubmit={handleSubmit} className="space-y-4">
              {/* Nome completo */}
              <div className="space-y-1">
                <label htmlFor="fullName" className="block text-[10px] text-zinc-400 uppercase font-black tracking-wider mb-1">
                  Nome Completo
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
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
                    className="w-full bg-[#0b112d] border border-white/5 p-2.5 text-sm pl-10 text-white focus:border-cyan-400 placeholder-zinc-650 outline-none rounded-xl transition-all font-sans font-medium"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label htmlFor="email" className="block text-[10px] text-zinc-400 uppercase font-black tracking-wider mb-1">
                  E-mail
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
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
                    className="w-full bg-[#0b112d] border border-white/5 p-2.5 text-sm pl-10 text-white focus:border-cyan-400 placeholder-zinc-650 outline-none rounded-xl transition-all font-sans font-medium"
                  />
                </div>
              </div>

              {/* Celular */}
              <div className="space-y-1">
                <label htmlFor="phone" className="block text-[10px] text-zinc-400 uppercase font-black tracking-wider mb-1">
                  Número de Celular (Obrigatório)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
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
                    className="w-full bg-[#0b112d] border border-white/5 p-2.5 text-sm pl-10 text-white focus:border-cyan-400 placeholder-zinc-650 outline-none rounded-xl transition-all font-sans font-medium"
                  />
                </div>
                <p className="text-[10px] text-zinc-500 font-sans font-semibold mt-1">Utilizado pelo comitê internacional de recrutamento para convocação via WhatsApp.</p>
              </div>

              {/* Senha */}
              <div className="space-y-1">
                <label htmlFor="password" className="block text-[10px] text-zinc-400 uppercase font-black tracking-wider mb-1">
                  Senha de Acesso
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
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
                    className="w-full bg-[#0b112d] border border-white/5 p-2.5 text-sm pl-10 pr-10 text-white focus:border-cyan-400 placeholder-zinc-650 outline-none rounded-xl transition-all font-sans font-medium"
                  />
                  <button
                    type="button"
                    id="register-toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-500 hover:text-white transition-colors"
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
                  className="w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 hover:from-cyan-300 hover:via-blue-400 hover:to-indigo-500 text-slate-950 font-black py-3 text-xs tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(34,211,238,0.15)] rounded-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                >
                  {loading ? 'PROCESSANDO...' : 'CRIAR MINHA CONTA'}
                  {!loading && <ArrowRight size={14} className="stroke-[2.5]" />}
                </button>
              </div>
            </form>
          </div>

          {/* Opção para navegar para o login */}
          <div className="mt-8 text-center border-t border-white/5 pt-6">
            <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wide">Já possui uma conta na Work? </span>
            <button
              id="register-goto-login"
              onClick={onNavigateToLogin}
              className="text-xs text-cyan-400 font-black hover:text-cyan-300 uppercase tracking-widest ml-1 cursor-pointer font-mono"
            >
              Fazer Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
