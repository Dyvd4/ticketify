/// <reference types="vitest" />

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import svgrPlugin from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
	// This changes the out put dir from dist to build
	// comment this out if that isn't relevant for your project
	build: {
		outDir: "build",
	},
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: "./src/setupTests.tsx",
		coverage: {
			reporter: ["text", "html"],
			exclude: ["node_modules", "src/setupTests.tsx"],
		},
	},
	optimizeDeps: {
		esbuildOptions: {
			define: {
				global: "globalThis",
			},
		},
	},
	plugins: [react(), svgrPlugin(), tsconfigPaths()],
	server: {
		host: "0.0.0.0",
		port: 3000,
		watch: {
			usePolling: true,
		},
	},
});
