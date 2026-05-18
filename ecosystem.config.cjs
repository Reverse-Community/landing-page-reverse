module.exports = {
  apps: [
    {
      name: "reverse",
      script: "npm",
      args: "run start",
      cwd: __dirname,
      instances: 1,
      exec_mode: "fork",
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 3030,
        HOSTNAME: "127.0.0.1"
      },
      error_file: "./logs/reverse-error.log",
      out_file: "./logs/reverse-out.log",
      time: true
    }
  ]
};
