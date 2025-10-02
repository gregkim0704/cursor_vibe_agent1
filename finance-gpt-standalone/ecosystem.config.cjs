// PM2 Ecosystem Configuration for FinanceGPT
// 한국인프라연구원(주) - infrastructure@kakao.com

module.exports = {
  apps: [
    {
      name: 'finance-gpt',
      script: 'npx',
      args: 'wrangler pages dev dist --ip 0.0.0.0 --port 3001',
      cwd: '/home/user/finance-gpt-app',
      env: {
        NODE_ENV: 'development',
        PORT: 3001,
        HOST: '0.0.0.0'
      },
      watch: false,
      instances: 1,
      exec_mode: 'fork',
      log_file: '/home/user/finance-gpt-app/logs/app.log',
      out_file: '/home/user/finance-gpt-app/logs/out.log',
      error_file: '/home/user/finance-gpt-app/logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      restart_delay: 1000,
      max_restarts: 5,
      min_uptime: '10s'
    }
  ]
}