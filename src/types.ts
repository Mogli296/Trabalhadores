export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'worker' | 'admin';
}

export interface WorkerProfile {
  id: string;
  userId: string;
  fullName: string;
  birthDate?: string;
  age: number;
  gender: string;
  nationality?: string;
  country: string; // Current location / residence country
  city?: string;
  linkedin?: string;
  email?: string;
  
  // Documentation
  hasPassport: 'Yes' | 'No';
  passportNumber?: string;
  passportValidity?: string;
  rgNumber?: string;
  cpfNumber?: string;
  licenseType: string;
  licenseCountry?: string;

  // Availability
  countriesOfInterest?: string[]; // e.g. ["Holanda", "Alemanha", "Bélgica", "Espanha", "Estados Unidos", "Canadá", "Austrália"]
  travelAvailability?: string; // "Immediate" | "30" | "60" | "90"
  hasVisa?: 'Yes' | 'No';
  visaCountry?: string;
  visaType?: string;
  visaValidity?: string;

  // Professional Experience
  profession: string;
  experienceYears?: string; // "Menos de 1 ano" | "1 a 3 anos" | "3 a 5 anos" | "Mais de 5 anos"
  lastCompany?: string;
  lastRole?: string;
  lastPeriod?: string;
  experienceDescription?: string;

  // Certifications
  certifications?: string[]; // ["NR-10", "NR-35", "Operador de Empilhadeira", "Forklift License", "Trabalho em Altura", "Primeiros Socorros", "Brigadista", "Soldagem", "Carteira de Motorista Profissional", "Outros"]
  certificationFiles?: string[]; // certificate attachment urls
  certificateType: string; // legacy text field supporting existing structures
  certificateValidity: string;

  // Languages
  languages?: { language: string; level: string }[]; // e.g. [{language: "Inglês", level: "Intermediário"}]

  // Professional Media
  avatarPhoto?: string; // Profile photo
  fullBodyPhoto?: string; // Full body photo
  resumePhoto?: string; // CV page photo
  photos: string[]; // Showcase photos portfolio
  videos: {
    presentation?: string; // pitch video url
    documents?: string; // id verification holding photo or video url
  };

  // Security terms & consents
  termsShare?: boolean;
  termsTruth?: boolean;
  termsPrivacy?: boolean;

  // Computed / System Fields
  ranking?: 'Premium' | 'Verified' | 'Available';
  phone: string;
  drivesMachinery: 'Yes' | 'No';
  createdAt: string;
  updatedAt: string;
}

export interface SeasonalContract {
  id: string;
  workerId: string;
  workerName: string;
  destinationCountry: string;
  durationMonths: number;
  role: string;
  salary: string;
  startDate: string;
  endDate: string;
  status: 'Pending' | 'Signed' | 'Cancelled';
  terms: string;
  createdAt: string;
}
