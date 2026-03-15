"use client";

import { useState, useEffect } from "react";
import { completeActivity } from "../../../actions";

// List of 21 words with emojis
const WORD_LIST = [
  { word: "CAO", emoji: "🐶" },
  { word: "GATO", emoji: "🐱" },
  { word: "RAPOSA", emoji: "🦊" },
  { word: "URSO", emoji: "🐻" },
  { word: "PANDA", emoji: "🐼" },
  { word: "COALA", emoji: "🐨" },
  { word: "SAPO", emoji: "🐸" },
  { word: "COELHO", emoji: "🐰" },
  { word: "LEAO", emoji: "🦁" },
  { word: "TIGRE", emoji: "🐯" },
  { word: "VACA", emoji: "🐮" },
  { word: "PORCO", emoji: "🐷" },
  { word: "MACACO", emoji: "🐵" },
  { word: "GALINHA", emoji: "🐔" },
  { word: "PINGUIM", emoji: "🐧" },
  { word: "CORUJA", emoji: "🦉" },
  { word: "TARTARUGA", emoji: "🐢" },
  { word: "POLVO", emoji: "🐙" },
  { word: "PEIXE", emoji: "🐟" },
  { word: "BORBOLETA", emoji: "🦋" },
  { word: "CARACOL", emoji: "🐌" }
];

type Difficulty = "FÁCIL" | "DIFÍCIL";

export default function WordBuilderGame({ patientId, moduleId }: { patientId: string; moduleId: string }) {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  
  const [currentWordObj, setCurrentWordObj] = useState<{ word: string, emoji: string } | null>(null);
  const [availableLetters, setAvailableLetters] = useState<{ id: number; letter: string; used: boolean }[]>([]);
  const [builtWord, setBuiltWord] = useState<{ id: number; letter: string }[]>([]);
  
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completed, setCompleted] = useState(false);
  
  const [wordsCompleted, setWordsCompleted] = useState(0);
  
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
    setScore(0);
    setWordsCompleted(0);
    setStartTime(Date.now());
    setTimeElapsed(0);
    setIsPlaying(true);
    setCompleted(false);
    loadNextWord(level);
  };

  const loadNextWord = (level: Difficulty) => {
    // Pick a random word from the list
    const randomIndex = Math.floor(Math.random() * WORD_LIST.length);
    const wordObj = WORD_LIST[randomIndex];
    
    setCurrentWordObj(wordObj);
    setBuiltWord([]);
    
    let lettersToScramble = wordObj.word.split("");
    
    if (level === "DIFÍCIL") {
      // Add 3 random distractor letters
      const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      for (let i = 0; i < 3; i++) {
        lettersToScramble.push(alphabet[Math.floor(Math.random() * alphabet.length)]);
      }
    }
    
    // Scramble the letters
    const scrambled = lettersToScramble
      .sort(() => Math.random() - 0.5)
      .map((letter, index) => ({ id: index, letter, used: false }));
      
    setAvailableLetters(scrambled);
  };

  const handleLetterClick = (letterObj: { id: number; letter: string; used: boolean }) => {
    if (!isPlaying || letterObj.used) return;

    // Mark as used
    const newAvailable = [...availableLetters];
    const index = newAvailable.findIndex(l => l.id === letterObj.id);
    newAvailable[index].used = true;
    setAvailableLetters(newAvailable);
    
    // Add to built word
    const newBuiltWord = [...builtWord, { id: letterObj.id, letter: letterObj.letter }];
    setBuiltWord(newBuiltWord);
    
    // Check if word is complete
    const currentBuiltStr = newBuiltWord.map(l => l.letter).join("");
    
    if (currentBuiltStr.length === currentWordObj?.word.length) {
      if (currentBuiltStr === currentWordObj.word) {
        // Correct Word!
        setScore(s => s + 20);
        setTimeout(() => {
          if (wordsCompleted + 1 >= 5) { // 5 words to win a round
             finishGame(score + 20);
          } else {
             setWordsCompleted(w => w + 1);
             loadNextWord(difficulty!);
          }
        }, 1000);
      } else {
        // Wrong Word! Error feedback
        setScore(s => Math.max(0, s - 5));
        // Reset the letters for this word after a short delay
        setTimeout(() => {
           setBuiltWord([]);
           setAvailableLetters(availableLetters.map(l => ({ ...l, used: false })));
        }, 800);
      }
    }
  };

  const removeLetter = (builtObj: { id: number; letter: string }) => {
    // Remove from bottom tray
    const newBuiltWord = builtWord.filter(l => l.id !== builtObj.id);
    setBuiltWord(newBuiltWord);
    
    // Mark as available again
    const newAvailable = [...availableLetters];
    const index = newAvailable.findIndex(l => l.id === builtObj.id);
    if (index !== -1) {
      newAvailable[index].used = false;
      setAvailableLetters(newAvailable);
    }
  };

  const finishGame = (finalScore: number) => {
    setIsPlaying(false);
    setCompleted(true);
    const gameData = JSON.stringify({ tempo: timeElapsed, pontuacao: finalScore, dificuldade: difficulty, palavras_completas: 5 });
    completeActivity(patientId, moduleId, "Neuro-Game: Construtor Palavras", finalScore, gameData)
      .catch(console.error);
  };

  return (
    <div className="game-container">
      {!isPlaying && !completed ? (
        <div className="start-screen">
           <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🧩</div>
          <h2 style={{ marginBottom: "16px" }}>Construtor de Palavras</h2>
          <p style={{ color: "var(--text-muted)", marginBottom: "32px", textAlign: "center", maxWidth: "400px" }}>
            Olha para o desenho e constrói a palavra certa usando as letras baralhadas!
            Completa 5 palavras para vencer.
          </p>
          
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
            <button className="btn-secondary" onClick={() => startGame("FÁCIL")}>Fácil (Só letras da palavra)</button>
            <button className="btn-secondary" onClick={() => startGame("DIFÍCIL")}>Difícil (Letras extra)</button>
          </div>
        </div>
      ) : (
        <>
          <div className="game-header">
            <div className="stats-pill">Desafio: {wordsCompleted + 1} / 5</div>
            <div className="stats-pill">⏱️ {timeElapsed}s</div>
            <div className="stats-pill">⭐ {score} pts</div>
          </div>

          {!completed && currentWordObj && (
            <div className="play-area">
               <div className="emoji-display">
                 {currentWordObj.emoji}
               </div>

               {/* Slots onde as letras caem */}
               <div className="word-slots">
                 {Array.from({ length: currentWordObj.word.length }).map((_, i) => (
                   <div key={`slot-${i}`} className={`slot ${builtWord[i] ? 'filled' : ''}`} onClick={() => builtWord[i] && removeLetter(builtWord[i])}>
                      {builtWord[i] ? builtWord[i].letter : ""}
                   </div>
                 ))}
               </div>
               
               {/* Letras disponíveis para clicar */}
               <div className="letters-pool">
                 {availableLetters.map(item => (
                   <button
                     key={item.id}
                     className={`pool-letter ${item.used ? "used" : ""}`}
                     onClick={() => handleLetterClick(item)}
                     disabled={item.used}
                   >
                     {item.letter}
                   </button>
                 ))}
               </div>
            </div>
          )}
          
          {completed && (
             <div className="completion-card">
                <h3>Mestre das Palavras! 🏆</h3>
                <p>Tempo: {timeElapsed}s | Pontuação Final: {score}</p>
                <div style={{ marginTop: '24px', display: 'flex', gap: '16px', justifyContent: 'center' }}>
                  <button className="btn-primary" onClick={() => startGame(difficulty!)}>Jogar Novamente 🔄</button>
                  <button className="btn-secondary" onClick={() => { setIsPlaying(false); setCompleted(false); }}>Menu Principal</button>
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
          background: #fdf2f8; /* Pinkish background for word game */
          padding: 8px 16px;
          border-radius: 999px;
          font-weight: 600;
          color: #be185d;
          font-size: 0.9rem;
        }
        .play-area {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 40px;
          margin-top: 20px;
        }
        .emoji-display {
          font-size: 8rem;
          line-height: 1;
          filter: drop-shadow(0 10px 15px rgba(0,0,0,0.1));
          animation: bounce 2s infinite ease-in-out;
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .word-slots {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .slot {
          width: 60px;
          height: 70px;
          border-bottom: 4px solid #cbd5e1;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--text-primary);
          transition: all 0.2s;
          cursor: pointer;
        }
        .slot.filled {
          border-bottom-color: #ec4899;
          color: #db2777;
        }
        .slot.filled:hover {
          background: #fdf2f8;
          border-radius: 8px 8px 0 0;
        }
        
        .letters-pool {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          justify-content: center;
          max-width: 500px;
        }
        .pool-letter {
          width: 60px;
          height: 60px;
          font-size: 1.8rem;
          font-weight: 700;
          border-radius: 12px;
          border: 2px solid #e2e8f0;
          background: #f8fafc;
          color: var(--text-primary);
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .pool-letter:hover:not(:disabled) {
          border-color: #ec4899;
          transform: translateY(-4px);
          box-shadow: 0 10px 15px -3px rgba(236, 72, 153, 0.2);
        }
        .pool-letter:active:not(:disabled) {
          transform: translateY(0);
        }
        .pool-letter.used {
          opacity: 0;
          transform: scale(0);
          pointer-events: none;
        }

        .completion-card {
           margin-top: 40px;
           background: #fdf2f8;
           border: 2px solid #fbcfe8;
           padding: 24px;
           border-radius: 16px;
           text-align: center;
        }
        .completion-card h3 { color: #9d174d; margin-bottom: 8px; }
        .completion-card p { color: #be185d; font-weight: 500; }
        
        .btn-primary, .btn-secondary {
          padding: 12px 24px;
          border-radius: 999px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, filter 0.2s;
        }
        .btn-primary {
          background: #ec4899;
          color: white;
          border: none;
          box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
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
