import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function StatsScreen() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('https://your-api-url.com/api/v1/teacher/schedule/1', {
          headers: { 'Auth-token': 'your-access-token' },
        });
        setStats(res.data.body);
      } catch (err) {
        console.error('Ошибка загрузки данных:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const formatTime = (str) => {
    if (!str) return 'Н/Д';
    const date = new Date(str);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDuration = (min) => {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return h ? `${h} ч ${m} мин` : `${m} мин`;
  };

  if (loading) return <div className="text-center text-gray-600 mt-10">Загрузка...</div>;
  if (!stats) return <div className="text-center text-red-500 mt-10">Нет данных</div>;

  const { scheduleDTO, studentDTO, presentCount, totalCount, statistic } = stats;
  const attendancePercentage = ((presentCount / totalCount) * 100).toFixed(1);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Остальная верстка как в предыдущем коде */}
    </div>
  );
}
