import Link from "next/link";
import CacaLuzes from "./CacaLuzes";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function ReflexosPage() {
  const session = await getSession();
  const patientId = session?.user?.id as string || "";
  const tdahModule = await prisma.module.findUnique({ where: { name: "TDAH" } });
  const moduleId = tdahModule?.id || "";

  return (
    <div className="pilar-page">
      <header style={{ marginBottom: '32px' }}>
        <Link href="/tdah/pilar-b" className="back-link">← Voltar</Link>
        <h1 style={{ marginTop: '16px' }}>⚡ Caça-Luzes</h1>
        <p style={{ color: 'var(--text-muted)' }}>Treina a tua atenção e tempo de resposta.</p>
      </header>

      <CacaLuzes patientId={patientId} moduleId={moduleId} />
    </div>
  );
}
