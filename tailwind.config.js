/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Surface hierarchy
        surface: '#0c1324',
        'surface-dim': '#0c1324',
        'surface-bright': '#33394c',
        'surface-container-lowest': '#070d1f',
        'surface-container-low': '#151b2d',
        'surface-container': '#191f31',
        'surface-container-high': '#23293c',
        'surface-container-highest': '#2e3447',
        'on-surface': '#dce1fb',
        'on-surface-variant': '#bcc9cd',
        'inverse-surface': '#dce1fb',
        'inverse-on-surface': '#2a3043',

        // Outline
        outline: '#869397',
        'outline-variant': '#3d494c',

        // Primary (cyan)
        'surface-tint': '#4cd7f6',
        primary: '#4cd7f6',
        'on-primary': '#003640',
        'primary-container': '#06b6d4',
        'on-primary-container': '#00424f',
        'primary-fixed': '#acedff',
        'primary-fixed-dim': '#4cd7f6',
        'inverse-primary': '#00687a',
        'on-primary-fixed': '#001f26',
        'on-primary-fixed-variant': '#004e5c',

        // Secondary (purple)
        secondary: '#d0bcff',
        'on-secondary': '#3c0091',
        'secondary-container': '#571bc1',
        'on-secondary-container': '#c4abff',
        'secondary-fixed': '#e9ddff',
        'secondary-fixed-dim': '#d0bcff',
        'on-secondary-fixed': '#23005c',
        'on-secondary-fixed-variant': '#5516be',

        // Tertiary (green)
        tertiary: '#4edea3',
        'on-tertiary': '#003824',
        'tertiary-container': '#1bbd85',
        'on-tertiary-container': '#00452e',
        'tertiary-fixed': '#6ffbbe',
        'tertiary-fixed-dim': '#4edea3',
        'on-tertiary-fixed': '#002113',
        'on-tertiary-fixed-variant': '#005236',

        // Error
        error: '#ffb4ab',
        'on-error': '#690005',
        'error-container': '#93000a',
        'on-error-container': '#ffdad6',

        // Background
        background: '#0c1324',
        'on-background': '#dce1fb',
        'surface-variant': '#2e3447',
      },
      fontFamily: {
        sans: ['Geist', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        headline: ['Geist', 'sans-serif'],
        body: ['Geist', 'sans-serif'],
        code: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'code-sm': ['0.6875rem', { lineHeight: '1.15rem', letterSpacing: '0.02em', fontWeight: '400' }],
        'code-md': ['0.8125rem', { lineHeight: '1.35rem', letterSpacing: '0em', fontWeight: '400' }],
        'code-lg': ['0.9375rem', { lineHeight: '1.5rem', letterSpacing: '-0.01em', fontWeight: '400' }],
        'label-sm': ['0.6875rem', { lineHeight: '0.875rem', letterSpacing: '0.05em', fontWeight: '500' }],
        'label-md': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.04em', fontWeight: '500' }],
        'body-sm': ['0.75rem', { lineHeight: '1.25rem', letterSpacing: '0em', fontWeight: '400' }],
        'body-md': ['0.875rem', { lineHeight: '1.45rem', letterSpacing: '0em', fontWeight: '400' }],
        'body-lg': ['1rem', { lineHeight: '1.6rem', letterSpacing: '-0.005em', fontWeight: '400' }],
        'headline-sm': ['1.125rem', { lineHeight: '1.5rem', letterSpacing: '-0.01em', fontWeight: '500' }],
        'headline-md': ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.015em', fontWeight: '500' }],
        'headline-lg': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.02em', fontWeight: '600' }],
        'headline-xl': ['2.25rem', { lineHeight: '2.75rem', letterSpacing: '-0.03em', fontWeight: '600' }],
        'headline-xl-mobile': ['1.75rem', { lineHeight: '2.25rem', letterSpacing: '-0.02em', fontWeight: '600' }],
      },
      borderRadius: {
        DEFAULT: '0.125rem',
        sm: '0.125rem',
        md: '0.25rem',
        lg: '0.375rem',
        xl: '0.5rem',
        '2xl': '0.75rem',
        full: '9999px',
      },
      spacing: {
        'gutter-xs': '0.25rem',
        'gutter-sm': '0.5rem',
        'gutter-md': '0.75rem',
        'gutter-lg': '1rem',
        'gutter-xl': '1.5rem',
        'col-gap': '1rem',
        'panel-split-min': '320px',
      },
    },
  },
  plugins: [],
};
