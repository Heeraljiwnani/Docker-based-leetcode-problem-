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
        // Surface hierarchy — near-black dark theme
        surface: '#0f0f0f',
        'surface-dim': '#0a0a0a',
        'surface-bright': '#1e1e1e',
        'surface-container-lowest': '#0a0a0a',
        'surface-container-low': '#111111',
        'surface-container': '#1c1c1c',
        'surface-container-high': '#252525',
        'surface-container-highest': '#2e2e2e',
        'on-surface': '#f0f0f0',
        'on-surface-variant': '#a0a0a0',
        'inverse-surface': '#f0f0f0',
        'inverse-on-surface': '#1c1c1c',

        // Outline
        outline: '#555555',
        'outline-variant': '#2e2e2e',

        // Primary — Lime Green
        'surface-tint': '#84cc16',
        primary: '#84cc16',
        'on-primary': '#0a0a0a',
        'primary-container': '#4d7c0f',
        'on-primary-container': '#d9f99d',
        'primary-fixed': '#d9f99d',
        'primary-fixed-dim': '#a3e635',
        'inverse-primary': '#365314',
        'on-primary-fixed': '#0a0a0a',
        'on-primary-fixed-variant': '#1a2e05',

        // Secondary — Muted green-gray
        secondary: '#86efac',
        'on-secondary': '#0a0a0a',
        'secondary-container': '#166534',
        'on-secondary-container': '#bbf7d0',
        'secondary-fixed': '#bbf7d0',
        'secondary-fixed-dim': '#86efac',
        'on-secondary-fixed': '#0a0a0a',
        'on-secondary-fixed-variant': '#14532d',

        // Tertiary — Amber (streak indicator)
        tertiary: '#fbbf24',
        'on-tertiary': '#0a0a0a',
        'tertiary-container': '#92400e',
        'on-tertiary-container': '#fde68a',
        'tertiary-fixed': '#fde68a',
        'tertiary-fixed-dim': '#fbbf24',
        'on-tertiary-fixed': '#0a0a0a',
        'on-tertiary-fixed-variant': '#78350f',

        // Error
        error: '#f87171',
        'on-error': '#0a0a0a',
        'error-container': '#7f1d1d',
        'on-error-container': '#fecaca',

        // Background
        background: '#0a0a0a',
        'on-background': '#f0f0f0',
        'surface-variant': '#252525',
      },
      fontFamily: {
        sans: ['PT Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        headline: ['Doppio One', 'PT Sans', 'sans-serif'],
        body: ['PT Sans', 'sans-serif'],
        code: ['JetBrains Mono', 'monospace'],
        'doppio': ['Doppio One', 'sans-serif'],
        'rubik': ['Rubik', 'PT Sans', 'sans-serif'],
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
