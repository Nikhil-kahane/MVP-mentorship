import React, { useEffect, useState } from 'react';
import { adminAPI } from '../api/auth';
import { Shield, Check, X, FileText, User, Award, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

const AdminWorkflow: React.FC = () => {
  const [mentors, setMentors] = useState<any[]>([]);
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [workingId, setWorkingId] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  const loadData = () => {
    setLoading(true);
    Promise.all([
      adminAPI.getApprovalList(),
      adminAPI.getAllFiles()
    ]).then(([mentorsRes, filesRes]) => {
      setMentors(mentorsRes.data);
      setFiles(filesRes.data);
    }).catch(err => {
      console.error(err);
    }).finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (id: number, approved: boolean) => {
    setWorkingId(id);
    setMessage('');
    try {
      await adminAPI.approveMentor(id, approved);
      setMentors(prev => prev.map(m => m.id === id ? { ...m, is_approved: approved } : m));
      setMessage(`Mentor ${approved ? 'approved' : 'denied'} successfully.`);
      loadData(); // Reload document states as they shift
    } catch {
      setMessage('Failed to execute state approval update.');
    } finally {
      setWorkingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <p className="text-sm text-gray-400 font-semibold uppercase tracking-wider">Syncing Admin Records...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 text-left animate-fade-in max-w-5xl mx-auto px-4">
      
      {/* Header */}
      <div className="flex items-center gap-3 bg-slate-900 text-white rounded-3xl p-6 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>
        <Shield className="w-8 h-8 text-indigo-400 shrink-0" />
        <div>
          <h1 className="text-2xl font-black tracking-tight">Administrative Control Portal</h1>
          <p className="text-xs text-slate-400 font-medium">Verify credentials, approve mentor profiles, and manage uploaded portfolios.</p>
        </div>
      </div>

      {message && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          {message}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-10">
        
        {/* Mentor Approvals list */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-1.5 border-b border-gray-50 pb-3">
            <Award className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg font-bold text-gray-900">Mentor Verification Requests</h2>
          </div>

          {mentors.length === 0 ? (
            <p className="text-xs text-gray-400 font-semibold text-center py-8">No mentor profiles found.</p>
          ) : (
            <div className="space-y-4">
              {mentors.map(m => (
                <div key={m.id} className="p-4 rounded-2xl border border-gray-100 space-y-3 hover:border-indigo-50/80 transition">
                  <div className="flex justify-between items-start gap-4">
                    <div className="text-left space-y-0.5">
                      <h3 className="font-bold text-gray-900 text-sm">{m.first_name} {m.last_name}</h3>
                      <p className="text-[10px] font-semibold text-gray-400">@{m.username} — {m.email}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${m.is_approved ? 'bg-emerald-50 text-emerald-600 border border-emerald-150' : 'bg-amber-50 text-amber-700 border border-amber-150'}`}>
                      {m.is_approved ? 'Approved' : 'Pending'}
                    </span>
                  </div>

                  {m.expertise && (
                    <div className="pt-1 text-xs text-slate-500 leading-normal">
                      <span className="font-bold text-gray-700 block">Expertise Areas:</span>
                      {m.expertise}
                    </div>
                  )}

                  {/* Actions buttons */}
                  <div className="flex gap-2 pt-2 border-t border-gray-50">
                    {!m.is_approved ? (
                      <button 
                        onClick={() => handleApprove(m.id, true)}
                        disabled={workingId === m.id}
                        className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white rounded-xl font-bold text-xs shadow-sm shadow-indigo-100 transition inline-flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Approve Profile
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleApprove(m.id, false)}
                        disabled={workingId === m.id}
                        className="flex-1 py-2 bg-white hover:bg-red-50 border border-red-100 text-red-650 rounded-xl font-bold text-xs transition inline-flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        Revoke Approval
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Uploaded Documents List */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-1.5 border-b border-gray-50 pb-3">
            <FileText className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg font-bold text-gray-900">Uploaded Documents (Verification)</h2>
          </div>

          {files.length === 0 ? (
            <p className="text-xs text-gray-400 font-semibold text-center py-8">No candidate files currently submitted.</p>
          ) : (
            <div className="space-y-4">
              {files.map(f => (
                <div key={f.id} className="p-4 rounded-xl border border-gray-100 flex items-start gap-3">
                  <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="space-y-1 text-left flex-1">
                    <div className="flex justify-between items-center gap-2">
                      <span className="font-bold text-gray-900 text-xs truncate max-w-[150px]">{f.fileName}</span>
                      <span className="text-[8px] font-black bg-slate-100 text-slate-500 border border-slate-200 uppercase tracking-widest px-1.5 py-0.5 rounded">
                        {f.doc_type?.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400 font-semibold">Submitted by: {f.owner} ({f.role})</p>
                    <p className="text-[9px] text-slate-400 font-medium">Uploaded: {f.uploaded_at}</p>
                    
                    <a 
                      href={`#`} 
                      onClick={(e) => { e.preventDefault(); alert(`Simulating file view: ${f.fileName}`); }}
                      className="text-[10px] font-bold text-indigo-600 hover:underline inline-block pt-1.5"
                    >
                      View Documents Integrity
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminWorkflow;
