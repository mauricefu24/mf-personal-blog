# 个人技术博客系统

这是一个基于 Next.js + TypeScript + Tailwind + Prisma + PostgreSQL 的个人博客 MVP 项目。

## 功能概览

- 首页展示已发布文章列表
- 文章详情页
- 后台登录页
- 后台文章管理页
- 支持文章创建、编辑、删除
- 支持草稿 / 发布状态
- 支持分类和标签
- 支持 SEO title、description、cover image
- Docker 部署和 PostgreSQL 数据库支持

## 目录结构

- `app/` - Next.js App Router 页面和 API 路由
  - `app/page.tsx` - 首页文章列表
  - `app/blog/[slug]/page.tsx` - 文章详情页
  - `app/admin/login/page.tsx` - 管理员登录页
  - `app/admin/page.tsx` - 后台文章管理页
  - `app/api/` - 后端数据 API
- `lib/` - Prisma 客户端和共享工具
- `prisma/schema.prisma` - 数据模型定义
- `Dockerfile`, `docker-compose.yml` - Docker 本地部署支持

## 本地运行

1. 安装依赖

```bash
npm install
```

2. 复制环境变量模板并更新数据库连接

```bash
cp .env.example .env
```

3. 运行 Prisma 迁移并生成客户端

```bash
npm run prisma:migrate
npm run prisma:generate
```

4. 启动开发服务器

```bash
npm run dev
```

5. 打开浏览器访问

```text
http://localhost:3000
```

管理员后台入口：

```text
http://localhost:3000/admin
```

默认管理员账号：

- 邮箱：`admin@example.com`
- 密码：`changeme`

## Docker 运行

使用 Docker Compose 启动 PostgreSQL 和应用：

```bash
docker compose up --build
```

## 当前阶段已完成

- 项目目录规划
- Prisma 数据模型设计
- 首页、文章详情页、后台登录、后台管理页面骨架
- CRUD API 与文章状态支持
- 分类、标签、SEO 字段结构
- Docker 基础部署配置

## 下一步建议

1. 添加更完善的管理员认证与会话管理
2. 引入 Markdown 编辑器和富文本内容展示
3. 扩展分类与标签页面展示
4. 部署到阿里云服务器 / ECS 容器服务

## 注意

部署前请务必更新管理员密码，并使用安全的 PostgreSQL 连接字符串。
