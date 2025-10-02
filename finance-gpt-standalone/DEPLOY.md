# 🚀 FinanceGPT 배포 가이드

## 📋 프로젝트 개요
- **이름**: FinanceGPT - 박사급 금융 컨설팅 AI
- **타겟**: VIP 고객 전용 통합 자산관리 솔루션
- **기술스택**: Hono + TypeScript + Cloudflare Pages

## 🏗️ 로컬 개발 환경 설정

### 1. 의존성 설치
```bash
cd finance-gpt-standalone
npm install
```

### 2. 개발 서버 실행
```bash
# 빌드
npm run build

# PM2로 개발 서버 시작
pm2 start ecosystem.config.cjs

# 서버 확인
curl http://localhost:3001
```

### 3. 로그 확인
```bash
pm2 logs finance-gpt --nostream
```

## ☁️ Cloudflare Pages 배포

### 1. Cloudflare API 키 설정
```bash
# Cloudflare 인증 설정
wrangler whoami
```

### 2. 프로젝트 생성
```bash
npx wrangler pages project create finance-gpt \
  --production-branch main \
  --compatibility-date 2024-01-01
```

### 3. 배포 실행
```bash
# 빌드 & 배포
npm run build
npx wrangler pages deploy dist --project-name finance-gpt
```

## 🔧 주요 구성 파일

### package.json
- Hono 프레임워크 기반
- Cloudflare Workers 타입
- TypeScript 지원

### wrangler.jsonc
- Cloudflare Pages 설정
- 호환성 플래그
- 빌드 출력 디렉토리

### ecosystem.config.cjs
- PM2 프로세스 관리
- 포트 3001 사용
- 개발 환경 전용

## 📊 API 엔드포인트

### 포트폴리오 분석
```
POST /api/portfolio-analysis
{
  "amount": 1000000000,
  "riskLevel": "moderate",
  "age": 45,
  "goals": "VIP 자산관리"
}
```

### 절세 최적화
```
POST /api/tax-optimization
{
  "income": 500000000,
  "assets": 2000000000,
  "familyStatus": "married"
}
```

### VIP 컨설팅
```
POST /api/vip-consultation
{
  "goal": "통합 자산관리 전략 수립"
}
```

## 🎨 프론트엔드 기능

### 핵심 컴포넌트
- **VIP 대시보드**: 실시간 자산 현황
- **포트폴리오 분석기**: Chart.js 기반 시각화
- **절세 계산기**: 3단계 전략 제시
- **컨설팅 챗**: AI 기반 상담

### 스타일링
- **TailwindCSS**: 반응형 디자인
- **커스텀 CSS**: VIP 테마, 골드 그라데이션
- **Chart.js**: 포트폴리오 도넛 차트
- **폰트어썸**: 프리미엄 아이콘

## 🔐 보안 및 성능

### 보안 기능
- CORS 설정
- 입력값 검증
- 민감정보 보호

### 성능 최적화
- Cloudflare Edge 배포
- 정적 파일 CDN 캐싱
- 컴포넌트 지연 로딩

## 📱 지원 기기
- 데스크톱 (1024px+)
- 태블릿 (768px-1023px)
- 모바일 (320px-767px)

## 🐛 문제 해결

### 포트 충돌
```bash
npm run clean-port
pm2 delete finance-gpt
```

### 빌드 오류
```bash
rm -rf dist node_modules
npm install
npm run build
```

### 배포 실패
```bash
wrangler whoami
npx wrangler pages project list
```

## 📞 기술 지원
- **개발사**: 한국인프라연구원(주)
- **이메일**: infrastructure@kakao.com
- **연락처**: 010-9143-0800

---
*박사급 전문성이 구현된 VIP 전용 금융 AI 플랫폼*