import {defineConfig, loadEnv} from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    server: { /* only applies to the DEVELOPMENT vite server */
      https: {
        key:"../ssl/fake-ssl-key",
        cert:"../ssl/fake-ssl-cert"
      },
      proxy: {
        "/api": {
          target: "http://localhost:8080",
          changeOrigin: true
        },
        "/oauth2": {
          target: "http://localhost:8080",
          changeOrigin: true
        }
      },
      port: 4430
    },
    plugins: [react()]
  };
});
