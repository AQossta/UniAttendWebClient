import React from 'react';
import { useAuth } from '../services/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Если пользователь не авторизован, вернуть null (Layout уже обрабатывает это)
  if (!user) {
    return null;
  }

  // Форматирование ролей для отображения
  const userRoles = Array.isArray(user.roles) && user.roles.length > 0
    ? user.roles
        .map((role) =>
          typeof role === 'string'
            ? role.toLowerCase() === 'student'
              ? 'Студент'
              : role.toLowerCase() === 'teacher'
              ? 'Оқытушы'
              : role
            : role.name
            ? role.name.toLowerCase() === 'student'
              ? 'Студент'
              : role.name.toLowerCase() === 'teacher'
              ? 'Оқытушы'
              : role.name
            : 'Белгісіз рөл'
        )
        .join(', ')
    : 'Рөлдер көрсетілмеген';

  // Обработка выхода из системы
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Анимации для появления
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8 md:p-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col md:flex-row gap-8">
          {/* Аватар и заголовок */}
          <div className="flex flex-col items-center md:items-start">
            <motion.div
              className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center text-4xl font-bold text-[#007AFF] mb-4"
              variants={itemVariants}
            >
              {user.name ? user.name.charAt(0).toUpperCase() : 'P'}
            </motion.div>
            <motion.h1
              className="text-3xl md:text-4xl font-bold text-[#007AFF] text-center md:text-left"
              variants={itemVariants}
            >
              {user.name || 'Пайдаланушы'}
            </motion.h1>
            <motion.p
              className="text-lg text-gray-500 mt-2 text-center md:text-left"
              variants={itemVariants}
            >
              {userRoles}
            </motion.p>
          </div>

          {/* Информация о пользователе */}
          <div className="flex-1">
            <motion.div
              className="space-y-4"
              variants={containerVariants}
            >
              <motion.div
                className="flex items-center py-3 border-b border-gray-200"
                variants={itemVariants}
              >
                <span className="font-semibold text-gray-900 w-1/3 md:w-1/4">
                  Электрондық пошта:
                </span>
                <span className="text-gray-700">{user.email || 'Көрсетілмеген'}</span>
              </motion.div>
              <motion.div
                className="flex items-center py-3 border-b border-gray-200"
                variants={itemVariants}
              >
                <span className="font-semibold text-gray-900 w-1/3 md:w-1/4">
                  Телефон нөмірі:
                </span>
                <span className="text-gray-700">
                  {user.phoneNumber || 'Көрсетілмеген'}
                </span>
              </motion.div>
              <motion.div
                className="flex items-center py-3 border-b border-gray-200"
                variants={itemVariants}
              >
                <span className="font-semibold text-gray-900 w-1/3 md:w-1/4">
                  Туған күні:
                </span>
                <span className="text-gray-700">
                  {user.dateOfBirth || user.birthday || 'Көрсетілмеген'}
                </span>
              </motion.div>
              {user.groupName && (
                <motion.div
                  className="flex items-center py-3 border-b border-gray-200"
                  variants={itemVariants}
                >
                  <span className="font-semibold text-gray-900 w-1/3 md:w-1/4">
                    Топ:
                  </span>
                  <span className="text-gray-700">{user.groupName}</span>
                </motion.div>
              )}
            </motion.div>

            {/* Кнопка выхода */}
            <motion.div
              className="mt-8 flex justify-center md:justify-start"
              variants={itemVariants}
            >
              <button
                onClick={handleLogout}
                className="px-8 py-3 bg-[#007AFF] text-white font-semibold rounded-xl hover:bg-blue-600 transition-colors duration-300"
              >
                Шығу
              </button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;