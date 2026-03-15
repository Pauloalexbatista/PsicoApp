"use client";

import Link from "next/link";
import { useState } from "react";

export default function PilarDPage({ patientId }: { patientId?: string }) {
  const openHumorModal = () => {
     // A hack to force the layout modal to show again if they click here
     // Alternatively, we could manage state via Context, but for now we'll just clear the local storage item and reload
     // Or we can just build a quick local version of the form here later if needed.
     
     // The quickest way given the current structure without rewriting layout state:
     const today = new Date().toISOString().split('T')[0];
     // We clear any checkin record manually so the Modal triggers.
     if (typeof window !== 'undefined') {
       // Find any existing daily checkin markers in local storage
       for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('daily_checkin_')) {
             localStorage.removeItem(key);
          }
       }
       // Reload page to trigger the modal again from layout
       window.location.reload();
     }
  };

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
        
        <Link href="/tdah/pilar-d/questionario-adolescencia" style={{ textDecoration: 'none' }}>
          <div className="pillar-card">
            <span className="pillar-icon">🧑‍🎓</span>
            <span className="pillar-title">Questionário Adolescência</span>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '4px' }}>60 Questões</p>
          </div>
        </Link>
        
        <div className="pillar-card" onClick={openHumorModal} style={{ cursor: 'pointer' }}>
          <span className="pillar-icon">🎭</span>
          <span className="pillar-title">Humor & Sono</span>
           <p style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', textAlign: 'center', marginTop: '4px' }}>Alterar o de Hoje</p>
        </div>
      </div>
    </div>
  );
}
