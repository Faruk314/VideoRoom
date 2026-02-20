module.exports = {
  apps: [
    {
      script: "./dist/server.js",
      watch: ".",
      env: {
        NODE_ENV: "production",
        DEBUG: "mediasoup*",
      },
    },
  ],
};
