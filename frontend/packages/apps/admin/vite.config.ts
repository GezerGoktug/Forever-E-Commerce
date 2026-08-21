import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { staticFilesPlugin, injectToHtmlPlugin } from "@forever/plugins"
import { injectDataToWindow, injectFontsPreloaderToHtml } from "@forever/plugins/utils"
// import { visualizer } from "rollup-plugin-visualizer"
import path from 'path'

export default defineConfig(({ mode, isPreview }) => {
  const isDev = mode === "development";

  return {
    plugins: [
      react(),
      staticFilesPlugin("/static", isDev, isPreview),
      injectToHtmlPlugin(injectDataToWindow({ APP_NAME: "admin", ENV: isDev ? "development" : "production" })),
      injectToHtmlPlugin(injectFontsPreloaderToHtml(
        isDev
          ? [
            "@forever-static/fonts/prata/prata-regular.woff2",
            "@forever-static/fonts/outfit/outfit-thin.woff2",
            "@forever-static/fonts/outfit/outfit-extralight.woff2",
            "@forever-static/fonts/outfit/outfit-light.woff2",
            "@forever-static/fonts/outfit/outfit-regular.woff2",
            "@forever-static/fonts/outfit/outfit-medium.woff2",
            "@forever-static/fonts/outfit/outfit-semibold.woff2",
            "@forever-static/fonts/outfit/outfit-bold.woff2",
            "@forever-static/fonts/outfit/outfit-extrabold.woff2",
            "@forever-static/fonts/outfit/outfit-black.woff2"
          ]
          : [
            "/static/fonts/prata/prata-regular.woff2",
            "/static/fonts/outfit/outfit-thin.woff2",
            "/static/fonts/outfit/outfit-extralight.woff2",
            "/static/fonts/outfit/outfit-light.woff2",
            "/static/fonts/outfit/outfit-regular.woff2",
            "/static/fonts/outfit/outfit-medium.woff2",
            "/static/fonts/outfit/outfit-semibold.woff2",
            "/static/fonts/outfit/outfit-bold.woff2",
            "/static/fonts/outfit/outfit-extrabold.woff2",
            "/static/fonts/outfit/outfit-black.woff2"
          ]
      ))
      // visualizer({
      //   open: true,
      //   filename: 'admin-bundle-report.html',
      //   gzipSize: true,
      //   template: "sunburst"
      // }),
    ],
    server: {
      port: 3000,
    },
    preview: {
      port: 3001
    },
    build: {
      assetsDir: "admin-assets",
      outDir: '../../../dist/admin',
      emptyOutDir: true,
      rollupOptions: {
        input: 'index.html',
        output: {
          manualChunks: {
            'vendor-core': ['react', 'react-dom', 'react-router-dom'],
            'vendor-form': ['react-hook-form', '@hookform/resolvers', 'zod'],
            'vendor-data': ['@tanstack/react-query'],
            'vendor-charts': ['recharts'],
            'vendor-ui': ['framer-motion', 'react-select', 'react-icons']
          },
          chunkFileNames: 'admin-assets/js/[name]-[hash].js',
          entryFileNames: 'admin-assets/js/[name]-[hash].js',
          assetFileNames: 'admin-assets/[ext]/[name]-[hash].[ext]',
        },

      }
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src")
      }
    }
  }
})