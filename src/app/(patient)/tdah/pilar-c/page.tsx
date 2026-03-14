import Link from "next/link";

export default async function PilarCPage() {
  const missions = [
    { title: 'Arrumar a Secretaria', desc: 'Organiza o teu espaço de trabalho em 5 minutos.', reward: 40, icon: '🧹' },
    { title: 'Checklist da Mochila', desc: 'Verifica todos os materiais para amanhã.', reward: 30, icon: '🎒' },
    { title: 'Pausa Ativa', desc: 'Faz 10 polichinelos entre sessões de estudo.', reward: 20, icon: '⚡' },
  ];

  return (
    <div className="pilar-page">
      <header style={{ marginBottom: '32px' }}>
        <Link href="/" className="back-link">← Voltar</Link>
        <h1 style={{ marginTop: '16px' }}>🏃 Missões de Campo</h1>
        <p style={{ color: 'var(--text-muted)' }}>Desafios práticos para o mundo real.</p>
      </header>

      <div className="mission-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {missions.map((m, i) => (
          <div key={i} className="mission-card" style={{ 
            background: 'var(--card-bg)', 
            border: '1px solid var(--card-border)',
            padding: '24px',
            borderRadius: '20px',
            display: 'flex',
            gap: '20px'
          }}>
            <div className="mission-icon" style={{ fontSize: '2rem' }}>{m.icon}</div>
            <div className="mission-body" style={{ flex: 1 }}>
              <h3 style={{ marginBottom: '4px' }}>{m.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '16px' }}>{m.desc}</p>
              <div className="mission-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="reward" style={{ color: 'var(--accent-tertiary)', fontWeight: '700', fontSize: '0.875rem' }}>+{m.reward} Dopas</span>
                <button className="action-btn">Concluir</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
