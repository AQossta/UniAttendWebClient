import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import axios from 'axios';
import { API_BASE } from '../api/API';
import { FiEye, FiEyeOff } from 'react-icons/fi'; // Иконки для видимости пароля

const RegisterParticipantsPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [newUser, setNewUser] = useState({
    email: '',
    name: '',
    password: '',
    phoneNumber: '',
    birthday: '',
    groupId: '',
    roleId: '2', // Default to student (roleId: 2)
  });
  const [showPassword, setShowPassword] = useState(false); // Для видимости пароля
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch users and groups
  useEffect(() => {
    const fetchData = async () => {
      const accessToken = user?.accessToken || localStorage.getItem('accessToken');
      if (!accessToken) {
        setError('Токен доступа отсутствует');
        setLoading(false);
        return;
      }
      try {
        const [usersResponse, groupsResponse] = await Promise.all([
          axios.get(`${API_BASE}api/v1/admin/all`, {
            headers: { 'Auth-token': accessToken },
          }),
          axios.get(`${API_BASE}api/v1/teacher/group`, {
            headers: { 'Auth-token': accessToken },
          }),
        ]);
        setUsers(Array.isArray(usersResponse.data) ? usersResponse.data : []);
        setGroups(Array.isArray(groupsResponse.data) ? groupsResponse.data : []);
        setLoading(false);
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Ошибка при загрузке данных';
        setError(errorMessage);
        setLoading(false);
        if (err.response?.status === 401) {
          setError('Сессия истекла. Пожалуйста, войдите снова');
          logout();
          navigate('/profile');
        }
      }
    };
    fetchData();
  }, [user, logout, navigate]);

  // Add user
  const handleAddUser = async (e) => {
    e.preventDefault();
    const { email, name, password, phoneNumber, birthday, groupId, roleId } = newUser;
    if (!email || !name || !password || !phoneNumber || !birthday || !groupId || !roleId) {
      setError('Все поля обязательны для заполнения');
      return;
    }
    const accessToken = user?.accessToken || localStorage.getItem('accessToken');
    if (!accessToken) {
      setError('Токен доступа отсутствует');
      return;
    }
    try {
      const response = await axios.post(
        `${API_BASE}api/v1/auth/sign-up`,
        {
          email,
          name,
          password,
          phoneNumber,
          birthday,
          groupId: parseInt(groupId),
          roleId: parseInt(roleId),
        },
        {
          headers: { 'Auth-token': accessToken, 'Content-Type': 'application/json' },
        }
      );
      setUsers([...users, response.data]);
      setNewUser({
        email: '',
        name: '',
        password: '',
        phoneNumber: '',
        birthday: '',
        groupId: '',
        roleId: '2',
      });
      setError(null);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Ошибка при регистрации пользователя';
      setError(errorMessage);
      if (err.response?.status === 401) {
        setError('Сессия истекла. Пожалуйста, войдите снова');
        logout();
        navigate('/profile');
      }
    }
  };

  // Delete user
  const handleDeleteUser = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить этого пользователя?')) return;
    const accessToken = user?.accessToken || localStorage.getItem('accessToken');
    if (!accessToken) {
      setError('Токен доступа отсутствует');
      return;
    }
    try {
      await axios.delete(`${API_BASE}api/v1/auth/users/${id}`, {
        headers: { 'Auth-token': accessToken },
      });
      setUsers(users.filter((user) => user.id !== id));
      setError(null);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Ошибка при удалении пользователя';
      setError(errorMessage);
      if (err.response?.status === 401) {
        setError('Сессия истекла. Пожалуйста, войдите снова');
        logout();
        navigate('/profile');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-[#007AFF] border-t-transparent rounded-full"></div>
      </div>
    );
  }
  if (error) {
    return <div className="text-red-500 text-center text-lg font-semibold">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-[#007AFF] mb-6">Регистрация участников</h1>

        {/* Add User Form */}
        <form onSubmit={handleAddUser} className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <input
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              placeholder="Email"
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007AFF] w-full"
            />
          </div>
          <div className="relative">
            <input
              type="text"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              placeholder="Имя"
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007AFF] w-full"
            />
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              placeholder="Пароль"
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007AFF] w-full pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#007AFF]"
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              value={newUser.phoneNumber}
              onChange={(e) => setNewUser({ ...newUser, phoneNumber: e.target.value })}
              placeholder="Номер телефона (+40...)"
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007AFF] w-full"
            />
          </div>
          <div className="relative">
            <input
              type="date"
              value={newUser.birthday}
              onChange={(e) => setNewUser({ ...newUser, birthday: e.target.value })}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007AFF] w-full"
            />
          </div>
          <div className="relative">
            <select
              value={newUser.groupId}
              onChange={(e) => setNewUser({ ...newUser, groupId: e.target.value })}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007AFF] w-full appearance-none"
            >
              <option value="">Выберите группу</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>
          <div className="relative">
            <select
              value={newUser.roleId}
              onChange={(e) => setNewUser({ ...newUser, roleId: e.target.value })}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007AFF] w-full appearance-none"
            >
              <option value="2">Student</option>
              <option value="1">Teacher</option>
              <option value="3">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-[#007AFF] text-white px-6 py-3 rounded-lg shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-[#007AFF] transition-all duration-200 md:col-span-2"
          >
            Зарегистрировать
          </button>
        </form>

        {/* Users List */}
        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="w-full border-collapse bg-white">
            <thead>
              <tr className="bg-[#007AFF22] border-b border-gray-200">
                <th className="p-3 text-left font-semibold text-gray-900">ID</th>
                <th className="p-3 text-left font-semibold text-gray-900">Имя</th>
                <th className="p-3 text-left font-semibold text-gray-900">Email</th>
                <th className="p-3 text-left font-semibold text-gray-900">Телефон</th>
                <th className="p-3 text-left font-semibold text-gray-900">Дата рождения</th>
                <th className="p-3 text-left font-semibold text-gray-900">Группа</th>
                <th className="p-3 text-left font-semibold text-gray-900">Роль</th>
                <th className="p-3 text-left font-semibold text-gray-900">Действия</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{user.id}</td>
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.phoneNumber}</td>
                  <td className="p-3">{user.birthday}</td>
                  <td className="p-3">{groups.find((g) => g.id === user.groupId)?.name || 'N/A'}</td>
                  <td className="p-3">
                    {user.roleId === 1 ? 'Teacher' : user.roleId === 2 ? 'Student' : 'Admin'}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-500 hover:text-red-700 font-medium"
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
    </div>
  );
};

export default RegisterParticipantsPage;