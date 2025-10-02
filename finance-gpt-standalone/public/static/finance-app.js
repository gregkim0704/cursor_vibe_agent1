// FinanceGPT - 박사급 금융 컨설팅 AI 전용 앱
// 한국인프라연구원(주) - infrastructure@kakao.com

class FinanceGPT {
    constructor() {
        this.currentAnalysis = null;
        this.init();
    }

    init() {
        console.log('💰 FinanceGPT 초기화 완료');
        this.setupEventListeners();
        this.loadUserData();
    }

    setupEventListeners() {
        // 실시간 금액 포맷팅
        const amountInputs = ['investAmount', 'annualIncome', 'existingAssets'];
        amountInputs.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', (e) => {
                    this.formatCurrency(e.target);
                });
            }
        });
    }

    formatCurrency(input) {
        let value = input.value.replace(/[^0-9]/g, '');
        if (value) {
            value = parseInt(value).toLocaleString('ko-KR');
            // 임시로 원래 값 저장
            input.dataset.rawValue = input.value.replace(/[^0-9]/g, '');
        }
    }

    getRawValue(inputId) {
        const input = document.getElementById(inputId);
        return input ? parseInt(input.dataset.rawValue || input.value.replace(/[^0-9]/g, '') || '0') : 0;
    }

    async analyzePortfolio() {
        const amount = this.getRawValue('investAmount');
        const riskLevel = document.getElementById('riskLevel').value;

        if (!amount || amount < 1000000) {
            this.showNotification('최소 투자금액은 100만원 이상입니다.', 'error');
            return;
        }

        this.showLoading('포트폴리오 분석 중...');

        try {
            const response = await axios.post('/api/portfolio-analysis', {
                amount,
                riskLevel,
                age: 45, // 기본값
                goals: '장기 자산 증식 및 절세'
            });

            const { analysis, recommendations, taxOptimization } = response.data;
            this.displayPortfolioResults(analysis, recommendations, taxOptimization, amount);

        } catch (error) {
            console.error('포트폴리오 분석 오류:', error);
            this.showNotification('분석 중 오류가 발생했습니다. 다시 시도해주세요.', 'error');
        } finally {
            this.hideLoading();
        }
    }

    displayPortfolioResults(analysis, recommendations, taxOptimization, amount) {
        const resultsArea = document.getElementById('resultsArea');
        const analysisResults = document.getElementById('analysisResults');

        const stocksAmount = Math.round(amount * analysis.recommendedAllocation.stocks / 100);
        const bondsAmount = Math.round(amount * analysis.recommendedAllocation.bonds / 100);
        const alternativesAmount = Math.round(amount * analysis.recommendedAllocation.alternatives / 100);

        analysisResults.innerHTML = `
            <div class="grid md:grid-cols-2 gap-8">
                <!-- 포트폴리오 배분 -->
                <div>
                    <h4 class="text-lg font-bold mb-4 text-blue-800">
                        <i class="fas fa-pie-chart mr-2"></i>추천 포트폴리오 배분
                    </h4>
                    <div class="space-y-3">
                        <div class="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                            <div>
                                <span class="font-medium">주식/성장투자</span>
                                <div class="text-sm text-gray-600">${analysis.recommendedAllocation.stocks}%</div>
                            </div>
                            <div class="text-right">
                                <div class="font-bold text-blue-800">${stocksAmount.toLocaleString()}원</div>
                            </div>
                        </div>
                        
                        <div class="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                            <div>
                                <span class="font-medium">채권/안전투자</span>
                                <div class="text-sm text-gray-600">${analysis.recommendedAllocation.bonds}%</div>
                            </div>
                            <div class="text-right">
                                <div class="font-bold text-green-800">${bondsAmount.toLocaleString()}원</div>
                            </div>
                        </div>
                        
                        <div class="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                            <div>
                                <span class="font-medium">대체투자 (부동산/원자재)</span>
                                <div class="text-sm text-gray-600">${analysis.recommendedAllocation.alternatives}%</div>
                            </div>
                            <div class="text-right">
                                <div class="font-bold text-purple-800">${alternativesAmount.toLocaleString()}원</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 차트 영역 -->
                    <div class="mt-6">
                        <canvas id="portfolioChart" width="400" height="300"></canvas>
                    </div>
                </div>

                <!-- 수익률 및 절세 전략 -->
                <div>
                    <h4 class="text-lg font-bold mb-4 text-green-800">
                        <i class="fas fa-chart-line mr-2"></i>예상 수익률 & 절세 전략
                    </h4>
                    
                    <div class="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl mb-6">
                        <div class="text-center">
                            <div class="text-3xl font-bold text-green-800 mb-2">${analysis.expectedReturn}%</div>
                            <div class="text-sm text-gray-600">연평균 예상 수익률 (세후)</div>
                            <div class="text-lg font-medium text-blue-800 mt-2">
                                예상 연수익: ${Math.round(amount * analysis.expectedReturn / 100).toLocaleString()}원
                            </div>
                        </div>
                    </div>

                    <div class="space-y-3">
                        <h5 class="font-bold text-gray-800">박사급 전문 추천사항:</h5>
                        ${recommendations.map(rec => `
                            <div class="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                                <i class="fas fa-lightbulb text-yellow-600 mt-1"></i>
                                <span class="text-sm">${rec}</span>
                            </div>
                        `).join('')}
                    </div>

                    <div class="mt-6 p-4 bg-red-50 rounded-xl">
                        <h5 class="font-bold text-red-800 mb-2">절세 효과</h5>
                        <div class="text-sm space-y-1">
                            <div>현재 세율: <span class="font-bold">${taxOptimization.currentTaxRate}%</span></div>
                            <div>최적화 후: <span class="font-bold text-green-600">${taxOptimization.optimizedTaxRate}%</span></div>
                            <div class="text-lg font-bold text-red-600">
                                연간 절세액: ${taxOptimization.annualSavings.toLocaleString()}원
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        resultsArea.classList.remove('hidden');
        this.createPortfolioChart(analysis.recommendedAllocation);
        this.updateDashboard(amount, taxOptimization.annualSavings, analysis.expectedReturn);
    }

    createPortfolioChart(allocation) {
        const ctx = document.getElementById('portfolioChart').getContext('2d');
        
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['주식/성장투자', '채권/안전투자', '대체투자'],
                datasets: [{
                    data: [allocation.stocks, allocation.bonds, allocation.alternatives],
                    backgroundColor: [
                        '#3B82F6', // Blue
                        '#059669', // Green  
                        '#7C3AED'  // Purple
                    ],
                    borderColor: ['#1E40AF', '#047857', '#5B21B6'],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            font: {
                                size: 12
                            }
                        }
                    }
                }
            }
        });
    }

    async optimizeTax() {
        const income = this.getRawValue('annualIncome');
        const assets = this.getRawValue('existingAssets');

        if (!income || income < 10000000) {
            this.showNotification('연소득 1천만원 이상부터 절세 전략이 유효합니다.', 'error');
            return;
        }

        this.showLoading('절세 전략 분석 중...');

        try {
            const response = await axios.post('/api/tax-optimization', {
                income,
                assets,
                familyStatus: 'married' // 기본값
            });

            const { taxStrategy } = response.data;
            this.displayTaxResults(taxStrategy, income);

        } catch (error) {
            console.error('절세 분석 오류:', error);
            this.showNotification('분석 중 오류가 발생했습니다. 다시 시도해주세요.', 'error');
        } finally {
            this.hideLoading();
        }
    }

    displayTaxResults(taxStrategy, income) {
        const resultsArea = document.getElementById('resultsArea');
        const analysisResults = document.getElementById('analysisResults');

        analysisResults.innerHTML = `
            <div>
                <h4 class="text-2xl font-bold mb-6 text-center text-red-800">
                    <i class="fas fa-calculator mr-2"></i>VIP 절세 최적화 전략
                </h4>
                
                <!-- 절세 효과 요약 -->
                <div class="bg-gradient-to-r from-red-50 to-green-50 p-8 rounded-2xl mb-8">
                    <div class="grid md:grid-cols-3 gap-6 text-center">
                        <div>
                            <div class="text-sm text-gray-600 mb-1">현재 세부담</div>
                            <div class="text-2xl font-bold text-red-600">${taxStrategy.currentTaxBurden.toLocaleString()}원</div>
                        </div>
                        <div>
                            <div class="text-sm text-gray-600 mb-1">최적화 후</div>
                            <div class="text-2xl font-bold text-green-600">${taxStrategy.optimizedTaxBurden.toLocaleString()}원</div>
                        </div>
                        <div>
                            <div class="text-sm text-gray-600 mb-1">연간 절세액</div>
                            <div class="text-3xl font-bold text-blue-600">${taxStrategy.savingsAmount.toLocaleString()}원</div>
                        </div>
                    </div>
                </div>

                <!-- 전략별 상세 분석 -->
                <div class="space-y-6">
                    <h5 class="text-lg font-bold text-gray-800">박사급 맞춤 절세 전략</h5>
                    
                    ${taxStrategy.strategies.map((strategy, index) => `
                        <div class="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
                            <div class="flex items-start justify-between mb-4">
                                <div>
                                    <h6 class="text-lg font-bold text-gray-800">${index + 1}. ${strategy.type}</h6>
                                    <p class="text-gray-600 mt-1">${strategy.description}</p>
                                </div>
                                <div class="text-right">
                                    <div class="text-lg font-bold text-green-600">
                                        ${strategy.expectedSavings.toLocaleString()}원
                                    </div>
                                    <div class="text-sm text-gray-500">연간 절세</div>
                                </div>
                            </div>
                            
                            <div class="flex items-center justify-between">
                                <div class="flex items-center space-x-2">
                                    <span class="text-sm text-gray-600">리스크:</span>
                                    <span class="px-2 py-1 text-xs rounded-full ${
                                        strategy.riskLevel === '낮음' ? 'bg-green-100 text-green-800' :
                                        strategy.riskLevel === '중간' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                    }">${strategy.riskLevel}</span>
                                </div>
                                <button onclick="financeGPT.getStrategyDetails('${strategy.type}')" 
                                        class="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                    상세보기 <i class="fas fa-arrow-right ml-1"></i>
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <!-- 실행 계획 -->
                <div class="mt-8 bg-blue-50 p-6 rounded-xl">
                    <h5 class="text-lg font-bold text-blue-800 mb-4">
                        <i class="fas fa-road mr-2"></i>6개월 실행 로드맵
                    </h5>
                    <div class="space-y-3">
                        <div class="flex items-center space-x-4 p-3 bg-white rounded-lg">
                            <div class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                            <div>
                                <div class="font-medium">1-2개월: 구조 설계 및 상품 선정</div>
                                <div class="text-sm text-gray-600">최적 보험상품 및 투자구조 설계</div>
                            </div>
                        </div>
                        <div class="flex items-center space-x-4 p-3 bg-white rounded-lg">
                            <div class="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                            <div>
                                <div class="font-medium">3-4개월: 실행 및 이전 작업</div>
                                <div class="text-sm text-gray-600">기존 자산 이전 및 새로운 구조 적용</div>
                            </div>
                        </div>
                        <div class="flex items-center space-x-4 p-3 bg-white rounded-lg">
                            <div class="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                            <div>
                                <div class="font-medium">5-6개월: 최적화 및 모니터링</div>
                                <div class="text-sm text-gray-600">성과 분석 및 추가 최적화 기회 발굴</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        resultsArea.classList.remove('hidden');
        this.updateDashboard(income * 3, taxStrategy.savingsAmount, 15); // 가정값 업데이트
    }

    async startVIPConsultation() {
        const goals = document.getElementById('consultGoals').value.trim();

        if (!goals) {
            this.showNotification('컨설팅 목표를 입력해주세요.', 'error');
            return;
        }

        this.showLoading('VIP 컨설팅 분석 중...');

        try {
            const response = await axios.post('/api/vip-consultation', {
                clientProfile: {
                    wealthLevel: 'UHNW',
                    industry: 'multiple',
                    experience: '20+ years'
                },
                consultationGoals: goals
            });

            const { consultation } = response.data;
            this.displayVIPResults(consultation);

        } catch (error) {
            console.error('VIP 컨설팅 오류:', error);
            this.showNotification('분석 중 오류가 발생했습니다. 다시 시도해주세요.', 'error');
        } finally {
            this.hideLoading();
        }
    }

    displayVIPResults(consultation) {
        const resultsArea = document.getElementById('resultsArea');
        const analysisResults = document.getElementById('analysisResults');

        analysisResults.innerHTML = `
            <div>
                <h4 class="text-2xl font-bold mb-6 text-center text-red-800">
                    <i class="fas fa-crown mr-2"></i>VIP 종합 컨설팅 결과
                </h4>
                
                <!-- 클라이언트 분석 -->
                <div class="bg-gradient-to-r from-red-50 to-purple-50 p-8 rounded-2xl mb-8">
                    <h5 class="text-lg font-bold text-red-800 mb-4">고객 프로필 분석</h5>
                    <div class="grid md:grid-cols-3 gap-6">
                        <div class="text-center">
                            <div class="text-2xl font-bold text-purple-600">${consultation.clientAnalysis.wealthLevel}</div>
                            <div class="text-sm text-gray-600">자산 등급</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-blue-600">${consultation.clientAnalysis.riskCapacity}</div>
                            <div class="text-sm text-gray-600">리스크 수용도</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-green-600">Premium+</div>
                            <div class="text-sm text-gray-600">서비스 등급</div>
                        </div>
                    </div>
                </div>

                <!-- 전략적 추천사항 -->
                <div class="space-y-6">
                    <h5 class="text-lg font-bold text-gray-800">통합 전략 추천사항</h5>
                    
                    ${consultation.strategicRecommendations.map((rec, index) => `
                        <div class="bg-white p-6 rounded-xl shadow-lg border-l-4 border-red-500">
                            <h6 class="text-lg font-bold text-gray-800 mb-3">${index + 1}. ${rec.area}</h6>
                            
                            <div class="grid md:grid-cols-2 gap-6">
                                <div>
                                    <div class="text-sm text-gray-600 mb-2">현재 상황</div>
                                    <div class="p-3 bg-gray-100 rounded text-sm">${rec.current}</div>
                                </div>
                                <div>
                                    <div class="text-sm text-gray-600 mb-2">박사급 추천안</div>
                                    <div class="p-3 bg-blue-100 rounded text-sm">${rec.recommended}</div>
                                </div>
                            </div>
                            
                            <div class="mt-4 p-3 bg-green-50 rounded-lg">
                                <div class="text-sm text-gray-600">예상 효과</div>
                                <div class="font-bold text-green-800">
                                    ${rec.expectedROI || rec.expectedSavings || rec.coverage}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <!-- 실행 타임라인 -->
                <div class="mt-8 bg-purple-50 p-6 rounded-xl">
                    <h5 class="text-lg font-bold text-purple-800 mb-4">
                        <i class="fas fa-calendar-alt mr-2"></i>6개월 실행 타임라인
                    </h5>
                    <div class="space-y-4">
                        ${consultation.implementationTimeline.map((phase, index) => `
                            <div class="flex items-start space-x-4 p-4 bg-white rounded-lg">
                                <div class="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                                    ${index + 1}
                                </div>
                                <div class="flex-1">
                                    <div class="font-bold text-gray-800">${phase.phase}</div>
                                    <div class="text-sm text-gray-600 mt-1">
                                        주요 업무: ${phase.tasks.join(', ')}
                                    </div>
                                    <div class="text-sm text-blue-600 mt-1">
                                        결과물: ${phase.deliverables.join(', ')}
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        resultsArea.classList.remove('hidden');
    }

    updateDashboard(totalAssets, taxSavings, portfolioReturn) {
        // 대시보드 숫자 업데이트
        const assetElement = document.querySelector('.bg-blue-50 .text-3xl');
        const savingsElement = document.querySelector('.bg-green-50 .text-3xl');
        const returnElement = document.querySelector('.bg-purple-50 .text-3xl');

        if (assetElement) assetElement.textContent = `₩${totalAssets.toLocaleString()}`;
        if (savingsElement) savingsElement.textContent = `₩${taxSavings.toLocaleString()}`;
        if (returnElement) returnElement.textContent = `${portfolioReturn}%`;

        // 애니메이션 효과
        [assetElement, savingsElement, returnElement].forEach(el => {
            if (el) {
                el.classList.add('animate-pulse');
                setTimeout(() => el.classList.remove('animate-pulse'), 2000);
            }
        });
    }

    getStrategyDetails(strategyType) {
        const details = {
            '보험 활용 절세': `
                <strong>상세 전략:</strong><br>
                • 변액보험 + 연금보험 조합으로 소득공제 극대화<br>
                • 보험료 연 1,800만원 한도 내에서 세액공제<br>
                • 10년 이상 유지시 비과세 혜택<br>
                • 상속세 절약 효과까지 고려한 통합 설계
            `,
            '투자 구조 최적화': `
                <strong>상세 전략:</strong><br>
                • 해외투자펀드 활용으로 양도세 이연<br>
                • 집합투자기구 통한 손익통산 효과<br>
                • 국외금융계좌 신고 의무 준수하면서 최적화<br>
                • 개인종합자산관리계좌(ISA) 활용
            `,
            '렌탈/리스 구조 활용': `
                <strong>상세 전략:</strong><br>
                • 개인사업자 또는 법인 설립을 통한 임대업<br>
                • 부동산 임대수익과 장비 리스 수익 결합<br>
                • 감가상각비 활용한 소득 분산<br>
                • 가족 구성원 간 소득 분산 전략
            `
        };

        this.showModal('전략 상세 정보', details[strategyType] || '상세 정보를 준비중입니다.');
    }

    showModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-xl max-w-md mx-4 p-6">
                <h3 class="text-lg font-bold mb-4">${title}</h3>
                <div class="text-sm text-gray-700 mb-4">${content}</div>
                <button onclick="this.closest('.fixed').remove()" 
                        class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                    확인
                </button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    loadUserData() {
        // 기본 데이터 로딩 (실제로는 서버에서)
        console.log('💼 사용자 데이터 로딩 완료');
    }

    showLoading(message) {
        const loading = document.createElement('div');
        loading.id = 'loadingModal';
        loading.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        loading.innerHTML = `
            <div class="bg-white rounded-xl p-8 flex items-center space-x-4">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <div class="text-lg font-medium">${message}</div>
            </div>
        `;
        document.body.appendChild(loading);
    }

    hideLoading() {
        const loading = document.getElementById('loadingModal');
        if (loading) {
            loading.remove();
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        const colors = {
            success: 'bg-green-500',
            error: 'bg-red-500', 
            info: 'bg-blue-500'
        };

        notification.className = `fixed top-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform`;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => notification.classList.remove('translate-x-full'), 100);
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// 전역 인스턴스 생성
let financeGPT;

// DOM 로드 완료시 초기화
document.addEventListener('DOMContentLoaded', () => {
    financeGPT = new FinanceGPT();
});

// 전역 함수들 (HTML에서 직접 호출용)
function analyzePortfolio() {
    financeGPT.analyzePortfolio();
}

function optimizeTax() {
    financeGPT.optimizeTax();
}

function startVIPConsultation() {
    financeGPT.startVIPConsultation();
}

console.log('💰 FinanceGPT v1.0 로드 완료!');
console.log('🏢 한국인프라연구원(주) - infrastructure@kakao.com');
console.log('📞 010-9143-0800');