import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyAdminCookie } from "@/lib/auth";
import { slugify } from "@/lib/slug";

export async function GET() {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("admin-token")?.value;
  const isAdmin = verifyAdminCookie(token);

  const posts = await prisma.post.findMany({
    where: isAdmin ? undefined : { status: "PUBLISHED" },
    orderBy: { updatedAt: "desc" },
    include: {
      category: true,
      tags: { include: { tag: true } },
    },
  });

  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("admin-token")?.value;
  if (!verifyAdminCookie(token)) {
    return NextResponse.json({ message: "未授权" }, { status: 401 });
  }

  try {
    const data = await request.json();
    const {
      title,
      slug,
      excerpt,
      content,
      status,
      seoTitle,
      seoDescription,
      coverImage,
      category,
      tags,
    } = data;

    const publishedSlug = slugify(slug || title || "post");
    const categoryName = typeof category === "string" ? category.trim() : "";
    const tagNames = Array.isArray(tags)
      ? tags.map((item: string) => item.trim()).filter(Boolean)
      : [];

    const post = await prisma.post.create({
      data: {
        title,
        slug: publishedSlug,
        excerpt: excerpt || content.slice(0, 180),
        content,
        status: status === "PUBLISHED" ? "PUBLISHED" : "DRAFT",
        seoTitle,
        seoDescription,
        coverImage,
        category: categoryName
          ? {
              connectOrCreate: {
                where: { name: categoryName },
                create: { name: categoryName, slug: slugify(categoryName) },
              },
            }
          : undefined,
        tags: {
          create: tagNames.map((name) => ({
            tag: {
              connectOrCreate: {
                where: { name },
                create: { name, slug: slugify(name) },
              },
            },
          })),
        },
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Create post failed:", error);
    return NextResponse.json({ message: "保存失败，请检查文章信息或分类标签设置。" }, { status: 500 });
  }
}
