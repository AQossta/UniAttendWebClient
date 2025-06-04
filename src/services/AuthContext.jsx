/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userId, setUserId] = useState(localStorage.getItem('userId') || null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Синхронизация userId с localStorage
        if (userId) {
            localStorage.setItem('userId', userId);
        } else {
            localStorage.removeItem('userId');
        }
    }, [userId]);

    useEffect(() => {
        // Загрузка данных пользователя из localStorage при инициализации
        const storedUserId = localStorage.getItem('userId');
        const storedUser = localStorage.getItem('user');
        if (storedUserId && storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUserId(storedUserId);
                setUser({
                    id: parsedUser.id,
                    email: parsedUser.email,
                    name: parsedUser.name,
                    phoneNumber: parsedUser.phoneNumber,
                    dateOfBirth: parsedUser.dateOfBirth || parsedUser.birthday,
                    roles: parsedUser.roles || [{ id: parsedUser.roleId }],
                    groupId: parsedUser.groupId,
                    groupName: parsedUser.groupName,
                    accessToken: parsedUser.accessToken,
                });
            } catch (error) {
                console.error('Ошибка при парсинге данных пользователя из localStorage:', error);
                setUserId(null);
                setUser(null);
                localStorage.removeItem('userId');
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    /**
     * Устанавливает данные пользователя после логина или регистрации
     * @param {Object} userData - Данные пользователя
     * @param {string} userData.id - ID пользователя
     * @param {string} userData.email - Email пользователя
     * @param {string} userData.name - Имя пользователя
     * @param {string} userData.phoneNumber - Номер телефона
     * @param {string} [userData.birthday] - Дата рождения (опционально)
     * @param {number} [userData.groupId] - ID группы (опционально)
     * @param {string} [userData.groupName] - Название группы (опционально)
     * @param {number} [userData.roleId] - ID роли (опционально)
     * @param {Array<{id: number, name?: string}>} [userData.roles] - Массив ролей (опционально)
     * @param {string} userData.accessToken - Токен доступа
     */
    const setUserData = (userData) => {
        const userObject = {
            id: userData.id,
            email: userData.email,
            name: userData.name,
            phoneNumber: userData.phoneNumber,
            dateOfBirth: userData.birthday || userData.dateOfBirth,
            roles: userData.roleId ? [{ id: userData.roleId }] : userData.roles || [],
            groupId: userData.groupId,
            groupName: userData.groupName,
            accessToken: userData.accessToken,
        };
        setUserId(userData.id);
        setUser(userObject);
        localStorage.setItem('userId', userData.id);
        localStorage.setItem('user', JSON.stringify(userObject));
    };

    const logout = () => {
        setUserId(null);
        setUser(null);
        localStorage.removeItem('userId');
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
    };

    return (
        <AuthContext.Provider value={{ userId, setUserId, user, setUser: setUserData, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);