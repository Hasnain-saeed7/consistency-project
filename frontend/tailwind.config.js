export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg:       '#F9F9F9',
        surface:  '#FFFFFF',
        surface2: '#F0F0F0',
        surface3: '#E5E5E5',
        border1:  '#E0E0E0',
        border2:  '#D1D1D1',
        t1:       '#1A1A1A',
        t2:       '#4A4A4A',
        t3:       '#737373',
        orange: {
          DEFAULT: '#d4724a',
          light:   '#e8956e',
          dark:    '#b85a32',
          bg:      '#FFF0E5',
          br:      '#FFD1B3',
        },
        win: {
          DEFAULT: '#5a8a6a',
          light:   '#7aaa8a',
          bg:      '#E6F3EB',
          br:      '#B3D9C2',
        },
        fail: {
          DEFAULT: '#b85a5a',
          light:   '#d07a7a',
          bg:      '#FCE8E8',
          br:      '#F5BDBD',
        },
        streak: {
          DEFAULT: '#8a7ab8',
          bg:      '#F0EEF7',
          br:      '#D1C9E6',
        },
        focus: {
          DEFAULT: '#7a9ab8',
          bg:      '#EAF0F5',
          br:      '#C5D7E8',
        },
      },
      fontFamily: {
        sans: ['Sora', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
      },
    },
  },
  plugins: [],
};