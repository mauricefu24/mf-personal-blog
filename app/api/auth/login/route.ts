import { NextResponse } from "next/server";
import { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_COOKIE_NAME, ADMIN_TOKEN } from "@/lib/auth";

export async function POST(request: Request) {
  const data = await request.json();
  const { email, password } = data ?? {};

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return NextResponse.json({ message: "登录失败，用户名或密码错误。" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE_NAME, ADMIN_TOKEN, {
    httpOnly: true,
    path: "/",
    sameSite: "strict",
    maxAge: 60 * 60,
  });
  return response;
}
