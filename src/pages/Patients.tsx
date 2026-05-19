import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, UserPlus, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { useStore } from '../store';

const urgencyConfig = {
  critical: { label: 'Critical', color: 'bg-red-100 text-red-700 border-red-200' },
  high: { label: 'High', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  medium: { label: 'Medium', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  low: { label: 'Low', color: 'bg-green-100 text-green-700 border-green-200' },
};

const statusConfig = {
  active: { label: 'Active', icon: CheckCircle, color: 'text-green-600' },
  pending: { label: 'Pending', icon: Clock, color: 'text-yellow-600' },
  treated: { label: 'Treated', icon: CheckCircle, color: 'text-blue-600' },
  rejected: { label: 'Rejected', icon: XCircle, color: 'text-red-500' },
};

export default function Patients() {
  const { patients, doctors } = useStore();
  const [search, setSearch] = useState('');
  const [filterUrgency, setFilterUrgency] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterEligible, setFilterEligible] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const filtered = patients
    .filter(p => {
      const q = search.toLowerCase();
      if (search && !p.name.toLowerCase().includes(q) && !p.condition.toLowerCase().includes(q) && !p.location.toLowerCase().includes(q)) return false;
      if (filterUrgency !== 'all' && p.urgency !== filterUrgency) return false;
      if (filterStatus !== 'all' && p.status !== filterStatus) return false;
      if (filterEligible === 'eligible' && !p.eligible) return false;
      if (filterEligible === 'ineligible' && p.eligible) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'urgency') {
        const order = { critical: 4, high: 3, medium: 2, low: 1 };
        return (order[b.urgency] || 0) - (order[a.urgency] || 0);
      }
      if (sortBy === 'funds') return (b.requiredFunds - b.collectedFunds) - (a.requiredFunds - a.collectedFunds);
      if (sortBy === 'progress') return (b.collectedFunds / b.requiredFunds) - (a.collectedFunds / a.requiredFunds);
      return 0;
    });

  return (
    <div className="bg-white min-h-screen pt-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-blue-200 text-sm font-medium mb-2 uppercase tracking-wider">Our Patients</p>
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">Patients Seeking Care</h1>
          <p className="text-blue-100 max-w-xl">Browse verified patients who need medical support. Each profile includes their condition, funding status, and assigned doctor.</p>
          <div className="flex flex-wrap gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3 text-center">
              <div className="text-2xl font-bold">{patients.length}</div>
              <div className="text-xs text-blue-200">Total Patients</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3 text-center">
              <div className="text-2xl font-bold">{patients.filter(p => p.eligible).length}</div>
              <div className="text-xs text-blue-200">Eligible</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3 text-center">
              <div className="text-2xl font-bold">{patients.filter(p => p.urgency === 'critical').length}</div>
              <div className="text-xs text-blue-200">Critical Cases</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3 text-center">
              <div className="text-2xl font-bold">{patients.filter(p => p.status === 'treated').length}</div>
              <div className="text-xs text-blue-200">Treated</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-16 bg-white border-b border-gray-100 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search patients..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select value={filterUrgency} onChange={e => setFilterUrgency(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option value="all">All Urgency</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="treated">Treated</option>
              <option value="rejected">Rejected</option>
            </select>
            <select value={filterEligible} onChange={e => setFilterEligible(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option value="all">All Eligibility</option>
              <option value="eligible">Eligible Only</option>
              <option value="ineligible">Ineligible</option>
            </select>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option value="date">Newest First</option>
              <option value="urgency">By Urgency</option>
              <option value="funds">Funds Needed</option>
              <option value="progress">Progress</option>
            </select>
            <Link to="/register?role=patient" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
              <UserPlus className="w-4 h-4" /> Register Patient
            </Link>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500">{filtered.length} patient{filtered.length !== 1 ? 's' : ''} found</p>
        </div>

        <div className="space-y-4">
          {filtered.map(patient => {
            const progress = Math.min(100, Math.round((patient.collectedFunds / patient.requiredFunds) * 100));
            const urgency = urgencyConfig[patient.urgency];
            const status = statusConfig[patient.status];
            const StatusIcon = status.icon;
            const assignedDoc = doctors.find(d => d.id === patient.assignedDoctor);

            return (
              <div key={patient.id} className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden">
                      {patient.imageUrl ? (
                        <img src={patient.imageUrl} alt={patient.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-300">
                          {patient.name.charAt(0)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                        <p className="text-sm text-gray-500">{patient.age} yrs · {patient.gender} · {patient.location}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full border ${urgency.color}`}>
                          {urgency.label}
                        </span>
                        <span className={`inline-flex items-center gap-1 text-xs font-medium ${status.color}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {status.label}
                        </span>
                        {patient.eligible ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                            <CheckCircle className="w-3 h-3" /> Eligible
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
                            <XCircle className="w-3 h-3" /> Ineligible
                          </span>
                        )}
                        {!patient.verified && (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
                            <AlertCircle className="w-3 h-3" /> Unverified
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-blue-700 font-medium mb-1">{patient.condition}</p>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">{patient.description}</p>

                    <div className="flex flex-wrap gap-4 text-xs text-gray-400 mb-3">
                      <span>Registered: {patient.createdAt}</span>
                      {assignedDoc && <span>Doctor: <span className="text-blue-600">{assignedDoc.name}</span></span>}
                      <span>Income: ${patient.incomeLevel.toLocaleString()}/yr</span>
                    </div>

                    {/* Progress */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600 font-medium">${patient.collectedFunds.toLocaleString()} raised</span>
                        <span className="text-gray-400">Goal: ${patient.requiredFunds.toLocaleString()} · {progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            progress >= 80 ? 'bg-green-500' :
                            progress >= 50 ? 'bg-blue-500' :
                            progress >= 25 ? 'bg-yellow-500' : 'bg-red-400'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="flex sm:flex-col gap-2 sm:w-32">
                    <Link to={`/donations?patient=${patient.id}`} className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg text-center transition-colors">
                      Donate
                    </Link>
                    <Link to={`/appeals`} className="flex-1 sm:flex-none bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-medium px-4 py-2 rounded-lg text-center transition-colors border border-gray-200">
                      Full Story
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-7 h-7 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No patients found</h3>
            <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
