// import { create } from 'zustand';
// import api from '../utils/api';

// export const useHabitStore = create((set) => ({
//   habits: [],

//   fetchHabits: async () => {
//     const { data } = await api.get('/habits');
//     set({ habits: data });
//   },

//   addHabit: async (name) => {
//     const { data } = await api.post('/habits', { name });
//     set((s) => ({ habits: [...s.habits, data] }));
//   },

//   toggleHabit: async (id) => {
//     const { data } = await api.patch(`/habits/${id}/log`);
//     set((s) => ({ habits: s.habits.map((h) => h._id === id ? data : h) }));
//   },

//   removeHabit: async (id) => {
//     await api.delete(`/habits/${id}`);
//     set((s) => ({ habits: s.habits.filter((h) => h._id !== id) }));
//   },
// }));




























import { create } from 'zustand';
import api from '../utils/api';

export const useHabitStore = create((set) => ({
  habits: [],

  fetchHabits: async () => {
    const { data } = await api.get('/habits');
    set({ habits: Array.isArray(data) ? data : [] });
  },

  addHabit: async (name) => {
    const { data } = await api.post('/habits', { name });
    // backend returns { habit, newBadges }
    const habit = data.habit || data;
    set((s) => ({ habits: [...s.habits, habit] }));
    return data;
  },

  toggleHabit: async (id) => {
    const { data } = await api.patch(`/habits/${id}/log`);
    // backend returns the full habit object directly
    set((s) => ({
      habits: s.habits.map((h) => h._id === id ? data : h),
    }));
  },

  removeHabit: async (id) => {
    await api.delete(`/habits/${id}`);
    set((s) => ({ habits: s.habits.filter((h) => h._id !== id) }));
  },
}));