import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Award, FileText, Globe, Search, Phone, Mail, 
  MapPin, ShieldAlert, BadgeCheck, FileSignature, 
  Plus, X, Video, FileCheck 
} from 'lucide-react';
import { api } from '../services/api';
import { WorkerProfile, SeasonalContract } from '../types';

export default function AdminDashboard() {
  const [profiles, setProfiles] = useState<(WorkerProfile & { email: string })[]>([]);
  const [contracts, setContracts] = useState<SeasonalContract[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<(WorkerProfile & { email: string }) | null>(null);
  
  // Filtering states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterEnglish, setFilterEnglish] = useState('Todos');
  const [filterPassport, setFilterPassport] = useState('Todos');
  const [filterMachinery, setFilterMachinery] = useState('Todos');

  // New Contract form states
  const [showContractForm, setShowContractForm] = useState(false);
  const [contractRole, setContractRole] = useState('');
  const [contractDestination, setContractDestination] = useState('');
  const [contractDuration, setContractDuration] = useState(3);
  const [contractSalary, setContractSalary] = useState('');
  const [contractStartDate, setContractStartDate] = useState('');
  const [contractEndDate, setContractEndDate] = useState('');
  const [contractTerms, setContractTerms] = useState('');

  // UI state
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'profiles' | 'contracts'>('profiles');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const pData = await api.getAdminProfiles();
      setProfiles(pData);
      
      // Fetch all contracts (using standard admin token query, since admin retrieves all)
      const cData = await api.getContracts('user_admin_1'); // pass standard admin trigger
      setContracts(cData);
    } catch (err) {
      console.error('Error charging admin views', err);
    } finally {
      setLoading(false);
    }
  };

  const handleIssueContract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProfile) return;

    if (!contractRole || !contractDestination || !contractSalary || !contractStartDate || !contractEndDate) {
      alert('Todos os campos fundamentais do contrato devem ser definidos.');
      return;
    }

    try {
      const payload = {
        workerId: selectedProfile.userId,
        destinationCountry: contractDestination,
        durationMonths: contractDuration,
        role: contractRole,
        salary: contractSalary,
        startDate: contractStartDate,
        endDate: contractEndDate,
        terms: contractTerms || `Contrato Oficial de Trabalho de Temporada de ${contractDuration} meses regulado por patrocinadores credenciados ao grupo TCW.`
      };

      const res = await api.createContract(payload);
      setContracts(prev => [...prev, res.contract]);
      
      // Auto-update values
      alert(res.message);
      setShowContractForm(false);
      setTab('contracts');
      
      // Clean form states
      setContractRole('');
      setContractDestination('');
      setContractDuration(3);
      setContractSalary('');
      setContractStartDate('');
      setContractEndDate('');
      setContractTerms('');
    } catch (err) {
      alert('Erro ao emitir contrato.');
    }
  };

  // Helper calculation details
  const totalWorkers = profiles.length;
  const withPassport = profiles.filter(p => p.hasPassport === 'Sim').length;
  const issuedContracts = contracts.length;
  const signedContracts = contracts.filter(c => c.status === 'Assinado').length;

  const filteredProfiles = profiles.filter(profile => {
    const matchesSearch = 
      profile.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.profession.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (profile.country || '').toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesEnglish = filterEnglish === 'Todos' || profile.englishLevel === filterEnglish;
    const matchesPassport = filterPassport === 'Todos' || profile.hasPassport === filterPassport;
    const matchesMachinery = filterMachinery === 'Todos' || profile.drivesMachinery === filterMachinery;

    return matchesSearch && matchesEnglish && matchesPassport && matchesMachinery;
  });

  if (loading) {
    return (
      <div id="admin-loading" className="flex items-center justify-center p-16">
        <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent animate-spin"></div>
        <span className="ml-3 text-zinc-500 font-mono tracking-widest uppercase text-xs font-bold">Carregando painel administrativo corporativo...</span>
      </div>
    );
  }

  return (
    <div id="admin-root" className="max-w-7xl mx-auto p-2 lg:p-4 space-y-8 text-zinc-350">
      {/* Top Banner stats indicator */}
      <div className="bg-[#060a23]/60 border border-white/5 backdrop-blur-md rounded-3xl p-6 lg:p-8 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b border-white/5">
          <div>
            <span className="text-[10px] font-mono font-black text-[#22d3ee] uppercase tracking-widest bg-cyan-950/40 border border-cyan-500/25 px-3 py-1.5 rounded-full">
              Sessão Administrativa de Qualificações
            </span>
            <h2 className="text-xl lg:text-2xl font-black uppercase tracking-tight text-white mt-4">Gestão de Trabalhadores Sazonais</h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl font-semibold leading-relaxed">Validação de dossiês técnicos, avaliação de documentação de vistos e emissão de contratos corporativos de curta temporada.</p>
          </div>
          
          <div className="flex gap-1 bg-[#0b112d]/80 p-1.5 rounded-2xl shrink-0 border border-white/5" id="admin-tabs-toggle">
            <button
              id="admin-tab-profiles"
              onClick={() => setTab('profiles')}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-mono font-black transition-all cursor-pointer rounded-xl ${tab === 'profiles' ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-md shadow-cyan-400/10' : 'text-zinc-400 hover:text-white'}`}
            >
              Candidatos Ativos
            </button>
            <button
              id="admin-tab-contracts"
              onClick={() => setTab('contracts')}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-mono font-black transition-all cursor-pointer rounded-xl ${tab === 'contracts' ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-md shadow-cyan-400/10' : 'text-zinc-400 hover:text-white'}`}
            >
              Contratos ({issuedContracts})
            </button>
          </div>
        </div>

        {/* Stats segment */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
          <div className="bg-[#0b112d]/65 border border-white/5 rounded-2xl p-4">
            <Users size={16} className="text-cyan-400 mb-2" />
            <span className="text-[10px] text-zinc-500 font-black font-mono block uppercase">Trabalhadores</span>
            <span className="text-xl font-extrabold text-white mt-1 block">{totalWorkers}</span>
          </div>

          <div className="bg-[#0b112d]/65 border border-white/5 rounded-2xl p-4">
            <Globe size={16} className="text-cyan-400 mb-2" />
            <span className="text-[10px] text-zinc-500 font-black font-mono block uppercase">Passaportes Verificados</span>
            <span className="text-xl font-extrabold text-white mt-1 block">{withPassport} de {totalWorkers}</span>
          </div>

          <div className="bg-[#0b112d]/65 border border-white/5 rounded-2xl p-4">
            <FileText size={16} className="text-cyan-400 mb-2" />
            <span className="text-[10px] text-zinc-500 font-black font-mono block uppercase">Contratos Emitidos</span>
            <span className="text-xl font-extrabold text-white mt-1 block">{issuedContracts}</span>
          </div>

          <div className="bg-[#0b112d]/65 border border-white/5 rounded-2xl p-4">
            <FileSignature size={16} className="text-cyan-400 mb-2" />
            <span className="text-[10px] text-zinc-500 font-black font-mono block uppercase">Contratos Assinados</span>
            <span className="text-xl font-extrabold text-white mt-1 block">{signedContracts}</span>
          </div>
        </div>
      </div>

      {tab === 'profiles' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main search and profiles grid list */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#060a23]/60 border border-white/5 backdrop-blur-md rounded-3xl p-6 space-y-4 shadow-sm">
              <h3 className="text-xs uppercase tracking-wider text-[#22d3ee] font-black font-mono">Filtros de Busca Avançada</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Search */}
                <div className="relative md:col-span-2">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                    <Search size={14} />
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar por profissional, nome, país..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#0b112d] text-white border border-white/5 p-2.5 text-sm pl-9 focus:border-cyan-400 outline-none rounded-xl transition-all font-medium placeholder-zinc-500"
                  />
                </div>

                {/* English level select */}
                <div className="space-y-1.5">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase font-black tracking-wider block mb-1.5">Fluência Inglês</span>
                  <select
                    value={filterEnglish}
                    onChange={(e) => setFilterEnglish(e.target.value)}
                    className="w-full bg-[#0b112d] text-xs text-white border border-white/5 p-2.5 focus:border-cyan-400 outline-none rounded-xl font-sans font-bold"
                  >
                    <option value="Todos" className="bg-[#0b112d] text-white">Todos os níveis</option>
                    <option value="Não fala" className="bg-[#0b112d] text-white">Não fala</option>
                    <option value="Básico" className="bg-[#0b112d] text-white">Básico</option>
                    <option value="Intermediário" className="bg-[#0b112d] text-white">Intermediário</option>
                    <option value="Avançado" className="bg-[#0b112d] text-white">Avançado</option>
                    <option value="Fluente" className="bg-[#0b112d] text-white">Fluente</option>
                  </select>
                </div>

                {/* Passport select */}
                <div className="space-y-1.5">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase font-black tracking-wider block mb-1.5">Passaporte Válido</span>
                  <select
                    value={filterPassport}
                    onChange={(e) => setFilterPassport(e.target.value)}
                    className="w-full bg-[#0b112d] text-xs text-white border border-white/5 p-2.5 focus:border-cyan-400 outline-none rounded-xl font-sans font-bold"
                  >
                    <option value="Todos" className="bg-[#0b112d] text-white">Todos</option>
                    <option value="Sim" className="bg-[#0b112d] text-white">Sim, possui</option>
                    <option value="Não" className="bg-[#0b112d] text-white">Não possui</option>
                  </select>
                </div>

                {/* Machinery select */}
                <div className="space-y-1.5 md:col-span-2">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase font-black tracking-wider block mb-1.5">Opera Maquinário</span>
                  <select
                    value={filterMachinery}
                    onChange={(e) => setFilterMachinery(e.target.value)}
                    className="w-full bg-[#0b112d] text-xs text-white border border-white/5 p-2.5 focus:border-cyan-400 outline-none rounded-xl font-sans font-bold"
                  >
                    <option value="Todos" className="bg-[#0b112d] text-white">Todos</option>
                    <option value="Sim" className="bg-[#0b112d] text-white">Sim, dirige</option>
                    <option value="Não" className="bg-[#0b112d] text-white">Não dirige</option>
                  </select>
                </div>
              </div>
            </div>

            {/* List candidate items layout */}
            <div className="space-y-3">
              {filteredProfiles.length === 0 ? (
                <div className="bg-[#060a23]/60 border border-white/5 rounded-3xl p-12 text-center text-zinc-450 shadow-xl">
                  <ShieldAlert className="mx-auto mb-3 text-zinc-500" size={24} />
                  <p className="text-xs uppercase tracking-wider font-mono font-bold">Nenhum profissional qualificado atende a estes requisitos.</p>
                </div>
              ) : (
                filteredProfiles.map(p => {
                  const isSelected = selectedProfile?.id === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        setSelectedProfile(p);
                        setShowContractForm(false);
                      }}
                      className={`w-full text-left p-5 transition-all cursor-pointer block rounded-3xl ${
                        isSelected 
                          ? 'border-cyan-500/50 bg-[#0b112d]/85 shadow-lg shadow-cyan-400/5 border' 
                          : 'border-white/5 bg-[#0b112d]/40 shadow-xs hover:border-white/15 hover:bg-[#0b112d]/65 border'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-extrabold text-white text-sm">{p.fullName}</h4>
                            <span className="text-[10px] text-zinc-500 font-sans font-bold">({p.age} anos)</span>
                          </div>
                          <p className="text-[10px] text-[#22d3ee] font-sans font-black mt-1 uppercase tracking-wider">{p.profession || 'Ofício não preenchido'}</p>
                        </div>
                        <span className="text-[10px] text-zinc-300 font-mono font-black bg-[#101942]/60 border border-white/5 px-3 py-1 rounded-full flex items-center gap-1 uppercase">
                          <MapPin size={10} className="text-zinc-500" />
                          {p.country || 'S/N'}
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[9px] font-mono font-bold tracking-wide text-zinc-400 uppercase">
                        <span className="px-2 py-1 bg-[#060a23]/40 border border-white/5 rounded-lg text-center truncate">ING: {p.englishLevel}</span>
                        <span className="px-2 py-1 bg-[#060a23]/40 border border-white/5 rounded-lg text-center truncate">PASS: {p.hasPassport}</span>
                        <span className="px-2 py-1 bg-[#060a23]/40 border border-white/5 rounded-lg text-center truncate">MÁQ: {p.drivesMachinery}</span>
                        <span className="px-2 py-1 bg-cyan-950/40 text-[#22d3ee] border border-cyan-500/20 rounded-lg text-center truncate">CNH: {p.licenseType}</span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Dossier inspect screen layout - Right side */}
          <div className="lg:col-span-5">
            {selectedProfile ? (
              <div className="bg-[#060a23]/60 border border-white/5 backdrop-blur-md rounded-3xl p-6 lg:p-8 space-y-6 shadow-2xl relative text-zinc-305">
                {/* Header */}
                <div className="border-b border-white/5 pb-5">
                  <span className="text-[10px] font-mono text-cyan-400 font-black uppercase tracking-wider">
                    Dossiê Técnico Consular
                  </span>
                  <h2 className="text-lg lg:text-xl font-display font-black text-white mt-1 uppercase">
                    {selectedProfile.fullName}
                  </h2>
                  <p className="text-[10px] text-zinc-400 mt-1.5 font-mono uppercase tracking-widest font-black">{selectedProfile.email} • {selectedProfile.phone}</p>
                </div>

                {!showContractForm ? (
                  <>
                    {/* Information map specs */}
                    <div className="space-y-4">
                      <h3 className="text-[10px] font-mono font-black uppercase tracking-widest text-[#22d3ee] border-l-2 border-cyan-400 pl-2">
                        Especificações Profissionais ({selectedProfile.gender})
                      </h3>
                      
                      <div className="grid grid-cols-2 gap-4 text-xs font-sans leading-relaxed">
                        <div className="p-3 bg-[#0b112d]/75 rounded-xl border border-white/5">
                          <span className="text-zinc-550 block text-[9px] uppercase font-mono font-black">Ofício</span>
                          <span className="text-white font-extrabold block mt-0.5">{selectedProfile.profession || 'Não informado'}</span>
                        </div>
                        <div className="p-3 bg-[#0b112d]/75 rounded-xl border border-white/5">
                          <span className="text-zinc-550 block text-[9px] uppercase font-mono font-black">Nível do Inglês</span>
                          <span className="text-[#22d3ee] font-extrabold block mt-0.5">{selectedProfile.englishLevel}</span>
                        </div>
                        <div className="p-3 bg-[#0b112d]/75 rounded-xl border border-white/5">
                          <span className="text-zinc-550 block text-[9px] uppercase font-mono font-black">Habilitação</span>
                          <span className="text-white font-extrabold block mt-0.5">{selectedProfile.licenseType}</span>
                        </div>
                        <div className="p-3 bg-[#0b112d]/75 rounded-xl border border-white/5">
                          <span className="text-zinc-550 block text-[9px] uppercase font-mono font-black">Dirige Maquinário</span>
                          <span className="text-white font-extrabold block mt-0.5">{selectedProfile.drivesMachinery}</span>
                        </div>
                        <div className="p-3 bg-[#0b112d]/75 rounded-xl border border-white/5 col-span-2">
                          <span className="text-zinc-550 block text-[9px] uppercase font-mono font-black">Certificado Sazonal</span>
                          <span className="text-white font-extrabold block mt-0.5">
                            {selectedProfile.certificateType ? `${selectedProfile.certificateType} (Val: ${selectedProfile.certificateValidity})` : 'Nenhum certificado registrado'}
                          </span>
                        </div>
                        <div className="p-3 bg-[#0b112d]/75 rounded-xl border border-white/5">
                          <span className="text-zinc-550 block text-[9px] uppercase font-mono font-black">Tem Passaporte</span>
                          <span className="text-white font-extrabold block mt-0.5">{selectedProfile.hasPassport}</span>
                        </div>
                        <div className="p-3 bg-[#0b112d]/75 rounded-xl border border-white/5">
                          <span className="text-zinc-550 block text-[9px] uppercase font-mono font-black">Visto Existente</span>
                          <span className="text-white font-extrabold block mt-0.5">
                            {selectedProfile.visaType ? `${selectedProfile.visaType} (Val: ${selectedProfile.visaValidity})` : 'Nenhum'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Photo and Video analysis */}
                    <div className="space-y-4 pt-2">
                      <h3 className="text-[10px] font-mono font-black uppercase tracking-widest text-[#22d3ee]/85">
                        Galeria de Trabalho & Entrevistas
                      </h3>

                      {/* Video clips */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <span className="text-[9px] text-zinc-500 font-mono block uppercase font-bold">Apresentação</span>
                          {selectedProfile.videos?.presentation ? (
                            <video src={selectedProfile.videos.presentation} controls className="w-full aspect-video rounded-xl bg-black object-cover shadow-xs" />
                          ) : (
                            <div className="aspect-video bg-[#0b112d] border border-white/5 flex items-center justify-center text-[10px] rounded-xl text-zinc-500 font-semibold tracking-wider uppercase">Pendente</div>
                          )}
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] text-zinc-500 font-mono block uppercase font-bold">Documentação</span>
                          {selectedProfile.videos?.documents ? (
                            <video src={selectedProfile.videos.documents} controls className="w-full aspect-video rounded-xl bg-black object-cover shadow-xs" />
                          ) : (
                            <div className="aspect-video bg-[#0b112d] border border-white/5 flex items-center justify-center text-[10px] rounded-xl text-zinc-500 font-semibold tracking-wider uppercase">Pendente</div>
                          )}
                        </div>
                      </div>

                      {/* Photos inspect */}
                      {selectedProfile.photos && selectedProfile.photos.length > 0 ? (
                        <div className="grid grid-cols-3 gap-2">
                          {selectedProfile.photos.map((src, i) => (
                            <a href={src} target="_blank" rel="noopener noreferrer" key={i} className="aspect-square border border-white/10 bg-[#0b112d] rounded-xl overflow-hidden cursor-pointer hover:border-[#22d3ee] transition-all">
                              <img src={src} className="w-full h-full object-cover" />
                            </a>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black font-mono">Nenhuma foto de trabalho adicionada.</p>
                      )}
                    </div>

                    {/* Action button: Emit contract */}
                    <button
                      type="button"
                      id="admin-issue-contract-trigger"
                      onClick={() => {
                        setContractRole(selectedProfile.profession);
                        setContractTerms(`EXPATRIADO DE TEMPORADA EM CONFORMIDADE CONSULAR.\n\nEste contrato de trabalho temporário regula as obrigações e deveres entre o trabalhador de ofício qualificado ${selectedProfile.fullName} e o grupo TCW para a temporada produtiva no exterior.\n\nBenefícios Inclusos:\n- Acomodação privativa ou compartilhada custeada.\n- Bilhete aéreo de ida e retorno.\n- Salário e repouso garantidos sob a convenção comercial local.\n- Seguro-saúde contra incidentes operacionais de trabalho.`);
                        setShowContractForm(true);
                      }}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black py-4 transition-all rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.15)] cursor-pointer text-xs uppercase tracking-widest font-mono"
                    >
                      <Plus size={14} className="stroke-[2.5]" />
                      EMITIR CONTRATO CORPORATIVO
                    </button>
                  </>
                ) : (
                  /* Form: Issue Seasonal Contract template */
                  <form id="issue-contract-form" onSubmit={handleIssueContract} className="space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-white/5">
                      <h3 className="text-xs uppercase font-mono font-black text-[#22d3ee]">Novo Contrato Sazonal</h3>
                      <button type="button" onClick={() => setShowContractForm(false)} className="p-1 px-2.5 bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-300 cursor-pointer rounded-lg text-[9px] font-mono uppercase font-bold">
                        FECHAR
                      </button>
                    </div>

                    <div className="space-y-3 text-xs">
                      {/* Cargo/Role */}
                      <div className="space-y-1.55">
                        <label className="text-zinc-400 font-mono uppercase text-[9px] font-black block mb-1.5">Função / Cargo</label>
                        <input
                          type="text"
                          required
                          value={contractRole}
                          onChange={(e) => setContractRole(e.target.value)}
                          className="w-full bg-[#0b112d] border border-white/5 p-2.5 text-white focus:outline-none focus:border-cyan-400 rounded-xl font-bold"
                        />
                      </div>

                      {/* Destination */}
                      <div className="space-y-1.5">
                        <label className="text-zinc-400 font-mono uppercase text-[9px] font-black block mb-1.5">País de Destino</label>
                        <input
                          type="text"
                          required
                          value={contractDestination}
                          onChange={(e) => setContractDestination(e.target.value)}
                          className="w-full bg-[#0b112d] border border-white/5 p-2.5 text-white focus:outline-none focus:border-cyan-400 rounded-xl font-bold"
                        />
                      </div>

                      {/* Salary template description */}
                      <div className="space-y-1.5">
                        <label className="text-zinc-400 font-mono uppercase text-[9px] font-black block mb-1.5">Remuneração / Salário</label>
                        <input
                          type="text"
                          required
                          placeholder="Ex: $3,500.00 / Mês"
                          value={contractSalary}
                          onChange={(e) => setContractSalary(e.target.value)}
                          className="w-full bg-[#0b112d] border border-white/5 p-2.5 text-white focus:outline-none focus:border-cyan-400 rounded-xl font-bold font-mono placeholder-zinc-600"
                        />
                      </div>

                      {/* Duration months */}
                      <div className="space-y-1.5">
                        <label className="text-zinc-400 font-mono uppercase text-[9px] font-black block mb-1.5">Duração (Meses de Temporada)</label>
                        <select
                          value={contractDuration}
                          onChange={(e) => setContractDuration(Number(e.target.value))}
                          className="w-full bg-[#0b112d] border border-white/5 p-2.5 text-[#22d3ee] font-extrabold focus:outline-none focus:border-cyan-400 rounded-xl font-sans"
                        >
                          <option value="1" className="bg-[#0b112d] text-white">1 Mês (Curta Sazonalidade)</option>
                          <option value="2" className="bg-[#0b112d] text-white">2 Meses (Média Sazonalidade)</option>
                          <option value="3" className="bg-[#0b112d] text-white">3 Meses (Temporada Cheia)</option>
                        </select>
                      </div>

                      {/* Dates start/ends */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="text-zinc-400 font-mono uppercase text-[9px] font-black block mb-1.5">Início Temporada</label>
                          <input
                            type="date"
                            required
                            value={contractStartDate}
                            onChange={(e) => setContractStartDate(e.target.value)}
                            className="w-full bg-[#0b112d] border border-white/5 p-2 text-white focus:outline-none focus:border-cyan-400 rounded-xl font-sans text-xs font-semibold select-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-zinc-400 font-mono uppercase text-[9px] font-black block mb-1.5">Retorno Temporada</label>
                          <input
                            type="date"
                            required
                            value={contractEndDate}
                            onChange={(e) => setContractEndDate(e.target.value)}
                            className="w-full bg-[#0b112d] border border-white/5 p-2 text-white focus:outline-none focus:border-cyan-400 rounded-xl font-sans text-xs font-semibold select-none"
                          />
                        </div>
                      </div>

                      {/* Terms text */}
                      <div className="space-y-1.5">
                        <label className="text-zinc-400 font-mono uppercase text-[9px] font-black block mb-1.5">Termos e Benefícios Oferecidos</label>
                        <textarea
                          rows={4}
                          value={contractTerms}
                          onChange={(e) => setContractTerms(e.target.value)}
                          className="w-full bg-[#0b112d] border border-white/5 p-2.5 text-zinc-350 focus:outline-none focus:border-cyan-400 text-xs font-sans whitespace-pre-wrap leading-relaxed resize-none rounded-xl font-medium"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      id="admin-issue-contract-submit"
                      className="w-full py-4 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-xs uppercase tracking-widest font-mono transition-all cursor-pointer rounded-xl mt-4 shadow-[0_0_20px_rgba(34,211,238,0.15)]"
                    >
                      EMITIR PROPOSTA DE CONTRATO
                    </button>
                  </form>
                )}
              </div>
            ) : (
              <div className="bg-[#060a23]/30 border border-white/5 border-dashed rounded-3xl p-8 text-center text-zinc-500 mx-auto max-w-sm">
                <BadgeCheck size={28} className="text-zinc-500/50 mx-auto mb-3" />
                <h4 className="font-mono text-xs text-white/80 uppercase tracking-wilder font-extrabold">Selecione um Candidato</h4>
                <p className="text-[10px] text-zinc-450 mt-1 uppercase tracking-wide font-bold">Para analisar mídias de documentos e outorgar contratos season.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Contracts tab workspace */
        <div className="bg-[#060a23]/60 border border-white/5 backdrop-blur-md rounded-3xl p-6 lg:p-8 space-y-6 shadow-2xl">
          <h3 className="text-xs font-mono font-black uppercase tracking-widest text-[#22d3ee] border-b border-white/5 pb-3">Histórico de Contratos Sazonais Emitidos</h3>
          
          {contracts.length === 0 ? (
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Nenhum contrato voluntário foi emitido até o momento na Work.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/5 text-zinc-500 font-mono uppercase text-[9px] tracking-wider font-extrabold">
                    <th className="py-3 px-4">Profissional</th>
                    <th className="py-3 px-4">Cargo / Função</th>
                    <th className="py-3 px-4">Destino</th>
                    <th className="py-3 px-4">Duração</th>
                    <th className="py-3 px-4">Início / Término</th>
                    <th className="py-3 px-4">Salário</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-sans">
                  {contracts.map(contract => (
                    <tr key={contract.id} id={`row-contract-${contract.id}`} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-4 font-extrabold text-white">{contract.workerName}</td>
                      <td className="py-4 px-4 text-zinc-300 font-semibold">{contract.role}</td>
                      <td className="py-4 px-4 text-cyan-400 font-mono font-black uppercase">{contract.destinationCountry}</td>
                      <td className="py-4 px-4 font-mono font-black text-zinc-405">{contract.durationMonths} m</td>
                      <td className="py-4 px-4 text-zinc-500 font-mono text-[10px]">
                        {new Date(contract.startDate).toLocaleDateString('pt-BR')} até{' '}
                        {new Date(contract.endDate).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="py-4 px-4 font-mono font-extrabold text-[#22d3ee]">{contract.salary}</td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-0.5 rounded-full font-mono uppercase text-[9px] font-black ${
                          contract.status === 'Assinado' 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : contract.status === 'Cancelado' 
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                            : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                        }`}>
                          {contract.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
