import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import axios from 'axios';
import Select from 'react-select';
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import { motion } from 'framer-motion';
import { API_BASE } from '../api/API';

// Custom CSS for DateTimePicker to match the image and ensure clock visibility
const dateTimePickerStyles = `
  .react-datetime-picker {
    width: 100%;
  }
  .react-datetime-picker__wrapper {
    background-color: #F9FAFB;
    border-radius: 0.75rem;
    padding: 0.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border: none;
    font-size: 1rem;
    color: #111827;
  }
  .react-datetime-picker__inputGroup {
    background-color: #F9FAFB;
    border-radius: 0.75rem;
  }
  .react-datetime-picker__inputGroup__input {
    color: #111827;
  }
  .react-datetime-picker__inputGroup__divider {
    color: #6B7280;
  }
  .react-datetime-picker__button {
    color: #007AFF;
  }
  .react-datetime-picker__button:hover {
    background-color: #E5E7EB;
  }
  .react-datetime-picker__calendar,
  .react-datetime-picker__clock {
    z-index: 1000 !important;
    background-color: #FFFFFF;
    border-radius: 0.75rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    overflow: visible !important;
  }
  .react-calendar__tile--active {
    background-color: #007AFF !important;
    color: #FFFFFF !important;
  }
  .react-calendar__tile--hover {
    background-color: #E5E7EB !important;
  }
  .react-clock__mark__number {
    color: #111827;
  }
  .react-clock__hand__tip {
    background-color: #007AFF !important;
  }
  .react-datetime-picker__calendar--open,
  .react-datetime-picker__clock--open {
    position: absolute !important;
    top: 100% !important;
    left: 0 !important;
    margin-top: 0.5rem !important;
  }
  .react-datetime-picker__clock {
    width: 200px !important;
    height: 200px !important;
    padding: 1rem !important;
  }
`;

const API_TEACHER_SUBJECTS = `${API_BASE}api/v1/teacher/subject`;
const API_CREATE_SCHEDULE = `${API_BASE}api/v1/teacher/schedule/create`;
const API_CREATE_RECURRING_SCHEDULE = `${API_BASE}api/v1/teacher/schedule/create-recurring`;
const API_GROUPS = `${API_BASE}api/v1/teacher/group`;

const CreateSchedulePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isRecurring, setIsRecurring] = useState(false); // New state for recurring option

  // Light theme colors (consistent with the image)
  const colors = {
    background: '#F3F4F6',
    cardBackground: '#FFFFFF',
    textPrimary: '#111827',
    textSecondary: '#6B7280',
    accent: '#007AFF',
    error: '#EF4444',
    success: '#10B981',
    inputBackground: '#F9FAFB',
  };

  // Generate suggested time slots from 8:00 to 18:00 (1-hour intervals)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour < 18; hour++) {
      const startHour = String(hour).padStart(2, '0');
      const endHour = String(hour + 1).padStart(2, '0');
      slots.push({
        start: `${startHour}:00`,
        end: `${endHour}:00`,
      });
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Handle clicking a suggested time slot
  const handleSlotSelection = (slot) => {
    const [startHour, startMinute] = slot.start.split(':').map(Number);
    const [endHour, endMinute] = slot.end.split(':').map(Number);

    // Preserve the selected date, only update the time
    const newStartTime = new Date(startTime);
    newStartTime.setHours(startHour, startMinute, 0, 0);

    const newEndTime = new Date(endTime);
    newEndTime.setHours(endHour, endMinute, 0, 0);

    setStartTime(newStartTime);
    setEndTime(newEndTime);
  };

  const fetchSubjectsAndGroups = async () => {
    if (!user) {
      setError('Данные пользователя отсутствуют');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const accessToken = user.accessToken || localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('Токен доступа отсутствует');
      }

      const [subjectsResponse, groupsResponse] = await Promise.all([
        axios.get(API_TEACHER_SUBJECTS, { headers: { 'Auth-token': accessToken } }),
        axios.get(API_GROUPS, { headers: { 'Auth-token': accessToken } }),
      ]);

      setSubjects(subjectsResponse.data || []);
      setGroups(groupsResponse.data || []);
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

  useEffect(() => {
    fetchSubjectsAndGroups();
  }, [user]);

  const handleCreateSchedule = async () => {
    if (!user || !selectedSubject || !selectedGroup || !startTime || !endTime) {
      setError('Заполните все поля');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const accessToken = user.accessToken || localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('Токен доступа отсутствует');
      }

      const payload = {
        subjectId: selectedSubject.id,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        groupId: selectedGroup.id,
        lecturerId: user.id,
      };

      const apiEndpoint = isRecurring ? API_CREATE_RECURRING_SCHEDULE : API_CREATE_SCHEDULE;
      const response = await axios.post(apiEndpoint, payload, {
        headers: { 'Auth-token': accessToken },
      });

      setSuccess(response.data.message || (isRecurring ? 'Расписание успешно создано для всех слотов' : 'Расписание успешно создано'));
      setTimeout(() => {
        setSuccess(null);
        navigate('/profile');
      }, 2000);
    } catch (e) {
      const errorMessage = e.response?.data?.message || 'Ошибка при создании расписания';
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

  // Format subjects and groups for react-select
  const subjectOptions = subjects.map((subject) => ({
    value: subject.id,
    label: subject.name,
    ...subject,
  }));

  const groupOptions = groups.map((group) => ({
    value: group.id,
    label: group.name,
    ...group,
  }));

  // Animation variants
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
    <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center py-12 px-4">
      <style>{dateTimePickerStyles}</style>
      <motion.div
        className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8 md:p-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-3xl md:text-4xl font-bold text-[#007AFF] text-center mb-8"
          variants={itemVariants}
        >
          Создать расписание
        </motion.h1>

        {isLoading ? (
          <motion.div
            className="flex flex-col items-center"
            variants={itemVariants}
          >
            <div className="animate-spin h-10 w-10 border-4 border-[#007AFF] border-t-transparent rounded-full"></div>
            <p className="mt-4 text-gray-600 text-lg">Загрузка данных...</p>
          </motion.div>
        ) : error ? (
          <motion.div
            className="text-center text-red-500 font-semibold text-lg"
            variants={itemVariants}
          >
            {error}
          </motion.div>
        ) : (
          <div className="space-y-8">
            {/* Subject Selection */}
            <motion.div variants={itemVariants}>
              <label className="block text-gray-600 font-semibold mb-2">Предмет</label>
              <Select
                options={subjectOptions}
                value={subjectOptions.find((option) => option.value === selectedSubject?.id)}
                onChange={(option) => setSelectedSubject(option)}
                placeholder="Выберите предмет"
                className="text-gray-900"
                styles={{
                  control: (base) => ({
                    ...base,
                    backgroundColor: colors.inputBackground,
                    borderRadius: '0.75rem',
                    padding: '0.5rem',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    border: 'none',
                  }),
                  option: (base, { isFocused }) => ({
                    ...base,
                    backgroundColor: isFocused ? colors.accent : colors.cardBackground,
                    color: isFocused ? '#FFFFFF' : colors.textPrimary,
                    padding: '12px 16px',
                  }),
                }}
              />
            </motion.div>

            {/* Group Selection */}
            <motion.div variants={itemVariants}>
              <label className="block text-gray-600 font-semibold mb-2">Группа</label>
              <Select
                options={groupOptions}
                value={groupOptions.find((option) => option.value === selectedGroup?.id)}
                onChange={(option) => setSelectedGroup(option)}
                placeholder="Выберите группу"
                className="text-gray-900"
                styles={{
                  control: (base) => ({
                    ...base,
                    backgroundColor: colors.inputBackground,
                    borderRadius: '0.75rem',
                    padding: '0.5rem',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    border: 'none',
                  }),
                  option: (base, { isFocused }) => ({
                    ...base,
                    backgroundColor: isFocused ? colors.accent : colors.cardBackground,
                    color: isFocused ? '#FFFFFF' : colors.textPrimary,
                    padding: '12px 16px',
                  }),
                }}
              />
            </motion.div>

            {/* Start Time */}
            <motion.div variants={itemVariants}>
              <label className="block text-gray-600 font-semibold mb-2">Время начала</label>
              <DateTimePicker
                value={startTime}
                onChange={setStartTime}
                className="w-full"
                disableClock={false}
                format="dd.MM.yyyy HH:mm"
                calendarIcon={<span className="text-[#007AFF]"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5h8a1 1 0 010 2H6a1 1 0 010-2z"></path></svg></span>}
                clearIcon={<span className="text-[#007AFF]"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"></path></svg></span>}
              />
            </motion.div>

            {/* End Time */}
            <motion.div variants={itemVariants}>
              <label className="block text-gray-600 font-semibold mb-2">Время окончания</label>
              <DateTimePicker
                value={endTime}
                onChange={setEndTime}
                className="w-full"
                disableClock={false}
                format="dd.MM.yyyy HH:mm"
                calendarIcon={<span className="text-[#007AFF]"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5h8a1 1 0 010 2H6a1 1 0 010-2z"></path></svg></span>}
                clearIcon={<span className="text-[#007AFF]"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"></path></svg></span>}
              />
            </motion.div>

            {/* Suggested Time Slots */}
            <motion.div variants={itemVariants}>
              <label className="block text-gray-600 font-semibold mb-2">Предложенные слоты</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {timeSlots.map((slot, index) => (
                  <button
                    key={index}
                    onClick={() => handleSlotSelection(slot)}
                    className="py-2 px-4 bg-gray-100 text-gray-900 rounded-xl hover:bg-[#007AFF] hover:text-white transition-colors shadow-sm"
                  >
                    {`${slot.start}–${slot.end}`}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Recurring Schedule Option */}
            <motion.div variants={itemVariants}>
              <label className="flex items-center text-gray-600 font-semibold">
                <input
                  type="checkbox"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  className="mr-2 h-5 w-5 text-[#007AFF] focus:ring-[#007AFF]"
                />
                Создавать повторяющееся расписание до 31 мая 2026 года
              </label>
            </motion.div>

            {/* Create Button */}
            <motion.div variants={itemVariants}>
              <button
                onClick={handleCreateSchedule}
                disabled={isLoading}
                className={`w-full py-4 rounded-xl text-white font-semibold text-lg ${
                  isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#007AFF] hover:bg-blue-600'
                } transition-colors shadow-md`}
              >
                {isLoading ? 'Создание...' : 'Создать'}
              </button>
            </motion.div>

            {/* Success Message */}
            {success && (
              <motion.div
                className="text-center text-green-500 font-semibold text-lg"
                variants={itemVariants}
              >
                {success}
              </motion.div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CreateSchedulePage;