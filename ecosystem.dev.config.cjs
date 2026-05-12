/** Dev: Vite dev server (HMR). */
module.exports = {
  apps: [
    {
      name: "s1lkpay-dev",
      cwd: __dirname,
      script: "node_modules/vite/bin/vite.js",
      args: "--host 0.0.0.0 --port 5173",
      interpreter: "node",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_memory_restart: "500M",
      env: { NODE_ENV: "development" },
    },
  ],
};
