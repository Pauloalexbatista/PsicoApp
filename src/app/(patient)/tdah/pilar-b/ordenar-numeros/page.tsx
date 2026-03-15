import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import OrderNumbersGame from "./OrderNumbersGame";

export default async function OrderNumbersPage() {
  const session = await getSession();
  if (!session || session.user.role !== 'PATIENT') redirect('/login');

  const module = await prisma.module.findFirst({
    where: { name: 'TDAH' }
  });

  if (!module) return <div>Módulo não encontrado</div>;

  return (
    <div style={{ padding: '24px', borderRadius: '20px', minHeight: '100vh' }}>
      <header style={{ marginBottom: '32px' }}>
         <Link href="/tdah/pilar-b" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 500 }}>← Voltar aos Jogos</Link>
         <h1 style={{ marginTop: '16px' }}>🔢 Ordenar Números</h1>
         <p style={{ color: 'var(--text-muted)' }}>Treina a tua capacidade de raciocínio lógico e velocidade.</p>
      </header>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
         <OrderNumbersGame patientId={session.user.id} moduleId={module.id} />
      </div>
    </div>
  );
}
