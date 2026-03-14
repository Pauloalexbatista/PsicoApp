import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export default async function ModulesPage() {
  const session = await getSession();
  
  // Buscar os Módulos do Sistema
  const modules = await prisma.module.findMany();

  return (
    <div className="patients-container">
      <div className="section-header">
        <h2>Gestão de Módulos Clínicos</h2>
      </div>

      <div className="patients-list" style={{ marginTop: '32px' }}>
        {modules.length === 0 ? (
          <p className="empty-state">Não existem módulos registados no sistema.</p>
        ) : (
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nome do Módulo</th>
                  <th>Designação Oficial</th>
                  <th>Pacientes Ativos</th>
                </tr>
              </thead>
              <tbody>
                {modules.map((m) => (
                  <tr key={m.id}>
                    <td style={{ fontWeight: '600' }}>{m.name}</td>
                    <td>{m.description || "Sem descrição"}</td>
                    <td>
                      <span className="status-badge active" style={{ backgroundColor: 'rgba(0,0,0,0.1)', color: 'var(--text-primary)' }}>Em Uso</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <div className="admin-card action-section" style={{ marginTop: '40px' }}>
          <h3 style={{ marginBottom: '16px' }}>Adicionar Novo Módulo</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>A criação de novos eixos terapêuticos (ex: Ansiedade, Foco Avançado) requer configuração de base de dados e integração de mecânicas de jogo.</p>
          <button className="btn-secondary" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>Construir Módulo</button>
      </div>
    </div>
  );
}
