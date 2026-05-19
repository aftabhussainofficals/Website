import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Shield, LogOut, Edit2, Save, X } from 'lucide-react';
import { useStore } from '../store';
import { toast } from 'react-toastify';

export default function Profile() {
  const { user, logout, patients, doctors, donations } = useStore();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-16">
        <div className="text-center">
          <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Not Signed In</h2>
          <p className="text-gray-500 mb-4">Please sign in to view your profile.</p>
          <button onClick={() => navigate('/login')} className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-medium">
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const userPatient = patients.find(p => p.email === user.email);
  const userDoctor = doctors.find(d => d.email === user.email);
  const userDonations = donations.filter(d => d.donorEmail === user.email);
  const totalGiven = userDonations.reduce((s, d) => s + d.amount, 0);

  const roleColors: Record<string, string> = {
    admin: 'bg-purple-100 text-purple-700',
    doctor: 'bg-emerald-100 text-emerald-700',
    patient: 'bg-blue-100 text-blue-700',
    donor: 'bg-orange-100 text-orange-700',
  };

  const handleSave = () => {
    toast.success('Profile updated successfully');
    setEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.info('Signed out successfully');
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
          <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-600" />
          <div className="px-6 pb-6">
            <div className="flex items-end justify-between -mt-10 mb-4">
              <div className="w-20 h-20 bg-white border-4 border-white rounded-2xl shadow-sm flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
                <User className="w-10 h-10 text-blue-500" />
              </div>
              <div className="flex gap-2 pt-12">
                {editing ? (
                  <>
                    <button onClick={handleSave} className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors">
                      <Save className="w-3.5 h-3.5" /> Save
                    </button>
                    <button onClick={() => setEditing(false)} className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-medium px-3 py-2 rounded-lg transition-colors">
                      <X className="w-3.5 h-3.5" /> Cancel
                    </button>
                  </>
                ) : (
                  <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-medium px-3 py-2 rounded-lg transition-colors">
                    <Edit2 className="w-3.5 h-3.5" /> Edit Profile
                  </button>
                )}
                <button onClick={handleLogout} className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-medium px-3 py-2 rounded-lg transition-colors">
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              </div>
            </div>

            {editing ? (
              <div className="space-y-3">
                <input value={name} onChange={e => setName(e.target.value)} className="block w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Full Name" />
                <input value={phone} onChange={e => setPhone(e.target.value)} className="block w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Phone Number" />
                <input value={location} onChange={e => setLocation(e.target.value)} className="block w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Location" />
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${roleColors[user.role]}`}>{user.role}</span>
                  {user.verified && (
                    <span className="text-xs font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Shield className="w-3 h-3" /> Verified
                    </span>
                  )}
                  <span className="text-xs text-gray-400">Member since {user.createdAt}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {user.email}</span>
                  {phone && <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {phone}</span>}
                  {location && <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {location}</span>}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Stats */}
        {user.role === 'donor' && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white border border-gray-100 rounded-2xl p-5 text-center shadow-sm">
              <div className="text-2xl font-bold text-gray-900">{userDonations.length}</div>
              <div className="text-xs text-gray-500 mt-1">Donations Made</div>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-5 text-center shadow-sm">
              <div className="text-2xl font-bold text-green-600">${totalGiven.toLocaleString()}</div>
              <div className="text-xs text-gray-500 mt-1">Total Given</div>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-5 text-center shadow-sm">
              <div className="text-2xl font-bold text-blue-600">{new Set(userDonations.map(d => d.patientId).filter(Boolean)).size}</div>
              <div className="text-xs text-gray-500 mt-1">Patients Supported</div>
            </div>
          </div>
        )}

        {/* Role-specific content */}
        {user.role === 'patient' && userPatient && (
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 mb-6">
            <h2 className="font-semibold text-gray-900 mb-4">My Medical Profile</h2>
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div><span className="text-gray-400">Condition:</span> <span className="font-medium">{userPatient.condition}</span></div>
              <div><span className="text-gray-400">Urgency:</span> <span className="font-medium capitalize">{userPatient.urgency}</span></div>
              <div><span className="text-gray-400">Status:</span> <span className="font-medium capitalize">{userPatient.status}</span></div>
              <div><span className="text-gray-400">Eligible:</span> <span className={`font-medium ${userPatient.eligible ? 'text-green-600' : 'text-red-500'}`}>{userPatient.eligible ? 'Yes' : 'No'}</span></div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Funding Progress</span>
                <span className="font-medium">{Math.round((userPatient.collectedFunds / userPatient.requiredFunds) * 100)}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: `${Math.min(100, Math.round((userPatient.collectedFunds / userPatient.requiredFunds) * 100))}%` }} />
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>${userPatient.collectedFunds.toLocaleString()} raised</span>
                <span>Goal: ${userPatient.requiredFunds.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {user.role === 'doctor' && userDoctor && (
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 mb-6">
            <h2 className="font-semibold text-gray-900 mb-4">My Doctor Profile</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-400">Specialization:</span> <span className="font-medium">{userDoctor.specialization}</span></div>
              <div><span className="text-gray-400">Hospital:</span> <span className="font-medium">{userDoctor.hospital}</span></div>
              <div><span className="text-gray-400">Experience:</span> <span className="font-medium">{userDoctor.experience} years</span></div>
              <div><span className="text-gray-400">Patients:</span> <span className="font-medium">{userDoctor.patientsAccepted}</span></div>
              <div><span className="text-gray-400">License:</span> <span className="font-mono text-xs">{userDoctor.licenseNumber}</span></div>
              <div><span className="text-gray-400">Available:</span> <span className={`font-medium ${userDoctor.available ? 'text-green-600' : 'text-red-500'}`}>{userDoctor.available ? 'Yes' : 'No'}</span></div>
            </div>
          </div>
        )}

        {/* Donation History */}
        {userDonations.length > 0 && (
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Donation History</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {userDonations.map(d => (
                <div key={d.id} className="px-5 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{d.patientName || 'General Fund'}</p>
                    <p className="text-xs text-gray-400">{d.method} · {d.createdAt}</p>
                    {d.message && <p className="text-xs text-gray-500 italic mt-0.5">"{d.message}"</p>}
                  </div>
                  <span className="text-sm font-bold text-green-600">+${d.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
