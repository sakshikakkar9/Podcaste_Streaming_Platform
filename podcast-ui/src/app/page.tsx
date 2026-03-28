import { supabase } from '@/lib/supabase';
import EpisodeCard from '@/components/EpisodeCard';

export const revalidate = 300;

export default async function Home() {
  const { data } = await supabase
    .from('episodes')
    .select('id, title, description, audio_url, published_at')
    .order('published_at', { ascending: false })
    .limit(12);

  const episodes = data || [];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Orbitron:wght@700;900&family=Rajdhani:wght@400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        body {
          font-family: 'Rajdhani', 'Segoe UI', sans-serif;
          background: #020408;
          color: #cce8ff;
          min-height: 100vh;
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
        }

        /* Grid mesh BG */
        body {
          background-image:
            linear-gradient(rgba(0,255,229,0.022) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,229,0.022) 1px, transparent 1px);
          background-size: 60px 60px;
          background-color: #020408;
        }

        /* Scanlines */
        body::before {
          content: '';
          position: fixed; inset: 0; z-index: 9999; pointer-events: none;
          background: repeating-linear-gradient(
            0deg, transparent, transparent 3px,
            rgba(0,255,229,0.011) 3px, rgba(0,255,229,0.011) 4px
          );
        }

        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: #020408; }
        ::-webkit-scrollbar-thumb { background: #00ffe5; border-radius: 4px; }

        @keyframes ticker { from { transform:translateX(0); } to { transform:translateX(-50%); } }
        @keyframes blink { 0%,100%{opacity:1}50%{opacity:0} }
        @keyframes floatup { from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)} }
        @keyframes orb1 { 0%,100%{transform:translate(0,0)}50%{transform:translate(70px,-50px)} }
        @keyframes orb2 { 0%,100%{transform:translate(0,0)}50%{transform:translate(-50px,60px)} }
        @keyframes pulsedot { 0%,100%{box-shadow:0 0 4px 1px #00ffe5;opacity:1}50%{box-shadow:0 0 10px 3px #00ffe5;opacity:.5} }
        @keyframes bounce { 0%,100%{transform:scaleY(.4)}50%{transform:scaleY(1.5)} }
        @keyframes shimmer { from{left:-100%}to{left:200%} }

        .orb1 { animation: orb1 18s ease-in-out infinite; }
        .orb2 { animation: orb2 22s ease-in-out infinite; }

        /* Navbar */
        .nav {
          position: fixed; top:0; left:0; right:0; z-index:100;
          height:54px; display:flex; align-items:center; justify-content:space-between;
          padding:0 28px;
          background:rgba(2,4,8,.9); backdrop-filter:blur(20px);
          border-bottom:1px solid rgba(0,255,229,.07);
        }
        .nav-logo {
          display:flex; align-items:center; gap:10px;
          font-family:'Orbitron',monospace; font-size:.78rem; font-weight:700;
          letter-spacing:.06em; color:#cce8ff; text-decoration:none;
        }
        .nav-icon {
          width:28px; height:28px; border-radius:7px;
          display:flex; align-items:center; justify-content:center;
          background:linear-gradient(135deg,#00ffe5,#00b8a0);
          box-shadow:0 0 14px rgba(0,255,229,.55);
          flex-shrink:0;
        }
        .nav-links { display:flex; gap:24px; }
        .nav-links a {
          font-family:'Space Mono',monospace; font-size:9px;
          letter-spacing:.28em; text-transform:uppercase; text-decoration:none;
          color:rgba(255,255,255,.22); transition:color .2s;
        }
        .nav-links a:hover { color:#00ffe5; }
        .live-badge {
          display:flex; align-items:center; gap:6px;
          font-family:'Space Mono',monospace; font-size:9px;
          letter-spacing:.25em; text-transform:uppercase; color:#00ffe5;
          background:rgba(0,255,229,.07); border:1px solid rgba(0,255,229,.2);
          padding:4px 10px; border-radius:999px;
        }
        .pulse-dot {
          width:7px; height:7px; border-radius:50%; background:#00ffe5;
          animation:pulsedot 2s ease-in-out infinite;
        }

        /* Ticker */
        .ticker-wrap {
          position:fixed; top:54px; left:0; right:0; z-index:99;
          height:26px; overflow:hidden; display:flex; align-items:center;
          background:rgba(0,255,229,.025); border-bottom:1px solid rgba(0,255,229,.06);
        }
        .ticker-track {
          display:flex; white-space:nowrap;
          font-family:'Space Mono',monospace; font-size:8px;
          letter-spacing:.18em; color:rgba(0,255,229,.4); text-transform:uppercase;
          animation:ticker 30s linear infinite;
        }

        /* Main */
        .main { position:relative; z-index:1; max-width:1300px; margin:0 auto; padding:108px 24px 80px; }

        /* Hero */
        .hero { margin-bottom:64px; }
        .status-pill {
          display:inline-flex; align-items:center; gap:8px; margin-bottom:20px;
          font-family:'Space Mono',monospace; font-size:9px;
          letter-spacing:.28em; text-transform:uppercase; color:#00ffe5;
          background:rgba(0,255,229,.06); border:1px solid rgba(0,255,229,.18);
          padding:5px 14px; border-radius:999px; box-shadow:0 0 18px rgba(0,255,229,.07);
        }
        .hero-title {
          font-family:'Orbitron',monospace; font-weight:900;
          font-size:clamp(2.8rem,7vw,7rem); line-height:.95;
          letter-spacing:-.02em; text-transform:uppercase; color:#cce8ff;
          margin-bottom:20px;
        }
        .hero-title .glow {
          color:#00ffe5;
          text-shadow:0 0 20px rgba(0,255,229,.7),0 0 50px rgba(0,255,229,.3),0 0 100px rgba(0,255,229,.1);
        }
        .hero-sub {
          font-size:1rem; font-weight:500; line-height:1.7; color:rgba(150,200,230,.5);
          border-left:2px solid rgba(0,255,229,.2); padding-left:16px; max-width:460px;
        }
        .stats-row { display:flex; gap:28px; }
        .stat-val {
          font-family:'Orbitron',monospace; font-size:1.5rem; font-weight:800;
          color:#00ffe5; text-shadow:0 0 14px rgba(0,255,229,.5); display:block;
        }
        .stat-lbl {
          font-family:'Space Mono',monospace; font-size:8px;
          letter-spacing:.3em; text-transform:uppercase; color:rgba(255,255,255,.18);
        }
        .hero-rule { margin-top:32px; height:1px; background:linear-gradient(90deg,#00ffe5,rgba(124,111,255,.4),transparent); box-shadow:0 0 10px rgba(0,255,229,.25); }

        /* Section label */
        .sec-label {
          display:flex; align-items:center; gap:10px; margin-bottom:24px;
          font-family:'Space Mono',monospace; font-size:9px;
          letter-spacing:.32em; text-transform:uppercase; color:rgba(0,255,229,.45);
        }
        .sec-line { flex:1; height:1px; background:rgba(0,255,229,.06); }

        /* GRID — THE CRITICAL PART */
        .ep-grid {
          display:grid;
          grid-template-columns:repeat(3,1fr);
          gap:20px;
        }
        @media(max-width:1040px){ .ep-grid{grid-template-columns:repeat(2,1fr);} }
        @media(max-width:640px){ .ep-grid{grid-template-columns:1fr;} }
        @media(max-width:640px){ .nav-links{display:none;} }

        /* Episode card */
        .ep-card {
          position:relative; display:flex; flex-direction:column;
          border-radius:18px; padding:22px; overflow:hidden;
          background:rgba(4,14,30,.94);
          border:1px solid rgba(0,255,229,.09);
          backdrop-filter:blur(18px);
          transition:border-color .3s, box-shadow .3s, transform .3s;
          animation:floatup .55s ease both;
        }
        .ep-card:hover {
          border-color:rgba(0,255,229,.36);
          box-shadow:0 0 28px rgba(0,255,229,.09),0 8px 36px rgba(0,0,0,.65);
          transform:translateY(-3px);
        }
        .ep-card::before {
          content:''; position:absolute; inset:0; border-radius:18px; pointer-events:none;
          background:radial-gradient(ellipse at 20% 0%,rgba(0,255,229,.055) 0%,transparent 65%);
          opacity:0; transition:opacity .35s;
        }
        .ep-card:hover::before { opacity:1; }
        /* shimmer */
        .ep-card .shim {
          position:absolute; top:0; width:40%; height:100%; pointer-events:none; opacity:0;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,.035),transparent);
        }
        .ep-card:hover .shim { opacity:1; animation:shimmer .75s ease; }
        /* corner */
        .ep-card .corner {
          position:absolute; top:0; right:0; width:50px; height:50px; pointer-events:none;
          background:conic-gradient(from 135deg,transparent 38%,rgba(0,255,229,.32) 50%,transparent 62%);
          border-radius:0 18px 0 0; opacity:.45; transition:opacity .3s;
        }
        .ep-card:hover .corner { opacity:1; }

        /* Card inner */
        .card-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:14px; }
        .date-chip {
          display:inline-flex; align-items:center; gap:4px;
          font-family:'Space Mono',monospace; font-size:8px;
          letter-spacing:.16em; text-transform:uppercase;
          color:rgba(0,255,229,.5); background:rgba(0,255,229,.05);
          border:1px solid rgba(0,255,229,.11); padding:3px 8px; border-radius:999px;
        }
        .node-tag {
          font-family:'Space Mono',monospace; font-size:8px; letter-spacing:.18em;
          color:rgba(0,255,229,.35); background:rgba(0,255,229,.04);
          border:1px solid rgba(0,255,229,.1); padding:2px 7px; border-radius:999px;
        }
        .ep-title {
          font-family:'Rajdhani',sans-serif; font-weight:700; font-size:1rem;
          line-height:1.35; color:#cce8ff; margin-bottom:9px;
          display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;
          transition:color .25s;
        }
        .ep-card:hover .ep-title { color:#00ffe5; }
        .ep-desc {
          font-size:.77rem; line-height:1.6; color:rgba(150,200,230,.42); margin-bottom:14px;
          display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden;
        }
        .divider { height:1px; margin-bottom:14px; background:linear-gradient(90deg,transparent,rgba(0,255,229,.15) 40%,rgba(124,111,255,.1) 70%,transparent); }

        /* Progress bar */
        .prog-track {
          width:100%; height:3px; border-radius:4px;
          background:rgba(255,255,255,.07); cursor:pointer; margin-bottom:12px; overflow:hidden;
        }
        .prog-fill { height:100%; border-radius:4px; background:linear-gradient(90deg,#00ffe5,#7c6fff); transition:width .1s linear; }

        /* Controls row */
        .controls { display:flex; align-items:center; gap:10px; margin-bottom:14px; }
        .play-btn {
          width:36px; height:36px; border-radius:50%; flex-shrink:0;
          display:flex; align-items:center; justify-content:center;
          background:rgba(0,255,229,.08); border:1px solid rgba(0,255,229,.3);
          cursor:pointer; transition:all .25s;
        }
        .play-btn:hover { background:rgba(0,255,229,.18); box-shadow:0 0 14px rgba(0,255,229,.45); }
        .play-btn.on { background:#00ffe5; box-shadow:0 0 18px rgba(0,255,229,.6); }
        .wave { display:flex; align-items:flex-end; gap:2px; height:18px; }
        .wbar { width:3px; border-radius:2px; background:rgba(0,255,229,.25); transform-origin:bottom; transition:background .3s; }
        .wave.playing .wbar { background:#00ffe5; }
        .play-lbl { margin-left:auto; font-family:'Space Mono',monospace; font-size:9px; letter-spacing:.2em; text-transform:uppercase; color:rgba(255,255,255,.16); transition:color .3s; }
        .play-lbl.on { color:#00ffe5; }

        /* Analyze btn */
        .analyze-btn {
          width:100%; padding:10px 0; border-radius:11px;
          border:1px solid rgba(124,111,255,.32);
          background:rgba(124,111,255,.1); color:rgba(200,196,255,.8);
          font-family:'Space Mono',monospace; font-size:9px;
          letter-spacing:.22em; text-transform:uppercase;
          cursor:pointer; display:flex; align-items:center; justify-content:center; gap:7px;
          transition:all .25s;
        }
        .analyze-btn:hover {
          background:rgba(124,111,255,.22);
          box-shadow:0 0 20px rgba(124,111,255,.42);
          border-color:rgba(124,111,255,.55); color:#fff;
        }

        /* Footer */
        .footer {
          margin-top:72px; padding-top:22px;
          border-top:1px solid rgba(0,255,229,.06);
          display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:10px;
        }
        .footer-txt { font-family:'Space Mono',monospace; font-size:9px; letter-spacing:.22em; text-transform:uppercase; color:rgba(255,255,255,.14); }
        .footer-status { display:flex; align-items:center; gap:6px; font-family:'Space Mono',monospace; font-size:9px; letter-spacing:.22em; text-transform:uppercase; color:rgba(0,255,229,.28); }
      `}</style>

      {/* Orbs */}
      <div className="orb1" style={{
        position:'fixed', top:'-15vh', left:'-8vw', width:'55vw', height:'55vh',
        pointerEvents:'none', zIndex:0,
        background:'radial-gradient(ellipse,rgba(0,255,229,.05) 0%,transparent 72%)',
        filter:'blur(70px)',
      }} />
      <div className="orb2" style={{
        position:'fixed', bottom:'-10vh', right:'-5vw', width:'50vw', height:'50vh',
        pointerEvents:'none', zIndex:0,
        background:'radial-gradient(ellipse,rgba(124,111,255,.07) 0%,transparent 72%)',
        filter:'blur(90px)',
      }} />

      {/* Navbar */}
      <nav className="nav">
        <a href="/" className="nav-logo">
          <div className="nav-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              <line x1="12" y1="19" x2="12" y2="23"/>
              <line x1="8" y1="23" x2="16" y2="23"/>
            </svg>
          </div>
          Podcast<span style={{color:'#00ffe5'}}>Hub</span>
        </a>
        <div className="nav-links">
          {['Feed','Analytics','Pipeline','Docs'].map(n=>(
            <a key={n} href="#">{n}</a>
          ))}
        </div>
        <div className="live-badge">
          <span className="pulse-dot" />
          LIVE
        </div>
      </nav>

      {/* Ticker */}
      <div className="ticker-wrap">
        <div className="ticker-track">
          {'◆ AIRFLOW: RUNNING ◆ SUPABASE: CONNECTED ◆ PIPELINE: ACTIVE ◆ FEED: MARKETPLACE_RSS ◆ SCHEDULE: @DAILY ◆ STATUS: OPTIMAL ◆ BROADCAST: LIVE ◆ ENGINE: TURBOPACK ◆ NODES: ' + episodes.length + ' '.repeat(4) +
           '◆ AIRFLOW: RUNNING ◆ SUPABASE: CONNECTED ◆ PIPELINE: ACTIVE ◆ FEED: MARKETPLACE_RSS ◆ SCHEDULE: @DAILY ◆ STATUS: OPTIMAL ◆ BROADCAST: LIVE ◆ ENGINE: TURBOPACK ◆ NODES: ' + episodes.length + ' '.repeat(4)}
        </div>
      </div>

      {/* Main */}
      <main className="main">

        {/* Hero */}
        <header className="hero">
          <div className="status-pill">
            <span className="pulse-dot" style={{width:6,height:6}} />
            SYS_STATUS: OPTIMAL
            <span style={{animation:'blink 1.2s step-end infinite',color:'rgba(0,255,229,.4)',marginLeft:2}}>█</span>
          </div>
          <h1 className="hero-title">
            Intelligence<br/>
            <span className="glow">Terminal.</span>
          </h1>
          <div style={{display:'flex',flexWrap:'wrap',alignItems:'flex-end',gap:28}}>
            <p className="hero-sub">
              Real-time feed processing from Marketplace RSS. Automated intelligence pipelines via Apache Airflow &amp; Supabase.
            </p>
            <div className="stats-row" style={{marginLeft:'auto'}}>
              {[{v:episodes.length,l:'Episodes'},{v:'Active',l:'Pipeline'},{v:'<2s',l:'Latency'}].map(s=>(
                <div key={s.l} style={{textAlign:'center'}}>
                  <span className="stat-val">{s.v}</span>
                  <span className="stat-lbl">{s.l}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="hero-rule" />
        </header>

        {/* Section label */}
        <div className="sec-label">
          ◆ Latest Transmissions
          <div className="sec-line" />
          <span style={{color:'rgba(255,255,255,.14)'}}>{episodes.length} nodes</span>
        </div>

        {/* Grid */}
        <div className="ep-grid">
          {episodes.map((ep, i) => (
            <EpisodeCard key={ep.id} episode={ep} index={i} />
          ))}
        </div>

        {/* Footer */}
        <footer className="footer">
          <span className="footer-txt">© 2026 PodcastHub — Airflow · Supabase · Next.js</span>
          <div className="footer-status">
            <span style={{width:5,height:5,borderRadius:'50%',background:'#00ffe5',boxShadow:'0 0 6px #00ffe5',display:'inline-block'}} />
            All Systems Nominal
          </div>
        </footer>
      </main>
    </>
  );
}