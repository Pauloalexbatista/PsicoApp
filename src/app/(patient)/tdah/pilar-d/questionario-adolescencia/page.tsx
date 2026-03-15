import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import AdolescenceQuestionnaire from "./AdolescenceQuestionnaire";

export default async function AdolescencePage() {
  const session = await getSession();
  if (!session || session.user.role !== 'PATIENT') redirect('/login');

  const module = await prisma.module.findFirst({
    where: { name: 'TDAH' }
  });

  if (!module) return <div>Módulo não encontrado</div>;

  return (
    <div style={{ padding: '24px', borderRadius: '20px', minHeight: '100vh', paddingBottom: '100px' }}>
      <header style={{ marginBottom: '32px' }}>
         <Link href="/tdah/pilar-d" style={{ color: '#4f46e5', textDecoration: 'none', fontWeight: 500 }}>← Voltar aos Testes</Link>
         <h1 style={{ marginTop: '16px' }}>📝 Questionário da Adolescência</h1>
         <p style={{ color: 'var(--text-muted)' }}>Mede as tuas reações nas diferentes áreas da vida.</p>
      </header>

      <div style={{ margin: '0 auto' }}>
         <AdolescenceQuestionnaire patientId={session.user.id} moduleId={module.id} />
      </div>
    </div>
  );
}
