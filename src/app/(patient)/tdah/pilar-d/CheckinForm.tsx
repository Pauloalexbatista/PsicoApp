"use client";

import { useTransition, useState, useEffect } from "react";
import { submitCheckin } from "./actions";

export default function CheckinForm() {
  const [isPending, startTransition] = useTransition();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedSleep, setSelectedSleep] = useState<string>("😐");
  
  const handleClientSubmit = (formData: FormData) => {
    formData.append("sleep", selectedSleep);
    startTransition(async () => {
      const result = await submitCheckin(formData);
      if (result.success) {
         setSuccessMsg(`Receada com sucesso! Ganhaste +${result.reward} Dopas!`);
         setErrorMsg(null);
      } else {
         setErrorMsg(result.error || "Erro. Tenta novamente.");
         setSuccessMsg(null);
      }
    });
  };

  return (
    <>
        {successMsg && (
            <div style={{ padding: '16px', background: 'rgba(34, 197, 94, 0.2)', color: '#22c55e', borderRadius: '12px', marginBottom: '24px', textAlign: 'center', fontWeight: 'bold' }}>
                {successMsg}
            </div>
        )}

        {errorMsg && (
            <div style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', borderRadius: '12px', marginBottom: '24px', textAlign: 'center', fontWeight: 'bold' }}>
                {errorMsg}
            </div>
        )}

        <form action={handleClientSubmit} className="checkin-form" style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            padding: '32px',
            borderRadius: '24px'
        }}>
            <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '12px', color: 'var(--text-muted)' }}>Nível de Foco Hoje (1-10)</label>
            <input type="range" name="focus" min="1" max="10" defaultValue="5" style={{ width: '100%', accentColor: 'var(--accent-primary)', cursor: 'pointer' }} />
            </div>
            
            <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '12px', color: 'var(--text-muted)' }}>Qualidade do Sono</label>
            <div className="sleep-selector" style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px',
                background: 'rgba(0,0,0,0.2)',
                borderRadius: '12px'
            }}>
                {["😫", "😕", "😐", "🙂", "🤩"].map(emoji => (
                    <button 
                       key={emoji}
                       type="button" 
                       onClick={() => setSelectedSleep(emoji)}
                       style={{ 
                          fontSize: '1.8rem', 
                          background: selectedSleep === emoji ? 'var(--accent-primary)' : 'transparent',
                          border: 'none',
                          borderRadius: '50%',
                          width: '45px',
                          height: '45px',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                       }}>
                       {emoji}
                    </button>
                ))}
            </div>
            </div>

            <button type="submit" className="login-button" style={{ marginTop: '24px' }} disabled={isPending || successMsg !== null}>
               {isPending ? "A enviar..." : successMsg ? "Registado!" : "Enviar Registo"}
            </button>
        </form>
    </>
  );
}
