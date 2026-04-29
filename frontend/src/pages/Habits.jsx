import { useEffect, useState } from 'react';
import { useHabitStore } from '../store/habitStore';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

const COLORS = ['#d4724a','#5a8a6a','#8a7ab8','#7a9ab8','#b85a5a','#c4a882'];

export default function Habits() {
  const { habits, fetchHabits, addHabit, toggleHabit, removeHabit } = useHabitStore();
  const [input, setInput] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => { fetchHabits(); }, []);

  const handleAdd = async () => {
    if (!input.trim()) return;
    try {
      await addHabit(input.trim());
      setInput('');
      setAdding(false);
      toast.success('Habit added — check it off every day');
    } catch { toast.error('Failed to add habit'); }
  };

  const handleToggle = async (id) => {
    try { await toggleHabit(id); }
    catch { toast.error('Failed to update'); }
  };

  const handleRemove = async (id) => {
      try {
        await removeHabit(id);
        toast.success('Habit removed');
      } catch {
        toast.error('Failed to remove');
      }
    };

  const isCheckedToday = (habit) => {
    const today = dayjs().format('YYYY-MM-DD');
    return habit.logs?.some(l =>
      dayjs(l.date).format('YYYY-MM-DD') === today && l.done
    );
  };

  // Build 21-day heatmap from logs
  const buildHeatmap = (logs = []) => {
    return Array.from({ length: 21 }, (_, i) => {
      const d = dayjs().subtract(20 - i, 'day').format('YYYY-MM-DD');
      return logs.some(l => dayjs(l.date).format('YYYY-MM-DD') === d && l.done);
    });
  };

  return (
    <div className="flex flex-col gap-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-t1 tracking-tight">Habits</h1>
          <p className="text-xs text-t3 mt-0.5">Don't break the chain</p>
        </div>
        <button onClick={() => setAdding(a => !a)}
          className="bg-orange hover:bg-orange-light text-white text-xs font-medium
                     px-4 py-2 rounded-lg transition-colors">
          {adding ? 'Cancel' : '+ Add habit'}
        </button>
      </div>

      {/* Add form */}
      {adding && (
        <div className="bg-surface border border-border1 rounded-2xl p-5 flex gap-3">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            placeholder="e.g. Wake up 6am, Read 20 mins, No phone before 9am"
            maxLength={60}
            autoFocus
            className="flex-1 bg-surface2 border border-border2 text-t1 placeholder-t3
                       rounded-lg px-3 py-2.5 text-sm outline-none focus:border-orange transition-colors"
          />
          <button onClick={handleAdd}
            className="bg-orange hover:bg-orange-light text-white text-sm font-medium
                       px-4 py-2.5 rounded-lg transition-colors flex-shrink-0">
            Add
          </button>
        </div>
      )}

      {/* Habits list */}
      {habits.length === 0 ? (
        <div className="bg-surface border border-border1 rounded-2xl p-8 text-center">
          <div className="text-3xl mb-3">📌</div>
          <div className="text-sm font-medium text-t1 mb-1">No habits yet</div>
          <div className="text-xs text-t3">
            Add daily habits and track your streaks. Small daily actions compound.
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {habits.map((h, idx) => {
            const checked = isCheckedToday(h);
            const heatmap = buildHeatmap(h.logs);
            const color = COLORS[idx % COLORS.length];

            return (
              <div key={h._id}
                className="bg-surface border border-border1 rounded-2xl p-4 flex flex-col gap-3">

                {/* Top row */}
                <div className="flex items-center gap-3">
                  {/* Check button */}
                  <button
                    onClick={() => handleToggle(h._id)}
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center
                                flex-shrink-0 transition-all
                                ${checked
                                  ? 'border-transparent'
                                  : 'border-border2 hover:border-t3'}`}
                    style={checked ? { background: color } : {}}
                  >
                    {checked && (
                      <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                        <path d="M1 5L4.5 8.5L11 1" stroke="white" strokeWidth="2"
                              strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium transition-all
                      ${checked ? 'text-t3 line-through' : 'text-t1'}`}>
                      {h.name}
                    </div>
                    <div className="text-[11px] text-t3 mt-0.5">
                      Longest: {h.longestStreak || 0}d
                    </div>
                  </div>

                  {/* Streak */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {(h.currentStreak || 0) > 0 && (
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full"
                            style={{ background: color + '20', color }}>
                        {h.currentStreak}d
                      </span>
                    )}
                    <button onClick={() => handleRemove(h._id)}
                      className="text-t3 hover:text-fail text-xs px-2 py-1 rounded-md
                                 hover:bg-fail-bg transition-colors">
                      ×
                    </button>
                  </div>
                </div>

                {/* Heatmap */}
                <div className="flex gap-1">
                  {heatmap.map((active, i) => (
                    <div key={i}
                      className="flex-1 h-2 rounded-sm transition-all"
                      style={{ background: active ? color : '#E5E5E5' }}
                      title={dayjs().subtract(20 - i, 'day').format('MMM D')}
                    />
                  ))}
                </div>
                <div className="flex justify-between">
                  <span className="text-[10px] text-t3">21 days </span>
                  <span className="text-[10px] text-t3">today</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Summary */}
      {habits.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-surface border border-border1 rounded-xl p-3 text-center">
            <div className="text-xl font-semibold text-t1">{habits.length}</div>
            <div className="text-[10px] text-t3 uppercase tracking-wider mt-1">Habits</div>
          </div>
          <div className="bg-surface border border-border1 rounded-xl p-3 text-center">
            <div className="text-xl font-semibold text-orange">
              {habits.filter(h => isCheckedToday(h)).length}
            </div>
            <div className="text-[10px] text-t3 uppercase tracking-wider mt-1">Done today</div>
          </div>
          <div className="bg-surface border border-border1 rounded-xl p-3 text-center">
            <div className="text-xl font-semibold text-streak">
              {Math.max(...habits.map(h => h.currentStreak || 0), 0)}
            </div>
            <div className="text-[10px] text-t3 uppercase tracking-wider mt-1">Best streak</div>
          </div>
        </div>
      )}
    </div>
  );
}