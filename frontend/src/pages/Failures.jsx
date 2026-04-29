import { useEffect, useState } from 'react';
import { useFailureStore } from '../store/failureStore';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const CATEGORIES = [
  { value: 'discipline', label: 'Discipline' },
  { value: 'focus',      label: 'Focus' },
  { value: 'health',     label: 'Health' },
  { value: 'work',       label: 'Work' },
  { value: 'social',     label: 'Social' },
  { value: 'other',      label: 'Other' },
];

export default function Failures() {
  const { failures, fetchFailures, addFailure, removeFailure } = useFailureStore();
  const [showing, setShowing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: '', cause: '', lesson: '', category: 'discipline'
  });

  useEffect(() => { fetchFailures(); }, []);

  const handleSubmit = async () => {
    if (!form.title.trim()) { toast.error('What went wrong?'); return; }
    if (!form.lesson.trim()) { toast.error('Extract at least 1 lesson'); return; }
    setSubmitting(true);
    try {
      await addFailure(form);
      setForm({ title: '', cause: '', lesson: '', category: 'discipline' });
      setShowing(false);
      toast.success('Failure logged — lesson saved to reminder pool');
    } catch { toast.error('Failed to log'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {

    try { await removeFailure(id); toast.success('Removed'); }
    catch { toast.error('Failed'); }
  };

  const catColor = {
    discipline: { color: '#d4724a', bg: '#FFF0E5', br: '#FFD1B3' },
    focus:      { color: '#7a9ab8', bg: '#EAF0F5', br: '#C5D7E8' },
    health:     { color: '#5a8a6a', bg: '#E6F3EB', br: '#B3D9C2' },
    work:       { color: '#8a7ab8', bg: '#F0EEF7', br: '#D1C9E6' },
    social:     { color: '#c4a882', bg: '#F5EFE6', br: '#E3D7C5' },
    other:      { color: '#8a8070', bg: '#F0F0F0', br: '#D1D1D1' },
  };

  return (
    <div className="flex flex-col gap-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-t1 tracking-tight">Failures</h1>
          <p className="text-xs text-t3 mt-0.5">Failure is data — not shame</p>
        </div>
        <button onClick={() => setShowing(s => !s)}
          className="bg-fail hover:bg-fail-light text-white text-xs font-medium
                     px-4 py-2 rounded-lg transition-colors">
          {showing ? 'Cancel' : '+ Log failure'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-surface border border-border1 rounded-xl p-3 text-center">
          <div className="text-xl font-semibold text-fail">{failures.length}</div>
          <div className="text-[10px] text-t3 uppercase tracking-wider mt-1">Logged</div>
        </div>
        <div className="bg-surface border border-border1 rounded-xl p-3 text-center">
          <div className="text-xl font-semibold text-orange">
            {failures.filter(f => f.lesson).length}
          </div>
          <div className="text-[10px] text-t3 uppercase tracking-wider mt-1">Lessons saved</div>
        </div>
        <div className="bg-surface border border-border1 rounded-xl p-3 text-center">
          <div className="text-xl font-semibold text-t1">
            {failures.filter(f =>
              dayjs(f.createdAt).isAfter(dayjs().subtract(7, 'day'))
            ).length}
          </div>
          <div className="text-[10px] text-t3 uppercase tracking-wider mt-1">This week</div>
        </div>
      </div>

      {/* Info banner */}
      

      {/* Form */}
      {showing && (
        <div className="bg-surface border border-border1 rounded-2xl p-5 flex flex-col gap-4">
          <div className="text-xs text-t3 uppercase tracking-wider">
            Be honest — this is for you
          </div>

          {/* Title */}
          <div>
            <label className="text-xs text-t3 block mb-1.5">What went wrong? *</label>
            <input
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Skipped the gym, missed a deadline, lost focus..."
              maxLength={120}
              autoFocus
              className="w-full bg-surface2 border border-border2 text-t1 placeholder-t3
                         rounded-lg px-3 py-2.5 text-sm outline-none
                         focus:border-fail transition-colors"
            />
          </div>

          {/* Cause */}
          <div>
            <label className="text-xs text-t3 block mb-1.5">Why did it happen?</label>
            <textarea
              value={form.cause}
              onChange={e => setForm(f => ({ ...f, cause: e.target.value }))}
              placeholder="Be honest about the root cause — not the excuse"
              rows={2}
              maxLength={300}
              className="w-full bg-surface2 border border-border2 text-t1 placeholder-t3
                         rounded-lg px-3 py-2.5 text-sm outline-none
                         focus:border-fail transition-colors resize-none"
            />
          </div> 

          {/* Lesson */}
          <div>
            <label className="text-xs text-t3 block mb-1.5">
              What's the 1 lesson you'll take from this? *
            </label>
            <input
              value={form.lesson}
              onChange={e => setForm(f => ({ ...f, lesson: e.target.value }))}
              placeholder="This gets saved and shown to you tomorrow as a reminder"
              maxLength={150}
              className="w-full bg-surface2 border border-border2 text-t1 placeholder-t3
                         rounded-lg px-3 py-2.5 text-sm outline-none
                         focus:border-orange transition-colors"
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-xs text-t3 block mb-2">Category</label>
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map(c => {
                const cc = catColor[c.value];
                const active = form.category === c.value;
                return (
                  <button key={c.value}
                    onClick={() => setForm(f => ({ ...f, category: c.value }))}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-all"
                    style={active
                      ? { background: cc.bg, borderColor: cc.br, color: cc.color }
                      : { background: '#F0F0F0', borderColor: '#D1D1D1', color: '#737373' }
                    }
                  >{c.label}</button>
                );
              })}
            </div>
          </div>

          <button onClick={handleSubmit} disabled={submitting}
            className="bg-fail hover:bg-fail-light text-white text-sm font-medium
                       py-2.5 rounded-lg transition-colors disabled:opacity-50">
            {submitting ? 'Logging...' : 'Log & save lesson'}
          </button>
        </div>
      )}

      {/* Failures feed */}
      {failures.length === 0 ? (
        <div className="bg-surface border border-border1 rounded-2xl p-8 text-center">
          <div className="text-3xl mb-3">🪞</div>
          <div className="text-sm font-medium text-t1 mb-1">No failures logged yet</div>
          <div className="text-xs text-t3">
            The most honest section. Every failure you log becomes a lesson.
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {failures.map(f => {
            const cc = catColor[f.category] || catColor.other;
            return (
              <div key={f._id}
                className="bg-surface border border-border1 rounded-2xl p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1"
                         style={{ background: cc.color }} />
                    <div className="text-sm font-medium text-t1">{f.title}</div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                          style={{ background: cc.bg, color: cc.color }}>
                      {f.category}
                    </span>
                    <button onClick={() => handleDelete(f._id)}
                      className="text-t3 hover:text-fail text-sm hover:bg-fail-bg
                                 px-2 py-0.5 rounded transition-colors">
                      ×
                    </button>
                  </div>
                </div>

                {f.cause && (
                  <div className="text-xs text-t2 mb-2 pl-3.5">{f.cause}</div>
                )}

                {f.lesson && (
                  <div className="flex items-start gap-2 bg-orange-bg border border-orange-br
                                  rounded-lg px-3 py-2 mt-2">
                    <span className="text-orange text-xs flex-shrink-0 mt-0.5">→</span>
                    <span className="text-xs text-orange-light">{f.lesson}</span>
                  </div>
                )}

                <div className="text-[10px] text-t3 mt-2 pl-0.5">
                  {dayjs(f.createdAt).fromNow()}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}