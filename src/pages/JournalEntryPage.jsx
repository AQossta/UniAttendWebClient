import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import axios from 'axios';
import Select from 'react-select';
import { motion } from 'framer-motion';
import { API_BASE } from '../api/API';

const API_GROUPS = `${API_BASE}api/v1/teacher/group`;
const API_TEACHER_SUBJECTS = `${API_BASE}api/v1/teacher/subject`;
const API_JOURNAL = `${API_BASE}api/v1/teacher/journal`;

const JournalEntryPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [groups, setGroups] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [journalEntries, setJournalEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [students, setStudents] = useState([]);
  const [uniqueDates, setUniqueDates] = useState([]);
  const [assessmentMap, setAssessmentMap] = useState({});

  // Light theme colors (consistent with CreateSchedulePage)
  const colors = {
    background: '#F3F4F6',
    cardBackground: '#FFFFFF',
    textPrimary: '#111827',
    textSecondary: '#6B7280',
    accent: '#007AFF',
    border: '#E5E7EB',
    error: '#EF4444',
    success: '#10B981',
    inputBackground: '#F9FAFB',
  };

  const fetchGroupsAndSubjects = async () => {
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

      const [groupsResponse, subjectsResponse] = await Promise.all([
        axios.get(API_GROUPS, { headers: { 'Auth-token': accessToken } }),
        axios.get(API_TEACHER_SUBJECTS, { headers: { 'Auth-token': accessToken } }),
      ]);

      setGroups(groupsResponse.data || []);
      setSubjects(subjectsResponse.data || []);
    } catch (e) {
      const errorMessage = e.response?.data?.message || 'Деректерді жүктеу кезінде қате пайда болды';
      setError(errorMessage);
      console.error('Қате:', errorMessage);
      if (e.response?.status === 401) {
        setError('Сессия мерзімі аяқталды. Қайта кіріңіз');
        logout();
        navigate('/profile');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchJournal = async (groupId, subjectId) => {
    setIsLoading(true);
    setError(null);

    try {
      const accessToken = user?.accessToken || localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('Қатынас токені жоқ');
      }

      const response = await axios.get(`${API_JOURNAL}/${groupId}?subjectId=${subjectId}`, {
        headers: { 'Auth-token': accessToken },
      });
      const entries = response.data.body || [];
      setJournalEntries(entries);

      // Extract unique students and dates
      const studentsMap = {};
      const datesSet = new Set();
      const assessments = {};

      entries.forEach((entry) => {
        const date = formatDate(entry.dateCreate);
        studentsMap[entry.userId] = { userId: entry.userId, name: entry.name, email: entry.email };
        datesSet.add(date);
        if (!assessments[entry.userId]) {
          assessments[entry.userId] = {};
        }
        assessments[entry.userId][date] = entry.assessment;
      });

      setStudents(Object.values(studentsMap));
      setUniqueDates([...datesSet].sort());
      setAssessmentMap(assessments);
    } catch (e) {
      const errorMessage = e.response?.data?.message || 'Журналды жүктеу кезінде қате пайда болды';
      setError(errorMessage);
      console.error('Қате:', errorMessage);
      if (e.response?.status === 401) {
        setError('Сессия мерзімі аяқталды. Қайта кіріңіз');
        logout();
        navigate('/profile');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupsAndSubjects();
  }, [user]);

  useEffect(() => {
    if (selectedGroup && selectedSubject) {
      fetchJournal(selectedGroup.id, selectedSubject.id);
    }
  }, [selectedGroup, selectedSubject]);

  const formatDate = (date) => {
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
  };

  // Format groups and subjects for react-select
  const groupOptions = groups.map((group) => ({
    value: group.id,
    label: group.name,
    ...group,
  }));

  const subjectOptions = subjects.map((subject) => ({
    value: subject.id,
    label: subject.name,
    ...subject,
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
    <div className="min-h-screen w-full bg-gray-100 flex flex-col">
      <motion.div
        className="flex-1 w-full bg-white py-12 px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-3xl md:text-4xl font-bold text-[#007AFF] text-center mb-8"
          variants={itemVariants}
        >
          Журнал
        </motion.h1>

        {isLoading && !journalEntries.length ? (
          <motion.div
            className="flex flex-col items-center"
            variants={itemVariants}
          >
            <div className="animate-spin h-10 w-10 border-4 border-[#007AFF] border-t-transparent rounded-full"></div>
            <p className="mt-4 text-gray-600 text-lg">Деректер жүктелуде...</p>
          </motion.div>
        ) : error ? (
          <motion.div
            className="text-center text-red-500 font-semibold text-lg"
            variants={itemVariants}
          >
            {error}
          </motion.div>
        ) : (
          <div className="space-y-8 max-w-full mx-auto">
            {/* Group Selection */}
            <motion.div variants={itemVariants}>
              <label className="block text-gray-600 font-semibold mb-2">Топ</label>
              <Select
                options={groupOptions}
                value={groupOptions.find((option) => option.value === selectedGroup?.id)}
                onChange={(option) => {
                  setSelectedGroup(option);
                  setSelectedSubject(null);
                  setJournalEntries([]);
                  setStudents([]);
                  setUniqueDates([]);
                  setAssessmentMap({});
                }}
                placeholder="Топты таңдаңыз"
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

            {/* Subject Selection */}
            {selectedGroup && (
              <motion.div variants={itemVariants}>
                <label className="block text-gray-600 font-semibold mb-2">Пән</label>
                <Select
                  options={subjectOptions}
                  value={subjectOptions.find((option) => option.value === selectedSubject?.id)}
                  onChange={(option) => setSelectedSubject(option)}
                  placeholder="Пәнді таңдаңыз"
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
            )}

            {/* Journal Table */}
            {selectedGroup && selectedSubject && (
              <motion.div variants={itemVariants}>
                <h2 className="text-xl font-semibold text-[#007AFF] mb-4">
                  Топ журналы: {selectedGroup.name} ({selectedSubject.name})
                </h2>
                {students.length > 0 ? (
                  <div className="overflow-x-auto rounded-xl shadow-md">
                    <table className="w-full bg-white border-collapse">
                      <thead>
                        <tr className="bg-[#007AFF22] border-b border-gray-200">
                          <th className="py-3 px-4 text-left font-semibold text-gray-900 min-w-[200px]">
                            Аты-жөні
                          </th>
                          {uniqueDates.map((date) => (
                            <th
                              key={date}
                              className="py-3 px-4 text-center font-semibold text-gray-900 min-w-[100px]"
                            >
                              {date}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((student) => (
                          <tr
                            key={student.userId}
                            className="border-b border-gray-200 hover:bg-gray-50"
                          >
                            <td className="py-3 px-4 text-gray-900 font-medium">{student.name}</td>
                            {uniqueDates.map((date) => (
                              <td
                                key={`${student.userId}-${date}`}
                                className="py-3 px-4 text-center text-gray-600"
                              >
                                {assessmentMap[student.userId]?.[date] || '-'}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center text-gray-600 text-lg">
                    Журналда жазбалар жоқ
                  </p>
                )}
              </motion.div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default JournalEntryPage;