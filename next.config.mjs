// Next.js configuration with next-intl plugin
import createNextIntlPlugin from 'next-intl/plugin';

// Create next-intl plugin
const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // 图片优化配置
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30天缓存
    
    // 如需使用专用 CDN（如 Cloudinary、Imgix），取消注释以下配置：
    // loader: 'custom',
    // loaderFile: './lib/image-loader.js',
    
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      // 添加其他 CDN 域名示例：
      // {
      //   protocol: 'https',
      //   hostname: 'res.cloudinary.com',
      //   pathname: '/**',
      // },
    ],
  },
  
  // 压缩配置
  compress: true,
  
  // 生产环境优化
  poweredByHeader: false,
  generateEtags: true,
  
  // 编译优化
  swcMinify: true,
  
  // 构建优化
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  
  // 页面大小限制
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },
};

// Apply next-intl plugin
export default withNextIntl(nextConfig);
