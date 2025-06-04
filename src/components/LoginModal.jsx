import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../services/AuthContext';
import { useNavigate } from 'react-router-dom';
import { IoIosClose } from 'react-icons/io';
import { API_BASE } from '../api/API';

// Placeholder for API base URL

const LoginModal = ({ isOpen, onClose }) => {
  const { setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const API_AUTH_SIGN_IN = API_BASE + 'api/v1/auth/sign-in';

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    if (!email.includes('@')) {
      setEmailError(true);
      setServerError('');
      return;
    }
    if (password.length < 5) {
      setServerError('Құпия сөз қате (кемінде 6 символ)');
      setEmailError(false);
      return;
    }

    setEmailError(false);
    setServerError('');
    setIsLoading(true);

    try {
      const response = await axios.post(API_AUTH_SIGN_IN, {
        email,
        password,
      });

      const { body } = response.data;

      localStorage.setItem('accessToken', body.accessToken);
      localStorage.setItem('user', JSON.stringify(body));

      await setUser({
        id: body.id,
        email: body.email,
        name: body.name,
        phoneNumber: body.phoneNumber,
        dateOfBirth: body.dateOfBirth || body.birthday,
        roles: body.roleId ? [{ id: body.roleId }] : body.roles || [],
        groupId: body.groupId,
        groupName: body.groupName,
        accessToken: body.accessToken,
      });

      onClose();
      navigate('/profile');
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Сервер қатесі';
      setServerError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-white rounded-xl p-6 w-full max-w-md mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col items-center">
            <div className="flex justify-end w-full">
              <button
                onClick={onClose}
                className="text-gray-600 hover:text-gray-800"
              >
                <IoIosClose size={30} />
              </button>
            </div>
            <img
              src="../assets/images/ic_logo.png"
              alt="Logo"
              className="w-[100px] h-[100px] mb-4"
            />
            <h1 className="text-2xl font-bold text-gray-900">Сәлем</h1>
            <p className="text-base text-gray-500 mt-1">Аккаунтқа кіріңіз</p>
            <div className="w-full mt-6">
              <label className="text-sm font-bold text-gray-900">
                Электрондық пошта
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  placeholder="Сіздің электрондық поштаңыз"
                  className={`w-full px-4 py-4 bg-gray-100 border ${
                    emailError ? 'border-red-500' : 'border-gray-300'
                  } rounded-xl text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
                {emailError && (
                  <p className="text-sm text-red-500 mt-3">Қате формат</p>
                )}
              </div>
              <div className="mt-4">
                <label className="text-sm font-bold text-gray-900">
                  Құпия сөз
                </label>
                <div className="relative mt-1">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Сіздің құпия сөзіңіз"
                    className="w-full px-4 py-4 bg-gray-100 border border-gray-300 rounded-xl text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-600"
                    onClick={toggleShowPassword}
                    disabled={isLoading}
                  >
                    {showPassword ? 'Жасыру' : 'Көрсету'}
                  </button>
                </div>
              </div>
              <div className="mt-10">
                {serverError && (
                  <p className="text-sm text-red-500 mb-3">{serverError}</p>
                )}
                <button
                  className={`w-full h-14 bg-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-base ${
                    isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-600'
                  }`}
                  onClick={handleLogin}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                      ></path>
                    </svg>
                  ) : (
                    'Кіру'
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoginModal;