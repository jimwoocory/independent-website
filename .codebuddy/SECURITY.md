# 安全配置文档

本文档记录了项目的安全配置和最佳实践。

## 环境变量配置

### 必需的环境变量

所有环境变量应在 `.env.local` 文件中配置（已被 `.gitignore` 忽略）：

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Admin Authentication
# Comma-separated passwords for admin/editor/viewer roles
ADMIN_PASSWORD="your-secure-admin-password"
EDITOR_PASSWORD="your-secure-editor-password"  # Optional
VIEWER_PASSWORD="your-secure-viewer-password"  # Optional

# Development Settings
# Set to 'true' to enable fallback mock data in development
# MUST be 'false' or unset in production
ENABLE_FALLBACK="false"

# Session Security (Optional, auto-generated if not set)
ADMIN_SESSION_SECRET="your-random-secret-string"
```

### 环境变量安全检查清单

- [x] `.env*.local` 文件已添加到 `.gitignore`
- [x] `.env.local.example` 提供了所有必需变量的示例
- [x] 敏感信息（密码、密钥）从未提交到版本控制
- [x] 生产环境使用平台环境变量（Vercel/Netlify）而非 `.env.local`

## Mock数据控制

### ENABLE_FALLBACK 环境变量

为防止生产环境使用Mock数据，项目使用 `ENABLE_FALLBACK` 环境变量进行严格控制：

```typescript
// 只在非生产环境且明确开启时使用fallback数据
const enableFallback = process.env.NODE_ENV !== 'production' && 
                       process.env.ENABLE_FALLBACK === 'true';
```

### 实施位置

1. **首页车辆列表** (`app/[locale]/page.tsx`)
   - 第140行：`fetchVehicles` 函数添加环境变量检查
   - 数据库无数据或出错时的fallback逻辑受控

2. **车辆详情页** (`app/[locale]/vehicles/[id]/page.tsx`)
   - 第67行：`fetchVehicle` 函数添加环境变量检查
   - 生产环境数据库无数据时返回 `null` 而非fallback

### Mock数据文件

以下文件包含fallback数据，仅在开发环境使用：

- `app/[locale]/page.tsx` (第66-106行)：`fallbackVehicles` 数组
- `app/[locale]/vehicles/[id]/page.tsx` (第16-46行)：`fallback` 对象

**重要**：这些fallback数据会在控制台输出警告日志，便于开发时识别。

## Cookie安全配置

### 会话Cookie设置

管理员会话Cookie使用以下安全配置（`app/api/admin/login/route.ts`）：

```typescript
res.cookies.set(getCookieName(), createSessionToken(role), {
  httpOnly: true,        // 防止XSS攻击，JavaScript无法访问
  sameSite: "strict",    // 防止CSRF攻击，仅同站点请求携带
  secure: process.env.NODE_ENV === "production", // 生产环境仅HTTPS传输
  path: "/",             // Cookie作用域
  maxAge: 60 * 60 * 24 * 7, // 7天有效期
});
```

### Cookie安全特性

| 属性 | 值 | 作用 |
|------|-----|------|
| `httpOnly` | `true` | 防止XSS攻击读取Cookie |
| `sameSite` | `"strict"` | 防止CSRF攻击 |
| `secure` | 生产环境为 `true` | 仅通过HTTPS传输 |
| `maxAge` | 7天 | 会话过期时间 |

### Cookie命名

- **当前Cookie**: `admin_session_v2`
- **旧版Cookie**: `admin_session` (登录时自动清理)

## Supabase行级安全策略 (RLS)

### RLS启用状态

所有8个核心表已启用RLS保护：

```sql
alter table public.vehicles enable row level security;
alter table public.vehicle_images enable row level security;
alter table public.certificates enable row level security;
alter table public.documents enable row level security;
alter table public.jobs enable row level security;
alter table public.job_applications enable row level security;
alter table public.inquiries enable row level security;
alter table public.users enable row level security;
```

### 访问策略

#### 公开读取策略 (SELECT)

以下表对所有用户开放SELECT权限：

- `vehicles` - 车辆信息
- `vehicle_images` - 车辆图片
- `certificates` - 证书信息
- `documents` - 文档资料
- `jobs` - 职位招聘

```sql
create policy "public_select_vehicles" on public.vehicles 
  for select using (true);
```

#### 管理员写入策略 (INSERT/UPDATE/DELETE)

所有表的修改操作仅限管理员：

```sql
create policy "admin_write_vehicles" on public.vehicles 
  for all using (auth.jwt()->>'role' = 'admin');
```

**重要提示**：当前RLS策略假设使用Supabase Auth的JWT角色。如果使用自定义认证（如当前的密码认证），需要在应用层额外验证权限。

### 双重验证建议

为确保安全性，建议采用双重验证：

1. **应用层验证**：通过 `lib/admin-auth.ts` 的 `ensureRole()` 函数
2. **数据库层验证**：通过Supabase RLS策略

示例：
```typescript
// Server Action示例
export async function updateVehicle(id: string, data: any) {
  // 应用层权限检查
  if (!ensureRole("editor")) {
    throw new Error("Unauthorized");
  }
  
  // 使用service role key进行数据库操作
  // RLS策略作为第二道防线
  const supabase = getSupabaseServerClient();
  const { error } = await supabase
    .from("vehicles")
    .update(data)
    .eq("id", id);
    
  if (error) throw error;
}
```

## 权限系统架构

### 角色等级

```typescript
const roleRank: Record<AdminRole, number> = {
  viewer: 1,   // 只读权限
  editor: 2,   // 编辑权限
  admin: 3,    // 完全控制
};
```

### 权限验证流程

```
用户请求 
  → middleware.ts (路由级拦截)
  → Server Component/Action (ensureRole检查)
  → Supabase Query (RLS策略验证)
  → 返回结果
```

### 权限函数

#### `ensureRole(minRole: AdminRole): boolean`

服务端验证当前用户是否具有所需权限等级。

**使用示例**：
```typescript
import { ensureRole } from "@/lib/admin-auth";

export default function AdminPage() {
  if (!ensureRole("editor")) {
    redirect("/admin/login");
  }
  // 页面逻辑
}
```

#### `getRoleFromCookies(): AdminRole | null`

从Cookie中获取当前用户角色。

#### `hasRequiredRole(role: AdminRole | null, minRole: AdminRole): boolean`

检查角色是否满足最低权限要求。

## 部署安全检查清单

### 部署前必须完成

- [ ] 确认 `.env.local` 未被提交到Git
- [ ] 在部署平台配置所有环境变量
- [ ] 确认 `ENABLE_FALLBACK` 未设置或设为 `"false"`
- [ ] 验证 `NODE_ENV` 自动设为 `"production"`
- [ ] 使用强密码（至少16位，包含大小写字母、数字、特殊字符）
- [ ] 验证HTTPS已启用（Vercel/Netlify默认启用）

### 部署后验证

- [ ] 测试管理员登录功能
- [ ] 检查浏览器开发者工具中Cookie的安全属性
- [ ] 验证未授权访问被正确拦截
- [ ] 确认数据库查询正常（无fallback数据）
- [ ] 测试不同角色的权限限制

## 安全监控建议

### 日志审计

在生产环境应记录：
- 管理员登录/登出事件
- 权限验证失败
- 数据修改操作（谁、何时、修改了什么）

### 定期审查

- 每月审查环境变量配置
- 每季度更新管理员密码
- 定期检查Supabase访问日志
- 监控异常登录尝试

## 常见安全问题

### Q: 如何更改管理员密码？

1. 更新 `.env.local` 中的 `ADMIN_PASSWORD`
2. 重启开发服务器
3. 生产环境需在部署平台更新环境变量并重新部署

### Q: Cookie在本地开发时不起作用？

本地开发使用HTTP，`secure` 标志自动设为 `false`。这是正常的，生产环境会自动启用。

### Q: 如何添加新的管理员角色？

1. 在 `.env.local` 中添加新密码环境变量
2. 更新 `lib/admin-auth.ts` 的 `ROLE_PASSWORDS` 配置
3. 如需不同权限等级，更新 `roleRank` 对象

### Q: 生产环境出现fallback数据？

检查：
1. `ENABLE_FALLBACK` 是否正确设置为 `false` 或未设置
2. `NODE_ENV` 是否为 `production`（通常自动设置）
3. Supabase连接是否正常
4. 数据库中是否有数据

## 技术支持

如遇安全问题或疑问，请参考：
- Supabase安全文档: https://supabase.com/docs/guides/auth/row-level-security
- Next.js安全最佳实践: https://nextjs.org/docs/advanced-features/security-headers
- OWASP安全指南: https://owasp.org/www-project-top-ten/

---

**最后更新**: 2025-12-24
**维护者**: 开发团队
