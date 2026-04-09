import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyAdminCookie } from "@/lib/auth";
import { slugify } from "@/lib/slug";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
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

    const post = await prisma.post.update({
      where: { id: Number(params.id) },
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
          : { disconnect: true },
        tags: {
          deleteMany: {},
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
    console.error("Update post failed:", error);
    return NextResponse.json({ message: "更新失败，请检查标题、分类或标签是否存在冲突。" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const cookiesStore = await cookies();
  const token = cookiesStore.get("admin-token")?.value;
  if (!verifyAdminCookie(token)) {
    return NextResponse.json({ message: "未授权" }, { status: 401 });
  }

  try {
    await prisma.post.delete({ where: { id: Number(params.id) } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Delete post failed:", error);
    return NextResponse.json({ message: "删除失败，请稍后重试。" }, { status: 500 });
  }
}
