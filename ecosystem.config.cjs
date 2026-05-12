/** Production: serve `dist/` via Vite preview (run `npm run build` first). */
module.exports = {
  apps: [
    {
      name: "s1lkpay",
      cwd: __dirname,
      script: "node_modules/vite/bin/vite.js",
      args: "preview --host 0.0.0.0 --port 4173",
      interpreter: "node",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_memory_restart: "500M",
      env: { NODE_ENV: "production" },
    },
  ],
};
