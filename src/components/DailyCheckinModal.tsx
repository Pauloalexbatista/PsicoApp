"use client";

import { useState, useEffect } from "react";
import { completeDailyCheckin } from "@/app/(patient)/tdah/pilar-d/actions";

export default function DailyCheckinModal({ patientId, moduleId }: { patientId: string; moduleId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [humor, setHumor] = useState(5);
  const [sleep, setSleep] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Check locally if already filled today
    const lastCheckin = localStorage.getItem(`daily_checkin_${patientId}`);
    const today = new Date().toISOString().split('T')[0];

    if (lastCheckin !== today) {
      // Small delay so it pops up slightly after page load
      const timer = setTimeout(() => setIsOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [patientId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const dataStr = JSON.stringify({ humor, qualidade_sono: sleep });
      await completeDailyCheckin(patientId, moduleId, dataStr);
      
      const today = new Date().toISOString().split('T')[0];
      localStorage.setItem(`daily_checkin_${patientId}`, today);
      
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to save checkin", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>☀️ Bom Dia! Como estás hoje?</h2>
          <p>Para poderes treinar ao máximo, precisamos de saber como te sentes na base espacial!</p>
        </div>

        <form onSubmit={handleSubmit} className="checkin-form">
          <div className="form-group">
            <label>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>🎭 Humor Hoje</span>
                <span style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>{humor}/10</span>
              </div>
            </label>
            <input 
              type="range" 
              min="0" max="10" 
              value={humor} 
              onChange={(e) => setHumor(Number(e.target.value))}
              className="slider"
            />
            <div className="slider-labels">
               <span>Péssimo 😞</span>
               <span>Fantástico 🤩</span>
            </div>
          </div>

          <div className="form-group">
            <label>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>💤 Qualidade de Sono</span>
                <span style={{ fontWeight: 600, color: '#3b82f6' }}>{sleep}/10</span>
              </div>
            </label>
            <input 
              type="range" 
              min="0" max="10" 
              value={sleep} 
              onChange={(e) => setSleep(Number(e.target.value))}
              className="slider slider-blue"
            />
             <div className="slider-labels">
               <span>Dormi Mal 😫</span>
               <span>Dormi Muito Bem 😴</span>
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'A Enviar...' : 'Gravar Check-in ✅'}
          </button>
        </form>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 24px;
        }
        .modal-content {
          background: #fff;
          border-radius: 24px;
          padding: 32px;
          max-width: 480px;
          width: 100%;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes slideUp {
          from { transform: translateY(40px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .modal-header {
          text-align: center;
          margin-bottom: 32px;
        }
        .modal-header h2 {
          color: var(--text-primary);
          margin-bottom: 8px;
        }
        .modal-header p {
          color: var(--text-muted);
          font-size: 0.95rem;
        }
        .checkin-form {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }
        .form-group label {
          font-weight: 500;
          color: var(--text-primary);
          display: block;
        }
        .slider {
          -webkit-appearance: none;
          width: 100%;
          height: 12px;
          border-radius: 6px;
          background: #f1f5f9;
          outline: none;
        }
        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--accent-primary);
          cursor: pointer;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .slider-blue::-webkit-slider-thumb {
          background: #3b82f6;
        }
        .slider-labels {
           display: flex;
           justify-content: space-between;
           font-size: 0.8rem;
           color: var(--text-muted);
           margin-top: 8px;
        }
        .btn-primary {
          background: #10b981; /* Green to say Go */
          color: white;
          padding: 16px;
          border: none;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          margin-top: 8px;
          transition: transform 0.2s, background 0.2s;
        }
        .btn-primary:hover:not(:disabled) {
          background: #059669;
        }
        .btn-primary:active:not(:disabled) {
          transform: scale(0.98);
        }
        .btn-primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
