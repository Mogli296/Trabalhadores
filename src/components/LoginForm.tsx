import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, EyeOff, Mail, Lock, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { api } from '../services/api';

interface LoginFormProps {
  onSuccess: (userData: any) => void;
  onNavigateToRegister: () => void;
}

export default function LoginForm({ onSuccess, onNavigateToRegister }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Todos os campos são obrigatórios.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.login({ email, password });
      onSuccess(response.user);
    } catch (err: any) {
      setError(err.message || 'E-mail ou senha incorretos.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (role: 'admin' | 'worker') => {
    setEmail(role === 'admin' ? 'speakai.agency@gmail.com' : 'trabalhador@work.com');
    setPassword(role === 'admin' ? 'admin' : 'pass');
  };

  return (
    <div id="login-root" className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative text-white">
      {/* Decorative Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#09090b_1px,transparent_1px),linear-gradient(to_bottom,#09090b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-zinc-950 border border-zinc-900 rounded-none p-8 lg:p-10 relative z-10 shadow-2xl shadow-black/80"
        id="login-card"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-8 h-8 bg-emerald-400 rounded-sm flex items-center justify-center mb-4">
            <div className="w-4 h-4 bg-emerald-950 rounded-full"></div>
          </div>
          <h2 className="text-2xl font-semibold tracking-tighter text-white text-center uppercase">WORK ACCESS</h2>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1.5 text-center">Cadastramento Internacional e Emissão de Contratos Temporários</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-3 rounded-none bg-red-950/40 border border-red-900/60 text-red-300 text-xs font-mono"
            id="login-error"
          >
            {error}
          </motion.div>
        )}

        <form id="login-form" onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-1">
            <label htmlFor="login-email" className="block text-[10px] text-gray-500 uppercase mb-1">
              E-mail de acesso
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                <Mail size={16} />
              </div>
              <input
                id="login-email"
                name="email"
                type="email"
                required
                placeholder="nome@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 p-2.5 text-sm pl-9 text-white focus:border-emerald-500 outline-none rounded-none transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label htmlFor="login-password" className="block text-[10px] text-gray-500 uppercase mb-1">
              Senha de acesso
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                <Lock size={16} />
              </div>
              <input
                id="login-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Insira sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 p-2.5 text-sm pl-9 pr-10 text-white focus:border-emerald-500 outline-none rounded-none transition-all"
              />
              <button
                type="button"
                id="login-toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              id="login-submit-button"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3 text-sm transition-all shadow-[0_4px_20px_rgba(16,185,129,0.2)] rounded-none flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? 'ACESSANDO...' : 'ACESSAR CONTA'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </div>
        </form>

        {/* Quick Credentials testing panel */}
        <div className="mt-8 border-t border-zinc-900 pt-6">
          <p className="text-center text-[10px] text-gray-500 uppercase tracking-widest mb-4">
            Acesso Rápido para Avaliação
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              id="login-demo-worker"
              onClick={() => handleQuickLogin('worker')}
              className="flex items-center justify-center gap-1.5 py-2 px-3 border border-zinc-800 bg-zinc-900 text-white text-xs font-semibold hover:border-emerald-500 transition-all cursor-pointer rounded-none"
            >
              <UserCheck size={14} className="text-emerald-400" />
              Sou Trabalhador
            </button>
            <button
              type="button"
              id="login-demo-admin"
              onClick={() => handleQuickLogin('admin')}
              className="flex items-center justify-center gap-1.5 py-2 px-3 border border-zinc-800 bg-zinc-900 text-white text-xs font-semibold hover:border-emerald-500 transition-all cursor-pointer rounded-none"
            >
              <ShieldCheck size={14} className="text-emerald-400" />
              Sou Administrador
            </button>
          </div>
        </div>

        {/* Navigate to sign up */}
        <div className="mt-6 text-center text-[10px] text-zinc-650 font-mono">
          E-mail de Admin: <span className="text-emerald-400">speakai.agency@gmail.com</span> / Senha: <span className="font-bold text-emerald-400">admin</span>
        </div>

        <div className="mt-6 text-center border-t border-zinc-900 pt-5">
          <span className="text-xs text-zinc-400 uppercase tracking-widest">Ainda não tem conta? </span>
          <button
            id="login-goto-register"
            onClick={onNavigateToRegister}
            className="text-xs text-emerald-400 font-bold hover:text-emerald-300 uppercase tracking-widest ml-1 cursor-pointer"
          >
            Cadastrar-se
          </button>
        </div>
      </motion.div>
    </div>
  );
}
