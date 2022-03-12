import path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import typescript from "@rollup/plugin-typescript";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "UiTransition",
      fileName: (format) => `ui-transition.${format}.js`,
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        // Provide global variables to use in the UMD build
        // Add external deps here
        globals: {
          vue: "Vue",
        },
      },
    },
  },
  plugins: [
    {
      ...typescript({ tsconfig: "./tsconfig.json" }),
      apply: "build",
    },
    vue(),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "/src"),
    },
  },
  server: {
    port: 9999,
    host: "0.0.0.0",
  },
});
