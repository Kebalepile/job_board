// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react-swc'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })
// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Specify manual chunks based on your code structure
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
};
// vite.config.js
// export default {
//   build: {
//     chunkSizeWarningLimit: 1024 * 500, // Set the limit to 500 kB
//   },
// };