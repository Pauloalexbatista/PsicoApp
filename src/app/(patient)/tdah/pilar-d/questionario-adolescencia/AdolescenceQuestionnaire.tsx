"use client";

import { useState } from "react";
import { completeAdolescenceTest } from "../actions";
import { adolescenceQuestions } from "@/data/adolescenceQuestions";

export default function AdolescenceQuestionnaire({ patientId, moduleId }: { patientId: string; moduleId: string }) {
   const [currentIndex, setCurrentIndex] = useState(0);
   const [answers, setAnswers] = useState<Record<number, string>>({});
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [success, setSuccess] = useState(false);

   const question = adolescenceQuestions[currentIndex];
   
   const handleAnswer = (choice: "A" | "B") => {
      const newAnswers = { ...answers, [currentIndex]: choice };
      setAnswers(newAnswers);
      
      if (currentIndex < adolescenceQuestions.length - 1) {
         setCurrentIndex(currentIndex + 1);
      }
   };
   
   const goBack = () => {
       if (currentIndex > 0) {
           setCurrentIndex(currentIndex - 1);
       }
   };

   const handleSubmit = async () => {
     if (Object.keys(answers).length < adolescenceQuestions.length) return;
     
     setIsSubmitting(true);
     try {
       await completeAdolescenceTest(patientId, moduleId, JSON.stringify(answers));
       setSuccess(true);
     } catch (error) {
       console.error("Erro ao submeter", error);
     } finally {
       setIsSubmitting(false);
     }
   };

   if (success) {
     return (
       <div style={{ textAlign: 'center', padding: '60px 20px', background: '#e0e7ff', borderRadius: '16px', border: '2px solid #a5b4fc', maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '4rem', margin: '0 0 16px' }}>🏆</h2>
          <h3 style={{ color: '#4338ca', marginBottom: '12px' }}>Questionário Concluído!</h3>
          <p style={{ color: '#3730a3', fontSize: '1.1rem' }}>Excelente trabalho! Respondeste a todas as {adolescenceQuestions.length} questões com sinceridade. Acabaste de ganhar XP e Dopas!</p>
       </div>
     );
   }

   const progress = (Object.keys(answers).length / adolescenceQuestions.length) * 100;

   // Check if the current question has an answer so we know if user can proceed to next manually
   const hasAnswer = answers[currentIndex] !== undefined;
   // Ensure all 60 are filled before submission
   const allFilled = Object.keys(answers).length === adolescenceQuestions.length;

   return (
      <div style={{ background: '#fff', padding: '32px', borderRadius: '20px', boxShadow: 'var(--card-shadow)', maxWidth: '800px', margin: '0 auto' }}>
         <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>
                <span>Progresso</span>
                <span>{Object.keys(answers).length} / {adolescenceQuestions.length}</span>
            </div>
            <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${progress}%`, height: '100%', background: '#6366f1', transition: 'width 0.3s' }}></div>
            </div>
         </div>

         <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h3 style={{ color: '#4f46e5', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px', marginBottom: '8px' }}>Área Avaliada</h3>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--text-primary)' }}>{question.area}</h2>
            <p style={{ color: 'var(--text-muted)' }}>Qual destas duas opções se assemelha mais ao teu caso?</p>
         </div>

         <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
            <button 
                onClick={() => handleAnswer("A")}
                style={{
                   padding: '24px',
                   borderRadius: '16px',
                   border: answers[currentIndex] === "A" ? '3px solid #6366f1' : '2px solid #e2e8f0',
                   background: answers[currentIndex] === "A" ? '#eef2ff' : '#f8fafc',
                   color: 'var(--text-primary)',
                   fontSize: '1.1rem',
                   textAlign: 'left',
                   cursor: 'pointer',
                   transition: 'all 0.2s',
                   boxShadow: answers[currentIndex] === "A" ? '0 4px 12px rgba(99, 102, 241, 0.15)' : 'none'
                }}
            >
               <span style={{ fontWeight: 800, color: answers[currentIndex] === "A" ? '#4f46e5' : '#94a3b8', marginRight: '12px' }}>A.</span> 
               {question.a}
            </button>
            <button 
                onClick={() => handleAnswer("B")}
                style={{
                   padding: '24px',
                   borderRadius: '16px',
                   border: answers[currentIndex] === "B" ? '3px solid #6366f1' : '2px solid #e2e8f0',
                   background: answers[currentIndex] === "B" ? '#eef2ff' : '#f8fafc',
                   color: 'var(--text-primary)',
                   fontSize: '1.1rem',
                   textAlign: 'left',
                   cursor: 'pointer',
                   transition: 'all 0.2s',
                   boxShadow: answers[currentIndex] === "B" ? '0 4px 12px rgba(99, 102, 241, 0.15)' : 'none'
                }}
            >
               <span style={{ fontWeight: 800, color: answers[currentIndex] === "B" ? '#4f46e5' : '#94a3b8', marginRight: '12px' }}>B.</span> 
               {question.b}
            </button>
         </div>
         
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '24px' }}>
             <button 
                 onClick={goBack} 
                 disabled={currentIndex === 0}
                 style={{ 
                    padding: '12px 24px', 
                    background: 'transparent', 
                    border: 'none', 
                    color: currentIndex === 0 ? '#cbd5e1' : '#64748b', 
                    fontWeight: 600, 
                    cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
                    fontSize: '1rem'
                 }}
             >
                 ← Pergunta Anterior
             </button>

             {currentIndex === adolescenceQuestions.length - 1 ? (
                 <button 
                    onClick={handleSubmit} 
                    disabled={!allFilled || isSubmitting}
                    style={{
                       padding: '12px 32px',
                       borderRadius: '12px',
                       background: allFilled ? '#10b981' : '#cbd5e1',
                       color: 'white',
                       fontWeight: 600,
                       fontSize: '1.1rem',
                       border: 'none',
                       cursor: allFilled ? 'pointer' : 'not-allowed',
                       transition: 'background 0.2s'
                    }}
                 >
                    {isSubmitting ? 'A Enviar...' : 'Finalizar Submissão ✅'}
                 </button>
             ) : (
                 <button 
                    onClick={() => setCurrentIndex(currentIndex + 1)} 
                    disabled={!hasAnswer}
                    style={{
                       padding: '12px 32px',
                       borderRadius: '12px',
                       background: hasAnswer ? '#6366f1' : '#e2e8f0',
                       color: hasAnswer ? 'white' : '#94a3b8',
                       fontWeight: 600,
                       fontSize: '1.1rem',
                       border: 'none',
                       cursor: hasAnswer ? 'pointer' : 'not-allowed',
                       transition: 'background 0.2s'
                    }}
                 >
                    Próxima →
                 </button>
             )}
         </div>
         
      </div>
   );
}
