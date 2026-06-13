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
  age: number;
  gender: string;
  country: string;
  profession: string;
  licenseType: string; // e.g. "Nenhuma", "Categoria B", "Categoria D", etc.
  englishLevel: string; // e.g. "Básico", "Intermediário", "Avançado", "Fluente", "Não fala"
  certificateType: string;
  certificateValidity: string;
  hasPassport: 'Sim' | 'Não';
  visaType: string;
  visaValidity: string;
  drivesMachinery: 'Sim' | 'Não';
  phone: string;
  photos: string[]; // List of base64 or URL strings
  resumePhoto?: string; // Base64 or URL to photo of the resume
  videos: {
    presentation?: string; // presentation video base64/URL
    documents?: string; // documents verification video base64/URL
  };
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
  status: 'Pendente' | 'Assinado' | 'Cancelado';
  terms: string;
  createdAt: string;
}
