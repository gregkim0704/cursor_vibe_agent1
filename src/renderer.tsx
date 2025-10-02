import { jsxRenderer } from 'hono/jsx-renderer'

export const renderer = jsxRenderer(({ children }) => {
  return (
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Vibe Agent Builder - Cursor IDE용 AI 에이전트 생성기</title>
        <meta name="description" content="개발자를 위한 맞춤형 AI 에이전트 생성 도구. Cursor IDE와 완벽 통합." />
        <meta name="keywords" content="AI, Cursor IDE, Agent Builder, 개발도구, 자동화" />
        <meta name="author" content="한국인프라연구원(주)" />
        
        {/* TailwindCSS CDN */}
        <script src="https://cdn.tailwindcss.com"></script>
        
        {/* Font Awesome Icons */}
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet" />
        
        {/* 추가 스타일 */}
        <link href="/static/style.css" rel="stylesheet" />
        
        {/* Axios for HTTP requests */}
        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        
        {/* Prism.js for code highlighting */}
        <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css" rel="stylesheet" />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-core.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/autoloader/prism-autoloader.min.js"></script>
        
        <style>{`
          /* 커스텀 스타일 */
          .gradient-bg {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          
          .agent-card {
            transition: all 0.3s ease;
            border-left: 4px solid transparent;
          }
          
          .agent-card:hover {
            transform: translateY(-2px);
            border-left-color: #3B82F6;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          }
          
          .code-preview {
            background: #2d3748;
            color: #e2e8f0;
            border-radius: 8px;
            font-family: 'Courier New', monospace;
          }
          
          .tag {
            background: linear-gradient(45deg, #667eea, #764ba2);
            color: white;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 0.75rem;
            display: inline-block;
            margin: 2px;
          }
        `}</style>
      </head>
      <body className="bg-gray-50">
        {children}
      </body>
    </html>
  )
})
