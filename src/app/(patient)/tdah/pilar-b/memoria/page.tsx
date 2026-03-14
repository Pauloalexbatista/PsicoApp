import { getSession } from "@/lib/auth";
import Link from "next/link";
import MemoryGame from "./MemoryGame";
import { prisma } from "@/lib/prisma";

export default async function MemoriaPage() {
  const session = await getSession();
  const patientId = session?.user?.id as string || "";
  const tdahModule = await prisma.module.findUnique({ where: { name: "TDAH" } });
  const moduleId = tdahModule?.id || "";

  return (
    <div className="pilar-page">
      <header style={{ marginBottom: '32px' }}>
        <Link href="/tdah/pilar-b" className="back-link">← Voltar</Link>
        <h1 style={{ marginTop: '16px' }}>🧠 Memória de Animais</h1>
        <p style={{ color: 'var(--text-muted)' }}>Treina a tua memória curta encontrando os pares.</p>
      </header>
      
      <MemoryGame patientId={patientId} moduleId={moduleId} />
    </div>
  );
}
