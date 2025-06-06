import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import { API_BASE } from '../api/API';

export default function StatsScreen() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const scheduleId = location.state?.scheduleId;
        if (!scheduleId) {
          throw new Error('Кесте идентификаторы берілмеген');
        }

        const accessToken = user?.accessToken || localStorage.getItem('accessToken');
        if (!accessToken) {
          throw new Error('Қатынас токені жоқ');
        }

        const res = await axios.get(`${API_BASE}api/v1/teacher/schedule/${scheduleId}`, {
          headers: { 'Auth-token': accessToken },
        });
        setStats(res.data.body);
      } catch (err) {
        console.error('Деректерді жүктеу қатесі:', err);
        setStats(null);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [location.state, user]);

  const formatTime = (str) => {
    if (!str) return 'Жоқ';
    const date = new Date(str);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDuration = (min) => {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return h ? `${h} сағ ${m} мин` : `${m} мин`;
  };

  if (loading) return <div className="text-center text-gray-600 mt-10">Деректер жүктелуде...</div>;
  if (!stats) return <div className="text-center text-red-500 mt-10">Деректер жоқ</div>;

  const { scheduleDTO, studentDTO, presentCount, totalCount, statistic } = stats;
  const attendancePercentage = ((presentCount / totalCount) * 100).toFixed(1);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Статистика</h1>
      <p>Қатысу пайызы: {attendancePercentage}%</p>
      <p>Қатысқандар: {presentCount} / {totalCount}</p>
    </div>
  );
}