import type { Config } from "tailwindcss";
import { mtConfig } from "@material-tailwind/react";
import { PluginAPI } from "tailwindcss/types/config";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/interface/*.{js,ts,jsx,tsx,mdx}",
    "./src/interface/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/constants/*.{js,ts,jsx,tsx,mdx}",
    "./src/constants/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@material-tailwind/react/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'from-from-green', 'to-from-green',
    'from-from-blue', 'to-from-blue',
    'to-from-green', 'to-to-green',
    'to-from-blue', 'to-to-blue',
    'bg-status-belumDiReview',
    'text-status-belumDiReview',
    'bg-status-onReview',
    'text-status-onReview',
    'bg-status-wawancara',
    'text-status-wawancara',
    'bg-status-ditolak',
    'text-status-ditolak',
    'bg-status-diterima',
    'text-status-diterima',
  ],
  theme: {
    extend: {
      height: {
        'input-standard': '2.5rem',
        'input-standard-sm': '2rem',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      screens: {
        'sm': '320px',
      },
      ringWidth: {
        0.5: "0.5px",
      },
      colors: {
        primary: '#662AB2',
        secondary: '#17A2B8',
        accent: '#f4a261',
        dark: '#2d3748',
        "premium-blue": "#05C3D0",
        "blue-button": "#051552BF",
        "blue-badge": "#3A3B7B",
        "blue-badge-background": "#D1DEFF",
        "border-primary": '#767DC4',
        light: '#edf2f7',
        "custom-red": '#e53e3e',
        "custom-green": '#38a169',
        "edit-blue": '#007AFF',
        "delete-red": '#AC2828',
        warning: '#FFC107',
        success: '#28A745',
        "light-success": '#34C759',
        danger: '#DC3545',
        "error": '#DC3545',
        "black-label": '#000000',
        "text-gray-black": '#4E4E4E',
        "gray-label": '#4A4A4A',
        "gray-black": '#4E4E4E',
        "gray-dark": '#262626',
        gray: '#6C757D',
        "input-gray": '#DEE2E6',
        "unfocused-gray": '#7676801F',
        "tab-unselected": '#999999',
        "gray-medium": '#54595E',
        "gray-light": '#6C757D',
        "from-green": '#04a84f',
        "from-blue": '#061653',
        "to-blue": '#364374',
        "to-green": '#4AC080',
        "warning-secondary": "#975102",
        "warning-secondary-bg": "#FFCBBA",
      },
      fontWeight: {
        'extra-bold': '800',
        'semibold-sm': '500',
      },
      fontSize: {
        'md': '1rem',
        '3.5xl': '2rem',
        xxs: '0.675rem',
        xxxs: '0.575rem',
      },
      lineHeight: {
        xxs: '1rem',
        xxxs: '0.7rem',
        '6': '1.5rem',
        '0': '0rem',
      },
      transitionDuration: {
        '300': '300ms',
      },
      transitionDelay: {
        '100': '0.1s',
        '500': '0.5s',
      },
      transitionTimingFunction: {
        'ease': 'ease',
      },
      animation: {
        slide: 'slide 0.5s ease-in-out infinite',
        'slide-once': 'slide 0.5s ease-in-out',
        'slide-to-left': 'slide-to-left 0.5s ease-in',
        'slide-to-right': 'slide-to-right 0.5s ease-in',
        'transition-ease': 'transition duration-300 0.5s ease',
      },
      keyframes: {
        slide: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(1rem)' },
        },
        'slide-to-left': {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '50%': { transform: 'translateX(100%)', opacity: '0' },
          '51%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-to-right': {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '50%': { transform: 'translateX(-100%)', opacity: '0' },
          '51%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      }
    },
  },
  plugins: [
    mtConfig,
    function ({ addComponents, addUtilities }: PluginAPI) {
      addComponents({
        '.mask-to-t': {
          WebkitMask: 'linear-gradient(to top, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%)',
          mask: 'linear-gradient(to top, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%)',
        },
        '.animate-slide': {
          '@apply transform transition-transform duration-300 hover:translate-x-4': {},
        },
      });

      // Custom utilities for status styles
      addUtilities({
        '.before-none': {
          '&::before': {
            display: 'none !important',
          },
        },
        '.after-none': {
          '&::after': {
            display: 'none !important',
          },
        },
        '.transition-ease': {
          'transition-duration': '300ms',
          'transition-delay': '0.1s',
          'transition-timing-function': 'ease',
        },
        '.bg-status-belumDiReview': {
          backgroundColor: '#FFC107',
        },
        '.text-status-belumDiReview': {
          color: '#000000',
        },
        '.bg-status-onReview': {
          backgroundColor: '#2196F3',
        },
        '.text-status-onReview': {
          color: '#FFFFFF',
        },
        '.bg-status-wawancara': {
          backgroundColor: '#9C27B0',
        },
        '.text-status-wawancara': {
          color: '#FFFFFF',
        },
        '.bg-status-ditolak': {
          backgroundColor: '#F44336',
        },
        '.text-status-ditolak': {
          color: '#FFFFFF',
        },
        '.bg-status-diterima': {
          backgroundColor: '#4CAF50',
        },
        '.text-status-diterima': {
          color: '#FFFFFF',
        },
      });
    },
  ],
};

export default config;
