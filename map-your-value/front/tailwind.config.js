/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    fontFamily: {
      sans: ['Satoshi', 'sans-serif'],
    },
    container: {
      center: true,
      padding: "2rem",
      paddingSearch: "1.4rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      padding: {
        'search': '1.4rem',
      },
      colors: {
        gray: '#F6F6F6',
        grayText: '#3C3C43',
        graySmooth: '#7C7C7C',
        graySmallTitle: '#828282',
        red: '#FF0000',
        gradientStart: '#ff7e5f',
        gradientEnd: '#feb47b',
        gradientBg: '#fad6bd',
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontSize: {
        base: '24px',
        '2xl': '32px',
      },
      fontWeight: {
        medium: 500,
      },
      lineHeight: {
        relaxed: '119.444%',
      },
      letterSpacing: {
        tight: '-2.56px',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        fadeOut: {
          '0%': { opacity: 1 },
          '100%': { opacity: 0 },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out',
        fadeOut: 'fadeOut 0.5s ease-in',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
