import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Heart, Calendar, AlertTriangle, Clock, ChevronRight, Plus, X } from 'lucide-react';
import { useStore } from '../store';
import { toast } from 'react-toastify';

const urgencyConfig = {
  critical: { label: 'Critical', color: 'bg-red-100 text-red-700', bar: 'bg-red-500', border: 'border-l-red-500' },
  high:     { label: 'High',     color: 'bg-orange-100 text-orange-700', bar: 'bg-orange-500', border: 'border-l-orange-500' },
  medium:   { label: 'Medium',   color: 'bg-yellow-100 text-yellow-700', bar: 'bg-yellow-500', border: 'border-l-yellow-400' },
  low:      { label: 'Low',      color: 'bg-green-100 text-green-700',   bar: 'bg-green-500',  border: 'border-l-green-500' },
};

export default function Appeals() {
  const { appeals, donations, patients, addAppeal } = useStore();

  const [search, setSearch] = useState('');
  const [filterUrgency, setFilterUrgency] = useState('all');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [showModal, setShowModal] = useState(false);

  // Submit appeal form state
  const [form, setForm] = useState({
    patientId: '', title: '', story: '', condition: '',
    urgency: 'high' as 'critical' | 'high' | 'medium' | 'low',
    targetAmount: '', deadline: '', imageUrl: '',
  });

  // Compute live raised amount per appeal from actual donations
  const liveAppeals = appeals
    .filter(a => a.active)
    .map(a => {
      const liveRaised = donations
        .filter(d => d.patientId === a.patientId)
        .reduce((s, d) => s + d.amount, 0);
      return { ...a, raisedAmount: liveRaised > 0 ? liveRaised : a.raisedAmount };
    });

  const totalRaised = liveAppeals.reduce((s, a) => s + a.raisedAmount, 0);
  const totalTarget = liveAppeals.reduce((s, a) => s + a.targetAmount, 0);

  const filtered = liveAppeals
    .filter(a => {
      const q = search.toLowerCase();
      if (search && !a.title.toLowerCase().includes(q) && !a.patientName.toLowerCase().includes(q) && !a.condition.toLowerCase().includes(q)) return false;
      if (filterUrgency !== 'all' && a.urgency !== filterUrgency) return false;
      return true;
    })
    .sort((a, b) => {
      const order = { critical: 4, high: 3, medium: 2, low: 1 };
      return (order[b.urgency] || 0) - (order[a.urgency] || 0);
    });

  const handleSubmitAppeal = () => {
    if (!form.title.trim()) return toast.error('Title is required');
    if (!form.story.trim()) return toast.error('Story is required');
    if (!form.condition.trim()) return toast.error('Condition is required');
    if (!form.targetAmount || Number(form.targetAmount) < 1) return toast.error('Enter a valid target amount');

    const patient = patients.find(p => p.id === form.patientId);
    addAppeal({
      patientId: form.patientId || `ext-${Date.now()}`,
      patientName: patient?.name || 'Unknown Patient',
      title: form.title,
      story: form.story,
      condition: form.condition,
      urgency: form.urgency,
      targetAmount: Number(form.targetAmount),
      imageUrl: form.imageUrl || undefined,
      active: true,
      deadline: form.deadline || undefined,
    });
    toast.success('Appeal submitted successfully!');
    setShowModal(false);
    setForm({ patientId: '', title: '', story: '', condition: '', urgency: 'high', targetAmount: '', deadline: '', imageUrl: '' });
  };

  return (
    <div className="bg-white min-h-screen pt-16">
      {/* Header */}
      <div className="bg-gradient-to-br from-rose-600 via-pink-600 to-red-600 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white text-xs font-medium px-3 py-1.5 rounded-full mb-6 border border-white/20">
            <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse" /> Live Appeals
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 max-w-xl leading-tight">Patient Appeals Awaiting Your Support</h1>
          <p className="text-rose-100 max-w-xl mb-10">Each appeal represents a real person fighting for their health. Your donation can change the outcome of their story.</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <div className="text-2xl font-bold">{liveAppeals.length}</div>
              <div className="text-xs text-rose-200 mt-1">Active Appeals</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <div className="text-2xl font-bold">Rs. {totalRaised.toLocaleString()}</div>
              <div className="text-xs text-rose-200 mt-1">Total Raised</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <div className="text-2xl font-bold">{totalTarget > 0 ? Math.round((totalRaised / totalTarget) * 100) : 0}%</div>
              <div className="text-xs text-rose-200 mt-1">Overall Progress</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <div className="text-2xl font-bold">{donations.length}</div>
              <div className="text-xs text-rose-200 mt-1">Total Donations</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-16 bg-white border-b border-gray-100 shadow-sm z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search appeals..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <select value={filterUrgency} onChange={e => setFilterUrgency(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500">
              <option value="all">All Urgency</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <div className="flex border border-gray-200 rounded-lg overflow-hidden">
              <button onClick={() => setView('grid')} className={`px-3 py-2 text-xs font-medium transition-colors ${view === 'grid' ? 'bg-rose-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}>Grid</button>
              <button onClick={() => setView('list')} className={`px-3 py-2 text-xs font-medium transition-colors ${view === 'list' ? 'bg-rose-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}>List</button>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" /> Submit Appeal
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-sm text-gray-500 mb-6">{filtered.length} active appeal{filtered.length !== 1 ? 's' : ''}</p>

        {view === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(appeal => {
              const progress = Math.min(100, Math.round((appeal.raisedAmount / appeal.targetAmount) * 100));
              const urg = urgencyConfig[appeal.urgency];
              const daysLeft = appeal.deadline
                ? Math.max(0, Math.ceil((new Date(appeal.deadline).getTime() - Date.now()) / 86400000))
                : null;

              return (
                <div key={appeal.id} className={`bg-white border-l-4 ${urg.border} border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow group`}>
                  <div className="relative h-52 overflow-hidden">
                    {appeal.imageUrl ? (
                      <img src={appeal.imageUrl} alt={appeal.patientName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center">
                        <Heart className="w-16 h-16 text-rose-300" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${urg.color}`}>{urg.label}</span>
                    </div>
                    {daysLeft !== null && (
                      <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                        <Clock className="w-3 h-3" /> {daysLeft}d left
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-white font-semibold text-sm">{appeal.patientName}</p>
                      <p className="text-white/80 text-xs">{appeal.condition}</p>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-semibold text-gray-900 mb-2">{appeal.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-3 mb-4 leading-relaxed">{appeal.story}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-gray-700">Rs. {appeal.raisedAmount.toLocaleString()}</span>
                        <span className="text-gray-400">of Rs. {appeal.targetAmount.toLocaleString()}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full ${urg.bar} rounded-full transition-all`} style={{ width: `${progress}%` }} />
                      </div>
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>{progress}% funded</span>
                        {appeal.deadline && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {appeal.deadline}</span>}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link to={`/donations?appeal=${appeal.id}`} className="flex-1 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold py-2.5 rounded-xl text-center transition-colors">
                        Donate Now
                      </Link>
                      <Link to={`/donations?appeal=${appeal.id}`} className="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(appeal => {
              const progress = Math.min(100, Math.round((appeal.raisedAmount / appeal.targetAmount) * 100));
              const urg = urgencyConfig[appeal.urgency];
              return (
                <div key={appeal.id} className={`bg-white border-l-4 ${urg.border} border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-shadow`}>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-shrink-0 w-full sm:w-24 h-24 rounded-xl overflow-hidden bg-gray-100">
                      {appeal.imageUrl ? (
                        <img src={appeal.imageUrl} alt={appeal.patientName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Heart className="w-8 h-8 text-gray-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{appeal.title}</h3>
                          <p className="text-sm text-gray-500">{appeal.patientName} · {appeal.condition}</p>
                        </div>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${urg.color}`}>{urg.label}</span>
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-2 mb-3">{appeal.story}</p>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="font-medium text-gray-700">Rs. {appeal.raisedAmount.toLocaleString()} raised</span>
                            <span className="text-gray-400">{progress}% of Rs. {appeal.targetAmount.toLocaleString()}</span>
                          </div>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className={`h-full ${urg.bar} rounded-full`} style={{ width: `${progress}%` }} />
                          </div>
                        </div>
                        <Link to={`/donations?appeal=${appeal.id}`} className="flex-shrink-0 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors">
                          Donate
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No appeals found</h3>
            <p className="text-gray-500 text-sm">Adjust your search filters or submit a new appeal</p>
          </div>
        )}
      </div>

      {/* Submit Appeal Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Submit a New Appeal</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link to Patient (Optional)</label>
                <select
                  value={form.patientId}
                  onChange={e => {
                    const p = patients.find(pt => pt.id === e.target.value);
                    setForm(f => ({ ...f, patientId: e.target.value, condition: p?.condition || f.condition }));
                  }}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="">— Select a registered patient —</option>
                  {patients.filter(p => p.status === 'active' || p.status === 'pending').map(p => (
                    <option key={p.id} value={p.id}>{p.name} – {p.condition}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Appeal Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Help Ahmed Recover from Surgery"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Medical Condition *</label>
                <input
                  type="text"
                  value={form.condition}
                  onChange={e => setForm(f => ({ ...f, condition: e.target.value }))}
                  placeholder="e.g. Cardiac Surgery, Cancer Treatment"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Patient's Story *</label>
                <textarea
                  value={form.story}
                  onChange={e => setForm(f => ({ ...f, story: e.target.value }))}
                  placeholder="Describe the patient's situation, why they need help, and how donations will be used..."
                  rows={4}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target Amount (Rs.) *</label>
                  <input
                    type="number"
                    value={form.targetAmount}
                    onChange={e => setForm(f => ({ ...f, targetAmount: e.target.value }))}
                    placeholder="e.g. 250000"
                    min="1"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Urgency *</label>
                  <select
                    value={form.urgency}
                    onChange={e => setForm(f => ({ ...f, urgency: e.target.value as any }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deadline (Optional)</label>
                  <input
                    type="date"
                    value={form.deadline}
                    onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (Optional)</label>
                  <input
                    type="url"
                    value={form.imageUrl}
                    onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))}
                    placeholder="https://..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitAppeal}
                  className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold py-3 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
                >
                  <Heart className="w-4 h-4" /> Submit Appeal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
