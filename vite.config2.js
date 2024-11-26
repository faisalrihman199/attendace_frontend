import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'public', 'key.pem')), // Path to your private key
      cert: fs.readFileSync(path.resolve(__dirname, 'public', 'cert.pem')), // Path to your certificate
    },
    host: 'localhost', // Optional: specify the host
    port: 5173, // Optional: specify the port
  },
});
