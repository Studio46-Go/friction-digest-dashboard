import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "url";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@models": fileURLToPath(new URL("./src/models", import.meta.url)),
      "@facades": fileURLToPath(new URL("./src/facades", import.meta.url)),
      "@presenters": fileURLToPath(
        new URL("./src/presenters", import.meta.url),
      ),
    },
  },
});
