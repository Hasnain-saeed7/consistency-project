import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// Pages
import Landing   from './pages/Landing';
import Login     from './pages/Login';
import Register  from './pages/Register';
import Dashboard from './pages/Dashboard';
import Focus     from './pages/Focus';
import Habits    from './pages/Habits';
import Wins      from './pages/Wins';
import Failures  from './pages/Failures';
import Review    from './pages/Review';
import Journal   from './pages/Journal';
import Profile   from './pages/Profile';
import Layout    from './components/Layout';

const Protected = ({ children }) => {
  const token = useAuthStore((s) => s.token);
  return token ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/"         element={<Landing />} />
      <Route path="/login"    element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected — all wrapped in Layout (navbar) */}
      <Route path="/" element={<Protected><Layout /></Protected>}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="focus"     element={<Focus />} />
        <Route path="habits"    element={<Habits />} />
        <Route path="wins"      element={<Wins />} />
        <Route path="failures"  element={<Failures />} />
        <Route path="review"    element={<Review />} />
        <Route path="journal"   element={<Journal />} />
        <Route path="profile"   element={<Profile />} />
      </Route>
    </Routes>
  );
}