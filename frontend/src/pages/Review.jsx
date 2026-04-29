import { useEffect, useState } from 'react';
import { useFocusStore } from '../store/focusStore';
import api from '../utils/api';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const RATINGS = [1,2,3,4,5,6,7,8,9,10];

const ratingColor = (n) => {
  if (n >= 8) return { color: '#5a8a6a', bg: '#E6F3EB', br: '#B3D9C2' };
  if (n >= 5) return { color: '#d4724a', bg: '#FFF0E5', br: '#FFD1B3' };
  return { color: '#b85a5a', bg: '#FCE8E8', br: '#F5BDBD' };
};

const ratingLabel = (n) => {
  if (n >= 9) return 'Exceptional';
  if (n >= 7) return 'Strong day';
  if (n >= 5) return 'Decent';
  if (n >= 3) return 'Rough';
  return 'Hard day';
};

export default function Review() {
  const { today, fetchToday, submitReview } = useFocusStore();
  const [history, setHistory] = useState([]);
  const [form, setForm] = useState({
    rating: 7,
    highlight: '',
    struggle: '',
    tomorrow: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchToday();
    api.get('/focus/history').then(r => setHistory(r.data || [])).catch(() => {});
  }, []);

  const alreadyReviewed = !!today?.review;

  const handleSubmit = async () => {
    if (!form.highlight.trim()) {
      toast.error('Add at least a highlight');
      return;
    }
    setSubmitting(true);
    try {
      await submitReview(form);
      toast.success('Day reviewed — streak updated 🔥');
    } catch { toast.error('Failed to submit review'); }
    finally { setSubmitting(false); }
  };

  const rc = ratingColor(form.rating);

  return (
    <div className="flex flex-col gap-5">

      {/* Header */}
      <div>
        <h1 className="text-lg font-semibold text-t1 tracking-tight">Evening Review</h1>
        <p className="text-xs text-t3 mt-0.5">Close the loop — reflect and update your streak</p>
      </div>

      {/* Already reviewed */}
      {alreadyReviewed ? (
        <div className="bg-salt border border-win-br rounded-2xl p-5 text-center">
          <div className="text-3xl mb-3"></div>
          <div className="text-sm font-medium text-win mb-1">Day reviewed</div>
          <div className="text-xs text-t3 mb-3">
            You rated today {today.review.rating}/10
          </div>
          {today.review.highlight && (
            <div className="text-xs text-t2 bg-surface2 rounded-lg px-3 py-2 text-left mb-2">
              <span className="text-t3">Highlight: </span>{today.review.highlight}
            </div>
          )}
          {today.review.tomorrow && (
            <div className="text-xs text-t2 bg-surface2 rounded-lg px-3 py-2 text-left">
              <span className="text-t3">Tomorrow: </span>{today.review.tomorrow}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-surface border border-border1 rounded-2xl p-5 flex flex-col gap-5">

          {/* Rating */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs text-t3 uppercase tracking-wider">Rate your day</label>
              <span className="text-xs font-medium px-2.5 py-1 rounded-full"
                    style={{ background: rc.bg, color: rc.color, border: `0.5px solid ${rc.br}` }}>
                {form.rating}/10 — {ratingLabel(form.rating)}
              </span>
            </div>
            <div className="flex gap-1.5">
              {RATINGS.map(n => (
                <button key={n}
                  onClick={() => setForm(f => ({ ...f, rating: n }))}
                  className="flex-1 py-2 rounded-lg text-xs font-medium border transition-all"
                  style={form.rating === n
                    ? { background: ratingColor(n).bg,
                        borderColor: ratingColor(n).br,
                        color: ratingColor(n).color }
                    : { background: '#F0F0F0',
                        borderColor: form.rating >= n ? '#D1D1D1' : '#E0E0E0',
                        color: form.rating >= n ? '#4A4A4A' : '#737373' }
                  }
                >{n}</button>
              ))}
            </div>
          </div>

          {/* Highlight */}
          <div>
            <label className="text-xs text-t3 block mb-1.5">
              What was today's highlight? *
            </label>
            <input
              value={form.highlight}
              onChange={e => setForm(f => ({ ...f, highlight: e.target.value }))}
              placeholder="The best thing that happened or that you did today"
              maxLength={200}
              className="w-full bg-surface2 border border-border2 text-t1 placeholder-t3
                         rounded-lg px-3 py-2.5 text-sm outline-none
                         focus:border-orange transition-colors"
            />
          </div>

          {/* Struggle */}
          <div>
            <label className="text-xs text-t3 block mb-1.5">What did you struggle with?</label>
            <input
              value={form.struggle}
              onChange={e => setForm(f => ({ ...f, struggle: e.target.value }))}
              placeholder="Be honest — what held you back today?"
              maxLength={200}
              className="w-full bg-surface2 border border-border2 text-t1 placeholder-t3
                         rounded-lg px-3 py-2.5 text-sm outline-none
                         focus:border-orange transition-colors"
            />
          </div>

          {/* Tomorrow */}
          <div>
            <label className="text-xs text-t3 block mb-1.5">
              One thing to do differently tomorrow
            </label>
            <input
              value={form.tomorrow}
              onChange={e => setForm(f => ({ ...f, tomorrow: e.target.value }))}
              placeholder="Small, specific, actionable"
              maxLength={200}
              className="w-full bg-surface2 border border-border2 text-t1 placeholder-t3
                         rounded-lg px-3 py-2.5 text-sm outline-none
                         focus:border-orange transition-colors"
            />
          </div>

          <button onClick={handleSubmit} disabled={submitting || !form.highlight.trim()}
            className="bg-orange hover:bg-orange-light text-white text-sm font-medium
                       py-2.5 rounded-lg transition-colors disabled:opacity-50">
            {submitting ? 'Submitting...' : 'Submit review + update streak'}
          </button>
        </div>
      )}

      {/* Past reviews */}
      {history.filter(h => h.review).length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="text-xs text-t3 uppercase tracking-wider">Past reviews</div>
          {history.filter(h => h.review).map(h => {
            const rc2 = ratingColor(h.review.rating);
            return (
              <div key={h._id}
                className="bg-surface border border-border1 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-t3">
                    {dayjs(h.date).format('ddd, MMM D')}
                  </span>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full"
                        style={{ background: rc2.bg,
                                 color: rc2.color,
                                 border: `0.5px solid ${rc2.br}` }}>
                    {h.review.rating}/10 · {ratingLabel(h.review.rating)}
                  </span>
                </div>

                {h.review.highlight && (
                  <div className="text-xs text-t2 mb-1.5">
                    <span className="text-t3">Highlight: </span>{h.review.highlight}
                  </div>
                )}
                {h.review.struggle && (
                  <div className="text-xs text-t2 mb-1.5">
                    <span className="text-t3">Struggle: </span>{h.review.struggle}
                  </div>
                )}
                {h.review.tomorrow && (
                  <div className="text-xs bg-orange-bg border border-orange-br
                                  rounded-lg px-3 py-1.5 text-orange-light mt-2">
                    Tomorrow: {h.review.tomorrow}
                  </div>
                )}

                {/* Goals recap */}
                {h.goals?.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-border1">
                    <div className="text-[10px] text-t3 mb-2 uppercase tracking-wider">
                      Goals that day — {h.goals.filter(g => g.completed).length}/{h.goals.length} done
                    </div>
                    <div className="flex flex-col gap-1">
                      {h.goals.map((g, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0
                            ${g.completed ? 'bg-win' : 'bg-surface3'}`} />
                          <span className={`text-xs ${g.completed ? 'text-t2' : 'text-t3 line-through'}`}>
                            {g.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}