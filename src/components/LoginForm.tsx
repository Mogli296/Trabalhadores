import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, EyeOff, Mail, Lock, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { api } from '../services/api';
import TCWLogo from './TCWLogo';

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
      setError('All fields are required.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.login({ email, password });
      onSuccess(response.user);
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (role: 'admin' | 'worker') => {
    setEmail(role === 'admin' ? 'speakai.agency@gmail.com' : 'trabalhador@work.com');
    setPassword(role === 'admin' ? 'admin' : 'pass');
  };

  return (
    <div id="login-root" className="min-h-[90vh] flex flex-col items-center justify-center p-4 relative text-zinc-300">
      {/* Decorative Grid Overlay removed */}

      {/* Login Card */}
      <motion.div
         initial={{ opacity: 0, y: 15 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.5 }}
         className="w-full max-w-md bg-[#060a23]/60 border border-white/5 backdrop-blur-md rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 relative z-10 shadow-2xl shadow-black/50"
         id="login-card"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <TCWLogo size="md" showText={true} layout="vertical" className="mb-4" />
          <h2 className="text-sm font-extrabold tracking-widest text-cyan-400 text-center uppercase font-mono">SECURED SIGN IN</h2>
          <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider mt-1.5 text-center leading-normal">Global Expatriation & Seasonal Placement Ecosystem</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono font-semibold"
            id="login-error"
          >
            {error}
          </motion.div>
        )}

        <form id="login-form" onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="space-y-1">
            <label htmlFor="login-email" className="block text-[10px] text-zinc-400 uppercase font-black tracking-wider mb-1">
              Verified Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                <Mail size={16} />
              </div>
              <input
                id="login-email"
                name="email"
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0b112d] border border-white/5 p-2.5 text-sm pl-10 text-white focus:border-cyan-400 placeholder-zinc-650 outline-none rounded-xl transition-all font-sans font-medium"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label htmlFor="login-password" className="block text-[10px] text-zinc-400 uppercase font-black tracking-wider mb-1">
              Secured Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                <Lock size={16} />
              </div>
              <input
                id="login-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0b112d] border border-white/5 p-2.5 text-sm pl-10 pr-10 text-white focus:border-cyan-400 placeholder-zinc-650 outline-none rounded-xl transition-all font-sans font-medium"
              />
              <button
                type="button"
                id="login-toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-500 hover:text-white transition-colors"
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
              className="w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 hover:from-cyan-300 hover:via-blue-400 hover:to-indigo-500 text-slate-950 font-black py-3 text-xs tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(34,211,238,0.15)] rounded-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? 'AUTHENTICATING...' : 'SECURE ACCESS NOW'}
              {!loading && <ArrowRight size={14} className="stroke-[2.5]" />}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center border-t border-white/5 pt-5">
          <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wide font-sans">New to the platform? </span>
          <button
            id="login-goto-register"
            onClick={onNavigateToRegister}
            className="text-xs text-cyan-400 font-black hover:text-cyan-300 uppercase tracking-widest ml-1 cursor-pointer font-mono"
          >
            Create Account Now
          </button>
        </div>
      </motion.div>
    </div>
  );
}
