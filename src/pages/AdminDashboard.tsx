import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Stethoscope, DollarSign, Settings, CheckCircle,
  XCircle, AlertCircle, Shield, BarChart2, Eye, Trash2,
  Search, RefreshCw
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { useStore } from '../store';
import { toast } from 'react-toastify';

type TabType = 'overview' | 'patients' | 'doctors' | 'donations' | 'eligibility' | 'analytics';

const donationTrend = [
  { month: 'May 12', amount: 200 }, { month: 'May 13', amount: 4778 },
];

const specialtyData = [
  { name: 'Oncology', value: 1 }, { name: 'Cardiology', value: 2 },
  { name: 'Nephrology', value: 1 }, { name: 'Pediatrics', value: 2 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export default function AdminDashboard() {
  const [tab, setTab] = useState<TabType>('overview');
  const [search, setSearch] = useState('');
  const { user, patients, doctors, donations, users, eligibilityRules,
    verifyPatient, rejectPatient, verifyDoctor, updateEligibilityRules } = useStore();
  const navigate = useNavigate();

  // Rule state
  const [maxIncome, setMaxIncome] = useState(String(eligibilityRules.maxIncome));
  const [minUrgency, setMinUrgency] = useState(eligibilityRules.minUrgencyLevel);
  const [requireVerif, setRequireVerif] = useState(eligibilityRules.requiresVerification);
  const [minFunds, setMinFunds] = useState(String(eligibilityRules.minFundsAvailable));

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-500 mb-4">You need admin privileges to view this page.</p>
          <button onClick={() => navigate('/login')} className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-medium">
            Sign In as Admin
          </button>
        </div>
      </div>
    );
  }

  const totalDonations = donations.reduce((s, d) => s + d.amount, 0);
  const pendingPatients = patients.filter(p => !p.verified).length;
  const pendingDoctors = doctors.filter(d => !d.verified).length;

  const handleSaveRules = () => {
    updateEligibilityRules({
      maxIncome: Number(maxIncome),
      minUrgencyLevel: minUrgency,
      requiresVerification: requireVerif,
      minFundsAvailable: Number(minFunds),
    });
    toast.success('Eligibility rules updated successfully');
  };

  const tabs: { id: TabType; label: string; icon: any; badge?: number }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'patients', label: 'Patients', icon: Users, badge: pendingPatients },
    { id: 'doctors', label: 'Doctors', icon: Stethoscope, badge: pendingDoctors },
    { id: 'donations', label: 'Donations', icon: DollarSign },
    { id: 'eligibility', label: 'Eligibility', icon: Settings },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  ];

  return (
    <div className="bg-gray-50 min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Welcome back, {user.name}</p>
          </div>
          <div className="flex items-center gap-2">
            {(pendingPatients + pendingDoctors) > 0 && (
              <div className="flex items-center gap-2 bg-amber-50 text-amber-700 text-sm px-3 py-2 rounded-xl border border-amber-200">
                <AlertCircle className="w-4 h-4" />
                {pendingPatients + pendingDoctors} pending reviews
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-2xl p-1 border border-gray-100 shadow-sm mb-8 overflow-x-auto">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                tab === t.id ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <t.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{t.label}</span>
              {t.badge !== undefined && t.badge > 0 && (
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${tab === t.id ? 'bg-white text-blue-600' : 'bg-red-500 text-white'}`}>
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Patients', value: patients.length, sub: `${patients.filter(p => p.eligible).length} eligible`, icon: Users, color: 'bg-blue-50 text-blue-600', trend: '+12%' },
                { label: 'Active Doctors', value: doctors.filter(d => d.verified).length, sub: `${doctors.filter(d => d.available).length} available`, icon: Stethoscope, color: 'bg-emerald-50 text-emerald-600', trend: '+8%' },
                { label: 'Total Donations', value: `$${(totalDonations / 1000).toFixed(1)}K`, sub: `${donations.length} donations`, icon: DollarSign, color: 'bg-violet-50 text-violet-600', trend: '+24%' },
                { label: 'Cases Treated', value: patients.filter(p => p.status === 'treated').length + 12, sub: 'All time', icon: CheckCircle, color: 'bg-amber-50 text-amber-600', trend: '+5%' },
              ].map(card => (
                <div key={card.label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color}`}>
                      <card.icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">{card.trend}</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{card.value}</div>
                  <div className="text-sm font-medium text-gray-600">{card.label}</div>
                  <div className="text-xs text-gray-400 mt-1">{card.sub}</div>
                </div>
              ))}
            </div>

            {/* Recent Activity + Pending */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">Pending Verifications</h3>
                <div className="space-y-3">
                  {patients.filter(p => !p.verified).slice(0, 3).map(p => (
                    <div key={p.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-xl">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{p.name}</p>
                        <p className="text-xs text-gray-500">{p.condition} · Patient</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { verifyPatient(p.id); toast.success(`${p.name} verified`); }} className="p-1.5 bg-green-100 hover:bg-green-200 rounded-lg transition-colors">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </button>
                        <button onClick={() => { rejectPatient(p.id); toast.info(`${p.name} rejected`); }} className="p-1.5 bg-red-100 hover:bg-red-200 rounded-lg transition-colors">
                          <XCircle className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {doctors.filter(d => !d.verified).slice(0, 2).map(d => (
                    <div key={d.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{d.name}</p>
                        <p className="text-xs text-gray-500">{d.specialization} · Doctor</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { verifyDoctor(d.id); toast.success(`Dr. ${d.name} verified`); }} className="p-1.5 bg-green-100 hover:bg-green-200 rounded-lg transition-colors">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </button>
                        <button className="p-1.5 bg-red-100 hover:bg-red-200 rounded-lg transition-colors">
                          <XCircle className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {patients.filter(p => !p.verified).length === 0 && doctors.filter(d => !d.verified).length === 0 && (
                    <div className="text-center py-4 text-sm text-gray-400">All verifications up to date ✓</div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">Recent Donations</h3>
                <div className="space-y-3">
                  {donations.slice(0, 5).map(d => (
                    <div key={d.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-xs font-bold text-blue-600">
                          {d.donorName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{d.anonymous ? 'Anonymous' : d.donorName}</p>
                          <p className="text-xs text-gray-400">{d.patientName || 'General'} · {d.createdAt}</p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-green-600">+${d.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">All Registered Users</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Email</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Role</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-gray-50">
                        <td className="px-5 py-3 font-medium text-gray-900">{u.name}</td>
                        <td className="px-5 py-3 text-gray-500">{u.email}</td>
                        <td className="px-5 py-3">
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${
                            u.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                            u.role === 'doctor' ? 'bg-emerald-100 text-emerald-700' :
                            u.role === 'patient' ? 'bg-blue-100 text-blue-700' :
                            'bg-orange-100 text-orange-700'
                          }`}>{u.role}</span>
                        </td>
                        <td className="px-5 py-3">
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${u.verified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                            {u.verified ? 'Verified' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-gray-400">{u.createdAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Patients Tab */}
        {tab === 'patients' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search patients..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Patient</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Condition</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Urgency</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Eligible</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Progress</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {patients.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase())).map(p => {
                      const pct = Math.min(100, Math.round((p.collectedFunds / p.requiredFunds) * 100));
                      return (
                        <tr key={p.id} className="hover:bg-gray-50">
                          <td className="px-5 py-3">
                            <div>
                              <p className="font-medium text-gray-900">{p.name}</p>
                              <p className="text-xs text-gray-400">{p.email}</p>
                            </div>
                          </td>
                          <td className="px-5 py-3 text-gray-600">{p.condition}</td>
                          <td className="px-5 py-3">
                            <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${
                              p.urgency === 'critical' ? 'bg-red-100 text-red-700' :
                              p.urgency === 'high' ? 'bg-orange-100 text-orange-700' :
                              p.urgency === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>{p.urgency}</span>
                          </td>
                          <td className="px-5 py-3">
                            {p.eligible ? (
                              <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-1 rounded-full">
                                <CheckCircle className="w-3 h-3" /> Eligible
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                <XCircle className="w-3 h-3" /> No
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-3">
                            <div className="w-24">
                              <div className="text-xs text-gray-500 mb-1">{pct}%</div>
                              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${pct}%` }} />
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex gap-2">
                              {!p.verified && (
                                <>
                                  <button onClick={() => { verifyPatient(p.id); toast.success('Patient verified'); }} className="p-1.5 bg-green-100 hover:bg-green-200 rounded-lg transition-colors" title="Verify">
                                    <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                                  </button>
                                  <button onClick={() => { rejectPatient(p.id); toast.info('Patient rejected'); }} className="p-1.5 bg-red-100 hover:bg-red-200 rounded-lg transition-colors" title="Reject">
                                    <XCircle className="w-3.5 h-3.5 text-red-500" />
                                  </button>
                                </>
                              )}
                              <button className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors" title="View">
                                <Eye className="w-3.5 h-3.5 text-gray-500" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Doctors Tab */}
        {tab === 'doctors' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Doctor</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Specialization</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Hospital</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {doctors.map(d => (
                    <tr key={d.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3">
                        <div>
                          <p className="font-medium text-gray-900">{d.name}</p>
                          <p className="text-xs text-gray-400">{d.email}</p>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-gray-600">{d.specialization}</td>
                      <td className="px-5 py-3 text-gray-500">{d.hospital}</td>
                      <td className="px-5 py-3">
                        <div className="flex flex-col gap-1">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full w-fit ${d.verified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                            {d.verified ? 'Verified' : 'Pending'}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full w-fit ${d.available ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                            {d.available ? 'Available' : 'Busy'}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex gap-2">
                          {!d.verified && (
                            <button onClick={() => { verifyDoctor(d.id); toast.success('Doctor verified'); }} className="p-1.5 bg-green-100 hover:bg-green-200 rounded-lg transition-colors">
                              <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                            </button>
                          )}
                          <button className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                            <Eye className="w-3.5 h-3.5 text-gray-500" />
                          </button>
                          <button className="p-1.5 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                            <Trash2 className="w-3.5 h-3.5 text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Donations Tab */}
        {tab === 'donations' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Total Collected', value: `$${totalDonations.toLocaleString()}`, color: 'text-green-600', bg: 'bg-green-50' },
                { label: 'Average Donation', value: `$${Math.round(totalDonations / donations.length).toLocaleString()}`, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Largest Donation', value: `$${Math.max(...donations.map(d => d.amount)).toLocaleString()}`, color: 'text-violet-600', bg: 'bg-violet-50' },
              ].map(s => (
                <div key={s.label} className={`${s.bg} rounded-2xl p-5`}>
                  <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-sm text-gray-600 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">All Donations</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Donor</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Patient</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Method</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {donations.map(d => (
                      <tr key={d.id} className="hover:bg-gray-50">
                        <td className="px-5 py-3">
                          <p className="font-medium text-gray-900">{d.anonymous ? 'Anonymous' : d.donorName}</p>
                          <p className="text-xs text-gray-400">{d.donorEmail}</p>
                        </td>
                        <td className="px-5 py-3 font-bold text-green-600">${d.amount.toLocaleString()}</td>
                        <td className="px-5 py-3 text-gray-500">{d.patientName || 'General Fund'}</td>
                        <td className="px-5 py-3">
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{d.method}</span>
                        </td>
                        <td className="px-5 py-3 text-gray-400">{d.createdAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Eligibility Tab */}
        {tab === 'eligibility' && (
          <div className="max-w-2xl space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Settings className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Eligibility Configuration</h3>
                  <p className="text-xs text-gray-500">Adjust the criteria that determine patient eligibility</p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Annual Income ($)</label>
                  <input
                    type="number"
                    value={maxIncome}
                    onChange={e => setMaxIncome(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-400 mt-1">Patients with income above this threshold will not be eligible</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Urgency Level</label>
                  <select
                    value={minUrgency}
                    onChange={e => setMinUrgency(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="low">Low (include all)</option>
                    <option value="medium">Medium (exclude low)</option>
                    <option value="high">High (critical + high only)</option>
                    <option value="critical">Critical only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Available Funds ($)</label>
                  <input
                    type="number"
                    value={minFunds}
                    onChange={e => setMinFunds(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-400 mt-1">Minimum pool of funds that must be available to accept a new patient</p>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Require Document Verification</p>
                    <p className="text-xs text-gray-500">Patient must have verified documents to be eligible</p>
                  </div>
                  <button
                    onClick={() => setRequireVerif(!requireVerif)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${requireVerif ? 'bg-blue-600' : 'bg-gray-300'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${requireVerif ? 'left-6' : 'left-1'}`} />
                  </button>
                </div>

                <div className="bg-amber-50 rounded-xl p-4">
                  <p className="text-xs font-medium text-amber-800 mb-1">Current Impact</p>
                  <p className="text-xs text-amber-700">
                    With current rules: <strong>{patients.filter(p => p.eligible).length} of {patients.length}</strong> patients are eligible
                  </p>
                </div>

                <button
                  onClick={handleSaveRules}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" /> Save & Recalculate Eligibility
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {tab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="font-semibold text-gray-900 mb-4">Donation Trend (2024)</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={donationTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `$${v / 1000}K`} />
                    <Tooltip formatter={(v: any) => [`$${Number(v).toLocaleString()}`, 'Donations']} />
                    <Line type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4, fill: '#3b82f6' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="font-semibold text-gray-900 mb-4">Specialties Distribution</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={specialtyData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                      {specialtyData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-2 mt-2">
                  {specialtyData.map((s, i) => (
                    <div key={s.name} className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i] }} />
                      <span className="text-xs text-gray-600">{s.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 lg:col-span-2">
                <h3 className="font-semibold text-gray-900 mb-4">Monthly Donations by Method</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={donationTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `$${v / 1000}K`} />
                    <Tooltip formatter={(v: any) => [`$${Number(v).toLocaleString()}`, 'Amount']} />
                    <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'New Patients (This Month)', value: patients.filter(p => p.createdAt >= '2024-03-01').length },
                { label: 'Doctors Onboarded', value: doctors.filter(d => d.verified).length },
                { label: 'Total Donations', value: `$${totalDonations.toLocaleString()}` },
                { label: 'Treatment Rate', value: `${Math.round((patients.filter(p => p.status === 'treated').length / Math.max(1, patients.length)) * 100)}%` },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-1">{s.value}</div>
                  <div className="text-xs text-gray-500">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
