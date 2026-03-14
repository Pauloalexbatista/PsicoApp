"use client";

import { useState } from "react";
import { toggleModule } from "./actions";

interface ModuleManagerProps {
  patientId: string;
  activeModules: Array<{ moduleId: string; isActive: boolean }>;
  allModules: Array<{ id: string; name: string }>;
}

export default function ModuleManager({ patientId, activeModules, allModules }: ModuleManagerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const isModuleActive = (moduleId: string) => 
    activeModules.find(am => am.moduleId === moduleId)?.isActive ?? false;

  async function handleToggle(moduleId: string, currentStatus: boolean) {
    await toggleModule(patientId, moduleId, !currentStatus);
  }

  if (!isOpen) {
    return <button onClick={() => setIsOpen(true)} className="small-link">Gerir Módulos</button>;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Ativar Módulos</h3>
        <ul className="module-list">
          {allModules.map(m => (
            <li key={m.id} className="module-item">
              <span>{m.name}</span>
              <button 
                onClick={() => handleToggle(m.id, isModuleActive(m.id))}
                className={`toggle-btn ${isModuleActive(m.id) ? 'active' : ''}`}
              >
                {isModuleActive(m.id) ? "Ativo" : "Inativo"}
              </button>
            </li>
          ))}
        </ul>
        <div className="modal-actions" style={{ marginTop: '24px' }}>
           <button onClick={() => setIsOpen(false)} className="btn-secondary">Fechar</button>
        </div>
      </div>
    </div>
  );
}
