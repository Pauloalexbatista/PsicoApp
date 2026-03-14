"use client";

import { useState, useEffect } from "react";
import { completeActivity } from "../../../actions";

const ANIMAL_EMOJIS = ["🐶", "🐱", "🦊", "🐻", "🐼", "🐨", "🐸", "🐰"];

export default function MemoryGame({ patientId, moduleId }: { patientId: string; moduleId: string }) {
  const [cards, setCards] = useState<{ id: number; emoji: string; isFlipped: boolean; isMatched: boolean }[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completed, setCompleted] = useState(false);
  
  // Initializes Game
  const startNewGame = () => {
    const shuffledCards = [...ANIMAL_EMOJIS, ...ANIMAL_EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, emoji, isFlipped: false, isMatched: false }));
    
    setCards(shuffledCards);
    setFlippedIndices([]);
    setMatches(0);
    setMoves(0);
    setStartTime(Date.now());
    setTimeElapsed(0);
    setIsPlaying(true);
    setCompleted(false);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        if (startTime) {
          setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, startTime]);

  const handleCardClick = (index: number) => {
    if (!isPlaying || flippedIndices.length === 2 || cards[index].isFlipped || cards[index].isMatched) return;

    const newCards = [...cards];
    newCards[index] = { ...newCards[index], isFlipped: true };
    setCards(newCards);

    const newFlippedIndices = [...flippedIndices, index];
    setFlippedIndices(newFlippedIndices);

    if (newFlippedIndices.length === 2) {
      setMoves(m => m + 1);
      const [firstIndex, secondIndex] = newFlippedIndices;
      if (newCards[firstIndex].emoji === newCards[secondIndex].emoji) {
        newCards[firstIndex] = { ...newCards[firstIndex], isMatched: true };
        newCards[secondIndex] = { ...newCards[secondIndex], isMatched: true };
        setCards(newCards);
        setMatches(matches + 1);
        setFlippedIndices([]);
      } else {
        setTimeout(() => {
          newCards[firstIndex] = { ...newCards[firstIndex], isFlipped: false };
          newCards[secondIndex] = { ...newCards[secondIndex], isFlipped: false };
          setCards([...newCards]);
          setFlippedIndices([]);
        }, 1000); // 1-second delay before hiding
      }
    }
  };

  useEffect(() => {
    if (matches === ANIMAL_EMOJIS.length && isPlaying) {
      setIsPlaying(false);
      setCompleted(true);
      const gameData = JSON.stringify({ tempo: timeElapsed, jogadas: moves });
      completeActivity(patientId, moduleId, "Neuro-Game: Memória", 40, gameData)
        .then(() => alert(`Parabéns! Completaste a Missão de Memória em ${timeElapsed}s e ${moves} jogadas. +40 Dopas`));
    }
  }, [matches, isPlaying, patientId, moduleId, timeElapsed, moves]);

  return (
    <div className="memory-container">
      {!isPlaying && !completed ? (
        <div className="start-screen">
          <p style={{ color: "var(--text-muted)", marginBottom: "24px", textAlign: "center" }}>Encontra todos os pares de animais o mais rapidamente possível para ganhares recompensas.</p>
          <button className="btn-primary" onClick={startNewGame}>Começar Jogo 🎮</button>
        </div>
      ) : (
        <>
          <div className="game-stats">
            <span className="pairs-text">Pares: {matches} / {ANIMAL_EMOJIS.length}</span>
            <span className="pairs-text">⏱️ {timeElapsed}s</span>
            <span className="pairs-text">🔄 {moves}</span>
            {completed && <span className="completed-tag">Missão Cumprida! ✓</span>}
          </div>

          <div className="memory-grid">
            {cards.map((card, index) => (
              <div 
                key={card.id} 
                className={`memory-card ${card.isFlipped || card.isMatched ? "flipped" : ""}`}
                onClick={() => handleCardClick(index)}
              >
                <div className="card-inner">
                  <div className="card-front">❓</div>
                  <div className="card-back">{card.emoji}</div>
                </div>
              </div>
            ))}
          </div>
          
          {completed && (
             <div style={{ marginTop: '24px', textAlign: 'center' }}>
                <button className="btn-primary" onClick={startNewGame} style={{ background: '#3b82f6' }}>Jogar Novamente 🔄</button>
             </div>
          )}
        </>
      )}

      <style jsx>{`
        .memory-container {
          background: #fff;
          border-radius: 20px;
          padding: 24px;
          box-shadow: var(--card-shadow);
        }
        .start-screen {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 32px 0;
        }
        .btn-primary {
          background: var(--accent-primary);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 999px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: transform 0.2s, filter 0.2s;
          box-shadow: 0 4px 12px rgba(234, 88, 12, 0.3);
        }
        .btn-primary:active { transform: scale(0.95); }
        .game-stats {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .pairs-text {
          font-weight: 500;
          color: var(--text-primary);
        }
        .completed-tag {
          color: #10b981;
          background: #d1fae5;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 600;
        }
        .memory-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          max-width: 500px;
          margin: 0 auto;
        }
        .memory-card {
          aspect-ratio: 1;
          perspective: 1000px;
          cursor: pointer;
        }
        .card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.6s;
          transform-style: preserve-3d;
        }
        .memory-card.flipped .card-inner {
          transform: rotateY(180deg);
        }
        .card-front, .card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 4rem;
          border-radius: 12px;
          user-select: none;
        }
        .card-front {
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          color: #94a3b8;
          transition: background 0.2s;
        }
        .memory-card:hover .card-front {
          background: #f1f5f9;
        }
        .card-back {
          background: #fff;
          border: 2px solid var(--accent-primary);
          transform: rotateY(180deg);
          box-shadow: inset 0 0 20px rgba(234, 88, 12, 0.05);
        }

        /* Mobile Adjustments */
        @media (max-width: 480px) {
           .memory-grid {
             gap: 8px;
             max-width: 100%;
           }
           .card-front, .card-back {
             font-size: 2.5rem;
             border-radius: 8px;
           }
        }
      `}</style>
    </div>
  );
}
