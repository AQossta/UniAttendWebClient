import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ChartBarIcon } from '@heroicons/react/24/solid';
import { API_BASE } from '../api/API';

const API_STUDENT_SCHEDULE_BY_ID = `${API_BASE}api/v1/student/schedule/group/`;
const API_TEACHER_SCHEDULE_BY_ID = `${API_BASE}api/v1/teacher/schedule/lecturer/`;

const SchedulePage = () => {
  const { user, setIsAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const colors = {
    background: '#F3F4F6',
    cardBackground: '#FFFFFF',
    cardGradientStart: '#D1E3FA',
    cardGradientEnd: '#E6F0FA',
    textPrimary: '#000000',
    textSecondary: '#333333',
    accent: '#007AFF',
    border: '#E5E7EB',
    error: '#EF4444',
    gradientStart: '#E0F2FE',
    gradientEnd: '#BFDBFE',
    shadow: 'rgba(0, 0, 0, 0.1)',
  };

  const fetchSchedule = async () => {
    if (!user) {
      setError('Пайдаланушы деректері жоқ');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const accessToken = user.accessToken || localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('Қатынас токені жоқ');
      }

      let response;
      if (user.roles.includes('teacher')) {
        console.log(`Оқытушы ${user.id} үшін кесте сұрауы`);
        response = await axios.get(`${API_TEACHER_SCHEDULE_BY_ID}${user.id}`, {
          headers: { 'Auth-token': accessToken },
        });
      } else if (user.roles.includes('student')) {
        console.log(`Топ ${user.groupId} үшін кесте сұрауы`);
        response = await axios.get(`${API_STUDENT_SCHEDULE_BY_ID}${user.groupId}`, {
          headers: { 'Auth-token': accessToken },
        });
      } else {
        throw new Error(`Пайдаланушының белгісіз рөлі: ${user.roles.join(', ')}`);
      }

      setSchedule(response.data.body || []);
    } catch (e) {
      const errorMessage = e.response?.data?.message || 'Кестені жүктеу кезінде қате пайда болды';
      setError(errorMessage);
      console.error('Қате:', errorMessage);
      if (e.response?.status === 401) {
        setError('Сессия мерзімі аяқталды. Қайта кіріңіз');
        setIsAuthenticated(false);
        navigate('/profile');
      }
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, [user]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSchedule();
  };

  const handleItemPress = (item) => {
    try {
      navigate('/qr-generate', { state: { scheduleData: item } });
    } catch (error) {
      console.error('Навигация қатесі:', error);
      setError('QR-код экранына өту мүмкін болмады');
    }
  };

  const handleStatsPress = (item) => {
    try {
      navigate('/stats', { state: { scheduleId: item.id } }); // Передаем только ID расписания
    } catch (error) {
      console.error('Статистикаға навигация қатесі:', error);
      setError('Статистиканы ашу мүмкін болмады');
    }
  };

  const formatTime = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const format = (date) =>
      `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    return `${format(start)}–${format(end)}`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[colors.gradientStart] to-[colors.gradientEnd] p-4 md:p-8">
      <motion.div
        className="w-full max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="flex justify-between items-center mb-8 border-b border-[colors.border] pb-4"
          variants={itemVariants}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-[colors.textPrimary]">
            Бүгінгі сабақтар
          </h1>
          <button
            onClick={onRefresh}
            className="text-[colors.accent] hover:text-blue-600 font-semibold text-lg flex items-center gap-2"
            disabled={refreshing}
          >
            {refreshing ? (
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              'Жаңарту'
            )}
          </button>
        </motion.div>

        {isLoading ? (
          <motion.div
            className="flex flex-col items-center justify-center h-[80vh]"
            variants={itemVariants}
          >
            <svg className="animate-spin h-12 w-12 text-[colors.accent]" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="mt-6 text-[colors.textSecondary] text-xl font-semibold">
              Кесте жүктелуде...
            </p>
          </motion.div>
        ) : error ? (
          <motion.div
            className="flex flex-col items-center justify-center h-[80vh]"
            variants={itemVariants}
          >
            <p className="text-[colors.error] text-xl font-semibold text-center mb-6">
              {error}
            </p>
            <button
              onClick={fetchSchedule}
              className="bg-[colors.accent] text-white px-8 py-3 rounded-xl shadow-md hover:bg-blue-600 transition-colors"
            >
              Қайтадан көру
            </button>
          </motion.div>
        ) : schedule.length === 0 ? (
          <motion.div
            className="flex flex-col items-center justify-center h-[80vh]"
            variants={itemVariants}
          >
            <p className="text-[colors.textSecondary] text-xl font-semibold text-center mb-6">
              Кесте жоқ
            </p>
            <button
              onClick={fetchSchedule}
              className="bg-[colors.accent] text-white px-8 py-3 rounded-xl shadow-md hover:bg-blue-600 transition-colors"
            >
              Жаңарту
            </button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {schedule.map((item, index) => (
              <motion.div
                key={item.id}
                className="bg-[colors.cardBackground] rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer bg-gradient-to-r from-[colors.cardGradientStart] to-[colors.cardGradientEnd]"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
              >
                <div
                  className="p-6 border-l-4 border-[colors.accent]"
                  onClick={() => handleItemPress(item)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-lg font-bold text-[colors.textPrimary]">
                      {formatTime(item.startTime, item.endTime)}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatsPress(item);
                      }}
                      className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                    >
                      <ChartBarIcon className="w-6 h-6 text-[colors.textPrimary]" />
                    </button>
                  </div>
                  <p className="text-base font-semibold text-[colors.textPrimary] mb-3">
                    {item.subject}
                  </p>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-[colors.textSecondary]">
                      Топ: {item.groupName}
                    </p>
                    <p className="text-sm text-[colors.textSecondary] text-right">
                      Оқытушы: {item.teacherName}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default SchedulePage;