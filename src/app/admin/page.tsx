import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { adminConfigured } from "@/lib/admin-auth";
import { listEntries, listInquiries } from "@/lib/admin-store";
import { AdminDashboard } from "./dashboard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  if (!adminConfigured()) redirect("/admin/login");
  return (
    <AdminDashboard
      initialEntries={listEntries()}
      initialInquiries={listInquiries()}
    />
  );
}
