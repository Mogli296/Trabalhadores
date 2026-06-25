import React from 'react';
import { UserCheck, Search, ShieldAlert, Plane } from 'lucide-react';
import { motion } from 'motion/react';

interface Step {
  num: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const STEPS: Step[] = [
  {
    num: "01",
    title: "Create Your Target Profile",
    description: "Register and input your verified trade skills, upload real job site photos, and record a high-impact professional video demonstrating your field expertise.",
    icon: <UserCheck size={18} />
  },
  {
    num: "02",
    title: "Expert Skill Evaluation",
    description: "Our dedicated regional placement committee reviews your record, validates your introduction media, and activates your profile on our elite matching database.",
    icon: <Search size={18} />
  },
  {
    num: "03",
    title: "Get Placed via Official Email",
    description: "The moment a matching high-paying opportunity opens with our global partners, we formalize the offer exclusively via email and guide you in the fast-track visa process.",
    icon: <ShieldAlert size={18} />
  },
  {
    num: "04",
    title: "Deploy Globally",
    description: "Deploy confidently for 1 to 3 months with approved round-trip flights, premium accommodations, and comprehensive medical insurance covered in your package.",
    icon: <Plane size={18} />
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-4 max-w-7xl mx-auto border-t border-white/5 scroll-mt-20">
      <div className="space-y-16">
        
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <span className="text-[10px] font-mono font-black text-cyan-400 bg-cyan-950/40 border border-cyan-500/20 px-4 py-1.5 rounded-full inline-block uppercase tracking-[0.2em]">
            STEPS TO LANDING YOUR ROLE
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white font-display">
            How Your Placement Works
          </h2>
          <p className="text-sm text-zinc-400 max-w-lg mx-auto leading-relaxed font-sans">
            Learn about the simplified, highly transparent path that takes you from your initial application to working on-site overseas.
          </p>
        </div>

        {/* Timeline representation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {STEPS.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="bg-[#030614]/80 border border-white/5 p-6 rounded-3xl relative text-left group flex flex-col justify-between hover:border-cyan-500/10 transition-all shadow-xl"
            >
              <div className="space-y-4">
                {/* Number & Icon */}
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black font-mono text-cyan-505/10 group-hover:text-cyan-400/20 transition-colors leading-none select-none">
                    {step.num}
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-cyan-950/45 border border-cyan-500/25 flex items-center justify-center text-cyan-400">
                    {step.icon}
                  </div>
                </div>

                {/* Text copying */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-mono font-black text-white uppercase tracking-wider">{step.title}</h4>
                  <p className="text-[11px] text-zinc-400 font-sans leading-relaxed text-justify">
                    {step.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.03] mt-4 flex items-center justify-between select-none">
                <span className="text-[8px] font-mono font-extrabold text-[#475569] uppercase tracking-wider">SECURED MODULE</span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
