# AutoExport Global

> **完整开发文档**：请直接查看 `DEVELOPMENT_DOCUMENTATION.md`（已包含架构、功能、数据库、国际化、安全、部署、规范与规划的全量细节）。

## 快速导航
- **项目概览 / 架构 / 目录**：见开发文档「项目概述」「技术架构」章节
- **功能说明**：车辆目录、车型导航、Blog、资源中心、客户评价、数据看板等，请见「核心功能模块」
- **数据库 & RLS**：Supabase 表结构与策略，见「数据库设计」
- **国际化**：8 语言方案，见「国际化支持」
- **安全与配置**：环境变量、Cookie、安全清单，见「安全优化」
- **部署指南**：Vercel / Docker / PM2，见「部署指南」
- **规范与规划**：提交规范、分支策略、未来路线，见「开发规范」「未来规划」「更新日志」

## 快速开始
```bash
npm install
npm run dev          # 本地开发
npm run build && npm start  # 生产
```

## 环境变量（示例）
- 必填：`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `ADMIN_PASSWORD`, `ENABLE_FALLBACK=false`
- 可选：`RESEND_API_KEY`, `GOOGLE_ANALYTICS_ID`

## 说明
本 README 作为索引，详细内容统一维护在 `DEVELOPMENT_DOCUMENTATION.md`。