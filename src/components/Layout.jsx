import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { FiMenu } from 'react-icons/fi';
import { IoIosClose } from 'react-icons/io';
import { FaFacebookF } from 'react-icons/fa';
import { CiInstagram } from 'react-icons/ci';
import { IoLogoYoutube } from 'react-icons/io';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../services/AuthContext';
import LoginModal from './LoginModal';

const Layout = () => {
  const [open, setOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { userId, logout, user, loading } = useAuth();
  const navigate = useNavigate();

  console.log('Layout: userId, user, loading', { userId, user, loading });

  const menuVars = {
    initial: { scaleX: 0 },
    animate: { scaleX: 1, transition: { duration: 0.3, ease: 'easeInOut' } },
    exit: { scaleX: 0, transition: { duration: 0.3, ease: 'easeInOut' } },
  };

  const linkVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const toggleMenu = () => setOpen(!open);
  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  // Пайдаланушы аутентификацияланбаған жағдайда логин модалын ашу
  useEffect(() => {
    if (!loading && !user) {
      openLoginModal();
    } else if (!loading && user) {
      closeLoginModal();
    }
  }, [loading, user]);

  // Мұғалім және әкімші рөлдерін тексеру
  const isTeacher = Array.isArray(user?.roles) && user.roles.length > 0
    ? user.roles.some((role) => {
        if (typeof role === 'string') {
          return role.toLowerCase() === 'teacher';
        } else if (role && 'name' in role) {
          return role.name.toLowerCase() === 'teacher';
        }
        return false;
      })
    : false;

  const isAdmin = Array.isArray(user?.roles) && user.roles.length > 0
    ? user.roles.some((role) => {
        if (typeof role === 'string') {
          return role.toLowerCase() === 'admin';
        } else if (role && 'name' in role) {
          return role.name.toLowerCase() === 'admin';
        }
        return false;
      })
    : false;

  console.log('isTeacher:', isTeacher, 'isAdmin:', isAdmin);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="sticky top-0 z-30 bg-white shadow-md py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <NavLink to="/">
              <img
                src="/assets/images/logo.png"
                alt="UniAttend логотипі"
                className="h-10 w-auto"
              />
            </NavLink>
            <nav className="hidden lg:flex space-x-6 text-lg font-medium">
              {!user && (
                <>
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      `transition-colors duration-200 ${isActive ? 'text-[#007AFF] font-semibold' : 'text-gray-600 hover:text-[#007AFF]'}`
                    }
                  >
                    Басты
                  </NavLink>
                  <NavLink
                    to="/about"
                    className={({ isActive }) =>
                      `transition-colors duration-200 ${isActive ? 'text-[#007AFF] font-semibold' : 'text-gray-600 hover:text-[#007AFF]'}`
                    }
                  >
                    Біз туралы
                  </NavLink>
                </>
              )}
              {user && (
                <>
                  {isTeacher && (
                    <>
                      <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                          `transition-colors duration-200 ${isActive ? 'text-[#007AFF] font-semibold' : 'text-gray-600 hover:text-[#007AFF]'}`
                        }
                      >
                        Тақта
                      </NavLink>
                      <NavLink
                        to="/schedule"
                        className={({ isActive }) =>
                          `transition-colors duration-200 ${isActive ? 'text-[#007AFF] font-semibold' : 'text-gray-600 hover:text-[#007AFF]'}`
                        }
                      >
                        Кесте
                      </NavLink>
                      <NavLink
                        to="/create-schedule"
                        className={({ isActive }) =>
                          `transition-colors duration-200 ${isActive ? 'text-[#007AFF] font-semibold' : 'text-gray-600 hover:text-[#007AFF]'}`
                        }
                      >
                        Кесте құру
                      </NavLink>
                      <NavLink
                        to="/journal-entry"
                        className={({ isActive }) =>
                          `transition-colors duration-200 ${isActive ? 'text-[#007AFF] font-semibold' : 'text-gray-600 hover:text-[#007AFF]'}`
                        }
                      >
                        Журнал
                      </NavLink>
                    </>
                  )}
                  {isAdmin && (
                    <>
                      <NavLink
                        to="/register-participants"
                        className={({ isActive }) =>
                          `transition-colors duration-200 ${isActive ? 'text-[#007AFF] font-semibold' : 'text-gray-600 hover:text-[#007AFF]'}`
                        }
                      >
                        Қатысушыларды тіркеу
                      </NavLink>
                      <NavLink
                        to="/groups"
                        className={({ isActive }) =>
                          `transition-colors duration-200 ${isActive ? 'text-[#007AFF] font-semibold' : 'text-gray-600 hover:text-[#007AFF]'}`
                        }
                      >
                        Топтар
                      </NavLink>
                      <NavLink
                        to="/subjects"
                        className={({ isActive }) =>
                          `transition-colors duration-200 ${isActive ? 'text-[#007AFF] font-semibold' : 'text-gray-600 hover:text-[#007AFF]'}`
                        }
                      >
                        Пәндер
                      </NavLink>
                    </>
                  )}
                  <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                      `transition-colors duration-200 ${isActive ? 'text-[#007AFF] font-semibold' : 'text-gray-600 hover:text-[#007AFF]'}`
                    }
                  >
                    Профиль
                  </NavLink>
                </>
              )}
            </nav>
          </div>
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-6">
                <span className="text-lg text-gray-800">{user.name}</span>
                <button
                  onClick={logout}
                  className="bg-[#007AFF] text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-[#007AFF] transition-all duration-200"
                >
                  Шығу
                </button>
              </div>
            ) : (
              <button
                onClick={openLoginModal}
                className="bg-[#007AFF] text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-[#007AFF] transition-all duration-200"
              >
                Кіру
              </button>
            )}
          </div>
          <FiMenu className="lg:hidden text-2xl cursor-pointer" onClick={toggleMenu} />
          <AnimatePresence>
            {open && (
              <motion.div
                variants={menuVars}
                initial="initial"
                animate="animate"
                exit="exit"
                className="fixed left-0 top-0 w-full h-screen bg-white text-black p-6 z-50"
              >
                <div className="flex flex-col h-full">
                  <div className="flex justify-end">
                    <IoIosClose size={40} className="cursor-pointer" onClick={toggleMenu} />
                  </div>
                  <nav className="flex flex-col items-center gap-4 text-xl mt-8">
                    {!user && (
                      <>
                        <motion.div variants={linkVariants} initial="initial" animate="animate">
                          <NavLink
                            to="/"
                            onClick={toggleMenu}
                            className={({ isActive }) =>
                              `block py-2 ${isActive ? 'text-[#007AFF] font-semibold' : 'text-gray-600 hover:text-[#007AFF]'}`
                            }
                          >
                            Басты
                          </NavLink>
                        </motion.div>
                        <motion.div variants={linkVariants} initial="initial" animate="animate">
                          <NavLink
                            to="/about"
                            onClick={toggleMenu}
                            className={({ isActive }) =>
                              `block py-2 ${isActive ? 'text-[#007AFF] font-semibold' : 'text-gray-600 hover:text-[#007AFF]'}`
                            }
                          >
                            Біз туралы
                          </NavLink>
                        </motion.div>
                      </>
                    )}
                    {user && (
                      <>
                        {isTeacher && (
                          <>
                            <motion.div variants={linkVariants} initial="initial" animate="animate">
                              <NavLink
                                to="/dashboard"
                                onClick={toggleMenu}
                                className={({ isActive }) =>
                                  `block py-2 ${isActive ? 'text-[#007AFF] font-semibold' : 'text-gray-600 hover:text-[#007AFF]'}`
                                }
                              >
                                Тақта
                              </NavLink>
                            </motion.div>
                            <motion.div variants={linkVariants} initial="initial" animate="animate">
                              <NavLink
                                to="/schedule"
                                onClick={toggleMenu}
                                className={({ isActive }) =>
                                  `block py-2 ${isActive ? 'text-[#007AFF] font-semibold' : 'text-gray-600 hover:text-[#007AFF]'}`
                                }
                              >
                                Кесте
                              </NavLink>
                            </motion.div>
                            <motion.div variants={linkVariants} initial="initial" animate="animate">
                              <NavLink
                                to="/create-schedule"
                                onClick={toggleMenu}
                                className={({ isActive }) =>
                                  `block py-2 ${isActive ? 'text-[#007AFF] font-semibold' : 'text-gray-600 hover:text-[#007AFF]'}`
                                }
                              >
                                Кесте құру
                              </NavLink>
                            </motion.div>
                            <motion.div variants={linkVariants} initial="initial" animate="animate">
                              <NavLink
                                to="/journal-entry"
                                onClick={toggleMenu}
                                className={({ isActive }) =>
                                  `block py-2 ${isActive ? 'text-[#007AFF] font-semibold' : 'text-gray-600 hover:text-[#007AFF]'}`
                                }
                              >
                                Журнал
                              </NavLink>
                            </motion.div>
                          </>
                        )}
                        {isAdmin && (
                          <>
                            <motion.div variants={linkVariants} initial="initial" animate="animate">
                              <NavLink
                                to="/register-participants"
                                onClick={toggleMenu}
                                className={({ isActive }) =>
                                  `block py-2 ${isActive ? 'text-[#007AFF] font-semibold' : 'text-gray-600 hover:text-[#007AFF]'}`
                                }
                              >
                                Қатысушыларды тіркеу
                              </NavLink>
                            </motion.div>
                            <motion.div variants={linkVariants} initial="initial" animate="animate">
                              <NavLink
                                to="/groups"
                                onClick={toggleMenu}
                                className={({ isActive }) =>
                                  `block py-2 ${isActive ? 'text-[#007AFF] font-semibold' : 'text-gray-600 hover:text-[#007AFF]'}`
                                }
                              >
                                Топтар
                              </NavLink>
                            </motion.div>
                            <motion.div variants={linkVariants} initial="initial" animate="animate">
                              <NavLink
                                to="/subjects"
                                onClick={toggleMenu}
                                className={({ isActive }) =>
                                  `block py-2 ${isActive ? 'text-[#007AFF] font-semibold' : 'text-gray-600 hover:text-[#007AFF]'}`
                                }
                              >
                                Пәндер
                              </NavLink>
                            </motion.div>
                          </>
                        )}
                        <motion.div variants={linkVariants} initial="initial" animate="animate">
                          <NavLink
                            to="/profile"
                            onClick={toggleMenu}
                            className={({ isActive }) =>
                              `block py-2 ${isActive ? 'text-[#007AFF] font-semibold' : 'text-gray-600 hover:text-[#007AFF]'}`
                            }
                          >
                            Профиль
                          </NavLink>
                        </motion.div>
                      </>
                    )}
                    <motion.div variants={linkVariants} initial="initial" animate="animate" className="mt-8">
                      {user ? (
                        <div className="flex flex-col items-center gap-4">
                          <span className="text-lg text-gray-800">{user.name}</span>
                          <button
                            onClick={() => {
                              logout();
                              toggleMenu();
                            }}
                            className="bg-[#007AFF] text-white px-6 py-2 rounded-lg shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-[#007AFF] transition-all duration-200"
                          >
                            Шығу
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            toggleMenu();
                            openLoginModal();
                          }}
                          className="bg-[#007AFF] text-white px-6 py-2 rounded-lg shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-[#007AFF] transition-all duration-200"
                        >
                          Кіру
                        </button>
                      )}
                    </motion.div>
                  </nav>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>
      <main className="flex-1 w-full">
        <Outlet />
        <AnimatePresence>
          <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
        </AnimatePresence>
      </main>
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
          <div className="flex flex-col items-center md:items-start">
            <NavLink to="/">
              <img
                src="/assets/images/logo.png"
                alt="UniAttend логотипі"
                className="h-8 w-auto mb-4"
              />
            </NavLink>
            <div className="flex items-center gap-4">
              <a href="#" className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                <FaFacebookF color="#213F99" size={20} />
              </a>
              <a href="#" className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                <CiInstagram color="#213F99" size={20} />
              </a>
              <a href="#" className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                <IoLogoYoutube color="#213F99" size={20} />
              </a>
            </div>
          </div>
          <div className="flex flex-col items-center md:items-start gap-2 text-lg">
            {!user && (
              <>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `transition-colors ${isActive ? 'text-[#007AFF] font-semibold' : 'text-gray-600 hover:text-[#007AFF]'}`
                  }
                >
                  Басты
                </NavLink>
                <NavLink
                  to="/about"
                  className={({ isActive }) =>
                    `transition-colors ${isActive ? 'text-[#007AFF] font-semibold' : 'text-gray-600 hover:text-[#007AFF]'}`
                  }
                >
                  Біз туралы
                </NavLink>
              </>
            )}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-xl font-semibold text-[#007AFF] mb-2">Жұмыс уақыты</h1>
            <p className="text-gray-600">Дүйсенбі - Жұма</p>
            <p className="text-gray-600">08:00 - 18:00</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;