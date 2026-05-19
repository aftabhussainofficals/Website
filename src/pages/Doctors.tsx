import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Stethoscope, CheckCircle, UserPlus } from 'lucide-react';
import { useStore } from '../store';

const specializations = ['All', 'Oncology', 'Cardiology', 'Pediatric Hematology', 'Nephrology', 'Neurology', 'Orthopedics', 'General Surgery'];

export default function Doctors() {
  const { doctors, patients } = useStore();
  const [search, setSearch] = useState('');
  const [filterSpec, setFilterSpec] = useState('All');
  const [filterAvail, setFilterAvail] = useState('all');
  const [filterVerified, setFilterVerified] = useState('all');

  const filtered = doctors.filter(d => {
    const q = search.toLowerCase();
    if (search && !d.name.toLowerCase().includes(q) && !d.specialization.toLowerCase().includes(q) && !d.hospital.toLowerCase().includes(q)) return false;
    if (filterSpec !== 'All' && d.specialization !== filterSpec) return false;
    if (filterAvail === 'available' && !d.available) return false;
    if (filterAvail === 'unavailable' && d.available) return false;
    if (filterVerified === 'verified' && !d.verified) return false;
    if (filterVerified === 'pending' && d.verified) return false;
    return true;
  });

  return (
    <div className="bg-white min-h-screen pt-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-emerald-200 text-sm font-medium mb-2 uppercase tracking-wider">Our Doctors</p>
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">Dedicated Medical Professionals</h1>
          <p className="text-emerald-100 max-w-xl">Our verified doctors volunteer their expertise to help patients who cannot afford care. Browse their profiles and specializations.</p>
          <div className="flex flex-wrap gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3 text-center">
              <div className="text-2xl font-bold">{doctors.length}</div>
              <div className="text-xs text-emerald-200">Total Doctors</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3 text-center">
              <div className="text-2xl font-bold">{doctors.filter(d => d.verified).length}</div>
              <div className="text-xs text-emerald-200">Verified</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3 text-center">
              <div className="text-2xl font-bold">{doctors.filter(d => d.available).length}</div>
              <div className="text-xs text-emerald-200">Available Now</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3 text-center">
              <div className="text-2xl font-bold">{doctors.reduce((s, d) => s + d.patientsAccepted, 0)}</div>
              <div className="text-xs text-emerald-200">Patients Helped</div>
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
                placeholder="Search doctors..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <select value={filterSpec} onChange={e => setFilterSpec(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
              {specializations.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={filterAvail} onChange={e => setFilterAvail(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
              <option value="all">All Availability</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
            <select value={filterVerified} onChange={e => setFilterVerified(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
              <option value="all">All Status</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
            </select>
            <Link to="/register?role=doctor" className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
              <UserPlus className="w-4 h-4" /> Join as Doctor
            </Link>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-sm text-gray-500 mb-6">{filtered.length} doctor{filtered.length !== 1 ? 's' : ''} found</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(doctor => {
            const doctorPatients = patients.filter(p => p.assignedDoctor === doctor.id);
            return (
              <div key={doctor.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow group">
                {/* Photo */}
                <div className="relative h-56 bg-gray-100 overflow-hidden">
                  <img
                    src={doctor.imageUrl || `https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400`}
                    alt={doctor.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    style={doctor.id === 'd1' ? { objectPosition: 'center -230px' } : doctor.id === 'd2' ? { objectPosition: 'center -55px' } : undefined}
                  />
                  <div className="absolute top-3 right-3 flex flex-col gap-1">
                    {doctor.verified && (
                      <span className="inline-flex items-center gap-1 bg-white text-emerald-600 text-xs font-medium px-2 py-1 rounded-full shadow-sm">
                        <CheckCircle className="w-3 h-3" /> Verified
                      </span>
                    )}
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full shadow-sm ${doctor.available ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${doctor.available ? 'bg-white' : 'bg-gray-400'}`} />
                      {doctor.available ? 'Available' : 'Busy'}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                  <p className="text-sm text-emerald-600 font-medium mb-1">{doctor.specialization}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-400 mb-3">
                    <MapPin className="w-3 h-3" /> {doctor.hospital}, {doctor.location}
                  </div>

                  <p className="text-xs text-gray-500 line-clamp-2 mb-3">{doctor.bio}</p>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-gray-50 rounded-lg p-2 text-center">
                      <div className="text-sm font-bold text-gray-900">{doctor.experience}y</div>
                      <div className="text-xs text-gray-400">Experience</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2 text-center">
                      <div className="text-sm font-bold text-gray-900">{doctor.patientsAccepted}</div>
                      <div className="text-xs text-gray-400">Patients Helped</div>
                    </div>
                  </div>

                  {doctorPatients.length > 0 && (
                    <div className="mb-3 p-2.5 bg-blue-50 rounded-lg">
                      <p className="text-xs text-blue-700 font-medium mb-1">Current Patients</p>
                      {doctorPatients.slice(0, 2).map(p => (
                        <p key={p.id} className="text-xs text-blue-600">{p.name} · {p.condition}</p>
                      ))}
                    </div>
                  )}

                  <div className="text-xs text-gray-400 mb-3">
                    License: {doctor.licenseNumber}
                  </div>

                  <Link
                    to={`/donations`}
                    className="block w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold py-2.5 rounded-xl text-center transition-colors"
                  >
                    Support Their Patients
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Stethoscope className="w-7 h-7 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No doctors found</h3>
            <p className="text-gray-500 text-sm">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
