import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdminCookie } from "@/lib/auth";
import AdminView from "./AdminView";

export default async function AdminPage() {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("admin-token")?.value;

  if (!verifyAdminCookie(token)) {
    redirect("/admin/login");
  }

  return (
    <main className="min-h-screen premium-shell">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <AdminView />
      </div>
    </main>
  );
}
