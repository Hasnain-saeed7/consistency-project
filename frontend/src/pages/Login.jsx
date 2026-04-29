import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const { login, loading } = useAuthStore();
  const navigate = useNavigate();

  const handle = async (e) => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      toast.success('Welcome back');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      {/* Ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-[120px] opacity-10 pointer-events-none"
           style={{ background: '#d4724a' }} />

      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="text-2xl font-semibold text-t1 tracking-tight">Aaghaaz</div>
          <div className="text-sm text-t3 mt-1">Your comeback starts here</div>
        </div>

        <form onSubmit={handle}
          className="bg-surface border border-border1 rounded-2xl p-7 flex flex-col gap-4">

          <div>
            <label className="text-xs text-t3 uppercase tracking-widest block mb-2">Email</label>
            <input
              type="email" required
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="you@email.com"
              className="w-full bg-surface2 border border-border2 text-t1 placeholder-t3
                         rounded-lg px-3 py-2.5 text-sm outline-none
                         focus:border-orange transition-colors"
            />
          </div>

          <div>
            <label className="text-xs text-t3 uppercase tracking-widest block mb-2">Password</label>
            <input
              type="password" required
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              placeholder="••••••••"
              className="w-full bg-surface2 border border-border2 text-t1 placeholder-t3
                         rounded-lg px-3 py-2.5 text-sm outline-none
                         focus:border-orange transition-colors"
            />
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full bg-orange hover:bg-orange-light text-white font-medium
                       rounded-lg py-2.5 text-sm transition-colors mt-1 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Log in'}
          </button>

          <p className="text-center text-xs text-t3">
            No account?{' '}
            <Link to="/register" className="text-orange hover:text-orange-light transition-colors">
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}