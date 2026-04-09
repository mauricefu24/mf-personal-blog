export type PostItem = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  status: "DRAFT" | "PUBLISHED";
  seoTitle: string | null;
  seoDescription: string | null;
  coverImage: string | null;
  updatedAt: string;
  category: { name: string } | null;
  tags: Array<{ tag: { name: string } }>;
};

export type FormState = {
  title: string;
  slug: string;
  category: string;
  tags: string;
  excerpt: string;
  content: string;
  status: "DRAFT" | "PUBLISHED";
  seoTitle: string;
  seoDescription: string;
  coverImage: string;
};

export const initialForm: FormState = {
  title: "",
  slug: "",
  category: "",
  tags: "",
  excerpt: "",
  content: "",
  status: "DRAFT",
  seoTitle: "",
  seoDescription: "",
  coverImage: "",
};
