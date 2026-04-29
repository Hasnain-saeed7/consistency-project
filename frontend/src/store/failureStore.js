// import { create } from 'zustand';
// import api from '../utils/api';

// export const useFailureStore = create((set) => ({
//   failures: [],

//   fetchFailures: async () => {
//     const { data } = await api.get('/failures');
//     set({ failures: data });
//   },

//   addFailure: async (payload) => {
//     const { data } = await api.post('/failures', payload);
//     set((s) => ({ failures: [data, ...s.failures] }));
//     return data;
//   },

//   removeFailure: async (id) => {
//     await api.delete(`/failures/${id}`);
//     set((s) => ({ failures: s.failures.filter((f) => f._id !== id) }));
//   },
// }));






















import { create } from 'zustand';
import api from '../utils/api';

export const useFailureStore = create((set) => ({
  failures: [],

  fetchFailures: async () => {
    const { data } = await api.get('/failures');
    set({ failures: Array.isArray(data) ? data : [] });
  },

  addFailure: async (payload) => {
    const { data } = await api.post('/failures', payload);
    // backend returns { failure, newBadges }
    const failure = data.failure || data;
    set((s) => ({ failures: [failure, ...s.failures] }));
    return data;
  },

  removeFailure: async (id) => {
    await api.delete(`/failures/${id}`);
    set((s) => ({ failures: s.failures.filter((f) => f._id !== id) }));
  },
}));