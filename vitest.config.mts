import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: ['dotenv/config'],
    globals: true,
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'html'],
      include: ['src/**/*'],
      exclude: ['src/**/*.test.ts', 'src/**/__tests__/**'],
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@domain": path.resolve(__dirname, "src/domain"),
      "@application": path.resolve(__dirname, "src/application"),
      "@infra": path.resolve(__dirname, "src/infra"),
      "@presentation": path.resolve(__dirname, "src/presentation")
    }
  }
})