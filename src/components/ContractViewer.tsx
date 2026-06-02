import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Calendar, DollarSign, Globe, Check, AlertTriangle, ArrowUpRight, HelpCircle, FileCheck } from 'lucide-react';
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
      setError('Erro ao buscar seus contratos de temporada.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignContract = async (contractId: string) => {
    if (!signatureName.trim()) {
      alert('Por favor, digite sua rubrica ou nome completo para assinar.');
      return;
    }

    setSigning(true);
    try {
      const res = await api.signContract(contractId, 'Assinado');
      // Update local cache
      setContracts(prev => prev.map(c => c.id === contractId ? res.contract : c));
      setSelectedContract(res.contract);
      alert('Contrato homologado e assinado com sucesso!');
    } catch (err) {
      alert('Erro ao assinar contrato.');
    } finally {
      setSigning(false);
    }
  };

  const handleDeclineContract = async (contractId: string) => {
    if (!confirm('Tem certeza que deseja declinar esta oferta de temporada?')) return;
    
    try {
      const res = await api.signContract(contractId, 'Cancelado');
      setContracts(prev => prev.map(c => c.id === contractId ? res.contract : c));
      setSelectedContract(res.contract);
    } catch (err) {
      alert('Erro ao cancelar proposta.');
    }
  };

  if (loading) {
    return (
      <div id="loading" className="flex items-center justify-center p-12">
        <div className="w-8 h-8 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
        <span className="ml-3 text-zinc-400 font-sans text-sm">Carregando seus contratos...</span>
      </div>
    );
  }

  return (
    <div id="contract-viewer-root" className="max-w-6xl mx-auto p-4 lg:p-8">
      {contracts.length === 0 ? (
        <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-8 lg:p-12 text-center max-w-xl mx-auto space-y-4">
          <div className="w-16 h-16 bg-zinc-900 border border-zinc-850 rounded-2xl flex items-center justify-center mx-auto text-zinc-500 shadow-xl shadow-black">
            <FileText size={28} />
          </div>
          <h3 className="font-display font-bold text-xl text-white">Nenhum contrato ativo no momento</h3>
          <p className="text-sm text-zinc-400 max-w-sm mx-auto leading-relaxed">
            Seu perfil está no banco de vagas internacional. Assim que um patrocinador habilitar sua ida, o contrato sairá aqui.
          </p>
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/40 text-left text-xs text-emerald-400 leading-normal font-sans">
            <strong>Dica do Recrutador:</strong> Complete 100% de seu cadastro técnico enviando fotos trabalhando e seu vídeo de apresentação pessoal para acelerar os convites!
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* List panel - Left side */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-4">
              <h3 className="text-xs uppercase font-mono tracking-widest text-zinc-500 font-bold mb-3 px-1">
                Contratos Emitidos ({contracts.length})
              </h3>
              
              <div className="space-y-2">
                {contracts.map(contract => {
                  const isSelected = selectedContract?.id === contract.id;
                  return (
                    <button
                      key={contract.id}
                      id={`sidebar-contract-${contract.id}`}
                      onClick={() => setSelectedContract(contract)}
                      className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-zinc-900 border-emerald-500/50 shadow-lg shadow-emerald-950/10' 
                          : 'bg-zinc-950 border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/50'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span className="font-display font-bold text-sm text-white line-clamp-1">{contract.role}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono shrink-0 uppercase tracking-wide font-bold ${
                          contract.status === 'Assinado' 
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-900/60' 
                            : contract.status === 'Cancelado' 
                            ? 'bg-red-950 text-red-400 border border-red-900' 
                            : 'bg-yellow-950/80 text-yellow-500 border border-yellow-900'
                        }`}>
                          {contract.status}
                        </span>
                      </div>
                      
                      <div className="mt-3 flex items-center gap-1 text-[11px] text-zinc-400 font-mono">
                        <Globe size={12} className="text-emerald-500" />
                        <span>{contract.destinationCountry}</span>
                        <span className="text-zinc-600">•</span>
                        <span>{contract.durationMonths} {contract.durationMonths === 1 ? 'mês' : 'meses'}</span>
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
                  className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 lg:p-8 space-y-6 shadow-2xl relative"
                  id={`details-contract-${selectedContract.id}`}
                >
                  {/* Decorative badge overlay */}
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                    <FileCheck size={180} className="text-emerald-500" />
                  </div>

                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-900 pb-5">
                    <div>
                      <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                        Contrato Oficial de Temporada
                      </span>
                      <h2 className="text-xl lg:text-2xl font-display font-extrabold text-white mt-1">
                        {selectedContract.role}
                      </h2>
                    </div>
                    <div className="flex items-center gap-2">
                       <span className="text-xs text-zinc-500 font-mono">Cod: #{selectedContract.id.substr(-6)}</span>
                       <span className={`text-xs px-3 py-1 rounded-full font-mono uppercase tracking-wide font-bold ${
                          selectedContract.status === 'Assinado' 
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-900' 
                            : selectedContract.status === 'Cancelado' 
                            ? 'bg-red-950 text-red-400 border border-red-900'
                            : 'bg-yellow-950 text-yellow-400 border border-yellow-900'
                        }`}>
                          {selectedContract.status}
                        </span>
                    </div>
                  </div>

                  {/* Highlight Specs Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Destination */}
                    <div className="bg-zinc-900/60 p-4 rounded-2xl border border-zinc-900/80 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-950 flex items-center justify-center text-emerald-400">
                        <Globe size={18} />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase text-zinc-500 font-mono block">Destino</span>
                        <span className="text-sm font-bold text-white">{selectedContract.destinationCountry}</span>
                      </div>
                    </div>

                    {/* Salary */}
                    <div className="bg-zinc-900/60 p-4 rounded-2xl border border-zinc-900/80 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-950 flex items-center justify-center text-emerald-400">
                        <DollarSign size={18} />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase text-zinc-500 font-mono block">Compensação</span>
                        <span className="text-sm font-bold text-white">{selectedContract.salary}</span>
                      </div>
                    </div>

                    {/* Duration */}
                    <div className="bg-zinc-900/60 p-4 rounded-2xl border border-zinc-900/80 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-950 flex items-center justify-center text-emerald-400">
                        <Calendar size={18} />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase text-zinc-500 font-mono block">Duração Sazonal</span>
                        <span className="text-sm font-bold text-white">{selectedContract.durationMonths} {selectedContract.durationMonths === 1 ? 'mês' : 'meses'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Dates information */}
                  <div className="p-4 bg-zinc-900/30 border border-zinc-900 rounded-2xl grid grid-cols-2 gap-4 text-xs font-mono">
                    <div>
                      <span className="text-zinc-500 block">DATA DE INÍCIO DA JORNADA</span>
                      <span className="text-white font-bold text-sm mt-1 block">
                        {new Date(selectedContract.startDate).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block">DATA DE TÉRMINO & RETORNO</span>
                      <span className="text-white font-bold text-sm mt-1 block">
                        {new Date(selectedContract.endDate).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>

                  {/* Terms and official guidelines of Work app */}
                  <div className="space-y-3">
                    <h3 className="font-mono text-xs uppercase font-bold text-zinc-400 tracking-wider">
                      Termos de Responsabilidade & Regras de Temporada
                    </h3>
                    <div className="bg-black/40 border border-zinc-900 rounded-2xl p-5 text-sm text-zinc-400 leading-relaxed font-sans max-h-64 overflow-y-auto whitespace-pre-line box-border">
                      {selectedContract.terms}
                    </div>
                  </div>

                  {/* Interactive Signature Area */}
                  {selectedContract.status === 'Pendente' ? (
                    <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-3xl space-y-4" id="signature-input-panel">
                      <div className="flex gap-2 items-start text-xs text-yellow-500 leading-normal">
                        <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                        <span>A assinatura deste documento atesta que você se compromete com a data de permanência e possui documentação ativa para viagem no período.</span>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="signature" className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
                          Assinatura Eletrônica (Digite seu nome oficial completo)
                        </label>
                        <input
                          id="signature"
                          type="text"
                          required
                          placeholder="Ex: Carlos Silva de Carvalho"
                          value={signatureName}
                          onChange={(e) => setSignatureName(e.target.value)}
                          className="w-full bg-black text-white border border-zinc-800 focus:border-emerald-500 py-3 px-4 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all font-sans"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <button
                          type="button"
                          id="decline-contract-btn"
                          onClick={() => handleDeclineContract(selectedContract.id)}
                          className="py-3 px-4 bg-zinc-950 border border-red-900/60 hover:bg-red-950/20 text-red-400 hover:text-red-300 font-semibold rounded-xl text-sm transition-all cursor-pointer text-center"
                        >
                          Declinar Proposta
                        </button>
                        <button
                          type="button"
                          id="sign-contract-btn"
                          disabled={signing}
                          onClick={() => handleSignContract(selectedContract.id)}
                          className="py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-xl text-sm transition-all duration-300 transform hover:scale-[1.01] cursor-pointer text-center disabled:opacity-50"
                        >
                          {signing ? 'Registrando firma...' : 'Homologar & Assinar'}
                        </button>
                      </div>
                    </div>
                  ) : selectedContract.status === 'Assinado' ? (
                    <div className="p-6 bg-emerald-950/20 border border-emerald-900/40 rounded-3xl flex flex-col sm:flex-row items-center gap-4 text-emerald-400">
                      <div className="w-12 h-12 bg-emerald-950 border border-emerald-900 text-emerald-400 flex items-center justify-center rounded-2xl shadow-lg shrink-0">
                        <Check size={24} />
                      </div>
                      <div>
                        <h4 className="font-display font-semibold text-white">Contrato Homologado & Ativo</h4>
                        <p className="text-xs text-emerald-300 mt-1 max-w-lg">
                          Você assinou eletronicamente este contrato sob os termos de conformidade internacional da plataforma. Nossa equipe entrará em contato via WhatsApp para marcar a data de embarque.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 bg-red-950/10 border border-red-900/40 rounded-3xl flex items-center gap-4 text-red-400">
                      <div className="w-12 h-12 bg-red-950/30 border border-red-900 text-red-400 flex items-center justify-center rounded-2xl shrink-0">
                        <AlertTriangle size={24} />
                      </div>
                      <div>
                        <h4 className="font-display font-semibold text-white">Contrato Cancelado / Declinado</h4>
                        <p className="text-xs text-red-300/80 mt-1">
                          Esta proposta foi formalmente rejeitada ou cancelada pelo comitê de viagens. Seu perfil permanece disponível para outros recrutadores.
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
