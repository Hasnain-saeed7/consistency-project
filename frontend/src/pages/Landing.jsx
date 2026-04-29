



import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const inject = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html { scroll-behavior: smooth; }

body, #root {
  background: #f2ede6 !important;
  color: #1a1612;
  font-family: 'DM Sans', sans-serif;
  overflow-x: hidden;
}

.land-page {
  background: #f2ede6;
  min-height: 100vh;
  position: relative;
}

/* grain texture overlay */
.land-page::after {
  content: '';
  position: fixed; inset: 0; z-index: 0;
  pointer-events: none;
  opacity: .035;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
  background-size: 200px 200px;
}

/* scrollbar */
::-webkit-scrollbar { width: 3px; }
::-webkit-scrollbar-track { background: #f2ede6; }
::-webkit-scrollbar-thumb { background: #c8bfb0; border-radius: 2px; }

/* reveal animation */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes drift {
  0%,100% { transform: translateY(0px) rotate(0deg); }
  33%      { transform: translateY(-8px) rotate(.5deg); }
  66%      { transform: translateY(4px) rotate(-.3deg); }
}
@keyframes scanline {
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(400%); }
}
@keyframes blink {
  0%,100% { opacity: 1; }
  50%      { opacity: 0; }
}
@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
@keyframes pulse-ring {
  0%   { transform: scale(1);   opacity: .6; }
  100% { transform: scale(1.8); opacity: 0; }
}

.reveal { opacity: 0; }
.reveal.visible {
  animation: fadeUp .7s cubic-bezier(.2,.8,.3,1) forwards;
}

.land-nav-link {
  color: #8a7e72;
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: .04em;
  transition: color .2s;
}
.land-nav-link:hover { color: #1a1612; }

.hero-word {
  display: inline-block;
  animation: fadeUp .8s cubic-bezier(.2,.8,.3,1) both;
}

.feature-card {
  background: #ece7df;
  border: 1px solid #ddd7ce;
  border-radius: 16px;
  padding: 28px 24px;
  transition: transform .25s cubic-bezier(.2,.8,.3,1), box-shadow .25s, border-color .25s;
  cursor: default;
}
.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 50px rgba(26,22,18,.08);
  border-color: #c8bfb0;
}

.step-num {
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  color: #c8bfb0;
  letter-spacing: .1em;
}

.cta-btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #1a1612;
  color: #f2ede6;
  border: none;
  border-radius: 10px;
  padding: 14px 28px;
  font-size: 14px;
  font-weight: 500;
  font-family: 'DM Sans', sans-serif;
  letter-spacing: .02em;
  cursor: pointer;
  text-decoration: none;
  transition: background .2s, transform .2s, box-shadow .2s;
}
.cta-btn-primary:hover {
  background: #2e2820;
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(26,22,18,.25);
}

.cta-btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  color: #1a1612;
  border: 1.5px solid #c8bfb0;
  border-radius: 10px;
  padding: 13px 28px;
  font-size: 14px;
  font-weight: 500;
  font-family: 'DM Sans', sans-serif;
  letter-spacing: .02em;
  cursor: pointer;
  text-decoration: none;
  transition: border-color .2s, background .2s, transform .2s;
}
.cta-btn-secondary:hover {
  border-color: #1a1612;
  background: rgba(26,22,18,.04);
  transform: translateY(-2px);
}

.pill-tag {
  display: inline-block;
  background: #e4ddd4;
  border: 1px solid #d4ccc2;
  border-radius: 30px;
  padding: 5px 14px;
  font-size: 11px;
  font-weight: 500;
  color: #7a6e62;
  letter-spacing: .06em;
  text-transform: uppercase;
}

.testimonial-card {
  background: #ece7df;
  border: 1px solid #ddd7ce;
  border-radius: 16px;
  padding: 24px;
  transition: transform .2s;
}
.testimonial-card:hover { transform: translateY(-3px); }

.stat-big {
  font-family: 'Playfair Display', serif;
  font-size: clamp(48px, 8vw, 80px);
  font-weight: 900;
  color: #1a1612;
  letter-spacing: -0.04em;
  line-height: 1;
}

.marquee-track {
  display: flex;
  gap: 40px;
  animation: marquee 20s linear infinite;
  white-space: nowrap;
}
.marquee-item {
  font-family: 'Playfair Display', serif;
  font-size: 13px;
  font-style: italic;
  color: #c8bfb0;
  letter-spacing: .06em;
  flex-shrink: 0;
}
`;

const FEATURES = [
  {
    icon: <FiTarget />, // Daily focus
    color: '#c4723a',
    title: 'Daily focus',
    desc: 'Set up to 3 intentions every morning. The limit is intentional — it forces you to choose what actually matters.',
    tag: 'Priority 1',
  },
  {
    icon: <FiTrendingUp />, // Streak engine
    color: '#5a8a6a',
    title: 'Streak engine',
    desc: 'Build consistency through visible chains. Each evening review updates your streak and heatmap in real time.',
    tag: 'Consistency',
  },
  {
    icon: <FiBookOpen />, // Failure log
    color: '#8a7ab8',
    title: 'Failure log',
    desc: "Log what went wrong, why, and the one lesson you'll carry forward. Failures become fuel, not shame.",
    tag: 'Growth',
  },
  {
    icon: <FiAward />, // Win journal
    color: '#e6b800',
    title: 'Win journal',
    desc: 'Capture every victory — small, medium, or big. Your proof wall for when self-doubt hits hardest.',
    tag: 'Momentum',
  },
  {
    icon: <FiCheckSquare />, // Habit tracker
    color: '#4a90e2',
    title: 'Habit tracker',
    desc: "Track daily disciplines with per-habit streaks and a 21-day heatmap. Don't break the chain.",
    tag: 'Discipline',
  },
  {
    icon: <FiBell />, // Lesson reminders
    color: '#e26a6a',
    title: 'Lesson reminders',
    desc: 'Every lesson you log gets saved. Tomorrow morning one surfaces on your dashboard — closing the loop.',
    tag: 'Memory',
  },
];
import { FiTarget, FiTrendingUp, FiBookOpen, FiAward, FiCheckSquare, FiBell } from 'react-icons/fi';

   


   


const STEPS = [
  { n: '01', title: 'Set your 3 goals', desc: 'Every morning, 3 intentions max. What must get done today?' },
  { n: '02', title: 'Log wins & failures', desc: 'Capture what happened honestly. Extract a lesson from every setback.' },
  { n: '03', title: 'Review your day', desc: 'Rate it 1–10. What was the highlight? What will you do differently?' },
  { n: '04', title: 'Watch yourself rise', desc: 'Streaks build. Lessons compound. Your journal becomes your proof.' },
];

const TESTIMONIALS = [
  { quote: "I've tried 10 productivity apps. RiseLog is the first one that actually made me reflect.", name: 'Eesa Arif', role: 'Freelance designer' },
  { quote: "The failure log changed how I think about setbacks. Now I see them as data.", name: 'Hasnain Saeed', role: 'Software developer' },
  { quote: "14-day streak and counting. The morning intention feature keeps me from overloading my day.", name: 'Mahrukh Shahzaib', role: 'Student' },
];

const MARQUEE_ITEMS = [ 

  'Daily focus', 'Streak engine', 'Failure log', 'Win journal',
  'Habit tracker', 'Lesson reminders', 'Evening review', 'Badge system',
  'Daily focus', 'Streak engine', 'Failure log', 'Win journal',
  'Habit tracker', 'Lesson reminders', 'Evening review', 'Badge system',
];

export default function Landing() {
  const [scrolled, setScrolled] = useState(false);
  const revealRefs = useRef([]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Intersection observer for reveal animations
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      }),
      { threshold: 0.1 }
    );
    revealRefs.current.forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const ref = (i) => (el) => { revealRefs.current[i] = el; };

  return (
    <>
      <style>{inject}</style>

      <div className="land-page">

        {/* ── NAV ── */}
        <nav style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          padding: '0 40px',
          height: '56px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: scrolled ? 'rgba(242,237,230,.9)' : 'transparent',
          borderBottom: scrolled ? '1px solid #ddd7ce' : '1px solid transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          transition: 'all .3s',
        }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', fontWeight: 700, color: '#1a1612', letterSpacing: '-.01em' }}>
            Aag<span style={{ fontStyle: 'italic', color: '#8a6a50' }}>haaz</span>
          </div>

          <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
            <a href="#features" className="land-nav-link">Features</a>
            <a href="#how"      className="land-nav-link">How it works</a>
            <a href="#why"      className="land-nav-link">Why RiseLog</a>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <Link to="/login"    className="land-nav-link">Sign in</Link>
            <Link to="/register" className="cta-btn-primary" style={{ padding: '8px 18px', fontSize: '12px', borderRadius: '8px' }}>
              Start free →
            </Link>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section style={{
          minHeight: '100vh',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          textAlign: 'center',
          padding: '120px 24px 60px',
          position: 'relative', zIndex: 1,
        }}>

          {/* Background decorative rings */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '600px', height: '600px',
            border: '1px solid rgba(200,191,176,.2)',
            borderRadius: '50%', pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '900px', height: '900px',
            border: '1px solid rgba(200,191,176,.1)',
            borderRadius: '50%', pointerEvents: 'none',
          }} />

          {/* Badge */}
          <div style={{ animation: 'fadeIn .6s ease both', marginBottom: '28px' }}>
            <span className="pill-tag">Built for people who are struggling</span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(44px, 8vw, 92px)',
            fontWeight: 900,
            color: '#1a1612',
            letterSpacing: '-0.03em',
            lineHeight: 1.0,
            maxWidth: '820px',
            marginBottom: '28px',
          }}>
            <span className="hero-word" style={{ animationDelay: '.1s' }}>Your</span>{' '}
            <span className="hero-word" style={{ animationDelay: '.2s', fontStyle: 'italic', color: '#8a6a50' }}>comeback</span>
            <br />
            <span className="hero-word" style={{ animationDelay: '.3s' }}>starts</span>{' '}
            <span className="hero-word" style={{ animationDelay: '.4s' }}>here.</span>
          </h1>

          {/* Subheadline */}
          <p style={{
            fontSize: 'clamp(16px, 2vw, 19px)',
            color: '#7a6e62',
            lineHeight: 1.7,
            maxWidth: '560px',
            marginBottom: '44px',
            animation: 'fadeUp .7s ease .5s both',
          }}>
            Track your focus, build consistency, log your failures honestly,
            and celebrate every win. The self-improvement dashboard that meets you where you are.
          </p>

          {/* CTAs */}
          <div style={{
            display: 'flex', gap: '12px', flexWrap: 'wrap',
            justifyContent: 'center',
            animation: 'fadeUp .7s ease .65s both',
            marginBottom: '60px',
          }}>
            <Link to="/register" className="cta-btn-primary">
              Start your journey →
            </Link>
            <Link to="/login" className="cta-btn-secondary">
              Sign in
            </Link>
          </div>

          {/* Floating preview cards */}
          <div style={{
            display: 'flex', gap: '12px', justifyContent: 'center',
            flexWrap: 'wrap',
            animation: 'fadeUp .8s ease .8s both',
          }}>
            {[
              { icon: <FiTrendingUp />, val: '14',  label: 'day streak',   col: '#c4723a' },
              { icon: <FiAward />,      val: '23',  label: 'wins logged',  col: '#5a8a6a' },
              { icon: <FiBookOpen />,   val: '7',   label: 'lessons saved',col: '#8a7ab8' },
              { icon: <FiTarget />,     val: '3/3', label: 'goals done',   col: '#c4723a' },
            ].map((c, i) => (
              <div key={i} style={{
                background: '#ece7df',
                border: '1px solid #ddd7ce',
                borderRadius: '14px',
                padding: '14px 20px',
                textAlign: 'center',
                minWidth: '100px',
                animation: `drift ${3 + i * .4}s ease-in-out ${i * .3}s infinite`,
                boxShadow: '0 4px 20px rgba(26,22,18,.06)',
              }}>
                <div style={{ fontSize: '24px', marginBottom: '4px', color: c.col, display: 'flex', justifyContent: 'center' }}>{c.icon}</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', fontWeight: 700, color: c.col, letterSpacing: '-.02em', lineHeight: 1 }}>{c.val}</div>
                <div style={{ fontSize: '10px', color: '#a09080', marginTop: '3px', letterSpacing: '.04em', textTransform: 'uppercase' }}>{c.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── MARQUEE ── */}
        <div style={{
          borderTop: '1px solid #ddd7ce',
          borderBottom: '1px solid #ddd7ce',
          padding: '14px 0',
          overflow: 'hidden',
          background:  'salt',
          position: 'relative', zIndex: 1,
        }}>
          <div style={{ display: 'flex', overflow: 'hidden' }}>
            <div className="marquee-track">
              {(() => {
                const colors = [
                  '#c4723a', // orange
                  '#5a8a6a', // green
                  '#8a7ab8', // purple
                  '#e6b800', // gold
                  '#4a90e2', // blue
                  '#e26a6a', // red
                  '#8a6a50', // brown
                  '#7a6e62', // taupe
                ];
                return MARQUEE_ITEMS.map((item, i) => (
                  <span
                    key={i}
                    className="marquee-item"
                    style={{ color: colors[i % colors.length] }}
                  >
                    {item} <span style={{ margin: '0 20px', color:'black' }}>·</span>
                  </span>
                ));
              })()}
            </div>
          </div>
        </div>

        {/* ── STATS ── */}
        <section style={{ padding: '100px 40px', position: 'relative', zIndex: 1 }} id="why">
          <div style={{ maxWidth: '960px', margin: '0 auto' }}>
            <div
              className="reveal"
              ref={ref(0)}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '2px',
                background: '#ddd7ce',
                border: '1px solid #ddd7ce',
                borderRadius: '20px',
                overflow: 'hidden',
              }}
            >
              {[
                { val: '10k+',  label: 'People rising',    sub: 'and counting' },
                { val: '340k+', label: 'Wins logged',      sub: 'small to massive' },
                { val: '89%',   label: 'Feel more focused', sub: 'after 7 days' },
              ].map((st, i) => (
                <div key={i} style={{
                  background: '#f2ede6',
                  padding: '48px 40px',
                  textAlign: 'center',
                }}>
                  <div className="stat-big">{st.val}</div>
                  <div style={{ fontSize: '14px', fontWeight: 500, color: '#3a3028', marginTop: '8px' }}>{st.label}</div>
                  <div style={{ fontSize: '12px', color: '#a09080', marginTop: '4px' }}>{st.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section id="features" style={{ padding: '60px 40px 100px', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '960px', margin: '0 auto' }}>

            {/* Section header */}
            <div className="reveal" ref={ref(1)} style={{ marginBottom: '60px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '20px', marginBottom: '16px' }}>
                <span className="step-num">02</span>
                <div style={{ height: '1px', flex: 1, background: '#ddd7ce' }} />
              </div>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(32px, 5vw, 52px)',
                fontWeight: 900,
                color: '#1a1612',
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                maxWidth: '600px',
              }}>
                Everything you need to{' '}
                <span style={{ fontStyle: 'italic', color: '#8a6a50' }}>stop drifting</span>
              </h2>
              <p style={{ fontSize: '16px', color: '#7a6e62', marginTop: '16px', lineHeight: 1.7, maxWidth: '480px' }}>
                Six pillars that work together — not six separate tools.
              </p>
            </div>

            {/* Feature grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px',
            }}>
              {FEATURES.map((f, i) => (
                <div
                  key={i}
                  className="feature-card reveal"
                  ref={ref(i + 2)}
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <span style={{ fontSize: '28px', color: f.color }}>{f.icon}</span>
                    <span className="pill-tag" style={{ fontSize: '9px', padding: '3px 10px' }}>{f.tag}</span>
                  </div>
                  <div style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '19px',
                    fontWeight: 700,
                    color: '#1a1612',
                    letterSpacing: '-0.01em',
                    marginBottom: '10px',
                  }}>{f.title}</div>
                  <div style={{ fontSize: '13px', color: '#7a6e62', lineHeight: 1.65 }}>{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section id="how" style={{
          padding: '80px 40px',
          background: '#ece7df',
          borderTop: '1px solid #ddd7ce',
          borderBottom: '1px solid #ddd7ce',
          position: 'relative', zIndex: 1,
        }}>
          <div style={{ maxWidth: '960px', margin: '0 auto' }}>
            <div className="reveal" ref={ref(8)} style={{ marginBottom: '60px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '20px', marginBottom: '16px' }}>
                <span className="step-num">03</span>
                <div style={{ height: '1px', flex: 1, background: '#d4ccc2' }} />
              </div>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(32px, 5vw, 52px)',
                fontWeight: 900,
                color: '#1a1612',
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
              }}>
                Four steps.{' '}
                <span style={{ fontStyle: 'italic', color: '#8a6a50' }}>One daily loop.</span>
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2px' }}>
              {STEPS.map((st, i) => (
                <div
                  key={i}
                  className="reveal"
                  ref={ref(i + 9)}
                  style={{
                    padding: '36px 28px',
                    background: i % 2 === 0 ? '#f2ede6' : '#e8e2d9',
                    borderRadius: i === 0 ? '16px 0 0 16px' : i === 3 ? '0 16px 16px 0' : '0',
                    animationDelay: `${i * 0.1}s`,
                    position: 'relative',
                  }}
                >
                  <div style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: '11px',
                    color: '#c8bfb0',
                    letterSpacing: '.1em',
                    marginBottom: '20px',
                  }}>{st.n}</div>
                  <div style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '18px',
                    fontWeight: 700,
                    color: '#1a1612',
                    letterSpacing: '-0.01em',
                    marginBottom: '10px',
                  }}>{st.title}</div>
                  <div style={{ fontSize: '13px', color: '#7a6e62', lineHeight: 1.65 }}>{st.desc}</div>

                  {/* Arrow connector */}
                  {i < 3 && (
                    <div style={{
                      position: 'absolute', right: '-10px', top: '50%',
                      transform: 'translateY(-50%)',
                      width: '20px', height: '20px',
                      background: '#d4ccc2',
                      borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '10px', zIndex: 2,
                    }}>→</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section style={{ padding: '100px 40px', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '960px', margin: '0 auto' }}>
            <div className="reveal" ref={ref(13)} style={{ marginBottom: '60px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '20px', marginBottom: '16px' }}>
                <span className="step-num">04</span>
                <div style={{ height: '1px', flex: 1, background: '#ddd7ce' }} />
              </div>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(32px, 5vw, 52px)',
                fontWeight: 900,
                color: '#1a1612',
                letterSpacing: '-0.03em',
              }}>
                Real people.{' '}
                <span style={{ fontStyle: 'italic', color: '#8a6a50' }}>Real comebacks.</span>
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px' }}>
              {TESTIMONIALS.map((t, i) => (
                <div
                  key={i}
                  className="testimonial-card reveal"
                  ref={ref(i + 14)}
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div style={{
                    fontSize: '28px',
                    color: '#c8bfb0',
                    fontFamily: "'Playfair Display', serif",
                    lineHeight: 1,
                    marginBottom: '16px',
                  }}>"</div>
                  <p style={{ fontSize: '14px', color: '#3a3028', lineHeight: 1.7, fontStyle: 'italic', marginBottom: '20px' }}>
                    {t.quote}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '50%',
                      background: '#ddd7ce',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '13px', fontWeight: 700, color: '#8a7a6a',
                    }}>{t.name[0]}</div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#1a1612' }}>{t.name}</div>
                      <div style={{ fontSize: '11px', color: '#a09080' }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section style={{
          padding: '100px 40px 120px',
          background: '#1a1612',
          position: 'relative', zIndex: 1,
          overflow: 'hidden',
        }}>
          {/* bg glow */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            width: '600px', height: '400px',
            background: 'radial-gradient(ellipse, rgba(196,114,58,.15) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>

            <div className="reveal" ref={ref(17)} style={{ marginBottom: '20px' }}>
              <span className="pill-tag" style={{ background: '#2a2218', borderColor: '#3a3028', color: '#8a7060' }}>
                Free forever for personal use
              </span>
            </div>

            <h2 className="reveal" ref={ref(18)} style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(40px, 7vw, 76px)',
              fontWeight: 900,
              color: '#f2ede6',
              letterSpacing: '-0.03em',
              lineHeight: 1.0,
              marginBottom: '24px',
            }}>
              Stop drifting.<br />
              <span style={{ fontStyle: 'italic', color: '#c4723a' }}>Start rising.</span>
            </h2>

            <p className="reveal" ref={ref(19)} style={{
              fontSize: '16px',
              color: '#7a6e62',
              lineHeight: 1.7,
              marginBottom: '44px',
            }}>
              Every expert was once where you are now.
              The only difference is they started.
            </p>

            <div className="reveal" ref={ref(20)} style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <Link to="/register" style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: '#c4723a',
                color: '#f2ede6',
                border: 'none',
                borderRadius: '12px',
                padding: '16px 36px',
                fontSize: '15px',
                fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif",
                letterSpacing: '.01em',
                textDecoration: 'none',
                transition: 'background .2s, transform .2s, box-shadow .2s',
                boxShadow: '0 0 40px rgba(196,114,58,.3)',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#d4824a'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#c4723a'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                Create your account — it's free →
              </Link>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{
          background: '#0f0e0c',
          padding: '32px 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative', zIndex: 1,
          flexWrap: 'wrap', gap: '12px',
        }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '16px', fontWeight: 700, color: '#c4723a', letterSpacing: '-.01em' }}>
            Aag<span style={{ fontStyle: 'italic', color: '#6a4a30' }}>haaz</span>
          </div>
          <div style={{ fontSize: '13px', color: '#c4723a', letterSpacing: '.04em' }}>
            Built for people who are struggling — {new Date().getFullYear()}
          </div>
          <div style={{ display: 'flex', gap: '24px' }}>
            <Link to="/login"    style={{ fontSize: '13px', color: '#c4723a', textDecoration: 'none', letterSpacing: '.04em' }}>Sign in</Link>
            <Link to="/register" style={{ fontSize: '13px', color: '#c4723a', textDecoration: 'none', letterSpacing: '.04em' }}>Register</Link>
          </div>
        </footer>

      </div>
    </>
  );
}