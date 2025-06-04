/* eslint-disable react/prop-types */
import { useState } from 'react';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { IoIosClose } from 'react-icons/io';
import { useAuth } from '../services/AuthContext';

const modalAnimSttgs = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
};

const ModalLogin = ({ loginModalState, loginModalFunc }) => {
    const { setUserId } = useAuth();
    const [customerName, setCustomerName] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://logisticback.onrender.com/api/v1/auth/login', {
                customerName,
                password,
            });
            const userId = response.data; // Предполагая, что сервер возвращает ID пользователя в response.data
            setUserId(userId);
            loginModalFunc();
            alert("Успешный вход. ID пользователя: " + userId);
        } catch (error) {
            alert("Ошибка при входе: " + error);
            console.error('Ошибка при авторизации', error);
        }
    };

    return (
        <div className="">
            <AnimatePresence>
                {loginModalState && (
                    <motion.div
                        variants={modalAnimSttgs}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="fixed lg:w-1/4 lg:h-2/4 xl:1/3 w-full h-screen bg-white rounded-xl z-30 right-0 lg:left-2/4 origin-right lg:origin-center border"
                    >
                        <div className="flex flex-col px-8 py-2 md:gap-3 lg:gap-2">
                            <IoIosClose className="self-end" size={40} onClick={loginModalFunc} />
                            <h2 className="text-2xl font-bold mb-4 text-center">Войти</h2>
                            <form onSubmit={handleLogin} className='flex flex-col gap-10 justify-between'>
                                <input
                                    type="text"
                                    placeholder="Имя пользователя"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    name="name"
                                    className="border border-gray-300 p-2 w-full rounded"
                                />
                                <input
                                    type="password"
                                    placeholder="Пароль"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="border border-gray-300 p-2 w-full rounded"
                                />
                                <button 
                                    type="submit"
                                    className="bg-primaryNavy text-white py-2 px-4 rounded w-1/2 self-center"
                                    onClick={()=>handleLogin()}
                                    >Войти</button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const ModalRegister = ({ regModalState, regModalFunc }) => {
    const { setUserId } = useAuth();
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const closeHandler = () => {
        setCustomerName('');
        setCustomerPhone('');
        setPassword('');
        setMessage('');
        regModalFunc();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('https://logisticback.onrender.com/api/v1/auth/register', {
                customerName,
                customerPhone,
                password,
            });
            
            const userId = response.data; // Предполагая, что сервер возвращает ID пользователя в response.data
            setUserId(userId);

            // Handle successful response
            setMessage('Registration successful!');
            alert('Registration successful!');
            console.log(response.data); // You can also store token or user data here
            closeHandler(); // Close the modal on success
        } catch (error) {
            // Handle error response
            setMessage('Registration failed. Please check your inputs.');
            console.error(error);
        }
    };

    return (
        <div className="">
            <AnimatePresence>
                {regModalState && (
                    <motion.div
                        variants={modalAnimSttgs}
                        initial="initial" animate="animate" exit="exit"
                        className="fixed lg:w-1/4 lg:h-3/5 w-full h-screen bg-white rounded-xl z-30 right-0 lg:left-2/4 origin-right lg:origin-center border">
                        <div className="flex flex-col px-10">
                            <IoIosClose className="self-end cursor-pointer" size={40} onClick={closeHandler} />
                            <h2 className="text-2xl font-bold mb-4 text-center">Регистрация</h2>
                            <form onSubmit={handleSubmit} className="flex flex-col text-start">
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-2" htmlFor="customerName">Создайте Логин</label>
                                    <input
                                        type="text"
                                        id="customerName"
                                        name="customerName"
                                        value={customerName}
                                        onChange={(e) => setCustomerName(e.target.value)}
                                        className="border border-gray-300 p-2 w-full"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-2" htmlFor="customerPhone">Ваш Номер Телефона</label>
                                    <input
                                        type="phone"
                                        id="customerPhone"
                                        name="customerPhone"
                                        value={customerPhone}
                                        onChange={(e) => setCustomerPhone(e.target.value)}
                                        className="border border-gray-300 p-2 w-full"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-2" htmlFor="password">Придумайте Пароль</label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="border border-gray-300 p-2 w-full"
                                        required
                                    />
                                </div>
                                <button type="submit" onClick={()=>handleSubmit()} className="bg-primaryNavy text-white py-2 px-4 rounded w-full">Register</button>
                                {message && <p className="mt-4 text-red-600">{message}</p>}
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export { ModalRegister, ModalLogin };
