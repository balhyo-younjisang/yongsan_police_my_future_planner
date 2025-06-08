/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... existing code ...
  
  // 헤더 크기 제한 증가
  experimental: {
    largePageDataBytes: 128 * 1000, // 128KB로 증가
  },
  
  // API 라우트 설정
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig; 