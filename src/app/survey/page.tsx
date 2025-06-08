"use client";

import { useEffect, useState, ReactElement } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, Controller, ControllerRenderProps, FieldError, UseFormReturn, FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";

// Zod 스키마 정의
const surveySchema = z.object({
    '1': z.enum(['male', 'female', 'none'], {
        required_error: '성별을 선택해주세요.',
    }),
    '2': z.object({
        age: z.number({
            required_error: '나이를 입력해주세요.',
            invalid_type_error: '올바른 숫자를 입력해주세요.',
        }).min(1, '나이를 입력해주세요.').max(100, '올바른 나이를 입력해주세요.'),
        grade: z.string({
            required_error: '학년을 선택해주세요.',
        }).min(1, '학년을 선택해주세요.'),
    }),
    '3': z.object({
        value: z.string({
            required_error: '장래희망을 선택해주세요.',
        }).min(1, '장래희망을 선택해주세요.'),
        other: z.string().optional(),
    }),
    '4': z.array(z.string(), {
        required_error: '취미를 선택해주세요.',
    }).min(1, '최소 하나 이상의 취미를 선택해주세요.'),
    '5': z.enum(['less1', '1to3', '3to5', 'more5'], {
        required_error: '스마트폰 사용 시간을 선택해주세요.',
    }),
    '6': z.array(z.string(), {
        required_error: '감정을 선택해주세요.',
    }).min(1, '최소 하나 이상의 감정을 선택해주세요.'),
    '7': z.enum(['none', 'talk', 'game', 'alone', 'exercise', 'sns', 'cry'], {
        required_error: '스트레스 해소 방법을 선택해주세요.',
    }),
    '8': z.enum(['very_bad', 'curious', 'okay', 'dont_know'], {
        required_error: '마약에 대한 의견을 선택해주세요.',
    }),
    '9': z.enum(['dont_know', 'refuse', 'accept', 'consider'], {
        required_error: '마약 권유 시 대응 방법을 선택해주세요.',
    }),
    '10': z.string({
        required_error: '미래에 대한 생각을 입력해주세요.',
    }).min(1, '미래에 대한 생각을 입력해주세요.').refine(
        (val) => !['dont_know', 'refuse', 'accept', 'consider'].includes(val),
        '올바른 텍스트를 입력해주세요.'
    ),
    '4.0': z.string().optional(),
});

type SurveyFormValues = z.infer<typeof surveySchema>;

type Question = {
    id: number;
    type: 'text' | 'number' | 'single' | 'multiple';
    text: string;
    options?: Array<{
        value: string;
        text: string;
        isOther?: boolean;
    }>;
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
        type: 'single',
        text: '친구가 마약을 권유한다면 어떻게 하시겠습니까?',
        options: [
            { value: 'dont_know', text: '모르겠다' },
            { value: 'refuse', text: '거절한다' },
            { value: 'accept', text: '수락한다' },
            { value: 'consider', text: '고민한다' }
        ]
    },
    {
        id: 10,
        type: 'text',
        text: '미래에 대한 나의 생각은?',
        placeholder: '미래에 대한 생각을 자유롭게 작성해주세요.'
    }
];

type SurveyState = 'welcome' | 'survey' | 'result';

type ErrorState = {
    [key: string]: { message: string } | undefined;
};

// 에러 메시지 매핑 객체 추가
const errorMessages: Record<string, Record<string, string>> = {
    '5': {
        'less1': '1시간 미만',
        '1to3': '1~3시간',
        '3to5': '3~5시간',
        'more5': '5시간 이상',
    },
    '7': {
        'none': '없음',
        'talk': '대화하기',
        'game': '게임하기',
        'alone': '혼자 있기',
        'exercise': '운동하기',
        'sns': 'SNS하기',
        'cry': '울기',
    },
    '8': {
        'very_bad': '매우 나쁨',
        'curious': '호기심',
        'okay': '괜찮음',
        'dont_know': '모르겠음',
    },
    '9': {
        'dont_know': '모르겠음',
        'refuse': '거절',
        'accept': '수락',
        'consider': '고민',
    }
};

// 사용자 친화적인 에러 메시지로 변환하는 함수
const getFriendlyErrorMessage = (questionId: string, error: any): string => {
    // 기본 에러 메시지
    const defaultMessages: Record<string, string> = {
        '1': '성별을 선택해주세요.',
        '2': '나이와 학년을 입력해주세요.',
        '3': '장래희망을 선택해주세요.',
        '4': '취미를 선택해주세요.',
        '5': '스마트폰 사용 시간을 선택해주세요.',
        '6': '감정을 선택해주세요.',
        '7': '스트레스 해소 방법을 선택해주세요.',
        '8': '마약에 대한 의견을 선택해주세요.',
        '9': '마약 권유 시 대응 방법을 선택해주세요.',
        '10': '미래에 대한 생각을 입력해주세요.',
    };

    // 에러 메시지가 없는 경우 기본 메시지 반환
    if (!error?.message) {
        return defaultMessages[questionId] || '올바른 값을 입력해주세요.';
    }

    // Zod 에러 메시지 처리
    const errorMessage = error.message;
    
    // 배열 타입 에러 처리
    if (errorMessage.includes('received array')) {
        return defaultMessages[questionId] || '하나의 항목만 선택해주세요.';
    }

    // enum 타입 에러 처리
    if (errorMessage.includes('Expected') && errorMessage.includes('received')) {
        const questionMessages = errorMessages[questionId];
        if (questionMessages) {
            return defaultMessages[questionId] || '올바른 항목을 선택해주세요.';
        }
    }

    // 기타 에러는 기본 메시지 반환
    return defaultMessages[questionId] || '올바른 값을 입력해주세요.';
};

// 답변 타입 정의
type SurveyAnswer = {
    questionId: number;
    answer: string | string[] | { value: string; other?: string } | { age: number; grade: string };
    timestamp: string;
};

// 각 질문별 상태 타입 정의
type Question1State = 'male' | 'female' | 'none' | undefined;
type Question2State = { age: number; grade: string };
type Question3State = { value: string; other?: string };
type Question4State = string[];
type Question5State = 'less1' | '1to3' | '3to5' | 'more5' | undefined;
type Question6State = string[];
type Question7State = 'none' | 'talk' | 'game' | 'alone' | 'exercise' | 'sns' | 'cry' | undefined;
type Question8State = 'very_bad' | 'curious' | 'okay' | 'dont_know' | undefined;
type Question9State = 'dont_know' | 'refuse' | 'accept' | 'consider' | undefined;
type Question10State = string;

export default function SurveyPage() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [currentStep, setCurrentStep] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [nickname, setNickname] = useState<string>('');
    const [state, setState] = useState<SurveyState>('welcome');
    const [isLoading, setIsLoading] = useState(true);
    const [formErrors, setFormErrors] = useState<ErrorState>({});
    const [answers, setAnswers] = useState<SurveyAnswer[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    // 각 질문별 상태 추가
    const [question1Value, setQuestion1Value] = useState<Question1State>(undefined);
    const [question2Value, setQuestion2Value] = useState<Question2State>({ age: 0, grade: '' });
    const [question3Value, setQuestion3Value] = useState<Question3State>({ value: '', other: undefined });
    const [question4Value, setQuestion4Value] = useState<Question4State>([]);
    const [question5Value, setQuestion5Value] = useState<Question5State>(undefined);
    const [question6Value, setQuestion6Value] = useState<Question6State>([]);
    const [question7Value, setQuestion7Value] = useState<Question7State>(undefined);
    const [question8Value, setQuestion8Value] = useState<Question8State>(undefined);
    const [question9Value, setQuestion9Value] = useState<Question9State>(undefined);
    const [question10Value, setQuestion10Value] = useState<Question10State>('');

    // 현재 질문의 상태와 setter를 가져오는 함수
    const getQuestionState = (questionId: number) => {
        switch (questionId) {
            case 1: return { value: question1Value, setValue: setQuestion1Value };
            case 2: return { value: question2Value, setValue: setQuestion2Value };
            case 3: return { value: question3Value, setValue: setQuestion3Value };
            case 4: return { value: question4Value, setValue: setQuestion4Value };
            case 5: return { value: question5Value, setValue: setQuestion5Value };
            case 6: return { value: question6Value, setValue: setQuestion6Value };
            case 7: return { value: question7Value, setValue: setQuestion7Value };
            case 8: return { value: question8Value, setValue: setQuestion8Value };
            case 9: return { value: question9Value, setValue: setQuestion9Value };
            case 10: return { value: question10Value, setValue: setQuestion10Value };
            default: throw new Error(`Invalid question ID: ${questionId}`);
        }
    };

    const form = useForm<SurveyFormValues>({
        resolver: zodResolver(surveySchema),
        defaultValues: {
            '1': undefined,
            '2': { age: 0, grade: '' },
            '3': { value: '', other: undefined },
            '4': [],
            '5': undefined,
            '6': [],
            '7': undefined,
            '8': undefined,
            '9': undefined,
            '10': '',
            '4.0': undefined
        },
        mode: 'onChange'
    });

    const { control, handleSubmit, trigger, getValues, formState: { errors: validationErrors } } = form;

    useEffect(() => {
        const fetchNickname = async () => {
            try {
                const response = await fetch('/api/calculate-result');
                const data = await response.json();
                setNickname(data.nickname);
            } catch (error) {
                console.error('Failed to fetch nickname:', error);
                setNickname('친구');
            } finally {
                setIsLoading(false);
            }
        };

        fetchNickname();
    }, []);

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

    // 답변 저장 함수 수정
    const saveAnswer = (questionId: number, value: any) => {
        const { setValue } = getQuestionState(questionId);
        setValue(value);

        setAnswers(prev => {
            const existingAnswerIndex = prev.findIndex(a => a.questionId === questionId);
            const newAnswer: SurveyAnswer = {
                questionId,
                answer: value,
                timestamp: new Date().toISOString()
            };

            if (existingAnswerIndex === -1) {
                return [...prev, newAnswer];
            } else {
                const updatedAnswers = [...prev];
                updatedAnswers[existingAnswerIndex] = newAnswer;
                return updatedAnswers;
            }
        });
    };

    // 서버 제출 함수 수정
    const submitToServer = async () => {
        try {
            setIsSubmitting(true);
            
            // 최종 답변 데이터 구성
            const submissionData = {
                formData: {
                    '1': question1Value,
                    '2': question2Value,
                    '3': question3Value,
                    '4': question4Value,
                    '5': question5Value,
                    '6': question6Value,
                    '7': question7Value,
                    '8': question8Value,
                    '9': question9Value,
                    '10': question10Value
                },
                answers: answers,
                metadata: {
                    submittedAt: new Date().toISOString(),
                    totalQuestions: questions.length,
                    completedQuestions: answers.length
                }
            };

            const response = await fetch('/api/calculate-result', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submissionData)
            });

            if (!response.ok) {
                throw new Error('Failed to submit survey');
            }

            const result = await response.json();
            
            // 결과 페이지로 데이터 전달 (분석 결과 포함)
            router.push(`/survey/result?data=${encodeURIComponent(JSON.stringify({
                answers: submissionData.formData,
                metadata: submissionData.metadata,
                nickname: nickname,
                analysis: result.data // 백엔드에서 받은 분석 결과 추가
            }))}`);
        } catch (error) {
            console.error('Error submitting survey:', error);
            alert('설문 제출 중 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleNext = async () => {
        const question = questions[currentStep];
        const { value: currentValue } = getQuestionState(question.id);
        
        // 현재 질문의 유효성 검사
        let isValid = true;
        let errorMessage = '';

        switch (question.type) {
            case 'single':
                if (['1', '5', '7', '8', '9'].includes(question.id.toString())) {
                    isValid = currentValue !== undefined;
                    errorMessage = '답변을 선택해주세요.';
                } else if (question.id === 3) {
                    const value = currentValue as Question3State;
                    isValid = value.value !== '';
                    errorMessage = '장래희망을 선택해주세요.';
                }
                break;

            case 'multiple':
                const multipleValue = currentValue as string[];
                isValid = multipleValue.length > 0;
                errorMessage = '최소 하나 이상 선택해주세요.';
                break;

            case 'text':
                if (question.id === 10) {
                    const textValue = currentValue as string;
                    isValid = textValue.trim().length > 0;
                    errorMessage = '답변을 입력해주세요.';
                }
                break;

            case 'number':
                const numberValue = currentValue as Question2State;
                isValid = numberValue.age > 0 && numberValue.grade !== '';
                errorMessage = '나이와 학년을 모두 입력해주세요.';
                break;
        }

        if (!isValid) {
            setFormErrors(prev => ({
                ...prev,
                [question.id]: { message: errorMessage }
            }));
            return;
        }

        // 현재 답변 저장
        saveAnswer(question.id, currentValue);

        // 다음 질문으로 이동
        if (currentStep < questions.length - 1) {
            setCurrentStep(prev => prev + 1);
            setFormErrors(prev => ({
                ...prev,
                [question.id]: undefined
            }));
        } else {
            // 마지막 질문이면 제출
            await submitToServer();
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const renderWelcome = () => {
        if (isLoading) {
            return (
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                </div>
            );
        }

        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="space-y-8 text-center"
            >
                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
                    className="text-3xl sm:text-4xl font-bold text-gray-800"
                >
                    안녕하세요, {nickname}님!
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2, ease: "easeOut" }}
                    className="text-lg text-gray-600"
                >
                    마약 중독 예방을 위한 설문에 참여해주셔서 감사합니다.
                    <br />
                    여러분의 소중한 의견이 더 나은 미래를 만드는 데 도움이 됩니다.
                </motion.p>
                <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3, ease: "easeOut" }}
                    onClick={() => setState('survey')}
                    className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 hover:from-blue-500 hover:via-indigo-500 hover:to-violet-500 transition-all duration-300 text-white font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                    설문 시작하기
                </motion.button>
            </motion.div>
        );
    };

    const renderQuestion = () => {
        const question = questions[currentStep];
        const { value: currentValue, setValue: setCurrentValue } = getQuestionState(question.id);
        const error = formErrors[question.id.toString()];

        const renderField = () => {
            switch (question.type) {
                case 'single':
                    if (['1', '5', '7', '8', '9'].includes(question.id.toString())) {
                        return (
                            <div className="grid gap-3">
                                {question.options?.map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => {
                                            const newValue = option.value as any;
                                            setCurrentValue(newValue);
                                            saveAnswer(question.id, newValue);
                                            // 에러 메시지 초기화
                                            setFormErrors(prev => ({
                                                ...prev,
                                                [question.id]: undefined
                                            }));
                                        }}
                                        className={`w-full p-4 rounded-xl bg-white border transition-all duration-200 text-left group ${
                                            currentValue === option.value
                                                ? 'border-blue-400 bg-blue-50 text-blue-600'
                                                : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                                        }`}
                                    >
                                        <span className="font-medium">{option.text}</span>
                                    </button>
                                ))}
                            </div>
                        );
                    }

                    // 3번 문항 (장래희망) 처리
                    const singleValue = currentValue as Question3State;
                    return (
                        <div className="grid gap-3">
                            {question.options?.map((option) => (
                                <div key={option.value} className="space-y-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newValue = { value: option.value, other: '' };
                                            setCurrentValue(newValue as any);
                                            saveAnswer(question.id, newValue);
                                            // 에러 메시지 초기화
                                            setFormErrors(prev => ({
                                                ...prev,
                                                [question.id]: undefined
                                            }));
                                        }}
                                        className={`w-full p-4 rounded-xl bg-white border transition-all duration-200 text-left group ${
                                            singleValue.value === option.value
                                                ? 'border-blue-400 bg-blue-50 text-blue-600'
                                                : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                                        }`}
                                    >
                                        <span className="font-medium">{option.text}</span>
                                    </button>
                                    {option.isOther && singleValue.value === option.value && (
                                        <input
                                            type="text"
                                            value={singleValue.other ?? ''}
                                            onChange={(e) => {
                                                const newValue = { ...singleValue, other: e.target.value };
                                                setCurrentValue(newValue as any);
                                                saveAnswer(question.id, newValue);
                                            }}
                                            placeholder="직접 입력해주세요"
                                            className="w-full p-3 rounded-lg bg-white border transition-all duration-200 border-gray-200 focus:border-blue-400 focus:ring-blue-200"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    );

                case 'text':
                    if (question.id === 10) {
                        return (
                            <div className="space-y-2">
                                <textarea
                                    value={currentValue as string}
                                    onChange={(e) => {
                                        setCurrentValue(e.target.value as any);
                                        saveAnswer(question.id, e.target.value);
                                    }}
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    rows={4}
                                    placeholder={question.placeholder || "답변을 입력해주세요"}
                                />
                                <div className="text-sm text-gray-500 text-right">
                                    {(currentValue as string).length}/500자
                                </div>
                            </div>
                        );
                    }
                    return null;

                case 'multiple':
                    const multipleValue = currentValue as string[];
                    return (
                        <div className="grid gap-3">
                            {question.options?.map((option) => (
                                <div key={option.value} className="space-y-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            let newValues: string[];
                                            if (option.value === 'other') {
                                                // 기타 선택 시 빈 문자열로 초기화
                                                newValues = multipleValue.includes('other')
                                                    ? multipleValue.filter(v => v !== 'other')
                                                    : [...multipleValue, 'other'];
                                            } else {
                                                newValues = multipleValue.includes(option.value)
                                                    ? multipleValue.filter(v => v !== option.value)
                                                    : [...multipleValue, option.value];
                                            }
                                            setCurrentValue(newValues as any);
                                            saveAnswer(question.id, newValues);
                                            // 에러 메시지 초기화
                                            setFormErrors(prev => ({
                                                ...prev,
                                                [question.id]: undefined
                                            }));
                                        }}
                                        className={`w-full p-4 rounded-xl bg-white border transition-all duration-200 text-left group ${
                                            multipleValue.includes(option.value)
                                                ? 'border-blue-400 bg-blue-50 text-blue-600'
                                                : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                                        }`}
                                    >
                                        <span className="font-medium">{option.text}</span>
                                    </button>
                                    {option.isOther && multipleValue.includes(option.value) && (
                                        <input
                                            type="text"
                                            value={multipleValue.find(v => v.startsWith('other:'))?.split(':')[1] || ''}
                                            onChange={(e) => {
                                                const otherValue = e.target.value;
                                                const newValues = multipleValue.filter(v => !v.startsWith('other:'));
                                                if (otherValue) {
                                                    newValues.push(`other:${otherValue}`);
                                                } else {
                                                    newValues.push('other');
                                                }
                                                setCurrentValue(newValues as any);
                                                saveAnswer(question.id, newValues);
                                            }}
                                            placeholder="직접 입력해주세요"
                                            className="w-full p-3 rounded-lg bg-white border transition-all duration-200 border-gray-200 focus:border-blue-400 focus:ring-blue-200"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    );

                case 'number':
                    const numberValue = currentValue as Question2State;
                    return (
                        <div className="space-y-4">
                            <input
                                type="number"
                                value={numberValue.age || ''}
                                onChange={(e) => {
                                    const newValue = { ...numberValue, age: Number(e.target.value) };
                                    setCurrentValue(newValue as any);
                                    saveAnswer(question.id, newValue);
                                }}
                                placeholder={question.placeholder}
                                className="w-full p-4 rounded-xl bg-white border transition-all duration-200 border-gray-200 focus:border-blue-400 focus:ring-blue-200"
                            />
                            <div className="grid grid-cols-3 gap-3">
                                {['초등학생', '중학생', '고등학생'].map((grade) => (
                                    <button
                                        key={grade}
                                        type="button"
                                        onClick={() => {
                                            const newValue = { ...numberValue, grade };
                                            setCurrentValue(newValue as any);
                                            saveAnswer(question.id, newValue);
                                            // 에러 메시지 초기화
                                            setFormErrors(prev => ({
                                                ...prev,
                                                [question.id]: undefined
                                            }));
                                        }}
                                        className={`p-4 rounded-xl bg-white border transition-all duration-200 ${
                                            numberValue.grade === grade
                                                ? 'border-blue-400 bg-blue-50 text-blue-600'
                                                : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                                        }`}
                                    >
                                        {grade}
                                    </button>
                                ))}
                            </div>
                        </div>
                    );

                default:
                    return null;
            }
        };

        return (
            <div className="space-y-6 animate-fade-in-up">
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {question.id}. {question.text}
                    </h2>
                    {question.text && question.text !== question.text && (
                        <p className="text-gray-600">{question.text}</p>
                    )}
                </div>

                <div className="space-y-4">
                    {error && (
                        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm animate-shake">
                            {error.message}
                        </div>
                    )}

                    {renderField()}
                </div>

                <div className="flex justify-between pt-6">
                    <button
                        type="button"
                        onClick={handlePrev}
                        disabled={currentStep === 0}
                        className={`px-6 py-3 rounded-xl bg-white border transition-all duration-200 ${
                            currentStep === 0
                                ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                                : 'border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-600'
                        }`}
                    >
                        이전
                    </button>
                    <button
                        type="button"
                        onClick={handleNext}
                        disabled={isSubmitting}
                        className={`px-6 py-3 rounded-xl bg-blue-500 text-white font-medium transition-all duration-200 hover:bg-blue-600 ${
                            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        {isSubmitting ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                제출 중...
                            </span>
                        ) : (
                            currentStep === questions.length - 1 ? '제출하기' : '다음'
                        )}
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
                        setFormErrors({});
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
                    style={{ 
                        transform: `translate3d(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px, 0)`,
                        willChange: 'transform'
                    }}
            />
            <div
                className="absolute -bottom-40 -right-40 w-[800px] h-[800px] bg-gradient-to-tr from-violet-200 to-purple-200 rounded-full mix-blend-normal filter blur-[100px] opacity-40"
                    style={{ 
                        transform: `translate3d(${-mousePosition.x * 0.5}px, ${-mousePosition.y * 0.5}px, 0)`,
                        willChange: 'transform'
                    }}
                />
            </div>

            {/* Content */}
            <div className="relative z-10 w-full max-w-2xl mx-auto">
                <div className="bg-white/95 backdrop-blur-md rounded-3xl sm:rounded-4xl p-6 sm:p-8 md:p-10 shadow-2xl border border-white/50">
                    <AnimatePresence mode="wait">
                        {state === 'welcome' && (
                            <motion.div
                                key="welcome"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2, ease: "easeInOut" }}
                            >
                                {renderWelcome()}
                            </motion.div>
                        )}
                        {state === 'survey' && (
                            <motion.div
                                key="survey"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2, ease: "easeInOut" }}
                                style={{ willChange: 'transform, opacity' }}
                            >
                                {showResult ? renderResult() : renderQuestion()}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
        </div>
    </main>
    );
}