import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

function slugify(value) {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "") || "post"
  );
}

const dbUrl = process.env.DATABASE_URL ?? "";
const dbPath = dbUrl.replace("file:", "");
const adapter = new PrismaBetterSqlite3({ url: dbPath });
const prisma = new PrismaClient({ adapter });

const categories = [
  { name: "前端工程", slug: "frontend-engineering" },
  { name: "数据库实践", slug: "database-practice" },
  { name: "RPA 自动化", slug: "rpa-automation" },
  { name: "BI 分析", slug: "bi-analytics" },
];

const tags = [
  { name: "Next.js", slug: "nextjs" },
  { name: "Prisma", slug: "prisma" },
  { name: "SQLite", slug: "sqlite" },
  { name: "Tailwind CSS", slug: "tailwind-css" },
  { name: "RPA", slug: "rpa" },
  { name: "BI", slug: "bi" },
  { name: "Power BI", slug: "power-bi" },
  { name: "UiPath", slug: "uipath" },
  { name: "Automation", slug: "automation" },
];

const siteProfile = {
  name: "Maurice",
  title: "专注工程实践的独立开发者",
  heroIntro:
    "这里聚焦 Next.js、Prisma、SQLite 与工程化经验。首页直接从 SQLite 读取已发布文章，展示分类、标签、发布时间与封面图，保持前台内容与后台数据同步。",
  bio: `我是一名偏工程实践方向的开发者，长期关注前端架构、自动化工作流和内容系统建设，也会持续探索技术产品从想法到落地的完整过程。

这几年我主要围绕 Next.js、Prisma、SQLite、Automation 和 Low-Code 展开实践，希望把复杂问题拆成可维护、可复用的系统。

写博客对我来说，不只是记录知识点，更是整理判断过程、沉淀解决方案，并把真实项目里的经验分享给同样在持续构建产品的人。`,
  avatar:
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=320&q=80",
  ctaText: "查看更多文章",
  ctaLink: "#posts",
  skills: ["Next.js", "Prisma", "SQLite", "Automation", "Low-Code"],
};

const posts = [
  {
    title: "用 Next.js 16 搭一个可持续迭代的博客首页",
    slug: "build-a-blog-homepage-with-nextjs-16",
    excerpt: "从信息架构、组件拆分到渲染策略，整理一套适合个人博客长期维护的首页方案。",
    content: `## 为什么首页结构要先稳定

这篇测试文章聚焦首页设计。先把博客前台拆成 Hero、文章列表和详情页三层，才能让后续的维护成本真正可控。

在个人技术博客里，首页最重要的不是堆很多模块，而是让读者快速理解你在写什么、最近更新了什么，以及点进一篇文章之后能否继续顺畅阅读。

### 我更在意的三个点

- 标题和摘要要足够清晰，让读者在几秒内判断要不要继续阅读
- 分类、标签和发布时间要轻量但完整，方便快速扫读
- 卡片样式应该偏文章列表，而不是作品展示橱窗

## 数据如何和前台统一

因此我们把已发布文章直接从 SQLite 读取，再通过 Prisma 统一查询分类、标签与封面图，让前台和后台始终使用同一份数据。

\`\`\`
const posts = await prisma.post.findMany({
  where: { status: "PUBLISHED" },
  include: { category: true, tags: { include: { tag: true } } },
});
\`\`\``,
    coverImage:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    categorySlug: "frontend-engineering",
    tagSlugs: ["nextjs", "tailwind-css"],
  },
  {
    title: "Prisma + SQLite 作为个人博客数据层的轻量方案",
    slug: "prisma-sqlite-for-personal-blog",
    excerpt: "为什么个人博客很适合用 Prisma 配 SQLite，以及如何让本地开发和 seed 更顺手。",
    content: `## 为什么个人博客适合 SQLite

这篇测试文章关注数据层。对于内容量不大的个人博客，SQLite 的部署和备份都很轻，尤其适合先把内容系统做起来。

Prisma 在这里承担了模型定义、迁移和查询封装的工作。首页读取文章列表，详情页按 slug 查询文章，后台再负责内容录入和维护，职责会很清晰。

### 一套轻量方案通常包含

- SQLite 负责本地数据存储
- Prisma 负责模型、迁移和查询
- Seed 脚本负责快速恢复测试数据

## 本地联调为什么会更顺

再加上一份可重复执行的 seed，我们就能在本地快速恢复一套完整测试数据，前台联调也会轻松很多。

\`\`\`
npm run prisma:migrate
npm run db:seed
npm run dev
\`\`\``,
    coverImage:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    categorySlug: "database-practice",
    tagSlugs: ["prisma", "sqlite"],
  },
  {
    title: "给文章建立分类与标签关系，让列表和详情页都更完整",
    slug: "connect-posts-categories-and-tags",
    excerpt: "分类负责主归档，标签负责横向主题连接，二者结合后更适合博客浏览与检索。",
    content: `## 分类和标签分别解决什么问题

这篇测试文章演示关联关系。分类更适合承担主导航和内容归档的职责，而标签适合描述具体技术主题。

当一篇文章同时具备分类和多个标签时，首页卡片可以在有限空间里传达更多信息，详情页也能在阅读结束后继续帮助用户理解文章的主题边界。

### 在技术博客里，我更推荐

- 用分类表达主主题，比如前端工程、数据库实践
- 用标签表达具体技术点，比如 Next.js、Prisma、SQLite
- 让文章详情页在开头就展示这些信息，降低读者理解成本

## 为什么这套模型更适合技术内容

这种模型对于技术博客尤其合适，因为同一篇文章往往同时涉及框架、数据库、样式系统和工程化工具。

\`\`\`
model PostTag {
  postId Int
  tagId  Int

  @@id([postId, tagId])
}
\`\`\``,
    coverImage:
      "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?auto=format&fit=crop&w=1200&q=80",
    categorySlug: "frontend-engineering",
    tagSlugs: ["nextjs", "prisma", "sqlite", "tailwind-css"],
  },
  {
    title: "RPA 项目落地前，应该先梳理哪些业务流程",
    slug: "how-to-scope-rpa-processes-before-implementation",
    excerpt: "RPA 成败往往不在脚本编写，而在于前期是否把流程边界、异常路径和人工介入点梳理清楚。",
    content: `## 为什么流程梳理比开发更重要

很多团队在启动 RPA 项目时，最先想到的是选平台、搭机器人和接系统接口，但真正决定效果的，往往是前期流程梳理是否扎实。

如果一个流程本身就存在大量灰度判断、频繁人工修正或规则未沉淀清楚，那么自动化上线后很容易陷入维护成本高、回报不稳定的状态。

### 在正式开发前，我通常会先确认

- 流程是否具有稳定输入和清晰输出
- 是否存在大量例外场景需要人工兜底
- 业务规则是否已经形成可复用的判断标准

## 一个适合先做的 RPA 场景长什么样

更适合优先自动化的流程，通常具备高频、重复、规则稳定和跨系统搬运数据的特征。

\`\`\`
适合自动化 = 高频执行 + 规则明确 + 异常可控 + 可量化收益
\`\`\`

当这些条件同时满足时，RPA 的价值会更容易被业务和管理层看见。`,
    coverImage:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
    categorySlug: "rpa-automation",
    tagSlugs: ["rpa", "automation", "uipath"],
  },
  {
    title: "UiPath 机器人从 POC 到生产环境的关键设计点",
    slug: "uipath-from-poc-to-production",
    excerpt: "POC 阶段能跑通不代表生产可用，真正上线前要补齐日志、异常处理、调度和可观测性。",
    content: `## POC 和生产环境之间差了什么

很多 RPA 机器人在验证阶段表现良好，但一进入生产环境就开始暴露问题，比如凭据管理混乱、异常流程不完整、日志不足以定位问题。

这不是工具本身的问题，而是自动化项目在架构层面没有提前考虑运行环境的复杂度。

### 我会重点补的四件事

- 为关键步骤增加结构化日志
- 把异常分成可重试和不可重试两类
- 单独管理机器人配置和凭据
- 给业务方预留明确的人工接管入口

## 生产级自动化更看重可维护性

一套真正能长期跑的 UiPath 方案，需要让开发、运维和业务都能看懂当前状态。

\`\`\`
Trigger -> Queue -> Bot -> Log -> Alert -> Human Review
\`\`\`

只有把运行链路设计清楚，自动化才不会变成新的黑盒系统。`,
    coverImage:
      "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80",
    categorySlug: "rpa-automation",
    tagSlugs: ["rpa", "uipath", "automation"],
  },
  {
    title: "Power BI 仪表盘设计中最容易被忽略的三个问题",
    slug: "three-common-power-bi-dashboard-mistakes",
    excerpt: "仪表盘不是把图表堆在一起，更关键的是指标定义、阅读路径和决策动作是否真正清晰。",
    content: `## 图表很多，不等于仪表盘有效

Power BI 项目里最常见的问题，不是技术做不到，而是页面做出来之后，业务仍然不知道该看哪里、如何解读、下一步要做什么。

一个有效的仪表盘应该把指标、趋势和风险提示组织成可连续阅读的路径，而不是把所有图表平均铺开。

### 最常见的三个问题

- 指标口径没有写清楚，导致不同团队理解不一致
- 页面层级不明确，重点信息没有被优先看到
- 交互过多但缺少结论，用户点了很多次仍然没有答案

## 好的 BI 页面更像一份可视化结论

图表只是承载信息的方式，真正有价值的是它能否帮助业务更快做出判断。

\`\`\`
指标定义清楚 + 阅读路径清楚 + 业务动作清楚 = 好的仪表盘
\`\`\``,
    coverImage:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    categorySlug: "bi-analytics",
    tagSlugs: ["bi", "power-bi"],
  },
  {
    title: "从 Excel 报表到 BI 看板：数据团队如何推动分析升级",
    slug: "from-excel-reporting-to-bi-dashboard",
    excerpt: "BI 升级不只是工具替换，而是从手工报表生产转向统一指标、统一语义和持续自助分析。",
    content: `## 为什么很多团队卡在 Excel 阶段

Excel 足够灵活，所以在业务早期几乎总是最快的方案。但当报表数量越来越多、口径越来越难统一时，Excel 会逐渐变成协作和追溯的瓶颈。

这时候引入 BI，不应该只是把原来的报表搬进新工具，而是重新定义指标体系和数据消费方式。

### 升级时最值得先做的事情

- 先统一核心指标口径
- 明确哪些分析适合标准化看板
- 建立从数据源到展示层的责任边界

## BI 的价值在于降低重复解释成本

当业务、分析师和管理层都基于同一套指标体系工作时，沟通会从“这个数对不对”转向“接下来怎么做”。

\`\`\`
数据源 -> 清洗建模 -> 指标口径 -> BI 看板 -> 业务动作
\`\`\``,
    coverImage:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    categorySlug: "bi-analytics",
    tagSlugs: ["bi", "power-bi", "sqlite"],
  },
  {
    title: "RPA 与 BI 结合时，如何让自动化真正服务经营分析",
    slug: "how-rpa-and-bi-work-together",
    excerpt: "RPA 负责取数和流程执行，BI 负责呈现和判断，两者结合后才能形成更完整的运营闭环。",
    content: `## 自动化和分析其实是同一条链路

很多团队把 RPA 和 BI 分成两个独立项目来做，结果一个负责搬运数据，一个负责展示结果，但彼此之间没有形成真正的业务闭环。

如果把两者放在同一个视角下看，RPA 更像数据与动作的执行层，BI 更像判断与反馈的呈现层。

### 一个更完整的闭环通常包括

- RPA 自动采集或整理业务数据
- BI 仪表盘持续展示关键指标变化
- 业务根据指标触发新的规则和动作

## 让自动化服务经营，而不是只服务效率

当 RPA 与 BI 协同时，自动化不再只是节省人力，而是开始帮助团队更快发现问题、验证假设和推动决策。

\`\`\`
RPA Collect -> Data Model -> BI Insight -> Business Action
\`\`\`

这也是我认为自动化项目更值得追求的长期价值。`,
    coverImage:
      "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?auto=format&fit=crop&w=1200&q=80",
    categorySlug: "rpa-automation",
    tagSlugs: ["rpa", "bi", "automation", "power-bi"],
  },
];

async function main() {
  const existingProfile = await prisma.siteProfile.findFirst({
    orderBy: { id: "asc" },
    select: { id: true },
  });

  if (existingProfile) {
    await prisma.siteProfile.update({
      where: { id: existingProfile.id },
      data: {
        name: siteProfile.name,
        title: siteProfile.title,
        heroIntro: siteProfile.heroIntro,
        bio: siteProfile.bio,
        avatar: siteProfile.avatar,
        ctaText: siteProfile.ctaText,
        ctaLink: siteProfile.ctaLink,
        skills: {
          deleteMany: {},
          create: siteProfile.skills.map((label, index) => ({
            label,
            sortOrder: index,
          })),
        },
      },
    });
  } else {
    await prisma.siteProfile.create({
      data: {
        name: siteProfile.name,
        title: siteProfile.title,
        heroIntro: siteProfile.heroIntro,
        bio: siteProfile.bio,
        avatar: siteProfile.avatar,
        ctaText: siteProfile.ctaText,
        ctaLink: siteProfile.ctaLink,
        skills: {
          create: siteProfile.skills.map((label, index) => ({
            label,
            sortOrder: index,
          })),
        },
      },
    });
  }

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name },
      create: category,
    });
  }

  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: { name: tag.name },
      create: tag,
    });
  }

  for (const post of posts) {
    const category = await prisma.category.findUniqueOrThrow({
      where: { slug: post.categorySlug },
    });

    const relatedTags = await prisma.tag.findMany({
      where: { slug: { in: post.tagSlugs } },
      select: { id: true },
    });

    await prisma.post.upsert({
      where: { slug: post.slug || slugify(post.title) },
      update: {
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        status: "PUBLISHED",
        seoTitle: post.title,
        seoDescription: post.excerpt,
        coverImage: post.coverImage,
        categoryId: category.id,
        tags: {
          deleteMany: {},
          create: relatedTags.map((tag) => ({
            tag: {
              connect: { id: tag.id },
            },
          })),
        },
      },
      create: {
        title: post.title,
        slug: post.slug || slugify(post.title),
        excerpt: post.excerpt,
        content: post.content,
        status: "PUBLISHED",
        seoTitle: post.title,
        seoDescription: post.excerpt,
        coverImage: post.coverImage,
        category: {
          connect: { id: category.id },
        },
        tags: {
          create: relatedTags.map((tag) => ({
            tag: {
              connect: { id: tag.id },
            },
          })),
        },
      },
    });
  }

  console.log("Seed completed with 8 posts, 4 categories, and 9 tags.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
