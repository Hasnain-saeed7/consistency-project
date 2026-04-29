
// import { useEffect, useState, useRef } from 'react';
// import { useWinStore } from '../store/winStore';
// import toast from 'react-hot-toast';
// import dayjs from 'dayjs';
// import relativeTime from 'dayjs/plugin/relativeTime';
// dayjs.extend(relativeTime);

// /* ── Psychology strings — shown contextually ── */
// const ENCOURAGEMENTS = [
//   "Every win you log rewires your brain to look for progress.",
//   "You're building evidence that you're capable. Keep going.",
//   "Small wins compound. Log everything.",
//   "The person who logs wins daily outperforms the one who doesn't — every time.",
//   "Your future self will read this and be grateful you tracked it.",
// ];

// const SIZE_PSYCHOLOGY = {
//   small:  { color: '#5a8a6a', bg: 'salt', br: '#1a3828', label: 'Small win',  icon: '✦', msg: "Small wins are the foundation. Never skip logging them." },
//   medium: { color: '#7a9ab8', bg: 'salt', br: '#1a2c3e', label: 'Medium win', icon: '◆', msg: "Medium wins show real momentum. You're moving forward." },
//   big:    { color: '#c4723a', bg: 'salt', br: '#3a2010', label: 'Big win',    icon: '★', msg: "This is a milestone. Own it — you earned every bit of this." },
// };

// const BADGE_META = {
//   first_win:   { icon: '🏆', label: 'First Win',        desc: "You started. That's everything.",       rare: false },
//   wins_5:      { icon: '🌟', label: '5 Wins',            desc: 'Momentum is building.',                 rare: false },
//   wins_10:     { icon: '💎', label: '10 Wins',           desc: "You're becoming consistent.",          rare: false },
//   wins_25:     { icon: '🔱', label: '25 Wins',           desc: 'Elite level of self-tracking.',         rare: true  },
//   streak_3:    { icon: '🔥', label: '3-Day Streak',      desc: '3 days straight. Habits are forming.',  rare: false },
//   streak_7:    { icon: '⚡', label: '7-Day Streak',      desc: 'A full week. You mean it.',             rare: false },
//   streak_10:   { icon: '💫', label: '10-Day Streak',     desc: "This is who you're becoming.",         rare: true  },
//   streak_30:   { icon: '👑', label: '30-Day Streak',     desc: 'One month of showing up. Legendary.',   rare: true  },
//   streak_100:  { icon: '🌙', label: '100-Day Streak',    desc: 'You are the 1%. Extraordinary.',        rare: true  },
//   honest:      { icon: '🪞', label: 'Honest Logger',     desc: 'Logging failure takes courage.',        rare: false },
//   honest_10:   { icon: '🧠', label: 'Deep Honest',       desc: '10 failures logged. Rare self-awareness.', rare: true },
//   habits_3:    { icon: '📌', label: '3 Habits',          desc: 'Discipline across 3 fronts.',           rare: false },
//   comeback:    { icon: '♻️', label: 'Comeback Kid',      desc: 'You broke a streak and restarted.',     rare: false },
// };

// const MOOD_LABELS = ['', '😐 Rough', '🙂 Ok', '😊 Good', '😄 Great', '🤩 Amazing'];

// /* ── Badge popup component ── */
// function BadgePopup({ badges, onClose }) {
//   const [visible, setVisible] = useState(false);
//   useEffect(() => {
//     setTimeout(() => setVisible(true), 50);
//     const t = setTimeout(onClose, 5000);
//     return () => clearTimeout(t);
//   }, []);

//   if (!badges.length) return null;

//   return (
//     <div style={{
//       position: 'fixed', inset: 0, zIndex: 1000,
//       display: 'flex', alignItems: 'center', justifyContent: 'center',
//       background: 'rgba(10,9,8,.85)',
//       backdropFilter: 'blur(12px)',
//       opacity: visible ? 1 : 0,
//       transition: 'opacity .4s ease',
//     }} onClick={onClose}>
//       <div style={{
//         background: 'linear-gradient(145deg, #1a1612, #141210)',
//         border: '1px solid #3a2818',
//         borderRadius: '24px',
//         padding: '48px 40px',
//         textAlign: 'center',
//         maxWidth: '400px',
//         width: '90%',
//         transform: visible ? 'scale(1) translateY(0)' : 'scale(.9) translateY(20px)',
//         transition: 'transform .5s cubic-bezier(.2,.8,.3,1)',
//         boxShadow: '0 40px 100px rgba(0,0,0,.5), 0 0 60px rgba(196,114,58,.1)',
//       }}>
//         {/* Glow ring */}
//         <div style={{
//           position: 'absolute', top: '50%', left: '50%',
//           transform: 'translate(-50%,-50%)',
//           width: '300px', height: '300px',
//           background: 'radial-gradient(circle, rgba(196,114,58,.08) 0%, transparent 70%)',
//           export default function Wins() {
//             const { wins, stats, fetchWins, fetchStats, addWin, removeWin } = useWinStore();
//             const [form, setForm]         = useState({ title: '', description: '', size: 'small', mood: 4 });
//             const [showing, setShowing]   = useState(false);
//             const [submitting, setSubmitting] = useState(false);
//             const [newBadges, setNewBadges]   = useState([]);
//             const [charCount, setCharCount]   = useState(0);
//             const [encourage, setEncourage]   = useState(0);
//             const inputRef = useRef();

//             useEffect(() => {
//               fetchWins();
//               fetchStats();
//               const interval = setInterval(() => setEncourage(e => (e + 1) % ENCOURAGEMENTS.length), 8000);
//               return () => clearInterval(interval);
//             }, []);

//             useEffect(() => {
//               if (showing && inputRef.current) inputRef.current.focus();
//             }, [showing]);

//             const handleSubmit = async () => {
//               if (!form.title.trim()) { toast.error('What did you achieve?'); return; }
//               setSubmitting(true);
//               try {
//                 const result = await addWin(form);
//                 const earned = result?.newBadges || [];
//                 if (earned.length) setNewBadges(earned);
//                 setForm({ title: '', description: '', size: 'small', mood: 4 });
//                 setCharCount(0);
//                 setShowing(false);
//                 fetchStats();
//                 toast.success(form.size === 'big' ? '🏆 Big win locked in!' : '✓ Win logged', { duration: 3000 });
//               } catch (err) {
//                 toast.error('Failed to log win');
//               } finally {
//                 setSubmitting(false);
//               }
//             };

//             const handleDelete = async (id) => {
//               try { await removeWin(id); fetchStats(); }
//               catch { toast.error('Failed'); }
//             };

//             const sc = SIZE_PSYCHOLOGY[form.size];

//             return (
//               <>
//                 {newBadges.length > 0 && (
//                   <BadgePopup badges={newBadges} onClose={() => setNewBadges([])} />
//                 )}

//                 <div className="flex flex-col gap-5 font-sans">
//                   {/* HEADER */}
//                   <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
//                     <div>
//                       <h1 className="text-[22px] font-semibold text-black tracking-tight">Wins</h1>
//                       <p className="text-xs text-[#5a5248] mt-1">Your proof wall — when doubt hits, you have receipts</p>
//                     </div>
//                     <button
//                       onClick={() => setShowing(s => !s)}
//                       className={`rounded-xl px-5 py-2 text-xs font-semibold transition-all duration-200 ${showing ? 'bg-[#1a1814] border border-[#2e2a22] text-[#8a8070]' : 'bg-[#5a8a6a] border border-[#2a4434] text-white'}`}
//                     >
//                       {showing ? 'Cancel' : '+ Log win'}
//                     </button>
//                   </div>

//                   {/* PSYCHOLOGY BANNER */}
//                   <StreakBanner wins={wins || []} />

//                   {/* STATS */}
//                   {stats && (
//                     <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//                       {[
//                         { label: 'Total wins',  value: stats.total,    color: 'black' },
//                         { label: 'This week',   value: stats.thisWeek, color: '#f0ebe0' },
//                         { label: 'Big wins',    value: stats.bySize?.big || 0, color: '#c4723a' },
//                         { label: 'Next badge',  value: stats.total < 5 ? `${5 - stats.total} away` : stats.total < 10 ? `${10 - stats.total} away` : '✓', color: '#8a7ab8' },
//                       ].map(s => (
//                         <div key={s.label} className="bg-[#f9f9f9] border border-[#2a2620] rounded-xl py-4 px-2 text-center">
//                           <div className="text-xl font-bold" style={{ color: s.color }}>{s.value}</div>
//                           <div className="text-[9px] text-[#5a5248] uppercase tracking-wider mt-2">{s.label}</div>
//                         </div>
//                       ))}
//                     </div>
//                   )}

//                   {/* ROTATING ENCOURAGEMENT */}
//                   <div className="border-y border-[#1e1c19] py-3 text-center">
//                     <div className="text-xs text-[#4a4438] italic tracking-wide transition-opacity duration-500">
//                       "{ENCOURAGEMENTS[encourage]}"
//                     </div>
//                   </div>

//                   {/* LOG FORM */}
//                   {showing && (
//                     <div className="bg-[#f9f9f9] border border-[#2a2620] rounded-2xl p-5 flex flex-col gap-4">
//                       <div className="text-[10px] text-[#5a5248] uppercase tracking-wider">Log a win — any size counts</div>
//                       {/* Title input */}
//                       <div>
//                         <div className="flex justify-between mb-2">
//                           <label className="text-[11px] text-[#5a5248] uppercase tracking-wide">What did you achieve? *</label>
//                           <span className={`text-[10px] ${charCount > 100 ? 'text-[#b85a5a]' : 'text-[#3a3630]'}`}>{charCount}/120</span>
//                         </div>
//                         <input
//                           ref={inputRef}
//                           value={form.title}
//                           onChange={e => { setForm(f => ({ ...f, title: e.target.value })); setCharCount(e.target.value.length); }}
//                           placeholder="Be specific — 'Finished the auth module' not 'did coding'"
//                           maxLength={120}
//                           className="w-full bg-[#f9f9f9] border rounded-lg px-4 py-2 text-[13px] font-sans outline-none focus:border-[#5a8a6a] transition-colors border-[#2a2620]"
//                         />
//                         {form.title.length > 10 && (
//                           <div className="text-[11px] text-[#3a5030] mt-1">✓ Good — specific wins are easier to build on</div>
//                         )}
//                       </div>
//                       {/* Description */}
//                       <div>
//                         <label className="text-[11px] text-[#5a5248] uppercase tracking-wide block mb-2">Context (optional)</label>
//                         <textarea
//                           value={form.description}
//                           onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
//                           placeholder="What made this happen? What does it mean for you?"
//                           rows={2}
//                           maxLength={400}
//                           className="w-full bg-[#f9f9f9] border border-[#2a2620] rounded-lg px-4 py-2 text-[13px] font-sans outline-none resize-none focus:border-[#3a5030] transition-colors"
//                         />
//                       </div>
//                       {/* Size selector */}
//                       <div>
//                         <label className="text-[11px] text-[#5a5248] uppercase tracking-wide block mb-2">Win size</label>
//                         <div className="grid grid-cols-3 gap-2">
//                           {Object.entries(SIZE_PSYCHOLOGY).map(([key, cfg]) => (
//                             <button key={key}
//                               onClick={() => setForm(f => ({ ...f, size: key }))}
//                               className={`py-3 px-2 rounded-xl cursor-pointer border ${form.size === key ? '' : 'border-[#f9f9f9]'} bg-${form.size === key ? '[#f9f9f9]' : '[#f9f9f9]'} text-left font-sans transition-all duration-200`}
//                               style={{ borderColor: form.size === key ? cfg.br : '#f9f9f9' }}
//                             >
//                               <div className="text-[16px] mb-1">{cfg.icon}</div>
//                               <div className="text-[12px] font-semibold" style={{ color: form.size === key ? cfg.color : '#5a5248' }}>{cfg.label}</div>
//                             </button>
//                           ))}
//                         </div>
//                         <div className="text-[11px] mt-2 opacity-70 italic" style={{ color: SIZE_PSYCHOLOGY[form.size].color }}>
//                           {SIZE_PSYCHOLOGY[form.size].msg}
//                         </div>
//                       </div>
//                       {/* Mood */}
//                       <div>
//                         <label className="text-[11px] text-[#5a5248] uppercase tracking-wide block mb-2">
//                           How do you feel? · <span className="text-[#c4723a] normal-case tracking-normal">{MOOD_LABELS[form.mood]}</span>
//                         </label>
//                         <div className="flex gap-2">
//                           {[1,2,3,4,5].map(n => (
//                             <button key={n}
//                               onClick={() => setForm(f => ({ ...f, mood: n }))}
//                               className={`text-2xl bg-none border-none cursor-pointer p-1 transition-all duration-150 ${n <= form.mood ? 'text-[#c4723a] drop-shadow' : 'text-[#2a2620]'}`}
//                               style={{ transform: n === form.mood ? 'scale(1.2)' : 'scale(1)' }}
//                             >★</button>
//                           ))}
//                         </div>
//                       </div>
//                       {/* Submit */}
//                       <button
//                         onClick={handleSubmit}
//                         disabled={submitting || !form.title.trim()}
//                         className={`rounded-xl py-3 mt-2 font-semibold text-[13px] transition-all duration-200 ${submitting || !form.title.trim() ? 'bg-[#f9f9f9] text-[#3a3630] cursor-not-allowed' : 'bg-gradient-to-r from-[#5a8a6a] to-[#4a7a5a] text-white cursor-pointer'}`}
//                       >
//                         {submitting ? 'Logging...' : form.size === 'big' ? '🏆 Lock in this big win' : '✓ Log this win'}
//                       </button>
//                     </div>
//                   )}

//                   {/* WINS FEED */}
//                   {(!wins || wins.length === 0) ? (
//                     <div className="bg-[#f9f9f9] border border-[#2a2620] rounded-2xl py-12 px-6 text-center">
//                       <div className="text-4xl mb-3">🏆</div>
//                       <div className="text-base font-semibold text-[#f0ebe0] mb-2">No wins yet</div>
//                       <div className="text-[13px] text-[#4a4438] leading-relaxed max-w-xs mx-auto">
//                         Your first log is the hardest. After that, it gets addictive.
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="flex flex-col gap-2">
//                       {(wins || []).map((w, idx) => {
//                         const cfg = SIZE_PSYCHOLOGY[w.size] || SIZE_PSYCHOLOGY.small;
//                         return (
//                           <div key={w._id} className="bg-[#f9f9f9] border border-[#2a2620] rounded-xl p-4 flex gap-3 transition-all duration-200 hover:border-[#c4723a] hover:translate-x-1">
//                             {/* Color bar */}
//                             <div className="w-1 rounded bg-[#5a8a6a] flex-shrink-0 self-stretch" style={{ background: cfg.color, boxShadow: `0 0 8px ${cfg.color}66` }} />
//                             <div className="flex-1 min-w-0">
//                               <div className="flex justify-between items-start gap-2">
//                                 <div className="flex-1">
//                                   <div className="text-[13px] font-semibold text-[#5a5248] leading-snug">{w.title}</div>
//                                   {w.description && <div className="text-[12px] text-[#5a5248] mt-1 leading-snug">{w.description}</div>}
//                                 </div>
//                                 <button onClick={() => handleDelete(w._id)}
//                                   className="text-[#3a3630] bg-none border-none cursor-pointer text-base flex-shrink-0 px-2 py-1 rounded hover:text-[#b85a5a] transition-colors"
//                                 >×</button>
//                               </div>
//                               <div className="flex items-center gap-2 mt-2 flex-wrap">
//                                 <span className="text-[10px] font-semibold px-3 py-1 rounded-full tracking-wide" style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.br}` }}>{cfg.icon} {cfg.label}</span>
//                                 <span className="text-[12px] text-[#c4723a]">{'★'.repeat(w.mood)}<span className="text-[#2a2620]">{'★'.repeat(5 - w.mood)}</span></span>
//                                 <span className="text-[10px] text-[#3a3630] tracking-wide">{dayjs(w.createdAt).fromNow()}</span>
//                               </div>
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   )}
//                 </div>
//               </>
//             );
//           }
//                   >
//                     <div style={{ fontSize: '16px', marginBottom: '4px' }}>{cfg.icon}</div>
//                     <div style={{ fontSize: '12px', fontWeight: 600, color: form.size === key ? cfg.color : '#5a5248' }}>{cfg.label}</div>
//                   </button>
//                 ))}
//               </div>
//               {/* Psychology message for size */}
//               <div style={{
//                 fontSize: '11px', color: SIZE_PSYCHOLOGY[form.size].color,
//                 marginTop: '8px', opacity: 0.7, fontStyle: 'italic',
//               }}>
//                 {SIZE_PSYCHOLOGY[form.size].msg}
//               </div>
//             </div>

//             {/* Mood */}
//             <div>
//               <label style={{ fontSize: '11px', color: '#5a5248', letterSpacing: '.06em', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
//                 How do you feel? · <span style={{ color: '#c4723a', textTransform: 'none', letterSpacing: 0 }}>{MOOD_LABELS[form.mood]}</span>
//               </label>
//               <div style={{ display: 'flex', gap: '6px' }}>
//                 {[1,2,3,4,5].map(n => (
//                   <button key={n}
//                     onClick={() => setForm(f => ({ ...f, mood: n }))}
//                     style={{
//                       fontSize: '24px', background: 'none', border: 'none',
//                       cursor: 'pointer', padding: '4px',
//                       color: n <= form.mood ? '#c4723a' : '#2a2620',
//                       transform: n === form.mood ? 'scale(1.2)' : 'scale(1)',
//                       transition: 'all .15s',
//                       filter: n <= form.mood ? 'drop-shadow(0 0 6px rgba(196,114,58,.4))' : 'none',
//                     }}
//                   >★</button>
//                 ))}
//               </div>
//             </div>

//             {/* Submit */}
//             <button
//               onClick={handleSubmit}
//               disabled={submitting || !form.title.trim()}
//               style={{
//                 background: submitting || !form.title.trim()
//                   ? 'salt'
//                   : 'linear-gradient(135deg, #5a8a6a, #4a7a5a)',
//                 border: '1px solid #2a4434',
//                 color: submitting || !form.title.trim() ? '#3a3630' : '#fff',
//                 borderRadius: '12px', padding: '13px',
//                 fontSize: '13px', fontWeight: 600,
//                 cursor: submitting || !form.title.trim() ? 'not-allowed' : 'pointer',
//                 fontFamily: "'Sora', sans-serif",
//                 transition: 'all .2s',
//                 letterSpacing: '.02em',
//               }}
//             >
//               {submitting ? 'Logging...' : form.size === 'big' ? '🏆 Lock in this big win' : '✓ Log this win'}
//             </button>
//           </div>
//         )}

//         {/* ── WINS FEED ── */}
//         {(!wins || wins.length === 0) ? (
//           <div style={{
//             background: 'salt',
//             border: '1px solid #2a2620',
//             borderRadius: '18px', padding: '48px 24px',
//             textAlign: 'center',
//           }}>
//             <div style={{ fontSize: '40px', marginBottom: '14px' }}>🏆</div>
//             <div style={{ fontSize: '15px', fontWeight: 600, color: '#f0ebe0', marginBottom: '8px' }}>No wins yet</div>
//             <div style={{ fontSize: '13px', color: '#4a4438', lineHeight: 1.6, maxWidth: '280px', margin: '0 auto' }}>
//               Your first log is the hardest. After that, it gets addictive.
//             </div>
//           </div>
//         ) : (
//           <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
//             {(wins || []).map((w, idx) => {
//               const cfg = SIZE_PSYCHOLOGY[w.size] || SIZE_PSYCHOLOGY.small;
//               return (
//                 <div key={w._id} style={{
//                   background: 'salt',
//                   border: '1px solid #2a2620',
//                   borderRadius: '16px', padding: '16px',
//                   display: 'flex', gap: '14px',
//                   transition: 'border-color .2s, transform .2s',
//                 }}
//                 onMouseEnter={e => { e.currentTarget.style.borderColor = cfg.br; e.currentTarget.style.transform = 'translateX(3px)'; }}
//                 onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a2620'; e.currentTarget.style.transform = 'translateX(0)'; }}
//                 >
//                   {/* Color bar */}
//                   <div style={{ width: '3px', borderRadius: '2px', background: cfg.color, flexShrink: 0, alignSelf: 'stretch', boxShadow: `0 0 8px ${cfg.color}66` }} />

//                   <div style={{ flex: 1, minWidth: 0 }}>
//                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
//                       <div style={{ flex: 1 }}>
//                         <div style={{ fontSize: '13px', fontWeight: 600, color: '#5a5248', lineHeight: 1.4 }}>{w.title}</div>
//                         {w.description && <div style={{ fontSize: '12px', color: '#5a5248', marginTop: '4px', lineHeight: 1.5 }}>{w.description}</div>}
//                       </div>
//                       <button onClick={() => handleDelete(w._id)} style={{
//                         color: '#3a3630', background: 'none', border: 'none',
//                         cursor: 'pointer', fontSize: '14px', flexShrink: 0, padding: '2px 6px',
//                         borderRadius: '4px', transition: 'color .15s',
//                       }}
//                       onMouseEnter={e => e.target.style.color = '#b85a5a'}
//                       onMouseLeave={e => e.target.style.color = '#3a3630'}
//                       >×</button>
//                     </div>


//                     <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
//                       <span style={{
//                         fontSize: '10px', fontWeight: 600, padding: '2px 9px',
//                         borderRadius: '20px', letterSpacing: '.04em',
//                         background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.br}`,
//                       }}>{cfg.icon} {cfg.label}</span>
//                       <span style={{ fontSize: '12px', color: '#c4723a' }}>{'★'.repeat(w.mood)}<span style={{ color: '#2a2620' }}>{'★'.repeat(5 - w.mood)}</span></span>
//                       <span style={{ fontSize: '10px', color: '#3a3630', letterSpacing: '.02em' }}>
//                         {dayjs(w.createdAt).fromNow()}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </>
  




























import { useEffect, useState, useRef } from 'react';
import { useWinStore } from '../store/winStore';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { FiFramer } from 'react-icons/fi';
dayjs.extend(relativeTime);

const ENCOURAGEMENTS = [
  "Every win you log rewires your brain to look for progress.",
  "You're building evidence that you're capable. Keep going.",
  "Small wins compound. Log everything.",
  "The person who logs wins daily outperforms the one who doesn't — every time.",
  "Your future self will read this and be grateful you tracked it.",
];

const SIZE_PSYCHOLOGY = {
  small:  { color: 'pink', bg: 'salt', br: 'black', label: 'Small win',  icon: '✦', msg: "Small wins are the foundation. Never skip logging them." },
  medium: { color: '#7a9ab8', bg: 'salt', br: 'black', label: 'Medium win', icon: '◆', msg: "Medium wins show real momentum. You're moving forward." },
  big:    { color: '#c4723a', bg: 'salt', br: 'black', label: 'Big win',    icon: '★', msg: "This is a milestone. Own it — you earned every bit of this." },
};

const BADGE_META = {
  first_win:   { icon: '🏆', label: 'First Win',        desc: "You started. That's everything.",       rare: false },
  wins_5:      { icon: '🌟', label: '5 Wins',            desc: 'Momentum is building.',                 rare: false },
  wins_10:     { icon: '💎', label: '10 Wins',           desc: "You're becoming consistent.",           rare: false },
  wins_25:     { icon: '🔱', label: '25 Wins',           desc: 'Elite level of self-tracking.',         rare: true  },
  streak_3:    { icon: '🔥', label: '3-Day Streak',      desc: '3 days straight. Habits are forming.',  rare: false },
  streak_7:    { icon: '⚡', label: '7-Day Streak',      desc: 'A full week. You mean it.',             rare: false },
  streak_10:   { icon: '💫', label: '10-Day Streak',     desc: "This is who you're becoming.",          rare: true  },
  streak_30:   { icon: '👑', label: '30-Day Streak',     desc: 'One month of showing up. Legendary.',   rare: true  },
  streak_100:  { icon: '🌙', label: '100-Day Streak',    desc: 'You are the 1%. Extraordinary.',        rare: true  },
  honest:      { icon: '🪞', label: 'Honest Logger',     desc: 'Logging failure takes courage.',        rare: false },
  honest_10:   { icon: '🧠', label: 'Deep Honest',       desc: '10 failures logged. Rare self-awareness.', rare: true },
  habits_3:    { icon: '📌', label: '3 Habits',          desc: 'Discipline across 3 fronts.',           rare: false },
  comeback:    { icon: '♻️', label: 'Comeback Kid',      desc: 'You broke a streak and restarted.',     rare: false },
};

const MOOD_LABELS = ['', '😐 Rough', '🙂 Ok', '😊 Good', '😄 Great', '🤩 Amazing'];

/* ── Badge popup component ── */
function BadgePopup({ badges, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 50);
    const t = setTimeout(onClose, 5000);
    return () => clearTimeout(t);
  }, []);

  if (!badges.length) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(10,9,8,.85)',
      backdropFilter: 'blur(12px)',
      opacity: visible ? 1 : 0,
      transition: 'opacity .4s ease',
    }} onClick={onClose}>
      <div style={{
        background: 'linear-gradient(145deg, #1a1612, #141210)',
        border: '1px solid #3a2818',
        borderRadius: '24px',
        padding: '48px 40px',
        textAlign: 'center',
        maxWidth: '400px',
        width: '90%',
        transform: visible ? 'scale(1) translateY(0)' : 'scale(.9) translateY(20px)',
        transition: 'transform .5s cubic-bezier(.2,.8,.3,1)',
        boxShadow: '0 40px 100px rgba(0,0,0,.5), 0 0 60px rgba(196,114,58,.1)',
      }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          width: '300px', height: '300px',
          background: 'radial-gradient(circle, rgba(196,114,58,.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        {badges.map((badgeKey) => {
          const meta = BADGE_META[badgeKey];
          if (!meta) return null;
          return (
            <div key={badgeKey} style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>{meta.icon}</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#f0ebe0', marginBottom: '6px' }}>{meta.label}</div>
              <div style={{ fontSize: '13px', color: '#8a7a68' }}>{meta.desc}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Streak Banner ── */
function StreakBanner({ wins }) {
  if (!wins.length) return null;
  return (
    <div style={{
      background: 'salt',
      border: '1px solid #2e2818',
      borderRadius: '14px',
      padding: '12px 16px',
      fontSize: '12px',
      color: 'black',
    }}>
      Keep logging to build your streak
    </div>
  );
}

/* ── Main Wins component ── */
export default function Wins() {
  const { wins, stats, fetchWins, fetchStats, addWin, removeWin } = useWinStore();
  const [form, setForm]             = useState({ title: '', description: '', size: 'small', mood: 4 });
  const [showing, setShowing]       = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newBadges, setNewBadges]   = useState([]);
  const [charCount, setCharCount]   = useState(0);
  const [encourage, setEncourage]   = useState(0);
  const inputRef = useRef();

  useEffect(() => {
    fetchWins();
    fetchStats();
    const interval = setInterval(() => setEncourage(e => (e + 1) % ENCOURAGEMENTS.length), 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (showing && inputRef.current) inputRef.current.focus();
  }, [showing]);

  const handleSubmit = async () => {
    if (!form.title.trim()) { toast.error('What did you achieve?'); return; }
    setSubmitting(true);
    try {
      const result = await addWin(form);
      const earned = result?.newBadges || [];
      if (earned.length) setNewBadges(earned);
      setForm({ title: '', description: '', size: 'small', mood: 4 });
      setCharCount(0);
      setShowing(false);
      fetchStats();
      toast.success(form.size === 'big' ? '🏆 Big win locked in!' : '✓ Win logged', { duration: 3000 });
    } catch (err) {
      toast.error('Failed to log win');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try { await removeWin(id); fetchStats(); }
    catch { toast.error('Failed'); }
  };

  const sc = SIZE_PSYCHOLOGY[form.size];

  return (
    <>
      {newBadges.length > 0 && (
        <BadgePopup badges={newBadges} onClose={() => setNewBadges([])} />
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontFamily: "'Sora', sans-serif" }}>

        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'black', margin: 0 }}>Wins</h1>
            <p style={{ fontSize: '12px', color: '#5a5248', marginTop: '4px' }}>Your proof wall — when doubt hits, you have receipts</p>
          </div>
          <button
            onClick={() => setShowing(s => !s)}
            style={{
              borderRadius: '12px', padding: '8px 20px',
              fontSize: '12px', fontWeight: 600,
              background: showing ? '#1a1814' : '#5a8a6a',
              border: showing ? '1px solid #2e2a22' : '1px solid #2a4434',
              color: showing ? '#8a8070' : '#fff',
              cursor: 'pointer', transition: 'all .2s',
              fontFamily: "'Sora', sans-serif",
            }}
          >
            {showing ? 'Cancel' : '+ Log win'}
          </button>
        </div>

        {/* STREAK BANNER */}
        <StreakBanner wins={wins || []} />

        {/* STATS */}
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '12px' }}>
            {[
              { label: 'Total wins',  value: stats.total,           color: '#f0ebe0' },
              { label: 'This week',   value: stats.thisWeek,        color: '#f0ebe0' },
              { label: 'Big wins',    value: stats.bySize?.big || 0, color: '#c4723a' },
              { label: 'Next badge',  value: stats.total < 5 ? `${5 - stats.total} away` : stats.total < 10 ? `${10 - stats.total} away` : '✓', color: '#8a7ab8' },
            ].map(s => (
              <div key={s.label} style={{
                background: 'salt', border: '1px solid #2a2620',
                borderRadius: '14px', padding: '16px 8px', textAlign: 'center',
              }}>
                <div style={{ fontSize: '20px', fontWeight: 700, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '9px', color: '#5a5248', textTransform: 'uppercase', letterSpacing: '.08em', marginTop: '6px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* ENCOURAGEMENT */}
        <div style={{ borderTop: '1px solid #1e1c19', borderBottom: '1px solid #1e1c19', padding: '12px 0', textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: '#4a4438', fontStyle: 'italic', letterSpacing: '.02em' }}>
            "{ENCOURAGEMENTS[encourage]}"
          </div>
        </div>

        {/* LOG FORM */}
        {showing && (
          <div style={{
            background: 'salt', border: '1px solid #2a2620',
            borderRadius: '18px', padding: '20px',
            display: 'flex', flexDirection: 'column', gap: '16px',
          }}>
            <div style={{ fontSize: '10px', color: '#5a5248', textTransform: 'uppercase', letterSpacing: '.06em' }}>
              Log a win — any size counts
            </div>

            {/* Title */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontSize: '11px', color: 'black', textTransform: 'uppercase', letterSpacing: '.06em' }}>What did you achieve? *</label>
                <span style={{ fontSize: '10px', color: charCount > 100 ? '#b85a5a' : '#3a3630' }}>{charCount}/120</span>
              </div>
              <input
                ref={inputRef}
                value={form.title}
                onChange={e => { setForm(f => ({ ...f, title: e.target.value })); setCharCount(e.target.value.length); }}
                placeholder="Be specific — 'Finished the auth module' not 'did coding'"
                maxLength={120}
                style={{
                  width: '100%', background: 'salt', border: '1px solid #2a2620',
                  borderRadius: '10px', padding: '10px 14px',
                  fontSize: '13px', color:'black', outline: 'none',
                  fontFamily: "'Sora', sans-serif", boxSizing: 'border-box',
                }}
              />
              {form.title.length > 10 && (
                <div style={{ fontSize: '11px', color: 'black', marginTop: '4px' }}>✓ Good — specific wins are easier to build on</div>
              )}
            </div>

            {/* Description */}
            <div>
              <label style={{ fontSize: '11px', color: '#5a5248', textTransform: 'uppercase', letterSpacing: '.06em', display: 'block', marginBottom: '8px' }}>Context (optional)</label>
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="What made this happen? What does it mean for you?"
                rows={2}
                maxLength={400}
                style={{
                  width: '100%', background: 'salt', border: '1px solid #2a2620',
                  borderRadius: '10px', padding: '10px 14px',
                  fontSize: '13px', color: 'black', outline: 'none',
                  resize: 'none', fontFamily: "'Sora', sans-serif", boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Size selector */}
            <div>
              <label style={{ fontSize: '11px', color: '#5a5248', textTransform: 'uppercase', letterSpacing: '.06em', display: 'block', marginBottom: '8px' }}>Win size</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {Object.entries(SIZE_PSYCHOLOGY).map(([key, cfg]) => (
                  <button key={key}
                    onClick={() => setForm(f => ({ ...f, size: key }))}
                    style={{
                      padding: '12px 8px', borderRadius: '12px', cursor: 'pointer',
                      border: `1px solid ${form.size === key ? cfg.br : 'black'}`,
                      background: form.size === key ? 'salt' : 'salt',
                      textAlign: 'left', fontFamily: "'Sora', sans-serif",
                      transition: 'all .2s',
                    }}
                  >
                    <div style={{ fontSize: '16px', marginBottom: '4px' }}>{cfg.icon}</div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: form.size === key ? cfg.color : '#5a5248' }}>{cfg.label}</div>
                  </button>
                ))}
              </div>
              <div style={{ fontSize: '11px', color: SIZE_PSYCHOLOGY[form.size].color, marginTop: '8px', opacity: 0.7, fontStyle: 'italic' }}>
                {SIZE_PSYCHOLOGY[form.size].msg}
              </div>
            </div>

            {/* Mood */}
            <div>
              <label style={{ fontSize: '11px', color: '#5a5248', textTransform: 'uppercase', letterSpacing: '.06em', display: 'block', marginBottom: '8px' }}>
                How do you feel? · <span style={{ color: '#c4723a', textTransform: 'none', letterSpacing: 0 }}>{MOOD_LABELS[form.mood]}</span>
              </label>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[1,2,3,4,5].map(n => (
                  <button key={n}
                    onClick={() => setForm(f => ({ ...f, mood: n }))}
                    style={{
                      fontSize: '14px', background: 'none', border: 'none',
                      cursor: 'pointer', padding: '4px',
                      color: n <= form.mood ? '#c4723a' : '#2a2620',
                      transform: n === form.mood ? 'scale(1.2)' : 'scale(1)',
                      transition: 'all .15s',
                    }}
                  >★</button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={submitting || !form.title.trim()}
              style={{
                background: submitting || !form.title.trim()
                  ? 'salt'
                  : 'linear-gradient(135deg, #5a8a6a, #4a7a5a)',
                border: '1px solid #2a4434',
                color: submitting || !form.title.trim() ? '#3a3630' : '#fff',
                borderRadius: '12px', padding: '13px',
                fontSize: '13px', fontWeight: 600,
                cursor: submitting || !form.title.trim() ? 'not-allowed' : 'pointer',
                fontFamily: "'Sora', sans-serif",
                transition: 'all .2s',
              }}
            >
              {submitting ? 'Logging...' : form.size === 'big' ? '🏆 Lock in this big win' : '✓ Log this win'}
            </button>
          </div>
        )}

        {/* WINS FEED */}
        {(!wins || wins.length === 0) ? (
          <div style={{
            background: 'salt', border: '1px solid #2a2620',
            borderRadius: '18px', padding: '48px 24px', textAlign: 'center',
          }}>
            <div style={{ fontSize: '40px', marginBottom: '14px' }}>🏆</div>
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#f0ebe0', marginBottom: '8px' }}>No wins yet</div>
            <div style={{ fontSize: '13px', color: '#4a4438', lineHeight: 1.6, maxWidth: '280px', margin: '0 auto' }}>
              Your first log is the hardest. After that, it gets addictive.
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {(wins || []).map((w) => {
              const cfg = SIZE_PSYCHOLOGY[w.size] || SIZE_PSYCHOLOGY.small;
              return (
                <div key={w._id} style={{
                  background: 'salt', border: '1px solid #2a2620',
                  borderRadius: '16px', padding: '16px',
                  display: 'flex', gap: '14px', transition: 'border-color .2s, transform .2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = cfg.br; e.currentTarget.style.transform = 'translateX(3px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a2620'; e.currentTarget.style.transform = 'translateX(0)'; }}
                >
                  <div style={{ width: '3px', borderRadius: '2px', background: cfg.color, flexShrink: 0, alignSelf: 'stretch', boxShadow: `0 0 8px ${cfg.color}66` }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'black', lineHeight: 1.4 }}>{w.title}</div>
                        {w.description && <div style={{ fontSize: '12px', color: '#5a5248', marginTop: '4px', lineHeight: 1.5 }}>{w.description}</div>}
                      </div>
                      <button onClick={() => handleDelete(w._id)} style={{
                        color: '#3a3630', background: 'none', border: 'none',
                        cursor: 'pointer', fontSize: '14px', flexShrink: 0, padding: '2px 6px',
                        borderRadius: '4px', transition: 'color .15s',
                      }}
                      onMouseEnter={e => e.target.style.color = '#b85a5a'}
                      onMouseLeave={e => e.target.style.color = '#3a3630'}
                      >×</button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
                      <span style={{
                        fontSize: '10px', fontWeight: 600, padding: '2px 9px',
                        borderRadius: '20px', letterSpacing: '.04em',
                        background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.br}`,
                      }}>{cfg.icon} {cfg.label}</span>
                      <span style={{ fontSize: '12px', color: '#c4723a' }}>{'★'.repeat(w.mood)}<span style={{ color: '#2a2620' }}>{'★'.repeat(5 - w.mood)}</span></span>
                      <span style={{ fontSize: '10px', color: '#3a3630', letterSpacing: '.02em' }}>{dayjs(w.createdAt).fromNow()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}