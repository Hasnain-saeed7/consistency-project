import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useWinStore } from '../store/winStore';
import { useFailureStore } from '../store/failureStore';
import { useHabitStore } from '../store/habitStore';
import api from '../utils/api';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

const BADGE_LABELS = {
  first_win: { icon: '🏆', label: 'First Win',      desc: 'Logged your first win' },
  wins_5:    { icon: '🌟', label: '5 Wins',          desc: '5 wins logged' },
  wins_10:   { icon: '💎', label: '10 Wins',         desc: '10 wins logged' },
  honest:    { icon: '🪞', label: 'Honest Logger',   desc: 'Logged first failure' },
  streak_3:  { icon: '🔥', label: '3-Day Streak',    desc: '3 days in a row' },
  streak_7:  { icon: '⚡', label: '7-Day Streak',    desc: '7 days in a row' },
  streak_30: { icon: '👑', label: '30-Day Streak',   desc: '30 days in a row' },
  habits_3:  { icon: '📌', label: '3 Habits',        desc: 'Tracking 3 habits' },
};

export default function Profile() {
  const { user, fetchMe, logout } = useAuthStore();
  const { wins } = useWinStore();
  const { failures } = useFailureStore();
  const { habits } = useHabitStore();
  const [streak, setStreak] = useState({ current: 0, longest: 0, comebacks: 0 });
  const [badges, setBadges] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', email: '' });
  const [pwForm, setPwForm] = useState({ current: '', next: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchMe();
    api.get('/streaks/me').then(r => setStreak(r.data)).catch(() => {});
    api.get('/badges/me').then(r => setBadges(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (user) setForm({ name: user.name, email: user.email });
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/auth/me', form);
      await fetchMe();
      setEditing(false);
      toast.success('Profile updated');
    } catch { toast.error('Failed to update'); }
    finally { setSaving(false); }
  };

  const handlePassword = async () => {
    if (!pwForm.current || !pwForm.next) {
      toast.error('Fill both fields'); return;
    }
    if (pwForm.next.length < 8) {
      toast.error('Min 8 characters'); return;
    }
    try {
      await api.put('/auth/me', {
        currentPassword: pwForm.current,
        newPassword: pwForm.next
      });
      setPwForm({ current: '', next: '' });
      toast.success('Password changed');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed');
    }
  };

  const memberSince = user?.createdAt
    ? dayjs(user.createdAt).format('MMMM YYYY')
    : '—';

  // Heatmap for last 30 days based on reviews
  const bigWins = wins.filter(w => w.size === 'big').length;
  const lessonsExtracted = failures.filter(f => f.lesson).length;

  return (
    <div className="flex flex-col gap-5">

      {/* Header */}
      <div>
        <h1 className="text-lg font-semibold text-t1 tracking-tight">Profile</h1>
        <p className="text-xs text-t3 mt-0.5">Your identity and stats</p>
      </div>

      {/* Identity card */}
      <div className="bg-surface border border-border1 rounded-2xl p-5">
        <div className="flex items-center gap-4 mb-4">
          {/* Avatar */}
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center
                          text-xl font-semibold flex-shrink-0"
               style={{ background: '#2e1f16', color: '#d4724a' }}>
            {user?.name?.charAt(0).toUpperCase() || '?'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-base font-semibold text-t1">{user?.name}</div>
            <div className="text-xs text-t3 mt-0.5">{user?.email}</div>
            <div className="text-[10px] text-t3 mt-1">Member since {memberSince}</div>
          </div>
          <button onClick={() => setEditing(e => !e)}
            className="text-xs text-t3 hover:text-t2 border border-border2
                       hover:border-border1 px-3 py-1.5 rounded-lg transition-colors">
            {editing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {/* Edit form */}
        {editing && (
          <div className="flex flex-col gap-3 pt-4 border-t border-border1">
            <div>
              <label className="text-xs text-t3 block mb-1.5">Name</label>
              <input
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full bg-surface2 border border-border2 text-t1
                           rounded-lg px-3 py-2.5 text-sm outline-none
                           focus:border-orange transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-t3 block mb-1.5">Email</label>
              <input
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full bg-surface2 border border-border2 text-t1
                           rounded-lg px-3 py-2.5 text-sm outline-none
                           focus:border-orange transition-colors"
              />
            </div>
            <button onClick={handleSave} disabled={saving}
              className="bg-orange hover:bg-orange-light text-white text-sm
                         font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50">
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        )}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Current streak',   value: `${streak.current}d`,     color: 'text-orange' },
          { label: 'Longest streak',   value: `${streak.longest}d`,     color: 'text-streak' },
          { label: 'Total wins',        value: wins.length,              color: 'text-win' },
          { label: 'Big wins',          value: bigWins,                  color: 'text-win' },
          { label: 'Failures logged',   value: failures.length,          color: 'text-fail' },
          { label: 'Lessons extracted', value: lessonsExtracted,         color: 'text-orange' },
          { label: 'Habits tracking',   value: habits.length,            color: 'text-focus' },
          { label: 'Comebacks',         value: streak.comebacks || 0,    color: 'text-streak' },
        ].map(s => (
          <div key={s.label}
            className="bg-surface border border-border1 rounded-xl p-3 flex
                       items-center justify-between">
            <div className="text-xs text-t3">{s.label}</div>
            <div className={`text-sm font-semibold ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Badges */}
      <div className="bg-surface border border-border1 rounded-2xl p-4">
        <div className="text-xs text-t3 uppercase tracking-wider mb-3">
          Badges — {badges.length} earned
        </div>
        {badges.length === 0 ? (
          <div className="text-xs text-t3 text-center py-4">
            Complete actions to unlock badges
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {badges.map(b => {
              const bd = BADGE_LABELS[b.type];
              if (!bd) return null;
              return (
                <div key={b._id}
                  className="bg-streak-bg border border-streak-br rounded-xl
                             px-3 py-2.5 flex items-center gap-2.5">
                  <span className="text-xl">{bd.icon}</span>
                  <div>
                    <div className="text-xs font-medium text-streak">{bd.label}</div>
                    <div className="text-[10px] text-t3 mt-0.5">{bd.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Locked badges */}
        {badges.length < Object.keys(BADGE_LABELS).length && (
          <div className="mt-3 pt-3 border-t border-border1">
            <div className="text-[10px] text-t3 mb-2">Locked</div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(BADGE_LABELS)
                .filter(([key]) => !badges.find(b => b.type === key))
                .map(([key, bd]) => (
                  <span key={key}
                    className="text-[10px] px-2.5 py-1 rounded-full border border-border1
                               text-t3 opacity-50">
                    {bd.icon} {bd.label}
                  </span>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Change password */}
      <div className="bg-surface border border-border1 rounded-2xl p-5">
        <div className="text-xs text-t3 uppercase tracking-wider mb-4">Change password</div>
        <div className="flex flex-col gap-3">
          <input
            type="password"
            value={pwForm.current}
            onChange={e => setPwForm(p => ({ ...p, current: e.target.value }))}
            placeholder="Current password"
            className="w-full bg-surface2 border border-border2 text-t1 placeholder-t3
                       rounded-lg px-3 py-2.5 text-sm outline-none
                       focus:border-orange transition-colors"
          />
          <input
            type="password"
            value={pwForm.next}
            onChange={e => setPwForm(p => ({ ...p, next: e.target.value }))}
            placeholder="New password (min 8 chars)"
            className="w-full bg-surface2 border border-border2 text-t1 placeholder-t3
                       rounded-lg px-3 py-2.5 text-sm outline-none
                       focus:border-orange transition-colors"
          />
          <button onClick={handlePassword}
            className="bg-surface2 hover:bg-surface3 text-t2 text-sm font-medium
                       py-2.5 rounded-lg border border-border2 transition-colors">
            Update password
          </button>
        </div>
      </div>

      {/* Logout */}
      <button onClick={logout}
        className="w-full bg-fail-bg border border-fail-br text-fail text-sm
                   font-medium py-3 rounded-xl transition-colors hover:bg-fail
                   hover:text-white">
        Log out
      </button>

      {/* Footer */}
      <div className="text-center text-[10px] text-t3 pb-4">
        RiseLog · Built for people who are struggling
      </div>
    </div>
  );
}