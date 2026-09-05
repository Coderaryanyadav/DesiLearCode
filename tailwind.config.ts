import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: "var(--surface)",
        surfaceHover: "var(--surface-hover)",
        surfaceSubtle: "var(--surface-subtle)",
        border: "var(--border)",
        borderMuted: "var(--border-muted)",
        muted: "var(--muted)",
        mutedForeground: "var(--muted-foreground)",
        
        // Brand & Accents: Sophisticated, technical palette (Ink, Slate, Amber-Gold, Deep Blue, Jade)
        brand: {
          50: '#f4f5f8',
          100: '#e5e8f0',
          200: '#cbd2e1',
          300: '#a3b1cc',
          400: '#738bb2',
          500: '#4f6d99',
          600: '#3c547b',
          700: '#304364',
          800: '#283751',
          900: '#1a2436',
          950: '#0f1724',
        },
        primary: {
          50: '#f0f6ff',
          100: '#e0edfe',
          200: '#bae0fd',
          300: '#7cc8fb',
          400: '#38aaf5',
          500: '#0e8ee4', // Technical cyan-blue
          600: '#0270c2',
          700: '#03599e',
          800: '#074c82',
          900: '#0c406d',
          950: '#082949',
        },
        accent: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#d97706', // Warm amber
          600: '#b45309',
          700: '#92400e',
          800: '#78350f',
          900: '#451a03',
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        },
        info: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0284c7',
          600: '#0369a1',
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        display: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "Liberation Mono", "Courier New", "monospace"],
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'panel': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'elevation': '0 4px 6px -1px rgba(0, 0, 0, 0.06), 0 2px 4px -2px rgba(0, 0, 0, 0.04)',
        'overlay': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.08)',
      },
      borderRadius: {
        'xs': '0.125rem', // 2px
        'sm': '0.25rem',  // 4px
        'md': '0.375rem', // 6px
        'DEFAULT': '0.5rem', // 8px
        'lg': '0.625rem', // 10px
        'xl': '0.75rem',  // 12px
        '2xl': '1rem',    // 16px (Max for major panels)
      }
    },
  },
  plugins: [],
} satisfies Config;
