import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const { register, loading } = useAuthStore();
  const navigate = useNavigate();

  const handle = async (e) => {
    e.preventDefault();
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created — now log in');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-[120px] opacity-10 pointer-events-none"
           style={{ background: '#d4724a' }} />

      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="text-2xl font-semibold text-t1 tracking-tight">Aaghaaz</div>
          <div className="text-sm text-t3 mt-1">Built for people who are struggling</div>
        </div>

        <form onSubmit={handle}
          className="bg-surface border border-border1 rounded-2xl p-7 flex flex-col gap-4">

          {[
            { key: 'name',     label: 'Your name',    type: 'text',     ph: 'Ahmad' },
            { key: 'email',    label: 'Email',         type: 'email',    ph: 'you@email.com' },
            { key: 'password', label: 'Password',      type: 'password', ph: '8+ characters' },
          ].map(({ key, label, type, ph }) => (
            <div key={key}>
              <label className="text-xs text-t3 uppercase tracking-widest block mb-2">{label}</label>
              <input
                type={type} required
                value={form[key]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                placeholder={ph}
                className="w-full bg-surface2 border border-border2 text-t1 placeholder-t3
                           rounded-lg px-3 py-2.5 text-sm outline-none
                           focus:border-orange transition-colors"
              />
            </div>
          ))}

          <button
            type="submit" disabled={loading}
            className="w-full bg-orange hover:bg-orange-light text-white font-medium
                       rounded-lg py-2.5 text-sm transition-colors mt-1 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Start my journey'}
          </button>

          <p className="text-center text-xs text-t3">
            Already have an account?{' '}
            <Link to="/login" className="text-orange hover:text-orange-light transition-colors">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}