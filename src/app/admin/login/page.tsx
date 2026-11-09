import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "../login-form";
import { isAdmin, adminConfigured } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect("/admin");
  const configured = adminConfigured();
  return (
    <section className="admin-shell section">
      <div className="admin-login-card">
        <span className="eyebrow">ATLaS / ADMIN</span>
        <h1>Sign in</h1>
        <p>
          Manage published products, client work and incoming project inquiries.
        </p>
        {configured ? (
          <AdminLoginForm />
        ) : (
          <div className="admin-setup-note">
            Admin access is not configured yet. Add the required admin settings
            to <code>.env.local</code> and restart the website.
          </div>
        )}
      </div>
    </section>
  );
}
