import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      "@engine": resolve(__dirname, "src/engine"),
      "@render": resolve(__dirname, "src/render"),
      "@ui": resolve(__dirname, "src/ui"),
      "@types": resolve(__dirname, "src/types"),
    },
  },

  // Vitest 配置内联，避免维护两份配置文件
  test: {
    environment: "jsdom",        // React 组件测试需要 DOM 环境
    globals: true,               // 允许直接使用 describe/it/expect，无需 import
    setupFiles: ["src/test-setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      include: ["src/engine/**"],  // 只统计纯逻辑层的覆盖率
      exclude: ["src/render/**", "src/ui/**"],
    },
  },
} as any); // "as any" 仅用于让 Vitest test 字段通过 Vite 类型检查
