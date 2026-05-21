import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Shield, CheckCircle, TrendingUp, Users, Lock, ArrowRight, Copy } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useStore } from '../store';
import { toast } from 'react-toastify';

const PRESET_AMOUNTS = [100, 200, 500, 1000, 2000, 5000];

// Real payment accounts
const PAYMENT_ACCOUNTS = [
  { name: 'JazzCash', number: '+92 312 8808514', label: 'JazzCash / RAAST' },
  { name: 'Easypaisa', number: '0312 8808514', label: 'Easypaisa' },
  { name: 'Bank Transfer', number: 'PK11MEZN0011490113694167', label: 'MEZAN Bank (IBAN)' },
];

export default function Donations() {
  const { patients, donations, addDonation } = useStore();

  // Stats from real data
  const totalRaised = donations.reduce((s, d) => s + d.amount, 0);
  const avgDonation = Math.round(totalRaised / Math.max(1, donations.length));
  const maxDonation = Math.max(...donations.map(d => d.amount));

  // Chart: per-donor bar (non-anonymous, top 8)
  const donorChart = donations
    .filter(d => !d.anonymous && d.donorName !== 'Anonymous')
    .slice(0, 8)
    .map(d => ({ name: d.donorName.split(' ')[0], amount: d.amount }));

  // Patient funding progress
  const patientFunding = patients
    .filter(p => p.eligible && p.status === 'active')
    .sort((a, b) => (b.collectedFunds / b.requiredFunds) - (a.collectedFunds / a.requiredFunds));

  // Form state
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [selectedPatient, setSelectedPatient] = useState('');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [txId, setTxId] = useState('');
  const [platform, setPlatform] = useState('JazzCash');
  const [anonymous, setAnonymous] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const finalAmount = Number(customAmount) || Number(amount) || 0;
  const targetPatient = patients.find(p => p.id === selectedPatient);

  const handleSubmit = () => {
    if (!finalAmount || finalAmount < 1) return toast.error('Please select or enter a donation amount');
    if (!donorName.trim()) return toast.error('Please enter your name');
    if (!txId.trim()) return toast.error('Please enter your transaction ID');
    addDonation({
      donorName: anonymous ? 'Anonymous' : donorName,
      donorEmail,
      amount: finalAmount,
      patientId: selectedPatient || undefined,
      patientName: targetPatient?.name,
      message: `Transaction ID: ${txId}`,
      anonymous,
      method: platform,
    });
    setSubmitted(true);
  };

  const urgencyColor: Record<string, string> = {
    critical: 'bg-red-500', high: 'bg-orange-500', medium: 'bg-yellow-400', low: 'bg-green-500',
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-emerald-200 text-xs font-medium uppercase tracking-wider mb-2">Transparent Giving</p>
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">Donate & Track Every Rupee</h1>
          <p className="text-emerald-100 max-w-xl mb-8">Send via JazzCash or Easypaisa, then confirm your transaction below. Every donation is publicly logged.</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Collected', value: `Rs. ${totalRaised.toLocaleString()}` },
              { label: 'Total Donors', value: donations.length },
              { label: 'Avg. Donation', value: `Rs. ${avgDonation.toLocaleString()}` },
              { label: 'Largest Gift', value: `Rs. ${maxDonation.toLocaleString()}` },
            ].map(s => (
              <div key={s.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold">{s.value}</div>
                <div className="text-xs text-emerald-200 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT: How to Donate + Confirm Form */}
          <div className="lg:col-span-2 space-y-6">

            {/* Step 1: Send Payment */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-1">Step 1 — Send Your Donation</h2>
              <p className="text-sm text-gray-500 mb-5">Transfer to any of the accounts below, then confirm in Step 2.</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {PAYMENT_ACCOUNTS.map(acc => (
                  <div key={acc.name} className="border border-gray-200 rounded-xl p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">{acc.label}</p>
                    <p className="font-mono text-sm font-bold text-gray-900">{acc.number}</p>
                    <button
                      onClick={() => { navigator.clipboard.writeText(acc.number); toast.success(`${acc.name} number copied!`); }}
                      className="mt-2 flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700"
                    >
                      <Copy className="w-3 h-3" /> Copy
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 2: Confirm Donation */}
            {submitted ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
                <p className="text-gray-500 mb-1">Your donation of <span className="font-semibold text-gray-900">Rs. {finalAmount.toLocaleString()}</span> has been recorded.</p>
                {targetPatient && <p className="text-gray-500 mb-4">Directed to <span className="text-emerald-600 font-medium">{targetPatient.name}</span>.</p>}
                <div className="bg-gray-50 rounded-xl p-4 text-left text-sm space-y-2 mb-6">
                  <div className="flex justify-between"><span className="text-gray-500">Donor</span><span className="font-medium">{anonymous ? 'Anonymous' : donorName}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Amount</span><span className="font-medium text-emerald-600">Rs. {finalAmount.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Platform</span><span className="font-medium">{platform}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Tx ID</span><span className="font-mono text-xs text-gray-400">{txId}</span></div>
                </div>
                <button
                  onClick={() => { setSubmitted(false); setAmount(''); setCustomAmount(''); setTxId(''); setDonorName(''); setDonorEmail(''); }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
                >
                  Donate Again
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-5">Step 2 — Confirm Your Donation</h2>

                {/* Patient selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Donate To (Optional)</label>
                  <select
                    value={selectedPatient}
                    onChange={e => setSelectedPatient(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">General Fund</option>
                    {patients.filter(p => p.eligible && p.status === 'active').map(p => (
                      <option key={p.id} value={p.id}>{p.name} – {p.condition}</option>
                    ))}
                  </select>
                  {targetPatient && (
                    <div className="mt-3 p-3 bg-emerald-50 rounded-xl flex items-center gap-3">
                      {targetPatient.imageUrl && <img src={targetPatient.imageUrl} alt={targetPatient.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{targetPatient.name}</p>
                        <div className="h-1.5 bg-emerald-200 rounded-full mt-1 overflow-hidden">
                          <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${Math.min(100, Math.round((targetPatient.collectedFunds / targetPatient.requiredFunds) * 100))}%` }} />
                        </div>
                        <p className="text-xs text-emerald-600 mt-0.5">Rs. {targetPatient.collectedFunds.toLocaleString()} of Rs. {targetPatient.requiredFunds.toLocaleString()}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Amount */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount (Rs.)</label>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    {PRESET_AMOUNTS.map(amt => (
                      <button
                        key={amt}
                        onClick={() => { setAmount(String(amt)); setCustomAmount(''); }}
                        className={`py-2.5 rounded-xl text-sm font-semibold border transition-all ${amount === String(amt) && !customAmount ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-300'}`}
                      >
                        Rs. {amt}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    placeholder="Custom amount"
                    value={customAmount}
                    onChange={e => { setCustomAmount(e.target.value); setAmount(''); }}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    min="1"
                  />
                  {finalAmount > 0 && <p className="text-sm text-emerald-600 font-medium mt-1">Donating: Rs. {finalAmount.toLocaleString()}</p>}
                </div>

                {/* Donor info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Name *</label>
                    <input type="text" value={donorName} onChange={e => setDonorName(e.target.value)} placeholder="Full name" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email (Optional)</label>
                    <input type="email" value={donorEmail} onChange={e => setDonorEmail(e.target.value)} placeholder="email@example.com" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                </div>

                {/* Platform + Tx ID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Platform *</label>
                    <select value={platform} onChange={e => setPlatform(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                      <option>JazzCash</option>
                      <option>Easypaisa</option>
                      <option>Bank Transfer</option>
                      <option>RAAST</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Transaction ID *</label>
                    <input type="text" value={txId} onChange={e => setTxId(e.target.value)} placeholder="e.g. 711808464078" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                </div>

                <label className="flex items-center gap-3 cursor-pointer mb-5">
                  <div onClick={() => setAnonymous(!anonymous)} className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ${anonymous ? 'bg-emerald-600 border-emerald-600' : 'border-gray-300'}`}>
                    {anonymous && <CheckCircle className="w-3 h-3 text-white fill-white" />}
                  </div>
                  <span className="text-sm text-gray-600">Keep my name anonymous in public records</span>
                </label>

                <div className="flex items-start gap-2 mb-5">
                  <Lock className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-400">Your transaction ID is used only to verify your donation. We never ask for passwords or PINs.</p>
                </div>

                <button
                  onClick={handleSubmit}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Heart className="w-4 h-4 fill-white" /> Confirm Donation of Rs. {finalAmount > 0 ? finalAmount.toLocaleString() : '—'}
                </button>
              </div>
            )}
          </div>

          {/* RIGHT: Sidebar */}
          <div className="space-y-6">
            {/* Trust badges */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-semibold text-gray-900 mb-4 text-sm">Why Donate With Us?</h3>
              <div className="space-y-3">
                {[
                  { icon: Shield, text: '100% transparent records' },
                  { icon: CheckCircle, text: 'All patients verified' },
                  { icon: TrendingUp, text: 'Real-time fund tracking' },
                  { icon: Users, text: 'Community-driven giving' },
                ].map(item => (
                  <div key={item.text} className="flex items-center gap-3">
                    <div className="w-7 h-7 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <span className="text-xs text-gray-600">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Patient progress */}
            <div className="bg-gradient-to-br from-emerald-600 to-green-600 rounded-2xl p-5 text-white">
              <h3 className="font-semibold mb-4 text-sm">Patient Funding Progress</h3>
              {patientFunding.slice(0, 4).map(p => {
                const pct = Math.min(100, Math.round((p.collectedFunds / p.requiredFunds) * 100));
                return (
                  <div key={p.id} className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="truncate mr-2">{p.name}</span>
                      <span className="flex-shrink-0">{pct}%</span>
                    </div>
                    <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-white rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Recent donations */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-semibold text-gray-900 mb-4 text-sm">Recent Donations</h3>
              <div className="space-y-3">
                {donations.slice(0, 6).map(d => (
                  <div key={d.id} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold text-emerald-600">
                      {d.anonymous || d.donorName === 'Anonymous' ? '?' : d.donorName.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between items-baseline">
                        <p className="text-xs font-medium text-gray-900 truncate">{d.anonymous || d.donorName === 'Anonymous' ? 'Anonymous' : d.donorName}</p>
                        <span className="text-xs font-bold text-emerald-600 ml-2">Rs. {d.amount}</span>
                      </div>
                      <p className="text-xs text-gray-400">{d.method} · {d.createdAt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Charts + Full Transaction Table */}
        <div className="mt-10 space-y-8">
          {/* Bar chart */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Donation by Donor</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={donorChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `Rs.${v}`} />
                <Tooltip formatter={(v: any) => [`Rs. ${Number(v).toLocaleString()}`, 'Donated']} />
                <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Patient funding table */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-gray-900">Per-Patient Funding Progress</h3>
              <Link to="/patients" className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="space-y-4">
              {patientFunding.slice(0, 6).map(p => {
                const pct = Math.min(100, Math.round((p.collectedFunds / p.requiredFunds) * 100));
                return (
                  <div key={p.id} className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-32 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                      <p className="text-xs text-gray-400 truncate">{p.condition}</p>
                    </div>
                    <div className="flex-1">
                      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full ${urgencyColor[p.urgency] || 'bg-emerald-500'} rounded-full`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-right min-w-[80px]">
                      <p className="text-sm font-bold text-gray-900">{pct}%</p>
                      <p className="text-xs text-gray-400">Rs. {p.collectedFunds.toLocaleString()}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Full transaction log */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">All Transactions</h3>
              <span className="text-xs text-gray-400">{donations.length} records</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Donor</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Platform</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Transaction ID</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {donations.map(d => (
                    <tr key={d.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-xs font-bold text-emerald-600">
                            {d.anonymous || d.donorName === 'Anonymous' ? '?' : d.donorName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{d.anonymous || d.donorName === 'Anonymous' ? 'Anonymous' : d.donorName}</p>
                            <p className="text-xs text-gray-400">{d.method}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 font-bold text-emerald-600">Rs. {d.amount.toLocaleString()}</td>
                      <td className="px-5 py-3 text-gray-500 text-xs">{d.method}</td>
                      <td className="px-5 py-3 text-gray-400 text-xs font-mono">
                        {d.message?.replace('Transaction ID: ', '') || '—'}
                      </td>
                      <td className="px-5 py-3 text-gray-400 text-xs">{d.createdAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
