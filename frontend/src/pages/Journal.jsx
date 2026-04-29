import { useEffect, useState } from 'react';
import { useWinStore } from '../store/winStore';
import { useFailureStore } from '../store/failureStore';
import api from '../utils/api';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const FILTERS = ['All', 'Wins', 'Failures', 'Reviews'];

export default function Journal() {
  const { wins, fetchWins } = useWinStore();
  const { failures, fetchFailures } = useFailureStore();
  const [reviews, setReviews] = useState([]);
  const [filter, setFilter] = useState('All');
  const [streak, setStreak] = useState({ current: 0, longest: 0 });
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    fetchWins();
    fetchFailures();
    api.get('/focus/history').then(r =>
      setReviews((r.data || []).filter(h => h.review))
    ).catch(() => {});
    api.get('/streaks/me').then(r => setStreak(r.data)).catch(() => {});
    api.get('/badges/me').then(r => setBadges(r.data)).catch(() => {});
  }, []);

  const BADGE_LABELS = {
    first_win: '🏆 First win',
    wins_5:    '🌟 5 wins',
    wins_10:   '💎 10 wins',
    honest:    '🪞 Honest logger',
    streak_3:  '🔥 3-day streak',
    streak_7:  '⚡ 7-day streak',
    streak_30: '👑 30-day streak',
    habits_3:  '📌 3 habits',
  };

  // Merge all entries into one timeline
  const safeWins = wins || [];
  const safeFailures = failures || [];
  const safeReviews = reviews || [];
  const all = [
    ...safeWins.map(w => ({
      ...w, _type: 'win',
      sortDate: new Date(w.createdAt)
    })),
    ...safeFailures.map(f => ({
      ...f, _type: 'fail',
      sortDate: new Date(f.createdAt)
    })),
    ...safeReviews.map(r => ({
      ...r, _type: 'review',
      sortDate: new Date(r.date)
    })),
  ].sort((a, b) => b.sortDate - a.sortDate);

  const filtered = all.filter(item => {
    if (filter === 'All') return true;
    if (filter === 'Wins') return item._type === 'win';
    if (filter === 'Failures') return item._type === 'fail';
    if (filter === 'Reviews') return item._type === 'review';
    return true;
  });

  // Group by date
  const grouped = filtered.reduce((acc, item) => {
    const key = dayjs(item.sortDate).format('YYYY-MM-DD');
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  const typeConfig = {
    win:    { color: '#5a8a6a', bg: '#E6F3EB', br: '#B3D9C2', label: 'Win' },
    fail:   { color: '#b85a5a', bg: '#FCE8E8', br: '#F5BDBD', label: 'Failure' },
    review: { color: '#d4724a', bg: '#FFF0E5', br: '#FFD1B3', label: 'Review' },
  };

  const ratingColor = (n) => {
    if (n >= 8) return '#5a8a6a';
    if (n >= 5) return '#d4724a';
    return '#b85a5a';
  };

  return (
    <div className="flex flex-col gap-5">

      {/* Header */}
      <div>
        <h1 className="text-lg font-semibold text-t1 tracking-tight">Journal</h1>
        <p className="text-xs text-t3 mt-0.5">Your full story — every win, failure, and review</p>
      </div>

      {/* Streak + stats */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-surface border border-border1 rounded-xl p-3 text-center">
          <div className="text-xl font-semibold text-orange">{streak.current}</div>
          <div className="text-[10px] text-t3 uppercase tracking-wider mt-1">Streak</div>
        </div>
        <div className="bg-surface border border-border1 rounded-xl p-3 text-center">
          <div className="text-xl font-semibold text-win">{wins?.length || 0}</div>
          <div className="text-[10px] text-t3 uppercase tracking-wider mt-1">Wins</div>
        </div>
        <div className="bg-surface border border-border1 rounded-xl p-3 text-center">
          <div className="text-xl font-semibold text-fail">{failures?.length || 0}</div>
          <div className="text-[10px] text-t3 uppercase tracking-wider mt-1">Lessons</div>
        </div>
        <div className="bg-surface border border-border1 rounded-xl p-3 text-center">
          <div className="text-xl font-semibold text-streak">{streak.longest}</div>
          <div className="text-[10px] text-t3 uppercase tracking-wider mt-1">Best</div>
        </div>
      </div>

      {/* Badges */}
      {badges?.length > 0 && (
        <div className="bg-surface border border-border1 rounded-2xl p-4">
          <div className="text-xs text-t3 uppercase tracking-wider mb-3">Badges earned</div>
          <div className="flex flex-wrap gap-2">
            {badges.map(b => (
              <span key={b._id}
                className="bg-streak-bg border border-streak-br text-streak
                           text-xs px-3 py-1 rounded-full font-medium">
                {BADGE_LABELS[b.type] || b.type}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-1.5 bg-surface border border-border1
                      rounded-xl p-1.5">
        {FILTERS.map(f => (
          <button key={f}
            onClick={() => setFilter(f)}
            className="flex-1 py-1.5 text-xs font-medium rounded-lg transition-all"
            style={filter === f
              ? { background: '#F0F0F0', color: '#1A1A1A',
                  border: '0.5px solid #D1D1D1' }
              : { color: '#737373' }
            }
          >{f}</button>
        ))}
      </div>

      {/* Timeline */}
      {Object.keys(grouped).length === 0 ? (
        <div className="bg-surface border border-border1 rounded-2xl p-8 text-center">
          <div className="text-3xl mb-3">📖</div>
          <div className="text-sm font-medium text-t1 mb-1">Nothing here yet</div>
          <div className="text-xs text-t3">
            Start logging wins, failures and reviews — your journal builds itself.
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {Object.entries(grouped).map(([date, items]) => (
            <div key={date}>
              {/* Date label */}
              <div className="flex items-center gap-3 mb-2">
                <div className="text-xs text-t3 font-medium whitespace-nowrap">
                  {dayjs(date).isSame(dayjs(), 'day')
                    ? 'Today'
                    : dayjs(date).isSame(dayjs().subtract(1, 'day'), 'day')
                    ? 'Yesterday'
                    : dayjs(date).format('ddd, MMM D')}
                </div>
                <div className="flex-1 h-px bg-border1" />
              </div>

              {/* Entries for this date */}
              <div className="flex flex-col gap-2">
                {items.map(item => {
                  const tc = typeConfig[item._type];
                  return (
                    <div key={item._id}
                      className="bg-surface border border-border1 rounded-xl p-3.5
                                 flex gap-3 items-start">
                      {/* Color bar */}
                      <div className="w-1 self-stretch rounded-full flex-shrink-0"
                           style={{ background: tc.color }} />

                      <div className="flex-1 min-w-0">
                        {/* Win */}
                        {item._type === 'win' && (
                          <>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                                    style={{ background: tc.bg, color: tc.color }}>
                                {tc.label} · {item.size}
                              </span>
                              <span className="text-[11px]" style={{ color: '#d4724a' }}>
                                {'★'.repeat(item.mood)}
                              </span>
                            </div>
                            <div className="text-sm text-t1">{item.title}</div>
                            {item.description && (
                              <div className="text-xs text-t2 mt-1">{item.description}</div>
                            )}
                          </>
                        )}

                        {/* Failure */}
                        {item._type === 'fail' && (
                          <>
                            <div className="mb-1">
                              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                                    style={{ background: tc.bg, color: tc.color }}>
                                {tc.label} · {item.category}
                              </span>
                            </div>
                            <div className="text-sm text-t1">{item.title}</div>
                            {item.lesson && (
                              <div className="flex gap-1.5 mt-2 bg-orange-bg border
                                              border-orange-br rounded-lg px-2.5 py-1.5">
                                <span className="text-orange text-xs">→</span>
                                <span className="text-xs text-orange-light">{item.lesson}</span>
                              </div>
                            )}
                          </>
                        )}

                        {/* Review */}
                        {item._type === 'review' && (
                          <>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                                    style={{ background: tc.bg, color: tc.color }}>
                                {tc.label}
                              </span>
                              <span className="text-xs font-medium"
                                    style={{ color: ratingColor(item.review?.rating || 0) }}>
                                {item.review?.rating || 0}/10
                              </span>
                            </div>
                            {item.review.highlight && (
                              <div className="text-sm text-t1">{item.review.highlight}</div>
                            )}
                            {item.review.tomorrow && (
                              <div className="text-xs text-orange-light mt-1">
                                Tomorrow: {item.review.tomorrow}
                              </div>
                            )}
                          </>
                        )}

                        <div className="text-[10px] text-t3 mt-1.5">
                          {dayjs(item.sortDate).fromNow()}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}