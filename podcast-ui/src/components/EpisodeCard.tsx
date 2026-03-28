'use client';

import { useRef, useState } from 'react';

interface Episode {
  id: string | number;
  title: string;
  description: string;
  audio_url: string;
  published_at: string;
}

export default function EpisodeCard({ episode, index = 0 }: { episode: Episode; index?: number }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const nodeId = `NODE_${String(episode.id).padStart(3, '0')}`;
  const plain = episode.description.replace(/<[^>]+>/g, '');
  const date = new Date(episode.published_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  const fmt = (s: number) => {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const toggle = async () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      try {
        await a.play();
        setPlaying(true);
      } catch (err) {
        console.error('Audio play error:', err);
      }
    }
  };

  const onTimeUpdate = () => {
    const a = audioRef.current;
    if (a && a.duration) {
      setProgress((a.currentTime / a.duration) * 100);
      setCurrentTime(a.currentTime);
    }
  };

  const onLoaded = () => {
    const a = audioRef.current;
    if (a) setDuration(a.duration);
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const a = audioRef.current;
    if (!a || !a.duration) return;
    const r = e.currentTarget.getBoundingClientRect();
    a.currentTime = ((e.clientX - r.left) / r.width) * a.duration;
  };

  const barHeights = [5, 9, 13, 8, 11, 6, 10, 7, 12, 5, 9, 8];

  return (
    <article
      className="ep-card"
      style={{ animationDelay: `${index * 0.07}s` }}
    >
      <div className="shim" />
      <div className="corner" />

      {/* Header */}
      <div className="card-header">
        <span className="date-chip">
          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          {date}
        </span>
        <span className="node-tag">{nodeId}</span>
      </div>

      {/* Title */}
      <h3 className="ep-title">{episode.title}</h3>

      {/* Description */}
      <p className="ep-desc">{plain}</p>

      {/* Divider */}
      <div className="divider" />

      {/* ── AUDIO ELEMENT — preload metadata so duration loads fast ── */}
      <audio
        ref={audioRef}
        preload="metadata"
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoaded}
        onEnded={() => { setPlaying(false); setProgress(0); setCurrentTime(0); }}
      >
        <source src={episode.audio_url} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      {/* Progress bar */}
      <div className="prog-track" onClick={seek} title="Click to seek">
        <div className="prog-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* Time labels */}
      <div style={{
        display:'flex', justifyContent:'space-between', marginBottom:12,
        fontFamily:"'Space Mono',monospace", fontSize:8,
        color:'rgba(150,200,230,.3)', letterSpacing:'.1em',
      }}>
        <span>{fmt(currentTime)}</span>
        <span>{fmt(duration)}</span>
      </div>

      {/* Controls */}
      <div className="controls">
        {/* Play/Pause */}
        <button
          onClick={toggle}
          className={`play-btn${playing ? ' on' : ''}`}
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? (
            /* Pause */
            <span style={{ display:'flex', gap:3, alignItems:'center' }}>
              <span style={{ width:3, height:13, background: '#000', borderRadius:2 }} />
              <span style={{ width:3, height:13, background: '#000', borderRadius:2 }} />
            </span>
          ) : (
            /* Play triangle */
            <span style={{
              width:0, height:0,
              borderTop:'5px solid transparent',
              borderBottom:'5px solid transparent',
              borderLeft:'10px solid #00ffe5',
              marginLeft:2,
              display:'inline-block',
            }} />
          )}
        </button>

        {/* Waveform bars */}
        <div className={`wave${playing ? ' playing' : ''}`} aria-hidden="true">
          {barHeights.map((h, i) => (
            <div
              key={i}
              className="wbar"
              style={{
                height: h,
                animation: playing
                  ? `bounce ${0.34 + (i % 5) * 0.09}s ease-in-out ${i * 0.045}s infinite alternate`
                  : 'none',
              }}
            />
          ))}
        </div>

        <span className={`play-lbl${playing ? ' on' : ''}`}>
          {playing ? 'Playing…' : 'Listen'}
        </span>
      </div>

      {/* Analyze button */}
      <button className="analyze-btn">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
          <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z"/>
          <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
        </svg>
        Analyze Node
      </button>
    </article>
  );
}