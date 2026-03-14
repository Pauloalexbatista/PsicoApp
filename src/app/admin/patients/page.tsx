import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import PatientForm from "./PatientForm";
import ModuleManager from "./ModuleManager";
import Link from "next/link";

export default async function PatientsPage() {
  const session = await getSession();
  const patients = await prisma.patient.findMany({
    where: { psychologistId: session?.user.id },
    include: {
      activeModules: {
        include: { module: true }
      }
    }
  });

  const allModules = await prisma.module.findMany();

  return (
    <div className="patients-container">
      <div className="section-header">
        <h2>Gestão de Pacientes</h2>
        <PatientForm />
      </div>

      <div className="patients-list" style={{ marginTop: '32px' }}>
        {patients.length === 0 ? (
          <p className="empty-state">Ainda não tem pacientes registados.</p>
        ) : (
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Utilizador</th>
                  <th>Nível / Dopas</th>
                  <th>Módulos Ativos</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.username}</td>
                    <td>Lvl {p.level} ({p.dopas} Dopas)</td>
                    <td>
                      <ModuleManager 
                        patientId={p.id} 
                        activeModules={p.activeModules} 
                        allModules={allModules} 
                      />
                    </td>
                    <td>
                      <Link href={`/admin/patients/${p.id}`} className="btn-secondary" style={{ textDecoration: 'none', display: 'inline-block' }}>
                        Ver Histórico
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
