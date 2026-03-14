"use client";

import { useState } from "react";

type SessionData = {
  id: string;
  type: string;
  status: string;
  dopasEarned: number;
  data: string | null;
  createdAt: Date;
};

export default function PatientHistoryTable({ sessions }: { sessions: SessionData[] }) {
  const [filterType, setFilterType] = useState<string>("ALL");

  const filteredSessions = sessions.filter(sess => {
    if (filterType === "ALL") return true;
    return sess.type === filterType;
  });

  const uniqueTypes = Array.from(new Set(sessions.map(s => s.type)));

  const exportToCSV = () => {
    // Definir os Headers do CSV
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
          if (sess.type === 'PILAR_B2' || sess.type === 'PILAR_B_CACA_LUZES') extraDataStr = `Pontos: ${parsedData.score ?? parsedData.pontos_verdes ?? parsedData.pontos} | Erros: ${parsedData.mistakes ?? parsedData.erros_vermelhos ?? parsedData.erros}`;
          if (sess.type === 'Neuro-Game: Memória') extraDataStr = `Tempo: ${parsedData.tempo}s | Jogadas: ${parsedData.jogadas}`;
        } catch {}
      }

      // Preparar os campos limpos escapando aspas e comas se necessário
      return [
        dataStr, 
        horaStr, 
        sess.type.replace('_', ' '), 
        sess.status, 
        sess.dopasEarned, 
        `"${extraDataStr}"`
      ].join(",");
    });

    // Juntar Content
    const csvContent = [headers.join(","), ...csvRows].join("\n");
    
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
                      ) : sess.type === 'PILAR_B2' && parsedData ? (
                        <span><b>Pontos Jogo:</b> {parsedData.score} | <b>Erros:</b> {parsedData.mistakes}</span>
                      ) : sess.type === 'PILAR_B_CACA_LUZES' && parsedData ? (
                        <span><b>Verdes:</b> {parsedData.pontos_verdes ?? parsedData.pontos} | <b>Vermelhas:</b> {parsedData.erros_vermelhos ?? parsedData.erros}</span>
                      ) : sess.type === 'Neuro-Game: Memória' && parsedData ? (
                        <span><b>Tempo:</b> {parsedData.tempo}s | <b>Jogadas:</b> {parsedData.jogadas}</span>
                      ) : sess.type === 'PILAR_A' ? (
                        <span>Audição Concluída</span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>Sem registos específicos</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
