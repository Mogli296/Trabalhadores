import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Calendar, DollarSign, Globe, Check, AlertTriangle, FileCheck } from 'lucide-react';
import { api } from '../services/api';
import { SeasonalContract } from '../types';

interface ContractViewerProps {
  userId: string;
}

export default function ContractViewer({ userId }: ContractViewerProps) {
  const [contracts, setContracts] = useState<SeasonalContract[]>([]);
  const [selectedContract, setSelectedContract] = useState<SeasonalContract | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [signing, setSigning] = useState(false);
  const [signatureName, setSignatureName] = useState('');

  useEffect(() => {
    fetchContracts();
  }, [userId]);

  const fetchContracts = async () => {
    setLoading(true);
    try {
      const data = await api.getContracts(userId);
      setContracts(data);
      if (data.length > 0) {
        setSelectedContract(data[0]); // Default open the first one
      }
    } catch (err) {
      setError('Error fetching your seasonal contracts.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignContract = async (contractId: string) => {
    if (!signatureName.trim()) {
      alert('Please enter your full legal name to sign.');
      return;
    }

    setSigning(true);
    try {
      const res = await api.signContract(contractId, 'Signed');
      // Update local cache
      setContracts(prev => prev.map(c => c.id === contractId ? res.contract : c));
      setSelectedContract(res.contract);
      alert('Contract successfully signed and finalized!');
    } catch (err) {
      alert('Error signing the contract.');
    } finally {
      setSigning(false);
    }
  };

  const handleDeclineContract = async (contractId: string) => {
    if (!confirm('Are you absolutely sure you want to decline this high-paying seasonal offer?')) return;
    
    try {
      const res = await api.signContract(contractId, 'Cancelled');
      setContracts(prev => prev.map(c => c.id === contractId ? res.contract : c));
      setSelectedContract(res.contract);
    } catch (err) {
      alert('Error declining proposal.');
    }
  };

  if (loading) {
    return (
      <div id="loading" className="flex items-center justify-center p-12">
        <div className="w-8 h-8 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin"></div>
        <span className="ml-3 text-zinc-400 font-mono text-xs uppercase tracking-widest font-semibold">Retrieving your contracts...</span>
      </div>
    );
  }

  return (
    <div id="contract-viewer-root" className="max-w-6xl mx-auto p-2 lg:p-4">
      {contracts.length === 0 ? (
        <div className="bg-[#060a23]/60 border border-white/5 backdrop-blur-md rounded-3xl p-8 lg:p-12 text-center max-w-xl mx-auto space-y-5 shadow-2xl">
          <div className="w-16 h-16 bg-cyan-950/40 border border-cyan-500/20 text-cyan-450 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            <FileText size={28} />
          </div>
          <h3 className="font-display font-extrabold text-xl text-white">No active contracts found</h3>
          <p className="text-sm text-zinc-400 max-w-sm mx-auto leading-relaxed font-medium">
            Your profile is registered in the TCW Group international talent pool. As soon as a global employer requests your skills, your legal contract will appear here instantly.
          </p>
          <div className="p-4 rounded-xl bg-[#0b112d] border border-white/5 text-left text-xs text-zinc-300 leading-relaxed font-sans">
            <strong className="text-cyan-400 font-bold block mb-1">Recruiter Insider Tip:</strong> Complete 100% of your technical profile by adding trade photos and recording your personal pitch video to fast-track matching!
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* List panel - Left side */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-[#060a23]/60 border border-white/5 backdrop-blur-md rounded-3xl p-4 shadow-xl">
              <h3 className="text-xs uppercase font-mono tracking-widest text-[#22d3ee] font-black mb-3 px-1">
                Issued Contracts ({contracts.length})
              </h3>
              
              <div className="space-y-2">
                {contracts.map(contract => {
                  const isSelected = selectedContract?.id === contract.id;
                  return (
                    <button
                      key={contract.id}
                      id={`sidebar-contract-${contract.id}`}
                      onClick={() => setSelectedContract(contract)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-gradient-to-r from-cyan-950/45 to-blue-950/45 border-cyan-500/50 shadow-md shadow-cyan-405/5 text-white' 
                          : 'bg-[#0b112d]/65 border-white/5 hover:border-white/10 hover:bg-[#0e163b]/70 text-zinc-300'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span className="font-display font-extrabold text-sm text-white line-clamp-1">{contract.role}</span>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-mono shrink-0 uppercase tracking-wide font-black ${
                          contract.status === 'Signed' 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : contract.status === 'Cancelled' 
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                            : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                        }`}>
                          {contract.status}
                        </span>
                      </div>
                      
                      <div className="mt-3 flex items-center gap-1 text-[11px] text-zinc-400 font-bold font-mono">
                        <Globe size={11} className="text-cyan-400" />
                        <span>{contract.destinationCountry}</span>
                        <span className="text-white/10">•</span>
                        <span>{contract.durationMonths} {contract.durationMonths === 1 ? 'month' : 'months'}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Details panel - Right side */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {selectedContract && (
                <motion.div
                  key={selectedContract.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="bg-[#060a23]/60 border border-white/5 backdrop-blur-md rounded-3xl p-6 lg:p-8 space-y-6 shadow-2xl relative text-zinc-300"
                  id={`details-contract-${selectedContract.id}`}
                >
                  {/* Decorative badge overlay */}
                  <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
                    <FileCheck size={180} className="text-cyan-400" />
                  </div>

                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-5">
                    <div>
                      <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                        Official Placement Offer
                      </span>
                      <h2 className="text-xl lg:text-2xl font-display font-black text-white mt-1">
                        {selectedContract.role}
                      </h2>
                    </div>
                    <div className="flex items-center gap-2">
                       <span className="text-xs text-zinc-500 font-mono">ID: #{selectedContract.id.substr(-6)}</span>
                       <span className={`text-[10px] px-3 py-1 rounded-full font-mono uppercase tracking-wide font-black ${
                          selectedContract.status === 'Signed' 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : selectedContract.status === 'Cancelled' 
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                            : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                        }`}>
                          {selectedContract.status}
                        </span>
                    </div>
                  </div>

                  {/* Highlight Specs Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Destination */}
                    <div className="bg-[#0b112d]/65 border border-white/5 p-4 rounded-2xl flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-cyan-950/40 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                        <Globe size={18} />
                      </div>
                      <div>
                        <span className="text-[9px] uppercase text-zinc-500 font-black tracking-wider block font-mono">Destination</span>
                        <span className="text-sm font-extrabold text-white">{selectedContract.destinationCountry}</span>
                      </div>
                    </div>

                    {/* Salary */}
                    <div className="bg-[#0b112d]/65 border border-white/5 p-4 rounded-2xl flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-cyan-950/40 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                        <DollarSign size={18} />
                      </div>
                      <div>
                        <span className="text-[9px] uppercase text-zinc-500 font-black tracking-wider block font-mono">Compensation</span>
                        <span className="text-sm font-extrabold text-white">{selectedContract.salary}</span>
                      </div>
                    </div>

                    {/* Duration */}
                    <div className="bg-[#0b112d]/65 border border-white/5 p-4 rounded-2xl flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-cyan-950/40 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                        <Calendar size={18} />
                      </div>
                      <div>
                        <span className="text-[9px] uppercase text-zinc-500 font-black tracking-wider block font-mono">Deployment Term</span>
                        <span className="text-sm font-extrabold text-white">{selectedContract.durationMonths} {selectedContract.durationMonths === 1 ? 'month' : 'months'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Dates information */}
                  <div className="p-4 bg-[#0b112d]/65 border border-white/5 rounded-2xl grid grid-cols-2 gap-4 text-xs font-mono font-bold">
                    <div>
                      <span className="text-zinc-500 block text-[9px] tracking-wider uppercase font-mono">PROJECT START DATE</span>
                      <span className="text-white font-black text-sm mt-1 block">
                        {new Date(selectedContract.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[9px] tracking-wider uppercase font-mono">PROJECT END & RETURN DATE</span>
                      <span className="text-white font-black text-sm mt-1 block">
                        {new Date(selectedContract.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  {/* Terms and official guidelines of Work app */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-xs uppercase text-zinc-400 tracking-wider font-mono">
                      Terms of Responsibility & Flight/Stay Guidelines
                    </h3>
                    <div className="bg-[#0b112d]/65 border border-white/5 rounded-2xl p-5 text-sm text-zinc-300 leading-relaxed font-sans max-h-64 overflow-y-auto whitespace-pre-line font-medium text-justify">
                      {selectedContract.terms}
                    </div>
                  </div>

                  {/* Interactive Signature Area */}
                  {selectedContract.status === 'Pending' ? (
                    <div className="p-6 bg-[#0b112d]/30 border border-white/5 rounded-3xl space-y-4" id="signature-input-panel">
                      <div className="flex gap-2 items-start text-xs text-yellow-450 leading-normal font-semibold">
                        <AlertTriangle size={16} className="shrink-0 mt-0.5 text-yellow-500" />
                        <span>Signing this document legally binds your commitment to these seasonal dates and declares you hold active global travel documentation.</span>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="signature" className="text-xs font-mono font-black uppercase tracking-wider text-zinc-450">
                          Digital Signature (Type your full legal name)
                        </label>
                        <input
                          id="signature"
                          type="text"
                          required
                          placeholder="e.g. John Doe"
                          value={signatureName}
                          onChange={(e) => setSignatureName(e.target.value)}
                          className="w-full bg-[#0b112d] text-white border border-white/5 focus:border-cyan-400 py-3 px-4 rounded-xl text-sm placeholder-zinc-650 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 transition-all font-sans font-medium"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <button
                          type="button"
                          id="decline-contract-btn"
                          onClick={() => handleDeclineContract(selectedContract.id)}
                          className="py-3 px-4 bg-transparent border border-red-500/20 hover:bg-red-500/10 text-red-400 font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer text-center font-mono"
                        >
                          Decline Offer
                        </button>
                        <button
                          type="button"
                          id="sign-contract-btn"
                          disabled={signing}
                          onClick={() => handleSignContract(selectedContract.id)}
                          className="py-3 px-4 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer text-center disabled:opacity-50 font-mono"
                        >
                          {signing ? 'finalizing record...' : 'Finalize & Accept Placement'}
                        </button>
                      </div>
                    </div>
                  ) : selectedContract.status === 'Signed' ? (
                    <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl flex flex-col sm:flex-row items-center gap-4 text-emerald-400">
                      <div className="w-12 h-12 bg-[#0b112d] border border-emerald-500/20 text-emerald-400 flex items-center justify-center rounded-2xl shadow-sm shrink-0">
                        <Check size={24} />
                      </div>
                      <div>
                        <h4 className="font-display font-extrabold text-white">Placement Approved & Active</h4>
                        <p className="text-xs text-zinc-400 mt-1.5 max-w-lg font-mono leading-relaxed">
                          You have digitally signed this agreement under strict international standard guidelines. Our TCW Group coordinators will contact you via WhatsApp for immediate flight booking instructions.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-3xl flex items-center gap-4 text-red-400">
                      <div className="w-12 h-12 bg-[#0b112d] border border-red-500/20 text-red-400 flex items-center justify-center rounded-2xl shrink-0">
                        <AlertTriangle size={24} />
                      </div>
                      <div>
                        <h4 className="font-display font-extrabold text-white">Offer Declined</h4>
                        <p className="text-xs text-zinc-400 mt-1 font-mono leading-relaxed">
                          This deployment opportunity was rejected or canceled by the travel committee. Your profile has been re-enlisted for active matching with other international employers.
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
