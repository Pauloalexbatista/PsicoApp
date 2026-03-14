"use client";

import { useState, useRef, useEffect } from "react";
import { completeActivity } from "../../actions";

export default function AudioHackPlayer({ patientId, moduleId }: { patientId: string; moduleId: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [completed, setCompleted] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const duration = 10; // 10 segundos de simulação

  useEffect(() => {
    return () => {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  const togglePlay = () => {
    if (!isPlaying) {
      // Iniciar Simulação de Som Relaxante (Binaural Beat like)
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(432, ctx.currentTime); // 432Hz Frequência de relaxamento
      
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 2); // Fade in
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + duration); // Fade out
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start();
      oscillatorRef.current = osc;
      setIsPlaying(true);

      // Simular fim do áudio após 10 segundos
      setTimeout(async () => {
        setIsPlaying(false);
        if (!completed) {
          setCompleted(true);
          await completeActivity(patientId, moduleId, "AudioHack: Foco", 50);
          alert("Missão Cumprida! Escutaste a cápsula completa. +50 Dopas");
        }
      }, duration * 1000);

    } else {
      // Parar áudio
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
        oscillatorRef.current = null;
      }
      setIsPlaying(false);
    }
  };

  return (
    <div className="player-container">
      <div className="player-controls">
        <button className="play-btn" onClick={togglePlay} style={{ background: isPlaying ? '#ef4444' : 'var(--accent-primary)' }}>
          {isPlaying ? "⏹ Parar Cápsula" : "▶ Ouvir Cápsula de Foco (10s)"}
        </button>
        {completed && <span className="completed-tag">✓ Concluído</span>}
      </div>

      <style jsx>{`
        .player-controls { display: flex; align-items: center; gap: 16px; }
        .play-btn {
          padding: 12px 24px;
          border-radius: 999px;
          border: none;
          color: #fff;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 12px rgba(234, 88, 12, 0.3);
        }
        .play-btn:hover { filter: brightness(1.1); transform: translateY(-2px); }
        .completed-tag { color: #10b981; font-weight: 600; font-size: 0.8125rem; }
      `}</style>
    </div>
  );
}
