"use client";

import { useState, useEffect, useCallback } from "react";
import { completeActivity } from "../../../actions";

interface CacaLuzesProps {
  patientId: string;
  moduleId: string;
}

export default function CacaLuzes({ patientId, moduleId }: CacaLuzesProps) {
  const [grid, setGrid] = useState<string[]>(Array(9).fill("none"));
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  const spawnLight = useCallback(() => {
    const newGrid = Array(9).fill("none");
    const randomIndex = Math.floor(Math.random() * 9);
    const type = Math.random() > 0.3 ? "green" : "red";
    newGrid[randomIndex] = type;
    setGrid(newGrid);
  }, []);

  const handleGameOver = useCallback(async () => {
    // Green = +1, Red = -5. Erros tracks the red count, so score represents green clicks. 
    // The formula requested was essentially that the final balance should reflect these rules.
    const dopas = Math.max(0, score - (errors * 5));
    
    // Submit with additional data
    const gameData = JSON.stringify({ pontos_verdes: score, erros_vermelhos: errors });
    await completeActivity(patientId, moduleId, "PILAR_B_CACA_LUZES", dopas, gameData);
    alert(`Fim do Jogo! Pontos: ${score}, Erros: ${errors}. Ganhaste ${dopas} Dopas!`);
  }, [patientId, moduleId, score, errors]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    let spawnTimer: NodeJS.Timeout;

    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      spawnTimer = setInterval(spawnLight, 800);
    } else if (timeLeft === 0 && isPlaying) {
      setTimeout(() => {
        setIsPlaying(false);
        handleGameOver();
      }, 0);
    }

    return () => {
      clearInterval(timer);
      clearInterval(spawnTimer);
    };
  }, [isPlaying, timeLeft, spawnLight, handleGameOver]);

  function handleClick(index: number) {
    if (!isPlaying) return;
    
    if (grid[index] === "green") {
      setScore(s => s + 1);
      setGrid(prev => {
        const n = [...prev];
        n[index] = "none";
        return n;
      });
    } else if (grid[index] === "red") {
      setErrors(e => e + 1);
      setGrid(prev => {
        const n = [...prev];
        n[index] = "none";
        return n;
      });
    }
  }

  return (
    <div className="game-container">
      <div className="game-stats">
        <span>⏱️ {timeLeft}s</span>
        <span>✨ {score}</span>
        <span>⚠️ {errors}</span>
      </div>

      {!isPlaying && timeLeft === 30 ? (
        <button onClick={() => setIsPlaying(true)} className="login-button">Começar Jogo</button>
      ) : (
        <div className="grid">
          {grid.map((cell, i) => (
            <div 
              key={i} 
              onClick={() => handleClick(i)}
              className={`cell ${cell}`}
            />
          ))}
        </div>
      )}

      <style jsx>{`
        .game-container { text-align: center; }
        .game-stats { 
          display: flex; justify-content: space-around; 
          margin-bottom: 24px; font-weight: 700; font-size: 1.25rem;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          max-width: 300px;
          margin: 0 auto;
        }
        .cell {
          aspect-ratio: 1;
          background: rgba(255,255,255,0.05);
          border-radius: 12px;
          transition: all 0.1s;
          cursor: pointer;
        }
        .cell.green { background: #10b981; box-shadow: 0 0 20px #10b981; transform: scale(1.05); }
        .cell.red { background: #ef4444; box-shadow: 0 0 20px #ef4444; transform: scale(1.05); }
      `}</style>
    </div>
  );
}
