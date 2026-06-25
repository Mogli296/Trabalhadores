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
        gender: 'Male',
        country: 'Brazil',
        profession: 'Senior Carpenter',
        licenseType: 'Class B',
        englishLevel: 'Intermediate',
        certificateType: 'Occupational Safety & Health Certificate (OSHA)',
        certificateValidity: '2028-12-31',
        hasPassport: 'Yes',
        visaType: 'Temporary Seasonal H-2B Visa',
        visaValidity: '2026-12-31',
        drivesMachinery: 'Yes',
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
        destinationCountry: 'United States',
        durationMonths: 3,
        role: 'Seasonal Assistant Carpenter',
        salary: '$3,200.00 / Month',
        startDate: '2026-07-01',
        endDate: '2026-10-01',
        status: 'Pending',
        terms: 'Temporary winter/summer contractor terms cover round-trip flights, dual occupancy accommodation units, health cover, and standardized overtime scaling.',
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
      return res.status(400).json({ error: 'All fields are required to register.' });
    }
    
    const emailLower = email.toLowerCase().trim();
    
    // Check if user exists
    const exists = db.users.find(u => u.email.toLowerCase() === emailLower);
    if (exists) {
      return res.status(400).json({ error: 'This email is already registered.' });
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
    
    // Create an empty worker profile for them in English
    const profileId = 'profile_' + Date.now();
    const newProfile = {
      id: profileId,
      userId: userId,
      fullName: fullName.trim(),
      age: 18,
      gender: '',
      country: '',
      profession: '',
      licenseType: 'None',
      englishLevel: 'Non-verbal',
      certificateType: '',
      certificateValidity: '',
      hasPassport: 'No' as const,
      visaType: '',
      visaValidity: '',
      drivesMachinery: 'No' as const,
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
      message: 'Registration completed successfully!'
    });
  });

  // Login
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    
    const emailLower = email.toLowerCase().trim();
    const user = db.users.find(u => u.email.toLowerCase() === emailLower && u.password === password);
    
    if (!user) {
      return res.status(401).json({ error: 'Incorrect email or password.' });
    }
    
    res.json({
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role
      },
      message: 'Login successful!'
    });
  });

  // Fetch logged-in user profile & details
  app.get('/api/profile/:userId', (req, res) => {
    const { userId } = req.params;
    const profile = db.profiles.find(p => p.userId === userId);
    
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found.' });
    }
    
    res.json(profile);
  });

  // Helper to dynamically calculate TCW Talent Ranking
  function calculateRanking(profile: any): 'Premium' | 'Verified' | 'Available' {
    const hasPassport = profile.hasPassport === 'Yes' || profile.hasPassport === 'Sim';
    const hasVideo = !!(profile.videos?.presentation);
    
    // Check English
    const engDropdownVal = profile.englishLevel || '';
    const isEngDropdownHigh = ['Intermediário', 'Avançado', 'Fluente', 'Intermediate', 'Advanced', 'Fluent', 'Expert'].includes(engDropdownVal);
    const hasEngInLanguages = profile.languages && profile.languages.some((l: any) => {
      const lang = (l.language || '').toLowerCase();
      const lvl = (l.level || '').toLowerCase();
      return (lang === 'inglês' || lang === 'english') && 
             ['intermediário', 'avançado', 'fluente', 'intermediate', 'advanced', 'fluent', 'b2', 'c1', 'c2'].includes(lvl);
    });
    const isEnglishIntermediatePlus = isEngDropdownHigh || hasEngInLanguages;

    // Check Certifications
    const hasCertifications = (profile.certifications && profile.certifications.length > 0) || 
                              (profile.certificateType && profile.certificateType.trim() !== '');

    if (hasPassport && isEnglishIntermediatePlus && hasVideo && hasCertifications) {
      return 'Premium';
    }

    // Verified Talent: Document validated (videos.documents or resumePhoto etc.) & Proven Experience
    const hasDocVerified = !!(profile.videos?.documents || profile.resumePhoto || profile.passportNumber || profile.rgNumber || profile.cpfNumber);
    const hasProvenExperience = (profile.experienceYears && profile.experienceYears !== 'Menos de 1 ano' && profile.experienceYears !== 'Less than 1 year') || 
                                !!(profile.lastCompany && profile.lastCompany.trim() !== '');

    if (hasDocVerified || hasProvenExperience) {
      return 'Verified';
    }

    return 'Available';
  }

  // Update worker profile
  app.put('/api/profile/:userId', (req, res) => {
    const { userId } = req.params;
    const updateData = req.body;
    
    const index = db.profiles.findIndex(p => p.userId === userId);
    if (index === -1) {
      return res.status(404).json({ error: 'Profile not found.' });
    }
    
    const existingProfile = db.profiles[index];
    
    // Explicitly validate required phone mapping
    if (updateData.phone === undefined || updateData.phone === '') {
      return res.status(400).json({ error: 'Mobile phone number is required.' });
    }

    const mergedProfile = {
      ...existingProfile,
      ...updateData,
      // Keep immutable fields untouched
      id: existingProfile.id,
      userId: existingProfile.userId,
    };

    // Calculate ranking dynamically
    mergedProfile.ranking = calculateRanking(mergedProfile);
    mergedProfile.updatedAt = new Date().toISOString();

    db.profiles[index] = mergedProfile;
    
    // Also update phone/name on user account if changed
    const userIndex = db.users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      db.users[userIndex].fullName = db.profiles[index].fullName;
      db.users[userIndex].phone = db.profiles[index].phone;
    }
    
    saveDB(db);
    res.json({ profile: db.profiles[index], message: 'Profile updated successfully!' });
  });

  // Upload pictures or videos as local Base64 media elements
  app.post('/api/media/upload', (req, res) => {
    const { filename, fileData, type } = req.body; // fileData in base64
    
    if (!fileData) {
      return res.status(400).json({ error: 'No file data received.' });
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
      res.json({ url: fileData, warning: 'Resource saved directly in the store.' });
    }
  });

  // --- Shared Public Media Gallery ---
  app.get('/api/gallery', (req, res) => {
    // If gallery array does not exist in db, initialize it
    if (!(db as any).gallery) {
      (db as any).gallery = [];
    }
    
    // Seed default items if empty (using translated descriptions)
    if ((db as any).gallery.length === 0) {
      (db as any).gallery = [
        {
          id: 'gal_1',
          workerName: 'Marcos Almeida',
          profession: 'Senior Electrician',
          type: 'image',
          url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
          caption: 'Primary power cables installation in industrial warehouse during European seasonal contract.',
          createdAt: new Date().toISOString()
        },
        {
          id: 'gal_2',
          workerName: 'Carlos Silva',
          profession: 'Senior Carpenter',
          type: 'image',
          url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
          caption: 'Structural wooden framing reinforcement for commercial exhibition pavilion.',
          createdAt: new Date().toISOString()
        },
        {
          id: 'gal_3',
          workerName: 'Juliana Portela',
          profession: 'Forklift Operator',
          type: 'image',
          url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
          caption: 'Refrigerated container stacking at cargo hub in Germany.',
          createdAt: new Date().toISOString()
        },
        {
          id: 'gal_4',
          workerName: 'Lucas Lima',
          profession: 'Cargo Assistant',
          type: 'video',
          url: 'https://www.w3schools.com/html/mov_bbb.mp4',
          caption: 'Demo of manual sorting workflow at airport logistics center.',
          createdAt: new Date().toISOString()
        }
      ];
      saveDB(db);
    }
    res.json((db as any).gallery);
  });

  app.post('/api/gallery', (req, res) => {
    const { workerName, profession, type, url, caption } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'The file url is required.' });
    }
    
    if (!(db as any).gallery) {
      (db as any).gallery = [];
    }
    
    const newItem = {
      id: 'gal_' + Date.now(),
      workerName: workerName || 'Work Certified Professional',
      profession: profession || 'Qualified Worker',
      type: type || 'image',
      url,
      caption: caption || 'Uploaded by verified field operative.',
      createdAt: new Date().toISOString()
    };
    
    (db as any).gallery.unshift(newItem);
    saveDB(db);
    
    res.status(201).json(newItem);
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

  // Public route to fetch worker profiles for the catalog page
  app.get('/api/public/profiles', (req, res) => {
    // Only return profiles that have set at least a profession to avoid showing blank half-created items
    const publicProfiles = db.profiles
      .filter(p => p.profession && p.profession.trim() !== '')
      .map(p => ({
        id: p.id,
        fullName: p.fullName,
        profession: p.profession,
        country: p.country,
        age: p.age,
        gender: p.gender,
        licenseType: p.licenseType,
        englishLevel: p.englishLevel,
        certificateType: p.certificateType,
        hasPassport: p.hasPassport,
        drivesMachinery: p.drivesMachinery,
        photos: p.photos || [],
        videos: p.videos || { presentation: '', documents: '' },
        createdAt: p.createdAt
      }));
    res.json(publicProfiles);
  });

  // Admin and Worker contracts
  app.get('/api/contracts/:userId', (req, res) => {
    const { userId } = req.params;
    const user = db.users.find(u => u.id === userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
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
      return res.status(400).json({ error: 'All contract fields are required.' });
    }
    
    const workerUser = db.users.find(u => u.id === workerId);
    if (!workerUser) {
      return res.status(404).json({ error: 'Worker profile not found.' });
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
      status: 'Pending' as const,
      terms: terms || 'Standard seasonal employment terms under international labor laws.',
      createdAt: new Date().toISOString()
    };
    
    db.contracts.push(newContract);
    saveDB(db);
    
    res.status(201).json({ contract: newContract, message: 'Contract issued successfully!' });
  });

  // Sign contract (Worker actions)
  app.put('/api/contracts/:contractId/sign', (req, res) => {
    const { contractId } = req.params;
    const { status } = req.body; // 'Signed' or 'Cancelled'
    
    const cIndex = db.contracts.findIndex(c => c.id === contractId);
    if (cIndex === -1) {
      return res.status(404).json({ error: 'Contract not found.' });
    }
    
    db.contracts[cIndex].status = status;
    saveDB(db);
    
    res.json({ contract: db.contracts[cIndex], message: `Contract status updated to ${status}.` });
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
