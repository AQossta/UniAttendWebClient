import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate, useParams } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import axios from 'axios';
import { motion } from 'framer-motion';
import { API_BASE } from '../api/API';

const API_STUDENTS = (groupId) => `${API_BASE}api/v1/teacher/group/${groupId}`;

const StudentsPage = () => {
  const { user } = useAuth();
  const { groupId } = useParams();
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Light theme colors (consistent with DashboardPage)
  const colors = {
    background: '#F3F4F6',
    cardBackground: '#FFFFFF',
    teacherBackground: '#DBEAFE', // Light blue for teacher cards
    textPrimary: '#111827',
    textSecondary: '#6B7280',
    accent: '#007AFF',
    border: '#E5E7EB',
    error: '#EF4444',
    gradientStart: '#E0F2FE',
    gradientEnd: '#BFDBFE',
    teacherBadge: '#3B82F6', // Blue for teacher badge
  };

  // Check if user is a teacher
  const isTeacher = Array.isArray(user?.roles) && user.roles.length > 0
    ? user.roles.some((role) => {
        if (typeof role === 'string') {
          return role.toLowerCase() === 'teacher';
        } else if (role && 'name' in role) {
          return role.name.toLowerCase() === 'teacher';
        }
        return false;
      })
    : false;

  if (!user || !isTeacher) {
    return <Navigate to="/profile" />;
  }

  const fetchStudents = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const accessToken = user.accessToken || localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('Токен доступа отсутствует');
      }

      const response = await axios.get(API_STUDENTS(groupId), {
        headers: { 'Auth-token': accessToken },
      });

      setStudents(response.data || []);
    } catch (e) {
      const errorMessage = e.response?.data?.message || 'Ошибка при загрузке студентов';
      setError(errorMessage);
      console.error('Ошибка:', errorMessage);
      if (e.response?.status === 401) {
        setError('Сессия истекла. Пожалуйста, войдите снова');
        navigate('/profile');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [groupId]);

  // Determine if a user is a teacher based on roles
  const isUserTeacher = (roles) => {
    return Array.isArray(roles) && roles.some((role) => role.toLowerCase() === 'teacher');
  };

  // Animation variants
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
        className="w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div
          className="flex justify-between items-center mb-8"
          variants={itemVariants}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-[colors.textPrimary]">
            Студенты и учителя группы #{groupId}
          </h1>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-[colors.accent] hover:text-blue-600 font-semibold"
          >
            Назад к доске
          </button>
        </motion.div>

        {isLoading ? (
          <motion.div
            className="flex flex-col items-center justify-center h-[80vh]"
            variants={itemVariants}
          >
            <div className="animate-spin h-12 w-12 border-4 border-[colors.accent] border-t-transparent rounded-full"></div>
            <p className="mt-6 text-[colors.textSecondary] text-xl font-semibold">
              Загрузка данных...
            </p>
          </motion.div>
        ) : error ? (
          <motion.div
            className="text-center text-[colors.error] font-semibold text-xl mt-20"
            variants={itemVariants}
          >
            {error}
          </motion.div>
        ) : (
          <motion.div variants={itemVariants}>
            <h2 className="text-2xl md:text-3xl font-semibold text-[colors.accent] mb-6">
              Список участников
            </h2>
            {students.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {students.map((member) => (
                  <motion.div
                    key={member.id}
                    className={`rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer ${
                      isUserTeacher(member.roles)
                        ? 'bg-[colors.teacherBackground] bg-gradient-to-br from-[colors.teacherBackground] to-[#BFDBFE]'
                        : 'bg-[colors.cardBackground] bg-gradient-to-br from-white to-gray-50'
                    }`}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-[colors.textPrimary] text-lg font-semibold">
                        {member.name}
                      </p>
                      {isUserTeacher(member.roles) && (
                        <span className="text-xs font-semibold text-white bg-[colors.teacherBadge] px-2 py-1 rounded-full">
                          Учитель
                        </span>
                      )}
                    </div>
                    <p className="text-[colors.textSecondary] text-sm mt-2">
                      Email: {member.email}
                    </p>
                    <p className="text-[colors.textSecondary] text-sm mt-1">
                      Телефон: {member.phoneNumber || 'Не указан'}
                    </p>
                    <p className="text-[colors.textSecondary] text-sm mt-1">
                      Дата рождения: {new Date(member.birthday).toLocaleDateString('ru-RU')}
                    </p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-center text-[colors.textSecondary] text-xl font-semibold">
                Участники отсутствуют
              </p>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default StudentsPage;