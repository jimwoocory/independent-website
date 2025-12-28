/**
 * 自定义图片 CDN Loader 示例
 * 
 * 使用方法：
 * 1. 将此文件重命名为 image-loader.js
 * 2. 在 next.config.mjs 中取消注释 loader 和 loaderFile 配置
 * 3. 根据你的 CDN 提供商调整 URL 生成逻辑
 */

// 示例 1: Cloudinary
export default function cloudinaryLoader({ src, width, quality }) {
  const params = ['f_auto', 'c_limit', `w_${width}`, `q_${quality || 'auto'}`];
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  return `https://res.cloudinary.com/${cloudName}/image/upload/${params.join(',')}/${src}`;
}

// 示例 2: Imgix
// export default function imgixLoader({ src, width, quality }) {
//   const url = new URL(`https://your-domain.imgix.net${src}`);
//   const params = url.searchParams;
//   params.set('auto', params.getAll('auto').join(',') || 'format');
//   params.set('fit', params.get('fit') || 'max');
//   params.set('w', params.get('w') || width.toString());
//   if (quality) {
//     params.set('q', quality.toString());
//   }
//   return url.href;
// }

// 示例 3: AWS CloudFront
// export default function cloudFrontLoader({ src, width, quality }) {
//   const distributionDomain = process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN;
//   return `https://${distributionDomain}/${src}?w=${width}&q=${quality || 75}`;
// }

// 示例 4: 自定义 CDN
// export default function customLoader({ src, width, quality }) {
//   const cdnDomain = process.env.NEXT_PUBLIC_CDN_DOMAIN;
//   return `https://${cdnDomain}/${src}?width=${width}&quality=${quality || 75}`;
// }
