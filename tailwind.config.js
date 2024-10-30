/** @type {import('tailwindcss').Config} */


export default {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	darkMode:"class",
	lightMode:"class",
	theme: {
		// fontSize: {
		// 	sm: ['14px', '20px'],
		// 	base: ['16px', '24px'],
		// 	lg: ['20px', '28px'],
		// 	xl: ['24px', '32px'],
		//   },
		
		extend: {
			fontFamily: {
				qwitcher: ['Qwitcher Grypen', 'cursive'],
			  },
			colors: {
				dark: {
					DEFAULT: "#353535",
				},
				primary: {
					DEFAULT: "#42a5f5",
					dark: "#1876d2",
					darker: "#027bff",
					light: "#55a6ff",
				},
				warning: {
					light: "#FF8800",
					DEFAULT: "#FF8800",
					dark: "#EA9828",
				},
				info: {
					light: "#0099CC",
					DEFAULT: "#0099CC",
					dark: "#0099CC",
				},
				information: {
					light: "#0099CC",
					DEFAULT: "#0099CC",
					dark: "#0099CC",
				},
				danger: {
					light: "#CC0000",
					DEFAULT: "#CC0000",
					dark: "#CC0000",
				},
				success: {
					light: "#007E33",
					DEFAULT: "#007E33",
					dark: "#007E33",
				},
				darker: {
					light: "#292B39",
					DEFAULT: "#292B39",
					dark: "#292B39",
				},
				
			},
			bgPattern: {
				dots: "radial-gradient(#333 1px, transparent 1px)",
			  },
		},
		"animation": {
		  shimmer: "shimmer 2s linear infinite"
		},
		"keyframes": {
		  shimmer: {
			from: {
			  "backgroundPosition": "0 0"
			},
			to: {
			  "backgroundPosition": "-200% 0"
			}
		  }
		}
	},
	
	variants: {},
	
};
