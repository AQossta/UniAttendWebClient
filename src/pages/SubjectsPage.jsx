import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import axios from 'axios';
import { API_BASE } from '../api/API';

const SubjectsPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch subjects
  useEffect(() => {
    const fetchSubjects = async () => {
      const accessToken = user?.accessToken || localStorage.getItem('accessToken');
      if (!accessToken) {
        setError('Қатынас токені жоқ');
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(`${API_BASE}api/v1/teacher/subject`, {
          headers: { 'Auth-token': accessToken },
        });
        setSubjects(Array.isArray(response.data) ? response.data : []);
        setLoading(false);
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Пәндерді жүктеу кезінде қате пайда болды';
        setError(errorMessage);
        setLoading(false);
        if (err.response?.status === 401) {
          setError('Сессия мерзімі аяқталды. Қайта кіріңіз');
          logout();
          navigate('/profile');
        }
      }
    };
    fetchSubjects();
  }, [user, logout, navigate]);

  // Add subject
  const handleAddSubject = async (e) => {
    e.preventDefault();
    if (!newSubject.trim()) {
      setError('Пән атауы міндетті');
      return;
    }
    const accessToken = user?.accessToken || localStorage.getItem('accessToken');
    if (!accessToken) {
      setError('Қатынас токені жоқ');
      return;
    }
    try {
      const response = await axios.post(`${API_BASE}api/v1/teacher/subject`, { name: newSubject }, {
        headers: { 'Auth-token': accessToken, 'Content-Type': 'application/json' },
      });
      setSubjects([...subjects, response.data]);
      setNewSubject('');
      setError(null);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Пәнді қосу кезінде қате пайда болды';
      setError(errorMessage);
      if (err.response?.status === 401) {
        setError('Сессия мерзімі аяқталды. Қайта кіріңіз');
        logout();
        navigate('/profile');
      }
    }
  };

  // Delete subject
  const handleDeleteSubject = async (id) => {
    if (!window.confirm('Осы пәнді жойғыңыз келетініне сенімдісіз бе?')) return;
    const accessToken = user?.accessToken || localStorage.getItem('accessToken');
    if (!accessToken) {
      setError('Қатынас токені жоқ');
      return;
    }
    try {
      await axios.delete(`${API_BASE}api/v1/teacher/subject/${id}`, {
        headers: { 'Auth-token': accessToken },
      });
      setSubjects(subjects.filter((subject) => subject.id !== id));
      setError(null);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Пәнді жою кезінде қате пайда болды';
      setError(errorMessage);
      if (err.response?.status === 401) {
        setError('Сессия мерзімі аяқталды. Қайта кіріңіз');
        logout();
        navigate('/profile');
      }
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Деректер жүктелуде...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white">
      <h1 className="text-2xl font-semibold text-[#007AFF] mb-4">Пәндер</h1>

      {/* Add Subject Form */}
      <form onSubmit={handleAddSubject} className="mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            placeholder="Пән атауын енгізіңіз"
            className="flex-1 p-2 border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="bg-[#007AFF] text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Қосу
          </button>
        </div>
      </form>

      {/* Subjects List */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">Атауы</th>
              <th className="p-2 text-left">Әрекеттер</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((subject) => (
              <tr key={subject.id} className="border-b">
                <td className="p-2">{subject.id}</td>
                <td className="p-2">{subject.name}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleDeleteSubject(subject.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Жою
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubjectsPage;