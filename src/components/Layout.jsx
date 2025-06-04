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
    animate: { scaleX: 1 },
    exit: { scaleX: 0 },
  };

  const toggleMenu = () => setOpen(!open);
  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  // Open login modal if user is not authenticated
  useEffect(() => {
    if (!loading && !user) {
      openLoginModal();
    } else if (!loading && user) {
      closeLoginModal();
    }
  }, [loading, user]);

  // Display loading indicator
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Жүктелуде...
      </div>
    );
  }

  // Проверка роли учителя
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

  console.log('isTeacher:', isTeacher);

  return (
    <div>
      <header className="sticky top-0 z-30 py-5 bg-white min-h-10">
        <div className="flex justify-between items-center max-w-7xl px-10 my-0 mx-auto">
          <div className="flex gap-8 items-center">
            <NavLink to="/">
              <img
                src="/assets/images/logo.png"
                alt="UniAttend Logo"
                className="h-10 w-auto"
              />
            </NavLink>
            <nav className="hidden lg:block space-x-4 text-xl font-medium">
              {!user && (
                <>
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      isActive ? 'text-[#007AFF]' : 'text-[#9CA3AF]'
                    }
                  >
                    Басты
                  </NavLink>
                  <NavLink
                    to="/about"
                    className={({ isActive }) =>
                      isActive ? 'text-[#007AFF]' : 'text-[#9CA3AF]'
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
                          isActive ? 'text-[#007AFF]' : 'text-[#9CA3AF]'
                        }
                      >
                        Доска
                      </NavLink>
                      <NavLink
                        to="/create-schedule"
                        className={({ isActive }) =>
                          isActive ? 'text-[#007AFF]' : 'text-[#9CA3AF]'
                        }
                      >
                        Кесте
                      </NavLink>
                      <NavLink
                        to="/journal-entry"
                        className={({ isActive }) =>
                          isActive ? 'text-[#007AFF]' : 'text-[#9CA3AF]'
                        }
                      >
                        Журнал
                      </NavLink>
                    </>
                  )}
                  <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                      isActive ? 'text-[#007AFF]' : 'text-[#9CA3AF]'
                    }
                  >
                    Профиль
                  </NavLink>
                </>
              )}
            </nav>
          </div>
          <div className="lg:flex gap-3 text-xl items-center hidden">
            {user ? (
              <div className="flex flex-row items-center gap-x-10">
                <div className="flex flex-row gap-x-4">
                  <p className="text-lg">{user.name}</p>
                  <button
                    onClick={logout}
                    className="text-lg hover:text-[#007AFF]"
                  >
                    Шығу
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={openLoginModal}
                className="font-bold hover:text-[#007AFF]"
              >
                Кіру
              </button>
            )}
          </div>
          <FiMenu className="lg:hidden" onClick={toggleMenu} />
          <AnimatePresence>
            {open && (
              <motion.div
                variants={menuVars}
                initial="initial"
                animate="animate"
                exit="exit"
                className="fixed left-0 top-0 w-full h-screen origin-right bg-white text-black p-10 z-10"
              >
                <div className="flex h-full flex-col">
                  <div className="flex justify-end">
                    <IoIosClose size={40} onClick={toggleMenu} />
                  </div>
                  <div className="flex flex-col items-center text-xl">
                    {!user && (
                      <>
                        <NavLink
                          to="/"
                          onClick={toggleMenu}
                          className={({ isActive }) =>
                            isActive ? 'text-[#007AFF]' : 'text-[#9CA3AF]'
                          }
                        >
                          Басты
                        </NavLink>
                        <NavLink
                          to="/about"
                          onClick={toggleMenu}
                          className={({ isActive }) =>
                            isActive ? 'text-[#007AFF]' : 'text-[#9CA3AF]'
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
                              onClick={toggleMenu}
                              className={({ isActive }) =>
                                isActive ? 'text-[#007AFF]' : 'text-[#9CA3AF]'
                              }
                            >
                              Доска
                            </NavLink>
                            <NavLink
                              to="/create-schedule"
                              onClick={toggleMenu}
                              className={({ isActive }) =>
                                isActive ? 'text-[#007AFF]' : 'text-[#9CA3AF]'
                              }
                            >
                              Кесте
                            </NavLink>
                            <NavLink
                              to="/journal-entry"
                              onClick={toggleMenu}
                              className={({ isActive }) =>
                                isActive ? 'text-[#007AFF]' : 'text-[#9CA3AF]'
                              }
                            >
                              Журнал
                            </NavLink>
                          </>
                        )}
                        <NavLink
                          to="/profile"
                          onClick={toggleMenu}
                          className={({ isActive }) =>
                            isActive ? 'text-[#007AFF]' : 'text-[#9CA3AF]'
                          }
                        >
                          Профиль
                        </NavLink>
                      </>
                    )}
                    <div className="flex flex-col gap-3 text-md items-center my-10">
                      {user ? (
                        <div className="flex flex-col items-center">
                          <span>{user.name}</span>
                          <button
                            onClick={logout}
                            className="font-bold hover:text-[#007AFF]"
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
                          className="font-bold hover:text-[#007AFF]"
                        >
                          Кіру
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>
      <main className="w-full">
        <Outlet />
        <AnimatePresence>
          <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
        </AnimatePresence>
      </main>
      <footer className="flex flex-col md:flex-row items-center md:items-start w-full justify-center md:justify-between border-t-2">
        <div className="flex items-center justify-around w-3/4 flex-wrap gap-3">
          <div className="flex flex-col items-start">
            <NavLink to="/">
              <img
                src="/assets/images/logo.png"
                alt="UniAttend Logo"
                className="h-8 w-auto mb-4"
              />
            </NavLink>
            <div className="flex items-center justify-center space-x-5 my-5 w-full">
              <a href="#">
                <FaFacebookF color="#213F99" size={20} />
              </a>
              <a href="#">
                <CiInstagram color="#213F99" size={20} />
              </a>
              <a href="#">
                <IoLogoYoutube color="#213F99" size={20} />
              </a>
            </div>
          </div>
          <div className="flex flex-col text-start xs:text-xl">
            {!user && (
              <>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive ? 'text-[#007AFF]' : 'text-[#9CA3AF]'
                  }
                >
                  Басты
                </NavLink>
                <NavLink
                  to="/about"
                  className={({ isActive }) =>
                    isActive ? 'text-[#007AFF]' : 'text-[#9CA3AF]'
                  }
                >
                  Біз туралы
                </NavLink>
              </>
            )}
          </div>
          <div className="text-[#007AFF] text-center my-5 md:text-start">
            <h1 className="text-2xl font-semibold">Жұмыс уақыты</h1>
            <p>Дүйсенбі - Жұма</p>
            <p>08:00 - 18:00</p>
          </div>
        </div>
        <img
          className="relative right-0 w-full md:w-1/3 object-cover"
          src="https://img2.hocoos.com/cache/img-pack/1/w-620/h-285/ww-620/wh-285/img-pack/1/default-footer-bg.png"
          alt="Footer background"
        />
      </footer>
    </div>
  );
};

export default Layout;