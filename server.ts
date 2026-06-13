import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

// Database State type
interface DBState {
  users: any[];
  profiles: any[];
  contracts: any[];
}

const DB_FILE = path.join(process.cwd(), 'db_store.json');

// Initialize database
function loadDB(): DBState {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (error) {
    console.error('Error loading database, resetting to empty', error);
  }
  
  // Create default state with a bootstrapped admin matching the metadata and a test worker
  const defaultState: DBState = {
    users: [
      {
        id: 'user_admin_1',
        fullName: 'Administrador Work',
        email: 'speakai.agency@gmail.com',
        phone: '11999999999',
        password: 'admin', // Simple default credentials for local testing
        role: 'admin'
      },
      {
        id: 'user_worker_1',
        fullName: 'Carlos Silva',
        email: 'trabalhador@work.com',
        phone: '11988888888',
        password: 'pass',
        role: 'worker'
      }
    ],
    profiles: [
      {
        id: 'profile_worker_1',
        userId: 'user_worker_1',
        fullName: 'Carlos Silva',
        age: 28,
        gender: 'Masculino',
        country: 'Brasil',
        profession: 'Carpinteiro Sênior',
        licenseType: 'Categoria B',
        englishLevel: 'Intermediário',
        certificateType: 'Certificado de Segurança em Obra (OSHA)',
        certificateValidity: '2028-12-31',
        hasPassport: 'Sim',
        visaType: 'Visto de Trabalho Temporário H-2B',
        visaValidity: '2026-12-31',
        drivesMachinery: 'Sim',
        phone: '11988888888',
        photos: [],
        resumePhoto: '',
        videos: {
          presentation: '',
          documents: ''
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    contracts: [
      {
        id: 'contract_1',
        workerId: 'user_worker_1',
        workerName: 'Carlos Silva',
        destinationCountry: 'Estados Unidos',
        durationMonths: 3,
        role: 'Auxiliar de Carpintaria de Temporada',
        salary: '$3,200.00 / Mês',
        startDate: '2026-07-01',
        endDate: '2026-10-01',
        status: 'Pendente',
        terms: 'Contrato temporário para o setor de construção civil sazonal em Boston, cobrindo acomodação, passagens de ida e volta e assistência médica básica.',
        createdAt: new Date().toISOString()
      }
    ]
  };
  
  saveDB(defaultState);
  return defaultState;
}

function saveDB(state: DBState) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving database', error);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;
  
  // Increase packet size limit for base64 photo/video uploads
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));
  
  // Database instance
  let db = loadDB();

  // Create folder for static uploads if needed, just in case
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // --- API Authentication Routes ---
  
  // Register worker
  app.post('/api/auth/register', (req, res) => {
    const { fullName, email, password, phone } = req.body;
    
    if (!fullName || !email || !password || !phone) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios para o cadastro.' });
    }
    
    const emailLower = email.toLowerCase().trim();
    
    // Check if user exists
    const exists = db.users.find(u => u.email.toLowerCase() === emailLower);
    if (exists) {
      return res.status(400).json({ error: 'Este e-mail já está cadastrado na plataforma.' });
    }
    
    const userId = 'user_' + Date.now();
    const newUser = {
      id: userId,
      fullName: fullName.trim(),
      email: emailLower,
      phone: phone.trim(),
      password, // Simple credentials checking
      role: 'worker' as const
    };
    
    // Create an empty worker profile for them
    const profileId = 'profile_' + Date.now();
    const newProfile = {
      id: profileId,
      userId: userId,
      fullName: fullName.trim(),
      age: 18,
      gender: '',
      country: '',
      profession: '',
      licenseType: 'Nenhuma',
      englishLevel: 'Não fala',
      certificateType: '',
      certificateValidity: '',
      hasPassport: 'Não' as const,
      visaType: '',
      visaValidity: '',
      drivesMachinery: 'Não' as const,
      phone: phone.trim(),
      photos: [],
      resumePhoto: '',
      videos: {
        presentation: '',
        documents: ''
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    db.users.push(newUser);
    db.profiles.push(newProfile);
    saveDB(db);
    
    res.status(201).json({
      user: {
        id: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role
      },
      message: 'Cadastro efetuado com sucesso!'
    });
  });

  // Login
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
    }
    
    const emailLower = email.toLowerCase().trim();
    const user = db.users.find(u => u.email.toLowerCase() === emailLower && u.password === password);
    
    if (!user) {
      return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
    }
    
    res.json({
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role
      },
      message: 'Login realizado com sucesso!'
    });
  });

  // Fetch logged-in user profile & details
  app.get('/api/profile/:userId', (req, res) => {
    const { userId } = req.params;
    const profile = db.profiles.find(p => p.userId === userId);
    
    if (!profile) {
      return res.status(404).json({ error: 'Perfil não encontrado.' });
    }
    
    res.json(profile);
  });

  // Update worker profile
  app.put('/api/profile/:userId', (req, res) => {
    const { userId } = req.params;
    const updateData = req.body;
    
    const index = db.profiles.findIndex(p => p.userId === userId);
    if (index === -1) {
      return res.status(404).json({ error: 'Perfil não encontrado.' });
    }
    
    const existingProfile = db.profiles[index];
    
    // Explicitly validate required phone mapping
    if (updateData.phone === undefined || updateData.phone === '') {
      return res.status(400).json({ error: 'O número de celular é obrigatório.' });
    }

    db.profiles[index] = {
      ...existingProfile,
      ...updateData,
      // Keep immutable fields untouched
      id: existingProfile.id,
      userId: existingProfile.userId,
      updatedAt: new Date().toISOString()
    };
    
    // Also update phone/name on user account if changed
    const userIndex = db.users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      db.users[userIndex].fullName = db.profiles[index].fullName;
      db.users[userIndex].phone = db.profiles[index].phone;
    }
    
    saveDB(db);
    res.json({ profile: db.profiles[index], message: 'Perfil atualizado com sucesso!' });
  });

  // Upload pictures or videos as local Base64 media elements
  app.post('/api/media/upload', (req, res) => {
    const { filename, fileData, type } = req.body; // fileData in base64
    
    if (!fileData) {
      return res.status(400).json({ error: 'Nenhum dado de arquivo recebido.' });
    }

    try {
      // Determine file extension and write to the local public folder for immediate resolution
      const match = fileData.match(/^data:([^;]+);base64,(.+)$/);
      if (!match) {
        // If it's already an absolute URL or invalid prefix, return it back
        return res.json({ url: fileData });
      }

      const mimeType = match[1];
      const base64Content = match[2];
      const extension = mimeType.split('/')[1] || 'bin';
      
      const safeFilename = `uploaded_${Date.now()}_${Math.floor(Math.random() * 1000)}.${extension}`;
      const filePath = path.join(uploadDir, safeFilename);
      
      fs.writeFileSync(filePath, Buffer.from(base64Content, 'base64'));
      const relativeUrl = `/uploads/${safeFilename}`;
      
      res.json({ url: relativeUrl, type: mimeType });
    } catch (error) {
      console.error('Error saving uploaded file locally', error);
      // Fallback is to send a mock URL or use the base64 content itself
      res.json({ url: fileData, warning: 'Recurso guardado diretamente no banco por falha de escrita física.' });
    }
  });

  // Admin routes: List all workers & profiles
  app.get('/api/admin/profiles', (req, res) => {
    // Return all profiles along with email reference
    const profilesWithEmail = db.profiles.map(p => {
      const u = db.users.find(user => user.id === p.userId);
      return {
        ...p,
        email: u ? u.email : ''
      };
    });
    res.json(profilesWithEmail);
  });

  // Admin and Worker contracts
  app.get('/api/contracts/:userId', (req, res) => {
    const { userId } = req.params;
    const user = db.users.find(u => u.id === userId);
    
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    
    if (user.role === 'admin') {
      res.json(db.contracts);
    } else {
      const workerContracts = db.contracts.filter(c => c.workerId === userId);
      res.json(workerContracts);
    }
  });

  // Issue contract (Admin only)
  app.post('/api/contracts', (req, res) => {
    const { workerId, destinationCountry, durationMonths, role, salary, startDate, endDate, terms } = req.body;
    
    if (!workerId || !destinationCountry || !role || !salary || !startDate || !endDate) {
      return res.status(400).json({ error: 'Todos os campos do contrato são obrigatórios.' });
    }
    
    const workerUser = db.users.find(u => u.id === workerId);
    if (!workerUser) {
      return res.status(404).json({ error: 'Trabalhador não encontrado.' });
    }
    
    const contractId = 'contract_' + Date.now();
    const newContract = {
      id: contractId,
      workerId,
      workerName: workerUser.fullName,
      destinationCountry,
      durationMonths: Number(durationMonths) || 1,
      role,
      salary,
      startDate,
      endDate,
      status: 'Pendente' as const,
      terms: terms || 'Contrato padrão de temporada sob as regras de trabalho internacional.',
      createdAt: new Date().toISOString()
    };
    
    db.contracts.push(newContract);
    saveDB(db);
    
    res.status(201).json({ contract: newContract, message: 'Contrato emitido com sucesso!' });
  });

  // Sign contract (Worker actions)
  app.put('/api/contracts/:contractId/sign', (req, res) => {
    const { contractId } = req.params;
    const { status } = req.body; // 'Assinado' or 'Cancelado'
    
    const cIndex = db.contracts.findIndex(c => c.id === contractId);
    if (cIndex === -1) {
      return res.status(404).json({ error: 'Contrato não encontrado.' });
    }
    
    db.contracts[cIndex].status = status;
    saveDB(db);
    
    res.json({ contract: db.contracts[cIndex], message: `Contrato marcado como ${status}.` });
  });

  // Static serving of locally written uploaded assets
  app.use('/uploads', express.static(uploadDir));

  // --- Vite dev-middleware or Production static serving ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
