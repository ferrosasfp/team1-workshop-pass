import type { Config } from 'tailwindcss'

/**
 * Paleta del deck del workshop. La app aparece en pantalla justo despues de una
 * lamina, asi que los colores son los mismos que los de la presentacion.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      screens: {
        // El proyector a 1280x720 con el navegador al 150% deja 480px de alto.
        // Todo lo marcado `corto:` es el ajuste para que el flujo entre sin scroll.
        corto: { raw: '(max-height: 620px)' },
      },
      colors: {
        ink: '#08090C',        // fondo casi negro del deck
        surface: '#0F1116',    // tarjetas
        line: '#22252E',       // bordes
        muted: '#8A8F98',      // texto secundario
        paper: '#F5F5F7',      // texto principal
        avax: {
          DEFAULT: '#E84142',  // rojo Avalanche
          dark: '#B32B2C',
          soft: '#2A1416',
        },
        ok: '#39D98A',
        warn: '#F5A524',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      letterSpacing: {
        heading: '-0.03em',
      },
    },
  },
  plugins: [],
}

export default config
