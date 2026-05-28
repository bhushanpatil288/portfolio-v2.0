import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(async ({ command, mode }) => {
  const plugins = [react()];

  // Dynamically import rollup-plugin-visualizer to prevent crash when not installed
  if (mode === 'analyze') {
    try {
      const { visualizer } = await import('rollup-plugin-visualizer');
      plugins.push(visualizer({
        open: true,
        filename: 'dist/stats.html',
        gzipSize: true,
        brotliSize: true,
      }));
    } catch (e) {
      console.warn("rollup-plugin-visualizer could not be loaded:", e.message);
    }
  }

  return {
    plugins,
    build: {
      // Generate source maps in development builds, not production
      sourcemap: mode === 'development',
    }
  }
})
