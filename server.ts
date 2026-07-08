import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { Pool } from 'pg';

// Database State type for fallback JSON database
interface DBState {
  users: any[];
  profiles: any[];
  contracts: any[];
  gallery?: any[];
}

const DB_FILE = path.join(process.cwd(), 'db_store.json');
let db: DBState;

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

// Initialize fallback database
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

// PostgreSQL Integration Config
let pgPool: Pool | null = null;
const databaseUrl = process.env.DATABASE_URL;

if (databaseUrl) {
  console.log('PostgreSQL Connection string detected. Initializing pgPool for Neon/Render...');
  pgPool = new Pool({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false } // Crucial for Neon & Render secure connections
  });
} else {
  console.log('No DATABASE_URL found in environment variables. Falling back to local db_store.json.');
}

// Map PostgreSQL Database Row fields to application JS camelCase Objects
function pgUserToObj(row: any) {
  if (!row) return null;
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    password: row.password,
    role: row.role
  };
}

function pgProfileToObj(row: any) {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    fullName: row.full_name,
    birthDate: row.birth_date,
    age: Number(row.age) || 18,
    gender: row.gender || '',
    nationality: row.nationality || '',
    country: row.country || '',
    city: row.city || '',
    linkedin: row.linkedin || '',
    email: row.email || '',
    hasPassport: row.has_passport || 'No',
    passportNumber: row.passport_number || '',
    passportValidity: row.passport_validity || '',
    rgNumber: row.rg_number || '',
    cpfNumber: row.cpf_number || '',
    licenseType: row.license_type || 'None',
    licenseCountry: row.license_country || '',
    countriesOfInterest: row.countries_of_interest ? JSON.parse(row.countries_of_interest) : [],
    travelAvailability: row.travel_availability || 'Immediate',
    hasVisa: row.has_visa || 'No',
    visaCountry: row.visa_country || '',
    visaType: row.visa_type || '',
    visaValidity: row.visa_validity || '',
    profession: row.profession || '',
    experienceYears: row.experience_years || '',
    lastCompany: row.last_company || '',
    lastRole: row.last_role || '',
    lastPeriod: row.last_period || '',
    experienceDescription: row.experience_description || '',
    certifications: row.certifications ? JSON.parse(row.certifications) : [],
    certificationFiles: row.certification_files ? JSON.parse(row.certification_files) : [],
    certificateType: row.certificate_type || '',
    certificateValidity: row.certificate_validity || '',
    languages: row.languages ? JSON.parse(row.languages) : [],
    avatarPhoto: row.avatar_photo || '',
    fullBodyPhoto: row.full_body_photo || '',
    resumePhoto: row.resume_photo || '',
    photos: row.photos ? JSON.parse(row.photos) : [],
    videos: row.videos ? JSON.parse(row.videos) : { presentation: '', documents: '' },
    termsShare: row.terms_share || false,
    termsTruth: row.terms_truth || false,
    termsPrivacy: row.terms_privacy || false,
    ranking: row.ranking || 'Available',
    phone: row.phone || '',
    drivesMachinery: row.drives_machinery || 'No',
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function pgContractToObj(row: any) {
  if (!row) return null;
  return {
    id: row.id,
    workerId: row.worker_id,
    workerName: row.worker_name,
    destinationCountry: row.destination_country,
    durationMonths: Number(row.duration_months),
    role: row.role,
    salary: row.salary,
    startDate: row.start_date,
    endDate: row.end_date,
    status: row.status,
    terms: row.terms,
    createdAt: row.created_at
  };
}

function pgGalleryToObj(row: any) {
  if (!row) return null;
  return {
    id: row.id,
    workerName: row.worker_name,
    profession: row.profession,
    type: row.type,
    url: row.url,
    caption: row.caption,
    createdAt: row.created_at
  };
}

// Database Abstraction API Wrapper Functions (calls SQL Postgres or falls back to JSON DBState)
async function findUserByEmail(email: string): Promise<any | null> {
  const emailLower = email.toLowerCase().trim();
  if (pgPool) {
    const res = await pgPool.query('SELECT * FROM users WHERE LOWER(email) = $1', [emailLower]);
    return res.rows[0] ? pgUserToObj(res.rows[0]) : null;
  }
  return db.users.find(u => u.email.toLowerCase() === emailLower) || null;
}

async function findUserById(id: string): Promise<any | null> {
  if (pgPool) {
    const res = await pgPool.query('SELECT * FROM users WHERE id = $1', [id]);
    return res.rows[0] ? pgUserToObj(res.rows[0]) : null;
  }
  return db.users.find(u => u.id === id) || null;
}

async function createUser(user: any): Promise<void> {
  if (pgPool) {
    await pgPool.query(
      'INSERT INTO users (id, full_name, email, phone, password, role) VALUES ($1, $2, $3, $4, $5, $6)',
      [user.id, user.fullName, user.email, user.phone, user.password, user.role]
    );
  } else {
    db.users.push(user);
    saveDB(db);
  }
}

async function updateUser(id: string, fullName: string, phone: string): Promise<void> {
  if (pgPool) {
    await pgPool.query(
      'UPDATE users SET full_name = $1, phone = $2 WHERE id = $3',
      [fullName, phone, id]
    );
  } else {
    const userIndex = db.users.findIndex(u => u.id === id);
    if (userIndex !== -1) {
      db.users[userIndex].fullName = fullName;
      db.users[userIndex].phone = phone;
      saveDB(db);
    }
  }
}

async function findProfileByUserId(userId: string): Promise<any | null> {
  if (pgPool) {
    const res = await pgPool.query('SELECT * FROM profiles WHERE user_id = $1', [userId]);
    return res.rows[0] ? pgProfileToObj(res.rows[0]) : null;
  }
  return db.profiles.find(p => p.userId === userId) || null;
}

async function getAllProfiles(): Promise<any[]> {
  if (pgPool) {
    const res = await pgPool.query(`
      SELECT p.*, u.email as user_email 
      FROM profiles p 
      LEFT JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
    `);
    return res.rows.map(row => ({
      ...pgProfileToObj(row),
      email: row.user_email || row.email
    }));
  }
  return db.profiles.map(p => {
    const u = db.users.find(user => user.id === p.userId);
    return {
      ...p,
      email: u ? u.email : ''
    };
  });
}

async function getPublicProfiles(): Promise<any[]> {
  if (pgPool) {
    const res = await pgPool.query(`
      SELECT * FROM profiles 
      WHERE profession IS NOT NULL AND TRIM(profession) != ''
      ORDER BY created_at DESC
    `);
    return res.rows.map(pgProfileToObj);
  }
  return db.profiles.filter(p => p.profession && p.profession.trim() !== '');
}

async function createProfile(profile: any): Promise<void> {
  if (pgPool) {
    await pgPool.query(
      `INSERT INTO profiles (
        id, user_id, full_name, birth_date, age, gender, nationality, country, city, linkedin, email,
        has_passport, passport_number, passport_validity, rg_number, cpf_number, license_type, license_country,
        countries_of_interest, travel_availability, has_visa, visa_country, visa_type, visa_validity,
        profession, experience_years, last_company, last_role, last_period, experience_description,
        certifications, certification_files, certificate_type, certificate_validity, languages,
        avatar_photo, full_body_photo, resume_photo, photos, videos, terms_share, terms_truth, terms_privacy,
        ranking, phone, drives_machinery, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,
        $12, $13, $14, $15, $16, $17, $18,
        $19, $20, $21, $22, $23, $24,
        $25, $26, $27, $28, $29, $30,
        $31, $32, $33, $34, $35,
        $36, $37, $38, $39, $40, $41, $42, $43,
        $44, $45, $46, $47, $48
      )`,
      [
        profile.id,
        profile.userId,
        profile.fullName,
        profile.birthDate || null,
        profile.age || 18,
        profile.gender || '',
        profile.nationality || '',
        profile.country || '',
        profile.city || '',
        profile.linkedin || '',
        profile.email || '',
        profile.hasPassport || 'No',
        profile.passportNumber || '',
        profile.passportValidity || '',
        profile.rgNumber || '',
        profile.cpfNumber || '',
        profile.licenseType || 'None',
        profile.licenseCountry || '',
        JSON.stringify(profile.countriesOfInterest || []),
        profile.travelAvailability || 'Immediate',
        profile.hasVisa || 'No',
        profile.visaCountry || '',
        profile.visaType || '',
        profile.visaValidity || '',
        profile.profession || '',
        profile.experienceYears || '',
        profile.lastCompany || '',
        profile.lastRole || '',
        profile.lastPeriod || '',
        profile.experienceDescription || '',
        JSON.stringify(profile.certifications || []),
        JSON.stringify(profile.certificationFiles || []),
        profile.certificateType || '',
        profile.certificateValidity || '',
        JSON.stringify(profile.languages || []),
        profile.avatarPhoto || '',
        profile.fullBodyPhoto || '',
        profile.resumePhoto || '',
        JSON.stringify(profile.photos || []),
        JSON.stringify(profile.videos || { presentation: '', documents: '' }),
        !!profile.termsShare,
        !!profile.termsTruth,
        !!profile.termsPrivacy,
        profile.ranking || 'Available',
        profile.phone || '',
        profile.drivesMachinery || 'No',
        profile.createdAt || new Date(),
        profile.updatedAt || new Date()
      ]
    );
  } else {
    db.profiles.push(profile);
    saveDB(db);
  }
}

async function updateProfileInDb(userId: string, updateData: any): Promise<any> {
  const existingProfile = await findProfileByUserId(userId);
  if (!existingProfile) return null;

  const mergedProfile = {
    ...existingProfile,
    ...updateData,
    id: existingProfile.id,
    userId: existingProfile.userId
  };

  // Recalculate ranking
  mergedProfile.ranking = calculateRanking(mergedProfile);
  mergedProfile.updatedAt = new Date().toISOString();

  if (pgPool) {
    await pgPool.query(
      `UPDATE profiles SET
        full_name = $1, birth_date = $2, age = $3, gender = $4, nationality = $5, country = $6, city = $7,
        linkedin = $8, email = $9, has_passport = $10, passport_number = $11, passport_validity = $12,
        rg_number = $13, cpf_number = $14, license_type = $15, license_country = $16, countries_of_interest = $17,
        travel_availability = $18, has_visa = $19, visa_country = $20, visa_type = $21, visa_validity = $22,
        profession = $23, experience_years = $24, last_company = $25, last_role = $26, last_period = $27,
        experience_description = $28, certifications = $29, certification_files = $30, certificate_type = $31,
        certificate_validity = $32, languages = $33, avatar_photo = $34, full_body_photo = $35, resume_photo = $36,
        photos = $37, videos = $38, terms_share = $39, terms_truth = $40, terms_privacy = $41, ranking = $42,
        phone = $43, drives_machinery = $44, updated_at = $45
      WHERE user_id = $46`,
      [
        mergedProfile.fullName,
        mergedProfile.birthDate || null,
        mergedProfile.age || 18,
        mergedProfile.gender || '',
        mergedProfile.nationality || '',
        mergedProfile.country || '',
        mergedProfile.city || '',
        mergedProfile.linkedin || '',
        mergedProfile.email || '',
        mergedProfile.hasPassport || 'No',
        mergedProfile.passportNumber || '',
        mergedProfile.passportValidity || '',
        mergedProfile.rgNumber || '',
        mergedProfile.cpfNumber || '',
        mergedProfile.licenseType || 'None',
        mergedProfile.licenseCountry || '',
        JSON.stringify(mergedProfile.countriesOfInterest || []),
        mergedProfile.travelAvailability || 'Immediate',
        mergedProfile.hasVisa || 'No',
        mergedProfile.visaCountry || '',
        mergedProfile.visaType || '',
        mergedProfile.visaValidity || '',
        mergedProfile.profession || '',
        mergedProfile.experienceYears || '',
        mergedProfile.lastCompany || '',
        mergedProfile.lastRole || '',
        mergedProfile.lastPeriod || '',
        mergedProfile.experienceDescription || '',
        JSON.stringify(mergedProfile.certifications || []),
        JSON.stringify(mergedProfile.certificationFiles || []),
        mergedProfile.certificateType || '',
        mergedProfile.certificateValidity || '',
        JSON.stringify(mergedProfile.languages || []),
        mergedProfile.avatarPhoto || '',
        mergedProfile.fullBodyPhoto || '',
        mergedProfile.resumePhoto || '',
        JSON.stringify(mergedProfile.photos || []),
        JSON.stringify(mergedProfile.videos || { presentation: '', documents: '' }),
        !!mergedProfile.termsShare,
        !!mergedProfile.termsTruth,
        !!mergedProfile.termsPrivacy,
        mergedProfile.ranking || 'Available',
        mergedProfile.phone || '',
        mergedProfile.drivesMachinery || 'No',
        mergedProfile.updatedAt,
        userId
      ]
    );

    // Also update users table name and phone
    await updateUser(userId, mergedProfile.fullName, mergedProfile.phone);
  } else {
    const index = db.profiles.findIndex(p => p.userId === userId);
    if (index !== -1) {
      db.profiles[index] = mergedProfile;
      const userIndex = db.users.findIndex(u => u.id === userId);
      if (userIndex !== -1) {
        db.users[userIndex].fullName = mergedProfile.fullName;
        db.users[userIndex].phone = mergedProfile.phone;
      }
      saveDB(db);
    }
  }

  return mergedProfile;
}

async function getContractsByUserId(userId: string): Promise<any[]> {
  if (pgPool) {
    const user = await findUserById(userId);
    if (!user) return [];
    if (user.role === 'admin') {
      const res = await pgPool.query('SELECT * FROM contracts ORDER BY created_at DESC');
      return res.rows.map(pgContractToObj);
    } else {
      const res = await pgPool.query('SELECT * FROM contracts WHERE worker_id = $1 ORDER BY created_at DESC', [userId]);
      return res.rows.map(pgContractToObj);
    }
  }
  
  const user = db.users.find(u => u.id === userId);
  if (!user) return [];
  if (user.role === 'admin') {
    return db.contracts;
  } else {
    return db.contracts.filter(c => c.workerId === userId);
  }
}

async function createContract(contract: any): Promise<void> {
  if (pgPool) {
    await pgPool.query(
      `INSERT INTO contracts (
        id, worker_id, worker_name, destination_country, duration_months, role, salary, start_date, end_date, status, terms, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [
        contract.id,
        contract.workerId,
        contract.workerName,
        contract.destinationCountry,
        contract.durationMonths,
        contract.role,
        contract.salary,
        contract.startDate,
        contract.endDate,
        contract.status,
        contract.terms,
        contract.createdAt || new Date()
      ]
    );
  } else {
    db.contracts.push(contract);
    saveDB(db);
  }
}

async function updateContractStatus(contractId: string, status: string): Promise<any> {
  if (pgPool) {
    const res = await pgPool.query(
      'UPDATE contracts SET status = $1 WHERE id = $2 RETURNING *',
      [status, contractId]
    );
    return res.rows[0] ? pgContractToObj(res.rows[0]) : null;
  } else {
    const index = db.contracts.findIndex(c => c.id === contractId);
    if (index === -1) return null;
    db.contracts[index].status = status;
    saveDB(db);
    return db.contracts[index];
  }
}

async function getGalleryItems(): Promise<any[]> {
  if (pgPool) {
    const res = await pgPool.query('SELECT * FROM gallery ORDER BY created_at DESC');
    return res.rows.map(pgGalleryToObj);
  }
  
  if (!(db as any).gallery) {
    (db as any).gallery = [];
  }
  return (db as any).gallery;
}

async function createGalleryItem(item: any): Promise<void> {
  if (pgPool) {
    await pgPool.query(
      `INSERT INTO gallery (id, worker_name, profession, type, url, caption, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        item.id,
        item.workerName,
        item.profession,
        item.type,
        item.url,
        item.caption,
        item.createdAt || new Date()
      ]
    );
  } else {
    if (!(db as any).gallery) {
      (db as any).gallery = [];
    }
    (db as any).gallery.unshift(item);
    saveDB(db);
  }
}

// Automatically construct DB tables inside Postgres database
async function initPgDb() {
  if (!pgPool) return;
  try {
    console.log('Verifying & Initializing SQL Neon tables...');
    
    // Create users table
    await pgPool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(50) PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(50) NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL
      )
    `);

    // Create profiles table
    await pgPool.query(`
      CREATE TABLE IF NOT EXISTS profiles (
        id VARCHAR(50) PRIMARY KEY,
        user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
        full_name VARCHAR(255) NOT NULL,
        birth_date VARCHAR(50),
        age INTEGER,
        gender VARCHAR(50),
        nationality VARCHAR(255),
        country VARCHAR(255),
        city VARCHAR(255),
        linkedin VARCHAR(255),
        email VARCHAR(255),
        
        has_passport VARCHAR(10),
        passport_number VARCHAR(100),
        passport_validity VARCHAR(50),
        rg_number VARCHAR(100),
        cpf_number VARCHAR(100),
        license_type VARCHAR(255),
        license_country VARCHAR(255),
        
        countries_of_interest TEXT,
        travel_availability VARCHAR(100),
        has_visa VARCHAR(10),
        visa_country VARCHAR(255),
        visa_type VARCHAR(255),
        visa_validity VARCHAR(50),
        
        profession VARCHAR(255),
        experience_years VARCHAR(100),
        last_company VARCHAR(255),
        last_role VARCHAR(255),
        last_period VARCHAR(255),
        experience_description TEXT,
        
        certifications TEXT,
        certification_files TEXT,
        certificate_type VARCHAR(255),
        certificate_validity VARCHAR(50),
        
        languages TEXT,
        
        avatar_photo TEXT,
        full_body_photo TEXT,
        resume_photo TEXT,
        photos TEXT,
        videos TEXT,
        
        terms_share BOOLEAN,
        terms_truth BOOLEAN,
        terms_privacy BOOLEAN,
        
        ranking VARCHAR(50),
        phone VARCHAR(50),
        drives_machinery VARCHAR(10),
        created_at TIMESTAMP,
        updated_at TIMESTAMP
      )
    `);

    // Create contracts table
    await pgPool.query(`
      CREATE TABLE IF NOT EXISTS contracts (
        id VARCHAR(50) PRIMARY KEY,
        worker_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
        worker_name VARCHAR(255) NOT NULL,
        destination_country VARCHAR(255) NOT NULL,
        duration_months INTEGER,
        role VARCHAR(255) NOT NULL,
        salary VARCHAR(255) NOT NULL,
        start_date VARCHAR(50) NOT NULL,
        end_date VARCHAR(50) NOT NULL,
        status VARCHAR(20) NOT NULL,
        terms TEXT NOT NULL,
        created_at TIMESTAMP
      )
    `);

    // Create gallery table
    await pgPool.query(`
      CREATE TABLE IF NOT EXISTS gallery (
        id VARCHAR(50) PRIMARY KEY,
        worker_name VARCHAR(255) NOT NULL,
        profession VARCHAR(255) NOT NULL,
        type VARCHAR(20) NOT NULL,
        url TEXT NOT NULL,
        caption TEXT,
        created_at TIMESTAMP
      )
    `);

    // Seeding initial data if empty
    const countRes = await pgPool.query('SELECT COUNT(*) FROM users');
    if (parseInt(countRes.rows[0].count) === 0) {
      console.log('Seeding initial PostgreSQL admin and test worker data...');
      
      // Admin User
      await pgPool.query(`
        INSERT INTO users (id, full_name, email, phone, password, role)
        VALUES ('user_admin_1', 'Administrador Work', 'speakai.agency@gmail.com', '11999999999', 'admin', 'admin')
      `);

      // Worker User
      await pgPool.query(`
        INSERT INTO users (id, full_name, email, phone, password, role)
        VALUES ('user_worker_1', 'Carlos Silva', 'trabalhador@work.com', '11988888888', 'pass', 'worker')
      `);

      // Worker Profile
      await pgPool.query(`
        INSERT INTO profiles (
          id, user_id, full_name, age, gender, country, profession, license_type,
          english_level, certificate_type, certificate_validity, has_passport,
          visa_type, visa_validity, drives_machinery, phone, photos, resume_photo,
          videos, ranking, created_at, updated_at
        ) VALUES (
          'profile_worker_1', 'user_worker_1', 'Carlos Silva', 28, 'Male', 'Brazil',
          'Senior Carpenter', 'Class B', 'Intermediate', 'Occupational Safety & Health Certificate (OSHA)',
          '2028-12-31', 'Yes', 'Temporary Seasonal H-2B Visa', '2026-12-31', 'Yes', '11988888888',
          '[]', '', '{"presentation": "", "documents": ""}', 'Verified', NOW(), NOW()
        )
      `);

      // Contract
      await pgPool.query(`
        INSERT INTO contracts (
          id, worker_id, worker_name, destination_country, duration_months, role,
          salary, start_date, end_date, status, terms, created_at
        ) VALUES (
          'contract_1', 'user_worker_1', 'Carlos Silva', 'United States', 3,
          'Seasonal Assistant Carpenter', '$3,200.00 / Month', '2026-07-01', '2026-10-01',
          'Pending', 'Temporary winter/summer contractor terms cover round-trip flights, dual occupancy accommodation units, health cover, and standardized overtime scaling.',
          NOW()
        )
      `);
    }

    // Seed Gallery
    const galleryCountRes = await pgPool.query('SELECT COUNT(*) FROM gallery');
    if (parseInt(galleryCountRes.rows[0].count) === 0) {
      console.log('Seeding initial gallery items into PostgreSQL...');
      const defaultGallery = [
        {
          id: 'gal_1',
          workerName: 'Marcos Almeida',
          profession: 'Senior Electrician',
          type: 'image',
          url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
          caption: 'Primary power cables installation in industrial warehouse during European seasonal contract.',
          createdAt: new Date()
        },
        {
          id: 'gal_2',
          workerName: 'Carlos Silva',
          profession: 'Senior Carpenter',
          type: 'image',
          url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
          caption: 'Structural wooden framing reinforcement for commercial exhibition pavilion.',
          createdAt: new Date()
        },
        {
          id: 'gal_3',
          workerName: 'Juliana Portela',
          profession: 'Forklift Operator',
          type: 'image',
          url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
          caption: 'Refrigerated container stacking at cargo hub in Germany.',
          createdAt: new Date()
        },
        {
          id: 'gal_4',
          workerName: 'Lucas Lima',
          profession: 'Cargo Assistant',
          type: 'video',
          url: 'https://www.w3schools.com/html/mov_bbb.mp4',
          caption: 'Demo of manual sorting workflow at airport logistics center.',
          createdAt: new Date()
        }
      ];

      for (const item of defaultGallery) {
        await pgPool.query(
          `INSERT INTO gallery (id, worker_name, profession, type, url, caption, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [item.id, item.workerName, item.profession, item.type, item.url, item.caption, item.createdAt]
        );
      }
    }

    console.log('PostgreSQL (Neon) tables and static seeds fully verified.');
  } catch (error) {
    console.error('Error during PostgreSQL table init/seed:', error);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;
  
  // Increase packet size limit for base64 photo/video uploads
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));
  
  // Fallback Database instance (loaded unconditionally so it works locally even with bad PG configs)
  db = loadDB();

  // Initialize Postgres DB if the pool is initialized
  if (pgPool) {
    await initPgDb();
  }

  // Create folder for static uploads if needed, just in case
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // --- API Authentication Routes ---
  
  // Register worker
  app.post('/api/auth/register', async (req, res) => {
    const { fullName, email, password, phone } = req.body;
    
    if (!fullName || !email || !password || !phone) {
      return res.status(400).json({ error: 'All fields are required to register.' });
    }
    
    const emailLower = email.toLowerCase().trim();
    
    // Check if user exists
    const exists = await findUserByEmail(emailLower);
    if (exists) {
      return res.status(400).json({ error: 'This email is already registered.' });
    }
    
    const userId = 'user_' + Date.now();
    const isAdminEmail = emailLower === 'speakai.agency@gmail.com';
    const newUser = {
      id: userId,
      fullName: fullName.trim(),
      email: emailLower,
      phone: phone.trim(),
      password, // Simple credentials checking
      role: (isAdminEmail ? 'admin' : 'worker') as 'admin' | 'worker'
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
    
    await createUser(newUser);
    await createProfile(newProfile);
    
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
  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    
    const emailLower = email.toLowerCase().trim();
    const user = await findUserByEmail(emailLower);
    
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Incorrect email or password.' });
    }
    
    // Enforce admin role for speakai.agency@gmail.com dynamically
    const finalRole = emailLower === 'speakai.agency@gmail.com' ? 'admin' : user.role;
    
    res.json({
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: finalRole
      },
      message: 'Login successful!'
    });
  });

  // Fetch logged-in user profile & details
  app.get('/api/profile/:userId', async (req, res) => {
    const { userId } = req.params;
    const profile = await findProfileByUserId(userId);
    
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found.' });
    }
    
    res.json(profile);
  });



  // Update worker profile
  app.put('/api/profile/:userId', async (req, res) => {
    const { userId } = req.params;
    const updateData = req.body;
    
    // Explicitly validate required phone mapping
    if (updateData.phone === undefined || updateData.phone === '') {
      return res.status(400).json({ error: 'Mobile phone number is required.' });
    }

    const updatedProfile = await updateProfileInDb(userId, updateData);
    if (!updatedProfile) {
      return res.status(404).json({ error: 'Profile not found.' });
    }
    
    res.json({ profile: updatedProfile, message: 'Profile updated successfully!' });
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
  app.get('/api/gallery', async (req, res) => {
    const items = await getGalleryItems();
    res.json(items);
  });

  app.post('/api/gallery', async (req, res) => {
    const { workerName, profession, type, url, caption } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'The file url is required.' });
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
    
    await createGalleryItem(newItem);
    res.status(201).json(newItem);
  });

  // Admin routes: List all workers & profiles
  app.get('/api/admin/profiles', async (req, res) => {
    const profiles = await getAllProfiles();
    res.json(profiles);
  });

  // Public route to fetch worker profiles for the catalog page
  app.get('/api/public/profiles', async (req, res) => {
    const publicProfiles = await getPublicProfiles();
    res.json(publicProfiles);
  });

  // Admin and Worker contracts
  app.get('/api/contracts/:userId', async (req, res) => {
    const { userId } = req.params;
    const user = await findUserById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    
    const contracts = await getContractsByUserId(userId);
    res.json(contracts);
  });

  // Issue contract (Admin only)
  app.post('/api/contracts', async (req, res) => {
    const { workerId, destinationCountry, durationMonths, role, salary, startDate, endDate, terms } = req.body;
    
    if (!workerId || !destinationCountry || !role || !salary || !startDate || !endDate) {
      return res.status(400).json({ error: 'All contract fields are required.' });
    }
    
    const workerUser = await findUserById(workerId);
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
    
    await createContract(newContract);
    res.status(201).json({ contract: newContract, message: 'Contract issued successfully!' });
  });

  // Sign contract (Worker actions)
  app.put('/api/contracts/:contractId/sign', async (req, res) => {
    const { contractId } = req.params;
    const { status } = req.body; // 'Signed' or 'Cancelled'
    
    const updatedContract = await updateContractStatus(contractId, status);
    if (!updatedContract) {
      return res.status(404).json({ error: 'Contract not found.' });
    }
    
    res.json({ contract: updatedContract, message: `Contract status updated to ${status}.` });
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
