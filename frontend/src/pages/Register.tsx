import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AlertCircle, UserPlus, User, GraduationCap, Briefcase, Linkedin } from 'lucide-react';

const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState<'student' | 'mentor'>('student');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');

  // Role details
  const [bio, setBio] = useState('');
  const [education, setEducation] = useState('');
  const [expertise, setExpertise] = useState('');
  const [experienceYears, setExperienceYears] = useState('0');
  const [linkedinUrl, setLinkedinUrl] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password || !firstName || !lastName) {
      setError('Please fully complete all required general profile inputs.');
      return;
    }
    setError('');
    setLoading(true);

    const payload = {
      username,
      email,
      password,
      role,
      first_name: firstName,
      last_name: lastName,
      phone_number: phone,
      bio,
      education: role === 'student' ? education : undefined,
      expertise: role === 'mentor' ? expertise : undefined,
      experience_years: role === 'mentor' ? experienceYears : undefined,
      linkedin_url: role === 'mentor' ? linkedinUrl : undefined,
    };

    try {
      await register(payload);
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || 'Registration failed. Please choose unique details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-6 text-left animate-fade-in px-4">
      <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-xl shadow-gray-100">
        <div className="space-y-2 text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Create Account</h1>
          <p className="text-sm text-gray-400 font-medium">Join the Mentorship Academy community</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-semibold flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role Choice */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Join As</label>
            <div className="grid grid-cols-2 gap-4">
              <button 
                type="button"
                onClick={() => setRole('student')}
                className={`py-3.5 px-4 rounded-xl font-bold text-sm border text-center transition flex justify-center items-center gap-2 cursor-pointer ${role === 'student' ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-extrabold ring-1 ring-indigo-600' : 'border-gray-100 hover:border-gray-300 text-gray-600 bg-white'}`}
              >
                <GraduationCap className="w-4 h-4" />
                Student Profile
              </button>
              <button 
                type="button"
                onClick={() => setRole('mentor')}
                className={`py-3.5 px-4 rounded-xl font-bold text-sm border text-center transition flex justify-center items-center gap-2 cursor-pointer ${role === 'mentor' ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-extrabold ring-1 ring-indigo-600' : 'border-gray-100 hover:border-gray-300 text-gray-600 bg-white'}`}
              >
                <Briefcase className="w-4 h-4" />
                Mentor Expert
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Username *</label>
              <input 
                type="text" 
                required
                placeholder="Unique username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl font-medium"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Email Address *</label>
              <input 
                type="email" 
                required
                placeholder="you@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl font-medium"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">First Name *</label>
              <input 
                type="text" 
                required
                placeholder="Alex"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl font-medium"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Last Name *</label>
              <input 
                type="text" 
                required
                placeholder="Walker"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl font-medium"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Phone Number</label>
              <input 
                type="text" 
                placeholder="+1 (555) 0123"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl font-medium"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Secret Password *</label>
              <input 
                type="password" 
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl font-medium"
              />
            </div>
          </div>

          {/* Role-specific fields */}
          <div className="border-t border-gray-100 pt-6 space-y-4">
            <h3 className="font-bold text-gray-900 text-lg">
              {role === 'student' ? 'Student Focus Details' : 'Mentor Credentials Setup'}
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Bio Description</label>
              <textarea 
                placeholder="Brief summary of professional experiences, aspirations, or learning priorities."
                value={bio}
                onChange={e => setBio(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl font-medium"
              />
            </div>

            {role === 'student' ? (
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Education Background</label>
                <input 
                  type="text" 
                  placeholder="e.g. Stanford University Computer Science Dept"
                  value={education}
                  onChange={e => setEducation(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl font-medium"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Core Expertise Tags</label>
                    <input 
                      type="text" 
                      placeholder="React, Django, Python (comma separated)"
                      value={expertise}
                      onChange={e => setExpertise(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl font-medium"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Years of Industry Experience</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 5"
                      value={experienceYears}
                      onChange={e => setExperienceYears(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block flex items-center gap-1">
                    <Linkedin className="w-4 h-4 text-indigo-500" />
                    LinkedIn Profile URL
                  </label>
                  <input 
                    type="url" 
                    placeholder="https://linkedin.com/in/username"
                    value={linkedinUrl}
                    onChange={e => setLinkedinUrl(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl font-medium"
                  />
                </div>

                <p className="text-[11px] font-semibold text-gray-400 bg-gray-50 p-3.5 rounded-xl border border-gray-100 leading-relaxed">
                  ⚠️ <strong>Notice:</strong> High quality requirements govern mentor status. Your account will undergo the simulated <strong>Admin Approval workflow</strong>. You must manage/verify document statuses on your dashboard once generated.
                </p>
              </div>
            )}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <UserPlus className="w-5 h-5" />
            {loading ? 'Creating Account...' : 'Finish Registration'}
          </button>

          <p className="text-center text-xs text-gray-400 font-semibold pt-2">
            Already have an account? <Link to="/login" className="text-indigo-600 hover:underline">Log in</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
