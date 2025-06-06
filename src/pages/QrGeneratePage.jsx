import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import axios from 'axios';
import { motion } from 'framer-motion';
import { API_BASE } from '../api/API';

const QrGeneratePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const schedule = location.state?.scheduleData || null;
  const accessToken = user?.accessToken;

  const [qrCodeData, setQrCodeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [secondsRemaining, setSecondsRemaining] = useState(10);
  const [isRunning, setIsRunning] = useState(true);

  const intervalRef = useRef(null);

  // Colors consistent with SchedulePage.jsx
  const colors = {
    background: '#F3F4F6',
    cardBackground: '#FFFFFF',
    textPrimary: '#000000', // Black for primary text
    textSecondary: '#333333', // Dark gray for secondary text
    accent: '#3B82F6', // Blue for timer and buttons
    error: '#EF4444', // Red for errors
    gradientStart: '#E0F2FE',
    gradientEnd: '#BFDBFE',
    stopButton: '#EF4444', // Red for stop button
    resumeButton: '#10B981', // Green for resume button
    backButton: '#3B82F6', // Blue for back/retry buttons
    shadow: 'rgba(0, 0, 0, 0.1)',
  };

  // Redirect to /profile if user is not authenticated
  if (!user) {
    return <Navigate to="/profile" />;
  }

  const generateQRCode = async () => {
    if (!schedule || !accessToken) {
      setError('QR-кодты жасау үшін деректер жеткіліксіз');
      setLoading(false);
      return;
    }

    try {
      console.log('QR-кодты жасау сұрауын жіберу:', new Date().toISOString());
      const response = await axios.post(
        `${API_BASE}api/v1/teacher/qr/generate/${schedule.id}`,
        {},
        {
          headers: { 'Auth-token': accessToken },
        }
      );

      const { qrCode } = response.data.body;
      setQrCodeData(qrCode.startsWith('data:image') ? qrCode : `data:image/png;base64,${qrCode}`);
      setError(null);
      setSecondsRemaining(10); // Reset timer to 10 seconds
      setLoading(false);
    } catch (err) {
      console.error('QR-кодты жасау қатесі:', err);
      setError(err.response?.data?.message || 'Серверден QR-кодты жасау мүмкін болмады');
      setQrCodeData(null);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    generateQRCode();

    intervalRef.current = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          generateQRCode();
          return 10; // Reset to 10 seconds after generating new QR code
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning]);

  const handleStop = () => {
    setIsRunning(false);
    setSecondsRemaining(0);
  };

  const handleResume = () => {
    setIsRunning(true);
    setSecondsRemaining(10);
    generateQRCode();
  };

  const formatTime = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const format = (date) =>
      `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    return `${format(start)}–${format(end)}`;
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[colors.gradientStart] to-[colors.gradientEnd] p-4 md:p-8">
      <motion.div
        className="w-full max-w-2xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {loading ? (
          <motion.div
            className="flex flex-col items-center justify-center h-[80vh]"
            variants={itemVariants}
          >
            <svg className="animate-spin h-12 w-12 text-[colors.accent]" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="mt-6 text-[colors.textSecondary] text-xl font-semibold">
              QR-код жүктелуде...
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
              onClick={generateQRCode}
              className="bg-[colors.backButton] text-white px-8 py-3 rounded-xl shadow-md hover:bg-blue-600 transition-colors"
            >
              Қайтадан көру
            </button>
          </motion.div>
        ) : (
          <motion.div className="flex flex-col h-full" variants={itemVariants}>
            {/* Content */}
            <div className="flex-1 flex flex-col items-center">
              <h1 className="text-3xl md:text-4xl font-bold text-[colors.textPrimary] mb-6 text-center">
                Сабаққа арналған QR-код
              </h1>
              <p className="text-sm text-[colors.textSecondary] mb-2">
                Пән: {schedule.subject}
              </p>
              <p className="text-sm text-[colors.textSecondary] mb-2">
                Уақыт: {formatTime(schedule.startTime, schedule.endTime)}
              </p>
              <p className="text-sm text-[colors.textSecondary] mb-2">
                Топ: {schedule.groupName}
              </p>
              <p className="text-sm text-[colors.textSecondary] mb-4">
                Оқытушы: {schedule.teacherName}
              </p>
              <p className="text-xl font-semibold text-[colors.accent] mb-6 text-center">
                {secondsRemaining > 0
                  ? `Жаңартуға дейін қалды: ${secondsRemaining} сек`
                  : 'QR-кодтың мерзімі аяқталды, жаңартылуда...'}
              </p>
              <div className="bg-[colors.cardBackground] p-4 rounded-xl shadow-md">
                {qrCodeData && (
                  <img
                    src={qrCodeData}
                    alt="QR-код"
                    className="w-[300px] h-[300px] md:w-[420px] md:h-[420px] object-contain"
                  />
                )}
              </div>
            </div>
            {/* Footer */}
            <div className="mt-6 pb-6">
              <div className="flex justify-center gap-4 mb-4">
                <button
                  onClick={handleStop}
                  disabled={!isRunning}
                  className={`px-6 py-3 rounded-xl shadow-md text-white font-semibold transition-colors ${
                    isRunning ? 'bg-[colors.stopButton] hover:bg-red-500' : 'bg-[colors.stopButton]/50 cursor-not-allowed'
                  }`}
                >
                  Тоқтату
                </button>
                <button
                  onClick={handleResume}
                  disabled={isRunning}
                  className={`px-6 py-3 rounded-xl shadow-md text-white font-semibold transition-colors ${
                    !isRunning ? 'bg-[colors.resumeButton] hover:bg-green-600' : 'bg-[colors.resumeButton]/50 cursor-not-allowed'
                  }`}
                >
                  Жалғастыру
                </button>
              </div>
              <button
                onClick={() => navigate(-1)}
                className="w-full bg-[colors.backButton] text-white px-6 py-3 rounded-xl shadow-md hover:bg-blue-600 transition-colors font-semibold"
              >
                Артқа
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default QrGeneratePage;