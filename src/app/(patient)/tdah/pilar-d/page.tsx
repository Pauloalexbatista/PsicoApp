import Link from "next/link";

export default function PilarDPage() {
  return (
    <div className="pilar-page">
      <header style={{ marginBottom: '32px' }}>
        <Link href="/" className="back-link">← Voltar</Link>
        <h1 style={{ marginTop: '16px' }}>📊 Check-in & Testes</h1>
        <p style={{ color: 'var(--text-muted)' }}>Mede o teu progresso hoje e responde a questionários clínicos rápidos.</p>
      </header>
      
      <div className="pillar-grid">
        <Link href="/tdah/pilar-d/diario" style={{ textDecoration: 'none' }}>
          <div className="pillar-card">
            <span className="pillar-icon">📝</span>
            <span className="pillar-title">Diário de Ganhos</span>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '4px' }}>Registo Diário</p>
          </div>
        </Link>
        
        <div className="pillar-card" style={{ opacity: 0.6 }}>
          <span className="pillar-icon">😰</span>
          <span className="pillar-title">Ansiedade (GAD-7)</span>
           <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '4px' }}>Em Breve</p>
        </div>
        
        <div className="pillar-card" style={{ opacity: 0.6 }}>
          <span className="pillar-icon">🎭</span>
          <span className="pillar-title">Humor & Sono</span>
           <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '4px' }}>Em Breve</p>
        </div>
      </div>
    </div>
  );
}
