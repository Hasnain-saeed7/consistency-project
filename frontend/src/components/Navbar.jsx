


import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { FiMenu, FiX } from 'react-icons/fi';

const links = [
  { to: '/dashboard', label: 'Home'     },
  { to: '/focus',     label: 'Focus'    },
  { to: '/habits',    label: 'Habits'   },
  { to: '/wins',      label: 'Wins'     },
  { to: '/failures',  label: 'Failures' },
  { to: '/review',    label: 'Review'   },
  { to: '/journal',   label: 'Journal'  },
];

export default function Navbar() {
  const { logout } = useAuthStore();
  const navigate   = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-[#1e1c19] backdrop-blur-md sticky top-0 z-50 font-sans">
      <div className="max-w-[860px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4 relative">
        {/* Logo */}
        <div className="text-[23px] font-bold text-[#d4724a] tracking-tight font-serif flex-shrink-0 select-none">
          Aag<span style={{ color: '#d4724a' }}>haaz</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-1 flex-1 justify-center">
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-[12px] font-medium whitespace-nowrap transition-all duration-150
                ${isActive ? 'bg-[#1e1c19] text-[#f0ebe0] border border-[#2e2a22]' : 'text-[#5a5248] border border-transparent'}`
              }
            >{l.label}</NavLink>
          ))}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden flex items-center justify-center p-2 rounded-lg border border-transparent focus:outline-none"
          aria-label="Open menu"
          onClick={() => setMenuOpen(v => !v)}
        >
          {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>

        {/* Logout (desktop) */}
        <button
          onClick={() => { logout(); navigate('/'); }}
          className="hidden md:inline-flex items-center gap-1 font-sans text-[12px] font-semibold px-3 py-1.5 rounded-lg border border-[#e6e1d6] bg-gradient-to-b from-[#f9f6f2] to-[#f3ede7] text-[#b85a5a] hover:bg-[#fff6f4] hover:border-[#d4724a] hover:text-[#d4724a] shadow-sm transition-all duration-200 ml-2"
          style={{ boxShadow: '0 1px 6px 0 rgba(212,114,74,0.07)' }}
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 20 20" style={{marginRight:2}}><path stroke="#d4724a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12.5 15.833v.834c0 .92-.746 1.666-1.667 1.666H5.833c-.92 0-1.666-.746-1.666-1.666V3.333c0-.92.746-1.666 1.666-1.666h5c.921 0 1.667.746 1.667 1.666v.834"/><path stroke="#d4724a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M17.5 10H8.333m0 0 2.5-2.5M8.333 10l2.5 2.5"/></svg>
          Sign out
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-14 left-0 w-full bg-white border-b border-[#1e1c19] shadow-lg z-40 animate-fadeIn">
          <div className="flex flex-col gap-1 px-4 py-3">
            {links.map(l => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-lg text-[14px] font-medium whitespace-nowrap transition-all duration-150
                  ${isActive ? 'bg-[#1e1c19] text-[#f0ebe0] border border-[#2e2a22]' : 'text-[#5a5248] border border-transparent'}`
                }
                onClick={() => setMenuOpen(false)}
              >{l.label}</NavLink>
            ))} 

            
            <button
              onClick={() => { logout(); navigate('/'); }}
              className="mt-2 flex items-center gap-1 font-sans text-[13px] font-semibold px-3 py-2 rounded-lg border border-[#e6e1d6] bg-gradient-to-b from-[#f9f6f2] to-[#f3ede7] text-[#b85a5a] hover:bg-[#fff6f4] hover:border-[#d4724a] hover:text-[#d4724a] shadow-sm transition-all duration-200"
              style={{ boxShadow: '0 1px 6px 0 rgba(212,114,74,0.07)' }}
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 20 20" style={{marginRight:2}}><path stroke="#d4724a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12.5 15.833v.834c0 .92-.746 1.666-1.667 1.666H5.833c-.92 0-1.666-.746-1.666-1.666V3.333c0-.92.746-1.666 1.666-1.666h5c.921 0 1.667.746 1.667 1.666v.834"/><path stroke="#d4724a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M17.5 10H8.333m0 0 2.5-2.5M8.333 10l2.5 2.5"/></svg>
              Sign out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}