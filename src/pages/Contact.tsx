import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, MessageCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const faqs = [
  { q: 'How do I know my donation is being used correctly?', a: 'We publish detailed fund usage reports quarterly. Every donation is tracked and attributed to specific patients. You can see in real time how much of your donation has been spent on treatment.' },
  { q: 'How long does patient verification take?', a: 'Our verification process typically takes 2-5 business days. We review medical records, financial documents, and contact the applicants healthcare providers.' },
  { q: 'Can I donate to a specific patient?', a: 'Yes! When donating, simply select the patient from our verified patient list. You can browse all active appeals and choose who to support.' },
  { q: 'What makes doctors on this platform trustworthy?', a: 'All doctors are verified through medical licensing boards, credential checks, peer reviews, and board certifications before being allowed on the platform.' },
  { q: 'Are my donations tax-deductible?', a: 'Yes. Meri Hope is a registered 501(c)(3) nonprofit. All donations are tax-deductible and you will receive an official tax receipt by email.' },
];

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return toast.error('Please fill all required fields');
    await new Promise(r => setTimeout(r, 1000));
    setSent(true);
    toast.success('Your message has been sent!');
  };

  return (
    <div className="bg-white min-h-screen pt-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">Get In Touch</p>
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">We're Here to Help</h1>
          <p className="text-gray-300 max-w-xl">Have a question about your donation, a patient application, or want to volunteer? Reach out to our team.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
              <div className="space-y-4">
                {[
                  { icon: Mail, label: 'Email', value: 'merihope@gmail.com', sub: 'We respond within 24 hours' },
                  { icon: Phone, label: 'Phone', value: '0300-0000000', sub: 'Mon–Fri, 9am–5pm PKT' },
                  { icon: MapPin, label: 'Location', value: 'Lahore, Pakistan', sub: '' },
                  { icon: Clock, label: 'Office Hours', value: 'Monday – Friday', sub: '9:00 AM – 5:00 PM PKT' },
                ].map(item => (
                  <div key={item.label} className="flex gap-4">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{item.label}</p>
                      <p className="font-medium text-gray-900">{item.value}</p>
                      <p className="text-xs text-gray-500">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Department Contacts</h3>
              <div className="space-y-2">
                {[
                  { dept: 'Patient Support', email: 'merihope.patients@gmail.com' },
                  { dept: 'Doctor Onboarding', email: 'merihope.doctors@gmail.com' },
                  { dept: 'Donor Relations', email: 'merihope.donors@gmail.com' },
                ].map(d => (
                  <div key={d.dept} className="flex justify-between items-center text-sm py-2 border-b border-gray-50">
                    <span className="text-gray-600">{d.dept}</span>
                    <a href={`mailto:${d.email}`} className="text-blue-600 hover:text-blue-700 text-xs">{d.email}</a>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle className="w-4 h-4 text-blue-600" />
                <p className="text-sm font-medium text-blue-900">Live Chat</p>
              </div>
              <p className="text-xs text-blue-700 mb-3">Chat with our support team in real time during office hours.</p>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 rounded-xl transition-colors">
                Start Chat
              </button>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8">
              {sent ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-500 mb-6">Thanks for reaching out. Our team will get back to you within 24 hours.</p>
                  <button onClick={() => { setSent(false); setName(''); setEmail(''); setSubject(''); setMessage(''); }} className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-xl transition-colors text-sm">
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                      <select value={subject} onChange={e => setSubject(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                        <option value="">Select a topic</option>
                        <option>Patient Application</option>
                        <option>Doctor Registration</option>
                        <option>Donation Inquiry</option>
                        <option>Technical Support</option>
                        <option>Partnership Opportunity</option>
                        <option>General Inquiry</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                      <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Tell us how we can help..." rows={6} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" required />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                      <Send className="w-4 h-4" /> Send Message
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <div className="text-center mb-10">
            <p className="text-blue-600 font-medium text-sm uppercase tracking-wider mb-2">FAQ</p>
            <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-6 py-4 flex items-center justify-between gap-4"
                >
                  <span className="font-medium text-gray-900 text-sm">{faq.q}</span>
                  <span className={`text-gray-400 flex-shrink-0 text-lg transition-transform ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4">
                    <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
