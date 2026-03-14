import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function DashboardPage() {
  const patientCount = await prisma.patient.count();
  const sessionCount = await prisma.activitySession.count();

  return (
    <div className="dashboard-grid">
      <div className="admin-card stats-card">
        <h3>Total de Pacientes</h3>
        <p className="stat-value">{patientCount}</p>
      </div>
      <div className="admin-card stats-card">
        <h3>Sessões Realizadas</h3>
        <p className="stat-value">{sessionCount}</p>
      </div>
      
      <div className="admin-card action-section" style={{ marginTop: '40px' }}>
         <h2>Atalhos Rápidos</h2>
         <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
            <Link href="/admin/patients" className="btn-primary" style={{ width: 'auto', padding: '12px 24px' }}>
               Gerir Pacientes
            </Link>
         </div>
      </div>
    </div>
  );
}
