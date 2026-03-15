import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import DiarioForm from "./DiarioForm";

export default async function DiarioGanhosPage() {
  const session = await getSession();
  if (!session || session.user.role !== 'PATIENT') redirect('/login');

  const module = await prisma.module.findFirst({
    where: { name: 'TDAH' }
  });

  if (!module) return <div>Módulo não encontrado</div>;

  return (
    <div style={{ padding: '24px', borderRadius: '20px', minHeight: '100vh' }}>
      <header style={{ marginBottom: '32px' }}>
         <Link href="/tdah/pilar-d" style={{ color: '#10b981', textDecoration: 'none', fontWeight: 500 }}>← Voltar aos Check-ins</Link>
         <h1 style={{ marginTop: '16px' }}>📝 Diário de Ganhos</h1>
         <p style={{ color: 'var(--text-muted)' }}>Regista as pequenas vitórias do teu dia! Não há vitórias pequenas demais.</p>
      </header>

      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
         <DiarioForm patientId={session.user.id} moduleId={module.id} />
      </div>
    </div>
  );
}
