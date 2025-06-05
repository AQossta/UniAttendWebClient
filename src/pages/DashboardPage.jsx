import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import axios from 'axios';
import { motion } from 'framer-motion';
import { API_BASE } from '../api/API';

const API_GROUPS = `${API_BASE}api/v1/teacher/group`;
const API_TEACHER_SUBJECTS = `${API_BASE}api/v1/teacher/subject`;

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [groups, setGroups] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Light theme colors (consistent with other pages)
  const colors = {
    background: '#F3F4F6',
    cardBackground: '#FFFFFF',
    textPrimary: '#111827',
    textSecondary: '#6B7280',
    accent: '#007AFF',
    border: '#E5E7EB',
    error: '#EF4444',
    gradientStart: '#E0F2FE',
    gradientEnd: '#BFDBFE',
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

  const fetchGroupsAndSubjects = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const accessToken = user.accessToken || localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('Токен доступа отсутствует');
      }

      const [groupsResponse, subjectsResponse] = await Promise.all([
        axios.get(API_GROUPS, { headers: { 'Auth-token': accessToken } }),
        axios.get(API_TEACHER_SUBJECTS, { headers: { 'Auth-token': accessToken } }),
      ]);

      setGroups(groupsResponse.data || []);
      setSubjects(subjectsResponse.data || []);
    } catch (e) {
      const errorMessage = e.response?.data?.message || 'Ошибка при загрузке данных';
      setError(errorMessage);
      console.error('Ошибка:', errorMessage);
      if (e.response?.status === 401) {
        setError('Сессия истекла. Пожалуйста, войдите снова');
        logout();
        navigate('/profile');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGroupClick = (groupId) => {
    navigate(`/group/${groupId}/students`);
  };

  useEffect(() => {
    fetchGroupsAndSubjects();
  }, [user]);

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
            Информационная доска
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-lg font-medium text-[colors.textSecondary]">
              {user.name}
            </span>
            <button
              onClick={logout}
              className="text-[colors.accent] hover:text-blue-600 font-semibold"
            >
              Шығу
            </button>
          </div>
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
          <div className="space-y-12">
            {/* Groups Section */}
            <motion.div variants={itemVariants}>
              <h2 className="text-2xl md:text-3xl font-semibold text-[colors.accent] mb-6">
                Группы
              </h2>
              {groups.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groups.map((group) => (
                    <motion.div
                      key={group.id}
                      className="bg-[colors.cardBackground] rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer bg-gradient-to-br from-white to-gray-50"
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => handleGroupClick(group.id)}
                    >
                      <p className="text-[colors.textPrimary] text-lg font-semibold">
                        {group.name}
                      </p>
                      <p className="text-[colors.textSecondary] text-sm mt-2">
                        Группа #{group.id}
                      </p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-[colors.textSecondary] text-xl font-semibold">
                  Группы отсутствуют
                </p>
              )}
            </motion.div>

            {/* Subjects Section */}
            <motion.div variants={itemVariants}>
              <h2 className="text-2xl md:text-3xl font-semibold text-[colors.accent] mb-6">
                Предметы
              </h2>
              {subjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {subjects.map((subject) => (
                    <motion.div
                      key={subject.id}
                      className="bg-[colors.cardBackground] rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer bg-gradient-to-br from-white to-gray-50"
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
                    >
                      <p className="text-[colors.textPrimary] text-lg font-semibold">
                        {subject.name}
                      </p>
                      <p className="text-[colors.textSecondary] text-sm mt-2">
                        Предмет #{subject.id}
                      </p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-[colors.textSecondary] text-xl font-semibold">
                  Предметы отсутствуют
                </p>
              )}
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default DashboardPage;