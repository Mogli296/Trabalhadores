import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  User, Calendar, Globe, MapPin, Briefcase, Award, 
  FileCheck, Shield, Phone, Image, Video, Plus, Trash2, 
  CheckCircle, AlertCircle, Play, Info
} from 'lucide-react';
import { api } from '../services/api';
import { WorkerProfile } from '../types';

interface WorkerProfileFormProps {
  userId: string;
  onProfileUpdated?: () => void;
}

export default function WorkerProfileForm({ userId, onProfileUpdated }: WorkerProfileFormProps) {
  const [profile, setProfile] = useState<WorkerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Drag and drop states
  const [draggingPhoto, setDraggingPhoto] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);

  // Local form field states
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState<number>(18);
  const [gender, setGender] = useState('');
  const [country, setCountry] = useState('');
  const [profession, setProfession] = useState('');
  const [licenseType, setLicenseType] = useState('Nenhuma');
  const [englishLevel, setEnglishLevel] = useState('Não fala');
  const [certificateType, setCertificateType] = useState('');
  const [certificateValidity, setCertificateValidity] = useState('');
  const [hasPassport, setHasPassport] = useState<'Sim' | 'Não'>('Não');
  const [visaType, setVisaType] = useState('');
  const [visaValidity, setVisaValidity] = useState('');
  const [drivesMachinery, setDrivesMachinery] = useState<'Sim' | 'Não'>('Não');
  const [phone, setPhone] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [presentationVideo, setPresentationVideo] = useState('');
  const [documentsVideo, setDocumentsVideo] = useState('');

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const data = await api.getProfile(userId);
      setProfile(data);
      // Map states
      setFullName(data.fullName || '');
      setAge(data.age || 18);
      setGender(data.gender || '');
      setCountry(data.country || '');
      setProfession(data.profession || '');
      setLicenseType(data.licenseType || 'Nenhuma');
      setEnglishLevel(data.englishLevel || 'Não fala');
      setCertificateType(data.certificateType || '');
      setCertificateValidity(data.certificateValidity || '');
      setHasPassport(data.hasPassport || 'Não');
      setVisaType(data.visaType || '');
      setVisaValidity(data.visaValidity || '');
      setDrivesMachinery(data.drivesMachinery || 'Não');
      setPhone(data.phone || '');
      setPhotos(data.photos || []);
      setPresentationVideo(data.videos?.presentation || '');
      setDocumentsVideo(data.videos?.documents || '');
    } catch (err: any) {
      setError('Não foi possível carregar os dados do perfil.');
    } finally {
      setLoading(false);
    }
  };

  // Generic Base64 FileReader uploader helper
  const handleUploadFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64 = reader.result as string;
          const uploadRes = await api.uploadMedia(file.name, base64);
          resolve(uploadRes.url);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Erro ao ler o arquivo físico.'));
      reader.readAsDataURL(file);
    });
  };

  // Upload multi photos
  const handlePhotoUploadChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploadProgress('Fazendo upload de fotos...');
    const urls: string[] = [];
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) {
          alert('Por favor, selecione apenas arquivos de imagem.');
          continue;
        }
        const url = await handleUploadFile(file);
        urls.push(url);
      }
      setPhotos(prev => [...prev, ...urls]);
      setSuccess('Imagens carregadas temporariamente. Clique em "Salvar Alterações" para fixar!');
    } catch (err: any) {
      setError('Erro ao enviar fotos.');
    } finally {
      setUploadProgress(null);
    }
  };

  // Upload presentation video
  const handlePresentationVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('video/')) {
      alert('Selecione apenas arquivos de vídeo para a apresentação pessoal.');
      return;
    }
    
    setUploadProgress('Processando vídeo de apresentação...');
    try {
      const url = await handleUploadFile(file);
      setPresentationVideo(url);
      setSuccess('Vídeo de apresentação pessoal processado. Salve o formulário para persistir.');
    } catch (err) {
      setError('Falha ao enviar o vídeo de apresentação. Tente um arquivo menor.');
    } finally {
      setUploadProgress(null);
    }
  };

  // Upload documents/validation video
  const handleDocumentsVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('video/') && !file.type.startsWith('image/')) {
      alert('Selecione um vídeo ou foto clara de verificação de documentos.');
      return;
    }

    setUploadProgress('Enviando arquivos de identificação...');
    try {
      const url = await handleUploadFile(file);
      setDocumentsVideo(url);
      setSuccess('Comprovação enviada para análise. Lembre-se de salvar suas alterações.');
    } catch (err) {
      setError('Falha ao enviar comprovante de identificação.');
    } finally {
      setUploadProgress(null);
    }
  };

  const removePhoto = (indexToRemove: number) => {
    setPhotos(photos.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!fullName.trim()) {
      setError('O campo Nome Completo é obrigatório.');
      return;
    }
    if (!phone.trim()) {
      setError('O número de celular é obrigatório.');
      return;
    }

    setSaving(true);
    try {
      const payload: Partial<WorkerProfile> = {
        fullName,
        age: Number(age) || 18,
        gender,
        country,
        profession,
        licenseType,
        englishLevel,
        certificateType,
        certificateValidity,
        hasPassport,
        visaType,
        visaValidity,
        drivesMachinery,
        phone,
        photos,
        videos: {
          presentation: presentationVideo,
          documents: documentsVideo
        }
      };

      await api.updateProfile(userId, payload);
      setSuccess('Seu cadastro profissional foi atualizado e enviado para nossos agentes internacionais!');
      if (onProfileUpdated) onProfileUpdated();
      
      // Auto dim success message after 5 seconds
      setTimeout(() => setSuccess(null), 5000);
    } catch (err: any) {
      setError(err.message || 'Erro ao gravar as alterações do seu perfil.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div id="loading" className="flex items-center justify-center p-16">
        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent animate-spin"></div>
        <span className="ml-3 text-zinc-400 font-mono text-xs uppercase tracking-wider">Carregando qualificação do trabalhador...</span>
      </div>
    );
  }

  return (
    <div id="worker-profile-root" className="max-w-4xl mx-auto p-4 lg:p-8">
      {/* Intro banner */}
      <div className="mb-8 bg-zinc-950 border border-zinc-900 rounded-none p-8 lg:p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Award size={120} className="text-emerald-550" />
        </div>
        <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-emerald-400 bg-emerald-950/50 border border-emerald-900 px-3 py-1 rounded-none uppercase">
          Perfil Qualificado Ativo
        </span>
        <h2 className="text-2xl lg:text-3xl font-extrabold text-white mt-4 tracking-tighter uppercase">Configuração do Worker Profile</h2>
        <p className="text-xs text-zinc-400 mt-2 max-w-2xl leading-relaxed uppercase tracking-wide">
          Preencha os seus marcos profissionais para ficar elegível às temporadas de viagem voluntárias e contratos remunerados de 1 a 3 meses contratados por empregadores homologados pela Work.
        </p>
      </div>

      {error && (
        <div id="profile-error" className="mb-6 p-4 rounded-none bg-red-950/40 border border-red-900/60 text-red-300 flex items-center gap-3 text-xs font-mono">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div id="profile-success" className="mb-6 p-4 rounded-none bg-emerald-950/40 border border-emerald-900/60 text-emerald-300 flex items-center gap-3 text-xs font-mono">
          <CheckCircle size={16} className="shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {uploadProgress && (
        <div id="upload-pbar" className="mb-6 p-4 rounded-none bg-blue-950/40 border border-blue-900/60 text-blue-300 flex items-center gap-3 text-xs font-mono animate-pulse">
          <Info size={16} className="shrink-0" />
          <span>{uploadProgress}</span>
        </div>
      )}

      <form id="profile-main-form" onSubmit={handleSubmit} className="space-y-6">
        {/* CARD 1: Dados Pessoais de Contato */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-none p-6 lg:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-zinc-900 pb-4">
            <User className="text-emerald-400" size={18} />
            <h3 className="font-semibold text-base text-white uppercase tracking-wider">1. Informações de Identificação & Contato</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Nome */}
            <div className="space-y-1">
              <label htmlFor="fullName" className="block text-[10px] text-gray-500 uppercase">
                Nome Completo (como no passaporte)
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 p-2.5 text-sm focus:border-emerald-500 outline-none rounded-none text-white transition-all"
              />
            </div>

            {/* Número de celular obrigatório */}
            <div className="space-y-1">
              <label htmlFor="phone" className="block text-[10px] text-gray-500 uppercase">
                Celular de Contato Recrutamento <span className="text-emerald-500 font-bold">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                  <Phone size={14} />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  placeholder="Ex: +55 (11) 99999-9999"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 p-2.5 text-sm pl-9 focus:border-emerald-500 outline-none rounded-none text-white transition-all"
                />
              </div>
            </div>

            {/* Idade */}
            <div className="space-y-1">
              <label htmlFor="age" className="block text-[10px] text-gray-500 uppercase">
                Idade do Candidato (Mínimo de 18 anos)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                  <Calendar size={14} />
                </div>
                <input
                  id="age"
                  name="age"
                  type="number"
                  min="18"
                  max="120"
                  required
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full bg-zinc-900 border border-zinc-800 p-2.5 text-sm pl-9 focus:border-emerald-550 outline-none rounded-none text-white transition-all animate-none"
                />
              </div>
            </div>

            {/* Gênero */}
            <div className="space-y-2">
              <label htmlFor="gender" className="block text-[10px] text-gray-500 uppercase">
                Gênero Declarado
              </label>
              <select
                id="gender"
                name="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 p-2.5 text-sm focus:border-emerald-500 outline-none rounded-none text-gray-400 transition-all font-sans"
              >
                <option value="">Selecione...</option>
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
                <option value="Não-Binário">Não-Binário / Outro</option>
              </select>
            </div>

            {/* País em que está */}
            <div className="space-y-1 md:col-span-2">
              <label htmlFor="country" className="block text-[10px] text-gray-500 uppercase">
                País Atuante / Localização Atual
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                  <Globe size={14} />
                </div>
                <input
                  id="country"
                  name="country"
                  type="text"
                  placeholder="Ex: Brasil, Portugal, Angola"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 p-2.5 text-sm pl-9 focus:border-emerald-500 outline-none rounded-none text-white transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* CARD 2: Competências e Qualificações */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-none p-6 lg:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-zinc-900 pb-4">
            <Briefcase className="text-emerald-450" size={18} />
            <h3 className="font-semibold text-base text-white uppercase tracking-wider">2. Qualificações de Trabalho & Fluência</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Profissão */}
            <div className="space-y-1">
              <label htmlFor="profession" className="block text-[10px] text-gray-500 uppercase">
                Profissão ou Especialidade Principal
              </label>
              <input
                id="profession"
                name="profession"
                type="text"
                placeholder="Ex: Carpinteiro, Cozinheiro, Técnico Agrícola"
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 p-2.5 text-sm focus:border-emerald-500 outline-none rounded-none text-white transition-all"
              />
            </div>

            {/* Habilitação de Direção */}
            <div className="space-y-1">
              <label htmlFor="licenseType" className="block text-[10px] text-gray-500 uppercase">
                Habilitação / Carteira de Motorista
              </label>
              <select
                id="licenseType"
                name="licenseType"
                value={licenseType}
                onChange={(e) => setLicenseType(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 p-2.5 text-sm focus:border-emerald-500 outline-none rounded-none text-gray-400 transition-all font-sans"
              >
                <option value="Nenhuma">Nenhuma / Não possui</option>
                <option value="Categoria A">Categoria A (Motos)</option>
                <option value="Categoria B">Categoria B (Carros de Passeio)</option>
                <option value="Categoria C">Categoria C (Carga)</option>
                <option value="Categoria D">Categoria D (Transporte)</option>
                <option value="Categoria E">Categoria E (Articulados)</option>
                <option value="Internacional (PID)">Carteira Internacional (PID)</option>
              </select>
            </div>

            {/* Nível do Inglês */}
            <div className="space-y-1">
              <label htmlFor="englishLevel" className="block text-[10px] text-gray-500 uppercase">
                Nível de Proficiência em Inglês
              </label>
              <select
                id="englishLevel"
                name="englishLevel"
                value={englishLevel}
                onChange={(e) => setEnglishLevel(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 p-2.5 text-sm focus:border-emerald-500 outline-none rounded-none text-gray-400 transition-all font-sans"
              >
                <option value="Não fala">Não fala</option>
                <option value="Básico">Básico</option>
                <option value="Intermediário">Intermediário</option>
                <option value="Avançado">Avançado</option>
                <option value="Fluente">Fluente / Idioma Nativo</option>
              </select>
            </div>

            {/* Dirige Maquinário */}
            <div className="space-y-1">
              <label htmlFor="drivesMachinery" className="block text-[10px] text-gray-500 uppercase">
                Dirige / Opera Maquinários Pesados?
              </label>
              <select
                id="drivesMachinery"
                name="drivesMachinery"
                value={drivesMachinery}
                onChange={(e) => setDrivesMachinery(e.target.value as 'Sim' | 'Não')}
                className="w-full bg-zinc-900 border border-zinc-800 p-2.5 text-sm focus:border-emerald-500 outline-none rounded-none text-gray-400 transition-all font-sans"
              >
                <option value="Não">Não</option>
                <option value="Sim">Sim</option>
              </select>
            </div>

            {/* Certificado Especializado */}
            <div className="space-y-1">
              <label htmlFor="certificateType" className="block text-[10px] text-gray-500 uppercase">
                Certificação Industrial / Comercial
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                  <Award size={14} />
                </div>
                <input
                  id="certificateType"
                  name="certificateType"
                  type="text"
                  placeholder="Ex: NR35, Solda TIG, Segurança Industrial"
                  value={certificateType}
                  onChange={(e) => setCertificateType(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 p-2.5 text-sm pl-9 focus:border-emerald-500 outline-none rounded-none text-white transition-all"
                />
              </div>
            </div>

            {/* Validade Certificado */}
            <div className="space-y-1">
              <label htmlFor="certificateValidity" className="block text-[10px] text-gray-500 uppercase">
                Validade do Certificado
              </label>
              <input
                id="certificateValidity"
                name="certificateValidity"
                type="date"
                value={certificateValidity}
                onChange={(e) => setCertificateValidity(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 p-2.5 text-sm focus:border-emerald-500 outline-none rounded-none text-white transition-all"
              />
            </div>
          </div>
        </div>

        {/* CARD 3: Passaporte e Visto */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-none p-6 lg:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-zinc-900 pb-4">
            <Shield className="text-emerald-400" size={18} />
            <h3 className="font-semibold text-base text-white uppercase tracking-wider">3. Aptidão Internacional & Documentos</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Tem passaporte */}
            <div className="space-y-1">
              <label htmlFor="hasPassport" className="block text-[10px] text-gray-500 uppercase">
                Possui Passaporte Válido?
              </label>
              <select
                id="hasPassport"
                name="hasPassport"
                value={hasPassport}
                onChange={(e) => setHasPassport(e.target.value as 'Sim' | 'Não')}
                className="w-full bg-zinc-900 border border-zinc-800 p-2.5 text-sm focus:border-emerald-500 outline-none rounded-none text-gray-400 transition-all font-sans"
              >
                <option value="Não">Não</option>
                <option value="Sim">Sim</option>
              </select>
            </div>

            {/* Tipo de visto */}
            <div className="space-y-1">
              <label htmlFor="visaType" className="block text-[10px] text-gray-500 uppercase">
                Tipo do Visto Ativo (Se aplicável)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                  <FileCheck size={14} />
                </div>
                <input
                  id="visaType"
                  name="visaType"
                  type="text"
                  placeholder="Ex: H-1B, J-1, Visto de Estudante, Isento"
                  value={visaType}
                  onChange={(e) => setVisaType(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 p-2.5 text-sm pl-9 focus:border-emerald-555 outline-none rounded-none text-white transition-all"
                />
              </div>
            </div>

            {/* Validade do Visto */}
            <div className="space-y-1 md:col-span-2">
              <label htmlFor="visaValidity" className="block text-[10px] text-gray-500 uppercase">
                Validade do Visto Consular
              </label>
              <input
                id="visaValidity"
                name="visaValidity"
                type="date"
                value={visaValidity}
                onChange={(e) => setVisaValidity(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 p-2.5 text-sm focus:border-emerald-500 outline-none rounded-none text-white transition-all"
              />
            </div>
          </div>
        </div>

        {/* CARD 4: Fotos e Vídeos de Verificação */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-none p-6 lg:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-zinc-900 pb-4">
            <Image className="text-emerald-400" size={18} />
            <h3 className="font-semibold text-base text-white uppercase tracking-wider">4. Galeria de Mídias & Vídeo-Apresentação</h3>
          </div>

          {/* Fotos Upload */}
          <div className="space-y-3">
            <span className="block text-[10px] text-gray-500 uppercase">
              Fotos Pessoais & do Trabalho Executado
            </span>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wide">Adicione múltiplas fotos de perfil ou fazendo seu serviço para consolidar a confiança.</p>
            
            {/* Photos grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              {photos.map((url, idx) => (
                <div key={idx} className="relative group aspect-square rounded-none overflow-hidden border border-zinc-800 bg-zinc-900">
                  <img referrerPolicy="no-referrer" src={url} alt={`Trabalho ${idx}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                    <button
                      type="button"
                      id={`remove-photo-${idx}`}
                      onClick={() => removePhoto(idx)}
                      className="p-2 rounded-none bg-red-950/80 border border-red-500 text-red-400 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              
              <label 
                id="multi-photo-dropzone"
                className="aspect-square border-2 border-dashed border-zinc-805 hover:border-emerald-500/50 hover:bg-zinc-900 flex flex-col items-center justify-center gap-1 text-xs rounded-none cursor-pointer transition-all text-zinc-400 hover:text-emerald-400 uppercase tracking-widest font-mono"
              >
                <Plus size={18} />
                <span className="text-[10px]">UPLOADS</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUploadChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Videos upload */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-zinc-900">
            {/* Presentation Video */}
            <div className="space-y-3">
              <span className="block text-[10px] text-gray-500 uppercase">
                Vídeo de Apresentação Pessoal
              </span>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wide">Grave um vídeo explicando quem você é de 30 a 60 segundos.</p>
              
              {presentationVideo ? (
                <div className="border border-zinc-900 rounded-none p-4 bg-zinc-900 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs uppercase tracking-wider font-mono">
                    <CheckCircle size={14} />
                    <span>Apresentação carregada</span>
                  </div>
                  <video src={presentationVideo} controls className="w-full rounded-none aspect-video bg-black object-cover" />
                  <button
                    type="button"
                    onClick={() => setPresentationVideo('')}
                    className="w-full py-2 bg-red-950/20 hover:bg-red-950/50 border border-red-900 text-red-450 rounded-none text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Alterar Vídeo
                  </button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-zinc-800 hover:border-emerald-500/50 hover:bg-zinc-900 flex flex-col items-center justify-center gap-3 rounded-none cursor-pointer transition-all text-zinc-400 hover:text-emerald-400 py-8 text-center uppercase tracking-widest font-mono">
                  <Video size={28} className="text-zinc-650 hover:text-emerald-400" />
                  <div>
                    <span className="text-xs block">+ VÍDEO INTRO</span>
                    <span className="text-[9px] text-zinc-500 block mt-1 leading-relaxed">Vídeo de apresentação pessoal</span>
                  </div>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handlePresentationVideoUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Document Verification Video */}
            <div className="space-y-3">
              <span className="block text-[10px] text-gray-500 uppercase">
                Mídias de Documentos (Identidade / Passaporte)
              </span>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wide">Faça um vídeo mostrando sua folha de identificação ou foto clara.</p>

              {documentsVideo ? (
                <div className="border border-zinc-900 rounded-none p-4 bg-zinc-900 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs uppercase tracking-wider font-mono">
                    <CheckCircle size={14} />
                    <span>Mídia cadastrada</span>
                  </div>
                  {documentsVideo.includes('video/') || documentsVideo.startsWith('data:video') ? (
                    <video src={documentsVideo} controls className="w-full rounded-none aspect-video bg-black object-cover" />
                  ) : (
                    <img referrerPolicy="no-referrer" src={documentsVideo} alt="Identidade" className="w-full rounded-none aspect-video object-cover bg-black" />
                  )}
                  <button
                    type="button"
                    onClick={() => setDocumentsVideo('')}
                    className="w-full py-2 bg-red-950/20 hover:bg-red-950/50 border border-red-900 text-red-450 rounded-none text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Alterar Arquivo
                  </button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-zinc-800 hover:border-emerald-500/50 hover:bg-zinc-900 flex flex-col items-center justify-center gap-3 rounded-none cursor-pointer transition-all text-zinc-400 hover:text-emerald-400 py-8 text-center uppercase tracking-widest font-mono">
                  <FileCheck size={28} className="text-zinc-650 hover:text-emerald-400" />
                  <div>
                    <span className="text-xs block">+ DOCUMENTAR</span>
                    <span className="text-[9px] text-zinc-500 block mt-1 leading-relaxed">Documentos e rosto</span>
                  </div>
                  <input
                    type="file"
                    accept="video/*,image/*"
                    onChange={handleDocumentsVideoUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Action controls */}
        <div className="p-5 bg-zinc-950 border border-zinc-900 rounded-none flex justify-between sm:justify-end items-center gap-4">
          <p className="text-[10px] text-zinc-500 font-mono hidden sm:block uppercase tracking-wider">Contato cadastrado: <span className="text-emerald-400 font-bold">{phone || 'Pendente'}</span></p>
          <button
            type="submit"
            id="profile-save-button"
            disabled={saving}
            className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3 px-8 text-sm transition-all shadow-[0_4px_20px_rgba(16,185,129,0.2)] rounded-none cursor-pointer disabled:opacity-50"
          >
            {saving ? 'GRAVANDO...' : 'SALVAR ALTERAÇÕES'}
          </button>
        </div>
      </form>
    </div>
  );
}
