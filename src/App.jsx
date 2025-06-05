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
import StudentsPage from './pages/StudentsPage';
import SchedulePage from './pages/SchedulePage';
import QrGeneratePage from './pages/QrGeneratePage';
import StatsPage from './pages/StatsPage';
import RegisterParticipantsPage from './pages/RegisterParticipantsPage';
import GroupsPage from './pages/GroupsPage';
import SubjectsPage from './pages/SubjectsPage';

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
          <Route path="/group/:groupId/students" element={<StudentsPage />} />
          <Route path="schedule" element={<SchedulePage />} />
          <Route path="qr-generate" element={<QrGeneratePage />} /> 
          <Route path="/stats" element={<StatsPage />} />
          <Route path="register-participants" element={<RegisterParticipantsPage />} />
          <Route path="groups" element={<GroupsPage />} />
          <Route path="subjects" element={<SubjectsPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
};

export default App;