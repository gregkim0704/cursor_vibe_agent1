import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

const app = new Hono()

// CORS 설정
app.use('/api/*', cors())

// 정적 파일 서빙
app.use('/static/*', serveStatic({ root: './public' }))

// FinanceGPT AI 분석 API
app.post('/api/portfolio-analysis', async (c) => {
  const body = await c.req.json()
  const { amount, riskLevel, age, goals } = body
  
  // 박사님의 전문적 포트폴리오 분석 로직
  const analysis = analyzePortfolio(amount, riskLevel, age, goals)
  
  return c.json({
    success: true,
    analysis,
    recommendations: generateRecommendations(analysis),
    taxOptimization: calculateTaxOptimization(analysis),
    timestamp: new Date().toISOString()
  })
})

app.post('/api/tax-optimization', async (c) => {
  const body = await c.req.json()
  const { income, assets, familyStatus } = body
  
  const taxStrategy = {
    currentTaxBurden: income * 0.35, // 예상 세부담
    optimizedTaxBurden: income * 0.22, // 최적화 후
    savingsAmount: income * 0.13,
    strategies: [
      {
        type: '보험 활용 절세',
        description: 'VIP 고객을 위한 변액보험 + 연금보험 조합',
        expectedSavings: income * 0.05,
        riskLevel: '낮음'
      },
      {
        type: '투자 구조 최적화',
        description: '세금우대 투자상품 + 해외투자 활용',
        expectedSavings: income * 0.04,
        riskLevel: '중간'
      },
      {
        type: '렌탈/리스 구조 활용',
        description: '부동산 임대업 + 장비 리스 구조',
        expectedSavings: income * 0.04,
        riskLevel: '중간'
      }
    ]
  }
  
  return c.json({
    success: true,
    taxStrategy,
    annualSavings: taxStrategy.savingsAmount,
    implementationPlan: generateImplementationPlan(taxStrategy)
  })
})

app.post('/api/vip-consultation', async (c) => {
  const body = await c.req.json()
  const { clientProfile, consultationGoals } = body
  
  const consultation = {
    clientAnalysis: analyzeVIPClient(clientProfile),
    strategicRecommendations: [
      {
        area: '자산 배분',
        current: '기존 포트폴리오 분석',
        recommended: '통합적 시너지를 고려한 최적 배분',
        expectedROI: '12-15% (세후 기준)'
      },
      {
        area: '절세 전략',
        current: '일반적 절세 방법',
        recommended: 'VIP 맞춤형 고도화 절세 구조',
        expectedSavings: '연간 30-50% 세부담 절감'
      },
      {
        area: '리스크 관리',
        current: '단순 보험 상품',
        recommended: '통합 리스크 관리 + 헤지 전략',
        coverage: '자산 100% + 수익 보장'
      }
    ],
    implementationTimeline: generate6MonthPlan()
  }
  
  return c.json({
    success: true,
    consultation,
    nextSteps: consultation.implementationTimeline.slice(0, 3)
  })
})

// 메인 애플리케이션 페이지
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>FinanceGPT - 박사급 금융 컨설팅 AI</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <link href="/static/finance-style.css" rel="stylesheet">
        
        <style>
          .gradient-finance {
            background: linear-gradient(135deg, #1e3a8a 0%, #059669 50%, #dc2626 100%);
          }
          
          .card-premium {
            background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            border: 1px solid rgba(59, 130, 246, 0.1);
          }
          
          .btn-vip {
            background: linear-gradient(45deg, #dc2626, #991b1b);
            box-shadow: 0 8px 20px rgba(220, 38, 38, 0.3);
          }
          
          .wealth-indicator {
            background: radial-gradient(circle, #fbbf24 0%, #f59e0b 100%);
          }
        </style>
    </head>
    <body class="bg-gray-50">
        <!-- Header -->
        <header class="gradient-finance text-white py-6 shadow-2xl">
            <div class="container mx-auto px-4">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                        <div class="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                            <i class="fas fa-chart-line text-2xl text-white"></i>
                        </div>
                        <div>
                            <h1 class="text-3xl font-bold">FinanceGPT</h1>
                            <p class="text-blue-100">박사급 금융 컨설팅 AI</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="text-sm text-blue-100">한국인프라연구원(주)</p>
                        <p class="text-xs text-blue-200">infrastructure@kakao.com</p>
                    </div>
                </div>
            </div>
        </header>

        <!-- Main Dashboard -->
        <main class="container mx-auto px-4 py-8">
            <!-- VIP Status Card -->
            <div class="card-premium rounded-2xl p-8 mb-8">
                <div class="flex items-center justify-between mb-6">
                    <div>
                        <h2 class="text-2xl font-bold text-gray-800 mb-2">
                            <i class="fas fa-crown text-yellow-500 mr-2"></i>
                            VIP 자산관리 대시보드
                        </h2>
                        <p class="text-gray-600">박사급 전문성으로 통합 컨설팅을 제공합니다</p>
                    </div>
                    <div class="wealth-indicator w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        AAA+
                    </div>
                </div>
                
                <div class="grid md:grid-cols-3 gap-6">
                    <div class="bg-blue-50 p-6 rounded-xl">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-blue-600 font-medium">총 자산</p>
                                <p class="text-3xl font-bold text-blue-800">₩0</p>
                            </div>
                            <i class="fas fa-wallet text-3xl text-blue-400"></i>
                        </div>
                    </div>
                    
                    <div class="bg-green-50 p-6 rounded-xl">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-green-600 font-medium">예상 절세액</p>
                                <p class="text-3xl font-bold text-green-800">₩0</p>
                            </div>
                            <i class="fas fa-piggy-bank text-3xl text-green-400"></i>
                        </div>
                    </div>
                    
                    <div class="bg-purple-50 p-6 rounded-xl">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-purple-600 font-medium">포트폴리오 수익률</p>
                                <p class="text-3xl font-bold text-purple-800">0%</p>
                            </div>
                            <i class="fas fa-chart-pie text-3xl text-purple-400"></i>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 컨설팅 서비스 메뉴 -->
            <div class="grid lg:grid-cols-3 gap-8 mb-8">
                <!-- 포트폴리오 분석 -->
                <div class="card-premium rounded-xl p-6">
                    <div class="text-center mb-6">
                        <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-chart-area text-2xl text-blue-600"></i>
                        </div>
                        <h3 class="text-xl font-bold mb-2">포트폴리오 분석</h3>
                        <p class="text-gray-600">통합적 시너지를 고려한 자산 배분</p>
                    </div>
                    
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium mb-2">투자 금액</label>
                            <input type="number" id="investAmount" placeholder="예: 100000000" class="w-full p-3 border rounded-lg">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">리스크 성향</label>
                            <select id="riskLevel" class="w-full p-3 border rounded-lg">
                                <option value="conservative">보수적</option>
                                <option value="moderate">중도적</option>
                                <option value="aggressive">공격적</option>
                            </select>
                        </div>
                        <button onclick="analyzePortfolio()" class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
                            <i class="fas fa-analytics mr-2"></i>AI 분석 실행
                        </button>
                    </div>
                </div>

                <!-- 절세 최적화 -->
                <div class="card-premium rounded-xl p-6">
                    <div class="text-center mb-6">
                        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-calculator text-2xl text-green-600"></i>
                        </div>
                        <h3 class="text-xl font-bold mb-2">절세 최적화</h3>
                        <p class="text-gray-600">VIP 고객 맞춤형 절세 전략</p>
                    </div>
                    
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium mb-2">연소득</label>
                            <input type="number" id="annualIncome" placeholder="예: 500000000" class="w-full p-3 border rounded-lg">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">기존 자산</label>
                            <input type="number" id="existingAssets" placeholder="예: 2000000000" class="w-full p-3 border rounded-lg">
                        </div>
                        <button onclick="optimizeTax()" class="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition">
                            <i class="fas fa-search-dollar mr-2"></i>절세 전략 분석
                        </button>
                    </div>
                </div>

                <!-- VIP 컨설팅 -->
                <div class="card-premium rounded-xl p-6">
                    <div class="text-center mb-6">
                        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-crown text-2xl text-red-600"></i>
                        </div>
                        <h3 class="text-xl font-bold mb-2">VIP 종합 컨설팅</h3>
                        <p class="text-gray-600">경영·재무·보험·자산관리 통합</p>
                    </div>
                    
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium mb-2">컨설팅 목표</label>
                            <textarea id="consultGoals" placeholder="예: 5년 내 자산 10배 증식, 절세 최적화" class="w-full p-3 border rounded-lg h-20"></textarea>
                        </div>
                        <button onclick="startVIPConsultation()" class="w-full btn-vip text-white py-3 rounded-lg hover:shadow-lg transition">
                            <i class="fas fa-handshake mr-2"></i>VIP 컨설팅 시작
                        </button>
                    </div>
                </div>
            </div>

            <!-- 결과 표시 영역 -->
            <div id="resultsArea" class="hidden">
                <div class="card-premium rounded-xl p-8">
                    <h3 class="text-2xl font-bold mb-6 text-center">
                        <i class="fas fa-brain text-blue-600 mr-2"></i>
                        AI 분석 결과
                    </h3>
                    <div id="analysisResults" class="space-y-6">
                        <!-- 분석 결과가 여기에 표시됩니다 -->
                    </div>
                </div>
            </div>
        </main>

        <script src="/static/finance-app.js"></script>
    </body>
    </html>
  `)
})

// 헬퍼 함수들
function analyzePortfolio(amount: number, riskLevel: string, age: number, goals: string) {
  // 박사님의 전문 분석 로직
  const baseAllocation = {
    conservative: { stocks: 30, bonds: 50, alternatives: 20 },
    moderate: { stocks: 50, bonds: 30, alternatives: 20 },
    aggressive: { stocks: 70, bonds: 10, alternatives: 20 }
  }
  
  const allocation = baseAllocation[riskLevel as keyof typeof baseAllocation]
  
  return {
    recommendedAllocation: allocation,
    expectedReturn: riskLevel === 'aggressive' ? 12 : riskLevel === 'moderate' ? 8 : 5,
    riskScore: riskLevel === 'aggressive' ? 8 : riskLevel === 'moderate' ? 5 : 3,
    taxEfficiency: calculateTaxEfficiency(allocation),
    monthlyContribution: Math.round(amount * 0.1 / 12)
  }
}

function generateRecommendations(analysis: any) {
  return [
    "보험상품을 통한 세제혜택 극대화 (연간 1,800만원 한도)",
    "해외투자펀드 활용으로 양도세 이연 효과",
    "부동산 임대업과 연계한 렌탈 구조 최적화",
    "변액보험 + 연금보험 조합으로 장기 절세 전략"
  ]
}

function calculateTaxOptimization(analysis: any) {
  return {
    currentTaxRate: 35,
    optimizedTaxRate: 22,
    annualSavings: 50000000,
    strategies: ["보험활용", "투자구조최적화", "렌탈사업연계"]
  }
}

function analyzeVIPClient(profile: any) {
  return {
    wealthLevel: "UHNW", // Ultra High Net Worth
    riskCapacity: "High",
    recommendedServices: ["Private Banking", "Family Office", "Tax Planning"],
    priorityAreas: ["자산보전", "세무최적화", "상속계획"]
  }
}

function generateImplementationPlan(strategy: any) {
  return [
    { month: 1, action: "보험상품 구조 설계", status: "준비" },
    { month: 2, action: "투자계좌 개설 및 이전", status: "준비" },
    { month: 3, action: "렌탈사업 법인 설립", status: "계획" }
  ]
}

function generate6MonthPlan() {
  return [
    { phase: "1개월", tasks: ["현황분석", "목표설정"], deliverables: ["분석보고서"] },
    { phase: "2-3개월", tasks: ["구조설계", "상품선정"], deliverables: ["실행계획서"] },
    { phase: "4-6개월", tasks: ["실행", "모니터링"], deliverables: ["성과보고서"] }
  ]
}

function calculateTaxEfficiency(allocation: any) {
  return Math.round((allocation.alternatives * 0.8 + allocation.bonds * 0.6 + allocation.stocks * 0.4) / 3)
}

export default app