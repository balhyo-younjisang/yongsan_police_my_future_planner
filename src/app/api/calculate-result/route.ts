import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// 환경 변수 설정
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// 감정과 동물 목록
const emotions = [
    "행복한", "우울한", "분노한", "설레는", "지친", "심심한", "짜증난", "흥분한", "차분한",
    "기쁜", "슬픈", "두려운", "놀란", "안도한", "외로운", "무기력한", "용감한", "지루한", "감사한",
    "부끄러운", "짜릿한", "활기찬", "불안한", "평온한", "혼란스러운", "열정적인", "피곤한", "행운의",
    "의기양양한", "억울한", "걱정스러운", "서운한", "감동한", "냉정한", "짜증스러운", "신나는", "긴장한",
    "고마운", "당황한", "안타까운", "편안한", "의심스러운", "무서운", "자신감있는", "기대하는", "자유로운",
    "설득력있는", "상쾌한", "유쾌한", "상심한", "순수한", "매혹적인", "따뜻한", "냉담한", "우쭐한",
    "침착한", "화가난", "자랑스러운", "분명한", "감사하는", "불편한", "의욕적인", "감정적인", "평화로운",
    "후회하는", "감탄하는", "사랑스러운", "집중하는", "경쾌한", "복잡한", "명랑한", "신비로운", "활발한",
    "현명한", "도전적인", "결단력있는", "섬세한", "단호한", "기민한", "똑똑한", "유능한", "사려깊은",
    "따분한", "포근한", "풍부한", "조용한", "담대한", "풍요로운", "은은한", "자비로운", "정직한", "성실한",
    "겸손한", "대담한", "명확한", "순진한", "다정한"
];

const animals = [
    "고양이", "강아지", "토끼", "너구리", "판다", "고슴도치", "부엉이", "기린", "곰",
    "여우", "하마", "코끼리", "사자", "늑대", "펭귄", "다람쥐", "호랑이", "수달", "카멜레온"
];

// 닉네임 생성 함수
function generateNickname(): string {
    const emotion = emotions[Math.floor(Math.random() * emotions.length)];
    const animal = animals[Math.floor(Math.random() * animals.length)];
    return `${emotion} ${animal}`;
}

// 닉네임 생성 API
export async function GET() {
    const nickname = generateNickname();
    return NextResponse.json({ nickname });
}

// 분석 결과 계산 API
export async function POST(request: Request) {
    try {
        const data = await request.json();
        const formData = data.formData || {};
        const answers = data.answers || [];

        // ChatGPT 프롬프트 생성
        const prompt = `
        다음은 한 청소년의 설문 응답입니다. 이 데이터를 바탕으로 마약 중독 위험도와 미래 시나리오를 분석해주세요.

        사용자 정보:
        - 성별: ${formData['1'] || 'N/A'}
        - 나이/학년: ${formData['2']?.age || 'N/A'}세, ${formData['2']?.grade || 'N/A'}
        - 희망 직업: ${formData['3']?.value || 'N/A'}
        - 취미: ${Array.isArray(formData['4']) ? formData['4'].join(', ') : 'N/A'}
        - 친구 수: ${formData['5'] || 'N/A'}
        - 현재 감정 상태: ${Array.isArray(formData['6']) ? formData['6'].join(', ') : 'N/A'}
        - 주로 시간을 보내는 방식: ${formData['7'] || 'N/A'}
        - 현재 삶의 만족도: ${formData['8'] || 'N/A'}
        - 미래에 대한 확신: ${formData['9'] || 'N/A'}
        - 미래에 대한 희망: ${formData['10'] || 'N/A'}

        다음 형식의 JSON으로 응답해주세요:
        {
            "risk_assessment": {
                "level": "낮음/중간/높음",
                "reasons": ["이유1", "이유2", "이유3"],
                "warning_signs": ["주의해야 할 징후1", "주의해야 할 징후2"]
            },
            "future_scenarios": {
                "positive_future": {
                    "short_term": "1-2년 후의 긍정적인 미래 모습 (구체적인 일상, 성취, 관계 등)",
                    "mid_term": "3-5년 후의 긍정적인 미래 모습 (진로, 성장, 목표 달성 등)",
                    "long_term": "10년 후의 긍정적인 미래 모습 (꿈을 이룬 모습, 가족, 사회적 성취 등)",
                    "key_milestones": ["주요 성취1", "주요 성취2", "주요 성취3"]
                },
                "negative_future": {
                    "short_term": "마약 중독 시 1-2년 후의 모습 (신체적, 정신적, 사회적 영향)",
                    "mid_term": "마약 중독 시 3-5년 후의 모습 (건강, 관계, 경제적 문제 등)",
                    "long_term": "마약 중독 시 10년 후의 모습 (회복이 어려운 상태, 가족 관계 파탄 등)",
                    "key_warnings": ["주요 경고1", "주요 경고2", "주요 경고3"]
                }
            },
            "prevention_advice": {
                "immediate_actions": ["즉시 취할 수 있는 예방 행동1", "즉시 취할 수 있는 예방 행동2"],
                "long_term_strategies": ["장기적인 예방 전략1", "장기적인 예방 전략2"]
            }
        }

        다음 지침을 따라주세요:
        1. 각 시나리오는 구체적이고 현실적으로 묘사해주세요.
        2. 긍정적인 미래는 사용자의 현재 희망과 목표를 반영하여 밝고 희망적인 톤으로 작성해주세요.
        3. 부정적인 미래는 충격적이되, 과장되지 않게 현실적으로 묘사해주세요.
        4. 모든 내용은 공감적이고 전문적인 톤으로 작성해주세요.
        5. 응답은 반드시 위의 JSON 형식을 정확히 따르되, 각 필드의 내용은 한국어로 작성해주세요.
        `;

        // ChatGPT API 호출
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "당신은 청소년 마약 예방 전문가이자 상담사입니다. 사용자의 응답을 분석하여 마약 중독의 위험성과 예방 방법을 효과적으로 전달합니다. 응답은 반드시 요청된 JSON 형식을 따라야 합니다."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 2000,
            response_format: { type: "json_object" }
        });

        // 응답 파싱 및 유효성 검사
        const content = response.choices[0]?.message?.content;
        if (!content) {
            throw new Error('No content received from OpenAI API');
        }

        let analysis;
        try {
            analysis = JSON.parse(content);
        } catch (parseError) {
            throw new Error('Failed to parse OpenAI response as JSON');
        }

        return NextResponse.json({
            status: "success",
            data: analysis
        });

    } catch (error) {
        console.error('Error in calculate-result:', error);
        return NextResponse.json(
            { 
                status: "error", 
                message: error instanceof Error ? error.message : "Unknown error occurred" 
            },
            { status: 500 }
        );
    }
} 