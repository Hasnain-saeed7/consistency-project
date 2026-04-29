
import { create } from 'zustand';
import api from '../utils/api';

export const useFocusStore = create((set, get) => ({
  today: null,
  history: [],
  loading: false,

  fetchToday: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get('/focus/today');
      set({ today: data, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  setGoals: async (goals, weeklyGoal) => {
    const { data } = await api.post('/focus/today', { goals, weeklyGoal });
    set({ today: data });
  },

  toggleGoal: async (goalIndex) => {
    const { today } = get();
    const newCompleted = !today.goals[goalIndex].done;

    // ✅ Proper deep copy — no mutation
    const updatedGoals = today.goals.map((g, i) =>
      i === goalIndex ? { ...g, done: newCompleted } : g
    );

    // Optimistic update
    set({ today: { ...today, goals: updatedGoals } });

    try {
      // Sync to server
      await api.patch(`/focus/${today._id}/goal/${goalIndex}`, {
        done: newCompleted,
      });
    } catch {
      // ✅ Rollback on failure
      set({ today });
    }
  },

  submitReview: async (reviewData) => {
    const { today } = get();
    const { data } = await api.patch(`/focus/${today._id}/review`, reviewData);
    set({ today: data });
  },

  fetchHistory: async () => {
    const { data } = await api.get('/focus/history');
    set({ history: data });
  },
}));