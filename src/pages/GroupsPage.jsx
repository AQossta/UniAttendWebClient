import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import axios from 'axios';

const GroupsPage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [groups, setGroups] = useState([]);
    const [newGroup, setNewGroup] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch groups
    useEffect(() => {
        const fetchGroups = async () => {
            const accessToken = user?.accessToken || localStorage.getItem('accessToken');
            if (!accessToken) {
                setError('Токен доступа отсутствует');
                setLoading(false);
                return;
            }
            try {
                const response = await axios.get('/api/v1/teacher/group', {
                    headers: { 'Auth-token': accessToken },
                });
                setGroups(Array.isArray(response.data) ? response.data : []);
                setLoading(false);
            } catch (err) {
                const errorMessage = err.response?.data?.message || 'Ошибка при загрузке групп';
                setError(errorMessage);
                setLoading(false);
                if (err.response?.status === 401) {
                    setError('Сессия истекла. Пожалуйста, войдите снова');
                    logout();
                    navigate('/profile');
                }
            }
        };
        fetchGroups();
    }, [user, logout, navigate]);

    // Add group
    const handleAddGroup = async (e) => {
        e.preventDefault();
        if (!newGroup.trim()) {
            setError('Название группы обязательно');
            return;
        }
        const accessToken = user?.accessToken || localStorage.getItem('accessToken');
        if (!accessToken) {
            setError('Токен доступа отсутствует');
            return;
        }
        try {
            const response = await axios.post('/api/v1/teacher/group', { name: newGroup }, {
                headers: { 'Auth-token': accessToken },
            });
            setGroups([...groups, response.data]);
            setNewGroup('');
            setError(null);
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Ошибка при добавлении группы';
            setError(errorMessage);
            if (err.response?.status === 401) {
                setError('Сессия истекла. Пожалуйста, войдите снова');
                logout();
                navigate('/profile');
            }
        }
    };

    // Delete group
    const handleDeleteGroup = async (id) => {
        if (!window.confirm('Вы уверены, что хотите удалить эту группу?')) return;
        const accessToken = user?.accessToken || localStorage.getItem('accessToken');
        if (!accessToken) {
            setError('Токен доступа отсутствует');
            return;
        }
        try {
            await axios.delete(`/api/v1/teacher/group/${id}`, {
                headers: { 'Auth-token': accessToken },
            });
            setGroups(groups.filter((group) => group.id !== id));
            setError(null);
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Ошибка при удалении группы';
            setError(errorMessage);
            if (err.response?.status === 401) {
                setError('Сессия истекла. Пожалуйста, войдите снова');
                logout();
                navigate('/profile');
            }
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen">Жүктелуде...</div>;
    if (error) return <div className="text-red-500 text-center">{error}</div>;

    return (
        <div className="max-w-7xl mx-auto p-6 bg-white">
            <h1 className="text-2xl font-semibold text-[#007AFF] mb-4">Группы</h1>

            {/* Add Group Form */}
            <form onSubmit={handleAddGroup} className="mb-6">
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={newGroup}
                        onChange={(e) => setNewGroup(e.target.value)}
                        placeholder="Введите название группы"
                        className="flex-1 p-2 border border-gray-300 rounded"
                    />
                    <button
                        type="submit"
                        className="bg-[#007AFF] text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Добавить
                    </button>
                </div>
            </form>

            {/* Groups List */}
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2 text-left">ID</th>
                            <th className="p-2 text-left">Название</th>
                            <th className="p-2 text-left">Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {groups.map((group) => (
                            <tr key={group.id} className="border-b">
                                <td className="p-2">{group.id}</td>
                                <td className="p-2">{group.name}</td>
                                <td className="p-2">
                                    <button
                                        onClick={() => handleDeleteGroup(group.id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        Удалить
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

export default GroupsPage;