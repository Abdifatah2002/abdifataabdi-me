'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

// ─── Data ─────────────────────────────────────────────────────────────
// TODO: Replace placeholder entries below with your real experience, projects, etc.

const experience = [
  { name: '[Company Name]', year: '2025', role: '[Your Role]' },
  { name: '[Company Name]', year: '2024', role: '[Your Role]' },
];

const involvement = [
  { name: '[Organization Name]', year: '2023–Present', role: '[Your Role]' },
  { name: '[Organization Name]', year: '2022–Present', role: '[Your Role]' },
];

const programs = [
  { name: '[Company]', program: '[Program Name]', year: '2024' },
  { name: '[Company]', program: '[Program Name]', year: '2024' },
];

const projects = [
  {
    name: '[Project Name]',
    desc: '[Short description of what this project does and the problem it solves.]',
    tags: ['React', 'TypeScript', 'Node.js'],
    link: 'https://github.com/Abdifatah2002',
  },
  {
    name: '[Project Name]',
    desc: '[Short description of what this project does and the problem it solves.]',
    tags: ['Python', 'Flask', 'PostgreSQL'],
    link: 'https://github.com/Abdifatah2002',
  },
  {
    name: '[Project Name]',
    desc: '[Short description of what this project does and the problem it solves.]',
    tags: ['Java', 'Spring Boot'],
    link: 'https://github.com/Abdifatah2002',
  },
];

const techCategories: Array<{ name: string; items: string[] }> = [
  // TODO: Update with your actual tech stack
  { name: 'Languages', items: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C/C++', 'HTML/CSS', 'SQL'] },
  { name: 'Frameworks & Libraries', items: ['React', 'Next.js', 'Node.js', 'Express', 'Flask', 'TailwindCSS'] },
  { name: 'Tools & Infrastructure', items: ['Git', 'Docker', 'AWS', 'PostgreSQL', 'MongoDB', 'Jira', 'Agile'] },
];

type Post = { date: string; title: string; lede?: string; hero?: string; paragraphs: string[] };

const posts: Post[] = [
  // TODO: Replace with your own writing.
  {
    date: '2025',
    title: '[Your First Post Title]',
    lede: '[One-sentence hook for your post.]',
    paragraphs: [
      '[Opening paragraph.]',
      '[Second paragraph.]',
      '[Closing paragraph.]',
    ],
  },
];

// ─── Graph: W₆ wheel ──────────────────────────────────────────────────

type PyramidVertex = { id: string; label: string; full: string; section: string };

const NODES: PyramidVertex[] = [
  { id: 'intro',        label: '0', full: 'Intro',        section: '#intro' },
  { id: 'experience',   label: '1', full: 'Experience',   section: '#experience' },
  { id: 'technologies', label: '2', full: 'Technologies', section: '#technologies' },
  { id: 'projects',     label: '3', full: 'Projects',     section: '#projects' },
  { id: 'writing',      label: '4', full: 'Writing',      section: '#writing' },
  { id: 'visitor',      label: '5', full: 'Visitor',      section: '#last-visitor' },
  { id: 'contact',      label: '6', full: 'Contact',      section: '#contact' },
];

const APEX_Y = -94;
const BASE_CY = 32;
const BASE_RX = 96;
const BASE_RY = 22;
const BASE_ANGLES_DEG = [90, 30, -30, -90, -150, 150];

function pyramidPos(label: string) {
  if (label === '0') return { x: 0, y: APEX_Y, back: false };
  const i = parseInt(label, 10) - 1;
  const rad = (BASE_ANGLES_DEG[i] * Math.PI) / 180;
  return { x: BASE_RX * Math.cos(rad), y: BASE_CY - BASE_RY * Math.sin(rad), back: Math.sin(rad) > 0.1 };
}

const EDGES: Array<{ a: string; b: string; kind: 'front' | 'back' | 'connector' }> = (() => {
  const out: Array<{ a: string; b: string; kind: 'front' | 'back' | 'connector' }> = [];
  const baseIds = NODES.slice(1).map(n => n.id);
  for (const id of baseIds) out.push({ a: 'intro', b: id, kind: 'connector' });
  for (let i = 0; i < 6; i++) {
    const a = baseIds[i], b = baseIds[(i + 1) % 6];
    let diff = BASE_ANGLES_DEG[(i + 1) % 6] - BASE_ANGLES_DEG[i];
    if (diff > 180) diff -= 360; if (diff < -180) diff += 360;
    const midRad = (BASE_ANGLES_DEG[i] + diff / 2) * Math.PI / 180;
    out.push({ a, b, kind: Math.sin(midRad) > 0.1 ? 'back' : 'front' });
  }
  return out;
})();

// ─── Pyramid3D ────────────────────────────────────────────────────────

type PyramidProps = {
  size: number; active?: string | null; showLabels?: boolean;
  interactive?: boolean; building?: boolean;
  onNodeClick?: (id: string) => void; className?: string;
};

function Pyramid3D({ size, active, showLabels, interactive, building, onNodeClick, className }: PyramidProps) {
  const positions = NODES.reduce((acc, n) => { acc[n.id] = pyramidPos(n.label); return acc; }, {} as Record<string, ReturnType<typeof pyramidPos>>);
  return (
    <svg width={size} height={size} viewBox="-140 -140 280 280" className={`pyramid ${building ? 'is-building' : ''} ${className ?? ''}`} aria-hidden="true">
      <g className="pyramid-edges">
        {EDGES.map((e, i) => { const pa = positions[e.a], pb = positions[e.b]; return (
          <line key={i} x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y} className={`pyramid-edge pyramid-edge-${e.kind}`} pathLength={1} style={{ ['--ei' as string]: i } as React.CSSProperties} />
        ); })}
      </g>
      <g className="pyramid-nodes">
        {NODES.map((n, i) => { const p = positions[n.id]; const isActive = active === n.id; return (
          <g key={n.id} className={`pyramid-node-group ${p.back ? 'is-back' : 'is-front'} ${isActive ? 'is-active' : ''} ${interactive ? 'is-interactive' : ''}`}
            style={{ ['--tx' as string]: `${p.x}px`, ['--ty' as string]: `${p.y}px`, ['--ni' as string]: i } as React.CSSProperties}
            onClick={interactive && onNodeClick ? (e) => { e.stopPropagation(); onNodeClick(n.id); } : undefined}>
            <circle cx="0" cy="0" r={p.back ? 3.4 : 4.4} className="pyramid-node" />
            {interactive && <circle cx="0" cy="0" r={14} className="pyramid-node-hit" />}
            {showLabels && <text x="0" y={p.back ? -10 : 14} className="pyramid-label" textAnchor="middle" dominantBaseline={p.back ? 'auto' : 'hanging'}>{n.full}</text>}
          </g>
        ); })}
      </g>
    </svg>
  );
}

// ─── PyramidNav ──────────────────────────────────────────────────────

type PyramidMode = 'loading' | 'docked' | 'expanded';

function PyramidNav({ mode, active, onExpand, onCollapse, onNodeClick }: {
  mode: PyramidMode; active: string | null;
  onExpand: () => void; onCollapse: () => void; onNodeClick: (id: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (mode !== 'expanded') return;
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onCollapse(); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [mode, onCollapse]);
  return (
    <div ref={ref} className={`pyramid-nav is-${mode}`}
      role={mode === 'docked' ? 'button' : undefined}
      aria-label={mode === 'docked' ? 'Open navigation pyramid' : 'Section navigation pyramid'}
      tabIndex={mode === 'docked' ? 0 : -1}
      onClick={() => { if (mode === 'docked') onExpand(); }}
      onKeyDown={(e) => { if (mode === 'docked' && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); onExpand(); } }}>
      <Pyramid3D size={280} active={active} showLabels={mode !== 'docked'} interactive={mode === 'expanded'} building={mode === 'loading'} onNodeClick={onNodeClick} />
      {mode === 'docked' && <span className="pyramid-nav-hint">W₆</span>}
    </div>
  );
}

// ─── LoadingOverlay ──────────────────────────────────────────────────

const VISIT_KEY = 'portfolio_first_visit_v1';

function LoadingOverlay({ fading }: { fading: boolean }) {
  return (
    <div className={`loader-bg ${fading ? 'is-fading' : ''}`} aria-hidden="true">
      <div className="loader-stats">
        <span className="ls-1">W₆ = (V, E)</span>
        <span className="ls-2">|V| = 7</span>
        <span className="ls-3">|E| = 12</span>
        <span className="ls-4">— booting graph —</span>
      </div>
    </div>
  );
}

// ─── Visitor Map ─────────────────────────────────────────────────────

type StoredVisitor = { city: string; country: string; lat: number; lon: number; ts: number };

function timeAgo(ts: number) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 10) return 'just now';
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function VisitorMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<{ city: string; country: string; ts: number; live: boolean } | null>(null);
  const [count, setCount] = useState<number | null>(null);
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let map: any = null;
    async function init() {
      const KEY_LAST = 'portfolio_last_visitor_v2';
      const getStored = () => { try { const r = localStorage.getItem(KEY_LAST); return r ? JSON.parse(r) : null; } catch { return null; } };
      const setStored = (d: StoredVisitor) => localStorage.setItem(KEY_LAST, JSON.stringify(d));
      const stored = getStored();
      if (stored) setStatus({ city: stored.city, country: stored.country, ts: stored.ts, live: false });
      try { const res = await fetch('/api/visit'); const { count: gc } = await res.json(); setCount(gc); } catch {}
      const maplibregl = (await import('maplibre-gl')).default;
      await import('maplibre-gl/dist/maplibre-gl.css');
      const lat = stored?.lat ?? 44.98, lon = stored?.lon ?? -93.27;
      map = new maplibregl.Map({
        container: mapRef.current!,
        style: { version: 8, sources: { carto: { type: 'raster', tiles: ['https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png'], tileSize: 256, attribution: '© CARTO, © OpenStreetMap contributors' } }, layers: [{ id: 'carto', type: 'raster', source: 'carto', minzoom: 0, maxzoom: 19 }] },
        center: [lon, lat], zoom: 4, interactive: true, attributionControl: { compact: true },
      });
      const addMarker = (lng: number, lt: number) => {
        const el = document.createElement('div');
        el.style.cssText = 'width:10px;height:10px;border-radius:50%;background:#3b82f6;border:2px solid #fff;box-shadow:0 0 0 2px rgba(59,130,246,0.35);cursor:default;';
        new maplibregl.Marker({ element: el, anchor: 'center' }).setLngLat([lng, lt]).addTo(map);
      };
      if (stored) map.on('load', () => addMarker(lon, lat));
      try {
        const r = await fetch('https://ipapi.co/json/'); const d = await r.json();
        if (d.latitude) {
          const fresh = { city: d.city || d.region || 'Unknown', country: d.country_code || '??', lat: d.latitude, lon: d.longitude, ts: Date.now() };
          setStored(fresh);
          try { const res = await fetch('/api/visit', { method: 'POST' }); const { count: nc } = await res.json(); setCount(nc); } catch {}
          setStatus({ ...fresh, live: true });
          map.flyTo({ center: [fresh.lon, fresh.lat], zoom: 5, duration: stored ? 1200 : 0 });
          map.once('idle', () => addMarker(fresh.lon, fresh.lat));
        }
      } catch {}
    }
    init();
    return () => { map?.remove(); };
  }, []);
  return (
    <div style={{ fontFamily: 'var(--mono)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, minHeight: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--muted)' }}>
          {status ? (<>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: status.live ? '#84a844' : '#888', flexShrink: 0, display: 'inline-block' }} />
            <span>{status.live ? <strong style={{ color: 'var(--text)' }}>{timeAgo(status.ts)}</strong> : timeAgo(status.ts)}<span style={{ color: 'var(--muted)' }}> · {status.city}, {status.country}</span></span>
          </>) : <span style={{ color: 'var(--muted)' }}>Loading…</span>}
        </div>
        {count !== null && (
          <span style={{ fontSize: 10, letterSpacing: '0.12em', color: 'var(--muted)', border: '0.5px solid var(--border)', borderRadius: 20, padding: '3px 10px' }}>
            <span style={{ color: 'var(--text)' }}>{count.toLocaleString()}</span> visitors
          </span>
        )}
      </div>
      <div ref={mapRef} style={{ width: '100%', height: 360, borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)', background: '#e8eaed' }} />
      <style>{`.maplibregl-ctrl-attrib{font-family:monospace!important;font-size:9px!important}.maplibregl-ctrl-group{border-radius:8px!important;overflow:hidden}.maplibregl-ctrl-group button{background:white!important}`}</style>
    </div>
  );
}

// ─── SectionHead ─────────────────────────────────────────────────────

function SectionHead({ index, title, subtitle, nodeId }: { index: string; title: string; subtitle: string; nodeId: string }) {
  return (
    <header className="sect-head">
      <div className="sect-mini"><Pyramid3D size={56} active={nodeId} /></div>
      <div className="sect-meta">
        <div className="sect-row"><span className="sect-index">v_{index}</span><h2 className="sect-title">{title}</h2></div>
        <span className="sect-sub">/ {subtitle}</span>
      </div>
    </header>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────

type ExpTab = 'work' | 'involvement' | 'programs';
const EXP_TAB_SUBTITLE: Record<ExpTab, string> = { work: 'longest path', involvement: 'connected components', programs: 'covering set' };
const EXP_TAB_ORDER: ExpTab[] = ['work', 'involvement', 'programs'];

export default function Home() {
  const [pyramidMode, setPyramidMode] = useState<PyramidMode>('loading');
  const [overlayFading, setOverlayFading] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const [activeSection, setActiveSection] = useState<string>('intro');
  const [expTab, setExpTab] = useState<ExpTab>('work');
  const expIdx = EXP_TAB_ORDER.indexOf(expTab);
  const expViewportRef = useRef<HTMLDivElement>(null);
  const expPanelRefs = useRef<(HTMLDivElement | null)[]>([null, null, null]);

  useEffect(() => {
    const measure = () => {
      const panel = expPanelRefs.current[expIdx], viewport = expViewportRef.current;
      if (!panel || !viewport) return;
      viewport.style.height = `${panel.offsetHeight}px`;
    };
    measure(); window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [expIdx]);

  useEffect(() => {
    let buildTimer: number | undefined, fadeTimer: number | undefined, removeTimer: number | undefined;
    let isReturning = false;
    try { isReturning = !!localStorage.getItem(VISIT_KEY); } catch {}
    if (isReturning) { setPyramidMode('docked'); setShowOverlay(false); }
    else {
      buildTimer = window.setTimeout(() => { setPyramidMode('docked'); setOverlayFading(true); }, 2800);
      fadeTimer = window.setTimeout(() => { try { localStorage.setItem(VISIT_KEY, '1'); } catch {} }, 3100);
      removeTimer = window.setTimeout(() => setShowOverlay(false), 3600);
    }
    return () => { if (buildTimer) clearTimeout(buildTimer); if (fadeTimer) clearTimeout(fadeTimer); if (removeTimer) clearTimeout(removeTimer); };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) { const id = entry.target.id === 'last-visitor' ? 'visitor' : entry.target.id; setActiveSection(id); } });
    }, { rootMargin: '-40% 0px -55% 0px' });
    ['intro', 'experience', 'technologies', 'projects', 'writing', 'last-visitor', 'contact'].forEach(id => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  const jumpTo = useCallback((id: string) => {
    const node = NODES.find(n => n.id === id); if (!node) return;
    const el = document.querySelector(node.section); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const handleNodeClick = useCallback((id: string) => { jumpTo(id); setPyramidMode('docked'); }, [jumpTo]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{--bg:oklch(0.11 0.008 255);--bg2:oklch(0.15 0.008 255);--border:oklch(0.22 0.008 255);--muted:oklch(0.52 0.008 255);--text:oklch(0.90 0.006 255);--accent:oklch(0.78 0.13 80);--max:720px;--serif:'EB Garamond',Georgia,serif;--mono:'DM Mono',monospace}
        html{scroll-behavior:smooth;background:var(--bg)}
        body{background:var(--bg);color:var(--text);font-family:var(--serif);font-size:16px;line-height:1.7;-webkit-font-smoothing:antialiased}
        .pyramid{display:block;overflow:visible}
        .pyramid-edge{fill:none;stroke-width:1.2;transition:stroke-opacity 0.3s}
        .pyramid-edge-front{stroke:oklch(0.40 0.008 255)}
        .pyramid-edge-back{stroke:oklch(0.30 0.008 255);stroke-dasharray:2 2;opacity:0.7}
        .pyramid-edge-connector{stroke:oklch(0.34 0.008 255)}
        .pyramid-node-group{transform:translate(var(--tx),var(--ty));transition:transform 0s}
        .pyramid-node{fill:var(--muted);transition:fill 0.2s,r 0.2s}
        .pyramid-node-group.is-front .pyramid-node{fill:oklch(0.78 0.006 255)}
        .pyramid-node-group.is-back .pyramid-node{fill:oklch(0.55 0.006 255)}
        .pyramid-node-group.is-active .pyramid-node{fill:var(--accent);r:5.5}
        .pyramid-node-group.is-interactive .pyramid-node-hit{fill:transparent;cursor:pointer}
        .pyramid-node-group.is-interactive:hover .pyramid-node{fill:var(--text)}
        .pyramid-label{font-family:var(--mono);font-size:9px;fill:var(--muted);letter-spacing:0.04em;pointer-events:none;transition:opacity 0.3s,fill 0.2s}
        .pyramid-node-group.is-active .pyramid-label{fill:var(--text)}
        .pyramid.is-building .pyramid-node-group{animation:pyramidNodeIn 900ms cubic-bezier(0.16,1,0.3,1) backwards;animation-delay:calc(var(--ni)*60ms + 100ms)}
        .pyramid.is-building .pyramid-edge{animation:pyramidEdgeIn 600ms ease-out backwards;animation-delay:calc(var(--ei)*35ms + 1100ms)}
        .pyramid.is-building .pyramid-label{animation:pyramidLabelIn 500ms ease-out backwards;animation-delay:1900ms}
        @keyframes pyramidNodeIn{0%{opacity:0;transform:translate(0px,0px) scale(0.6)}40%{opacity:1}100%{opacity:1;transform:translate(var(--tx),var(--ty)) scale(1)}}
        @keyframes pyramidEdgeIn{from{stroke-dasharray:1;stroke-dashoffset:1}to{stroke-dasharray:1;stroke-dashoffset:0}}
        @keyframes pyramidLabelIn{from{opacity:0;transform:translateY(2px)}to{opacity:1;transform:translateY(0)}}
        .pyramid-nav{position:fixed;top:18px;right:18px;width:280px;height:280px;z-index:60;transform-origin:top right;transition:transform 760ms cubic-bezier(0.16,1,0.3,1);will-change:transform}
        .pyramid-nav.is-loading{transform:translate(calc(-50vw + 158px),calc(50vh - 158px)) scale(1);z-index:1001}
        .pyramid-nav.is-docked{transform:scale(0.26);cursor:pointer}
        .pyramid-nav.is-docked:hover,.pyramid-nav.is-docked:focus-visible{outline:none;transform:scale(0.30)}
        .pyramid-nav.is-expanded{transform:scale(0.82)}
        .pyramid-nav .pyramid-label{opacity:1}
        .pyramid-nav.is-docked .pyramid-label{opacity:0}
        .pyramid-nav-hint{position:absolute;right:0;top:-22px;font-family:var(--mono);font-size:9px;color:var(--muted);letter-spacing:0.1em;opacity:0;transform:scale(3.5);transform-origin:top right;pointer-events:none;transition:opacity 0.2s}
        .pyramid-nav.is-docked .pyramid-nav-hint{opacity:0.8}
        .loader-bg{position:fixed;inset:0;z-index:1000;background:var(--bg);display:flex;align-items:center;justify-content:center;opacity:1;transition:opacity 700ms ease}
        .loader-bg.is-fading{opacity:0;pointer-events:none}
        html.returning .loader-bg{display:none}
        html.returning .pyramid.is-building .pyramid-node-group,html.returning .pyramid.is-building .pyramid-edge,html.returning .pyramid.is-building .pyramid-label{animation:none!important}
        html.returning .pyramid-nav.is-loading{transform:scale(0.26);cursor:pointer}
        html.returning .pyramid-nav.is-loading:hover{transform:scale(0.30)}
        html.returning .pyramid-nav.is-loading .pyramid-label{opacity:0}
        html.returning .pyramid-nav.is-loading .pyramid-node-group{transform:translate(var(--tx),var(--ty));opacity:1}
        html.returning .pyramid-nav.is-loading .pyramid-edge{stroke-dashoffset:0}
        .loader-stats{position:absolute;bottom:18%;font-family:var(--mono);font-size:12px;color:var(--muted);letter-spacing:0.08em;display:flex;gap:16px;flex-wrap:wrap;justify-content:center}
        .loader-stats span{opacity:0;animation:fadeUp 500ms ease-out forwards}
        .loader-stats .ls-1{animation-delay:2200ms}
        .loader-stats .ls-2{animation-delay:2350ms;color:var(--text)}
        .loader-stats .ls-3{animation-delay:2500ms;color:var(--text)}
        .loader-stats .ls-4{animation-delay:2650ms;font-style:italic;font-family:var(--serif);letter-spacing:0.02em}
        @keyframes fadeUp{from{opacity:0;transform:translateY(3px)}to{opacity:1;transform:translateY(0)}}
        nav{position:sticky;top:0;z-index:50;background:oklch(0.11 0.008 255 / 0.9);backdrop-filter:blur(8px);border-bottom:1px solid var(--border);padding:0 24px}
        .nav-inner{display:flex;align-items:center;justify-content:space-between;max-width:var(--max);margin:0 auto;height:56px;gap:24px}
        .nav-brand{display:flex;align-items:baseline;gap:10px;color:var(--text);text-decoration:none}
        .nav-brand .nav-name{font-size:14px;font-weight:500;font-family:var(--serif)}
        .nav-brand .nav-handle{font-size:11px;color:var(--muted);font-family:var(--mono)}
        .nav-current{font-family:var(--mono);font-size:11px;color:var(--accent);letter-spacing:0.08em;text-align:right}
        main{max-width:var(--max);margin:0 auto;padding:0 24px 120px}
        section{padding-top:88px;scroll-margin-top:64px}
        .hero{padding-top:64px}
        .hero h1{font-size:32px;font-weight:400;letter-spacing:-0.01em;margin-bottom:6px}
        .hero .role{font-family:var(--mono);font-size:12px;color:var(--muted);letter-spacing:0.08em;margin-bottom:32px}
        .hero .role b{color:var(--text);font-weight:500}
        .hero-epigraph{font-style:italic;font-size:14px;color:oklch(0.62 0.006 255);border-left:1px solid var(--border);padding:6px 0 6px 14px;margin-bottom:32px}
        .hero-epigraph .attr{font-style:normal;font-family:var(--mono);font-size:11px;color:var(--muted);display:block;margin-top:6px;letter-spacing:0.04em}
        .hero p.lede{color:oklch(0.76 0.006 255);font-size:15.5px;margin-bottom:16px}
        .hero p.lede strong{color:var(--text);font-weight:500}
        .hero .cta{display:inline-block;margin-top:24px;padding:9px 22px;font-size:13px;font-family:var(--mono);color:var(--text);border:1px solid var(--border);border-radius:6px;text-decoration:none;letter-spacing:0.04em;transition:border-color 0.15s,background 0.15s}
        .hero .cta:hover{border-color:var(--text);background:var(--bg2)}
        .sect-head{display:flex;align-items:center;gap:16px;margin-bottom:28px;padding-bottom:14px;border-bottom:1px solid var(--border)}
        .sect-mini{flex-shrink:0;width:56px;height:56px;opacity:0.9}
        .sect-mini .pyramid-label{display:none}
        .sect-meta{display:flex;flex-direction:column;gap:2px;flex:1}
        .sect-row{display:flex;align-items:baseline;gap:12px}
        .sect-index{font-family:var(--mono);font-size:10px;color:var(--muted);letter-spacing:0.06em}
        .sect-title{font-size:11px;font-weight:500;letter-spacing:0.14em;text-transform:uppercase;color:var(--text);font-family:var(--mono)}
        .sect-sub{font-family:var(--serif);font-style:italic;font-size:12px;color:var(--muted)}
        .adj-list{display:flex;flex-direction:column}
        .adj-row{display:grid;grid-template-columns:44px 18px 1fr;gap:0 14px;padding:18px 0;border-bottom:1px solid var(--border);align-items:center}
        .adj-row:first-child{border-top:1px solid var(--border)}
        .adj-logo{width:36px;height:36px;border-radius:8px;background:var(--bg2);border:1px solid var(--border);overflow:hidden;display:flex;align-items:center;justify-content:center}
        .adj-logo-placeholder{font-family:var(--mono);font-size:9px;color:var(--muted);letter-spacing:0.04em}
        .adj-arrow{font-family:var(--mono);color:oklch(0.40 0.008 255);font-size:13px;text-align:center}
        .adj-body{display:flex;flex-direction:column;gap:1px}
        .adj-head{display:flex;align-items:baseline;justify-content:space-between;gap:12px}
        .adj-name{font-size:14px;font-weight:500;color:var(--text)}
        .adj-year{font-size:11px;color:var(--muted);font-family:var(--mono);white-space:nowrap}
        .adj-role{font-size:13px;color:oklch(0.66 0.006 255)}
        .tabs{display:flex;gap:6px;margin-bottom:24px;flex-wrap:wrap}
        .tab{padding:7px 14px;font-family:var(--mono);font-size:10.5px;letter-spacing:0.1em;text-transform:uppercase;color:var(--muted);border:1px solid var(--border);border-radius:999px;cursor:pointer;background:transparent;transition:color 0.15s,border-color 0.15s,background 0.15s}
        .tab:hover{color:var(--text);border-color:oklch(0.36 0.008 255)}
        .tab.is-active{color:var(--text);border-color:var(--accent);background:oklch(0.16 0.008 255)}
        .carousel{overflow:hidden;transition:height 360ms cubic-bezier(0.32,0.72,0.34,1.0)}
        .carousel-track{display:flex;align-items:flex-start;transition:transform 380ms cubic-bezier(0.32,0.72,0.34,1.0);will-change:transform}
        .carousel-panel{flex:0 0 100%;min-width:100%;opacity:1;transition:opacity 240ms ease}
        .carousel-panel[aria-hidden="true"]{opacity:0.35}
        .tech-list{display:flex;flex-direction:column;gap:20px}
        .tech-cat{padding-bottom:18px;border-bottom:1px solid var(--border)}
        .tech-cat:last-child{border-bottom:none;padding-bottom:0}
        .tech-cat-head{display:flex;align-items:baseline;gap:10px;margin-bottom:8px}
        .tech-cat-name{font-family:var(--mono);font-size:11px;letter-spacing:0.1em;color:var(--text);text-transform:uppercase}
        .tech-cat-count{font-family:var(--mono);font-size:10px;color:var(--muted)}
        .tech-cat-items{font-family:var(--mono);font-size:12px;color:var(--muted);letter-spacing:0.02em;line-height:1.85}
        .tech-cat-items .br{color:oklch(0.40 0.008 255)}
        .tech-cat-items .tag{color:oklch(0.72 0.006 255)}
        .tech-cat-items .tag+.tag::before{content:', ';color:oklch(0.40 0.008 255)}
        .proj-list{display:flex;flex-direction:column}
        .proj-row{display:grid;grid-template-columns:36px 1fr;gap:14px;padding:18px 0;border-bottom:1px solid var(--border);text-decoration:none;color:inherit;transition:background 0.15s}
        .proj-row:first-child{border-top:1px solid var(--border)}
        .proj-row:hover{background:oklch(0.13 0.008 255)}
        .proj-row:hover .proj-name{color:var(--text)}
        .proj-id{font-family:var(--mono);font-size:11px;color:var(--muted);letter-spacing:0.04em;padding-top:4px}
        .proj-body{display:flex;flex-direction:column;gap:6px}
        .proj-headline{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap}
        .proj-name{font-size:14.5px;font-weight:500;color:oklch(0.84 0.006 255);transition:color 0.12s}
        .proj-arr{font-family:var(--mono);font-size:12px;color:var(--muted)}
        .proj-desc{font-size:13.5px;color:var(--muted);line-height:1.6}
        .proj-tags{font-family:var(--mono);font-size:11px;color:var(--muted);letter-spacing:0.02em;margin-top:2px}
        .proj-tags .br{color:oklch(0.40 0.008 255)}
        .proj-tags .tag{color:oklch(0.65 0.006 255)}
        .proj-tags .tag+.tag::before{content:', ';color:oklch(0.40 0.008 255)}
        details.post{border-bottom:1px solid var(--border);padding:16px 0}
        details.post:first-of-type{border-top:1px solid var(--border)}
        details.post>summary{list-style:none;cursor:pointer;display:flex;align-items:baseline;justify-content:space-between;gap:16px}
        details.post>summary::-webkit-details-marker{display:none}
        details.post .post-sum-left{display:flex;align-items:baseline;gap:12px}
        details.post .post-marker{font-family:var(--mono);font-size:11px;color:var(--muted);transition:transform 0.2s;display:inline-block}
        details.post[open] .post-marker{transform:rotate(90deg);color:var(--accent)}
        details.post .post-title{font-size:14px;color:oklch(0.72 0.006 255);transition:color 0.12s;font-family:var(--serif)}
        details.post:hover .post-title,details.post[open] .post-title{color:var(--text)}
        details.post .post-date{font-size:11px;color:var(--muted);font-family:var(--mono);white-space:nowrap}
        details.post .post-content{padding:22px 0 8px}
        details.post .post-hero{width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:8px;border:1px solid var(--border);margin-bottom:22px;display:block}
        details.post .post-content p{color:oklch(0.76 0.006 255);font-size:15px;line-height:1.8;margin-bottom:18px}
        details.post .post-content p.lede{font-size:17px;color:var(--text);font-style:italic}
        details.post .post-content p:last-child{margin-bottom:0}
        .contact-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
        .contact-card{border:1px solid var(--border);border-radius:10px;padding:18px 20px;background:var(--bg2);text-decoration:none;color:inherit;transition:border-color 0.15s,background 0.15s;display:flex;flex-direction:column;gap:4px}
        .contact-card:hover{border-color:var(--text);background:oklch(0.16 0.008 255)}
        .contact-card .cc-label{font-family:var(--mono);font-size:10px;letter-spacing:0.08em;color:var(--muted);text-transform:uppercase}
        .contact-card .cc-value{font-size:14px;color:var(--text)}
        .contact-card .cc-arrow{font-family:var(--mono);font-size:11px;color:var(--muted);margin-top:6px}
        .contact-intro{color:oklch(0.76 0.006 255);font-size:15px;margin-bottom:20px}
        footer{max-width:var(--max);margin:0 auto;padding:32px 24px 48px;display:flex;align-items:center;justify-content:space-between;border-top:1px solid var(--border);flex-wrap:wrap;gap:12px}
        footer a{font-size:13px;color:var(--muted);text-decoration:none;transition:color 0.15s}
        footer a:hover{color:var(--text)}
        footer .copy{font-size:11px;color:oklch(0.38 0.008 255);font-family:var(--mono)}
        footer .copy em{font-style:italic;font-family:var(--serif);color:oklch(0.48 0.008 255)}
        @media(max-width:560px){.nav-current{display:none}.nav-inner{gap:14px}.hero h1{font-size:26px}.sect-head{gap:12px}.sect-mini{width:44px;height:44px}.pyramid-nav.is-expanded{transform:scale(0.62)}.contact-grid{grid-template-columns:1fr}footer{flex-direction:column;gap:16px}}
      `}</style>

      {showOverlay && <LoadingOverlay fading={overlayFading} />}

      <PyramidNav mode={pyramidMode} active={activeSection} onExpand={() => setPyramidMode('expanded')} onCollapse={() => setPyramidMode('docked')} onNodeClick={handleNodeClick} />

      <nav>
        <div className="nav-inner">
          <a className="nav-brand" href="#intro" onClick={() => jumpTo('intro')}>
            <span className="nav-name">Abdifataah Abdi</span>
            <span className="nav-handle">@abdifataabdi</span>
          </a>
          <span className="nav-current">{(NODES.find(n => n.id === activeSection)?.full ?? '').toLowerCase()}</span>
        </div>
      </nav>

      <main>
        <section id="intro" className="hero">
          <h1>Abdifataah Abdi</h1>
          {/* TODO: Update with your school/major/focus */}
          <p className="role">Software Engineer  ·  <b>W₆ = (V, E)</b>  ·  |V|=7, |E|=12</p>

          <div className="hero-epigraph">
            {/* TODO: Replace with a quote that resonates with you */}
            The only way to do great work is to love what you do.
            <span className="attr">— Steve Jobs</span>
          </div>

          {/* TODO: Replace with your real bio */}
          <p className="lede">Welcome. I&apos;m <strong>Abdifataah Abdi</strong>, a software engineer passionate about building things that matter.</p>
          <p className="lede">Currently studying at <strong>[Your University]</strong>, majoring in <strong>[Your Major]</strong>. Interested in [your interests].</p>
          <p className="lede">Feel free to look around and reach out — I&apos;m always happy to connect. <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--muted)' }}>(↗ pyramid on the right)</span></p>

          <a href="mailto:abdiabdifatah102@gmail.com" className="cta">Get in touch →</a>
        </section>

        <section id="experience">
          <SectionHead index="1" title="Experience" subtitle={EXP_TAB_SUBTITLE[expTab]} nodeId="experience" />
          <div className="tabs" role="tablist" aria-label="Experience type">
            {(['work', 'involvement', 'programs'] as const).map(t => (
              <button key={t} role="tab" aria-selected={expTab === t} className={`tab ${expTab === t ? 'is-active' : ''}`} onClick={() => setExpTab(t)}>
                {t === 'work' ? 'Work' : t === 'involvement' ? 'Involvement' : 'Programs'}
              </button>
            ))}
          </div>
          <div ref={expViewportRef} className="carousel">
            <div className="carousel-track" style={{ transform: `translateX(-${expIdx * 100}%)` }}>
              <div ref={el => { expPanelRefs.current[0] = el; }} className="carousel-panel" aria-hidden={expTab !== 'work'}>
                <div className="adj-list">
                  {experience.map((e, i) => (
                    <div key={i} className="adj-row">
                      <div className="adj-logo"><span className="adj-logo-placeholder">co</span></div>
                      <span className="adj-arrow">→</span>
                      <div className="adj-body">
                        <div className="adj-head"><span className="adj-name">{e.name}</span><span className="adj-year">{e.year}</span></div>
                        <span className="adj-role">{e.role}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div ref={el => { expPanelRefs.current[1] = el; }} className="carousel-panel" aria-hidden={expTab !== 'involvement'}>
                <div className="adj-list">
                  {involvement.map((e, i) => (
                    <div key={i} className="adj-row">
                      <div className="adj-logo"><span className="adj-logo-placeholder">org</span></div>
                      <span className="adj-arrow">→</span>
                      <div className="adj-body">
                        <div className="adj-head"><span className="adj-name">{e.name}</span><span className="adj-year">{e.year}</span></div>
                        <span className="adj-role">{e.role}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div ref={el => { expPanelRefs.current[2] = el; }} className="carousel-panel" aria-hidden={expTab !== 'programs'}>
                <div className="adj-list">
                  {programs.map((e, i) => (
                    <div key={i} className="adj-row">
                      <div className="adj-logo"><span className="adj-logo-placeholder">pgm</span></div>
                      <span className="adj-arrow">→</span>
                      <div className="adj-body">
                        <div className="adj-head"><span className="adj-name">{e.program}</span><span className="adj-year">{e.year.split(' ').pop()}</span></div>
                        <span className="adj-role">{e.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="technologies">
          <SectionHead index="2" title="Technologies" subtitle="working set" nodeId="technologies" />
          <div className="tech-list">
            {techCategories.map(cat => (
              <div key={cat.name} className="tech-cat">
                <div className="tech-cat-head"><span className="tech-cat-name">{cat.name}</span><span className="tech-cat-count">{cat.items.length}</span></div>
                <div className="tech-cat-items">
                  <span className="br">{'{ '}</span>
                  {cat.items.map(t => <span key={t} className="tag">{t}</span>)}
                  <span className="br">{' }'}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="projects">
          <SectionHead index="3" title="Projects" subtitle="adjacency list" nodeId="projects" />
          <div className="proj-list">
            {projects.map((p, i) => (
              <a key={i} className="proj-row" href={p.link || '#'} target={p.link ? '_blank' : '_self'} rel="noopener">
                <span className="proj-id">p_{String(i + 1).padStart(2, '0')}</span>
                <div className="proj-body">
                  <div className="proj-headline"><span className="proj-name">{p.name}</span><span className="proj-arr">↗</span></div>
                  <div className="proj-desc">{p.desc}</div>
                  <div className="proj-tags">
                    <span className="br">{'{ '}</span>
                    {p.tags.map(t => <span key={t} className="tag">{t}</span>)}
                    <span className="br">{' }'}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section id="writing">
          <SectionHead index="4" title="Writing" subtitle="leaf nodes" nodeId="writing" />
          <div>
            {posts.map((post, i) => (
              <details key={i} className="post">
                <summary>
                  <span className="post-sum-left"><span className="post-marker">▸</span><span className="post-title">{post.title}</span></span>
                  <span className="post-date">{post.date}</span>
                </summary>
                <div className="post-content">
                  {post.hero && <img className="post-hero" src={post.hero} alt={post.title} />}
                  {post.lede && <p className="lede">{post.lede}</p>}
                  {post.paragraphs.map((para, j) => <p key={j}>{para}</p>)}
                </div>
              </details>
            ))}
          </div>
        </section>

        <section id="last-visitor">
          <SectionHead index="5" title="Last Visitor" subtitle="neighborhood N(v)" nodeId="visitor" />
          <VisitorMap />
        </section>

        <section id="contact">
          <SectionHead index="6" title="Contact" subtitle="incident edges" nodeId="contact" />
          <p className="contact-intro">If anything here resonated, the easiest way to reach me is below. I read every message.</p>
          <div className="contact-grid">
            <a className="contact-card" href="mailto:abdiabdifatah102@gmail.com">
              <span className="cc-label">Email</span>
              <span className="cc-value">abdiabdifatah102@gmail.com</span>
              <span className="cc-arrow">send a message →</span>
            </a>
            <a className="contact-card" href="https://github.com/Abdifatah2002" target="_blank" rel="noopener">
              <span className="cc-label">GitHub</span>
              <span className="cc-value">Abdifatah2002</span>
              <span className="cc-arrow">code →</span>
            </a>
            {/* TODO: Replace # with your real LinkedIn URL */}
            <a className="contact-card" href="#" target="_blank" rel="noopener">
              <span className="cc-label">LinkedIn</span>
              <span className="cc-value">[your-linkedin]</span>
              <span className="cc-arrow">connect →</span>
            </a>
            {/* TODO: Replace # with your X/Twitter URL, or remove this card */}
            <a className="contact-card" href="#" target="_blank" rel="noopener">
              <span className="cc-label">X / Twitter</span>
              <span className="cc-value">@[your-handle]</span>
              <span className="cc-arrow">read →</span>
            </a>
          </div>
        </section>
      </main>

      <footer>
        <div style={{ display: 'flex', gap: 20 }}>
          <a href="https://github.com/Abdifatah2002" target="_blank" rel="noopener">GitHub</a>
          {/* TODO: Add your LinkedIn and X links */}
          <a href="#">LinkedIn</a>
          <a href="#">X</a>
        </div>
        <span className="copy">2026 Abdifataah Abdi  ·  <em>still adding edges</em></span>
      </footer>
    </>
  );
}
