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
    if (!res.ok) throw new Error(result.error || 'Erro ao registrar.');
    return result;
  },

  async login(data: any): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'E-mail ou senha inválidos.');
    return result;
  },

  // --- Profile ---
  async getProfile(userId: string): Promise<WorkerProfile> {
    const res = await fetch(`${API_BASE}/profile/${userId}`);
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Erro ao carregar perfil.');
    return result;
  },

  async updateProfile(userId: string, data: Partial<WorkerProfile>): Promise<{ profile: WorkerProfile; message: string }> {
    const res = await fetch(`${API_BASE}/profile/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Erro ao atualizar perfil.');
    return result;
  },

  // --- Admin ---
  async getAdminProfiles(): Promise<(WorkerProfile & { email: string })[]> {
    const res = await fetch(`${API_BASE}/admin/profiles`);
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Erro ao carregar perfis de trabalhadores.');
    return result;
  },

  // --- Contracts ---
  async getContracts(userId: string): Promise<SeasonalContract[]> {
    const res = await fetch(`${API_BASE}/contracts/${userId}`);
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Erro ao carregar contratos.');
    return result;
  },

  async createContract(data: any): Promise<{ contract: SeasonalContract; message: string }> {
    const res = await fetch(`${API_BASE}/contracts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Erro ao emitir contrato.');
    return result;
  },

  async signContract(contractId: string, status: 'Assinado' | 'Cancelado'): Promise<{ contract: SeasonalContract; message: string }> {
    const res = await fetch(`${API_BASE}/contracts/${contractId}/sign`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Erro ao processar assinatura.');
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
