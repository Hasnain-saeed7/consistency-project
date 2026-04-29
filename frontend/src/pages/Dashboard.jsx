
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useWinStore } from '../store/winStore';
import { useFailureStore } from '../store/failureStore';
import { useFocusStore } from '../store/focusStore';
import api from '../utils/api';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { FiTarget } from 'react-icons/fi';
import { MdOutlineCancel, MdOutlineCheckCircle, MdOutlineTrackChanges } from 'react-icons/md';
dayjs.extend(relativeTime);

const BADGE_LABELS = {
  first_win: '🏆 First win',
  wins_5:    '🌟 5 wins',
  wins_10:   '💎 10 wins',
  honest:    '🪞 Honest logger',
  streak_3:  '🔥 3-day streak',
  streak_7:  '⚡ 7-day streak',
  habits_3:  '📌 3 habits',
};

const s = {
  page: {
    minHeight: '100vh',
    background: '#F9F9F9',
    fontFamily: "'Sora', sans-serif",
    padding: '0 0 60px',
    position: 'relative',
  }, 
  glow1: {
    position: 'fixed', top: '-120px', left: '50%',
    transform: 'translateX(-50%)',
    width: '700px', height: '400px',
    background: 'radial-gradient(ellipse, rgba(212,114,74,0.13) 0%, transparent 70%)',
    pointerEvents: 'none', zIndex: 0,
  },
  glow2: {
    position: 'fixed', bottom: '-80px', right: '-100px',
    width: '500px', height: '400px',
    background: 'radial-gradient(ellipse, rgba(90,138,106,0.07) 0%, transparent 70%)',
    pointerEvents: 'none', zIndex: 0,
  },
  wrap: {
    maxWidth: '860px', margin: '0 auto',
    padding: '32px 24px', position: 'relative', zIndex: 1,
    display: 'flex', flexDirection: 'column', gap: '20px',
  },

  // header
  headerRow: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' },
  greetLabel: {
    fontSize: '11px', fontWeight: 500, letterSpacing: '.12em',
    textTransform: 'uppercase', color: '#d4724a', marginBottom: '6px',
  },
  greetName: {
    fontSize: '28px', fontWeight: 900, color: '#1e1c19',
    letterSpacing: '-0.03em', lineHeight: 1.1,
  },
  dateStr: { fontSize: '12px', color: '#6a6258', marginTop: '6px', letterSpacing: '.01em' },
  streakBadge: {
    background: 'black',
    border: '1px solid #4a2c18',
    borderRadius: '40px', padding: '8px 16px',
    display: 'flex', alignItems: 'center', gap: '6px',
    fontSize: '12px', fontWeight: 600, color: '#e8956e',
    boxShadow: '0 0 20px rgba(212,114,74,0.15)',
    flexShrink: 0, marginTop: '4px',
  },

  // divider
  divider: { height: '1px', background: 'linear-gradient(90deg, transparent, #2e2a22, transparent)' },

  // reminder
  reminderBox: {
    background: 'black',
    border: '1px solid #4a2c18',
    borderRadius: '14px', padding: '14px 18px',
    display: 'flex', alignItems: 'flex-start', gap: '12px',
    backdropFilter: 'blur(10px)',
  },
  reminderIcon: { fontSize: '16px', flexShrink: 0, marginTop: '1px' },
  reminderLabel: {
    fontSize: '9px', fontWeight: 600, letterSpacing: '.12em',
    textTransform: 'uppercase', color: '#d4724a', marginBottom: '3px',
  },
  reminderText: { fontSize: '13px', color: '#6a5040', lineHeight: 1.5 },

  // stats
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px' },
  statCard: {
    background: 'salt',
    border: '1px solid #2a2620',
    borderRadius: '16px', padding: '20px 16px',
    textAlign: 'center', position: 'relative', overflow: 'hidden',
    cursor: 'default',
    transition: 'border-color .2s, transform .2s',
  },
  statAccent: {
    position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
    width: '40px', height: '2px', borderRadius: '0 0 4px 4px',
  },
  statVal: {
    fontSize: '30px', fontWeight: 700,
    letterSpacing: '-0.04em', lineHeight: 1, marginBottom: '6px',
  },
  statLabel: {
    fontSize: '9px', fontWeight: 500, letterSpacing: '.1em',
    textTransform: 'uppercase', color: '#5a5248',
  },

  // quick actions
  qaGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  qaCard: {
    background: 'salted 1c1914',
    border: '1px solid black',
    borderRadius: '16px', padding: '20px',
    textDecoration: 'none', display: 'flex', flexDirection: 'column',
    gap: '8px', transition: 'border-color .2s, transform .2s, box-shadow .2s',
    cursor: 'pointer',
  },
  qaLabel: {
    fontSize: '12px', fontWeight: 600, letterSpacing: '.12em',
    textTransform: 'uppercase', color: '#5a5248',
  },
  qaValue: { fontSize: '15px', fontWeight: 600, color: '#5a5248', letterSpacing: '-0.01em' },
  progressTrack: {  
    height: '3px', borderRadius: '2px',
    background: '#2a2620', overflow: 'hidden', marginTop: '4px',
  },
  progressFill: {
    height: '100%', borderRadius: '2px',
    background: 'linear-gradient(90deg, #d4724a, #e8956e)',
    transition: 'width .6s cubic-bezier(.4,0,.2,1)',
  },

  // two col
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },

  // activity
  actCard: {
    background: 'salted 1c1914',
    border: '1px solid #2a2620',
    borderRadius: '16px', padding: '20px',
  },
  cardTitle: {
    fontSize: '9px', fontWeight: 600, letterSpacing: '.12em',
    textTransform: 'uppercase', color: '#5a5248', marginBottom: '16px',
    display: 'flex', alignItems: 'center', gap: '8px',
  },
  cardTitleLine: { flex: 1, height: '1px', background: '#1e1c19' },
  entryRow: {
    display: 'flex', alignItems: 'flex-start', gap: '12px',
    padding: '10px 0', borderBottom: '1px solid #1a1814',
  },
  entryDot: { width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0, marginTop: '5px' },
  entryTitle: { fontSize: '13px', color: '#6a5040', fontWeight: 500, lineHeight: 1.3 },
  entrySub: { fontSize: '10px', color: '#5a5248', marginTop: '3px', letterSpacing: '.01em' },
  entryEmpty: { fontSize: '13px', color: '#3a3630', textAlign: 'center', padding: '20px 0' },

  // badge
  badgeRow: { display: 'flex', flexWrap: 'wrap', gap: '6px' },
  badgePill: {
    background: 'salt', border: '1px solid #2e2848',
    borderRadius: '30px', padding: '5px 12px',
    fontSize: '11px', color: '#8a7ab8', fontWeight: 500,
  },

  // best streak card
  bestCard: {
    background: 'salt',
    border: '1px solid #3a2a18',
    borderRadius: '16px', padding: '20px 24px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },
  bestLabel: {
    fontSize: '9px', fontWeight: 600, letterSpacing: '.12em',
    textTransform: 'uppercase', color: '#6a5040', marginBottom: '6px',
  },
  bestVal: {
    fontSize: '24px', fontWeight: 700, color: '#e8956e', letterSpacing: '-0.03em',
  },
  fireGlyph: { fontSize: '36px', opacity: 0.3 },

  // motivational quote strip
  quoteStrip: {
    background: 'transparent',
    borderTop: '1px solid #1e1c19',
    borderBottom: '1px solid #1e1c19',
    padding: '14px 0', textAlign: 'center',
  },
  quoteText: {
    fontSize: '11px', color: 'black',
    fontStyle: 'italic', letterSpacing: '.02em',
  },
};

const QUOTES = [
  "Every expert was once a beginner. Every pro was once an amateur.",
  "You don't have to be extreme. Just consistent.",
  "Small steps every day lead to big results.",
  "Don't watch the clock — do what it does. Keep going.",
  "The secret to getting ahead is getting started.",
  "Discipline is doing it even when you don't feel like it.",
];

export default function Dashboard() {
  const { user, fetchMe }           = useAuthStore();
  const { wins, fetchWins }         = useWinStore();
  const { failures, fetchFailures } = useFailureStore();
  const { today, fetchToday }       = useFocusStore();
  const [streak,   setStreak]       = useState({ current: 0, longest: 0 });
  const [reminder, setReminder]     = useState(null);
  const [badges,   setBadges]       = useState([]);
  const [visible,  setVisible]      = useState(false);
  const [hovered,  setHovered]      = useState(null);

  const quote = QUOTES[dayjs().dayOfYear?.() % QUOTES.length || 0];

  useEffect(() => {
    Promise.all([
      fetchMe(), fetchWins(), fetchFailures(), fetchToday(),
      api.get('/streaks/me').then(r => setStreak(r.data)).catch(() => {}),
      api.get('/reminders/today').then(r => setReminder(r.data)).catch(() => {}),
      api.get('/badges/me').then(r => setBadges(r.data)).catch(() => {}),
    ]).finally(() => setTimeout(() => setVisible(true), 60));
  }, []);

  const hour       = new Date().getHours();
  const greet      = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const focusDone  = today?.goals?.filter(g => g.done).length || 0;
  const focusTotal = today?.goals?.length || 0;
  const focusPct   = focusTotal ? (focusDone / focusTotal) * 100 : 0;

  const winsArr = Array.isArray(wins) ? wins : [];
  const failuresArr = Array.isArray(failures) ? failures : [];
  const recent = [
    ...winsArr.slice(0, 5).map(w => ({ ...w, _type: 'win'  })),
    ...failuresArr.slice(0, 5).map(f => ({ ...f, _type: 'fail' })),
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  const fade = (i) => ({
    opacity:   visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(20px)',
    transition: `opacity .55s ease ${i * 0.08}s, transform .55s cubic-bezier(.2,.8,.3,1) ${i * 0.08}s`,
  });

  const STATS = [
    { label: 'Streak',  value: streak?.current || 0,          color: '#d4724a', accent: '#d4724a' },
    { label: 'Focus',   value: `${focusDone}/${focusTotal}`,  color: '#c4a882', accent: '#c4a882' },
    { label: 'Wins',    value: (wins || []).length,            color: '#5a8a6a', accent: '#5a8a6a' },
    { label: 'Lessons', value: (failures || []).length,        color: '#b85a5a', accent: '#b85a5a' },
  ];

  return (
    <div style={s.page}>
      {/* ambient glows */}
      <div style={s.glow1} />
      <div style={s.glow2} />

      <div style={s.wrap}>

        {/* ── HEADER ── */}
        <div style={{ ...s.headerRow, ...fade(0) }}>
          <div>
            <div style={s.greetLabel}>{greet}</div>
            <div style={s.greetName}>
              {user ? user.name.split(' ')[0] : 'Welcome'}
            </div>
            <div style={s.dateStr}>{dayjs().format('dddd, MMMM D · YYYY')}</div>
          </div>
          {streak.current > 0 && (
            <div style={s.streakBadge}>
              <span>🔥</span>
              <span>{streak.current} day streak</span>
            </div>
          )}
        </div>

        {/* ── DIVIDER ── */}
        <div style={{ ...s.divider, ...fade(1) }} />

        {/* ── REMINDER ── */}
        {reminder && (
          <div style={{ ...s.reminderBox, ...fade(2) }}>
            <span style={s.reminderIcon}>💡</span>
            <div>
              <div style={s.reminderLabel}>Reminder from your lessons</div>
              <div style={s.reminderText}>{reminder.text}</div>
            </div>
          </div>
        )}

        {/* ── STATS ── */}
        <div style={{ ...s.statsGrid, ...fade(3) }}>
          {STATS.map((st, i) => (
            <div
              key={st.label}
              style={{
                ...s.statCard,
                borderColor: hovered === i ? st.accent + '44' : '#2a2620',
                transform: hovered === i ? 'translateY(-2px)' : 'translateY(0)',
                boxShadow: hovered === i ? `0 8px 30px ${st.accent}18` : 'none',
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <div style={{ ...s.statAccent, background: st.accent }} />
              <div style={{ ...s.statVal, color: st.color }}>{st.value}</div>
              <div style={s.statLabel}>{st.label}</div>
            </div>
          ))}
        </div>

        {/* ── QUOTE STRIP ── */}
        <div style={{ ...s.quoteStrip, ...fade(4) }}>
          <div style={s.quoteText}>"{QUOTES[new Date().getDate() % QUOTES.length]}"</div>
        </div>

        {/* ── QUICK ACTIONS ── */}
        <div style={{ ...s.qaGrid, ...fade(5) }}>
          <Link
            to="/focus"
            style={{
              ...s.qaCard,
              borderColor: hovered === 'focus' ? 'pink' : '#2a2620',
              transform: hovered === 'focus' ? 'translateY(-2px)' : 'translateY(0)',
              boxShadow: hovered === 'focus' ? '0 8px 30px rgba(212,114,74,0.12)' : 'none',
            }}
            onMouseEnter={() => setHovered('focus')}
            onMouseLeave={() => setHovered(null)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={s.qaLabel}>Today's focus</div>
              <span style={{ fontSize: '16px' }}></span>
            </div>
            <div style={s.qaValue}>
              {focusTotal === 0 ? 'Set your 3 goals →' : `${focusDone} of ${focusTotal} done`}
            </div>
            {focusTotal > 0 && (
              <>
                <div style={s.progressTrack}>
                  <div style={{ ...s.progressFill, width: `${focusPct}%` }} />
                </div>
                <div style={{ fontSize: '10px', color: '#5a5248', marginTop: '2px' }}>
                  {focusPct}% complete
                </div>
              </>
            )}
          </Link>

          <Link
            to="/review"
            style={{
              ...s.qaCard,
              borderColor: hovered === 'review' ? '#c4a88244' : '#2a2620',
              transform: hovered === 'review' ? 'translateY(-2px)' : 'translateY(0)',
              boxShadow: hovered === 'review' ? '0 8px 30px rgba(196,168,130,0.10)' : 'none',
            }}
            onMouseEnter={() => setHovered('review')}
            onMouseLeave={() => setHovered(null)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
              <div style={s.qaLabel}>Evening review</div>
              <span style={{ fontSize: '16px' }}></span>
            </div>
            <div style={s.qaValue}>
              {today?.review ? 'Completed ✓' : 'Rate your day →'}
            </div>
            {today?.review && (
              <div style={{ fontSize: '11px', color: '#5a8a6a', marginTop: '2px' }}>
                Streak updated 
              </div>
            )}
          </Link>
        </div>

        {/* ── RECENT ACTIVITY + FAST LOG ── */}
        <div style={{ ...s.twoCol, ...fade(6) }}>

          {/* Recent activity */}
          <div style={s.actCard}>
            <div style={s.cardTitle}>
              Recent activity
              <div style={s.cardTitleLine} />
            </div>

            {recent.length === 0 ? (
              <div style={s.entryEmpty}>Nothing logged yet</div>
            ) : (
              recent.map((item, i) => (
                <div key={item._id}
                  style={{
                    ...s.entryRow,
                    borderBottom: i === recent.length - 1 ? 'none' : '1px solid #1a1814',
                  }}>
                  <div style={{
                    ...s.entryDot,
                    background: item._type === 'win' ? '#5a8a6a' : '#b85a5a',
                    boxShadow: item._type === 'win'
                      ? '0 0 6px rgba(90,138,106,0.5)'
                      : '0 0 6px rgba(184,90,90,0.5)',
                  }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={s.entryTitle} className="truncate">{item.title}</div>
                    <div style={s.entrySub}>
                      {item._type === 'win'
                        ? `Win · ${item.size} · ${'★'.repeat(item.mood)}`
                        : `Failure · ${item.lesson ? 'lesson saved' : 'logged'}`}
                      {' · '}{dayjs(item.createdAt).fromNow()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Fast log panel */}
          <div style={s.actCard}>
            <div style={s.cardTitle}>
              Quick log
              <div style={s.cardTitleLine} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                {
                  to: '/wins',
                  icon: <FiTarget color="#388e3c" />,
                  label: 'Log a win',
                  sub: 'Record something you achieved',
                  col: '#388e3c',
                  bg: 'salt',
                  br: '#2a4434',
                },
                {
                  to: '/failures',
                  icon: <MdOutlineCancel color="#d32f2f" />,
                  label: 'Log a failure',
                  sub: 'Extract a lesson from setback',
                  col: '#d32f2f',
                  bg: 'salt',
                  br: '#4a2828',
                },
                {
                  to: '/habits',
                  icon: <MdOutlineCheckCircle color="#1976d2" />,
                  label: 'Check habits',
                  sub: 'Track your daily disciplines',
                  col: '#1976d2',
                  bg: 'salt',
                  br: '#3a3060',
                },
                {
                  to: '/focus',
                  icon: <MdOutlineTrackChanges color="#f9a825" />,
                  label: 'Set focus',
                  sub: 'Define what matters today',
                  col: '#f9a825',
                  bg: 'salt',
                  br: '#4a2816',
                },
              ].map(item => (
                <Link
                  key={item.to}
                  to={item.to}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '10px 12px', borderRadius: '10px',
                    background: item.bg,
                    border: `1px solid ${item.br}`,
                    textDecoration: 'none',
                    transition: 'opacity .15s, transform .15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '.8'; e.currentTarget.style.transform = 'translateX(3px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1';  e.currentTarget.style.transform = 'translateX(0)'; }}
                >
                  <span style={{ fontSize: '18px', flexShrink: 0 }}>{item.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: item.col }}>{item.label}</div>
                    <div style={{ fontSize: '10px', color: '#5a5248', marginTop: '1px' }}>{item.sub}</div>
                  </div>
                  <span style={{ fontSize: '12px', color: item.col, opacity: 0.5 }}>→</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ── BEST STREAK ── */}
        {streak.longest > 0 && (
          <div style={{ ...s.bestCard, ...fade(7) }}>
            <div>
              <div style={s.bestLabel}>STREAK : </div>
              <div style={s.bestVal}>{streak.longest} days</div>
              <div style={{ fontSize: '11px', color: '#6a5040', marginTop: '4px' }}>
                {streak.current >= streak.longest
                  ? "You're at your all-time best right now "
                  : `${streak.longest - streak.current} days to beat your record`}
              </div>
            </div>
            
          </div>
        )}

        {/* ── BADGES ── */}
        {badges.length > 0 && (
          <div style={{ ...s.actCard, ...fade(8) }}>
            <div style={s.cardTitle}>
              Badges earned · {badges.length}
              <div style={s.cardTitleLine} />
            </div>
            <div style={s.badgeRow}>
              {badges.map(b => (
                <span key={b._id} style={s.badgePill}>
                  {BADGE_LABELS[b.type] || b.type}
                </span>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
} 

