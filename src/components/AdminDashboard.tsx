import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Award, FileText, Globe, Search, Filter, Phone, Mail, 
  MapPin, ShieldAlert, BadgeCheck, FileSignature, Play, HelpCircle, 
  DollarSign, Calendar, Plus, X, ArrowUpRight, Video, FileCheck 
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
        terms: contractTerms || `Contrato Oficial de Trabalho de Temporada de ${contractDuration} meses regulado por patrocinadores credenciados à marca Work.`
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
        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent animate-spin"></div>
        <span className="ml-3 text-zinc-400 font-mono tracking-widest uppercase text-xs">Carregando painel administrativo corporativo...</span>
      </div>
    );
  }

  return (
    <div id="admin-root" className="max-w-7xl mx-auto p-4 lg:p-8 space-y-8 text-white">
      {/* Top Banner stats indicator */}
      <div className="bg-zinc-950 border border-zinc-900 rounded-none p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b border-zinc-900">
          <div>
            <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950/40 border border-emerald-900/50 px-3 py-1">
              Ambiente Corporativo Consular / Licenciado Sazonais
            </span>
            <h2 className="text-xl lg:text-2xl font-semibold uppercase tracking-wider text-white mt-4">Gestão de Trabalhadores Sazonais</h2>
            <p className="text-xs text-zinc-400 mt-2 uppercase tracking-wide">Validação de dossiês, visualizações de vídeos e emissão de contratos voluntários de 3 meses.</p>
          </div>
          
          <div className="flex gap-2 bg-zinc-900 p-1 shrink-0">
            <button
              id="admin-tab-profiles"
              onClick={() => setTab('profiles')}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-mono transition-all cursor-pointer ${tab === 'profiles' ? 'bg-emerald-500 text-black font-bold' : 'text-zinc-400 hover:text-white'}`}
            >
              Candidatos Ativos
            </button>
            <button
              id="admin-tab-contracts"
              onClick={() => setTab('contracts')}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-mono transition-all cursor-pointer ${tab === 'contracts' ? 'bg-emerald-500 text-black font-bold' : 'text-zinc-400 hover:text-white'}`}
            >
              Contratos ({issuedContracts})
            </button>
          </div>
        </div>

        {/* Stats segment */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
          <div className="bg-zinc-900/40 border border-zinc-900 p-4">
            <Users size={16} className="text-emerald-500 mb-2" />
            <span className="text-[10px] text-zinc-500 font-mono block uppercase">Trabalhadores Ativos</span>
            <span className="text-xl font-extrabold text-white mt-1 block">{totalWorkers}</span>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-900 p-4">
            <Globe size={16} className="text-emerald-500 mb-2" />
            <span className="text-[10px] text-zinc-500 font-mono block uppercase">Passaportes Verificados</span>
            <span className="text-xl font-extrabold text-white mt-1 block">{withPassport} de {totalWorkers}</span>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-900 p-4">
            <FileText size={16} className="text-emerald-500 mb-2" />
            <span className="text-[10px] text-zinc-500 font-mono block uppercase">Contratos Emitidos</span>
            <span className="text-xl font-extrabold text-white mt-1 block">{issuedContracts}</span>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-900 p-4">
            <FileSignature size={16} className="text-emerald-500 mb-2" />
            <span className="text-[10px] text-zinc-500 font-mono block uppercase">Homologados / Assinados</span>
            <span className="text-xl font-extrabold text-white mt-1 block">{signedContracts}</span>
          </div>
        </div>
      </div>

      {tab === 'profiles' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main search and profiles grid list */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-zinc-950 border border-zinc-900 rounded-none p-6 space-y-4">
              <h3 className="text-xs uppercase tracking-wider text-zinc-400 font-mono">Filtros de Busca Avançada</h3>
              
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
                    className="w-full bg-zinc-900 text-white border border-zinc-800 p-2.5 text-sm pl-9 focus:border-emerald-500 outline-none rounded-none"
                  />
                </div>

                {/* English level select */}
                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider block">Fluência Inglês</span>
                  <select
                    value={filterEnglish}
                    onChange={(e) => setFilterEnglish(e.target.value)}
                    className="w-full bg-zinc-900 text-xs text-white border border-zinc-800 p-2 focus:border-emerald-500 outline-none rounded-none font-sans"
                  >
                    <option value="Todos">Todos os níveis</option>
                    <option value="Não fala">Não fala</option>
                    <option value="Básico">Básico</option>
                    <option value="Intermediário">Intermediário</option>
                    <option value="Avançado">Avançado</option>
                    <option value="Fluente">Fluente</option>
                  </select>
                </div>

                {/* Passport select */}
                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider block">Passaporte Válido</span>
                  <select
                    value={filterPassport}
                    onChange={(e) => setFilterPassport(e.target.value)}
                    className="w-full bg-zinc-900 text-xs text-white border border-zinc-800 p-2 focus:border-emerald-500 outline-none rounded-none font-sans"
                  >
                    <option value="Todos">Todos</option>
                    <option value="Sim">Sim, possui</option>
                    <option value="Não">Não possui</option>
                  </select>
                </div>

                {/* Machinery select */}
                <div className="space-y-1 md:col-span-2">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider block">Opera Maquinário</span>
                  <select
                    value={filterMachinery}
                    onChange={(e) => setFilterMachinery(e.target.value)}
                    className="w-full bg-zinc-900 text-xs text-white border border-zinc-800 p-2 focus:border-emerald-500 outline-none rounded-none font-sans"
                  >
                    <option value="Todos">Todos</option>
                    <option value="Sim">Sim, dirige</option>
                    <option value="Não">Não dirige</option>
                  </select>
                </div>
              </div>
            </div>

            {/* List candidate items layout */}
            <div className="space-y-3">
              {filteredProfiles.length === 0 ? (
                <div className="bg-zinc-950 border border-zinc-900 p-12 text-center text-zinc-500">
                  <ShieldAlert className="mx-auto mb-3" size={24} />
                  <p className="text-xs uppercase tracking-wider font-mono">Nenhum profissional qualificado atende a estes requisitos.</p>
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
                      className={`w-full text-left p-5 bg-zinc-950 border transition-all cursor-pointer block rounded-none ${
                        isSelected 
                          ? 'border-emerald-500/50 bg-zinc-900/60 shadow-lg shadow-emerald-950/5' 
                          : 'border-zinc-900 hover:border-zinc-805 hover:bg-zinc-900/20'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-white text-sm">{p.fullName}</h4>
                            <span className="text-[10px] text-zinc-500 font-mono">({p.age} anos)</span>
                          </div>
                          <p className="text-[10px] text-emerald-400 font-mono font-medium mt-1 uppercase tracking-wider">{p.profession || 'Ofício não preenchido'}</p>
                        </div>
                        <span className="text-[10px] text-zinc-500 font-mono bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-none flex items-center gap-1 uppercase">
                          <MapPin size={10} className="text-zinc-500" />
                          {p.country || 'S/N'}
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[9px] font-mono font-bold tracking-wide text-zinc-400 uppercase">
                        <span className="px-2 py-1 bg-zinc-900 border border-zinc-850 truncate">ING: {p.englishLevel}</span>
                        <span className="px-2 py-1 bg-zinc-900 border border-zinc-850 truncate">PASS: {p.hasPassport}</span>
                        <span className="px-2 py-1 bg-zinc-900 border border-zinc-850 truncate">MÁQ: {p.drivesMachinery}</span>
                        <span className="px-2 py-1 bg-emerald-950/20 text-emerald-400 border border-emerald-900/40 text-center truncate">CNH: {p.licenseType}</span>
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
              <div className="bg-zinc-950 border border-zinc-900 p-6 lg:p-8 space-y-6 shadow-2xl relative">
                {/* Header */}
                <div className="border-b border-zinc-900 pb-5">
                  <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                    Dossiê Técnico Consular
                  </span>
                  <h2 className="text-lg lg:text-xl font-bold uppercase tracking-wider text-white mt-1">
                    {selectedProfile.fullName}
                  </h2>
                  <p className="text-[10px] text-zinc-500 mt-1 font-mono uppercase tracking-widest">{selectedProfile.email} • {selectedProfile.phone}</p>
                </div>

                {!showContractForm ? (
                  <>
                    {/* Information map specs */}
                    <div className="space-y-4">
                      <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-450 border-l-2 border-emerald-500 pl-2">
                        Especificações Profissionais ({selectedProfile.gender})
                      </h3>
                      
                      <div className="grid grid-cols-2 gap-4 text-xs font-sans leading-relaxed">
                        <div className="p-3 bg-zinc-900/50 rounded-none border border-zinc-900">
                          <span className="text-zinc-500 block text-[9px] uppercase font-mono font-bold">Ofício</span>
                          <span className="text-white font-semibold block mt-0.5">{selectedProfile.profession || 'Não informado'}</span>
                        </div>
                        <div className="p-3 bg-zinc-900/50 rounded-none border border-zinc-900">
                          <span className="text-zinc-500 block text-[9px] uppercase font-mono font-bold">Nível do Inglês</span>
                          <span className="text-emerald-400 font-semibold block mt-0.5">{selectedProfile.englishLevel}</span>
                        </div>
                        <div className="p-3 bg-zinc-900/50 rounded-none border border-zinc-900">
                          <span className="text-zinc-500 block text-[9px] uppercase font-mono font-bold">Habilitação</span>
                          <span className="text-white font-semibold block mt-0.5">{selectedProfile.licenseType}</span>
                        </div>
                        <div className="p-3 bg-zinc-900/50 rounded-none border border-zinc-900">
                          <span className="text-zinc-500 block text-[9px] uppercase font-mono font-bold">Dirige Maquinário</span>
                          <span className="text-white font-semibold block mt-0.5">{selectedProfile.drivesMachinery}</span>
                        </div>
                        <div className="p-3 bg-zinc-900/50 rounded-none border border-zinc-900 col-span-2">
                          <span className="text-zinc-500 block text-[9px] uppercase font-mono font-bold">Certificado Sazonal</span>
                          <span className="text-white font-semibold block mt-0.5">
                            {selectedProfile.certificateType ? `${selectedProfile.certificateType} (Val: ${selectedProfile.certificateValidity})` : 'Nenhum certificado registrado'}
                          </span>
                        </div>
                        <div className="p-3 bg-zinc-900/50 rounded-none border border-zinc-900">
                          <span className="text-zinc-500 block text-[9px] uppercase font-mono font-bold">Tem Passaporte</span>
                          <span className="text-white font-semibold block mt-0.5">{selectedProfile.hasPassport}</span>
                        </div>
                        <div className="p-3 bg-zinc-900/50 rounded-none border border-zinc-900">
                          <span className="text-zinc-500 block text-[9px] uppercase font-mono font-bold">Visto Existente</span>
                          <span className="text-white font-semibold block mt-0.5">
                            {selectedProfile.visaType ? `${selectedProfile.visaType} (Val: ${selectedProfile.visaValidity})` : 'Nenhum'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Photo and Video analysis */}
                    <div className="space-y-4 pt-2">
                      <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400">
                        Galeria de Trabalho & Entrevistas
                      </h3>

                      {/* Video clips */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <span className="text-[9px] text-zinc-500 font-mono block uppercase">Apresentação</span>
                          {selectedProfile.videos?.presentation ? (
                            <video src={selectedProfile.videos.presentation} controls className="w-full aspect-video rounded-none bg-black object-cover" />
                          ) : (
                            <div className="aspect-video bg-zinc-900/50 border border-zinc-900 flex items-center justify-center text-[10px] rounded-none text-zinc-650 font-mono uppercase tracking-wider">Pendente</div>
                          )}
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] text-zinc-500 font-mono block uppercase">Documentação</span>
                          {selectedProfile.videos?.documents ? (
                            <video src={selectedProfile.videos.documents} controls className="w-full aspect-video rounded-none bg-black object-cover" />
                          ) : (
                            <div className="aspect-video bg-zinc-900/50 border border-zinc-900 flex items-center justify-center text-[10px] rounded-none text-zinc-650 font-mono uppercase tracking-wider">Pendente</div>
                          )}
                        </div>
                      </div>

                      {/* Photos inspect */}
                      {selectedProfile.photos && selectedProfile.photos.length > 0 ? (
                        <div className="grid grid-cols-3 gap-2">
                          {selectedProfile.photos.map((src, i) => (
                            <a href={src} target="_blank" rel="noopener noreferrer" key={i} className="aspect-square border border-zinc-900 bg-zinc-900 cursor-pointer hover:border-emerald-500 transition-all">
                              <img src={src} className="w-full h-full object-cover" />
                            </a>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[10px] text-zinc-600 uppercase tracking-widest">Nenhuma foto de trabalho adicionada.</p>
                      )}
                    </div>

                    {/* Action button: Emit contract */}
                    <button
                      type="button"
                      id="admin-issue-contract-trigger"
                      onClick={() => {
                        setContractRole(selectedProfile.profession);
                        setContractTerms(`EXPATRIADO DE TEMPORADA EM CONFORMIDADE CONSULAR.\n\nEste contrato de trabalho temporário regula as obrigações e deveres entre o trabalhador de ofício qualificado ${selectedProfile.fullName} e a agência de captação Work para a temporada produtiva no exterior.\n\nBenefícios Inclusos:\n- Acomodação privativa ou compartilhada custeada.\n- Bilhete aéreo de ida e retorno.\n- Salário e repouso garantidos sob a convenção comercial local.\n- Seguro-saúde contra incidentes operacionais de trabalho.`);
                        setShowContractForm(true);
                      }}
                      className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3 transition-all rounded-none cursor-pointer"
                    >
                      <Plus size={14} />
                      EMITIR CONTRATO DE TEMPORADA
                    </button>
                  </>
                ) : (
                  /* Form: Issue Seasonal Contract template */
                  <form id="issue-contract-form" onSubmit={handleIssueContract} className="space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
                      <h3 className="text-xs uppercase font-mono font-bold text-emerald-400">Novo Contrato Sazonal</h3>
                      <button type="button" onClick={() => setShowContractForm(false)} className="p-1 px-2.5 bg-zinc-900 border border-zinc-850 text-zinc-400 hover:text-white cursor-pointer rounded-none text-xs font-mono">
                        FECHAR
                      </button>
                    </div>

                    <div className="space-y-3 text-xs">
                      {/* Cargo/Role */}
                      <div className="space-y-1">
                        <label className="text-zinc-500 font-mono uppercase text-[9px] font-bold">Função / Cargo</label>
                        <input
                          type="text"
                          required
                          value={contractRole}
                          onChange={(e) => setContractRole(e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 p-2.5 text-white focus:outline-none focus:border-emerald-500 rounded-none"
                        />
                      </div>

                      {/* Destination */}
                      <div className="space-y-1">
                        <label className="text-zinc-400 font-mono uppercase text-[9px] font-bold">País de Destino</label>
                        <input
                          type="text"
                          required
                          value={contractDestination}
                          onChange={(e) => setContractDestination(e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 p-2.5 text-white focus:outline-none focus:border-emerald-500 rounded-none"
                        />
                      </div>

                      {/* Salary template description */}
                      <div className="space-y-1">
                        <label className="text-zinc-400 font-mono uppercase text-[9px] font-bold">Remuneração / Salário</label>
                        <input
                          type="text"
                          required
                          placeholder="Ex: $3,500.00 / Mês"
                          value={contractSalary}
                          onChange={(e) => setContractSalary(e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 p-2.5 text-white focus:outline-none focus:border-emerald-500 rounded-none"
                        />
                      </div>

                      {/* Duration months */}
                      <div className="space-y-1">
                        <label className="text-zinc-405 font-mono uppercase text-[9px] font-bold">Duração (Meses de Temporada)</label>
                        <select
                          value={contractDuration}
                          onChange={(e) => setContractDuration(Number(e.target.value))}
                          className="w-full bg-zinc-900 border border-zinc-800 p-2.5 text-white focus:outline-none rounded-none font-sans"
                        >
                          <option value="1">1 Mês (Curta Sazonalidade)</option>
                          <option value="2">2 Meses (Média Sazonalidade)</option>
                          <option value="3">3 Meses (Temporada Cheia)</option>
                        </select>
                      </div>

                      {/* Dates start/ends */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-zinc-450 font-mono uppercase text-[9px] font-bold">Início Temporada</label>
                          <input
                            type="date"
                            required
                            value={contractStartDate}
                            onChange={(e) => setContractStartDate(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 p-2 text-white focus:outline-none focus:border-emerald-500 rounded-none font-sans text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-zinc-450 font-mono uppercase text-[9px] font-bold">Retorno Temporada</label>
                          <input
                            type="date"
                            required
                            value={contractEndDate}
                            onChange={(e) => setContractEndDate(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 p-2 text-white focus:outline-none focus:border-emerald-500 rounded-none font-sans text-xs"
                          />
                        </div>
                      </div>

                      {/* Terms text */}
                      <div className="space-y-1">
                        <label className="text-zinc-400 font-mono uppercase text-[9px] font-bold">Termos e Benefícios Oferecidos</label>
                        <textarea
                          rows={4}
                          value={contractTerms}
                          onChange={(e) => setContractTerms(e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 p-2.5 text-white focus:outline-none focus:border-emerald-500 text-xs font-sans whitespace-pre-wrap leading-relaxed resize-none rounded-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      id="admin-issue-contract-submit"
                      className="w-full py-3 bg-white hover:bg-emerald-500 text-black font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer rounded-none mt-4"
                    >
                      EMITIR PROPOSTA DE CONTRATO
                    </button>
                  </form>
                )}
              </div>
            ) : (
              <div className="bg-zinc-950 border border-zinc-900 rounded-none p-8 text-center text-zinc-500 mx-auto max-w-sm border-dashed">
                <BadgeCheck size={28} className="text-zinc-700 mx-auto mb-3" />
                <h4 className="font-mono text-xs text-white uppercase tracking-wider font-bold">Selecione um Candidato</h4>
                <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-wide">Para analisar mídias de documentos e outorgar contratos season.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Contracts tab workspace */
        <div className="bg-zinc-950 border border-zinc-900 rounded-none p-6 lg:p-8 space-y-6">
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-white border-b border-zinc-900 pb-3">Histórico de Contratos Sazonais Emitidos</h3>
          
          {contracts.length === 0 ? (
            <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Nenhum contrato voluntário foi emitido até o momento na Work.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-zinc-900 text-zinc-500 font-mono uppercase text-[9px] tracking-wider">
                    <th className="py-3 px-4">Profissional</th>
                    <th className="py-3 px-4">Cargo / Função</th>
                    <th className="py-3 px-4">Destino</th>
                    <th className="py-3 px-4">Duração</th>
                    <th className="py-3 px-4">Início / Término</th>
                    <th className="py-3 px-4">Salário</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900 font-sans">
                  {contracts.map(contract => (
                    <tr key={contract.id} id={`row-contract-${contract.id}`} className="hover:bg-zinc-900/60 transition-colors">
                      <td className="py-4 px-4 font-bold text-white">{contract.workerName}</td>
                      <td className="py-4 px-4 text-zinc-300">{contract.role}</td>
                      <td className="py-4 px-4 text-zinc-400 font-mono uppercase">{contract.destinationCountry}</td>
                      <td className="py-4 px-4 font-mono text-zinc-400">{contract.durationMonths} m</td>
                      <td className="py-4 px-4 text-zinc-500 font-mono text-[10px]">
                        {new Date(contract.startDate).toLocaleDateString('pt-BR')} até{' '}
                        {new Date(contract.endDate).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="py-4 px-4 font-mono font-bold text-emerald-400">{contract.salary}</td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-0.5 rounded-none font-mono uppercase text-[9px] font-bold ${
                          contract.status === 'Assinado' 
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-900/40' 
                            : contract.status === 'Cancelado' 
                            ? 'bg-red-950 text-red-400 border border-red-900/40' 
                            : 'bg-yellow-950 text-yellow-400 border border-yellow-900/40'
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
