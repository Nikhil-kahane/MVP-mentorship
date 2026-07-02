import React, { useState } from 'react';
import { authAPI } from '../api/auth';
import { useAuth } from '../contexts/AuthContext';
import { CheckCircle2, AlertCircle, User, MessageSquare, Linkedin, Lock, UploadCloud, FileText, Sparkles } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, setUser } = useAuth();

  // Basic Details Form State
  const [firstName, setFirstName] = useState(user?.first_name || '');
  const [lastName, setLastName] = useState(user?.last_name || '');
  const [phone, setPhone] = useState(user?.phone_number || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [education, setEducation] = useState(user?.education || '');

  // Mentor additions
  const [expertise, setExpertise] = useState(user?.expertise || '');
  const [linkedinUrl, setLinkedinUrl] = useState(user?.linkedin_url || '');

  // File states (mock/simulated profile & resume uploads)
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(user?.profile_image || null);
  const [resumeName, setResumeName] = useState(user?.resume_name || '');
  const [portfolioUrl, setPortfolioUrl] = useState(user?.portfolio_url || '');

  // Password modification state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [working, setWorking] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    setWorking(true);

    const payload = {
      first_name: firstName,
      last_name: lastName,
      phone_number: phone,
      bio,
      education: user?.role === 'student' ? education : undefined,
      expertise: user?.role === 'mentor' ? expertise : undefined,
      linkedin_url: user?.role === 'mentor' ? linkedinUrl : undefined,
      profile_image: selectedAvatar,
      resume_name: resumeName,
      portfolio_url: portfolioUrl,
    };

    try {
      const res = await authAPI.updateProfile(payload);
      setUser(res.data);
      setSuccessMsg('Account details saved successfully.');
    } catch (e: any) {
      console.error(e);
      setErrorMsg('Failed to update details.');
    } finally {
      setWorking(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    if (!currentPassword || !newPassword) {
      setErrorMsg('Fill out current and new password constraints.');
      return;
    }
    setWorking(true);
    try {
      await authAPI.changePassword({ current_password: currentPassword, new_password: newPassword });
      setSuccessMsg('Password successfully changed.');
      setCurrentPassword('');
      setNewPassword('');
    } catch {
      setErrorMsg('Failed to change password. Validate details.');
    } finally {
      setWorking(false);
    }
  };

  // Profile icon mock upload
  const handleLogoOptionClick = (url: string) => {
    setSelectedAvatar(url);
    setSuccessMsg('Profile picture changed.');
  };

  const handleResumeSimulatedUpload = (name: string) => {
    setResumeName(name);
    setSuccessMsg(`Mock upload added: ${name}`);
  };

  if (!user) {
    return <p className="text-center py-10">Unauthorized. Please log in.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-left animate-fade-in">
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Account Settings</h1>
        <p className="text-sm text-gray-500 font-medium">Update profile credentials, resumes, portfolios, and coordinate passwords.</p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" />
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-100 text-red-800 text-xs font-semibold rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4.5 h-4.5 text-red-500" />
          {errorMsg}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-10">
        
        {/* Core fields */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-50 pb-3 mb-6 flex items-center gap-1.5">
              <User className="w-4 h-4 text-indigo-500" />
              My Profile Details
            </h2>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              
              {/* Profile Image Selectors Choice */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Profile Image Selection</label>
                <div className="flex items-center gap-4">
                  {selectedAvatar ? (
                    <img 
                      src={selectedAvatar} 
                      alt="avatar" 
                      className="w-16 h-16 rounded-full border border-gray-200 object-cover" 
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-extrabold text-xl">
                      {user.first_name?.[0] || 'U'}
                    </div>
                  )}
                  
                  {/* Option preset items clickers */}
                  <div className="space-y-1.5 text-left">
                    <p className="text-[10px] text-gray-400 font-semibold leading-relaxed">Choose quick preset avatares:</p>
                    <div className="flex gap-2">
                      {[
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
                        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
                        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
                      ].map((url, i) => (
                        <button 
                          key={i} 
                          type="button" 
                          onClick={() => handleLogoOptionClick(url)}
                          className="w-10 h-10 rounded-full overflow-hidden border hover:ring-2 hover:ring-indigo-500 cursor-pointer"
                        >
                          <img src={url} alt="preset" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">First Name</label>
                  <input 
                    type="text" 
                    value={firstName} 
                    onChange={e => setFirstName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 focus:border-indigo-500 rounded-xl text-sm font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Last Name</label>
                  <input 
                    type="text" 
                    value={lastName} 
                    onChange={e => setLastName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 focus:border-indigo-500 rounded-xl text-sm font-medium"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Email Address</label>
                  <input 
                    type="email" 
                    disabled 
                    value={user.email} 
                    className="w-full px-4 py-3 border border-gray-100 bg-gray-50 text-gray-400 rounded-xl text-sm font-semibold"
                  />
                  <span className="text-[9px] text-gray-400 block font-semibold leading-none pt-1">Contact administrators to alter registered emails.</span>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Phone Number</label>
                  <input 
                    type="text" 
                    value={phone} 
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 focus:border-indigo-500 rounded-xl text-sm font-medium"
                  />
                </div>
              </div>

              {/* Bio block message */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Bio Summary</label>
                <textarea 
                  value={bio} 
                  onChange={e => setBio(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 focus:border-indigo-500 rounded-xl text-sm font-medium"
                />
              </div>

              {user.role === 'student' ? (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Education</label>
                  <input 
                    type="text" 
                    value={education} 
                    onChange={e => setEducation(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 focus:border-indigo-500 rounded-xl text-sm font-medium"
                  />
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Tags</label>
                    <input 
                      type="text" 
                      value={expertise} 
                      onChange={e => setExpertise(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 focus:border-indigo-500 rounded-xl text-sm font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block flex items-center gap-1">
                      <Linkedin className="w-3.5 h-3.5 text-indigo-500" />
                      LinkedIn Profile
                    </label>
                    <input 
                      type="url" 
                      value={linkedinUrl} 
                      onChange={e => setLinkedinUrl(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 focus:border-indigo-500 rounded-xl text-sm font-medium"
                    />
                  </div>
                </div>
              )}

              <button 
                type="submit" 
                disabled={working}
                className="py-3 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl font-bold text-sm tracking-wide transition cursor-pointer"
              >
                {working ? 'Saving changes...' : 'Save Profile Changes'}
              </button>

            </form>
          </div>
        </div>

        {/* Password and document sidebar options */}
        <div className="space-y-8">
          
          {/* Document Upload panel */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-1.5 border-b border-gray-50 pb-2">
              <UploadCloud className="w-4 h-4 text-indigo-500" />
              <h3 className="font-bold text-slate-800 text-sm">Resume & Materials</h3>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-gray-150 rounded-2xl space-y-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-500 shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-700 text-xs">Simulate Resume Upload</h4>
                    <p className="text-[10px] text-gray-400">Add portfolios or CV sheets to verify candidate status is authentic.</p>
                  </div>
                </div>

                {resumeName ? (
                  <div className="p-2.5 bg-white border border-gray-100 rounded-lg flex items-center justify-between text-xs font-bold text-gray-500">
                    <span className="truncate flex-1 pr-2">{resumeName}</span>
                    <button 
                      type="button" 
                      onClick={() => setResumeName('')} 
                      className="text-red-500 hover:underline text-[10px]"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      type="button"
                      onClick={() => handleResumeSimulatedUpload('Walker_CV_Fullstack.pdf')}
                      className="py-2 px-1 bg-white hover:bg-indigo-50 border border-gray-100 rounded-lg text-[9px] font-bold text-gray-600 hover:text-indigo-600 transition"
                    >
                      Upload Walker_CV.pdf
                    </button>
                    <button 
                      type="button"
                      onClick={() => handleResumeSimulatedUpload('Expert_Bio_Porfolio.docx')}
                      className="py-2 px-1 bg-white hover:bg-indigo-50 border border-gray-100 rounded-lg text-[9px] font-bold text-gray-600 hover:text-indigo-600 transition"
                    >
                      Upload Portfolio.docx
                    </button>
                  </div>
                )}
              </div>

              {/* Portfolio URL selector */}
              <div className="space-y-1 text-left">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Student Portfolio Link</label>
                <div className="flex gap-2">
                  <input 
                    type="url" 
                    placeholder="https://github.com/myportfolio" 
                    value={portfolioUrl}
                    onChange={e => setPortfolioUrl(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold"
                  />
                  <button 
                    type="button"
                    onClick={handleUpdateProfile}
                    className="px-3 bg-indigo-50 text-indigo-700 font-extrabold text-xs rounded-xl hover:bg-indigo-100"
                  >
                    Set
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Change password panel */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-1.5 border-b border-gray-50 pb-2">
              <Lock className="w-4 h-4 text-indigo-500" />
              <h3 className="font-bold text-slate-800 text-sm">Security & Passwords</h3>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 block">Current Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 focus:border-indigo-500 rounded-xl text-xs font-semibold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 block">New Secret Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 focus:border-indigo-500 rounded-xl text-xs font-semibold"
                />
              </div>
              <button 
                type="submit" 
                disabled={working}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Change Secret Code
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
