import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				background: '#0b1326',
				foreground: '#dae2fd',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				primary: {
					DEFAULT: '#ffb3b6',
					foreground: '#68001a'
				},
				secondary: {
					DEFAULT: '#d2bbff',
					foreground: '#3f008e'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: '#2d3449',
				input: '#2d3449',
				ring: '#e11d48',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				},
				"on-primary-fixed": "#40000c",
				"surface-container": "#171f33",
				"surface-tint": "#ffb3b6",
				"inverse-primary": "#be0037",
				"secondary-fixed-dim": "#d2bbff",
				"surface-container-highest": "#2d3449",
				"on-primary": "#68001a",
				"on-secondary-container": "#c9aeff",
				"inverse-surface": "#dae2fd",
				"on-secondary-fixed-variant": "#5a00c6",
				"surface-bright": "#31394d",
				"secondary-fixed": "#eaddff",
				"surface-container-low": "#131b2e",
				"secondary-container": "#6001d1",
				"on-tertiary-fixed-variant": "#005142",
				"on-surface-variant": "#e5bdbe",
				"surface-container-lowest": "#060e20",
				"on-primary-fixed-variant": "#920028",
				"on-surface": "#dae2fd",
				"tertiary-container": "#00836c",
				"surface-container-high": "#222a3d",
				"on-secondary": "#3f008e",
				"primary-fixed-dim": "#ffb3b6",
				"primary-container": "#e11d48",
				"error-container": "#93000a",
				"on-tertiary-fixed": "#002019",
				"on-tertiary-container": "#eefff7",
				"inverse-on-surface": "#283044",
				"error": "#ffb4ab",
				"outline-variant": "#5c3f40",
				"surface-variant": "#2d3449",
				"on-tertiary": "#00382d",
				"on-error-container": "#ffdad6",
				"tertiary-fixed": "#90f5d9",
				"on-primary-container": "#fffaf9",
				"on-error": "#690005",
				"tertiary-fixed-dim": "#74d8bd",
				"outline": "#ac8889",
				"tertiary": "#74d8bd",
				"on-background": "#dae2fd",
				"surface": "#0b1326",
				"primary-fixed": "#ffdada",
				"surface-dim": "#0b1326",
				"on-secondary-fixed": "#25005a"
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			fontFamily: {
				"headline": ["var(--font-newsreader)", "serif"],
				"body": ["var(--font-manrope)", "sans-serif"],
				"label": ["var(--font-manrope)", "sans-serif"]
			},
		}
	},
	plugins: [
		require("tailwindcss-animate"),
		require("@tailwindcss/forms"),
		require("@tailwindcss/container-queries")
	],
} satisfies Config;
