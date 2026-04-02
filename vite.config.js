import { defineConfig } from 'vite';

export default defineConfig({
  // 使用相对路径，确保在 GitHub Pages 的任意子路径下都能正常加载资源
  base: './',
});