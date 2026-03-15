"use client";

import { useState, useEffect } from "react";
import { completeActivity } from "../../../actions";

type Difficulty = "FÁCIL" | "DIFÍCIL";

export default function OrderNumbersGame({ patientId, moduleId }: { patientId: string; moduleId: string }) {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [sequence, setSequence] = useState<{ id: number; num: number; selected: boolean }[]>([]);
  const [targetSequence, setTargetSequence] = useState<number[]>([]);
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
    
    // Generate random numbers without duplicates
    const count = level === "FÁCIL" ? 5 : 10;
    const maxVal = level === "FÁCIL" ? 9 : 99;
    
    const uniqueNumbers = new Set<number>();
    while (uniqueNumbers.size < count) {
      uniqueNumbers.add(Math.floor(Math.random() * (maxVal + 1)));
    }
    
    const numbersArray = Array.from(uniqueNumbers);
    setTargetSequence([...numbersArray].sort((a, b) => a - b));
    
    const scrambled = [...numbersArray]
      .sort(() => Math.random() - 0.5)
      .map((num, index) => ({ id: index, num, selected: false }));
      
    setSequence(scrambled);
    setCurrentIndex(0);
    setScore(0);
    setStartTime(Date.now());
    setTimeElapsed(0);
    setIsPlaying(true);
    setCompleted(false);
  };

  const handleNumberClick = (index: number) => {
    if (!isPlaying || sequence[index].selected) return;

    const clickedNum = sequence[index].num;
    const expectedNum = targetSequence[currentIndex];

    if (clickedNum === expectedNum) {
      const newSequence = [...sequence];
      newSequence[index].selected = true;
      setSequence(newSequence);
      setCurrentIndex(currentIndex + 1);
      setScore(s => s + 10);
      
      if (currentIndex + 1 === targetSequence.length) {
        finishGame(score + 10);
      }
    } else {
      setScore(s => Math.max(0, s - 3)); // Penalty is a bit harder for numbers
    }
  };

  const finishGame = (finalScore: number) => {
    setIsPlaying(false);
    setCompleted(true);
    const gameData = JSON.stringify({ tempo: timeElapsed, pontuacao: finalScore, dificuldade: difficulty });
    completeActivity(patientId, moduleId, "Neuro-Game: Ordenar Números", finalScore, gameData)
      .catch(console.error);
  };

  return (
    <div className="game-container">
      {!isPlaying && !completed ? (
        <div className="start-screen">
          <h2 style={{ marginBottom: "16px" }}>Ordenar Números</h2>
          <p style={{ color: "var(--text-muted)", marginBottom: "32px", textAlign: "center", maxWidth: "400px" }}>
            Ordena os números do mais pequeno para o maior!
          </p>
          
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
            <button className="btn-secondary" onClick={() => startGame("FÁCIL")}>Fácil (0 a 9)</button>
            <button className="btn-secondary" onClick={() => startGame("DIFÍCIL")}>Difícil (0 a 99)</button>
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
             {completed ? "Sequência numérica concluída!" : `A procurar: ${targetSequence[currentIndex]}`}
          </div>

          <div className="numbers-grid">
            {sequence.map((item, i) => (
              <button
                key={item.id}
                className={`number-btn ${item.selected ? "selected" : ""}`}
                onClick={() => handleNumberClick(i)}
                disabled={item.selected || completed}
              >
                {item.num}
              </button>
            ))}
          </div>
          
          {completed && (
             <div className="completion-card">
                <h3>Calculadora Humana! 🧮</h3>
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
        .numbers-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          justify-content: center;
          max-width: 600px;
          margin: 0 auto;
        }
        .number-btn {
          width: 80px;
          height: 80px;
          font-size: 2rem;
          font-weight: 700;
          border-radius: 50%; /* Circle for numbers to look different */
          border: 2px solid #e2e8f0;
          background: #f8fafc;
          color: var(--text-primary);
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .number-btn:hover:not(:disabled) {
          border-color: #3b82f6;
          background: #fff;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
        }
        .number-btn:active:not(:disabled) {
          transform: translateY(0);
        }
        .number-btn.selected {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
          opacity: 0.5;
          transform: scale(0.95);
          cursor: not-allowed;
        }
        .completion-card {
           margin-top: 40px;
           background: #eff6ff;
           border: 2px solid #bfdbfe;
           padding: 24px;
           border-radius: 16px;
           text-align: center;
        }
        .completion-card h3 { color: #1e3a8a; margin-bottom: 8px; }
        .completion-card p { color: #1d4ed8; font-weight: 500; }
        
        .btn-primary, .btn-secondary {
          padding: 12px 24px;
          border-radius: 999px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, filter 0.2s;
        }
        .btn-primary {
          background: #3b82f6;
          color: white;
          border: none;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
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
