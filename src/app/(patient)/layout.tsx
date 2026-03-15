import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import "./patient.css";
import DailyCheckinModal from "@/components/DailyCheckinModal";

import { logoutAction } from "./actions";

export default async function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session || session.user.role !== "PATIENT") {
    redirect("/login");
  }

  const patient = await prisma.patient.findUnique({
    where: { id: session.user.id }
  });

  const activeModule = await prisma.module.findFirst({
    where: { name: 'TDAH' }
  });

  return (
    <div className="patient-app">
      <header className="hud">
        <div className="hud-left">
          <div className="avatar">
            <span className="lvl">Lvl {patient?.level}</span>
          </div>
          <div className="stats">
            <p className="patient-name">{patient?.name}</p>
            <div className="xp-bar">
               <div className="xp-progress" style={{ width: `${(patient?.xp ?? 0) % 100}%` }}></div>
            </div>
          </div>
        </div>
        <div className="hud-right" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="dopa-counter">
             💎 <span>{patient?.dopas}</span>
          </div>
          <form action={logoutAction}>
            <button type="submit" className="logout-btn" title="Terminar Sessão">
              🚪
            </button>
          </form>
        </div>
      </header>
      
      <main className="content">
        {children}
        {patient && activeModule && (
           <DailyCheckinModal patientId={patient.id} moduleId={activeModule.id} />
        )}
      </main>

      <nav className="bottom-nav">
         <Link href="/tdah" className="nav-item" title="Dashboard">🏠</Link>
         <Link href="/tdah/pilar-a" className="nav-item" title="Áudios">🎧</Link>
         <Link href="/tdah/pilar-b" className="nav-item" title="Jogos">🎮</Link>
         <Link href="/tdah/pilar-c" className="nav-item" title="Missões">🚀</Link>
         <Link href="/tdah/pilar-d" className="nav-item" title="Check-in">📝</Link>
      </nav>
    </div>
  );
}
