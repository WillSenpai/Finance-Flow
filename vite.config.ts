import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import fs from "node:fs";
import path from "path";

const reactRefreshRuntimePath = path.resolve(
  __dirname,
  "node_modules/@vitejs/plugin-react-swc/refresh-runtime.js",
);

function hasValidReactRefreshRuntime() {
  try {
    return fs.statSync(reactRefreshRuntimePath).size > 0;
  } catch {
    return false;
  }
}

// https://vitejs.dev/config/
export default defineConfig(() => {
  const devHost = process.env.VITE_DEV_HOST || "localhost";
  const devPort = Number(process.env.VITE_DEV_PORT || "5173");
  const canUseReactRefresh = hasValidReactRefreshRuntime();

  return {
    server: {
      host: devHost,
      port: Number.isFinite(devPort) ? devPort : 5173,
      strictPort: false,
      watch: {
        ignored: [
          "**/ios/DerivedData/**",
          "**/android/**/build/**",
          "**/dist/**",
          "**/.git/**",
        ],
      },
      hmr: canUseReactRefresh
        ? {
            overlay: true,
          }
        : false,
    },
    plugins: [react()],
    optimizeDeps: {
      // Keep startup prebundle focused on core runtime deps.
      noDiscovery: false,
      holdUntilCrawlEnd: false,
      exclude: [
        "mermaid",
        "cytoscape",
        "cytoscape-cose-bilkent",
        "cytoscape-fcose",
        "katex",
      ],
      include: [
        "react",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "react-dom",
        "react-dom/client",
        "react-router-dom",
        "@tanstack/react-query",
        "@supabase/supabase-js",
        "clsx",
        "tailwind-merge",
        "sonner",
        "zod",
      ],
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
            if (
              id.includes("node_modules/mermaid") ||
              id.includes("node_modules/@mermaid-js") ||
              id.includes("node_modules/cytoscape") ||
              id.includes("node_modules/katex")
            ) {
              return "vendor-mermaid";
            }
            if (
              id.includes("node_modules/react-markdown") ||
              id.includes("node_modules/rehype-raw") ||
              id.includes("node_modules/remark-gfm")
            ) {
              return "vendor-markdown";
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
