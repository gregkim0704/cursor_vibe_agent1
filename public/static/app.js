// Vibe Agent Builder - Frontend JavaScript
// 한국인프라연구원(주) - infrastructure@kakao.com

class VibeAgentBuilder {
    constructor() {
        this.agents = [];
        this.selectedAgent = null;
        this.init();
    }

    async init() {
        console.log('🤖 Vibe Agent Builder 초기화 중...');
        
        // 이벤트 리스너 등록
        this.setupEventListeners();
        
        // 에이전트 목록 로드
        await this.loadAgents();
    }

    setupEventListeners() {
        // 시작 버튼
        const startBtn = document.getElementById('startBtn');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                this.showAgentBuilder();
            });
        }

        // 새로고침 버튼
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.loadAgents();
            });
        }

        // 에이전트 생성 폼
        const agentForm = document.getElementById('agentForm');
        if (agentForm) {
            agentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.createAgent();
            });
        }

        // 템플릿 프롬프트 버튼들
        this.setupPromptTemplates();
    }

    setupPromptTemplates() {
        // 전문 도메인별 프롬프트 템플릿 생성
        const templates = [
            {
                name: '금융 컨설팅',
                prompt: `당신은 경영·재무·보험·자산관리 분야의 박사급 전문 컨설턴트입니다.

핵심 역할:
- 통합적 시너지를 고려한 맞춤형 금융 솔루션 제공
- VIP 고객을 위한 절세 및 자산관리 전략 수립
- 혁신적이고 차별화된 금융 상품 및 서비스 제안

전문성 기준:
- 전문적: 각종 자료, 데이터, 논문, 증거 등을 근거로 함
- 통합적: 개별 요인뿐만 아니라 모든 요인을 통합하여 고려
- 맞춤형: 고객별, 니즈별로 정확한 현실을 우선 고려
- 혁신성: 경우에 따라 혁신적 결과 도출을 마다하지 않음

응답 특성:
- 신속하고 장기적 관점 고려
- 인문학적 관점에서 고객 행동 분석
- 과학적 근거 우선
- 전략적이고 협상력 강화 관점 포함

한국인프라연구원(주) - infrastructure@kakao.com - 010-9143-0800`
            },
            {
                name: '블록체인 & STO 전문가',
                prompt: `당신은 블록체인 구조와 마이닝에 대한 전문가이며, STO(Security Token Offering) 혁신증권 분야의 최고 권위자입니다.

전문 분야:
- 블록체인 기술 구조 및 아키텍처 설계
- 암호화폐 마이닝 최적화 전략
- STO 및 혁신증권 상품 개발
- 디지털 자산 운용 및 관리
- 토큰이코노미 설계

접근 방식:
- 기술적 정확성과 실무 적용성 균형
- 규제 환경을 고려한 혁신적 솔루션
- 투자자 보호와 수익성 최적화
- 글로벌 트렌드와 국내 실정 조화

한국인프라연구원(주) - infrastructure@kakao.com - 010-9143-0800`
            },
            {
                name: '신재생에너지 & 수전해',
                prompt: `당신은 신재생에너지 분야와 수전해 기술의 최고 전문가입니다.

핵심 전문성:
- 물에서 수소를 추출하는 수전해 기술 전문가
- 신재생에너지 발전 시스템 설계 및 운영
- 그린 수소 생산 및 활용 전략
- 에너지 저장 시스템(ESS) 통합 솔루션
- 탄소중립 실현을 위한 기술적 로드맵

기술적 접근:
- 최신 기술 동향과 상용화 가능성 분석
- 경제성과 환경성을 동시에 고려
- 정부 정책 및 보조금 활용 방안
- 사업화를 위한 실무적 조언

한국인프라연구원(주) - infrastructure@kakao.com - 010-9143-0800`
            }
        ];

        // 템플릿 버튼 동적 생성
        const promptField = document.getElementById('agentPrompt');
        if (promptField) {
            const templateContainer = document.createElement('div');
            templateContainer.className = 'mb-4 p-4 bg-blue-50 rounded-lg';
            templateContainer.innerHTML = `
                <p class="text-sm font-medium mb-2">📋 전문 도메인 템플릿:</p>
                <div class="flex flex-wrap gap-2">
                    ${templates.map((template, index) => 
                        `<button type="button" class="template-btn px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200 transition" data-index="${index}">
                            ${template.name}
                        </button>`
                    ).join('')}
                </div>
            `;

            promptField.parentNode.insertBefore(templateContainer, promptField);

            // 템플릿 버튼 이벤트
            templateContainer.querySelectorAll('.template-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const index = btn.dataset.index;
                    promptField.value = templates[index].prompt;
                });
            });
        }
    }

    showAgentBuilder() {
        // 메인 화면 숨기기
        const mainDiv = document.querySelector('.min-h-screen.bg-gradient-to-br');
        if (mainDiv) {
            mainDiv.style.display = 'none';
        }

        // 에이전트 빌더 화면 보이기
        const builderDiv = document.getElementById('agentBuilder');
        if (builderDiv) {
            builderDiv.classList.remove('hidden');
        }
    }

    async loadAgents() {
        try {
            console.log('📥 에이전트 목록 로딩 중...');
            const response = await axios.get('/api/agents');
            this.agents = response.data.agents;
            this.renderAgentList();
        } catch (error) {
            console.error('❌ 에이전트 로딩 실패:', error);
            this.showNotification('에이전트 목록을 불러오는데 실패했습니다.', 'error');
        }
    }

    renderAgentList() {
        const listContainer = document.getElementById('agentList');
        if (!listContainer) return;

        listContainer.innerHTML = this.agents.map(agent => `
            <div class="agent-card bg-gray-50 p-4 rounded-lg cursor-pointer hover:bg-white transition" 
                 onclick="vibeBuilder.selectAgent('${agent.id}')">
                <div class="flex justify-between items-start mb-2">
                    <h4 class="font-semibold text-lg">${agent.name}</h4>
                    <span class="text-xs text-gray-500">사용: ${agent.usage}회</span>
                </div>
                <p class="text-sm text-gray-600 mb-2">${agent.description}</p>
                <div class="mb-2">
                    <span class="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        ${agent.category}
                    </span>
                </div>
                <div class="flex flex-wrap gap-1 mb-3">
                    ${agent.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-xs text-gray-500">by ${agent.author}</span>
                    <div class="space-x-2">
                        <button class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded hover:bg-green-200"
                                onclick="event.stopPropagation(); vibeBuilder.exportAgent('${agent.id}', 'cursor')">
                            📋 Cursor 내보내기
                        </button>
                        <button class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200"
                                onclick="event.stopPropagation(); vibeBuilder.previewAgent('${agent.id}')">
                            👁️ 미리보기
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    selectAgent(agentId) {
        const agent = this.agents.find(a => a.id === agentId);
        if (agent) {
            this.selectedAgent = agent;
            this.populateForm(agent);
        }
    }

    populateForm(agent) {
        const form = document.getElementById('agentForm');
        if (!form) return;

        form.querySelector('#agentName').value = agent.name;
        form.querySelector('#agentCategory').value = agent.category;
        form.querySelector('#agentDescription').value = agent.description;
        form.querySelector('#agentPrompt').value = agent.prompt;
        form.querySelector('#agentTags').value = agent.tags.join(', ');

        this.showNotification(`에이전트 "${agent.name}"을 불러왔습니다.`, 'success');
    }

    async createAgent() {
        const form = document.getElementById('agentForm');
        if (!form) return;

        const formData = {
            name: form.querySelector('#agentName').value.trim(),
            category: form.querySelector('#agentCategory').value,
            description: form.querySelector('#agentDescription').value.trim(),
            prompt: form.querySelector('#agentPrompt').value.trim(),
            tags: form.querySelector('#agentTags').value.split(',').map(tag => tag.trim()).filter(tag => tag)
        };

        // 유효성 검사
        if (!formData.name || !formData.category || !formData.description || !formData.prompt) {
            this.showNotification('모든 필수 필드를 입력해주세요.', 'error');
            return;
        }

        try {
            console.log('✨ 새 에이전트 생성 중...', formData);
            const response = await axios.post('/api/agents', formData);
            
            if (response.data.success) {
                this.showNotification('새로운 에이전트가 성공적으로 생성되었습니다!', 'success');
                form.reset();
                await this.loadAgents(); // 목록 새로고침
            }
        } catch (error) {
            console.error('❌ 에이전트 생성 실패:', error);
            this.showNotification('에이전트 생성에 실패했습니다.', 'error');
        }
    }

    async exportAgent(agentId, format) {
        try {
            console.log(`📤 에이전트 ${agentId}를 ${format} 형식으로 내보내는 중...`);
            const response = await axios.get(`/api/export/${agentId}/${format}`);
            
            if (response.data.format === 'cursor-rules') {
                // 클립보드에 복사
                await navigator.clipboard.writeText(response.data.content);
                this.showNotification('Cursor 설정이 클립보드에 복사되었습니다!', 'success');
                
                // 사용 방법 안내 팝업
                this.showInstructions(response.data.content, response.data.instructions);
            }
        } catch (error) {
            console.error('❌ 내보내기 실패:', error);
            this.showNotification('내보내기에 실패했습니다.', 'error');
        }
    }

    previewAgent(agentId) {
        const agent = this.agents.find(a => a.id === agentId);
        if (!agent) return;

        // 프리뷰 모달 생성
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-xl max-w-3xl max-h-[80vh] overflow-auto m-4 p-6">
                <div class="flex justify-between items-start mb-4">
                    <h3 class="text-2xl font-bold">${agent.name}</h3>
                    <button class="text-gray-500 hover:text-gray-700 text-2xl" onclick="this.closest('.fixed').remove()">×</button>
                </div>
                
                <div class="mb-4">
                    <span class="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        ${agent.category}
                    </span>
                </div>
                
                <p class="text-gray-700 mb-4">${agent.description}</p>
                
                <div class="mb-4">
                    <h4 class="font-semibold mb-2">태그:</h4>
                    <div class="flex flex-wrap gap-1">
                        ${agent.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
                
                <div class="mb-4">
                    <h4 class="font-semibold mb-2">시스템 프롬프트:</h4>
                    <pre class="code-preview p-4 text-sm overflow-auto max-h-60">${agent.prompt}</pre>
                </div>
                
                <div class="flex justify-end space-x-3">
                    <button class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                            onclick="vibeBuilder.exportAgent('${agent.id}', 'cursor')">
                        📋 Cursor에 적용
                    </button>
                    <button class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                            onclick="this.closest('.fixed').remove()">
                        닫기
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    showInstructions(content, instructions) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-xl max-w-4xl max-h-[80vh] overflow-auto m-4 p-6">
                <h3 class="text-2xl font-bold mb-4">🎯 Cursor IDE 적용 방법</h3>
                
                <div class="mb-6 p-4 bg-blue-50 rounded-lg">
                    <p class="text-blue-800 font-medium">${instructions}</p>
                </div>
                
                <div class="mb-6">
                    <h4 class="font-semibold mb-2">📋 복사된 설정 내용:</h4>
                    <pre class="code-preview p-4 text-sm overflow-auto max-h-60">${content}</pre>
                </div>
                
                <div class="mb-6 p-4 bg-green-50 rounded-lg">
                    <h4 class="font-semibold text-green-800 mb-2">✅ 적용 단계:</h4>
                    <ol class="list-decimal list-inside space-y-2 text-green-700">
                        <li>Cursor IDE를 열고 프로젝트 루트로 이동</li>
                        <li>.cursor-rules 파일을 생성하거나 열기</li>
                        <li>복사된 내용을 파일에 붙여넣기</li>
                        <li>파일을 저장하고 Cursor 재시작</li>
                        <li>이제 AI가 설정된 역할로 동작합니다!</li>
                    </ol>
                </div>
                
                <div class="flex justify-end">
                    <button class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                            onclick="this.closest('.fixed').remove()">
                        이해했습니다 👍
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
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
        
        // 애니메이션
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);
        
        // 자동 제거
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// 전역 인스턴스 생성
let vibeBuilder;

// DOM 로드 완료 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    vibeBuilder = new VibeAgentBuilder();
});

console.log('🚀 Vibe Agent Builder v1.0.0 로드 완료!');
console.log('📧 Contact: infrastructure@kakao.com');
console.log('📞 Phone: 010-9143-0800');
console.log('🏢 한국인프라연구원(주)');