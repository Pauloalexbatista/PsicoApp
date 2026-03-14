"use client";

import { useActionState } from "react";
import { authenticate } from "./actions";
import "./login.css";

export default function LoginPage() {
  const [errorMessage, dispatch, isPending] = useActionState(
    authenticate,
    undefined
  );

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>PsicoApp</h1>
          <p>Gestão Clínica Modular</p>
        </div>
        
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        
        <form action={dispatch}>
          <div className="form-group">
            <label htmlFor="email">Email ou Utilizador</label>
            <input
              id="email"
              name="email"
              type="text"
              required
              placeholder="ex: psicologo@exemplo.pt"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Palavra-passe</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
            />
          </div>
          
          <button type="submit" className="login-button" disabled={isPending}>
            {isPending ? "A entrar..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
