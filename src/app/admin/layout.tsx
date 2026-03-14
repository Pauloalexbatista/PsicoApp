import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import "./admin.css";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">PsicoApp</div>
        <nav className="nav-links">
          <Link href="/admin/dashboard" className="nav-link">
            Dashboard
          </Link>
          <Link href="/admin/patients" className="nav-link">
            Pacientes
          </Link>
          <Link href="/admin/modules" className="nav-link">
            Módulos
          </Link>
        </nav>
        <div className="sidebar-footer">
          <div className="user-info">
            <p className="user-name">{session.user.name}</p>
            <p className="user-role">Psicóloga</p>
          </div>
        </div>
      </aside>
      <main className="main-content">
        <header className="admin-header">
          <h1>Painel de Gestão</h1>
          <div className="user-profile">
            {/* Future: Logout Action */}
            <form action="/api/auth/logout" method="POST">
               <button type="submit" className="logout-btn">Sair</button>
            </form>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
