import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { dashboardAPI } from '../api/auth';
import { useAuth } from '../contexts/AuthContext';
import StudentDashboard from './StudentDashboard';
import MentorDashboard from './MentorDashboard';
import { Loader2 } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, loading } = useAuth();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (!user) return;
    setFetching(true);
    const fetchData = async () => {
      try {
        const api = user.role === 'student' ? dashboardAPI.getStudent : dashboardAPI.getMentor;
        const res = await api();
        setDashboardData(res.data);
      } catch (e) {
        console.error("Error loaded dashboard:", e);
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading || (fetching && !dashboardData)) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <p className="text-sm text-gray-400 font-semibold uppercase tracking-wider">Syncing dashboard sessions...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === 'student') {
    return <StudentDashboard data={dashboardData} refreshData={() => {
      dashboardAPI.getStudent().then(res => setDashboardData(res.data));
    }} />;
  }

  if (user.role === 'mentor') {
    return <MentorDashboard data={dashboardData} refreshData={() => {
      dashboardAPI.getMentor().then(res => setDashboardData(res.data));
    }} />;
  }

  // Admin users are redirected to admin-workflow
  return <Navigate to="/admin-workflow" replace />;
};

export default Dashboard;
