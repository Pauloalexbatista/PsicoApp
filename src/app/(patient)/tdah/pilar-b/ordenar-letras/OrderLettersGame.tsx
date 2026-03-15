"use client";

import { useState, useEffect } from "react";
import { completeActivity } from "../../../actions";

type Difficulty = "FÁCIL" | "DIFÍCIL" | "AVANÇADO";

export default function OrderLettersGame({ patientId, moduleId }: { patientId: string; moduleId: string }) {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [sequence, setSequence] = useState<{ id: number; letter: string; selected: boolean }[]>([]);
  const [targetSequence, setTargetSequence] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completed, setCompleted] = useState(false);
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && !completed) {
      timer = setInterval(() => {
        if (startTime) {
          setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, startTime, completed]);

  const startGame = (level: Difficulty) => {
    setDifficulty(level);
    let lettersToUse: string[] = [];
    
    if (level === "FÁCIL") {
      lettersToUse = ["A", "E", "I", "O", "U"];
    } else if (level === "DIFÍCIL") {
      const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
      // Pick 5 random letters and sort them alphabetically
      lettersToUse = [...alphabet].sort(() => 0.5 - Math.random()).slice(0, 5).sort();
    } else {
      const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
      // Pick 10 random letters and sort them alphabetically
      lettersToUse = [...alphabet].sort(() => 0.5 - Math.random()).slice(0, 10).sort();
    }

    setTargetSequence([...lettersToUse]); // The correct alphabetical order
    
    // Scramble them for the user
    const scrambled = [...lettersToUse]
      .sort(() => Math.random() - 0.5)
      .map((letter, index) => ({ id: index, letter, selected: false }));
      
    setSequence(scrambled);
    setCurrentIndex(0);
    setScore(0);
    setStartTime(Date.now());
    setTimeElapsed(0);
    setIsPlaying(true);
    setCompleted(false);
  };

  const handleLetterClick = (index: number) => {
    if (!isPlaying || sequence[index].selected) return;

    const clickedLetter = sequence[index].letter;
    const expectedLetter = targetSequence[currentIndex];

    if (clickedLetter === expectedLetter) {
      // Correct click
      const newSequence = [...sequence];
      newSequence[index].selected = true;
      setSequence(newSequence);
      setCurrentIndex(currentIndex + 1);
      setScore(s => s + 10); // +10 points per correct letter
      
      // Check if finished
      if (currentIndex + 1 === targetSequence.length) {
        finishGame(score + 10);
      }
    } else {
      // Wrong click
      setScore(s => Math.max(0, s - 2)); // -2 points, minimum 0
      // Could show a red flash effect here later
    }
  };

  const finishGame = (finalScore: number) => {
    setIsPlaying(false);
    setCompleted(true);
    const gameData = JSON.stringify({ tempo: timeElapsed, pontuacao: finalScore, dificuldade: difficulty });
    completeActivity(patientId, moduleId, "Neuro-Game: Ordenar Letras", finalScore, gameData)
      .catch(console.error);
  };

  return (
    <div className="game-container">
      {!isPlaying && !completed ? (
        <div className="start-screen">
          <h2 style={{ marginBottom: "16px" }}>Ordenar Letras</h2>
          <p style={{ color: "var(--text-muted)", marginBottom: "32px", textAlign: "center", maxWidth: "400px" }}>
            Clica nas letras pela ordem alfabética correta o mais rápido que conseguires! Se errares, perdes pontos.
          </p>
          
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
            <button className="btn-secondary" onClick={() => startGame("FÁCIL")}>Fácil (Vogais)</button>
            <button className="btn-secondary" onClick={() => startGame("DIFÍCIL")}>Difícil (5 Letras)</button>
            <button className="btn-secondary" onClick={() => startGame("AVANÇADO")}>Avançado (10 Letras)</button>
          </div>
        </div>
      ) : (
        <>
          <div className="game-header">
            <div className="stats-pill">Dificuldade: {difficulty}</div>
            <div className="stats-pill">⏱️ {timeElapsed}s</div>
            <div className="stats-pill">⭐ {score} pts</div>
          </div>

          <div style={{ textAlign: "center", marginBottom: "32px", minHeight: "30px", fontWeight: "600", color: "var(--text-muted)" }}>
             {completed ? "Sequência concluída!" : `A procurar: ${targetSequence[currentIndex]}`}
          </div>

          <div className="letters-grid">
            {sequence.map((item, i) => (
              <button
                key={item.id}
                className={`letter-btn ${item.selected ? "selected" : ""}`}
                onClick={() => handleLetterClick(i)}
                disabled={item.selected || completed}
              >
                {item.letter}
              </button>
            ))}
          </div>
          
          {completed && (
             <div className="completion-card">
                <h3>Missão Cumprida! 🎉</h3>
                <p>Tempo: {timeElapsed}s | Pontuação Final: {score}</p>
                <div style={{ marginTop: '24px', display: 'flex', gap: '16px', justifyContent: 'center' }}>
                  <button className="btn-primary" onClick={() => startGame(difficulty!)}>Jogar Novamente 🔄</button>
                  <button className="btn-secondary" onClick={() => { setIsPlaying(false); setCompleted(false); }}>Mudar Dificuldade</button>
                </div>
             </div>
          )}
        </>
      )}

      <style jsx>{`
        .game-container {
          background: #fff;
          border-radius: 20px;
          padding: 32px;
          box-shadow: var(--card-shadow);
        }
        .start-screen {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px 0;
        }
        .game-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 12px;
        }
        .stats-pill {
          background: #f1f5f9;
          padding: 8px 16px;
          border-radius: 999px;
          font-weight: 600;
          color: var(--text-primary);
          font-size: 0.9rem;
        }
        .letters-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          justify-content: center;
          max-width: 600px;
          margin: 0 auto;
        }
        .letter-btn {
          width: 80px;
          height: 80px;
          font-size: 2rem;
          font-weight: 700;
          border-radius: 16px;
          border: 2px solid #e2e8f0;
          background: #f8fafc;
          color: var(--text-primary);
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .letter-btn:hover:not(:disabled) {
          border-color: var(--accent-primary);
          background: #fff;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }
        .letter-btn:active:not(:disabled) {
          transform: translateY(0);
        }
        .letter-btn.selected {
          background: var(--accent-primary);
          color: white;
          border-color: var(--accent-primary);
          opacity: 0.5;
          transform: scale(0.95);
          cursor: not-allowed;
        }
        .completion-card {
           margin-top: 40px;
           background: #f0fdf4;
           border: 2px solid #bbf7d0;
           padding: 24px;
           border-radius: 16px;
           text-align: center;
        }
        .completion-card h3 { color: #166534; margin-bottom: 8px; }
        .completion-card p { color: #15803d; font-weight: 500; }
        
        .btn-primary, .btn-secondary {
          padding: 12px 24px;
          border-radius: 999px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, filter 0.2s;
        }
        .btn-primary {
          background: var(--accent-primary);
          color: white;
          border: none;
          box-shadow: 0 4px 12px rgba(234, 88, 12, 0.3);
        }
        .btn-secondary {
          background: #fff;
          color: var(--text-primary);
          border: 1px solid #e2e8f0;
        }
        .btn-primary:active, .btn-secondary:active { transform: scale(0.95); }
      `}</style>
    </div>
  );
}
