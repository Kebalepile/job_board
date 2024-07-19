export default {
  build: {
    chunkSizeWarningLimit: 500, // Set the limit to 500 kB

    rollupOptions: {
      output: {
        manualChunks(id) {
          // Specify manual chunks based on your code structure
          if (id.includes("node_modules")) {
            return "vendor";
          }
        }
      }
    }
  }
};
