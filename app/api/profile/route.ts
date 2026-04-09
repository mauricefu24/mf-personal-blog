import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminCookie } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { defaultSiteProfile, getSiteProfile } from "@/lib/site-profile";

function normalizeSkills(skills: unknown) {
  if (!Array.isArray(skills)) {
    return [];
  }

  return skills
    .map((skill) => {
      if (typeof skill === "string") {
        return skill.trim();
      }

      if (skill && typeof skill === "object" && "label" in skill && typeof skill.label === "string") {
        return skill.label.trim();
      }

      return "";
    })
    .filter(Boolean);
}

export async function GET() {
  try {
    const profile = await getSiteProfile();

    if (!profile) {
      return NextResponse.json({
        ...defaultSiteProfile,
        avatar: defaultSiteProfile.avatar,
        skills: defaultSiteProfile.skills.map((label, index) => ({
          id: `fallback-${index}`,
          label,
          sortOrder: index,
        })),
        isFallback: true,
        updatedAt: null,
      });
    }

    return NextResponse.json({
      ...profile,
      avatar: profile.avatar ?? "",
      isFallback: false,
    });
  } catch (error) {
    console.error("Load profile failed:", error);
    return NextResponse.json({ message: "加载关于我配置失败。" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("admin-token")?.value;

  if (!verifyAdminCookie(token)) {
    return NextResponse.json({ message: "未授权" }, { status: 401 });
  }

  try {
    const data = await request.json();
    const name = typeof data?.name === "string" ? data.name.trim() : "";
    const title = typeof data?.title === "string" ? data.title.trim() : "";
    const heroIntro = typeof data?.heroIntro === "string" ? data.heroIntro.trim() : "";
    const bio = typeof data?.bio === "string" ? data.bio.trim() : "";
    const avatar = typeof data?.avatar === "string" ? data.avatar.trim() : "";
    const ctaText = typeof data?.ctaText === "string" ? data.ctaText.trim() : "";
    const ctaLink = typeof data?.ctaLink === "string" ? data.ctaLink.trim() : "";
    const skills = normalizeSkills(data?.skills);

    if (!name || !title || !heroIntro || !bio || !ctaText || !ctaLink) {
      return NextResponse.json({ message: "请完整填写关于我模块内容。" }, { status: 400 });
    }

    const existing = await prisma.siteProfile.findFirst({
      orderBy: { id: "asc" },
      select: { id: true },
    });

    const payload = {
      name,
      title,
      heroIntro,
      bio,
      avatar: avatar || null,
      ctaText,
      ctaLink,
      skills: {
        deleteMany: {},
        create: skills.map((label, index) => ({
          label,
          sortOrder: index,
        })),
      },
    };

    const profile = existing
      ? await prisma.siteProfile.update({
          where: { id: existing.id },
          data: payload,
          include: { skills: { orderBy: { sortOrder: "asc" } } },
        })
      : await prisma.siteProfile.create({
          data: payload,
          include: { skills: { orderBy: { sortOrder: "asc" } } },
        });

    return NextResponse.json({
      ...profile,
      avatar: profile.avatar ?? "",
      isFallback: false,
    });
  } catch (error) {
    console.error("Save profile failed:", error);
    return NextResponse.json({ message: "保存关于我模块失败，请稍后重试。" }, { status: 500 });
  }
}
