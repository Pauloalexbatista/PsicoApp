"use client";

import { useState } from "react";
import { completeDiarioCheckin } from "../actions";

export default function DiarioForm({ patientId, moduleId }: { patientId: string; moduleId: string }) {
   const [entry, setEntry] = useState("");
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [success, setSuccess] = useState(false);

   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     if (!entry.trim()) return;
     
     setIsSubmitting(true);
     
     try {
       await completeDiarioCheckin(patientId, moduleId, entry);
       setSuccess(true);
       setEntry("");
     } catch (error) {
       console.error("Erro a submeter diário", error);
     } finally {
       setIsSubmitting(false);
     }
   };

   if (success) {
     return (
       <div style={{ textAlign: 'center', padding: '40px 20px', background: '#ecfdf5', borderRadius: '16px', border: '2px solid #a7f3d0' }}>
          <h2 style={{ fontSize: '3rem', margin: '0 0 16px', animation: 'bounce 1s infinite' }}>🎉</h2>
          <h3 style={{ color: '#059669', marginBottom: '8px' }}>Grande Vitória Raciocinada!</h3>
          <p style={{ color: '#047857' }}>Ganhos registados na base de dados galática. Ganhaste 10 Dopas extra!</p>
          <button 
             onClick={() => setSuccess(false)}
             style={{ marginTop: '24px', background: '#10b981', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}
          >
             Escrever Mais
          </button>
       </div>
     );
   }

   return (
      <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '32px', borderRadius: '20px', boxShadow: 'var(--card-shadow)'}}>
         <label style={{ display: 'block', marginBottom: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
            O que correu bem hoje? O que conseguiste fazer que te deixou orgulhoso(a)?
         </label>
         <textarea 
            value={entry}
            onChange={e => setEntry(e.target.value)}
            placeholder="Ex: Hoje consegui focar-me nos trabalhos de casa durante 30 minutos sem pegar no telemóvel!"
            style={{ 
               width: '100%', 
               minHeight: '150px', 
               padding: '16px', 
               borderRadius: '12px', 
               border: '2px solid #e2e8f0',
               fontSize: '1rem',
               resize: 'vertical',
               fontFamily: 'inherit',
               marginBottom: '24px'
            }}
         />
         
         <button 
            type="submit" 
            disabled={isSubmitting || !entry.trim()}
            style={{
               width: '100%',
               padding: '16px',
               borderRadius: '12px',
               background: entry.trim() ? '#10b981' : '#cbd5e1',
               color: 'white',
               fontWeight: 600,
               fontSize: '1.1rem',
               border: 'none',
               cursor: entry.trim() ? 'pointer' : 'not-allowed',
               transition: 'background 0.2s, transform 0.2s'
            }}
         >
            {isSubmitting ? 'A Gravar...' : 'Gravar no Diário 📝'}
         </button>
      </form>
   );
}
