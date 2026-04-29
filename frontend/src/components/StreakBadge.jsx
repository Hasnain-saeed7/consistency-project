import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const links = [
  { to: '/dashboard', label: 'Home' },
  { to: '/focus',     label: 'Focus' },
  { to: '/habits',    label: 'Habits' },
  { to: '/wins',      label: 'Wins' },
  { to: '/failures',  label: 'Failures' },
  { to: '/review',    label: 'Review' },
  { to: '/journal',   label: 'Journal' },
];

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 flex items-center justify-between h-12">
        <span className="font-semibold text-sm text-gray-900">RiseLog</span>
        <div className="flex gap-1 overflow-x-auto scrollbar-hide">
          {links.map((l) => (
            <NavLink
              key={l.to} to={l.to}
              className={({ isActive }) =>
                `px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-all
                 ${isActive
                   ? 'bg-gray-100 text-gray-900'
                   : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`
              }
            >{l.label}</NavLink>
          ))}
        </div>
        <button
          onClick={handleLogout}
          className="text-xs text-gray-400 hover:text-gray-700 ml-2 flex-shrink-0"
        >Logout</button>
      </div>
    </nav>
  );
}