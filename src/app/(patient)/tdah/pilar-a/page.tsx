import { getSession } from "@/lib/auth";
import Link from "next/link";
import AudioHackPlayer from "./AudioHackPlayer";
import { prisma } from "@/lib/prisma";

export default async function PilarAPage() {
  const session = await getSession();
  const patientId = session?.user?.id as string || "";
  const tdahModule = await prisma.module.findUnique({ where: { name: "TDAH" } });
  const moduleId = tdahModule?.id || "";

  return (
    <div className="pilar-page">
      <header style={{ marginBottom: '32px' }}>
        <Link href="/" className="back-link">← Voltar</Link>
        <h1 style={{ marginTop: '16px' }}>🎧 Audio-Hacks</h1>
        <p style={{ color: 'var(--text-muted)' }}>Cápsulas de conhecimento para dominares o teu cérebro.</p>
      </header>

      <div className="audio-card">
        <h3>A Ciência do Foco</h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
          Ouve esta faixa imersiva (gerada em tempo real) para entenderes como usar a tua dopamina.
        </p>
        <AudioHackPlayer patientId={patientId} moduleId={moduleId} />
      </div>
    </div>
  );
}
