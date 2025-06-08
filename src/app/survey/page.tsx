"use client";

import { useEffect, useState } from "react";

type Question = {
    id: number;
    text: string;
    type: 'single' | 'multiple' | 'text' | 'number';
    options?: {
        value: string;
        text: string;
        isOther?: boolean;
    }[];
    placeholder?: string;
    required?: boolean;
};

const questions: Question[] = [
    {
        id: 1,
        text: "성별을 선택해주세요",
        type: 'single',
        options: [
            { value: "male", text: "남성" },
            { value: "female", text: "여성" },
            { value: "none", text: "선택 안함" }
        ],
        required: true
    },
    {
        id: 2,
        text: "나이와 현재 소속을 알려주세요",
        type: 'number',
        placeholder: "나이를 입력해주세요 (예: 14)",
        required: true
    },
    {
        id: 3,
        text: "관심 있는 직업 또는 장래희망은 무엇인가요?",
        type: 'single',
        options: [
            { value: "athlete", text: "운동선수" },
            { value: "doctor", text: "의사" },
            { value: "teacher", text: "교사" },
            { value: "celebrity", text: "연예인" },
            { value: "developer", text: "개발자" },
            { value: "police", text: "경찰" },
            { value: "chef", text: "요리사" },
            { value: "other", text: "기타", isOther: true }
        ],
        required: true
    },
    {
        id: 4,
        text: "평소 자주 하는 취미나 활동은 무엇인가요? (복수 선택 가능)",
        type: 'multiple',
        options: [
            { value: "game", text: "게임" },
            { value: "sports", text: "운동" },
            { value: "drawing", text: "그림" },
            { value: "music", text: "음악" },
            { value: "reading", text: "책 읽기" },
            { value: "sns", text: "SNS" },
            { value: "youtube", text: "유튜브 시청" },
            { value: "friends", text: "친구와 놀기" },
            { value: "other", text: "기타", isOther: true }
        ],
        required: true
    },
    {
        id: 5,
        text: "하루에 스마트폰을 사용하는 시간은 몇 시간 정도인가요?",
        type: 'single',
        options: [
            { value: "less1", text: "1시간 미만" },
            { value: "1to3", text: "1~3시간" },
            { value: "3to5", text: "3~5시간" },
            { value: "more5", text: "5시간 이상" }
        ],
        required: true
    },
    {
        id: 6,
        text: "평소 어떤 감정을 자주 느끼나요? (복수 선택 가능)",
        type: 'multiple',
        options: [
            { value: "lonely", text: "외로움" },
            { value: "anxious", text: "불안" },
            { value: "happy", text: "행복" },
            { value: "angry", text: "분노" },
            { value: "helpless", text: "무기력" },
            { value: "excited", text: "설렘" },
            { value: "confident", text: "자신감" },
            { value: "other", text: "기타", isOther: true }
        ],
        required: true
    },
    {
        id: 7,
        text: "스트레스를 받을 때 주로 어떻게 해소하나요?",
        type: 'single',
        options: [
            { value: "talk", text: "친구와 이야기한다" },
            { value: "game", text: "게임을 한다" },
            { value: "alone", text: "혼자 있는다" },
            { value: "exercise", text: "운동한다" },
            { value: "sns", text: "SNS를 본다" },
            { value: "cry", text: "울거나 폭발한다" },
            { value: "none", text: "해소 방법이 없다" }
        ],
        required: true
    },
    {
        id: 8,
        text: "평소 마약, 흡입제, 위험한 약물 등에 대해 어떻게 생각하나요?",
        type: 'single',
        options: [
            { value: "very_bad", text: "매우 나쁘고 위험하다고 생각한다" },
            { value: "curious", text: "궁금하긴 하지만 하지 않을 것이다" },
            { value: "okay", text: "해도 큰 문제는 없을 것 같다" },
            { value: "dont_know", text: "잘 모르겠다" }
        ],
        required: true
    },
    {
        id: 9,
        text: "마약을 권유받는다면 어떻게 할 것 같나요?",
        type: 'single',
        options: [
            { value: "refuse", text: "단호히 거절한다" },
            { value: "consider", text: "고민할 것 같다" },
            { value: "try", text: "한 번쯤 해볼지도 모르겠다" },
            { value: "dont_know", text: "모르겠다" }
        ],
        required: true
    },
    {
        id: 10,
        text: "미래의 나에 대해 어떤 기대를 가지고 있나요?",
        type: 'text',
        placeholder: "예시: 나는 선생님이 되고 싶고, 아이들을 가르치며 행복하게 살고 싶다.",
        required: true
    }
];

type ValidationError = {
    message: string;
    type: 'required' | 'invalid' | 'length' | 'range';
};

const validateAnswer = (question: Question, answer: any, otherInput?: string): ValidationError | null => {
    // 필수 입력 검사
    if (question.required && (
        answer === undefined || 
        answer === null || 
        answer === '' || 
        (Array.isArray(answer) && answer.length === 0)
    )) {
        return {
            message: '이 문항은 필수로 답변해주세요.',
            type: 'required'
        };
    }

    // 문항 타입별 유효성 검사
    switch (question.type) {
        case 'number':
            const num = Number(answer);
            if (isNaN(num)) {
                return {
                    message: '올바른 숫자를 입력해주세요.',
                    type: 'invalid'
                };
            }
            if (num < 10 || num > 20) {
                return {
                    message: '10세에서 20세 사이의 나이를 입력해주세요.',
                    type: 'range'
                };
            }
            break;

        case 'text':
            if (answer.length < 10) {
                return {
                    message: '10자 이상 입력해주세요.',
                    type: 'length'
                };
            }
            if (answer.length > 500) {
                return {
                    message: '500자 이내로 입력해주세요.',
                    type: 'length'
                };
            }
            break;

        case 'multiple':
            if (answer.length > 5) {
                return {
                    message: '최대 5개까지만 선택 가능합니다.',
                    type: 'range'
                };
            }
            break;

        case 'single':
            if (answer === 'other' && (!otherInput || otherInput.trim().length === 0)) {
                return {
                    message: '기타 항목을 선택하셨다면 내용을 입력해주세요.',
                    type: 'required'
                };
            }
            break;
    }

    return null;
};

export default function SurveyPage() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [showResult, setShowResult] = useState(false);
    const [otherInputs, setOtherInputs] = useState<Record<string, string>>({});
    const [errors, setErrors] = useState<Record<number, ValidationError>>({});
    const [showError, setShowError] = useState(false);

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

    const handleAnswer = (value: any) => {
        const question = questions[currentStep];
        const newAnswers = { ...answers };
        
        if (question.type === 'multiple') {
            newAnswers[question.id] = newAnswers[question.id] || [];
            const index = newAnswers[question.id].indexOf(value);
            if (index === -1) {
                newAnswers[question.id].push(value);
            } else {
                newAnswers[question.id].splice(index, 1);
            }
        } else {
            newAnswers[question.id] = value;
        }
        
        setAnswers(newAnswers);
        
        // 답변 변경 시 해당 문항의 에러 메시지 제거
        if (errors[question.id]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[question.id];
                return newErrors;
            });
        }
    };

    const handleOtherInput = (questionId: number, value: string) => {
        setOtherInputs(prev => ({
            ...prev,
            [questionId]: value
        }));

        // 기타 입력 변경 시 해당 문항의 에러 메시지 제거
        if (errors[questionId]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[questionId];
                return newErrors;
            });
        }
    };

    const handleNext = () => {
        if (!validateCurrentStep()) {
            return;
        }

        if (currentStep < questions.length - 1) {
            setCurrentStep(currentStep + 1);
            setShowError(false);
        } else {
            setShowResult(true);
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const validateCurrentStep = (): boolean => {
        const question = questions[currentStep];
        const currentAnswer = answers[question.id];
        const otherInput = otherInputs[question.id];
        
        const error = validateAnswer(question, currentAnswer, otherInput);
        
        if (error) {
            setErrors(prev => ({
                ...prev,
                [question.id]: error
            }));
            setShowError(true);
            return false;
        }
        
        return true;
    };

    const renderQuestion = () => {
        const question = questions[currentStep];
        const currentAnswer = answers[question.id];
        const error = errors[question.id];

        return (
            <div className="space-y-6 animate-fade-in-up">
                <div className="text-center">
                    <div className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-4">
                        {currentStep + 1} / {questions.length}
                    </div>
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
                        {question.text}
                        {question.required && <span className="text-red-500 ml-1">*</span>}
                    </h2>
                </div>

                <div className="space-y-4">
                    {error && showError && (
                        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm animate-shake">
                            {error.message}
                        </div>
                    )}

                    {question.type === 'text' && (
                        <div className="space-y-2">
                            <textarea
                                value={currentAnswer || ''}
                                onChange={(e) => handleAnswer(e.target.value)}
                                placeholder={question.placeholder}
                                className={`w-full p-4 rounded-xl bg-white border transition-all duration-200 min-h-[120px] resize-none ${
                                    error && showError
                                        ? 'border-red-300 focus:border-red-400 focus:ring-red-200'
                                        : 'border-gray-200 focus:border-blue-400 focus:ring-blue-200'
                                }`}
                            />
                            <div className="text-sm text-gray-500 text-right">
                                {currentAnswer?.length || 0}/500자
                            </div>
                        </div>
                    )}

                    {question.type === 'number' && (
                        <div className="space-y-4">
                            <input
                                type="number"
                                value={currentAnswer || ''}
                                onChange={(e) => handleAnswer(e.target.value)}
                                placeholder={question.placeholder}
                                className={`w-full p-4 rounded-xl bg-white border transition-all duration-200 ${
                                    error && showError
                                        ? 'border-red-300 focus:border-red-400 focus:ring-red-200'
                                        : 'border-gray-200 focus:border-blue-400 focus:ring-blue-200'
                                }`}
                            />
                            <div className="grid grid-cols-3 gap-3">
                                {['초등학생', '중학생', '고등학생'].map((grade) => (
                                    <button
                                        key={grade}
                                        onClick={() => handleAnswer(grade)}
                                        className={`p-4 rounded-xl bg-white border transition-all duration-200 ${
                                            currentAnswer === grade
                                                ? 'border-blue-400 bg-blue-50 text-blue-600'
                                                : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                                        }`}
                                    >
                                        {grade}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {(question.type === 'single' || question.type === 'multiple') && (
                        <div className="grid gap-3">
                            {question.options?.map((option) => (
                                <div key={option.value} className="space-y-2">
                                    <button
                                        onClick={() => handleAnswer(option.value)}
                                        className={`w-full p-4 rounded-xl bg-white border transition-all duration-200 text-left group ${
                                            (question.type === 'single' && currentAnswer === option.value) ||
                                            (question.type === 'multiple' && currentAnswer?.includes(option.value))
                                                ? 'border-blue-400 bg-blue-50 text-blue-600'
                                                : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                                        }`}
                                    >
                                        <span className="font-medium">{option.text}</span>
                                    </button>
                                    {option.isOther && 
                                        ((question.type === 'single' && currentAnswer === option.value) ||
                                         (question.type === 'multiple' && currentAnswer?.includes(option.value))) && (
                                        <input
                                            type="text"
                                            value={otherInputs[question.id] || ''}
                                            onChange={(e) => handleOtherInput(question.id, e.target.value)}
                                            placeholder="직접 입력해주세요"
                                            className={`w-full p-3 rounded-lg bg-white border transition-all duration-200 ${
                                                error && showError && option.value === 'other'
                                                    ? 'border-red-300 focus:border-red-400 focus:ring-red-200'
                                                    : 'border-gray-200 focus:border-blue-400 focus:ring-blue-200'
                                            }`}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex justify-between pt-6">
                    <button
                        onClick={handlePrev}
                        disabled={currentStep === 0}
                        className={`px-6 py-3 rounded-xl transition-all duration-200 ${
                            currentStep === 0
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-white border border-gray-200 hover:border-blue-400 hover:bg-blue-50 text-gray-700'
                        }`}
                    >
                        이전
                    </button>
                    <button
                        onClick={handleNext}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 hover:from-blue-500 hover:via-indigo-500 hover:to-violet-500 transition-all duration-300 text-white font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        {currentStep === questions.length - 1 ? '제출하기' : '다음'}
                    </button>
                </div>
            </div>
        );
    };

    const renderResult = () => {
        return (
            <div className="space-y-6 animate-fade-in-up">
                <div className="text-center">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
                        설문이 완료되었습니다
                    </h2>
                    <p className="text-gray-600 mb-8">
                        소중한 의견 감사합니다. 여러분의 응답은 마약 중독 예방을 위한 중요한 자료로 활용됩니다.
                    </p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">상담 안내</h3>
                    <p className="text-gray-600 leading-relaxed">
                        마약 중독에 대한 상담이 필요하시다면, 용산경찰서 마약팀으로 연락주세요.
                        전문 상담원이 도움을 드리겠습니다.
                    </p>
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <p className="text-blue-800 font-medium">
                            용산경찰서 마약팀: 02-XXX-XXXX
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => {
                        setCurrentStep(0);
                        setAnswers({});
                        setOtherInputs({});
                        setShowResult(false);
                    }}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 hover:from-blue-500 hover:via-indigo-500 hover:to-violet-500 transition-all duration-300 text-white font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                    다시 검사하기
                </button>
            </div>
        );
    };

    return (
        <main className="min-h-screen bg-gradient-to-b from-white via-blue-50/80 to-indigo-50/80 text-foreground flex items-center justify-center relative overflow-hidden px-4 sm:px-6 lg:px-8 py-12">
            {/* Background container */}
            <div className="fixed inset-0 w-full h-full pointer-events-none">
                <div
                    className="absolute -top-40 -left-40 w-[800px] h-[800px] bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full mix-blend-normal filter blur-[100px] opacity-40"
                    style={{ transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)` }}
                />
                <div
                    className="absolute -bottom-40 -right-40 w-[800px] h-[800px] bg-gradient-to-tr from-violet-200 to-purple-200 rounded-full mix-blend-normal filter blur-[100px] opacity-40"
                    style={{ transform: `translate(${-mousePosition.x * 0.5}px, ${-mousePosition.y * 0.5}px)` }}
                />
            </div>

            {/* Content */}
            <div className="relative z-10 w-full max-w-2xl mx-auto">
                <div className="bg-white/95 backdrop-blur-md rounded-3xl sm:rounded-4xl p-6 sm:p-8 md:p-10 shadow-2xl border border-white/50">
                    {showResult ? renderResult() : renderQuestion()}
                </div>
            </div>
        </main>
    );
}