import type { Config } from "tailwindcss"
import daisyui from "daisyui";
import typography from "@tailwindcss/typography";
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
        "neue-montreal": ["'Neue Montreal'", ...fontFamily.sans],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        footer: "0 -14px 14px #28303E05, 0 -55px 22px #28303E02",
      },
      dropShadow: {
        custom1: [
          '0 3px 8px #28303E05',
          '0 14px 14px #28303E05',
        ],
      },
      colors: {
        icon: {
          gray: '#A3A3A3',
        },
        blue: {
          50: "#f0f7ff",
        },
        pink: {
          50: "#fff0f7",
        },
        brand: {
          blue: {
            100: "#E7EEFE",
            500: "#2461F2",
          },
        },
        background: {
          DEFAULT: "hsl(var(--background))",
          gray: "#F5F5F7",
        },
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        line: {
          'gray': '#D9D9D9',
        },
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "scroll-continuous": {
          "0%": {
            transform: "translateX(0)",
          },
          "100%": {
            transform: "translateX(calc(-50% - 4rem))",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "scroll-continuous": "scroll-continuous 30s linear infinite",
        "pause": "none",
      },
      maxWidth: {
        '8xl': '1440px',
      },
      spacing: {
        '7.5': '1.875rem',
        13: '3.25rem',
        15: '3.75rem',
        17: '4.25rem',
        19: '4.75rem',
        22: '5.5rem',
        25: '6.25rem',
        30: '7.5rem',
        50: '12.5rem',
        53: '13.25rem',
        70: '17.5rem',
        '81.5': '20.375rem',
        101: '25.25rem',
        107: '26.75rem',
        '50dvw': '50dvw',
      },
    },
  },
  plugins: [
    daisyui,
    typography,
  ],
  daisyui: {
    themes: [],
  },
}
export default config
