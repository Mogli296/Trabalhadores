import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Calendar, Globe, MapPin, Briefcase, Award, 
  FileCheck, Shield, Phone, Image, Video, Plus, Trash2, 
  CheckCircle, AlertCircle, Info, Camera, Upload, FileText, X, Check, Laptop, Sparkles
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

  // Upload state tracking
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);

  // Camera capture states
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [activeCameraTarget, setActiveCameraTarget] = useState<'resume' | 'avatar' | 'fullBody' | null>(null);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // 1. Informações Pessoais
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [age, setAge] = useState<number>(18);
  const [gender, setGender] = useState('');
  const [nationality, setNationality] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [linkedin, setLinkedin] = useState('');

  // 2. Documentação
  const [hasPassport, setHasPassport] = useState<'Yes' | 'No'>('No');
  const [passportNumber, setPassportNumber] = useState('');
  const [passportValidity, setPassportValidity] = useState('');
  const [rgNumber, setRgNumber] = useState('');
  const [cpfNumber, setCpfNumber] = useState('');
  const [licenseType, setLicenseType] = useState('None');
  const [licenseCountry, setLicenseCountry] = useState('');
  const [drivesMachinery, setDrivesMachinery] = useState<'Yes' | 'No'>('No');

  // 3. Disponibilidade Internacional
  const [countriesOfInterest, setCountriesOfInterest] = useState<string[]>([]);
  const [travelAvailability, setTravelAvailability] = useState('Immediate');
  const [hasVisa, setHasVisa] = useState<'Yes' | 'No'>('No');
  const [visaCountry, setVisaCountry] = useState('');
  const [visaValidity, setVisaValidity] = useState('');

  // 4. Experiência Profissional
  const [profession, setProfession] = useState('');
  const [experienceYears, setExperienceYears] = useState('Less than 1 year');
  const [lastCompany, setLastCompany] = useState('');
  const [lastRole, setLastRole] = useState('');
  const [lastPeriod, setLastPeriod] = useState('');
  const [experienceDescription, setExperienceDescription] = useState('');

  // 5. Certificações
  const [certifications, setCertifications] = useState<string[]>([]);
  const [certificationFiles, setCertificationFiles] = useState<string[]>([]);
  const [customCertificationText, setCustomCertificationText] = useState('');

  // 6. Idiomas
  const [selectedLanguageKeys, setSelectedLanguageKeys] = useState<string[]>([]);
  const [languageLevels, setLanguageLevels] = useState<Record<string, string>>({});

  // 7. Mídia Profissional
  const [avatarPhoto, setAvatarPhoto] = useState('');
  const [fullBodyPhoto, setFullBodyPhoto] = useState('');
  const [resumePhoto, setResumePhoto] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [presentationVideo, setPresentationVideo] = useState('');
  const [documentsVideo, setDocumentsVideo] = useState('');

  // 9. Termos de Segurança
  const [termsShare, setTermsShare] = useState(false);
  const [termsTruth, setTermsTruth] = useState(false);
  const [termsPrivacy, setTermsPrivacy] = useState(false);

  // Available option items as specified
  const listCountriesOfInt = ['Netherlands', 'Germany', 'Belgium', 'Spain', 'United States', 'Canada', 'Australia'];
  const listTravelAvails = ['Immediate', '30 days', '60 days', '90 days'];
  const listProfessions = [
    'Ajudante / General Helper', 'Event Production', 'Scaffolding & Rigging', 'Forklift Operator', 'Electrician', 
    'Welder', 'Mechanic', 'Professional Driver', 'Waiter/Server', 'Security Guard', 'Logistics', 
    'Industrial Cleaning', 'Hospitality', 'Kitchen/Cook', 'Customer Service'
  ];
  const listExpYearsOptions = ['Less than 1 year', '1 to 3 years', '3 to 5 years', 'More than 5 years'];
  const listCertsOptions = [
    'Electrical Safety (NR-10)', 'Working at Heights (NR-35)', 'Forklift Operator License', 'VCA / Safety Diploma',
    'First Aid Certificate', 'Firefighter / Brigadista', 'Industrial Welding Certificate', 'Professional Driver License'
  ];
  const baseLanguages = [
    { key: 'portuguese', name: 'Portuguese' },
    { key: 'english', name: 'English' },
    { key: 'spanish', name: 'Spanish' },
    { key: 'dutch', name: 'Dutch' },
    { key: 'german', name: 'German' }
  ];
  const listLanguageLevels = ['Basic', 'Intermediate', 'Advanced', 'Fluent / Native'];

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const data = await api.getProfile(userId);
      setProfile(data);

      setFullName(data.fullName || '');
      setBirthDate(data.birthDate || '');
      setAge(data.age || 18);
      setGender(data.gender || '');
      setNationality(data.nationality || '');
      setCountry(data.country || '');
      setCity(data.city || '');
      setPhone(data.phone || '');
      setEmail(data.email || '');
      setLinkedin(data.linkedin || '');

      setHasPassport(data.hasPassport === 'Yes' || (data.hasPassport as any) === 'Sim' ? 'Yes' : 'No');
      setPassportNumber(data.passportNumber || '');
      setPassportValidity(data.passportValidity || '');
      setRgNumber(data.rgNumber || '');
      setCpfNumber(data.cpfNumber || '');
      
      let licT = data.licenseType || 'None';
      if (licT === 'Nenhuma') licT = 'None';
      setLicenseType(licT);

      setLicenseCountry(data.licenseCountry || '');
      setDrivesMachinery(data.drivesMachinery === 'Yes' || (data.drivesMachinery as any) === 'Sim' ? 'Yes' : 'No');

      setCountriesOfInterest(data.countriesOfInterest || []);
      
      let travelAv = data.travelAvailability || 'Immediate';
      if (travelAv === 'Imediata') travelAv = 'Immediate';
      else if (travelAv === '30 dias') travelAv = '30 days';
      else if (travelAv === '60 dias') travelAv = '60 days';
      else if (travelAv === '90 dias') travelAv = '90 days';
      setTravelAvailability(travelAv);

      setHasVisa(data.hasVisa === 'Yes' || (data.hasVisa as any) === 'Sim' ? 'Yes' : 'No');
      setVisaCountry(data.visaCountry || '');
      setVisaValidity(data.visaValidity || '');

      setProfession(data.profession || '');
      
      let expY = data.experienceYears || 'Less than 1 year';
      if (expY === 'Menos de 1 ano') expY = 'Less than 1 year';
      else if (expY === '1 a 3 anos') expY = '1 to 3 years';
      else if (expY === '3 a 5 anos') expY = '3 to 5 years';
      else if (expY === 'Mais de 5 anos') expY = 'More than 5 years';
      setExperienceYears(expY);

      setLastCompany(data.lastCompany || '');
      setLastRole(data.lastRole || '');
      setLastPeriod(data.lastPeriod || '');
      setExperienceDescription(data.experienceDescription || '');

      setCertifications(data.certifications || []);
      setCertificationFiles(data.certificationFiles || []);
      
      // Parse languages state
      if (data.languages && Array.isArray(data.languages)) {
        const initialKeys: string[] = [];
        const initialLevels: Record<string, string> = {};
        data.languages.forEach((l: any) => {
          const match = baseLanguages.find(bl => bl.name.toLowerCase() === l.language.toLowerCase());
          const key = match ? match.key : l.language.toLowerCase();
          initialKeys.push(key);
          let levelVal = l.level;
          if (levelVal === 'Básico') levelVal = 'Basic';
          else if (levelVal === 'Intermediário') levelVal = 'Intermediate';
          else if (levelVal === 'Avançado') levelVal = 'Advanced';
          else if (levelVal === 'Fluente') levelVal = 'Fluent / Native';
          initialLevels[key] = levelVal;
        });
        setSelectedLanguageKeys(initialKeys);
        setLanguageLevels(initialLevels);
      } else {
        setSelectedLanguageKeys(['portuguese']);
        setLanguageLevels({ portuguese: 'Fluent / Native' });
      }

      setAvatarPhoto(data.avatarPhoto || '');
      setFullBodyPhoto(data.fullBodyPhoto || '');
      setResumePhoto(data.resumePhoto || '');
      setPhotos(data.photos || []);
      setPresentationVideo(data.videos?.presentation || '');
      setDocumentsVideo(data.videos?.documents || '');

      setTermsShare(data.termsShare || false);
      setTermsTruth(data.termsTruth || false);
      setTermsPrivacy(data.termsPrivacy || false);

    } catch (err: any) {
      setError('Failed to load candidate profile details.');
    } finally {
      setLoading(false);
    }
  };

  const startCamera = async (target: 'resume' | 'avatar' | 'fullBody') => {
    setError(null);
    setActiveCameraTarget(target);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: target === 'resume' ? 'environment' : 'user' } 
      });
      setVideoStream(stream);
      setIsCameraActive(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 150);
    } catch (err: any) {
      setError('Acesso à webcam recusado ou indisponível.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
      setVideoStream(null);
    }
    setIsCameraActive(false);
    setActiveCameraTarget(null);
  };

  const captureCameraPhoto = async () => {
    if (!videoRef.current || !activeCameraTarget) return;
    setUploadProgress('Processando captura da câmera...');
    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const base64 = canvas.toDataURL('image/jpeg', 0.85);
        
        const uploadRes = await api.uploadMedia(`cam_capture_${activeCameraTarget}_${Date.now()}.jpeg`, base64);
        
        if (activeCameraTarget === 'avatar') {
          setAvatarPhoto(uploadRes.url);
        } else if (activeCameraTarget === 'fullBody') {
          setFullBodyPhoto(uploadRes.url);
        } else if (activeCameraTarget === 'resume') {
          setResumePhoto(uploadRes.url);
        }
        
        setSuccess('Foto capturada e salva com sucesso!');
      }
      stopCamera();
    } catch (err: any) {
      setError('Erro ao enviar captura da câmera.');
    } finally {
      setUploadProgress(null);
    }
  };

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
      reader.onerror = () => reject(new Error('Erro ao ler arquivo local.'));
      reader.readAsDataURL(file);
    });
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'fullBody' | 'resume' | 'cert' | 'presentation' | 'docVerify' | 'photos') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadProgress(`Fazendo upload do arquivo...`);
    try {
      if (type === 'photos') {
        const uploadedUrls: string[] = [];
        for (let i = 0; i < files.length; i++) {
          const u = await handleUploadFile(files[i]);
          uploadedUrls.push(u);
        }
        setPhotos(prev => [...prev, ...uploadedUrls]);
        setSuccess('Fotos adicionadas à galeria com sucesso!');
      } else {
        const file = files[0];
        const url = await handleUploadFile(file);
        
        if (type === 'avatar') setAvatarPhoto(url);
        if (type === 'fullBody') setFullBodyPhoto(url);
        if (type === 'resume') setResumePhoto(url);
        if (type === 'presentation') setPresentationVideo(url);
        if (type === 'docVerify') setDocumentsVideo(url);
        if (type === 'cert') setCertificationFiles(prev => [...prev, url]);

        setSuccess('Mídia enviada temporariamente. Salve o formulário para consolidar.');
      }
    } catch (err) {
      setError('Falha ao fazer upload da mídia.');
    } finally {
      setUploadProgress(null);
    }
  };

  // Toggle checklist utilities
  const handleIntCountryToggle = (countryName: string) => {
    setCountriesOfInterest(prev => 
      prev.includes(countryName) 
        ? prev.filter(c => c !== countryName) 
        : [...prev, countryName]
    );
  };

  const handleCertificationToggle = (certName: string) => {
    setCertifications(prev => 
      prev.includes(certName) 
        ? prev.filter(c => c !== certName) 
        : [...prev, certName]
    );
  };

  const addCustomCertification = () => {
    if (customCertificationText.trim() && !certifications.includes(customCertificationText.trim())) {
      setCertifications(prev => [...prev, customCertificationText.trim()]);
      setCustomCertificationText('');
    }
  };

  const handleLanguageToggle = (langKey: string) => {
    setSelectedLanguageKeys(prev => {
      let nextKeys = [];
      if (prev.includes(langKey)) {
        nextKeys = prev.filter(k => k !== langKey);
        const nextLevels = { ...languageLevels };
        delete nextLevels[langKey];
        setLanguageLevels(nextLevels);
      } else {
        nextKeys = [...prev, langKey];
        setLanguageLevels(l => ({ ...l, [langKey]: 'Básico' }));
      }
      return nextKeys;
    });
  };

  const handleLanguageLevelChange = (langKey: string, level: string) => {
    setLanguageLevels(prev => ({
      ...prev,
      [langKey]: level
    }));
  };

  // Age validation
  const handleBirthDateChange = (dateVal: string) => {
    setBirthDate(dateVal);
    if (!dateVal) return;
    const bDate = new Date(dateVal);
    const today = new Date();
    let computedAge = today.getFullYear() - bDate.getFullYear();
    const monthDiff = today.getMonth() - bDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < bDate.getDate())) {
      computedAge--;
    }
    setAge(computedAge >= 18 ? computedAge : 18);
  };

  // Live TCW Ranking calculation helper (matches backend spec)
  const computeClientRanking = () => {
    const isPremium = 
      hasPassport === 'Sim' && 
      (selectedLanguageKeys.includes('english') && ['Intermediário', 'Avançado', 'Fluente'].includes(languageLevels.english || '')) &&
      !!presentationVideo &&
      certifications.length > 0;

    if (isPremium) return 'Premium';

    const hasDocVerified = !!(documentsVideo || resumePhoto || passportNumber || rgNumber || cpfNumber);
    const hasProvenExperience = (experienceYears && experienceYears !== 'Menos de 1 ano') || !!lastCompany;

    if (hasDocVerified || hasProvenExperience) return 'Verified';

    return 'Available';
  };

  const currentRank = computeClientRanking();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Form validation
    if (!fullName.trim()) {
      setError('Full Name is required.');
      return;
    }
    if (!phone.trim()) {
      setError('Mobile WhatsApp number is required for immediate support alerts.');
      return;
    }
    if (!termsShare || !termsTruth || !termsPrivacy) {
      setError('You must agree to all Security and Privacy Terms to submit your profile.');
      return;
    }

    setSaving(true);
    try {
      // Structure languages payload
      const languagesPayload = selectedLanguageKeys.map(key => {
        const found = baseLanguages.find(bl => bl.key === key);
        return {
          language: found ? found.name : key,
          level: languageLevels[key] || 'Basic'
        };
      });

      const payload: Partial<WorkerProfile> = {
        fullName: fullName.trim(),
        birthDate,
        age,
        gender,
        nationality: nationality.trim(),
        country,
        city: city.trim(),
        linkedin: linkedin.trim(),
        email: email.trim(),
        
        hasPassport,
        passportNumber: passportNumber.trim(),
        passportValidity,
        rgNumber: rgNumber.trim(),
        cpfNumber: cpfNumber.trim(),
        licenseType,
        licenseCountry: licenseCountry.trim(),

        countriesOfInterest,
        travelAvailability,
        hasVisa,
        visaCountry: visaCountry.trim(),
        visaValidity,

        profession,
        experienceYears,
        lastCompany: lastCompany.trim(),
        lastRole: lastRole.trim(),
        lastPeriod: lastPeriod.trim(),
        experienceDescription: experienceDescription.trim(),

        certifications,
        certificationFiles,

        languages: languagesPayload,

        avatarPhoto,
        fullBodyPhoto,
        resumePhoto,
        photos,
        videos: {
          presentation: presentationVideo,
          documents: documentsVideo
        },

        termsShare,
        termsTruth,
        termsPrivacy,

        phone: phone.trim(),
        drivesMachinery,
      };

      await api.updateProfile(userId, payload);
      setSuccess('Success! Candidate registry updated successfully in the TCW ecosystem!');
      if (onProfileUpdated) onProfileUpdated();
      setTimeout(() => setSuccess(null), 5000);
    } catch (err: any) {
      setError(err.message || 'Failed to update candidate registration details.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20 bg-[#020515]/30">
        <div className="w-8 h-8 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin"></div>
        <span className="ml-3 text-zinc-400 font-mono text-xs uppercase tracking-widest font-black">Loading candidate dashboard...</span>
      </div>
    );
  }

  return (
    <div id="worker-profile-form-container" className="max-w-5xl mx-auto p-4 lg:p-6 text-zinc-300">
      <div className="mb-8 p-6 lg:p-8 bg-gradient-to-br from-[#060a23]/80 to-[#020515]/90 border border-white/5 backdrop-blur-md rounded-3xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <Award size={150} className="text-cyan-400" />
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-[#22d3ee] bg-cyan-950/40 border border-cyan-500/20 px-3 py-1 rounded-full uppercase">
              TCW Group Candidate Portal
            </span>
            <h1 className="text-2xl lg:text-3xl font-display font-black text-white mt-4 uppercase">Candidate Profile & Trade Information</h1>
            <p className="text-xs text-zinc-400 mt-2 max-w-xl leading-relaxed">
              Provide the required details and qualifications for international selection processes across Europe, North America, and Australia.
            </p>
          </div>
          
          {/* Dynamic computed TCW Talent Rating Banner */}
          <div id="talent-ranking-widget" className="bg-[#0b112d] border border-white/5 rounded-2xl p-4 flex flex-col items-center gap-2 text-center min-w-[200px] shrink-0 shadow-lg">
            <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 font-bold">TCW Talent Ranking</span>
            {currentRank === 'Premium' ? (
              <div className="flex flex-col items-center">
                <span className="text-3xl">🥇</span>
                <span className="text-[#22d3ee] font-black text-xs uppercase font-mono tracking-widest mt-1">Premium Talent</span>
                <span className="text-[9px] text-zinc-450 mt-1 leading-normal font-medium max-w-[150px]">Complete Profile: Passport + English + Video presentation</span>
              </div>
            ) : currentRank === 'Verified' ? (
              <div className="flex flex-col items-center">
                <span className="text-3xl">🥈</span>
                <span className="text-amber-400 font-black text-xs uppercase font-mono tracking-widest mt-1">Verified Talent</span>
                <span className="text-[9px] text-zinc-450 mt-1 leading-normal font-medium max-w-[150px]">Proven experience or verified documents attached</span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <span className="text-3xl">🥉</span>
                <span className="text-zinc-400 font-extrabold text-xs uppercase font-mono tracking-widest mt-1">Available Candidate</span>
                <span className="text-[9px] text-zinc-500 mt-1 leading-normal font-medium max-w-[150px]">Awaiting uploading of validation media</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3 text-xs font-mono font-bold">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-3 text-xs font-mono font-bold">
          <CheckCircle size={16} className="shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {uploadProgress && (
        <div className="mb-6 p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center gap-3 text-xs font-mono font-bold animate-pulse">
          <Info size={16} className="shrink-0" />
          <span>{uploadProgress}</span>
        </div>
      )}

      {/* Interactive WebCam overlays overlay if active */}
      <AnimatePresence>
        {isCameraActive && activeCameraTarget && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <div className="bg-[#060a23] border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-4 text-center">
              <h3 className="font-display font-extrabold text-white text-base uppercase">TCW Camera Capture</h3>
              <p className="text-xs text-zinc-400">Position your document or face centered in the grid frame for a clean and readable capture.</p>
              
              <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-white/5">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 px-2 py-0.5 bg-red-500 text-white text-[9px] uppercase tracking-widest font-mono font-black rounded">LIVE</div>
              </div>

              <div className="flex gap-2 justify-center pt-2">
                <button
                  type="button"
                  onClick={captureCameraPhoto}
                  className="px-5 py-2.5 bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Take Photo / Snap
                </button>
                <button
                  type="button"
                  onClick={stopCamera}
                  className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold border border-white/5 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* SEÇÃO 1: Informações Pessoais */}
        <div className="bg-[#060a23]/60 border border-white/5 backdrop-blur-md rounded-3xl p-6 lg:p-8 space-y-6 shadow-xl">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <div className="w-8 h-8 rounded-lg bg-cyan-950/50 border border-cyan-500/25 flex items-center justify-center text-cyan-200">
              <User size={16} />
            </div>
            <h3 className="font-display font-black text-white uppercase text-sm tracking-wide">1. Personal Information</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Nome Completo */}
            <div className="md:col-span-2 space-y-1.5">
              <label htmlFor="fullName" className="block text-[10px] text-zinc-400 uppercase font-black tracking-wider">
                Full Name <span className="text-cyan-450 font-bold">*</span>
              </label>
              <input
                id="fullName"
                type="text"
                required
                placeholder="e.g., John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-[#0b112d] border border-white/5 focus:border-cyan-400 p-2.5 rounded-xl text-sm text-white placeholder-zinc-600 outline-none transition-all"
              />
            </div>

            {/* Data de Nascimento */}
            <div className="space-y-1.5">
              <label htmlFor="birthDate" className="block text-[10px] text-zinc-400 uppercase font-black tracking-wider">
                Date of Birth <span className="text-cyan-455 font-bold">*</span>
              </label>
              <input
                id="birthDate"
                type="date"
                required
                value={birthDate}
                onChange={(e) => handleBirthDateChange(e.target.value)}
                className="w-full bg-[#0b112d] border border-white/5 focus:border-cyan-400 p-2.5 rounded-xl text-sm text-white outline-none transition-all"
              />
            </div>

            {/* Sexo */}
            <div className="space-y-1.5">
              <label htmlFor="gender" className="block text-[10px] text-zinc-400 uppercase font-black tracking-wider">
                Gender (Optional)
              </label>
              <select
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full bg-[#0b112d] border border-white/5 focus:border-cyan-400 p-2.5 rounded-xl text-sm text-white outline-none"
              >
                <option value="">Select...</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-Binary">Prefer not to say</option>
              </select>
            </div>

            {/* Nacionalidade */}
            <div className="space-y-1.5">
              <label htmlFor="nationality" className="block text-[10px] text-zinc-400 uppercase font-black tracking-wider">
                Nationality
              </label>
              <input
                id="nationality"
                type="text"
                placeholder="e.g., Brazilian / Portuguese"
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                className="w-full bg-[#0b112d] border border-white/5 focus:border-cyan-400 p-2.5 rounded-xl text-sm text-white placeholder-zinc-650 outline-none"
              />
            </div>

            {/* País de Residência */}
            <div className="space-y-1.5">
              <label htmlFor="country" className="block text-[10px] text-zinc-400 uppercase font-black tracking-wider">
                Current Country of Residence
              </label>
              <input
                id="country"
                type="text"
                placeholder="Ex: Brasil, Portugal"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-[#0b112d] border border-white/5 focus:border-cyan-400 p-2.5 rounded-xl text-sm text-white outline-none"
              />
            </div>

            {/* Cidade */}
            <div className="space-y-1.5">
              <label htmlFor="city" className="block text-[10px] text-zinc-400 uppercase font-black tracking-wider">
                City
              </label>
              <input
                id="city"
                type="text"
                placeholder="Ex: São Paulo / Lisboa"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-[#0b112d] border border-white/5 focus:border-cyan-400 p-2.5 rounded-xl text-sm text-white outline-none"
              />
            </div>

            {/* Telefone WhatsApp */}
            <div className="space-y-1.5">
              <label htmlFor="phone" className="block text-[10px] text-zinc-400 uppercase font-black tracking-wider">
                WhatsApp Phone Number <span className="text-cyan-400 font-bold">*</span>
              </label>
              <input
                id="phone"
                type="tel"
                required
                placeholder="e.g., +1 555-0100"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#0b112d] border border-white/5 focus:border-cyan-400 p-2.5 rounded-xl text-sm text-white outline-none"
              />
            </div>

            {/* E-mail */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-[10px] text-zinc-400 uppercase font-black tracking-wider">
                Contact Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Your official email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0b112d] border border-white/5 focus:border-cyan-400 p-2.5 rounded-xl text-sm text-white outline-none"
              />
            </div>

            {/* LinkedIn */}
            <div className="space-y-1.5 md:col-span-3">
              <label htmlFor="linkedin" className="block text-[10px] text-zinc-400 uppercase font-black tracking-wider">
                LinkedIn Profile URL (Optional)
              </label>
              <input
                id="linkedin"
                type="url"
                placeholder="https://www.linkedin.com/in/yourprofile"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                className="w-full bg-[#0b112d] border border-white/5 focus:border-cyan-400 p-2.5 rounded-xl text-sm text-white outline-none"
              />
            </div>
          </div>
        </div>

        {/* SEÇÃO 2: Documentação */}
        <div className="bg-[#060a23]/60 border border-white/5 backdrop-blur-md rounded-3xl p-6 lg:p-8 space-y-6 shadow-xl">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <div className="w-8 h-8 rounded-lg bg-cyan-950/50 border border-cyan-500/25 flex items-center justify-center text-cyan-200">
              <FileCheck size={16} />
            </div>
            <h3 className="font-display font-black text-white uppercase text-sm tracking-wide">2. Documentation & Credentials</h3>
          </div>

          <div className="space-y-6">
            {/* Passaporte sub-grid */}
            <div className="p-4 bg-[#0b112d]/50 border border-white/5 rounded-2xl space-y-4">
              <span className="text-[10px] font-mono tracking-wider uppercase text-cyan-400 font-extrabold block">📄 International Passport</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="hasPassport" className="block text-[9px] text-zinc-450 uppercase font-bold mb-1">Do you have a valid passport?</label>
                  <select
                    id="hasPassport"
                    value={hasPassport}
                    onChange={(e) => setHasPassport(e.target.value as 'Yes' | 'No')}
                    className="w-full bg-[#0b112d] border border-white/5 focus:border-cyan-400 p-2.5 rounded-xl text-sm text-white"
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
                
                {hasPassport === 'Yes' && (
                  <>
                    <div>
                      <label htmlFor="passportNumber" className="block text-[9px] text-zinc-455 uppercase font-bold mb-1">Passport number</label>
                      <input
                        id="passportNumber"
                        type="text"
                        placeholder="e.g., CL123456"
                        value={passportNumber}
                        onChange={(e) => setPassportNumber(e.target.value)}
                        className="w-full bg-[#0b112d] border border-white/5 focus:border-cyan-400 p-2.5 rounded-xl text-sm text-white"
                      />
                    </div>
                    <div>
                      <label htmlFor="passportValidity" className="block text-[9px] text-zinc-455 uppercase font-bold mb-1">Expiry date</label>
                      <input
                        id="passportValidity"
                        type="date"
                        value={passportValidity}
                        onChange={(e) => setPassportValidity(e.target.value)}
                        className="w-full bg-[#0b112d] border border-white/5 focus:border-cyan-400 p-2.5 rounded-xl text-sm text-white"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Documentos Nacionais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/5 pt-4">
              <div className="space-y-1">
                <label htmlFor="rgNumber" className="block text-[10px] text-zinc-400 uppercase font-black tracking-wider">National ID Number</label>
                <input
                  id="rgNumber"
                  type="text"
                  placeholder="Official ID document number"
                  value={rgNumber}
                  onChange={(e) => setRgNumber(e.target.value)}
                  className="w-full bg-[#0b112d] border border-white/5 focus:border-cyan-400 p-2.5 rounded-xl text-sm text-white"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="cpfNumber" className="block text-[10px] text-zinc-400 uppercase font-black tracking-wider">Tax File Number / SSN / Local ID</label>
                <input
                  id="cpfNumber"
                  type="text"
                  placeholder="e.g., Tax ID number"
                  value={cpfNumber}
                  onChange={(e) => setCpfNumber(e.target.value)}
                  className="w-full bg-[#0b112d] border border-white/5 focus:border-cyan-400 p-2.5 rounded-xl text-sm text-white"
                />
              </div>
            </div>

            {/* Carteira de Motorista */}
            <div className="p-4 bg-[#0b112d]/50 border border-white/5 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label htmlFor="licenseType" className="block text-[10px] text-zinc-400 uppercase font-black tracking-wider">🚗 Driver's License Classification</label>
                <select
                  id="licenseType"
                  value={licenseType}
                  onChange={(e) => setLicenseType(e.target.value)}
                  className="w-full bg-[#0b112d] border border-white/5 focus:border-cyan-400 p-2.5 rounded-xl text-sm text-white"
                >
                  <option value="None">I do not have a license (None)</option>
                  <option value="A">Category A (Motorcycles)</option>
                  <option value="B">Category B (Passenger Cars)</option>
                  <option value="C">Category C (Medium Trucks)</option>
                  <option value="D">Category D (Buses/Passenger Vans)</option>
                  <option value="E">Category E (Heavy/Articulated Trucks)</option>
                  <option value="Other Professional">Other Professional Category</option>
                </select>
              </div>

              <div className="space-y-1">
                <label htmlFor="drivesMachinery" className="block text-[10px] text-zinc-400 uppercase font-black tracking-wider">🚜 Do you operate forklifts/heavy machinery?</label>
                <select
                  id="drivesMachinery"
                  value={drivesMachinery}
                  onChange={(e) => setDrivesMachinery(e.target.value as 'Yes' | 'No')}
                  className="w-full bg-[#0b112d] border border-white/5 focus:border-cyan-400 p-2.5 rounded-xl text-sm text-white"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* SEÇÃO 3: Disponibilidade Internacional */}
        <div className="bg-[#060a23]/60 border border-white/5 backdrop-blur-md rounded-3xl p-6 lg:p-8 space-y-6 shadow-xl">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <div className="w-8 h-8 rounded-lg bg-cyan-950/50 border border-cyan-500/25 flex items-center justify-center text-cyan-200">
              <Globe size={16} />
            </div>
            <h3 className="font-display font-black text-white uppercase text-sm tracking-wide">3. International Availability</h3>
          </div>

          <div className="space-y-5">
            {/* Países de Interesse */}
            <div className="space-y-2">
              <span className="block text-[10px] text-zinc-400 uppercase font-black tracking-wider">🌎 Target Countries for Job Placement</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {listCountriesOfInt.map(c => {
                  const isChecked = countriesOfInterest.includes(c);
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => handleIntCountryToggle(c)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition-all ${
                        isChecked 
                          ? 'bg-cyan-950/30 border-cyan-500/50 text-cyan-300' 
                          : 'bg-[#0b112d] border-white/5 text-zinc-400 hover:border-white/10'
                      }`}
                    >
                      <span>{c}</span>
                      <span className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                        isChecked ? 'bg-cyan-500 border-cyan-400 text-slate-950' : 'border-white/10'
                      }`}>
                        {isChecked && <Check size={11} className="stroke-[3]" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Disponibilidade tempo & visto */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-white/5">
              {/* Tempo de viagem */}
              <div className="space-y-2">
                <span className="block text-[10px] text-zinc-400 uppercase font-black tracking-wider">Travel & Departure Availability</span>
                <div className="grid grid-cols-2 gap-2">
                  {listTravelAvails.map(t => {
                    const isSelected = travelAvailability === t;
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTravelAvailability(t)}
                        className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${
                          isSelected 
                            ? 'bg-cyan-950/35 border-cyan-500/50 text-cyan-300 shadow-md' 
                            : 'bg-[#0b112d] border-white/5 text-zinc-400 hover:border-white/10'
                        }`}
                      >
                        ☑️ {t}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Visto em mãos */}
              <div className="space-y-2">
                <span className="block text-[10px] text-zinc-400 uppercase font-black tracking-wider">Do you have an active work visa?</span>
                <div className="grid grid-cols-2 gap-2">
                  {['No', 'Yes'].map(v => {
                    const isSelected = (hasVisa === v);
                    return (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setHasVisa(v as 'Yes' | 'No')}
                        className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${
                          isSelected 
                            ? 'bg-cyan-950/35 border-cyan-500/50 text-cyan-300 shadow-md' 
                            : 'bg-[#0b112d] border-white/5 text-zinc-400'
                        }`}
                      >
                        {v}
                      </button>
                    );
                  })}
                </div>

                {hasVisa === 'Yes' && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="grid grid-cols-2 gap-2 mt-2 p-3 bg-[#0b112d] border border-white/5 rounded-xl"
                  >
                    <div>
                      <label htmlFor="visaCountry" className="block text-[8px] text-zinc-450 uppercase font-bold mb-1">Visa Country</label>
                      <input
                        id="visaCountry"
                        type="text"
                        placeholder="e.g., USA / Germany"
                        value={visaCountry}
                        onChange={(e) => setVisaCountry(e.target.value)}
                        className="w-full bg-[#060a23] border border-white/5 p-2 rounded-lg text-xs text-white"
                      />
                    </div>
                    <div>
                      <label htmlFor="visaValidity" className="block text-[8px] text-zinc-450 uppercase font-bold mb-1">Visa Expiry Date</label>
                      <input
                        id="visaValidity"
                        type="date"
                        value={visaValidity}
                        onChange={(e) => setVisaValidity(e.target.value)}
                        className="w-full bg-[#060a23] border border-white/5 p-2 rounded-lg text-xs text-white"
                      />
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* SEÇÃO 4: Experiência Profissional */}
        <div className="bg-[#060a23]/60 border border-white/5 backdrop-blur-md rounded-3xl p-6 lg:p-8 space-y-6 shadow-xl">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <div className="w-8 h-8 rounded-lg bg-cyan-950/50 border border-cyan-500/25 flex items-center justify-center text-cyan-200">
              <Briefcase size={16} />
            </div>
            <h3 className="font-display font-black text-white uppercase text-sm tracking-wide">4. Professional Experience</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Área Principal (Dropdown option / customize) */}
            <div className="space-y-1.5 md:col-span-2">
              <label htmlFor="profession" className="block text-[10px] text-zinc-400 uppercase font-black tracking-wider">
                Primary Area / Primary Profession <span className="text-cyan-455 font-bold">*</span>
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <select
                  id="profession"
                  value={listProfessions.includes(profession) ? profession : '_custom_'}
                  onChange={(e) => setProfession(e.target.value === '_custom_' ? '' : e.target.value)}
                  className="bg-[#0b112d] border border-white/5 p-2.5 rounded-xl text-sm text-white focus:border-cyan-500 shadow-inner"
                >
                  <option value="">Select an area...</option>
                  {listProfessions.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                  <option value="_custom_">Other Profession (Write Below)</option>
                </select>
                
                {(!listProfessions.includes(profession) || profession === '') && (
                  <input
                    type="text"
                    placeholder="Type your profession/area manually"
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    className="flex-1 bg-[#0b112d] border border-white/5 focus:border-cyan-400 p-2.5 rounded-xl text-sm text-white"
                  />
                )}
              </div>
            </div>

            {/* Anos de Experiência */}
            <div className="space-y-1.5 md:col-span-2">
              <span className="block text-[10px] text-zinc-400 uppercase font-black tracking-wider mb-2">Years of Experience in this Field</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {listExpYearsOptions.map(e => {
                  const isSelected = experienceYears === e;
                  return (
                    <button
                      key={e}
                      type="button"
                      onClick={() => setExperienceYears(e)}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${
                        isSelected 
                          ? 'bg-cyan-950/35 border-cyan-500/50 text-cyan-300 font-extrabold shadow-md' 
                          : 'bg-[#0b112d] border-white/5 text-zinc-400 hover:border-white/10'
                      }`}
                    >
                      {e}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Última Empresa detelhes */}
            <div className="space-y-1.5 md:col-span-2 p-4 bg-[#0b112d]/50 border border-white/5 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-3 pb-2 border-b border-white/5">
                <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-cyan-400">🏢 Last Company / Most Recent Work Experience</span>
              </div>
              
              <div>
                <label htmlFor="lastCompany" className="block text-[9px] text-zinc-455 uppercase font-bold mb-1">Company name</label>
                <input
                  id="lastCompany"
                  type="text"
                  placeholder="Company name"
                  value={lastCompany}
                  onChange={(e) => setLastCompany(e.target.value)}
                  className="w-full bg-[#060a23] border border-white/5 p-2 rounded-lg text-xs text-white"
                />
              </div>

              <div>
                <label htmlFor="lastRole" className="block text-[9px] text-zinc-455 uppercase font-bold mb-1">Role</label>
                <input
                  id="lastRole"
                  type="text"
                  placeholder="Your role/position"
                  value={lastRole}
                  onChange={(e) => setLastRole(e.target.value)}
                  className="w-full bg-[#060a23] border border-white/5 p-2 rounded-lg text-xs text-white"
                />
              </div>

              <div>
                <label htmlFor="lastPeriod" className="block text-[9px] text-zinc-455 uppercase font-bold mb-1">Period of employment</label>
                <input
                  id="lastPeriod"
                  type="text"
                  placeholder="e.g., March 2023 - Jan 2025"
                  value={lastPeriod}
                  onChange={(e) => setLastPeriod(e.target.value)}
                  className="w-full bg-[#060a23] border border-white/5 p-2 rounded-lg text-xs text-white"
                />
              </div>
            </div>

            {/* Descrição em Campo Livre */}
            <div className="space-y-1.5 md:col-span-2">
              <label htmlFor="expDesc" className="block text-[10px] text-zinc-400 uppercase font-black tracking-wider">
                Detailed Description of your Work Experience & Job Duties
              </label>
              <textarea
                id="expDesc"
                rows={4}
                placeholder="Explain in detail your previous duties, industrial projects managed, or general services provided..."
                value={experienceDescription}
                onChange={(e) => setExperienceDescription(e.target.value)}
                className="w-full bg-[#0b112d] border border-white/5 focus:border-cyan-400 p-3 rounded-xl text-xs text-white placeholder-zinc-650 outline-none leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* SEÇÃO 5: Certificações */}
        <div className="bg-[#060a23]/60 border border-white/5 backdrop-blur-md rounded-3xl p-6 lg:p-8 space-y-6 shadow-xl">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <div className="w-8 h-8 rounded-lg bg-cyan-950/50 border border-cyan-500/25 flex items-center justify-center text-cyan-200">
              <Award size={16} />
            </div>
            <h3 className="font-display font-black text-white uppercase text-sm tracking-wide">5. Technical Qualifications & Certifications</h3>
          </div>

          <div className="space-y-4">
            <span className="block text-[10px] text-zinc-400 uppercase font-black tracking-wider">☑️ Select your professional certifications and licensing credentials</span>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {listCertsOptions.map(cert => {
                const isChecked = certifications.includes(cert);
                return (
                  <button
                    key={cert}
                    type="button"
                    onClick={() => handleCertificationToggle(cert)}
                    className={`flex items-center gap-2 p-3 text-left rounded-xl border text-xs font-bold transition-all ${
                      isChecked 
                        ? 'bg-cyan-950/30 border-cyan-500/50 text-cyan-200' 
                        : 'bg-[#0b112d] border-white/5 text-zinc-500 hover:border-white/10'
                    }`}
                  >
                    <span>🏗️</span>
                    <span className="flex-1 truncate">{cert}</span>
                    <span className={`w-4.5 h-4.5 rounded flex items-center justify-center ${isChecked ? 'bg-[#22d3ee] text-slate-950' : 'bg-white/5'}`}>
                      {isChecked && <Check size={11} className="stroke-[3]" />}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Custom certificate addition */}
            <div className="p-3 bg-[#0b112d] border border-white/5 rounded-2xl flex gap-2 items-center">
              <input
                type="text"
                placeholder="Other certification..."
                value={customCertificationText}
                onChange={(e) => setCustomCertificationText(e.target.value)}
                className="flex-1 bg-[#060a23] border border-white/5 p-2 rounded-xl text-xs text-white"
              />
              <button
                type="button"
                onClick={addCustomCertification}
                className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-black text-[10px] tracking-wider uppercase rounded-xl"
              >
                Add
              </button>
            </div>

            {/* Upload of Certificates */}
            <div className="p-5 bg-[#0b112d]/50 border border-white/5 rounded-2xl space-y-3">
              <span className="block text-[10px] text-zinc-400 uppercase font-black tracking-wider font-mono">Upload Certification Documents (PDF / Image)</span>
              <p className="text-[10px] text-zinc-450 leading-relaxed uppercase font-bold">Attach photos or scanned versions of your safety certifications, industrial tickets, or qualification diplomas for review.</p>
              
              <div className="flex flex-wrap gap-3">
                {certificationFiles.map((url, i) => (
                  <div key={i} className="relative p-2 bg-[#060a23] border border-white/10 rounded-xl flex items-center gap-2 text-xs">
                    <FileText size={14} className="text-cyan-400" />
                    <span className="text-[10px] text-zinc-300 font-mono">Certificate #{i+1}</span>
                    <button
                      type="button"
                      onClick={() => setCertificationFiles(prev => prev.filter((_, idx) => idx !== i))}
                      className="p-1 text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded-md"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}

                <label className="px-4 py-2 bg-white/5 border border-white/10 hover:border-cyan-400 text-white hover:text-cyan-200 rounded-xl text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5 cursor-pointer">
                  <Upload size={12} />
                  Attach File
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => handleMediaUpload(e, 'cert')}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* SEÇÃO 6: Idiomas */}
        <div className="bg-[#060a23]/60 border border-white/5 backdrop-blur-md rounded-3xl p-6 lg:p-8 space-y-6 shadow-xl">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <div className="w-8 h-8 rounded-lg bg-cyan-950/50 border border-cyan-500/25 flex items-center justify-center text-cyan-200">
              <Laptop size={16} />
            </div>
            <h3 className="font-display font-black text-white uppercase text-sm tracking-wide">6. Languages & Communication</h3>
          </div>

          <div className="space-y-4">
            <span className="block text-[10px] text-zinc-400 uppercase font-black tracking-wider">Select the languages you speak and your proficiency level for each</span>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {baseLanguages.map(l => {
                const isSelected = selectedLanguageKeys.includes(l.key);
                return (
                  <div key={l.key} className="p-4 bg-[#0b112d]/50 border border-white/5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <button
                      type="button"
                      onClick={() => handleLanguageToggle(l.key)}
                      className="flex items-center gap-3 text-left font-bold text-sm text-white"
                    >
                      <span className="text-xl">
                        {l.key === 'portuguese' ? '🇧🇷' : l.key === 'english' ? '🇺🇸' : l.key === 'spanish' ? '🇪🇸' : l.key === 'dutch' ? '🇳🇱' : '🇩🇪'}
                      </span>
                      <span>{l.name}</span>
                      <span className={`w-4.5 h-4.5 border rounded flex items-center justify-center ${isSelected ? 'bg-cyan-500 text-slate-950' : 'border-white/10'}`}>
                        {isSelected && <Check size={11} className="stroke-[3]" />}
                      </span>
                    </button>

                    {isSelected && (
                      <select
                        value={languageLevels[l.key] || 'Basic'}
                        onChange={(e) => handleLanguageLevelChange(l.key, e.target.value)}
                        className="bg-[#060a23] border border-white/5 p-1.5 rounded-lg text-xs font-semibold text-cyan-300"
                      >
                        {listLanguageLevels.map(lvl => (
                          <option key={lvl} value={lvl}>{lvl}</option>
                        ))}
                      </select>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* SEÇÃO 7: Mídia Profissional */}
        <div className="bg-[#060a23]/60 border border-white/5 backdrop-blur-md rounded-3xl p-6 lg:p-8 space-y-6 shadow-xl">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <div className="w-8 h-8 rounded-lg bg-cyan-950/50 border border-cyan-500/25 flex items-center justify-center text-cyan-200">
              <Camera size={16} />
            </div>
            <h3 className="font-display font-black text-white uppercase text-sm tracking-wide">7. Professional Media & Presentation</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Foto de Perfil */}
            <div className="p-4 bg-[#0b112d]/50 border border-white/5 rounded-2xl space-y-4">
              <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-cyan-400 block">📸 Profile Passport Photo</span>
              <p className="text-[10px] text-zinc-450 uppercase tracking-widest leading-relaxed">A professional headshot photo (face and shoulders, well-lit).</p>
              
              {avatarPhoto ? (
                <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border border-cyan-400/30">
                  <img referrerPolicy="no-referrer" src={avatarPhoto} alt="Perfil" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setAvatarPhoto('')}
                    className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity text-red-400 text-xs font-bold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <label className="border-2 border-dashed border-white/10 hover:border-cyan-400/50 hover:bg-cyan-500/5 py-6 rounded-xl flex flex-col items-center justify-center cursor-pointer text-zinc-500 hover:text-cyan-300 text-xs font-bold font-mono">
                    <Upload size={20} className="mb-2" />
                    UPLOAD HEADSHOT PHOTO
                    <input type="file" accept="image/*" onChange={(e) => handleMediaUpload(e, 'avatar')} className="hidden" />
                  </label>
                  <button
                    type="button"
                    onClick={() => startCamera('avatar')}
                    className="py-2.5 bg-white/5 border border-white/5 hover:border-cyan-400 text-xs font-bold text-white uppercase tracking-wider rounded-xl cursor-pointer"
                  >
                    Use WebCam
                  </button>
                </div>
              )}
            </div>

            {/* Foto Corpo Inteiro */}
            <div className="p-4 bg-[#0b112d]/50 border border-white/5 rounded-2xl space-y-4">
              <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-cyan-400 block">📸 Full-Body Photo</span>
              <p className="text-[10px] text-zinc-450 uppercase tracking-widest leading-relaxed">A clear full-body photo, ideally wearing work gear or professional attire.</p>
              
              {fullBodyPhoto ? (
                <div className="relative max-w-sm mx-auto aspect-[3/4] h-40 rounded-xl overflow-hidden border border-cyan-400/30">
                  <img referrerPolicy="no-referrer" src={fullBodyPhoto} alt="Corpo Inteiro" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setFullBodyPhoto('')}
                    className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity text-red-300 text-xs font-bold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <label className="border-2 border-dashed border-white/10 hover:border-cyan-400/50 hover:bg-cyan-500/5 py-6 rounded-xl flex flex-col items-center justify-center cursor-pointer text-zinc-500 hover:text-cyan-300 text-xs font-bold font-mono">
                    <Upload size={20} className="mb-2" />
                    UPLOAD FULL BODY PHOTO
                    <input type="file" accept="image/*" onChange={(e) => handleMediaUpload(e, 'fullBody')} className="hidden" />
                  </label>
                  <button
                    type="button"
                    onClick={() => startCamera('fullBody')}
                    className="py-2.5 bg-white/5 border border-white/5 hover:border-cyan-400 text-xs font-bold text-white uppercase tracking-wider rounded-xl cursor-pointer"
                  >
                    Use WebCam
                  </button>
                </div>
              )}
            </div>

            {/* Vídeo Apresentação (Pitch) */}
            <div className="p-4 bg-[#0b112d]/50 border border-white/5 rounded-2xl space-y-4 md:col-span-2">
              <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-cyan-400 block">🎥 Video Presentation (30 seconds recommended)</span>
              
              {/* Suggested elevator pitch instruction box */}
              <div className="p-4 bg-cyan-950/20 border border-cyan-500/20 rounded-xl leading-relaxed text-xs">
                <span className="font-extrabold text-[#22d3ee] block mb-1">💡 Recording Suggestion:</span>
                <p className="text-zinc-300 font-medium italic">
                  “Hello, my name is {fullName || '[Your Name]'}, I am {age || '[Your Age]'} years old, from {country || '[Your Country]'}, and I have experience in {profession || '[Your Profession]'}. I am available for international opportunities and immediate relocation.”
                </p>
              </div>

              {presentationVideo ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                    <CheckCircle size={14} /> Presentation Video Uploaded
                  </div>
                  <video src={presentationVideo} controls className="w-full max-w-md mx-auto aspect-video rounded-xl bg-black object-cover" />
                  <button
                    type="button"
                    onClick={() => setPresentationVideo('')}
                    className="px-4 py-2 bg-slate-900 border border-white/5 text-zinc-300 hover:text-white rounded-xl text-xs font-bold"
                  >
                    Replace Video
                  </button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-white/10 hover:border-cyan-400/50 hover:bg-cyan-500/5 py-10 rounded-xl flex flex-col items-center justify-center cursor-pointer text-zinc-500 hover:text-cyan-300 text-xs font-bold font-mono">
                  <Video size={30} className="mb-2 text-zinc-400" />
                  CLICK TO UPLOAD YOUR PRESENTATION VIDEO
                  <input type="file" accept="video/*" onChange={(e) => handleMediaUpload(e, 'presentation')} className="hidden" />
                </label>
              )}
            </div>

            {/* Vídeo Verificação de ID / Documento */}
            <div className="p-4 bg-[#0b112d]/50 border border-white/5 rounded-2xl space-y-4 md:col-span-2">
              <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-cyan-400 block">🎥 Identity Verification Video (ID & Face Check)</span>
              <p className="text-[10px] text-zinc-450 uppercase tracking-widest leading-relaxed">Show your passport or ID card next to your face for 5 seconds to verify identity.</p>

              {documentsVideo ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                    <CheckCircle size={14} /> Identity Verification Video Uploaded
                  </div>
                  <video src={documentsVideo} controls className="w-full max-w-md mx-auto aspect-video rounded-xl bg-black object-cover" />
                  <button
                    type="button"
                    onClick={() => setDocumentsVideo('')}
                    className="px-4 py-2 bg-slate-900 border border-white/5 text-zinc-300 hover:text-white rounded-xl text-xs font-bold"
                  >
                    Replace Video
                  </button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-white/10 hover:border-cyan-400/50 hover:bg-cyan-500/5 py-10 rounded-xl flex flex-col items-center justify-center cursor-pointer text-zinc-500 hover:text-cyan-300 text-xs font-bold font-mono">
                  <Video size={30} className="mb-2 text-zinc-400" />
                  CLICK TO UPLOAD ID VERIFICATION VIDEO
                  <input type="file" accept="video/*" onChange={(e) => handleMediaUpload(e, 'docVerify')} className="hidden" />
                </label>
              )}
            </div>

            {/* Foto do Currículo */}
            <div className="p-4 bg-[#0b112d]/50 border border-white/5 rounded-2xl space-y-4 md:col-span-2">
              <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-cyan-400 block">📄 Resume / CV Scan Photo</span>
              
              {resumePhoto ? (
                <div className="relative max-w-sm mx-auto aspect-[3/4] h-48 border border-cyan-400/30 rounded-xl overflow-hidden shadow-md">
                  <img referrerPolicy="no-referrer" src={resumePhoto} alt="Currículo" className="w-full h-full object-contain" />
                  <button
                    type="button"
                    onClick={() => setResumePhoto('')}
                    className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity text-red-400 text-xs font-bold"
                  >
                    Remove Resume
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <label className="border-2 border-dashed border-white/10 hover:border-cyan-400/50 hover:bg-cyan-500/5 py-8 rounded-xl flex flex-col items-center justify-center cursor-pointer text-zinc-500 hover:text-cyan-300 text-xs font-bold font-mono text-center">
                    <Upload size={24} className="mb-2" />
                    Upload from Computer/Phone
                    <input type="file" accept="image/*" onChange={(e) => handleMediaUpload(e, 'resume')} className="hidden" />
                  </label>
                  <button
                    type="button"
                    onClick={() => startCamera('resume')}
                    className="border-2 border-dashed border-white/10 hover:border-cyan-400/50 hover:bg-cyan-500/5 py-8 rounded-xl flex flex-col items-center justify-center cursor-pointer text-zinc-500 hover:text-cyan-300 text-xs font-bold font-mono bg-transparent"
                  >
                    <Camera size={24} className="mb-2 text-zinc-400" />
                    Capture with Camera
                  </button>
                </div>
              )}
            </div>

            {/* Fotos de Portfólio de Obras */}
            <div className="p-4 bg-[#0b112d]/50 border border-white/5 rounded-2xl space-y-4 md:col-span-2">
              <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-cyan-400 block">🏗️ Worksite Showcase Portfolio Photos</span>
              <p className="text-[10px] text-zinc-450 uppercase tracking-widest leading-relaxed">Upload real pictures of your previous worksites, machinery operated, or completed projects.</p>

              {photos && photos.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {photos.map((pUrl, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-white/10 group shadow-md">
                      <img referrerPolicy="no-referrer" src={pUrl} alt={`Portfolio ${i}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setPhotos(prev => prev.filter((_, idx) => idx !== i))}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all text-red-400 text-xs font-bold animate-fade-in"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <label className="border-2 border-dashed border-white/10 hover:border-cyan-400/50 hover:bg-cyan-500/5 py-8 rounded-xl flex flex-col items-center justify-center cursor-pointer text-zinc-500 hover:text-cyan-300 text-xs font-bold font-mono text-center">
                <Upload size={24} className="mb-2" />
                Upload Portfolio Photos (Multiple Allowed)
                <input type="file" accept="image/*" multiple onChange={(e) => handleMediaUpload(e, 'photos')} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        {/* SEÇÃO 8: Visual Card Preview */}
        <div className="bg-[#0b112d]/70 border border-cyan-500/20 rounded-3xl p-6 lg:p-8 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-cyan-400">
            <Sparkles size={16} />
            <h4 className="font-display font-black uppercase text-xs tracking-wider">8. Public View of Your TCW Card</h4>
          </div>
          <p className="text-[10px] text-zinc-450 leading-relaxed uppercase font-bold">See exactly how your professional seal, key information, and talent ranking badge will look to searching employers.</p>
          
          <div className="bg-[#060a23] border border-white/5 rounded-2xl p-5 max-w-sm mx-auto shadow-inner border-t-cyan-500/30">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl bg-cyan-950/35 border border-cyan-500/30 overflow-hidden shrink-0 flex items-center justify-center">
                {avatarPhoto ? (
                  <img referrerPolicy="no-referrer" src={avatarPhoto} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <User size={24} className="text-zinc-650" />
                )}
              </div>
              
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="font-display font-bold text-white text-sm truncate block">{fullName || 'Lucas de Andrade'}</span>
                  
                  {/* Badge */}
                  <span className={`text-[8px] font-mono font-black uppercase px-2 py-0.5 rounded-full ${
                    currentRank === 'Premium' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                    currentRank === 'Verified' ? 'bg-amber-400/10 text-amber-400 border border-amber-400/20' :
                    'bg-zinc-800 text-zinc-400'
                  }`}>
                    {currentRank === 'Premium' ? '🥇 Premium' : currentRank === 'Verified' ? '🥈 Verified' : '🥉 Available'}
                  </span>
                </div>

                <div className="text-[11px] font-mono text-zinc-400 font-bold flex items-center gap-1">
                  <MapPin size={11} className="text-cyan-400" />
                  <span>{country || 'Brazil'}</span>
                  <span>•</span>
                  <span>{age} years old</span>
                </div>

                <div className="text-[11px] font-display font-medium text-cyan-200">
                  ⚡ {profession || 'Event Production'}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 grid grid-cols-2 gap-2 text-[10px] font-mono font-bold text-zinc-450">
              <div>
                <span className="text-zinc-550 block text-[8px] uppercase tracking-wider">Availability</span>
                <span className="text-white block mt-0.5">{travelAvailability}</span>
              </div>
              <div>
                <span className="text-zinc-550 block text-[8px] uppercase tracking-wider">Languages</span>
                <span className="text-white block mt-0.5 truncate">
                  {selectedLanguageKeys.length > 0 
                    ? selectedLanguageKeys.map(k => baseLanguages.find(bl => bl.key === k)?.name || k).join(' / ') 
                    : 'Portuguese'}
                </span>
              </div>
              <div>
                <span className="text-zinc-550 block text-[8px] uppercase tracking-wider">Experience</span>
                <span className="text-white block mt-0.5">{experienceYears}</span>
              </div>
              <div>
                <span className="text-zinc-550 block text-[8px] uppercase tracking-wider">Target countries</span>
                <span className="text-white block mt-0.5 truncate">
                  {countriesOfInterest.length > 0 ? countriesOfInterest.join(', ') : 'Europe'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SEÇÃO 9: Termos de Segurança */}
        <div className="bg-[#060a23]/60 border border-white/5 backdrop-blur-md rounded-3xl p-6 lg:p-8 space-y-5 shadow-xl">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <div className="w-8 h-8 rounded-lg bg-cyan-950/50 border border-cyan-500/25 flex items-center justify-center text-cyan-200">
              <Shield size={16} />
            </div>
            <h3 className="font-display font-black text-white uppercase text-sm tracking-wide">9. Terms & Safety Consent</h3>
          </div>

          <div className="space-y-4">
            {/* Termo 1 */}
            <label className="flex items-start gap-3 p-4 bg-[#0b112d]/50 border border-white/5 rounded-2xl cursor-pointer hover:border-cyan-400/20 transition-all">
              <input
                type="checkbox"
                required
                className="mt-1 w-4.5 h-4.5 rounded text-cyan-455 focus:ring-0"
                checked={termsShare}
                onChange={(e) => setTermsShare(e.target.checked)}
              />
              <span className="text-xs text-zinc-300 font-medium leading-relaxed">
                ☑️ I expressly authorize TCW Group to share my professional profile, work photos, and media credentials with registered partner companies and international employers.
              </span>
            </label>

            {/* Termo 2 */}
            <label className="flex items-start gap-3 p-4 bg-[#0b112d]/50 border border-white/5 rounded-2xl cursor-pointer hover:border-cyan-400/20 transition-all">
              <input
                type="checkbox"
                required
                className="mt-1 w-4.5 h-4.5 rounded text-cyan-455 focus:ring-0"
                checked={termsTruth}
                onChange={(e) => setTermsTruth(e.target.checked)}
              />
              <span className="text-xs text-zinc-300 font-medium leading-relaxed">
                ☑️ I declare under penalty of law that all details, CV credentials, and documents provided in this form are accurate and up-to-date.
              </span>
            </label>

            {/* Termo 3 */}
            <label className="flex items-start gap-3 p-4 bg-[#0b112d]/50 border border-white/5 rounded-2xl cursor-pointer hover:border-cyan-400/20 transition-all">
              <input
                type="checkbox"
                required
                className="mt-1 w-4.5 h-4.5 rounded text-cyan-455 focus:ring-0"
                checked={termsPrivacy}
                onChange={(e) => setTermsPrivacy(e.target.checked)}
              />
              <span className="text-xs text-zinc-300 font-medium leading-relaxed">
                ☑️ I have read and agree to the Terms of Use, cookie settings, and the Digital Governance Policies of the TCW Group.
              </span>
            </label>
          </div>
        </div>

        {/* Action Controls */}
        <div className="p-4 sm:p-6 bg-[#060a23]/60 border border-white/5 backdrop-blur-md rounded-3xl flex flex-col sm:flex-row justify-between items-center gap-4 shadow-2xl">
          <p className="text-[10px] text-zinc-500 font-mono text-center sm:text-left">
            Estimated Talent Ranking: <span className="text-cyan-400 font-black">{currentRank === 'Premium' ? '🥇 Premium' : currentRank === 'Verified' ? '🥈 Verified' : '🥉 Available'}</span>
          </p>
          <div className="w-full sm:w-auto flex gap-3">
            <button
              type="button"
              onClick={fetchProfile}
              className="flex-1 sm:flex-initial px-5 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold transition-all border border-white/5 cursor-pointer uppercase tracking-wider"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 sm:flex-initial px-8 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-cyan-400/10"
            >
              {saving ? 'Saving information...' : 'Save Profile Information'}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
