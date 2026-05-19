import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, Phone, MapPin, FileText, Stethoscope, Upload, ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react';
import { useStore } from '../store';
import { toast } from 'react-toastify';
import Logo from '../components/Logo';

type RoleType = 'patient' | 'doctor' | 'donor';

const SPECIALIZATIONS = ['Oncology', 'Cardiology', 'Neurology', 'Pediatrics', 'Pediatric Hematology', 'Nephrology', 'Orthopedics', 'General Surgery', 'Emergency Medicine', 'Internal Medicine'];
const CONDITIONS = ['Cancer', 'Heart Disease', 'Kidney Disease', 'Neurological Disorder', 'Diabetes Complications', 'Spinal Injury', 'Burns', 'Genetic Disorder', 'Other'];
const URGENCY_OPTIONS = ['critical', 'high', 'medium', 'low'];

function StepIndicator({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all ${
            i < current ? 'bg-green-500 text-white' :
            i === current ? 'bg-blue-600 text-white' :
            'bg-gray-100 text-gray-400'
          }`}>
            {i < current ? <CheckCircle className="w-4 h-4" /> : i + 1}
          </div>
          <span className={`text-xs hidden sm:block ${i === current ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>{step}</span>
          {i < steps.length - 1 && <div className={`w-8 h-0.5 ${i < current ? 'bg-green-400' : 'bg-gray-200'}`} />}
        </div>
      ))}
    </div>
  );
}

export default function Register() {
  const [searchParams] = useSearchParams();
  const initialRole = (searchParams.get('role') as RoleType) || 'donor';

  const [role, setRole] = useState<RoleType>(initialRole);
  const [step, setStep] = useState(0);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  // Common fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');

  // Patient fields
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [condition, setCondition] = useState('');
  const [urgency, setUrgency] = useState('high');
  const [requiredFunds, setRequiredFunds] = useState('');
  const [incomeLevel, setIncomeLevel] = useState('');
  const [description, setDescription] = useState('');
  const [appealTitle, setAppealTitle] = useState('');
  const [appealStory, setAppealStory] = useState('');

  // Doctor fields
  const [specialization, setSpecialization] = useState('');
  const [experience, setExperience] = useState('');
  const [hospital, setHospital] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [bio, setBio] = useState('');

  const { register, addPatient, addDoctor, addAppeal } = useStore();
  const navigate = useNavigate();

  const roleSteps = {
    patient: ['Account', 'Medical Details', 'Appeal', 'Review'],
    doctor: ['Account', 'Professional Info', 'Documents', 'Review'],
    donor: ['Account', 'Profile', 'Review'],
  };

  const steps = roleSteps[role];

  const handleNext = () => {
    if (step === 0) {
      if (!name.trim()) return toast.error('Please enter your name');
      if (!email.trim() || !email.includes('@')) return toast.error('Please enter a valid email');
      if (password.length < 6) return toast.error('Password must be at least 6 characters');
    }
    setStep(s => Math.min(s + 1, steps.length - 1));
  };

  const handleBack = () => setStep(s => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));

    const userResult = register({ name, email, password, role });

    if (!userResult.success) {
      toast.error(userResult.message);
      setLoading(false);
      return;
    }

    if (role === 'patient') {
      addPatient({
        userId: `u${Date.now()}`,
        name, age: Number(age), gender, condition, urgency: urgency as any,
        requiredFunds: Number(requiredFunds), incomeLevel: Number(incomeLevel),
        verified: false, assignedDoctor: undefined, status: 'pending',
        documents: [], description, location, phone, email,
      });
      if (appealTitle && appealStory) {
        addAppeal({
          patientId: `p${Date.now()}`,
          patientName: name,
          title: appealTitle,
          story: appealStory,
          urgency: urgency as any,
          targetAmount: Number(requiredFunds),
          condition,
          active: true,
          deadline: '',
        });
      }
    } else if (role === 'doctor') {
      addDoctor({
        userId: `u${Date.now()}`,
        name, specialization, experience: Number(experience),
        hospital, licenseNumber, verified: false, available: true,
        email, phone, bio, location, documents: [],
      });
    }

    toast.success('Registration successful! Welcome to Meri Hope.');
    setLoading(false);
    navigate('/');
  };

  const renderStep = () => {
    // Step 0: Account (all roles)
    if (step === 0) return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com" className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 6 characters" className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="City, State" className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      </div>
    );

    // Patient Step 1: Medical Details
    if (role === 'patient' && step === 1) return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Age *</label>
            <input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="Age" className="w-full py-3 px-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" min="1" max="120" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
            <select value={gender} onChange={e => setGender(e.target.value)} className="w-full py-3 px-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option value="">Select</option>
              <option>Male</option><option>Female</option><option>Non-binary</option><option>Prefer not to say</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Medical Condition *</label>
          <select value={condition} onChange={e => setCondition(e.target.value)} className="w-full py-3 px-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            <option value="">Select condition</option>
            {CONDITIONS.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Urgency Level *</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {URGENCY_OPTIONS.map(u => (
              <button key={u} type="button" onClick={() => setUrgency(u)} className={`py-2.5 rounded-xl text-xs font-semibold capitalize border transition-all ${urgency === u ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'}`}>{u}</button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Required Funds ($) *</label>
            <input type="number" value={requiredFunds} onChange={e => setRequiredFunds(e.target.value)} placeholder="50000" className="w-full py-3 px-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" min="1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Annual Income ($) *</label>
            <input type="number" value={incomeLevel} onChange={e => setIncomeLevel(e.target.value)} placeholder="20000" className="w-full py-3 px-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" min="0" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Medical Description *</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe your condition, treatment needed, and current situation..." rows={4} className="w-full py-3 px-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Upload Medical Documents</label>
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-blue-300 transition-colors cursor-pointer">
            <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Click to upload or drag & drop</p>
            <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG up to 10MB each</p>
          </div>
        </div>
      </div>
    );

    // Patient Step 2: Appeal
    if (role === 'patient' && step === 2) return (
      <div className="space-y-4">
        <div className="bg-blue-50 rounded-xl p-4 mb-2">
          <p className="text-sm text-blue-700 font-medium mb-1">Create Your Appeal (Optional)</p>
          <p className="text-xs text-blue-500">An appeal helps donors understand your situation and raises funds faster.</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Appeal Title</label>
          <input type="text" value={appealTitle} onChange={e => setAppealTitle(e.target.value)} placeholder="e.g. Help me fight cancer" className="w-full py-3 px-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Your Story</label>
          <textarea value={appealStory} onChange={e => setAppealStory(e.target.value)} placeholder="Share your personal story — who you are, your family, your struggle, and why you need help..." rows={6} className="w-full py-3 px-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          <p className="text-xs text-gray-400 mt-1">{appealStory.length}/1000 characters</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Appeal Photo</label>
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-blue-300 transition-colors cursor-pointer">
            <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Upload a photo for your appeal</p>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG, max 5MB</p>
          </div>
        </div>
      </div>
    );

    // Doctor Step 1: Professional Info
    if (role === 'doctor' && step === 1) return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Specialization *</label>
          <select value={specialization} onChange={e => setSpecialization(e.target.value)} className="w-full py-3 px-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            <option value="">Select specialization</option>
            {SPECIALIZATIONS.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience *</label>
            <input type="number" value={experience} onChange={e => setExperience(e.target.value)} placeholder="10" className="w-full py-3 px-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" min="0" max="60" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">License Number *</label>
            <input type="text" value={licenseNumber} onChange={e => setLicenseNumber(e.target.value)} placeholder="MD-XXXX-XX" className="w-full py-3 px-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Hospital / Institution *</label>
          <input type="text" value={hospital} onChange={e => setHospital(e.target.value)} placeholder="Hospital or clinic name" className="w-full py-3 px-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Professional Bio</label>
          <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Describe your experience, qualifications, and motivation to help..." rows={4} className="w-full py-3 px-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
        </div>
      </div>
    );

    // Doctor Step 2: Documents
    if (role === 'doctor' && step === 2) return (
      <div className="space-y-4">
        <div className="bg-emerald-50 rounded-xl p-4 mb-2">
          <p className="text-sm text-emerald-700 font-medium mb-1">Document Verification</p>
          <p className="text-xs text-emerald-600">Please upload all required documents. Your application will be reviewed within 2-3 business days.</p>
        </div>
        {[
          { label: 'Medical License', required: true },
          { label: 'Board Certification', required: true },
          { label: 'Medical School Diploma', required: false },
          { label: 'Professional ID', required: false },
        ].map(doc => (
          <div key={doc.label}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {doc.label} {doc.required && <span className="text-red-500">*</span>}
            </label>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex items-center justify-between hover:border-emerald-300 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-500">Upload {doc.label}</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 rounded-lg px-3 py-1.5 transition-colors">
                <Upload className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-xs font-medium text-gray-600">Browse</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );

    // Donor Step 1
    if (role === 'donor' && step === 1) return (
      <div className="space-y-4">
        <div className="bg-orange-50 rounded-xl p-4">
          <p className="text-sm text-orange-700 font-medium mb-1">Donor Profile</p>
          <p className="text-xs text-orange-600">As a donor, you can browse patients and appeals, donate securely, and track the impact of your contributions.</p>
        </div>
        <div className="space-y-3">
          <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer">
            <input type="checkbox" className="rounded" />
            <span className="text-sm text-gray-700">I consent to receiving impact updates by email</span>
          </label>
          <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer">
            <input type="checkbox" className="rounded" />
            <span className="text-sm text-gray-700">I want monthly newsletters about patient progress</span>
          </label>
          <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer">
            <input type="checkbox" className="rounded" />
            <span className="text-sm text-gray-700">I'm interested in corporate matching opportunities</span>
          </label>
        </div>
      </div>
    );

    // Review step (always last)
    return (
      <div className="space-y-4">
        <div className="bg-gray-50 rounded-2xl p-5 space-y-3">
          <h3 className="font-semibold text-gray-900 text-sm">Review Your Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Name</span><span className="font-medium">{name}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Email</span><span className="font-medium">{email}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Role</span><span className="font-medium capitalize">{role}</span></div>
            {phone && <div className="flex justify-between"><span className="text-gray-500">Phone</span><span className="font-medium">{phone}</span></div>}
            {role === 'patient' && (
              <>
                <div className="flex justify-between"><span className="text-gray-500">Age</span><span className="font-medium">{age}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Condition</span><span className="font-medium">{condition}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Urgency</span><span className="font-medium capitalize">{urgency}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Funds Needed</span><span className="font-medium">${Number(requiredFunds).toLocaleString()}</span></div>
              </>
            )}
            {role === 'doctor' && (
              <>
                <div className="flex justify-between"><span className="text-gray-500">Specialization</span><span className="font-medium">{specialization}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Hospital</span><span className="font-medium">{hospital}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">License</span><span className="font-medium">{licenseNumber}</span></div>
              </>
            )}
          </div>
        </div>
        <label className="flex items-start gap-3 p-4 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer">
          <input type="checkbox" className="rounded mt-0.5" required />
          <span className="text-sm text-gray-700">I agree to the <a href="#" className="text-blue-600">Terms of Service</a> and <a href="#" className="text-blue-600">Privacy Policy</a>. I confirm all information provided is accurate and truthful.</span>
        </label>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-10 px-4">
      <div className="max-w-lg mx-auto">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <Logo iconSize={48} showText={false} />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Join Meri Hope</h1>
          <p className="text-gray-500 text-sm mt-1">Create your account</p>
        </div>

        {/* Role Selection */}
        {step === 0 && (
          <div className="flex gap-2 mb-6 bg-gray-100 rounded-xl p-1">
            {(['patient', 'doctor', 'donor'] as RoleType[]).map(r => (
              <button key={r} onClick={() => { setRole(r); setStep(0); }} className={`flex-1 py-2 rounded-lg text-xs font-semibold capitalize transition-all ${role === r ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                {r === 'doctor' && <Stethoscope className="w-3 h-3 inline mr-1" />}
                {r === 'patient' && <User className="w-3 h-3 inline mr-1" />}
                {r === 'donor' && <Heart className="w-3 h-3 inline mr-1" />}
                {r}
              </button>
            ))}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
          <StepIndicator steps={steps} current={step} />
          <h2 className="text-lg font-semibold text-gray-900 mb-5">{steps[step]}</h2>

          {renderStep()}

          <div className="flex gap-3 mt-6">
            {step > 0 && (
              <button onClick={handleBack} className="flex items-center gap-2 px-5 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            )}
            {step < steps.length - 1 ? (
              <button onClick={handleNext} className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors text-sm">
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={loading} className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm">
                {loading ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Creating account...</> : <><CheckCircle className="w-4 h-4" /> Create Account</>}
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account? <Link to="/login" className="text-blue-600 font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
