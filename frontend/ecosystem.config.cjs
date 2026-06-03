module.exports = {
  apps: [
    {
      name: "jiafang-frontend",
      cwd: "/var/www/jiafang/jiafang/frontend",
      script: "npm",
      args: "run start",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_memory_restart: "1G",
      time: true,
    },
  ],
};
