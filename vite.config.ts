import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => {
  const devHost = process.env.VITE_DEV_HOST || "127.0.0.1";
  const devPort = Number(process.env.VITE_DEV_PORT || "5173");

  return {
    server: {
      host: devHost,
      port: Number.isFinite(devPort) ? devPort : 5173,
      hmr: {
        overlay: true,
      },
    },
    plugins: [react()],
    optimizeDeps: {
      include: ["recharts", "d3-shape", "d3-scale", "d3-array"],
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (
              id.includes("node_modules/recharts") ||
              id.includes("node_modules/victory-vendor") ||
              id.includes("node_modules/d3-")
            ) {
              return "vendor-recharts";
            }
          },
        },
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
