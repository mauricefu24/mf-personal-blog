import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdminCookie } from "@/lib/auth";
import ProfileEditor from "./ProfileEditor";

export default async function AdminProfilePage() {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("admin-token")?.value;

  if (!verifyAdminCookie(token)) {
    redirect("/admin/login");
  }

  return (
    <main className="premium-shell mx-auto min-h-screen max-w-6xl px-6 py-10">
      <ProfileEditor />
    </main>
  );
}
