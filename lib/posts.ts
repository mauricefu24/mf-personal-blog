import prisma from "@/lib/prisma";

const postInclude = {
  category: true,
  tags: { include: { tag: true } },
} as const;

export async function getPublishedPosts() {
  return prisma.post.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { updatedAt: "desc" },
    include: postInclude,
  });
}

export async function getPublishedPostBySlug(slug: string) {
  return prisma.post.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: postInclude,
  });
}

export async function getPublishedPostSlugs() {
  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true },
  });

  return posts.map((post) => ({ slug: post.slug }));
}
