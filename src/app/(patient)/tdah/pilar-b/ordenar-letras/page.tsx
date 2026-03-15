import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import OrderLettersGame from "./OrderLettersGame";

export default async function OrderLettersPage() {
  const session = await getSession();
  if (!session || session.user.role !== 'PATIENT') redirect('/login');

  const module = await prisma.module.findFirst({
    where: { name: 'TDAH' }
  });

  if (!module) return <div>Módulo não encontrado</div>;

  return (
    <div style={{ padding: '24px', borderRadius: '20px', minHeight: '100vh' }}>
      <header style={{ marginBottom: '32px' }}>
         <Link href="/tdah/pilar-b" style={{ color: '#ec4899', textDecoration: 'none', fontWeight: 500 }}>← Voltar aos Jogos</Link>
         <h1 style={{ marginTop: '16px' }}>🔤 Ordenar Letras</h1>
         <p style={{ color: 'var(--text-muted)' }}>Treina a tua capacidade de sequenciação e atenção.</p>
      </header>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
         <OrderLettersGame patientId={session.user.id} moduleId={module.id} />
      </div>
    </div>
  );
}
