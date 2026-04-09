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
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)]">
      <div className="mx-auto max-w-7xl px-6 py-10">
      <AdminView />
      </div>
    </main>
  );
}
