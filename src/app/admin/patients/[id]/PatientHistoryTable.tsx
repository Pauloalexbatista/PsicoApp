"use client";

import { useState } from "react";
import { adolescenceQuestions } from "@/data/adolescenceQuestions";
import "./print.css";

type SessionData = {
  id: string;
  type: string;
  status: string;
  dopasEarned: number;
  data: string | null;
  createdAt: Date;
};

interface PatientHistoryTableProps {
  sessions: SessionData[];
  patientName?: string;
}

export default function PatientHistoryTable({ sessions, patientName }: PatientHistoryTableProps) {
  const [filterType, setFilterType] = useState<string>("ALL");
  const [selectedSessionForModal, setSelectedSessionForModal] = useState<SessionData | null>(null);

  const filteredSessions = sessions.filter(sess => {
    if (filterType === "ALL") return true;
    return sess.type === filterType;
  });

  const uniqueTypes = Array.from(new Set(sessions.map(s => s.type)));

  const exportToCSV = () => {
    const separator = ";";

    if (filterType === 'PILAR_D_QUESTIONARY_ADOLESCENTE') {
      const headers = ["Data", "Hora", "Estado"];
      adolescenceQuestions.forEach((q, idx) => {
         headers.push(`"Q${idx + 1}. ${q.area.replace(/"/g, '""')}"`);
      });

      const csvRows = filteredSessions.map(sess => {
         const dt = new Date(sess.createdAt);
         const row = [
            dt.toLocaleDateString(),
            dt.toLocaleTimeString(),
            sess.status
         ];

         let ans: Record<string, string> = {};
         try {
            if (sess.data) ans = JSON.parse(sess.data);
         } catch {}

         adolescenceQuestions.forEach((q, idx) => {
            const respLetter = ans[idx];
            let respText = "Sem Opcao";
            if (respLetter === "A") respText = q.a;
            if (respLetter === "B") respText = q.b;
            
            respText = respText.replace(/"/g, '""'); // Escape inner quotes
            // Format: "A - Resmungar ao receber tarefa"
            row.push(`"${respLetter || '-'} - ${respText}"`);
         });

         return row.join(separator);
      });

      const csvContent = [headers.join(separator), ...csvRows].join("\n");
      const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Resultados_Questionario_Adolescencia.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    // Exportacao Normal para os outros
    const headers = ["Data", "Hora", "Modulo", "Estado", "Dopas", "Dados Extra recolhidos"];
    
    // Mapear sessões filtradas em linhas de texto
    const csvRows = filteredSessions.map(sess => {
      const dt = new Date(sess.createdAt);
      const dataStr = dt.toLocaleDateString();
      const horaStr = dt.toLocaleTimeString();

      let extraDataStr = "Sem registos especificos";
      if (sess.data) {
        try {
          const parsedData = JSON.parse(sess.data);
          
          if (sess.type === 'PILAR_D') extraDataStr = `Foco: ${parsedData.focus_level} | Sono: ${parsedData.sleep_quality}`;
          if (sess.type === 'PILAR_D_HUMOR_SONO') extraDataStr = `Humor: ${parsedData.humorLevel}/10 | Sono: ${parsedData.sleepQuality}/10`;
          if (sess.type === 'PILAR_D_DIARIO') extraDataStr = `Ganhos: "${parsedData.entry.replace(/"/g, '""')}"`;
          if (sess.type === 'PILAR_B2' || sess.type === 'PILAR_B_CACA_LUZES') extraDataStr = `Pontos: ${parsedData.score ?? parsedData.pontos_verdes ?? parsedData.pontos} | Erros: ${parsedData.mistakes ?? parsedData.erros_vermelhos ?? parsedData.erros}`;
          if (sess.type === 'Neuro-Game: Memória' || sess.type === 'PILAR_B_MEMORIA') extraDataStr = `Tempo: ${parsedData.tempo ?? '?'}s | Jogadas: ${parsedData.jogadas ?? '?'}`;
          if (sess.type === 'PILAR_B_ORDENAR_LETRAS' || sess.type === 'PILAR_B_ORDENAR_NUMEROS') extraDataStr = `Dificuldade: ${parsedData.difficulty} | Módulo: ${parsedData.isLetters ? 'Letras' : 'Números'} | Tempo: ${parsedData.timeSeconds}s`;
          if (sess.type === 'PILAR_B_CONSTRUTOR_PALAVRAS') extraDataStr = `Dificuldade: ${parsedData.difficulty} | Tempo: ${parsedData.timeSeconds}s`;
          
        } catch {}
      }

      return [
        dataStr, 
        horaStr, 
        sess.type.replace('_', ' '), 
        sess.status, 
        sess.dopasEarned, 
        `"${extraDataStr}"`
      ].join(separator);
    });

    // Juntar Content
    const csvContent = [headers.join(separator), ...csvRows].join("\n");
    
    // Criar um Blob e desencadear o download
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Extrato_Paciente_${filterType}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="patients-list" style={{ marginTop: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: 0 }}>Feed de Actividades</h3>
        <div style={{ display: 'flex', gap: '12px' }}>
           <select 
             className="form-input" 
             style={{ width: 'auto', padding: '8px 16px' }}
             value={filterType}
             onChange={(e) => setFilterType(e.target.value)}
           >
             <option value="ALL">Todos os Módulos</option>
             {uniqueTypes.map(type => (
               <option key={type} value={type}>{type.replace('_', ' ')}</option>
             ))}
           </select>
           
           <button onClick={exportToCSV} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
              ⬇ Extrair CSV (Excel)
           </button>
        </div>
      </div>

      {filteredSessions.length === 0 ? (
        <p className="empty-state" style={{ background: 'var(--card-bg)', padding: '24px', borderRadius: '16px' }}>
          Sem registos para este filtro.
        </p>
      ) : (
        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Data e Hora</th>
                <th>Pilar (Módulo)</th>
                <th>Estado</th>
                <th>Dopas Ganhos</th>
                <th>Dados Recolhidos</th>
              </tr>
            </thead>
            <tbody>
              {filteredSessions.map((sess) => {
                let parsedData: any = null;
                if (sess.data) {
                  try { parsedData = JSON.parse(sess.data); } catch { /* ignore */ }
                }

                return (
                  <tr key={sess.id}>
                    <td>{new Date(sess.createdAt).toLocaleString()}</td>
                    <td style={{ fontWeight: 600 }}>{sess.type.replace('_', ' ')}</td>
                    <td>
                      <span className={`status-badge ${sess.status === 'COMPLETED' ? 'active' : 'inactive'}`}>
                        {sess.status}
                      </span>
                    </td>
                    <td style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>+{sess.dopasEarned}</td>
                    <td style={{ fontSize: '0.85rem' }}>
                      {sess.type === 'PILAR_D' && parsedData ? (
                        <span><b>Foco:</b> {parsedData.focus_level}/10 | <b>Sono:</b> Nv.{parsedData.sleep_quality}</span>
                      ) : sess.type === 'PILAR_D_HUMOR_SONO' && parsedData ? (
                        <span><b>Humor:</b> {parsedData.humorLevel}/10 | <b>Sono:</b> {parsedData.sleepQuality}/10</span>
                      ) : sess.type === 'PILAR_D_DIARIO' && parsedData ? (
                        <span><b>Diário de Ganhos: </b> "{parsedData.entry.substring(0, 50)}{parsedData.entry.length > 50 ? '...' : ''}"</span>
                      ) : sess.type === 'PILAR_D_QUESTIONARY_ADOLESCENTE' && parsedData ? (
                        <button 
                           onClick={() => setSelectedSessionForModal(sess)}
                           style={{ padding: '6px 12px', background: '#eef2ff', color: '#4f46e5', border: '1px solid #c7d2fe', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' }}
                        >
                           Ver Detalhes do Questionário (60Q)
                        </button>
                      ) : sess.type === 'PILAR_B2' && parsedData ? (
                        <span><b>Pontos Jogo:</b> {parsedData.score} | <b>Erros:</b> {parsedData.mistakes}</span>
                      ) : sess.type === 'PILAR_B_CACA_LUZES' && parsedData ? (
                        <span><b>Verdes:</b> {parsedData.pontos_verdes ?? parsedData.pontos} | <b>Vermelhas:</b> {parsedData.erros_vermelhos ?? parsedData.erros}</span>
                      ) : (sess.type === 'Neuro-Game: Memória' || sess.type === 'PILAR_B_MEMORIA') && parsedData ? (
                        <span><b>Tempo:</b> {parsedData.tempo ?? '?'}s | <b>Jogadas:</b> {parsedData.jogadas ?? '?'}</span>
                      ) : sess.type === 'PILAR_B_ORDENAR_LETRAS' && parsedData ? (
                         <span><b>Letras</b> | Dif: {parsedData.difficulty} | Tempo: {parsedData.timeSeconds}s</span>
                      ) : sess.type === 'PILAR_B_ORDENAR_NUMEROS' && parsedData ? (
                         <span><b>Números</b> | Dif: {parsedData.difficulty} | Tempo: {parsedData.timeSeconds}s</span>
                      ) : sess.type === 'PILAR_B_CONSTRUTOR_PALAVRAS' && parsedData ? (
                         <span><b>Palavras</b> | Dif: {parsedData.difficulty} | Tempo: {parsedData.timeSeconds}s</span>
                      ) : sess.type === 'PILAR_A' ? (
                        <span>Audição Concluída</span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>Sem registos específicos ou falha na leitura</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {selectedSessionForModal && selectedSessionForModal.type === 'PILAR_D_QUESTIONARY_ADOLESCENTE' && (
         <div id="questionnaire-print-modal-wrapper" style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
            background: 'rgba(0,0,0,0.5)', zIndex: 9999, 
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            padding: '24px'
         }}>
            <div id="questionnaire-print-modal" style={{
               background: '#fff', borderRadius: '16px', padding: '32px', 
               maxWidth: '900px', width: '100%', maxHeight: '90vh', overflowY: 'auto'
            }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
                  <div>
                     <h2 style={{ margin: 0, color: '#4f46e5' }}>Resultados: Questionário da Adolescência</h2>
                     <p style={{ color: 'var(--text-muted)', margin: '4px 0 0' }}>
                        {patientName && <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>Paciente: {patientName} | </span>}
                        Data: {new Date(selectedSessionForModal.createdAt).toLocaleString()}
                     </p>
                  </div>
                  <div className="no-print" style={{ display: 'flex', gap: '8px' }}>
                     <button onClick={() => {
                        // Generate Vertical CSV Report
                        let ans: Record<string, string> = {};
                        try { ans = JSON.parse(selectedSessionForModal.data || "{}"); } catch {}
                        
                        let csvStr = `Paciente:;${patientName || 'N/A'}\n`;
                        csvStr += `Data:;${new Date(selectedSessionForModal.createdAt).toLocaleString()}\n`;
                        csvStr += `Resultados: Questionario da Adolescencia\n\n`;
                        csvStr += `#;Area (Tema);Resposta Escolhida\n`;
                        
                        adolescenceQuestions.forEach((q, i) => {
                           const letter = ans[i];
                           const text = letter === 'A' ? q.a : letter === 'B' ? q.b : 'Nao respondido';
                           csvStr += `${i+1};"${q.area.replace(/"/g, '""')}";"${letter || '-'} - ${text.replace(/"/g, '""')}"\n`;
                        });

                        const blob = new Blob(["\uFEFF" + csvStr], { type: "text/csv;charset=utf-8;" });
                        const link = document.createElement("a");
                        link.href = URL.createObjectURL(blob);
                        link.setAttribute("download", `Relatorio_Questionario_${patientName || 'Paciente'}.csv`);
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                     }} style={{ background: '#10b981', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>📥 Exportar Excel (Relatório)</button>
                     <button onClick={() => window.print()} style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>🖨️ Imprimir / PDF</button>
                     <button onClick={() => setSelectedSessionForModal(null)} style={{ background: '#f1f5f9', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>✕ Fechar</button>
                  </div>
               </div>
               
               <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                     <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                        <th style={{ padding: '12px', borderBottom: '2px solid #e2e8f0' }}>#</th>
                        <th style={{ padding: '12px', borderBottom: '2px solid #e2e8f0' }}>Área (Tema)</th>
                        <th style={{ padding: '12px', borderBottom: '2px solid #e2e8f0' }}>Reposta Escolhida (A ou B)</th>
                     </tr>
                  </thead>
                  <tbody>
                     {(() => {
                        try {
                           const ans = JSON.parse(selectedSessionForModal.data || "{}");
                           return adolescenceQuestions.map((q, idx) => {
                              const choiceLetter = ans[idx]; // "A" or "B"
                              const choiceText = choiceLetter === "A" ? q.a : choiceLetter === "B" ? q.b : "Não respondeu";
                              
                              return (
                                 <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                    <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{idx + 1}</td>
                                    <td style={{ padding: '12px', fontWeight: 600 }}>{q.area}</td>
                                    <td style={{ padding: '12px' }}>
                                       <span style={{ 
                                          display: 'inline-block',
                                          marginRight: '8px', 
                                          fontWeight: 'bold', 
                                          color: choiceLetter === "A" ? '#3b82f6' : choiceLetter === "B" ? '#ef4444' : '#94a3b8' 
                                       }}>
                                          {choiceLetter ? `Opção ${choiceLetter}:` : ''}
                                       </span>
                                       {choiceText}
                                    </td>
                                 </tr>
                              );
                           });
                        } catch {
                           return <tr><td colSpan={3} style={{ padding: '12px', color: 'red' }}>Erro ao ler dados JSON</td></tr>
                        }
                     })()}
                  </tbody>
               </table>
            </div>
         </div>
      )}

    </div>
  );
}
