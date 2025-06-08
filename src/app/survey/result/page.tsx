"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';

type RiskAssessment = {
    level: '낮음' | '중간' | '높음';
    reasons: string[];
    warning_signs: string[];
};

type FutureScenario = {
    short_term: string;
    mid_term: string;
    long_term: string;
    key_milestones?: string[];
    key_warnings?: string[];
};

type PreventionAdvice = {
    immediate_actions: string[];
    long_term_strategies: string[];
    support_resources: string[];
};

type AnalysisResult = {
    risk_assessment: RiskAssessment;
    future_scenarios: {
        positive_future: FutureScenario;
        negative_future: FutureScenario;
    };
    prevention_advice: PreventionAdvice;
};

type SurveyResult = {
    answers: {
        '1': string;
        '2': { age: number; grade: string };
        '3': { value: string; other?: string };
        '4': string[];
        '5': string;
        '6': string[];
        '7': string;
        '8': string;
        '9': string;
        '10': string;
    };
    metadata: {
        submittedAt: string;
        totalQuestions: number;
        completedQuestions: number;
    };
    nickname: string;
    analysis?: AnalysisResult;
};

// 답변 텍스트 매핑
const answerTexts: Record<string, Record<string, string>> = {
    '1': {
        'male': '남성',
        'female': '여성',
        'none': '선택 안함'
    },
    '3': {
        'athlete': '운동선수',
        'doctor': '의사',
        'teacher': '교사',
        'celebrity': '연예인',
        'developer': '개발자',
        'police': '경찰',
        'chef': '요리사',
        'other': '기타'
    },
    '4': {
        'game': '게임',
        'sports': '운동',
        'drawing': '그림',
        'music': '음악',
        'reading': '책 읽기',
        'sns': 'SNS',
        'youtube': '유튜브 시청',
        'friends': '친구와 놀기',
        'other': '기타'
    },
    '5': {
        'less1': '1시간 미만',
        '1to3': '1~3시간',
        '3to5': '3~5시간',
        'more5': '5시간 이상'
    },
    '6': {
        'lonely': '외로움',
        'anxious': '불안',
        'happy': '행복',
        'angry': '분노',
        'helpless': '무기력',
        'excited': '설렘',
        'confident': '자신감',
        'other': '기타'
    },
    '7': {
        'none': '없음',
        'talk': '친구와 이야기하기',
        'game': '게임하기',
        'alone': '혼자 있기',
        'exercise': '운동하기',
        'sns': 'SNS하기',
        'cry': '울거나 폭발하기'
    },
    '8': {
        'very_bad': '매우 나쁘고 위험하다고 생각한다',
        'curious': '궁금하긴 하지만 하지 않을 것이다',
        'okay': '해도 큰 문제는 없을 것 같다',
        'dont_know': '잘 모르겠다'
    },
    '9': {
        'dont_know': '모르겠다',
        'refuse': '거절한다',
        'accept': '수락한다',
        'consider': '고민한다'
    }
};

// 질문 텍스트 매핑
const questionTexts: Record<string, string> = {
    '1': '성별',
    '2': '나이와 학년',
    '3': '장래희망',
    '4': '취미',
    '5': '스마트폰 사용 시간',
    '6': '자주 느끼는 감정',
    '7': '스트레스 해소 방법',
    '8': '마약에 대한 의견',
    '9': '마약 권유 시 대응 방법',
    '10': '미래에 대한 생각'
};

const RiskLevelBadge = ({ level }: { level: RiskAssessment['level'] }) => {
    const colors = {
        '낮음': 'bg-green-50 text-green-900 border-green-200',
        '중간': 'bg-yellow-50 text-yellow-900 border-yellow-200',
        '높음': 'bg-red-50 text-red-900 border-red-200'
    };

    const icons = {
        '낮음': '✅',
        '중간': '⚠️',
        '높음': '❗'
    };

    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold border ${colors[level]} shadow-sm`}
        >
            <span className="mr-2">{icons[level]}</span>
            {level} 위험도
        </motion.div>
    );
};

const ScenarioCard = ({ title, scenario, type }: { title: string; scenario: FutureScenario; type: 'positive' | 'negative' }) => {
    const bgColor = type === 'positive' 
        ? 'bg-gradient-to-br from-blue-50 to-indigo-50' 
        : 'bg-gradient-to-br from-red-50 to-pink-50';
    const borderColor = type === 'positive' 
        ? 'border-blue-100/50' 
        : 'border-red-100/50';
    const icon = type === 'positive' ? '🌟' : '⚠️';

    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={`${bgColor} rounded-3xl p-8 space-y-6 border ${borderColor} shadow-2xl backdrop-blur-sm`}
        >
            <div className="flex items-center space-x-3">
                <span className="text-2xl">{icon}</span>
                <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            </div>
            <div className="space-y-6">
                <div className="bg-white/80 rounded-2xl p-6">
                    <h4 className="font-bold mb-3 text-gray-900">단기 (1-2년)</h4>
                    <p className="text-gray-800 leading-relaxed">{scenario.short_term}</p>
                </div>
                <div className="bg-white/80 rounded-2xl p-6">
                    <h4 className="font-bold mb-3 text-gray-900">중기 (3-5년)</h4>
                    <p className="text-gray-800 leading-relaxed">{scenario.mid_term}</p>
                </div>
                <div className="bg-white/80 rounded-2xl p-6">
                    <h4 className="font-bold mb-3 text-gray-900">장기 (10년)</h4>
                    <p className="text-gray-800 leading-relaxed">{scenario.long_term}</p>
                </div>
                {scenario.key_milestones && (
                    <div className="bg-white/80 rounded-2xl p-6">
                        <h4 className="font-bold mb-3 text-gray-900">주요 성취</h4>
                        <ul className="space-y-3">
                            {scenario.key_milestones.map((milestone, index) => (
                                <motion.li
                                    key={index}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-start space-x-3 text-gray-800"
                                >
                                    <span className="text-blue-500">•</span>
                                    <span>{milestone}</span>
                                </motion.li>
                            ))}
                        </ul>
                    </div>
                )}
                {scenario.key_warnings && (
                    <div className="bg-white/80 rounded-2xl p-6">
                        <h4 className="font-bold mb-3 text-gray-900">주요 경고</h4>
                        <ul className="space-y-3">
                            {scenario.key_warnings.map((warning, index) => (
                                <motion.li
                                    key={index}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-start space-x-3 text-gray-800"
                                >
                                    <span className="text-red-500">•</span>
                                    <span>{warning}</span>
                                </motion.li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

const AdviceCard = ({ advice }: { advice: PreventionAdvice }) => (
    <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white/95 backdrop-blur-md rounded-3xl p-8 space-y-8 border border-white/50 shadow-2xl"
    >
        <div className="space-y-6">
            <div className="flex items-center space-x-3">
                <span className="text-2xl">💡</span>
                <h3 className="text-xl font-bold text-gray-900">즉시 취할 수 있는 행동</h3>
            </div>
            <ul className="grid gap-3">
                {advice.immediate_actions?.map((action, index) => (
                    <motion.li
                        key={index}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start space-x-3 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100/50"
                    >
                        <span className="text-blue-500">•</span>
                        <span className="text-gray-800">{action}</span>
                    </motion.li>
                ))}
            </ul>
        </div>
        <div className="space-y-6">
            <div className="flex items-center space-x-3">
                <span className="text-2xl">🎯</span>
                <h3 className="text-xl font-bold text-gray-900">장기적인 예방 전략</h3>
            </div>
            <ul className="grid gap-3">
                {advice.long_term_strategies?.map((strategy, index) => (
                    <motion.li
                        key={index}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start space-x-3 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100/50"
                    >
                        <span className="text-blue-500">•</span>
                        <span className="text-gray-800">{strategy}</span>
                    </motion.li>
                ))}
            </ul>
        </div>
        {advice.support_resources && advice.support_resources.length > 0 && (
            <div className="space-y-6">
                <div className="flex items-center space-x-3">
                    <span className="text-2xl">🤝</span>
                    <h3 className="text-xl font-bold text-gray-900">도움을 받을 수 있는 자원</h3>
                </div>
                <ul className="grid gap-3">
                    {advice.support_resources.map((resource, index) => (
                        <motion.li
                            key={index}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start space-x-3 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100/50"
                        >
                            <span className="text-blue-500">•</span>
                            <span className="text-gray-800">{resource}</span>
                        </motion.li>
                    ))}
                </ul>
            </div>
        )}
    </motion.div>
);

export default function ResultPage() {
    const searchParams = useSearchParams();
    const [result, setResult] = useState<SurveyResult | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth - 0.5) * 20,
                y: (e.clientY / window.innerHeight - 0.5) * 20,
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useEffect(() => {
        const data = searchParams.get('data');
        if (data) {
            try {
                const parsedData = JSON.parse(decodeURIComponent(data));
                setResult(parsedData);
            } catch (error) {
                console.error('Failed to parse survey data:', error);
            }
        }
        setIsLoading(false);
    }, [searchParams]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-white via-purple-50/80 to-indigo-50/80 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
            </div>
        );
    }

    if (!result) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-white via-purple-50/80 to-indigo-50/80 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">결과를 찾을 수 없습니다</h1>
                    <p className="text-gray-600">설문을 다시 진행해주세요.</p>
                </div>
            </div>
        );
    }

    const formatAnswer = (questionId: string, answer: any): string => {
        if (answer === undefined || answer === null) {
            return '답변 없음';
        }

        switch (questionId) {
            case '1':
            case '5':
            case '7':
            case '8':
            case '9':
                // 단일 선택 답변
                const singleAnswer = answerTexts[questionId]?.[answer];
                return singleAnswer || '답변 없음';

            case '2':
                // 나이와 학년
                if (typeof answer === 'object' && answer !== null) {
                    const { age, grade } = answer;
                    if (age && grade) {
                        return `${age}세, ${grade}`;
                    }
                }
                return '답변 없음';

            case '3':
                // 장래희망
                if (typeof answer === 'object' && answer !== null) {
                    const { value, other } = answer;
                    if (!value) return '답변 없음';
                    
                    const displayValue = answerTexts[questionId]?.[value];
                    if (!displayValue) return '답변 없음';
                    
                    return other ? `${displayValue} (${other})` : displayValue;
                }
                return '답변 없음';

            case '4':
            case '6':
                // 다중 선택 답변
                if (Array.isArray(answer) && answer.length > 0) {
                    const formattedAnswers = answer
                        .filter(a => a) // 빈 값 제거
                        .map(a => {
                            if (a.startsWith('other:')) {
                                const otherValue = a.split(':')[1];
                                return otherValue ? `기타 (${otherValue})` : '기타';
                            }
                            return answerTexts[questionId]?.[a] || a;
                        })
                        .filter(a => a !== '답변 없음'); // 잘못된 매핑 제거

                    return formattedAnswers.length > 0 
                        ? formattedAnswers.join(', ') 
                        : '답변 없음';
                }
                return '답변 없음';

            case '10':
                // 텍스트 답변
                return typeof answer === 'string' && answer.trim() 
                    ? answer.trim() 
                    : '답변 없음';

            default:
                return '답변 없음';
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-b from-white via-blue-50/80 to-indigo-50/80 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background container */}
            <div className="fixed inset-0 w-full h-full pointer-events-none">
                {/* Large floating patterns */}
                <div 
                    className="absolute -top-40 -left-40 w-[800px] h-[800px] bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full mix-blend-normal filter blur-[100px] opacity-40"
                    style={{ transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)` }}
                />
                <div 
                    className="absolute -bottom-40 -right-40 w-[800px] h-[800px] bg-gradient-to-tr from-violet-200 to-purple-200 rounded-full mix-blend-normal filter blur-[100px] opacity-40"
                    style={{ transform: `translate(${-mousePosition.x * 0.5}px, ${-mousePosition.y * 0.5}px)` }}
                />
                
                {/* Medium animated patterns */}
                <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-gradient-to-r from-sky-200 to-cyan-200 rounded-full mix-blend-normal filter blur-[80px] opacity-30 animate-float" />
                <div className="absolute bottom-1/3 right-1/4 w-[600px] h-[600px] bg-gradient-to-l from-indigo-200 to-violet-200 rounded-full mix-blend-normal filter blur-[80px] opacity-30 animate-float-delayed" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto space-y-8">
                {/* 헤더 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/50 p-8 text-center"
                >
                    <div className="space-y-4">
                        <div className="text-center space-y-1">
                            <p className="text-blue-600 font-medium">분석 결과</p>
                            <div className="h-0.5 w-10 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full mx-auto" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            {result.nickname}님의{' '}
                            <span className="relative inline-block">
                                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400">
                                    미래 분석
                                </span>
                                <span className="absolute bottom-0 left-0 w-full h-2 bg-blue-100/50 -rotate-1 transform -z-0" />
                            </span>
                        </h1>
                        <p className="text-blue-600">
                            설문 완료 시간: {new Date(result.metadata.submittedAt).toLocaleString()}
                        </p>
                    </div>
                </motion.div>

                {/* 분석 결과 */}
                {result.analysis && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="space-y-8"
                    >
                        {/* 위험도 평가 */}
                        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/50">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold tracking-tight text-gray-900">위험도 평가</h2>
                                <RiskLevelBadge level={result.analysis.risk_assessment.level} />
                            </div>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100/50">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                        <span className="mr-2">📊</span>
                                        평가 근거
                                    </h3>
                                    <ul className="space-y-3">
                                        {result.analysis.risk_assessment.reasons.map((reason, index) => (
                                            <motion.li
                                                key={index}
                                                initial={{ x: -20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="flex items-start space-x-3 text-gray-800 bg-white/80 p-3 rounded-xl"
                                            >
                                                <span className="text-blue-500">•</span>
                                                <span>{reason}</span>
                                            </motion.li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 border border-red-100/50">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                        <span className="mr-2">⚠️</span>
                                        주의해야 할 징후
                                    </h3>
                                    <ul className="space-y-3">
                                        {result.analysis.risk_assessment.warning_signs.map((sign, index) => (
                                            <motion.li
                                                key={index}
                                                initial={{ x: -20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="flex items-start space-x-3 text-gray-800 bg-white/80 p-3 rounded-xl"
                                            >
                                                <span className="text-red-500">•</span>
                                                <span>{sign}</span>
                                            </motion.li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* 미래 시나리오 */}
                        <div className="grid gap-8 md:grid-cols-2">
                            <ScenarioCard
                                title="긍정적인 미래"
                                scenario={result.analysis.future_scenarios.positive_future}
                                type="positive"
                            />
                            <ScenarioCard
                                title="부정적인 미래"
                                scenario={result.analysis.future_scenarios.negative_future}
                                type="negative"
                            />
                        </div>

                        {/* 예방 조언 */}
                        <AdviceCard advice={result.analysis.prevention_advice} />
                    </motion.div>
                )}

                {/* 상담 안내 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 rounded-3xl p-8 text-white shadow-2xl"
                >
                    <div className="flex items-center space-x-3 mb-6">
                        <span className="text-2xl">📞</span>
                        <h2 className="text-2xl font-bold">상담 안내</h2>
                    </div>
                    <p className="text-blue-100 mb-6">
                        마약 중독에 대한 상담이 필요하시다면, 용산경찰서 마약팀으로 연락주세요.
                        전문 상담원이 도움을 드리겠습니다.
                    </p>
                    <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-lg font-semibold">용산경찰서 마약팀</p>
                                <p className="text-2xl font-bold mt-2">02-XXX-XXXX</p>
                            </div>
                            <span className="text-4xl">📱</span>
                        </div>
                    </div>
                </motion.div>

                {/* 다시 검사하기 버튼 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="text-center"
                >
                    <button
                        onClick={() => window.location.href = '/survey'}
                        className="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 hover:from-blue-500 hover:via-indigo-500 hover:to-violet-500 transition-all duration-300 text-white font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        <span className="relative flex items-center gap-2">
                            다시 검사하기 ✨
                        </span>
                        <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>
                </motion.div>
            </div>
        </main>
    );
}