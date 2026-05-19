import { Link } from 'react-router-dom';
import { Heart, Shield, Award, Globe, CheckCircle, ArrowRight } from 'lucide-react';
import Logo from '../components/Logo';

const team = [
  { name: 'Muhammad Nadeem', img: '/images/Students/MuhammadNadeem.jpg' },
  { name: 'Aftab Hussain', img: '/images/Students/AftabHussain.jpg' },
  { name: 'Hafsa Aslam', img: '/images/Students/HafsaAslam.jpg' },
  { name: 'Dua Zainab Zahra', img: '/images/Students/DuaZainabZahra.jpg' },
];

const values = [
  { icon: Heart, title: 'Compassion First', desc: 'Every decision we make is guided by a deep care for the patients we serve.' },
  { icon: Shield, title: 'Total Transparency', desc: 'We publish detailed fund usage reports so donors always know where their money goes.' },
  { icon: Award, title: 'Medical Excellence', desc: 'We partner only with board-certified, peer-reviewed medical professionals.' },
  { icon: Globe, title: 'Universal Access', desc: 'We believe quality healthcare should not be determined by wealth or geography.' },
];

const milestones = [
  { year: '2024', event: 'Meri Hope founded by a group of students to help underprivileged patients in Pakistan' },
  { year: '2025', event: 'Launched digital platform connecting patients with verified doctors and donors' },
  { year: '2026', event: 'First real donations received via JazzCash and Easypaisa from community supporters' },
];

export default function About() {
  return (
    <div className="bg-white min-h-screen pt-16">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <Logo iconSize={64} showText={false} />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Healthcare is a right,<br />not a privilege.
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto leading-relaxed">
            Meri Hope was founded on the belief that no person should suffer or die because they cannot afford medical care. We bridge the gap between need and access.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-blue-600 font-medium text-sm uppercase tracking-wider mb-3">Our Mission</p>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Connecting need with care</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>Meri Hope is a student-built digital platform that connects underprivileged patients in Pakistan who cannot afford medical care with verified doctors and generous donors who want to help.</p>
                <p>We operate a verification and eligibility system to ensure every rupee donated reaches a patient who truly needs it. Each patient application is reviewed before being listed publicly.</p>
                <p>All donations are received via JazzCash and Easypaisa and are fully transparent — every transaction is logged and publicly visible on the Donations page.</p>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                {['Student Initiative', 'Pakistan-Based', 'Fully Transparent', 'Real Patient Data'].map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full">
                    <CheckCircle className="w-3.5 h-3.5" /> {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&q=80" alt="Patient care" className="rounded-2xl h-48 w-full object-cover" />
              <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&q=80" alt="Pediatric care" className="rounded-2xl h-48 w-full object-cover mt-8" />
              <img src="https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=400&q=80" alt="Surgery" className="rounded-2xl h-48 w-full object-cover" />
              <div className="rounded-2xl h-48 w-full mt-8 bg-blue-50 flex items-center justify-center p-4">
                <Logo iconSize={64} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-blue-600 font-medium text-sm uppercase tracking-wider mb-3">Our Values</p>
            <h2 className="text-3xl font-bold text-gray-900">What we stand for</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(v => (
              <div key={v.title} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                  <v.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-blue-600 font-medium text-sm uppercase tracking-wider mb-3">Our Journey</p>
            <h2 className="text-3xl font-bold text-gray-900">How we got here</h2>
          </div>
          <div className="relative">
            <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 bg-blue-100 -translate-x-1/2" />
            <div className="space-y-8">
              {milestones.map((m, i) => (
                <div key={m.year} className={`relative flex gap-6 ${i % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'} items-start`}>
                  <div className={`sm:w-1/2 ${i % 2 === 0 ? 'sm:text-right sm:pr-8' : 'sm:text-left sm:pl-8'} pl-10 sm:pl-0`}>
                    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                      <div className="text-blue-600 font-bold text-lg mb-1">{m.year}</div>
                      <p className="text-gray-600 text-sm">{m.event}</p>
                    </div>
                  </div>
                  <div className="absolute left-4 sm:left-1/2 top-5 w-3 h-3 bg-blue-600 rounded-full -translate-x-1/2 flex-shrink-0 ring-4 ring-blue-100" />
                  <div className="hidden sm:block sm:w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-blue-600 font-medium text-sm uppercase tracking-wider mb-3">Our Team</p>
            <h2 className="text-3xl font-bold text-gray-900">Who is behind this mission</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map(member => (
              <div key={member.name} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow text-center group">
                <div className="h-52 overflow-hidden bg-gray-100">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    style={{
                      objectPosition:
                        member.name === 'Muhammad Nadeem' ? 'center -35px' :
                        member.name === 'Aftab Hussain' ? 'center -135x' :
                        member.name === 'Hafsa Aslam' ? 'center -195px' :
                        member.name === 'Dua Zainab Zahra' ? 'center -195px' :
                        'center'
                    }}
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900">{member.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Join us in our mission</h2>
          <p className="text-gray-500 mb-8">Whether as a doctor, patient, or donor — there's a place for you in this community.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-xl transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
