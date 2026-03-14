import { getSession } from "@/lib/auth";

import Link from "next/link";
import { redirect } from "next/navigation";

export default async function PatientPortal() {
  const session = await getSession();
  if (!session || session.user.role !== 'PATIENT') {
    redirect('/login');
  }

  const pillars = [
    { title: 'Audio-Hacks', icon: '🎧', href: '/tdah/pilar-a', color: 'var(--accent-primary)' },
    { title: 'Neuro-Games', icon: '🎮', href: '/tdah/pilar-b', color: 'var(--accent-secondary)' },
    { title: 'Missões de Campo', icon: '🏃', href: '/tdah/pilar-c', color: 'var(--accent-tertiary)' },
    { title: 'Check-in & Testes', icon: '📊', href: '/tdah/pilar-d', color: '#10b981' },
  ];

  return (
    <div className="patient-portal">
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Olá, {session.user.name.split(' ')[0]}! 👋</h1>
        <p style={{ color: 'var(--text-muted)' }}>Pronto para a missão de hoje?</p>
      </header>

      <div className="pillar-grid">
        {pillars.map((p, i) => (
          <Link key={i} href={p.href} style={{ textDecoration: 'none' }}>
            <div className="pillar-card" style={{ borderTop: `4px solid ${p.color}` }}>
              <span className="pillar-icon">{p.icon}</span>
              <span className="pillar-title">{p.title}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
