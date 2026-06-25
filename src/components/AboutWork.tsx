import React from 'react';
import { Compass, ShieldCheck, Heart, Sparkles, Star, Target, Eye, Gem } from 'lucide-react';
import { motion } from 'motion/react';

export default function AboutWork() {
  return (
    <section id="about-us" className="py-20 px-4 max-w-7xl mx-auto border-t border-white/5 scroll-mt-20">
      <div className="space-y-12">
        
        {/* Minimalist Section Heading */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <span className="text-[10px] font-mono font-black text-cyan-400 bg-cyan-950/40 border border-cyan-500/20 px-4 py-1.5 rounded-full inline-block uppercase tracking-[0.2em]">
            ABOUT US
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white font-display">
            The Work Philosophy
          </h2>
          <p className="text-sm sm:text-base text-zinc-350 max-w-2xl mx-auto leading-relaxed font-sans font-medium">
            "Connecting world-class certified professionals with high-paying international seasonal placements, built on ironclad security, digital innovation, and professional integrity."
          </p>
        </div>

        {/* Mission, Vision, Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto pt-4">
          
          {/* Card 1: Missão */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#030614]/90 border border-white/5 rounded-3xl p-8 hover:border-cyan-500/10 transition-all text-left relative overflow-hidden flex flex-col justify-between"
          >
            <div className="space-y-6">
              {/* Icon wrapper */}
              <div className="w-12 h-12 rounded-2xl bg-cyan-950/40 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Target size={20} />
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-black text-white uppercase tracking-tight">Our Mission</h3>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed text-justify font-medium">
                  To provide a seamless, legally compliant channel for skilled technical professionals to gain direct access to elite international earnings, helping global employers fill seasonal demands.
                </p>
              </div>
            </div>
            
            <div className="pt-6 border-t border-white/[0.03] mt-6">
              <span className="text-[9px] font-mono font-black text-cyan-400 uppercase tracking-widest">GLOBAL PURPOSE</span>
            </div>
          </motion.div>

          {/* Card 2: Visão */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#030614]/90 border border-white/5 rounded-3xl p-8 hover:border-cyan-500/10 transition-all text-left relative overflow-hidden flex flex-col justify-between"
          >
            <div className="space-y-6">
              {/* Icon wrapper */}
              <div className="w-12 h-12 rounded-2xl bg-cyan-950/40 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Eye size={20} />
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-black text-white uppercase tracking-tight">Our Vision</h3>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed text-justify font-medium">
                  To be recognized by consular authorities and global enterprise buyers as the most reliable, secure digital destination for elite short-term talent sourcing.
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-white/[0.03] mt-6">
              <span className="text-[9px] font-mono font-black text-cyan-400 uppercase tracking-widest">GLOBAL OUTLOOK</span>
            </div>
          </motion.div>

          {/* Card 3: Valores */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#030614]/90 border border-white/5 rounded-3xl p-8 hover:border-cyan-500/10 transition-all text-left relative overflow-hidden flex flex-col justify-between"
          >
            <div className="space-y-6">
              {/* Icon wrapper */}
              <div className="w-12 h-12 rounded-2xl bg-cyan-950/40 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Gem size={20} />
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-black text-white uppercase tracking-tight">Our Values</h3>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed text-justify font-medium">
                  Uncompromising professionalism in visa and contract management, pristine personal data protection, and prioritization of worker safety.
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-white/[0.03] mt-6">
              <span className="text-[9px] font-mono font-black text-cyan-400 uppercase tracking-widest">UNWAVERING INTEGRITY</span>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
