import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'admin' | 'doctor' | 'patient' | 'donor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  verified: boolean;
  createdAt: string;
}

export interface Patient {
  id: string;
  userId: string;
  name: string;
  age: number;
  gender: string;
  condition: string;
  urgency: 'critical' | 'high' | 'medium' | 'low';
  requiredFunds: number;
  collectedFunds: number;
  incomeLevel: number;
  verified: boolean;
  eligible: boolean;
  assignedDoctor?: string;
  status: 'pending' | 'active' | 'treated' | 'rejected';
  documents: string[];
  description: string;
  location: string;
  phone: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
}

export interface Doctor {
  id: string;
  userId: string;
  name: string;
  specialization: string;
  experience: number;
  hospital: string;
  licenseNumber: string;
  verified: boolean;
  available: boolean;
  patientsAccepted: number;
  email: string;
  phone: string;
  bio: string;
  location: string;
  documents: string[];
  createdAt: string;
  imageUrl?: string;
}

export interface Donation {
  id: string;
  donorName: string;
  donorEmail: string;
  amount: number;
  patientId?: string;
  patientName?: string;
  message?: string;
  anonymous: boolean;
  createdAt: string;
  method: string;
}

export interface Appeal {
  id: string;
  patientId: string;
  patientName: string;
  title: string;
  story: string;
  urgency: 'critical' | 'high' | 'medium' | 'low';
  targetAmount: number;
  raisedAmount: number;
  condition: string;
  imageUrl?: string;
  active: boolean;
  createdAt: string;
  deadline?: string;
}

export interface EligibilityRule {
  maxIncome: number;
  minUrgencyLevel: string;
  requiresVerification: boolean;
  minFundsAvailable: number;
}

interface AppState {
  user: User | null;
  users: User[];
  patients: Patient[];
  doctors: Doctor[];
  donations: Donation[];
  appeals: Appeal[];
  eligibilityRules: EligibilityRule;

  // Auth
  login: (email: string, password: string) => { success: boolean; message: string };
  logout: () => void;
  register: (data: Partial<User> & { password: string }) => { success: boolean; message: string };

  // Patients
  addPatient: (patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt' | 'collectedFunds' | 'eligible'>) => void;
  updatePatient: (id: string, data: Partial<Patient>) => void;
  verifyPatient: (id: string) => void;
  rejectPatient: (id: string) => void;

  // Doctors
  addDoctor: (doctor: Omit<Doctor, 'id' | 'createdAt' | 'patientsAccepted'>) => void;
  updateDoctor: (id: string, data: Partial<Doctor>) => void;
  verifyDoctor: (id: string) => void;

  // Donations
  addDonation: (donation: Omit<Donation, 'id' | 'createdAt'>) => void;

  // Appeals
  addAppeal: (appeal: Omit<Appeal, 'id' | 'createdAt' | 'raisedAmount'>) => void;
  updateAppeal: (id: string, data: Partial<Appeal>) => void;

  // Eligibility
  updateEligibilityRules: (rules: EligibilityRule) => void;
  checkEligibility: (patient: Partial<Patient>) => boolean;
}

const mockUsers: User[] = [
  { id: 'u1', name: 'Admin User', email: 'admin@portal.com', role: 'admin', verified: true, createdAt: '2024-01-01' },
  { id: 'u2', name: 'Dr. Sarah Chen', email: 'doctor@portal.com', role: 'doctor', verified: true, createdAt: '2024-01-05' },
  { id: 'u3', name: 'John Patient', email: 'patient@portal.com', role: 'patient', verified: true, createdAt: '2024-01-10' },
  { id: 'u4', name: 'Mary Donor', email: 'donor@portal.com', role: 'donor', verified: true, createdAt: '2024-01-12' },
];

const mockPatients: Patient[] = [
  {
    id: 'p1', userId: 'u3', name: 'Ali Hussain', age: 13, gender: 'Male',
    condition: 'Acute Medical Condition', urgency: 'critical', requiredFunds: 150000, collectedFunds: 42000,
    incomeLevel: 8000, verified: true, eligible: true, assignedDoctor: 'd2', status: 'active',
    documents: [], description: 'Ali Hussain is a 13-year-old boy from Kharian admitted for urgent medical treatment. His family are daily-wage earners who cannot afford his hospital bills and medication.',
    location: 'Msh- Ram Bagh Tehsil Kharian', phone: '', email: '',
    createdAt: '2026-05-01', updatedAt: '2026-05-13',
  },
  {
    id: 'p2', userId: 'u3', name: 'Zulfayaz', age: 55, gender: 'Male',
    condition: 'Chronic Illness', urgency: 'high', requiredFunds: 200000, collectedFunds: 75000,
    incomeLevel: 10000, verified: true, eligible: true, status: 'active',
    documents: [], description: 'Zulfayaz is battling a serious chronic illness and requires ongoing medical care. He is the sole breadwinner of his family with no savings left.',
    location: 'Mohiuddin Park Khana Khana, Lahore', phone: '0306-16540662', email: '',
    createdAt: '2026-05-02', updatedAt: '2026-05-13',
  },
  {
    id: 'p3', userId: 'u3', name: 'Gulshan Hussain', age: 51, gender: 'Male',
    condition: 'Neurological Disorder', urgency: 'critical', requiredFunds: 300000, collectedFunds: 110000,
    incomeLevel: 9000, verified: true, eligible: true, assignedDoctor: 'd4', status: 'active',
    documents: [], description: 'Gulshan Hussain, an auto driver from Lahore, suffered a neurological episode leaving him unable to work. His wife and children depend entirely on him.',
    location: 'Lahore', phone: '03106610766', email: '',
    createdAt: '2026-05-03', updatedAt: '2026-05-13',
  },
  {
    id: 'p4', userId: 'u3', name: 'Nadia Bibi', age: 42, gender: 'Female',
    condition: 'Cardiac Disease', urgency: 'critical', requiredFunds: 450000, collectedFunds: 180000,
    incomeLevel: 7000, verified: true, eligible: true, assignedDoctor: 'd3', status: 'active',
    documents: [], description: 'Nadia Bibi, a housewife from Shahdara Lahore, has been diagnosed with a serious cardiac condition. Her husband is a daily-wage worker who cannot afford the surgery.',
    location: 'Shahdara, Lahore', phone: '0321-4456789', email: '',
    createdAt: '2026-05-04', updatedAt: '2026-05-13',
  },
  {
    id: 'p5', userId: 'u3', name: 'Tariq Mehmood', age: 38, gender: 'Male',
    condition: 'Spinal Fracture', urgency: 'high', requiredFunds: 250000, collectedFunds: 60000,
    incomeLevel: 9000, verified: true, eligible: true, status: 'active',
    documents: [], description: 'Tariq Mehmood, a laborer from Gujranwala, fractured his spine in a work accident. Without surgery he may never walk again. He has three young children and no insurance.',
    location: 'Gujranwala', phone: '0333-9876543', email: '',
    createdAt: '2026-05-05', updatedAt: '2026-05-13',
  },
  {
    id: 'p6', userId: 'u3', name: 'Hira Fatima', age: 5, gender: 'Female',
    condition: 'Pediatric Critical Care', urgency: 'critical', requiredFunds: 180000, collectedFunds: 95000,
    incomeLevel: 6000, verified: true, eligible: true, assignedDoctor: 'd2', status: 'active',
    documents: [], description: 'Hira Fatima is only 5 years old and has been admitted to the pediatric ward in Faisalabad with a critical condition. Her parents are daily-wage workers.',
    location: 'Faisalabad', phone: '0300-1122334', email: '',
    createdAt: '2026-05-06', updatedAt: '2026-05-13',
  },
  {
    id: 'p7', userId: 'u3', name: 'Bashir Ahmed', age: 60, gender: 'Male',
    condition: 'Cancer', urgency: 'high', requiredFunds: 500000, collectedFunds: 130000,
    incomeLevel: 8000, verified: true, eligible: true, assignedDoctor: 'd1', status: 'active',
    documents: [], description: 'Bashir Ahmed, a retired man from Rawalpindi, has been diagnosed with cancer. His pension is not enough to cover chemotherapy costs.',
    location: 'Rawalpindi', phone: '0345-6677889', email: '',
    createdAt: '2026-05-07', updatedAt: '2026-05-13',
  },
  {
    id: 'p8', userId: 'u3', name: 'Sana Akhtar', age: 29, gender: 'Female',
    condition: 'Kidney Failure', urgency: 'high', requiredFunds: 360000, collectedFunds: 88000,
    incomeLevel: 12000, verified: true, eligible: true, status: 'active',
    documents: [], description: 'Sana Akhtar, a teacher from Multan, has been diagnosed with kidney failure and requires regular dialysis. She lives alone and her salary barely covers rent.',
    location: 'Multan', phone: '0311-2233445', email: '',
    createdAt: '2026-05-08', updatedAt: '2026-05-13',
  },
  {
    id: 'p9', userId: 'u3', name: 'Muhammad Usman', age: 47, gender: 'Male',
    condition: 'General Surgery', urgency: 'medium', requiredFunds: 120000, collectedFunds: 20000,
    incomeLevel: 15000, verified: true, eligible: true, status: 'active',
    documents: [], description: 'Muhammad Usman, a shopkeeper from Sialkot, requires general surgery. He is married with children and cannot afford the procedure on his own.',
    location: 'Sialkot', phone: '0322-5544332', email: '',
    createdAt: '2026-05-09', updatedAt: '2026-05-13',
  },
  {
    id: 'p10', userId: 'u3', name: 'Rukhsana Parveen', age: 65, gender: 'Female',
    condition: 'Neurological Disorder', urgency: 'high', requiredFunds: 200000, collectedFunds: 35000,
    incomeLevel: 5000, verified: true, eligible: true, assignedDoctor: 'd4', status: 'active',
    documents: [], description: 'Rukhsana Parveen, a widowed elderly woman from Kasur, is suffering from a neurological condition with no income and no family support.',
    location: 'Kasur', phone: '0301-7788990', email: '',
    createdAt: '2026-05-10', updatedAt: '2026-05-13',
  },
  {
    id: 'p11', userId: 'u3', name: 'Asif Iqbal', age: 53, gender: 'Male',
    condition: 'Cardiac Disease', urgency: 'critical', requiredFunds: 380000, collectedFunds: 50000,
    incomeLevel: 11000, verified: true, eligible: true, assignedDoctor: 'd3', status: 'active',
    documents: [], description: 'Asif Iqbal, a driver from Sheikhupura, has been diagnosed with a serious heart condition. He is married and his family depends on his income.',
    location: 'Sheikhupura', phone: '0333-4455667', email: '',
    createdAt: '2026-05-11', updatedAt: '2026-05-13',
  },
  {
    id: 'p12', userId: 'u3', name: 'Zainab Noor', age: 3, gender: 'Female',
    condition: 'Pediatric Critical Care', urgency: 'critical', requiredFunds: 160000, collectedFunds: 25000,
    incomeLevel: 7000, verified: true, eligible: true, assignedDoctor: 'd2', status: 'active',
    documents: [], description: 'Zainab Noor is only 3 years old from Okara and requires urgent pediatric care. Her father Noor ul Haq is struggling to afford her treatment.',
    location: 'Okara', phone: '0312-9900112', email: '',
    createdAt: '2026-05-12', updatedAt: '2026-05-13',
  },
];

const mockDoctors: Doctor[] = [
  {
    id: 'd1', userId: 'u2', name: 'Dr. Fatima', specialization: 'Oncology',
    experience: 15, hospital: 'Shaukat Khanum Memorial Cancer Hospital', licenseNumber: 'MD-2009-PK-44821',
    verified: true, available: true, patientsAccepted: 8, email: 'dr.fatima@shaukatkhanum.org',
    phone: '+92-42-3571-7000', bio: 'Board-certified oncologist with 15 years of experience in cancer treatment and chemotherapy.',
    location: 'Lahore, Pakistan', documents: [], createdAt: '2024-01-05',
    imageUrl: '/src/images/Doctors/Dr.Fatima.jpg'
  },
  {
    id: 'd2', userId: 'u2', name: 'Dr. Mehwish', specialization: 'Pediatrics',
    experience: 12, hospital: "Children's Hospital Lahore", licenseNumber: 'MD-2012-PK-33201',
    verified: true, available: true, patientsAccepted: 5, email: 'dr.mehwish@childrenshospital.org',
    phone: '+92-42-9923-1000', bio: 'Pediatric specialist with expertise in childhood diseases and neonatal care.',
    location: 'Lahore, Pakistan', documents: [], createdAt: '2024-01-08',
    imageUrl: '/src/images/Doctors/Dr.Mehwish.jpg'
  },
  {
    id: 'd3', userId: 'u2', name: 'Dr. Azam', specialization: 'Cardiology',
    experience: 22, hospital: 'Punjab Institute of Cardiology', licenseNumber: 'MD-2002-PK-55012',
    verified: true, available: false, patientsAccepted: 12, email: 'dr.azam@pic.gov.pk',
    phone: '+92-42-9920-3051', bio: 'Professor and interventional cardiologist with over two decades of expertise in heart surgeries.',
    location: 'Lahore, Pakistan', documents: [], createdAt: '2024-01-12',
    imageUrl: '/src/images/Doctors/Prof.Dr.Azim.jpg'
  },
  {
    id: 'd4', userId: 'u2', name: 'Dr. Zeshan Ali', specialization: 'Neurology',
    experience: 10, hospital: 'Services Hospital Lahore', licenseNumber: 'MD-2014-PK-22093',
    verified: true, available: true, patientsAccepted: 6, email: 'dr.zeshan@serviceshospital.org',
    phone: '+92-42-9921-1600', bio: 'Neurologist specializing in stroke management, epilepsy, and neurological rehabilitation.',
    location: 'Lahore, Pakistan', documents: [], createdAt: '2024-01-20',
    imageUrl: '/src/images/Doctors/ZeshanAli.jpg'
  },
];

const mockDonations: Donation[] = [
  { id: 'dn1',  donorName: 'Muhammad Dostain',        donorEmail: '', amount: 1,    anonymous: false, createdAt: '2026-05-13', method: 'JazzCash',  message: 'Transaction ID: 711808464078' },
  { id: 'dn2',  donorName: 'Muhammad Dostain',        donorEmail: '', amount: 2,    anonymous: false, createdAt: '2026-05-13', method: 'JazzCash',  message: 'Transaction ID: 711808576876' },
  { id: 'dn3',  donorName: 'Fatima Ahmed Khan',       donorEmail: '', amount: 2000, anonymous: true,  createdAt: '2026-05-13', method: 'JazzCash',  message: 'Transaction ID: 711778218625' },
  { id: 'dn4',  donorName: 'Faraz Hussain',           donorEmail: '', amount: 1000, anonymous: true,  createdAt: '2026-05-13', method: 'JazzCash',  message: 'Transaction ID: 711778218625' },
  { id: 'dn5',  donorName: 'Muhammad Ahmed Khan',     donorEmail: '', amount: 500,  anonymous: true,  createdAt: '2026-05-13', method: 'JazzCash',  message: 'Transaction ID: 711796453393' },
  { id: 'dn6',  donorName: 'Muhammad Huzaifa Razzaq', donorEmail: '', amount: 200,  anonymous: false, createdAt: '2026-05-12', method: 'JazzCash',  message: 'Transaction ID: 711770232132' },
  { id: 'dn7',  donorName: 'Ali Hakim',               donorEmail: '', amount: 200,  anonymous: true,  createdAt: '2026-05-13', method: 'JazzCash',  message: 'Transaction ID: 711772514847' },
  { id: 'dn8',  donorName: 'Amama Iqbal',             donorEmail: '', amount: 200,  anonymous: true,  createdAt: '2026-05-13', method: 'JazzCash',  message: 'Transaction ID: 711772820998' },
  { id: 'dn9',  donorName: 'Shan Zainab',             donorEmail: '', amount: 200,  anonymous: false, createdAt: '2026-05-13', method: 'JazzCash',  message: 'Transaction ID: 711772929063' },
  { id: 'dn10', donorName: 'Muhammad Huzaifa Razzaq', donorEmail: '', amount: 200,  anonymous: false, createdAt: '2026-05-12', method: 'Easypaisa', message: 'Transaction ID: 49808922728' },
  { id: 'dn11', donorName: 'Anonymous',               donorEmail: '', amount: 150,  anonymous: true,  createdAt: '2026-05-13', method: 'Easypaisa', message: '' },
  { id: 'dn12', donorName: 'Muhammad Nadeem',         donorEmail: '', amount: 86,   anonymous: false, createdAt: '2026-05-13', method: 'JazzCash',  message: '' },
  { id: 'dn13', donorName: 'Elma Riaz',               donorEmail: '', amount: 30,   anonymous: false, createdAt: '2026-05-13', method: 'Easypaisa', message: 'Transaction ID: 711773296354' },
  { id: 'dn14', donorName: 'Shema Jameel',            donorEmail: '', amount: 9,    anonymous: false, createdAt: '2026-05-13', method: 'JazzCash',  message: 'Transaction ID: 711773255764' },
];

const mockAppeals: Appeal[] = [
  {
    id: 'a1', patientId: 'p1', patientName: 'Ali Hussain', title: 'Help Ali Hussain Recover',
    story: 'Ali Hussain is a 13-year-old boy from Kharian who has been admitted for urgent medical treatment. His family, daily-wage earners, cannot afford the cost of his care. Your donation will help cover his hospital bills and medication.',
    urgency: 'critical', targetAmount: 150000, raisedAmount: 42000, condition: 'Acute Medical Condition',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800', active: true,
    createdAt: '2026-05-01', deadline: '2026-06-30'
  },
  {
    id: 'a2', patientId: 'p2', patientName: 'Zulfayaz', title: "Support Zulfayaz's Treatment",
    story: 'Zulfayaz, 55, from Lahore is battling a serious illness and requires ongoing medical care. He is the sole breadwinner of his family and has no savings left. Every rupee donated goes directly to his treatment.',
    urgency: 'high', targetAmount: 200000, raisedAmount: 75000, condition: 'Chronic Illness',
    imageUrl: 'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=800', active: true,
    createdAt: '2026-05-02', deadline: '2026-07-15'
  },
  {
    id: 'a3', patientId: 'p3', patientName: 'Gulshan Hussain', title: 'Gulshan Needs Neurological Care',
    story: 'Gulshan Hussain, 51, an auto driver from Lahore, suffered a neurological episode that has left him unable to work. His wife and children depend entirely on him. He urgently needs specialist treatment at a neurology centre.',
    urgency: 'critical', targetAmount: 300000, raisedAmount: 110000, condition: 'Neurological Disorder',
    imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800', active: true,
    createdAt: '2026-05-03', deadline: '2026-06-20'
  },
  {
    id: 'a4', patientId: 'p4', patientName: 'Nadia Bibi', title: "Nadia Bibi's Heart Surgery Fund",
    story: 'Nadia Bibi, 42, a housewife from Shahdara Lahore, has been diagnosed with a serious cardiac condition. Her husband is a daily-wage worker and cannot afford the surgery. Help save a mother of four.',
    urgency: 'critical', targetAmount: 450000, raisedAmount: 180000, condition: 'Cardiac Disease',
    imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800', active: true,
    createdAt: '2026-05-04', deadline: '2026-06-15'
  },
  {
    id: 'a5', patientId: 'p5', patientName: 'Tariq Mehmood', title: 'Tariq Needs Orthopedic Surgery',
    story: 'Tariq Mehmood, 38, a laborer from Gujranwala, fractured his spine in a work accident. Without surgery he may never walk again. He has three young children and no insurance. Help him stand on his feet again.',
    urgency: 'high', targetAmount: 250000, raisedAmount: 60000, condition: 'Spinal Fracture',
    imageUrl: 'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=800', active: true,
    createdAt: '2026-05-05', deadline: '2026-07-01'
  },
  {
    id: 'a6', patientId: 'p6', patientName: 'Hira Fatima', title: 'Save Little Hira – Only 5 Years Old',
    story: 'Hira Fatima is only 5 years old and has been admitted to the pediatric ward in Faisalabad with a critical condition. Her parents are daily-wage workers who cannot afford the cost of her treatment. Please help save this little girl.',
    urgency: 'critical', targetAmount: 180000, raisedAmount: 95000, condition: 'Pediatric Critical Care',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800', active: true,
    createdAt: '2026-05-06', deadline: '2026-06-10'
  },
  {
    id: 'a7', patientId: 'p7', patientName: 'Bashir Ahmed', title: "Bashir Ahmed's Cancer Treatment",
    story: 'Bashir Ahmed, 60, a retired man from Rawalpindi, has been diagnosed with cancer. His pension is not enough to cover chemotherapy. His children are trying their best but need community support to save their father.',
    urgency: 'high', targetAmount: 500000, raisedAmount: 130000, condition: 'Cancer',
    imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800', active: true,
    createdAt: '2026-05-07', deadline: '2026-08-01'
  },
  {
    id: 'a8', patientId: 'p8', patientName: 'Sana Akhtar', title: 'Sana Needs Kidney Dialysis',
    story: 'Sana Akhtar, 29, a teacher from Multan, has been diagnosed with kidney failure and requires regular dialysis. She lives alone and her salary barely covers rent. Help her continue her treatment and her life.',
    urgency: 'high', targetAmount: 360000, raisedAmount: 88000, condition: 'Kidney Failure',
    imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800', active: true,
    createdAt: '2026-05-08', deadline: '2026-07-30'
  },
];

// Clear any old cache versions on load
if (typeof window !== 'undefined') {
  const oldKeys = ['charity-portal-store', 'meri-hope-store', 'meri-hope-store-v2', 'meri-hope-store-v3'];
  oldKeys.forEach(k => localStorage.removeItem(k));
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      users: mockUsers,
      patients: mockPatients,
      doctors: mockDoctors,
      donations: mockDonations,
      appeals: mockAppeals,
      eligibilityRules: {
        maxIncome: 30000,
        minUrgencyLevel: 'medium',
        requiresVerification: true,
        minFundsAvailable: 5000,
      },

      login: (email, password) => {
        const users = get().users;
        const user = users.find(u => u.email === email);
        if (!user) return { success: false, message: 'User not found' };
        // Mock password check (in real app, use bcrypt)
        if (password.length < 6) return { success: false, message: 'Invalid password' };
        set({ user });
        return { success: true, message: 'Login successful' };
      },

      logout: () => set({ user: null }),

      register: (data) => {
        const users = get().users;
        if (users.find(u => u.email === data.email)) {
          return { success: false, message: 'Email already registered' };
        }
        const newUser: User = {
          id: `u${Date.now()}`,
          name: data.name || '',
          email: data.email || '',
          role: data.role || 'donor',
          verified: false,
          createdAt: new Date().toISOString().split('T')[0],
        };
        set(state => ({ users: [...state.users, newUser], user: newUser }));
        return { success: true, message: 'Registration successful' };
      },

      addPatient: (patientData) => {
        const eligible = get().checkEligibility(patientData);
        const newPatient: Patient = {
          ...patientData,
          id: `p${Date.now()}`,
          collectedFunds: 0,
          eligible,
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0],
        };
        set(state => ({ patients: [...state.patients, newPatient] }));
      },

      updatePatient: (id, data) => {
        set(state => ({
          patients: state.patients.map(p =>
            p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString().split('T')[0] } : p
          )
        }));
      },

      verifyPatient: (id) => {
        set(state => ({
          patients: state.patients.map(p =>
            p.id === id ? { ...p, verified: true, eligible: get().checkEligibility({ ...p, verified: true }), updatedAt: new Date().toISOString().split('T')[0] } : p
          )
        }));
      },

      rejectPatient: (id) => {
        set(state => ({
          patients: state.patients.map(p =>
            p.id === id ? { ...p, status: 'rejected', eligible: false, updatedAt: new Date().toISOString().split('T')[0] } : p
          )
        }));
      },

      addDoctor: (doctorData) => {
        const newDoctor: Doctor = {
          ...doctorData,
          id: `d${Date.now()}`,
          patientsAccepted: 0,
          createdAt: new Date().toISOString().split('T')[0],
        };
        set(state => ({ doctors: [...state.doctors, newDoctor] }));
      },

      updateDoctor: (id, data) => {
        set(state => ({
          doctors: state.doctors.map(d => d.id === id ? { ...d, ...data } : d)
        }));
      },

      verifyDoctor: (id) => {
        set(state => ({
          doctors: state.doctors.map(d => d.id === id ? { ...d, verified: true } : d)
        }));
      },

      addDonation: (donationData) => {
        const newDonation: Donation = {
          ...donationData,
          id: `dn${Date.now()}`,
          createdAt: new Date().toISOString().split('T')[0],
        };
        set(state => {
          const updatedPatients = donationData.patientId
            ? state.patients.map(p =>
                p.id === donationData.patientId
                  ? { ...p, collectedFunds: p.collectedFunds + donationData.amount }
                  : p
              )
            : state.patients;
          const updatedAppeals = donationData.patientId
            ? state.appeals.map(a =>
                a.patientId === donationData.patientId
                  ? { ...a, raisedAmount: a.raisedAmount + donationData.amount }
                  : a
              )
            : state.appeals;
          return {
            donations: [newDonation, ...state.donations],
            patients: updatedPatients,
            appeals: updatedAppeals,
          };
        });
      },

      addAppeal: (appealData) => {
        const newAppeal: Appeal = {
          ...appealData,
          id: `a${Date.now()}`,
          raisedAmount: 0,
          createdAt: new Date().toISOString().split('T')[0],
        };
        set(state => ({ appeals: [...state.appeals, newAppeal] }));
      },

      updateAppeal: (id, data) => {
        set(state => ({
          appeals: state.appeals.map(a => a.id === id ? { ...a, ...data } : a)
        }));
      },

      updateEligibilityRules: (rules) => {
        set({ eligibilityRules: rules });
        // Re-evaluate all patients
        set(state => ({
          patients: state.patients.map(p => ({
            ...p,
            eligible: get().checkEligibility(p),
          }))
        }));
      },

      checkEligibility: (patient) => {
        const rules = get().eligibilityRules;
        const urgencyOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        const minUrgencyValue = urgencyOrder[rules.minUrgencyLevel as keyof typeof urgencyOrder] || 2;
        const patientUrgencyValue = urgencyOrder[(patient.urgency as keyof typeof urgencyOrder)] || 0;

        if (rules.requiresVerification && !patient.verified) return false;
        if ((patient.incomeLevel || 0) > rules.maxIncome) return false;
        if (patientUrgencyValue < minUrgencyValue) return false;
        return true;
      },
    }),
    {
      name: 'meri-hope-store-v4',
      partialize: (state) => ({
        user: state.user,
        patients: state.patients,
        doctors: state.doctors,
        donations: state.donations,
        appeals: state.appeals,
        eligibilityRules: state.eligibilityRules,
        users: state.users,
      }),
    }
  )
);
