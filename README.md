# AutoExport Global

现代化的汽车出口 B2B 网站，基于 Next.js 14（App Router）+ TypeScript + Tailwind CSS，集成 Supabase、next-intl，多语言覆盖 8 种语言。

## 主要功能
- 🚗 车辆目录：列表/详情、分页、筛选、排序、快速筛选组件
- 🧭 车型导航：4 大分类 Mega Menu，品牌下钻
- 📝 Blog 系统：列表+详情，分类筛选，相关文章推荐
- 📦 资源中心：下载、购车指南、视频、FAQ
- ⭐ 客户评价：真实案例 + 评分看板
- 🧮 数据看板：8 个核心业务指标动画展示
- 🌍 国际化：8 语言，next-intl 驱动
- 🔒 安全计划：环境变量防护、RLS 校验、Cookie 安全、Mock 开关

## 快速开始
```bash
# 安装依赖
npm install

# 本地开发
npm run dev

# 构建与启动生产
npm run build
npm start
```

## 目录结构（节选）
```
app/[locale]/        # 多语言路由页面
  ├─ vehicles/       # 车辆列表
  ├─ blog/           # 博客列表/详情
  ├─ resources/      # 资源中心
  ├─ reviews/        # 客户评价
  └─ about/          # 关于我们
components/          # 共享组件（导航、筛选、看板、信任背书等）
messages/            # 8 语言翻译文件
supabase/            # 数据库 schema
```

## 国际化
- 支持语言：en, zh, ar, es, pt, fr, ru, ja
- 中间件与下拉语言切换已配置，翻译文件位于 `messages/*.json`

## 数据库（Supabase）
- 表：`vehicles`, `blogs`, `inquiries`, `solutions`, `rental_prices`
- 使用 RLS：公开只读，管理员写入；详情见 `supabase/schema.sql`

## 安全与配置
- 环境变量示例：`.env.local.example`（需根据实际填充）
- 关键变量：`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `ADMIN_PASSWORD`, `ENABLE_FALLBACK=false`
- Cookie 安全：`httpOnly`, `secure`(prod), `sameSite=strict`
- Mock 数据：仅在非生产且 `ENABLE_FALLBACK=true` 时启用

## 脚本
- `npm run dev` 开发
- `npm run build` 构建
- `npm run start` 生产启动
- `npm run lint` 代码检查

## 部署
- 推荐 Vercel（Next.js 预设即可），或 Docker/PM2 自托管
- 部署前确保环境变量已配置，Supabase 已运行 `schema.sql`

## 文档
- 详见 `DEVELOPMENT_DOCUMENTATION.md`（完整开发文档、架构与未来规划）

---
如需补充徽标、截图或部署指令，请告知。