// vite.config.ts
import { defineConfig } from "file:///Users/williamcasotto/Desktop/Finance%20Flow/my-money-compass/node_modules/vite/dist/node/index.js";
import react from "file:///Users/williamcasotto/Desktop/Finance%20Flow/my-money-compass/node_modules/@vitejs/plugin-react-swc/index.js";
import path from "path";
var __vite_injected_original_dirname = "/Users/williamcasotto/Desktop/Finance Flow/my-money-compass";
var vite_config_default = defineConfig(() => {
  return {
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false
      }
    },
    plugins: [react()],
    optimizeDeps: {
      include: ["recharts", "d3-shape", "d3-scale", "d3-array"]
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules/recharts") || id.includes("node_modules/victory-vendor") || id.includes("node_modules/d3-")) {
              return "vendor-recharts";
            }
          }
        }
      }
    },
    resolve: {
      alias: {
        "@": path.resolve(__vite_injected_original_dirname, "./src")
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvd2lsbGlhbWNhc290dG8vRGVza3RvcC9GaW5hbmNlIEZsb3cvbXktbW9uZXktY29tcGFzc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3dpbGxpYW1jYXNvdHRvL0Rlc2t0b3AvRmluYW5jZSBGbG93L215LW1vbmV5LWNvbXBhc3Mvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3dpbGxpYW1jYXNvdHRvL0Rlc2t0b3AvRmluYW5jZSUyMEZsb3cvbXktbW9uZXktY29tcGFzcy92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0LXN3Y1wiO1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoKSA9PiB7XG4gIHJldHVybiB7XG4gICAgc2VydmVyOiB7XG4gICAgICBob3N0OiBcIjo6XCIsXG4gICAgICBwb3J0OiA4MDgwLFxuICAgICAgaG1yOiB7XG4gICAgICAgIG92ZXJsYXk6IGZhbHNlLFxuICAgICAgfSxcbiAgICB9LFxuICAgIHBsdWdpbnM6IFtyZWFjdCgpXSxcbiAgICBvcHRpbWl6ZURlcHM6IHtcbiAgICAgIGluY2x1ZGU6IFtcInJlY2hhcnRzXCIsIFwiZDMtc2hhcGVcIiwgXCJkMy1zY2FsZVwiLCBcImQzLWFycmF5XCJdLFxuICAgIH0sXG4gICAgYnVpbGQ6IHtcbiAgICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgICAgb3V0cHV0OiB7XG4gICAgICAgICAgbWFudWFsQ2h1bmtzKGlkKSB7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgIGlkLmluY2x1ZGVzKFwibm9kZV9tb2R1bGVzL3JlY2hhcnRzXCIpIHx8XG4gICAgICAgICAgICAgIGlkLmluY2x1ZGVzKFwibm9kZV9tb2R1bGVzL3ZpY3RvcnktdmVuZG9yXCIpIHx8XG4gICAgICAgICAgICAgIGlkLmluY2x1ZGVzKFwibm9kZV9tb2R1bGVzL2QzLVwiKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgIHJldHVybiBcInZlbmRvci1yZWNoYXJ0c1wiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgcmVzb2x2ZToge1xuICAgICAgYWxpYXM6IHtcbiAgICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksXG4gICAgICB9LFxuICAgIH0sXG4gIH07XG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBcVcsU0FBUyxvQkFBb0I7QUFDbFksT0FBTyxXQUFXO0FBQ2xCLE9BQU8sVUFBVTtBQUZqQixJQUFNLG1DQUFtQztBQUt6QyxJQUFPLHNCQUFRLGFBQWEsTUFBTTtBQUNoQyxTQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUEsTUFDTixNQUFNO0FBQUEsTUFDTixNQUFNO0FBQUEsTUFDTixLQUFLO0FBQUEsUUFDSCxTQUFTO0FBQUEsTUFDWDtBQUFBLElBQ0Y7QUFBQSxJQUNBLFNBQVMsQ0FBQyxNQUFNLENBQUM7QUFBQSxJQUNqQixjQUFjO0FBQUEsTUFDWixTQUFTLENBQUMsWUFBWSxZQUFZLFlBQVksVUFBVTtBQUFBLElBQzFEO0FBQUEsSUFDQSxPQUFPO0FBQUEsTUFDTCxlQUFlO0FBQUEsUUFDYixRQUFRO0FBQUEsVUFDTixhQUFhLElBQUk7QUFDZixnQkFDRSxHQUFHLFNBQVMsdUJBQXVCLEtBQ25DLEdBQUcsU0FBUyw2QkFBNkIsS0FDekMsR0FBRyxTQUFTLGtCQUFrQixHQUM5QjtBQUNBLHFCQUFPO0FBQUEsWUFDVDtBQUFBLFVBQ0Y7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQLE9BQU87QUFBQSxRQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxNQUN0QztBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
