import prisma from "@/lib/prisma";

type SiteProfileView = {
  id: number | string;
  name: string;
  title: string;
  heroIntro: string;
  bio: string;
  avatar: string;
  ctaText: string;
  ctaLink: string;
  updatedAt: Date | null;
  skills: Array<{
    id: number | string;
    label: string;
    sortOrder: number;
  }>;
};

export const defaultSiteProfile = {
  name: "Maurice",
  title: "专注工程实践的独立开发者",
  heroIntro:
    "这里聚焦 Next.js、Prisma、SQLite 与工程化经验。首页直接从 SQLite 读取已发布文章，展示分类、标签、发布时间与封面图，保持前台内容与后台数据同步。",
  bio:
    "我长期关注前端架构、自动化工作流和内容系统建设，也会持续记录技术产品从想法到上线的过程。如果你也在做个人产品、博客系统或效率工具，这里会有不少真实实践。",
  avatar: "",
  ctaText: "查看更多文章",
  ctaLink: "#posts",
  skills: ["Next.js", "Prisma", "SQLite", "Automation", "Low-Code"],
} as const;

export async function getSiteProfile() {
  return prisma.siteProfile.findFirst({
    include: {
      skills: {
        orderBy: { sortOrder: "asc" },
      },
    },
    orderBy: { id: "asc" },
  });
}

export async function getSiteProfileWithFallback(): Promise<SiteProfileView> {
  const profile = await getSiteProfile();

  if (!profile) {
    return {
      id: "fallback-profile",
      ...defaultSiteProfile,
      updatedAt: null,
      skills: defaultSiteProfile.skills.map((label, index) => ({
        id: `fallback-${index}`,
        label,
        sortOrder: index,
      })),
    };
  }

  return {
    id: profile.id,
    name: profile.name,
    title: profile.title,
    heroIntro: profile.heroIntro,
    bio: profile.bio,
    ctaText: profile.ctaText,
    ctaLink: profile.ctaLink,
    updatedAt: profile.updatedAt,
    avatar: profile.avatar ?? "",
    skills: profile.skills.map((skill) => ({
      id: skill.id,
      label: skill.label,
      sortOrder: skill.sortOrder,
    })),
  };
}
