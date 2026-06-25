import React from 'react';
import { ShieldCheck, Mail, FileText, Landmark, Key, HeartHandshake } from 'lucide-react';
import { motion } from 'motion/react';

export default function ContractManagement() {
  return (
    <section id="contract-security" className="py-20 px-4 max-w-7xl mx-auto border-t border-white/5 scroll-mt-20">
      <div 
        className="bg-gradient-to-tr from-[#020516] via-[#040924]/70 to-[#020516] border border-white/5 rounded-[2.5rem] p-8 lg:p-14 shadow-2xl backdrop-blur-md relative overflow-hidden"
      >
        {/* Cinematic background grids and lights */}
        <div className="absolute top-[-20%] right-[-10%] w-[350px] h-[350px] bg-cyan-500/[0.04] rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[350px] h-[350px] bg-blue-600/[0.04] rounded-full blur-[90px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left Column - Graphic/Icons representations */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            
            {/* Box 1: Contract Icon Block */}
            <div className="bg-[#030614]/85 border border-white/5 p-6 rounded-3xl text-left space-y-4 hover:border-cyan-500/10 transition-all group">
              <div className="w-10 h-10 rounded-2xl bg-cyan-950/40 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors">
                <FileText size={18} />
              </div>
              <div>
                <h4 className="text-xs font-mono font-black text-white uppercase tracking-wider">Binding Contracts</h4>
                <p className="text-[10px] text-zinc-500 font-sans mt-1 leading-normal leading-relaxed">
                  Legally structured and verified under strict international mobility guidelines.
                </p>
              </div>
            </div>

            {/* Box 2: Payment Icon Block */}
            <div className="bg-[#030614]/85 border border-white/5 p-6 rounded-3xl text-left space-y-4 hover:border-cyan-500/10 transition-all group">
              <div className="w-10 h-10 rounded-2xl bg-cyan-950/40 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors">
                <Landmark size={18} />
              </div>
              <div>
                <h4 className="text-xs font-mono font-black text-white uppercase tracking-wider">Guaranteed Income</h4>
                <p className="text-[10px] text-zinc-500 font-sans mt-1 leading-normal leading-relaxed">
                  Enjoy scheduled direct deposits with absolutely zero hidden fees or holdbacks.
                </p>
              </div>
            </div>

            {/* Box 3: Communication Security */}
            <div className="bg-[#030614]/85 border border-white/5 p-6 rounded-3xl text-left space-y-4 hover:border-cyan-500/10 transition-all group col-span-2">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-cyan-950/40 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 shrink-0 transition-colors">
                  <Mail size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-mono font-black text-white uppercase tracking-wider">Secured Channel Communications</h4>
                  <p className="text-[10px] text-zinc-400 font-sans mt-0.5 leading-relaxed text-justify">
                    To shield you from fraud, all coordinates and legally binding placements are handled exclusively via <strong className="text-cyan-400 font-mono">speakai.agency@gmail.com</strong>.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column - Descriptive copy block */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="space-y-3">
              <span className="text-[10px] font-mono font-black text-cyan-400 bg-cyan-940/25 border border-cyan-500/15 px-3 py-1 rounded-full uppercase tracking-widest inline-block">
                ABSOLUTE LEGAL COMPLIANCE
              </span>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white uppercase tracking-tight font-display">
                Ironclad Contracts & Guaranteed Earnings
              </h3>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans text-justify">
              <p>
                At <strong>Work</strong>, we protect your rights and peace of mind as the absolute foundation of our operations. Every seasonal placement features a comprehensive written contract detailing your accommodations, standard hours, fully compliant health insurance, and fast-track consular backing.
              </p>
              <p className="text-white font-medium bg-white/[0.02] border-l-2 border-cyan-400 p-4.5 rounded-r-2xl">
                Every contract is fully formalized and every payment is insured. All official recruitment proceedings are routed exclusively through our secure channel (<span className="text-cyan-400 font-mono">speakai.agency@gmail.com</span>), shielding you from third-party fraudulent offers and ensuring complete traceability.
              </p>
            </div>

            {/* Quick trust metrics */}
            <div className="grid grid-cols-2 gap-6 pt-2 text-zinc-450 border-t border-white/[0.04]">
              <div>
                <span className="text-lg sm:text-2xl font-black text-white block font-mono">100%</span>
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider">Verified Accommodations</span>
              </div>
              <div>
                <span className="text-lg sm:text-2xl font-black text-white block font-mono">ZERO</span>
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider">Hidden Fees per Paycheck</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
