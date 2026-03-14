import Link from "next/link";

export default function PilarBPage() {
  return (
    <div className="pilar-page">
      <header style={{ marginBottom: '32px' }}>
        <Link href="/" className="back-link">← Voltar</Link>
        <h1 style={{ marginTop: '16px' }}>🎮 Neuro-Games</h1>
        <p style={{ color: 'var(--text-muted)' }}>Escolhe um jogo para treinares o teu cérebro hoje.</p>
      </header>
      
      <div className="pillar-grid">
        <Link href="/tdah/pilar-b/memoria" style={{ textDecoration: 'none' }}>
          <div className="pillar-card">
            <span className="pillar-icon">🧠</span>
            <span className="pillar-title">Memória de Animais</span>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '4px' }}>Treina a memória curta</p>
          </div>
        </Link>
        
        <Link href="/tdah/pilar-b/reflexos" style={{ textDecoration: 'none' }}>
           <div className="pillar-card">
            <span className="pillar-icon">⚡</span>
            <span className="pillar-title">Caça-Luzes</span>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '4px' }}>Atenção e reflexos rápidos</p>
          </div>
        </Link>
        
        <div className="pillar-card" style={{ opacity: 0.6 }}>
          <span className="pillar-icon">🧩</span>
          <span className="pillar-title">Puzzle Espacial</span>
           <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '4px' }}>Em Breve</p>
        </div>
      </div>
    </div>
  );
}
