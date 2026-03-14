import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import PatientHistoryTable from "./PatientHistoryTable";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PatientHistoryPage(props: Props) {
  const session = await getSession();
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  // Desestruturar params
  const { id } = await props.params;

  // Encontrar o doente e cruzar com as sessões de jogo/testes
  const patient = await prisma.patient.findUnique({
    where: { id: id },
    include: {
      sessions: {
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!patient) return notFound();

  return (
    <div className="patients-container">
      <header className="section-header" style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '32px' }}>
        <Link href="/admin/patients" className="action-btn" style={{ textDecoration: 'none', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
           ← Voltar
        </Link>
        <div>
           <h2 style={{ margin: 0 }}>Histórico Clínico: {patient.name}</h2>
           <p style={{ color: 'var(--text-muted)', margin: 0 }}>Utilizador: {patient.username} | Criado a: {new Date(patient.createdAt).toLocaleDateString()}</p>
        </div>
      </header>

      <div className="dashboard-grid">
        <div className="admin-card stats-card">
          <h3>Progresso XP</h3>
          <p className="stat-value" style={{ fontSize: '2rem', fontWeight: 800 }}>Nível {patient.level}</p>
          <p style={{ color: 'var(--text-muted)' }}>{patient.xp} Pontos de Experiência Totais</p>
        </div>
        <div className="admin-card stats-card">
          <h3>Dopas (Moeda)</h3>
          <p className="stat-value" style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-primary)' }}>{patient.dopas} 🪙</p>
          <p style={{ color: 'var(--text-muted)' }}>Disponíveis para gastar</p>
        </div>
      </div>

      <PatientHistoryTable sessions={patient.sessions} />

    </div>
  );
}
