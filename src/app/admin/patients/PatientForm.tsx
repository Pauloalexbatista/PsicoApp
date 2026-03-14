"use client";

import { useState } from "react";
import { createPatient } from "./actions";

export default function PatientForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    const result = await createPatient(formData);
    if (result?.error) {
      setError(result.error);
    } else {
      setIsOpen(false);
      setError("");
    }
  }

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} className="btn-primary">
        + Novo Paciente
      </button>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Registar Novo Paciente</h3>
        <form action={handleSubmit}>
          {error && <p className="error-text">{error}</p>}
          <div className="form-group">
            <label>Nome Completo</label>
            <input name="name" type="text" className="form-input" required placeholder="Ex: João Silva" />
          </div>
          <div className="form-group">
            <label>Utilizador (Login)</label>
            <input name="username" type="text" className="form-input" required placeholder="Ex: joao2024" />
          </div>
          <div className="form-group">
            <label>Palavra-passe Inicial</label>
            <input name="password" type="password" className="form-input" required placeholder="••••••••" />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={() => setIsOpen(false)} className="btn-secondary">Cancelar</button>
            <button type="submit" className="btn-primary">Criar Conta</button>
          </div>
        </form>
      </div>
    </div>
  );
}
