import React from 'react';
import { Compass, Wrench, Container, Tractor, Zap } from 'lucide-react';
import { motion } from 'motion/react';

interface ProfessionItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  salaryLabel: string;
  vibeTag: string;
}

const PROFESSIONS: ProfessionItem[] = [
  {
    title: "Master Carpenter",
    description: "Assembles structural timber frameworks, concrete formwork, structural scaffolding, mountain chalets, temporary event arenas, and heavy-duty infrastructure.",
    icon: <Compass size={24} className="text-cyan-400" />,
    salaryLabel: "High Demand Season Rate",
    vibeTag: "FLEXIBLE"
  },
  {
    title: "Industrial Electrician",
    description: "Installs, tests, and maintains secondary power distribution grids, high-demand stage lighting setups, and temporary commercial facilities.",
    icon: <Zap size={24} className="text-cyan-450" />,
    salaryLabel: "1 to 3 Month Contracts",
    vibeTag: "TECHNICAL"
  },
  {
    title: "Certified Pipefitter & Plumber",
    description: "Assembles, inspects, and repairs temporary water distribution lines, sanitation piping setups, and approved modular facilities.",
    icon: <Wrench size={24} className="text-blue-400" />,
    salaryLabel: "Rapid Payment Cycles",
    vibeTag: "OPERATIONS"
  },
  {
    title: "Heavy Forklift Operator",
    description: "Executes precise industrial cargo handling, container de-stuffing, port logistics, and warehouse organization for major international trades.",
    icon: <Tractor size={24} className="text-emerald-400" />,
    salaryLabel: "Consular Visa Fast-Track",
    vibeTag: "LOGISTICS"
  },
  {
    title: "Logistics & Freight Handler",
    description: "Performs critical high-velocity sorting, palletizing, loading, and cargo dispatch at major seasonal aviation and maritime freight hubs.",
    icon: <Container size={24} className="text-indigo-400" />,
    salaryLabel: "Approved Housing Provided",
    vibeTag: "PRACTICAL"
  }
];

export default function FeaturedProfessions() {
  return (
    <section id="featured-professions" className="py-20 px-4 max-w-7xl mx-auto border-t border-white/5 scroll-mt-20">
      <div className="space-y-12">
        
        {/* Section Heading */}
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <span className="text-[10px] font-mono font-black text-cyan-400 bg-cyan-950/40 border border-cyan-500/20 px-4 py-1.5 rounded-full inline-block uppercase tracking-[0.2em]">
            IMMEDIATE VACANCIES
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white font-display">
            Featured Career Placements
          </h2>
          <p className="text-sm text-zinc-400 max-w-lg mx-auto leading-relaxed font-sans">
            These are the highest-paying, in-demand seasonal industries with approved active contracts. Select your specialization during registration.
          </p>
        </div>

        {/* Professions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROFESSIONS.map((prof, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="bg-[#04081e]/60 border border-white/5 rounded-3xl p-6 lg:p-8 hover:border-cyan-500/20 transition-all flex flex-col justify-between group text-left relative overflow-hidden"
            >
              {/* Subtle background glow effect */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/[0.02] rounded-full blur-2xl group-hover:bg-cyan-500/[0.05] transition-colors" />

              <div className="space-y-6">
                {/* Icon wrapper & title */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-950/40 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                    {prof.icon}
                  </div>
                  <div>
                    <span className="text-[8px] font-mono font-black text-cyan-400 uppercase tracking-widest">{prof.vibeTag}</span>
                    <h3 className="text-lg font-black text-white uppercase tracking-tight leading-none mt-0.5">{prof.title}</h3>
                  </div>
                </div>

                {/* Short description text */}
                <p className="text-xs text-zinc-400 font-sans leading-relaxed text-justify font-medium">
                  {prof.description}
                </p>
              </div>

              {/* Footnote status badge */}
              <div className="mt-8 pt-4 border-t border-white/[0.04] flex items-center justify-between">
                <span className="text-[9px] text-zinc-550 font-mono font-bold uppercase tracking-wider">{prof.salaryLabel}</span>
                <span className="text-[8px] font-mono font-extrabold text-white bg-white/5 py-1 px-2.5 rounded-full border border-white/5 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors uppercase">
                  ACTIVE ROLES
                </span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
