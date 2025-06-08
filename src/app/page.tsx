"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showPrivacyNotice, setShowPrivacyNotice] = useState(true);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    setIsLoaded(true);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <main className="h-screen bg-gradient-to-b from-white via-blue-50/80 to-indigo-50/80 text-foreground flex items-center justify-center relative overflow-hidden px-4 sm:px-6 lg:px-8">
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
        
        {/* Small decorative patterns */}
        <div className="absolute top-1/4 right-1/3 w-[400px] h-[400px] bg-gradient-to-br from-blue-200 to-sky-200 rounded-full mix-blend-normal filter blur-[60px] opacity-25 animate-pulse" />
        <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-gradient-to-tl from-purple-200 to-violet-200 rounded-full mix-blend-normal filter blur-[60px] opacity-25 animate-pulse-delayed" />
        <div className="absolute top-2/3 left-1/2 w-[300px] h-[300px] bg-gradient-to-r from-cyan-200 to-blue-200 rounded-full mix-blend-normal filter blur-[60px] opacity-25 animate-float-slow" />
        <div className="absolute bottom-2/3 right-1/2 w-[300px] h-[300px] bg-gradient-to-l from-indigo-200 to-purple-200 rounded-full mix-blend-normal filter blur-[60px] opacity-25 animate-float-slow-delayed" />
      </div>

      {/* Content */}
      <div className={`relative z-10 w-full max-w-3xl mx-auto transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="bg-white/95 backdrop-blur-md rounded-3xl sm:rounded-4xl p-4 sm:p-6 md:p-8 lg:p-10 shadow-2xl border border-white/50 transition-all duration-500 hover:shadow-3xl hover:bg-white/98">
          <div className="space-y-4 sm:space-y-6 flex flex-col items-center justify-center">
            {/* Welcome Message */}
            <div className="text-center space-y-1 animate-fade-in">
              <p className="text-blue-600 font-medium text-sm sm:text-base">환영합니다!</p>
              <div className="h-0.5 w-10 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full mx-auto" />
            </div>

            {/* Logo or Icon */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300" />
              <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-400 flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover:scale-105 group-hover:rotate-3">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white transform transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>

            {/* Title Section */}
            <div className="space-y-2 sm:space-y-3 text-center max-w-2xl animate-fade-in-up">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight">
                마약 없는 나의{' '}
                <span className="relative inline-block">
                  <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 animate-gradient">
                    밝은 미래
                  </span>
                  <span className="absolute bottom-0 left-0 w-full h-2 bg-blue-100/50 -rotate-1 transform -z-0" />
                </span>{' '}
                플래너
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 font-medium leading-relaxed">
                용산 경찰서와 함께하는{' '}
                <span className="text-blue-500 font-semibold">청소년 마약 중독 단절</span>{' '}
                프로젝트
              </p>
            </div>

            {/* Start Button */}
            <div className="relative mt-2 sm:mt-4 animate-fade-in-up delay-200">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-300" />
              <Link href="/survey">
              <button 
                className="group relative px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 hover:from-blue-500 hover:via-indigo-500 hover:to-violet-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                onMouseEnter={() => setIsButtonHovered(true)}
                onMouseLeave={() => setIsButtonHovered(false)}
              >
                <span className="relative text-base sm:text-lg font-semibold text-white flex items-center gap-2">
                  시작하기 ✨
                </span>
                <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
              <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs sm:text-sm text-gray-500 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                클릭하여 시작하세요 ✨
              </div>
              </Link>
            </div>

            {/* Privacy Notice */}
            {showPrivacyNotice && (
              <div className="mt-4 sm:mt-6 p-3 sm:p-4 rounded-xl bg-blue-50/80 backdrop-blur-sm border border-blue-100 flex items-start gap-2 sm:gap-3 max-w-lg w-full transform transition-all duration-300 hover:bg-blue-50 animate-fade-in-up delay-300">
                <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-400 flex items-center justify-center shadow-sm">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-xs sm:text-sm text-blue-700 leading-relaxed">
                    안전한 서비스 이용을 위해{' '}
                    <span className="font-medium text-blue-800">개인정보 보호법</span>
                    을 준수합니다. 입력하신 정보는 마약 중독 예방 및 상담 목적으로만 사용되며,{' '}
                    <span className="font-medium text-blue-800">절대 제3자에게 공유되지 않습니다.</span>
                  </p>
                </div>
                <button 
                  onClick={() => setShowPrivacyNotice(false)}
                  className="flex-shrink-0 text-blue-400 hover:text-blue-500 transition-colors p-1 hover:bg-blue-100 rounded-full"
                  aria-label="알림 닫기"
                >
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}