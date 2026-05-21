import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight, Play, Users, Stethoscope, DollarSign, TrendingUp, Shield, Clock, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../store';

const heroSlides = [
  {
    video: null,
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1920&q=80',
    title: 'Every Life Deserves\nQuality Healthcare',
    subtitle: 'Connecting patients in need with compassionate doctors and generous donors.',
  },
  {
    video: null,
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1920&q=80',
    title: 'Your Donation\nChanges Lives',
    subtitle: 'Every rupee donated goes directly to verified patients who cannot afford treatment.',
  },
  {
    video: null,
    image: 'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=1920&q=80',
    title: 'Doctors Who\nCare Deeply',
    subtitle: 'Verified medical professionals helping those in need across Pakistan.',
  },
];

const galleryImages = [
  { url: '/images/gallary/IMG-20260515-WA0031.jpg', label: 'Our Work' },
  { url: '/images/gallary/IMG-20260515-WA0056.jpg', label: 'Our Work' },
  { url: '/images/gallary/IMG-20260515-WA0064.jpg', label: 'Our Work' },
  { url: '/images/gallary/IMG-20260515-WA0066.jpg', label: 'Our Work' },
  { url: '/images/gallary/IMG-20260515-WA0081.jpg', label: 'Our Work' },
  { url: '/images/gallary/IMG-20260516-WA0049.jpg', label: 'Our Work' },
  { url: '/images/gallary/IMG-20260519-WA0011.jpg', label: 'Our Work' },
];

export default function Home() {
  const [slide, setSlide] = useState(0);
  const [videoPlaying, setVideoPlaying] = useState(true);
  const { patients, doctors, donations } = useStore();
  const totalRaised = donations.reduce((sum, d) => sum + d.amount, 0);

  useEffect(() => {
    if (!videoPlaying) return;
    const timer = setInterval(() => {
      setSlide(s => (s + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [videoPlaying]);

  const currentSlide = heroSlides[slide];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex items-center overflow-hidden">
        {/* Background Image with Ken Burns effect */}
        <div className="absolute inset-0">
          {heroSlides.map((s, i) => (
            <div
              key={i}
              className={`absolute inset-0 transition-opacity duration-1000 ${i === slide ? 'opacity-100' : 'opacity-0'}`}
            >
              <img
                src={s.image}
                alt=""
                className="w-full h-full object-cover scale-105 animate-slow-zoom"
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 whitespace-pre-line">
              {currentSlide.title}
            </h1>
            <p className="text-lg text-white/80 mb-8 leading-relaxed max-w-lg">
              {currentSlide.subtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="\/donations" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5">
                <Heart className="w-4 h-4 fill-white" />
                Donate Now
              </Link>
              <Link to="/appeals" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold px-6 py-3 rounded-xl transition-all border border-white/30">
                <Play className="w-4 h-4" />
                View Appeals
              </Link>
              <Link to="/register" className="inline-flex items-center gap-2 bg-white text-gray-900 font-semibold px-6 py-3 rounded-xl transition-all hover:bg-gray-100">
                Get Help <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Slide Controls */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
          <button onClick={() => setSlide(s => (s - 1 + heroSlides.length) % heroSlides.length)} className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex gap-2">
            {heroSlides.map((_, i) => (
              <button key={i} onClick={() => setSlide(i)} className={`h-1.5 rounded-full transition-all ${i === slide ? 'w-8 bg-white' : 'w-1.5 bg-white/40'}`} />
            ))}
          </div>
          <button onClick={() => setSlide(s => (s + 1) % heroSlides.length)} className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
          <button onClick={() => setVideoPlaying(!videoPlaying)} className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors ml-2">
            {videoPlaying ? (
              <span className="flex gap-0.5"><span className="w-1 h-3 bg-white rounded" /><span className="w-1 h-3 bg-white rounded" /></span>
            ) : (
              <Play className="w-3 h-3 fill-white" />
            )}
          </button>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="bg-blue-600 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            {[
              { value: patients.length, label: 'Patients Helped', suffix: '+' },
              { value: doctors.length, label: 'Verified Doctors', suffix: '+' },
              { value: Math.round(totalRaised / 1000), label: 'Thousand Raised', prefix: '$', suffix: 'K' },
              { value: patients.filter(p => p.status === 'treated').length + 12, label: 'Lives Changed', suffix: '+' },
            ].map((stat, i) => (
              <div key={i} className="py-2">
                <div className="text-2xl lg:text-3xl font-bold">
                  {stat.prefix}{stat.value.toLocaleString()}{stat.suffix}
                </div>
                <div className="text-xs text-blue-100 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-blue-600 font-medium text-sm uppercase tracking-wider mb-3">How It Works</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Simple steps to making a difference</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { icon: Users, step: '01', title: 'Register & Apply', desc: 'Patients submit their medical details and supporting documents. Doctors register with their credentials and specialization.' },
              { icon: Shield, step: '02', title: 'Verify & Match', desc: 'Our team reviews applications, verifies medical documents, checks eligibility, and matches patients with qualified doctors.' },
              { icon: Heart, step: '03', title: 'Donate & Heal', desc: 'Donors browse verified appeals, contribute to patient funds, and track treatment progress through to recovery.' },
            ].map(item => (
              <div key={item.step} className="relative text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-2xl mb-6 group-hover:bg-blue-100 transition-colors">
                  <item.icon className="w-7 h-7 text-blue-600" />
                </div>
                <div className="text-xs font-bold text-blue-200 mb-2 tracking-widest">{item.step}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <p className="text-blue-600 font-medium text-sm uppercase tracking-wider mb-2">Gallery</p>
          <h2 className="text-3xl font-bold text-gray-900">Moments of hope &amp; healing</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2 px-4 sm:px-6 lg:px-8">
          {galleryImages.map((img, i) => (
            <div key={i} className="relative h-48 overflow-hidden rounded-xl group">
              <img src={img.url} alt={img.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-end p-3">
                <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">{img.label}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: 'Verified & Secure', desc: 'All doctors verified by medical boards. Patients reviewed by our team. Financial transactions via JazzCash and Easypaisa.' },
              { icon: Clock, title: 'Real-Time Tracking', desc: 'Track donation usage, treatment milestones, and patient funding progress in real time.' },
              { icon: Award, title: 'Fully Transparent', desc: 'All donations are publicly logged with transaction IDs. Every rupee is accounted for on the Donations page.' },
            ].map(item => (
              <div key={item.title} className="flex gap-4 p-6 rounded-2xl bg-gray-50">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white rounded-full" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white/10 rounded-2xl mb-6">
            <TrendingUp className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to make a difference?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Whether you're a patient seeking help, a doctor offering care, or a donor wanting to give — this is where hope begins.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="\/donations" className="inline-flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-3 rounded-xl transition-colors shadow-lg">
              <DollarSign className="w-4 h-4" /> Donate Today
            </Link>
            <Link to="/register" className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-white font-semibold px-8 py-3 rounded-xl transition-colors border border-blue-400">
              <Stethoscope className="w-4 h-4" /> Join Our Network
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
