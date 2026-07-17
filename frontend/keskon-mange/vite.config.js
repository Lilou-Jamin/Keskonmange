import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  // Uncomment this when using a Tauri application as a development environment
  // server: {
  //   host: '0.0.0.0',
  //   hmr: {
  //     // Input your PC local IP address into this field
  //     host: "192.168.1.10",
  //     protocol: "ws",
  //   },
  // },
  plugins: [react(), tailwindcss()],
});
