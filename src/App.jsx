import { AuthProvider } from './services/AuthContext';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import AboutUsPage from './pages/AboutUsPage';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import ProfilePage from './pages/ProfilePage';
import CreateSchedulePage from './pages/CreateSchedulePage';
import JournalEntryPage from './pages/JournalEntryPage';
import DashboardPage from './pages/DashboardPage';

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutUsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="create-schedule" element={<CreateSchedulePage />} />
          <Route path="journal-entry" element={<JournalEntryPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
};

export default App;