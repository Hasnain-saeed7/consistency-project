
// import { create } from 'zustand';
// import api from '../utils/api';

// export const useWinStore = create((set) => ({
//   wins:  [],
//   stats: null,

//   fetchWins: async () => {
//     const { data } = await api.get('/wins');
//     // Always set wins as an array, regardless of backend response shape
//     let winsArr = [];
//     if (Array.isArray(data)) {
//       winsArr = data;
//     } else if (Array.isArray(data.wins)) {
//       winsArr = data.wins;
//     } else if (Array.isArray(data.data)) {
//       winsArr = data.data;
//     }
//     set({ wins: winsArr });
//   },

//   fetchStats: async () => {
//     const { data } = await api.get('/wins/stats');
//     set({ stats: data });
//   },

//   addWin: async (payload) => {
//     const { data } = await api.post('/wins', payload);
//     // Backend now returns { win, newBadges }
//     const win = data.win || data;
//     set((s) => ({ wins: [win, ...s.wins] }));
//     return data; // return full response so Wins.jsx can read newBadges
//   },

//   removeWin: async (id) => {
//     await api.delete(`/wins/${id}`);
//     set((s) => ({ wins: s.wins.filter((w) => w._id !== id) }));
//   },
// })); 
























import { create } from 'zustand';
import api from '../utils/api';

export const useWinStore = create((set) => ({
  wins:  [],
  stats: null,

  fetchWins: async () => {
    const { data } = await api.get('/wins');
    // backend returns { wins, total }
    set({ wins: data.wins || (Array.isArray(data) ? data : []) });
  },

  fetchStats: async () => {
    const { data } = await api.get('/wins/stats');
    set({ stats: data });
  },

  addWin: async (payload) => {
    const { data } = await api.post('/wins', payload);
    // backend returns { win, newBadges }
    const win = data.win || data;
    set((s) => ({ wins: [win, ...s.wins] }));
    return data;
  },

  removeWin: async (id) => {
    await api.delete(`/wins/${id}`);
    set((s) => ({ wins: s.wins.filter((w) => w._id !== id) }));
  },
}));