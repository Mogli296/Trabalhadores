import { User, WorkerProfile, SeasonalContract } from '../types';

const API_BASE = '/api';

interface AuthResponse {
  user: User;
  message: string;
}

export const api = {
  // --- Auth ---
  async register(data: any): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Error completing registration.');
    return result;
  },

  async login(data: any): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Invalid email or password.');
    return result;
  },

  // --- Profile ---
  async getProfile(userId: string): Promise<WorkerProfile> {
    const res = await fetch(`${API_BASE}/profile/${userId}`);
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Error loading profile.');
    return result;
  },

  async updateProfile(userId: string, data: Partial<WorkerProfile>): Promise<{ profile: WorkerProfile; message: string }> {
    const res = await fetch(`${API_BASE}/profile/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Error updating profile.');
    return result;
  },

  // --- Admin ---
  async getAdminProfiles(): Promise<(WorkerProfile & { email: string })[]> {
    const res = await fetch(`${API_BASE}/admin/profiles`);
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Error loading worker profiles.');
    return result;
  },

  // --- Public Worker Catalog ---
  async getPublicProfiles(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/public/profiles`);
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Error loading public catalog.');
    return result;
  },

  // --- Real Shared Media Gallery ---
  async getGallery(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/gallery`);
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Error loading gallery.');
    return result;
  },

  async addToGallery(data: { workerName?: string; profession?: string; type: 'image' | 'video'; url: string; caption?: string }): Promise<any> {
    const res = await fetch(`${API_BASE}/gallery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Error loading physical upload.');
    return result;
  },

  // --- Contracts ---
  async getContracts(userId: string): Promise<SeasonalContract[]> {
    const res = await fetch(`${API_BASE}/contracts/${userId}`);
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Error retrieving contracts.');
    return result;
  },

  async createContract(data: any): Promise<{ contract: SeasonalContract; message: string }> {
    const res = await fetch(`${API_BASE}/contracts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Error issuing seasonal contract.');
    return result;
  },

  async signContract(contractId: string, status: 'Signed' | 'Cancelled'): Promise<{ contract: SeasonalContract; message: string }> {
    const res = await fetch(`${API_BASE}/contracts/${contractId}/sign`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Error processing signature.');
    return result;
  },

  // --- Media Upload Helper ---
  async uploadMedia(filename: string, fileData: string): Promise<{ url: string; warning?: string }> {
    const res = await fetch(`${API_BASE}/media/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename, fileData }),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Erro ao fazer upload da mídia.');
    return result;
  }
};
