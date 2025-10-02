// PM2 Ecosystem Configuration for Vibe Agent Builder
// 한국인프라연구원(주) - infrastructure@kakao.com

module.exports = {
  apps: [
    {
      name: 'vibe-agent-builder',
      script: 'npx',
      args: 'wrangler pages dev dist --ip 0.0.0.0 --port 3000',
      cwd: '/home/user/webapp',
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
        HOST: '0.0.0.0'
      },
      watch: false, // Disable PM2 file monitoring (wrangler handles hot reload)
      instances: 1, // Development mode uses only one instance
      exec_mode: 'fork',
      log_file: '/home/user/webapp/logs/app.log',
      out_file: '/home/user/webapp/logs/out.log',
      error_file: '/home/user/webapp/logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      restart_delay: 1000,
      max_restarts: 5,
      min_uptime: '10s'
    }
  ]
}