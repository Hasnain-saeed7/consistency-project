import { useEffect, useState } from 'react';
import { useFocusStore } from '../store/focusStore';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import { FiTarget } from 'react-icons/fi';

export default function Focus() {
  const { today, loading, fetchToday, setGoals, toggleGoal } = useFocusStore();
  const [inputs, setInputs] = useState(['', '', '']);
  const [weeklyGoal, setWeeklyGoal] = useState('');
  const [mode, setMode] = useState('view'); // 'view' | 'set'

  useEffect(() => { fetchToday(); }, []);

  const handleSet = async () => {
    const goals = inputs.filter(g => g.trim());
    if (!goals.length) { toast.error('Add at least 1 goal'); return; }
    try {
      await setGoals(goals, weeklyGoal);
      toast.success('Focus set — go get it');
      setMode('view');
    } catch { toast.error('Something went wrong'); }
  };

  const handleToggle = async (i) => {
    try { await toggleGoal(i); } catch { toast.error('Failed to update'); }
  };

  const done = today?.goals?.filter(g => g.done).length || 0;
  const total = today?.goals?.length || 0;

  return (
    <div className="flex flex-col gap-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-t1 tracking-tight">Daily Focus</h1>
          <p className="text-xs text-t3 mt-0.5">{dayjs().format('dddd, MMMM D')}</p>
        </div>
        {!today?.goals?.length && (
          <button onClick={() => setMode('set')}
            className="bg-orange hover:bg-orange-light text-white text-xs font-medium
                       px-4 py-2 rounded-lg transition-colors">
            Set goals
          </button>
        )}
      </div>

      {/* Weekly goal */}
      {today?.weeklyGoal && (
        <div className="bg-focus-bg border border-focus-br rounded-xl px-4 py-3">
          <div className="text-[10px] text-focus uppercase tracking-wider mb-1">This week's goal</div>
          <div className="text-sm text-t1">{today.weeklyGoal}</div>
        </div>
      )}

      {/* Set goals form */}
      {mode === 'set' && (
        <div className="bg-surface border border-border1 rounded-2xl p-5 flex flex-col gap-4">
          <div className="text-xs text-t3 uppercase tracking-wider">
            Set up to 3 goals — be specific
          </div>
          {[0, 1, 2].map(i => (
            <div key={i}>
              <label className="text-xs text-t3 block mb-1.5">Goal {i + 1}{i === 0 ? ' *' : ' (optional)'}</label>
              <input
                value={inputs[i]}
                onChange={e => setInputs(prev => {
                  const n = [...prev]; n[i] = e.target.value; return n;
                })}
                placeholder={[
                  'What must you get done today?',
                  'Second priority...',
                  'Third priority...',
                ][i]}
                maxLength={100}
                className="w-full bg-surface2 border border-border2 text-t1 placeholder-t3
                           rounded-lg px-3 py-2.5 text-sm outline-none focus:border-orange transition-colors"
              />
            </div>
          ))}
          <div>
            <label className="text-xs text-t3 block mb-1.5">Weekly goal (optional)</label>
            <input
              value={weeklyGoal}
              onChange={e => setWeeklyGoal(e.target.value)}
              placeholder="What big thing are you working toward this week?"
              className="w-full bg-surface2 border border-border2 text-t1 placeholder-t3
                         rounded-lg px-3 py-2.5 text-sm outline-none focus:border-orange transition-colors"
            />
          </div>
          <div className="flex gap-3">
            <button onClick={handleSet}
              className="bg-orange hover:bg-orange-light text-white text-sm font-medium
                         px-5 py-2.5 rounded-lg transition-colors">
              Lock in goals
            </button>
            <button onClick={() => setMode('view')}
              className="bg-surface2 text-t2 text-sm px-5 py-2.5 rounded-lg
                         border border-border2 hover:border-border1 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Goals list */}
      {today?.goals?.length > 0 && (
        <div className="bg-surface border border-border1 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="text-xs text-t3 uppercase tracking-wider">Today's goals</div>
            <div className="text-xs text-t3">{done}/{total} done</div>
          </div>

          {/* Progress bar */}
          <div className="h-1 bg-surface3 rounded-full mb-4 overflow-hidden">
            <div className="h-full bg-orange rounded-full transition-all duration-500"
                 style={{ width: total ? `${(done / total) * 100}%` : '0%' }} />
          </div>

          <div className="flex flex-col gap-2">
            {today.goals.map((g, i) => (
              <div
                key={i}
                onClick={() => handleToggle(i)}
                className="flex items-center gap-3 p-3 rounded-xl cursor-pointer
                           bg-surface2 hover:bg-surface3 transition-colors group"
              >
                {/* Checkbox */}
                <div className={`w-5 h-5 rounded-md border flex items-center justify-center
                                 flex-shrink-0 transition-all
                                 ${g.done
                                   ? 'bg-win border-win'
                                   : 'border-border2 group-hover:border-t3'}`}>
                  {g.done && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5"
                            strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <span className={`text-sm flex-1 transition-all
                  ${g.done ? 'text-t3 line-through' : 'text-t1'}`}>
                  {g.text}
                </span>
                {g.done && (
                  <span className="text-[10px] text-win bg-win-bg px-2 py-0.5 rounded-full">
                    Done
                  </span>
                )}
              </div>
            ))}
          </div>

          {done === total && total > 0 && (
            <div className="mt-4 bg-win-bg border border-win-br rounded-xl px-4 py-3 text-center">
              <div className="text-win text-sm font-medium">All goals complete </div>
             <button onClick={() => setMode('set')}
              className="text-sm text-orange hover:text-orange-light transition-colors">
                Set new goals
              </button>
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {!loading && !today?.goals?.length && mode === 'view' && (
        <div className="bg-surface border border-border1 rounded-2xl p-8 text-center">
          <div className="text-3xl mb-3"><FiTarget/></div>
          <div className="text-sm font-medium text-t1 mb-1">No goals set for today</div>
          <div className="text-xs text-t3 mb-4">
            Set up to 3 goals each morning. Max 3 forces you to prioritise.
          </div>
          <button onClick={() => setMode('set')}
            className="bg-orange hover:bg-orange-light text-white text-sm font-medium
                       px-5 py-2.5 rounded-lg transition-colors">
            Set today's goals
          </button>
        </div>
      )}
    </div>
  );
}