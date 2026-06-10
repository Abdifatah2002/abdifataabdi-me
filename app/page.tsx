'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

// ─── Data ─────────────────────────────────────────────────────────────

type OrgEntry = { initials: string; name: string; year: string; role: string; logo?: string; bg?: string; fg?: string; desc?: string[] };
type ProgramEntry = { initials: string; name: string; program: string; year: string; logo?: string; bg?: string; fg?: string; desc?: string[] };

const experience: OrgEntry[] = [
  { initials: 'SC', bg: '#6d28d9', fg: '#fff', logo: '/logos/simcodes.svg', name: 'SIMCODES', year: 'May – Sep 2025', role: 'Machine Learning Research Intern', desc: [
    'Increased AI/ML model accuracy by 12% through feature engineering on simulation datasets exceeding 50 GB.',
    'Streamlined algorithmic efficiency by up to 62% by developing ML pipelines for metal-ion binding predictions (Python, Bash).',
    'Modeled 700+ ligand–protein complexes using NumPy, RDKit, and quantum chemistry tools.',
  ]},
  { initials: 'WS', bg: '#be185d', fg: '#fff', logo: '/logos/wesparkle.png', name: 'We Sparkle Co.', year: 'Jun – Sep 2024', role: 'Software Engineer Consultant', desc: [
    'Built a customizable chatbot used by 250+ business owners using React.js and Node.js.',
    'Designed an intuitive UI enabling non-technical users to configure chatbot behavior.',
    'Implemented Firebase APIs to store and manage customization choices by business ID.',
  ]},
  { initials: 'CFG', bg: '#15803d', fg: '#fff', logo: '/logos/codeforgood.svg', name: 'CodeForGood', year: 'Jan 2024 – Pres', role: 'Software Engineer', desc: [
    'Provided pro-bono technical and computer science assistance to businesses and non-profits in the Madison area.',
  ]},
  { initials: 'AT', bg: '#00a8e0', fg: '#fff', logo: '/logos/att.svg', name: 'AT&T', year: 'Jun – Sep 2024', role: 'Technology Academy Fellow', desc: [
    'Selected for the competitive AT&T 2024 Technology Academy program for top tech talent.',
    'Developed skills in Machine Learning, REST APIs, and enterprise software development.',
  ]},
  { initials: 'UW', bg: '#c5050c', fg: '#fff', logo: '/logos/uw.svg', name: 'UW–Madison DoIT', year: 'Oct 2022 – Sep 2024', role: 'Help Desk Support Agent', desc: [
    'Resolved 200+ cases with call times ~40% faster than the department standard.',
    'Guided users through software and hardware troubleshooting, translating complex concepts into accessible guidance.',
    'Produced accurate documentation while managing a high volume of customer-facing interactions.',
  ]},
  { initials: 'BP', bg: '#c5050c', fg: '#fff', logo: '/logos/uw.svg', name: 'Badger Precollege', year: 'Jun – Aug 2023', role: 'Residential Mentor', desc: [
    'Directly supervised approximately 140 student program participants daily.',
    'Facilitated difficult conversations about sensitive topics to create safe and inclusive spaces.',
    'Developed teamwork skills working alongside a partner as part of the larger Residential Mentor team.',
  ]},
  { initials: 'ST', bg: '#0f766e', fg: '#fff', logo: '/logos/rushtranslate.svg', name: 'Somali Translation', year: 'May 2019 – Apr 2021', role: 'Refugee Services Translator', desc: [
    'Assisted refugees in job search and housing endeavors in the Milwaukee area.',
    'Aided in applying for necessary documentation including social security and mortgage applications.',
  ]},
];

const involvement: OrgEntry[] = [
  { initials: 'NSBE', bg: '#1e3a5f', fg: '#fbbf24', logo: '/logos/nsbe.svg', name: 'National Society of Black Engineers', year: 'Nov 2022 – Present', role: 'Member', desc: [
    'Engaged in networking and professional development supporting underrepresented STEM students.',
    'Contributed to initiatives through collaboration, advocacy, and community outreach.',
  ]},
  { initials: 'CS', bg: '#0d9488', fg: '#fff', logo: '/logos/colorstack.svg', name: 'ColorStack', year: '2022 – Present', role: 'Member', desc: [
    'Member of a community supporting Black and Latinx CS students in reaching their full academic and professional potential.',
  ]},
  { initials: 'BA', bg: '#047857', fg: '#fff', logo: '/logos/biokind_icon.png', name: 'Biokind Analytics', year: 'Jan 2024 – Present', role: 'Data Analyst', desc: [
    'Collaborated with medical non-profits in Madison, WI to facilitate data exchange and communication.',
    'Executed statistical analyses using R to identify patterns, correlations, and trends in organizational data.',
    'Developed data visualizations using R packages to present key insights and data trends.',
  ]},
  { initials: 'LFS', bg: '#c2410c', fg: '#fff', name: 'Learn From Scratch', year: 'May 2023 – Aug 2024', role: 'Co-founder', desc: [
    'Designed curriculum and facilitated learning for 100 fourth–sixth graders across four semesters.',
    'Guided students to write their first code and complete open-ended projects building creativity and problem-solving.',
  ]},
  { initials: 'BGC', bg: '#003087', fg: '#fff', logo: '/logos/bgc.svg', name: 'Boys & Girls Club', year: 'Aug 2017 – Present', role: 'Graduation Plus Member', desc: [
    'Long-standing member of the Boys & Girls Club Graduation Plus program since 2017.',
  ]},
  { initials: 'PP', bg: '#1d4ed8', fg: '#fff', name: 'People Program', year: 'May 2017 – Present', role: 'UW–Madison Member', desc: [
    'PEOPLE Scholar at the University of Wisconsin–Madison, a program supporting first-generation college students.',
  ]},
];

const programs: ProgramEntry[] = [
  { initials: 'AT', bg: '#00a8e0', fg: '#fff', logo: '/logos/att.svg', name: 'AT&T', program: 'AT&T 2024 Technology Academy', year: '2024', desc: [
    'Issued by AT&T College Recruiting — Jul 2024.',
    'Skills: Machine Learning, REST APIs.',
  ]},
  { initials: 'LI', bg: '#0077b5', fg: '#fff', logo: '/logos/linkedin.svg', name: 'LinkedIn', program: 'Learning Git and GitHub', year: '2023', desc: [
    'Issued by LinkedIn Learning — Jun 2023.',
    'Skills: Git, GitHub.',
  ]},
];

const projects = [
  {
    name: 'Abdifataabdi.me',
    desc: 'Personal portfolio website built from scratch. Features a visitor map with real-time geolocation, Cal.com scheduling integration, and company logos pulled from official brand sources.',
    tags: ['Next.js', 'TypeScript', 'React', 'Tailwind CSS', 'MapLibre GL', 'Upstash Redis'],
    link: 'https://github.com/Abdifatah2002',
  },
  {
    name: 'MyHealthPal',
    desc: 'GPT-powered virtual health assistant for symptom checks, prevention tips, and geolocated clinic suggestions. Trained a custom neural net on 1.6M+ tweets achieving 94% sentiment accuracy.',
    tags: ['TensorFlow', 'Spring Boot', 'React', 'Flask', 'Supabase', 'OpenCV'],
    link: 'https://github.com/Abdifatah2002',
  },
  {
    name: 'Hydration Mate',
    desc: 'Mobile app helping users meet daily water intake goals. Firebase Realtime DB for cross-device sync and secure auth with historical hydration logs.',
    tags: ['React Native', 'Expo Go', 'AWS Amplify', 'Firebase', 'Tailwind CSS'],
    link: 'https://github.com/Abdifatah2002',
  },
];

const techCategories = [
  { name: 'Languages',              items: ['Java', 'Python', 'JavaScript', 'SQL', 'HTML/CSS', 'R', 'Bash'] },
  { name: 'Frameworks & Libraries', items: ['React', 'Node.js', 'Flask', 'Spring Boot', 'Expo', 'Tailwind', 'Firebase', 'PyTorch', 'pandas', 'NumPy', 'Matplotlib'] },
  { name: 'Tools',                  items: ['Git', 'Docker', 'AWS', 'Google Cloud', 'VS Code', 'IntelliJ', 'PyCharm'] },
];

type Post = { date: string; title: string; lede?: string; paragraphs: string[] };

const posts: Post[] = [
  {
    date: '2025',
    title: 'Teaching Kids to Code Changed How I Think About Software',
    lede: 'A year co-founding Learn From Scratch taught me that the hardest part of programming isn\'t syntax — it\'s helping someone believe they can do it.',
    paragraphs: [
      'In May 2023 I co-founded Learn From Scratch, a program that guided 100 fourth through sixth graders through writing their first lines of code over four semesters. I expected to teach Python. I didn\'t expect it to reshape how I think about building software.',
      'Most of those kids had never opened a code editor. The first day was chaos — every error message landed like a personal insult. But by week three something shifted. They stopped treating bugs as failures and started treating them as puzzles. That mental reframe is exactly what separates good engineers from stuck ones.',
      'The experience reinforced something I carry into every project: software is only as good as the person it was built for. Watching a ten-year-old light up when their first loop ran correctly is a better benchmark for good UX than any design system I\'ve read.',
    ],
  },
];

// ─── Exp Icon ────────────────────────────────────────────────────────

function ExpIcon({ initials, name, logo, bg, fg }: { initials: string; name: string; logo?: string; bg?: string; fg?: string }) {
  const [failed, setFailed] = useState(false);
  const showImg = !!logo && !failed;
  const isLocalSvg = logo?.startsWith('/logos/');
  return (
    <div
      className="exp-icon"
      style={showImg
        ? (isLocalSvg ? { background: 'transparent', border: 'none', boxShadow: 'none', padding: 0 } : { background: '#f3f4f6' })
        : { background: bg || 'var(--bg2)', color: fg || '#374151' }}
    >
      {showImg
        ? <img src={logo} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 18 }} onError={() => setFailed(true)} />
        : initials}
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
      const KEY = 'portfolio_last_visitor_v2';
      const SESS = 'portfolio_counted_v2';
      const getStored = () => { try { const r = localStorage.getItem(KEY); return r ? JSON.parse(r) : null; } catch { return null; } };
      const setStored = (d: StoredVisitor) => { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch {} };
      const stored = getStored();
      if (stored) setStatus({ city: stored.city, country: stored.country, ts: stored.ts, live: false });

      // Always count the visit once per session, regardless of geolocation success
      try {
        const alreadyCounted = sessionStorage.getItem(SESS);
        if (!alreadyCounted) {
          const res = await fetch('/api/visit', { method: 'POST' });
          const { count: nc } = await res.json();
          setCount(nc);
          sessionStorage.setItem(SESS, '1');
        } else {
          const res = await fetch('/api/visit');
          const { count: gc } = await res.json();
          setCount(gc);
        }
      } catch {}

      // Init map — wrapped for Safari WebGL safety
      try {
        const maplibregl = (await import('maplibre-gl')).default;
        await import('maplibre-gl/dist/maplibre-gl.css');
        if (!mapRef.current) return;
        const lat = stored?.lat ?? 43.07, lon = stored?.lon ?? -89.40;
        map = new maplibregl.Map({
          container: mapRef.current,
          style: { version: 8, sources: { osm: { type: 'raster', tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'], tileSize: 256, attribution: '© OpenStreetMap contributors' } }, layers: [{ id: 'osm', type: 'raster', source: 'osm', minzoom: 0, maxzoom: 19 }] },
          center: [lon, lat], zoom: 4, interactive: true, attributionControl: { compact: true },
        });
        const addMarker = (lng: number, lt: number) => {
          const el = document.createElement('div');
          el.style.cssText = 'width:12px;height:12px;border-radius:50%;background:#2563eb;border:2px solid #fff;box-shadow:0 0 0 3px rgba(37,99,235,0.25)';
          new maplibregl.Marker({ element: el, anchor: 'center' }).setLngLat([lng, lt]).addTo(map);
        };
        if (stored) map.on('load', () => addMarker(lon, lat));

        // Get fresh geolocation — separated from count so a blocked request doesn't stop counting
        try {
          const r = await fetch('https://ipapi.co/json/');
          const d = await r.json();
          if (d.latitude) {
            const fresh = { city: d.city || d.region || 'Unknown', country: d.country_code || '??', lat: d.latitude, lon: d.longitude, ts: Date.now() };
            setStored(fresh);
            setStatus({ ...fresh, live: true });
            map.flyTo({ center: [fresh.lon, fresh.lat], zoom: 5, duration: stored ? 1200 : 0 });
            map.once('idle', () => addMarker(fresh.lon, fresh.lat));
          }
        } catch {}
      } catch {}
    }
    init();
    return () => { map?.remove(); };
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#6b7280' }}>
          {status ? (<>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: status.live ? '#22c55e' : '#d1d5db', display: 'inline-block', flexShrink: 0 }} />
            <span>{status.live ? <strong style={{ color: '#111827' }}>{timeAgo(status.ts)}</strong> : timeAgo(status.ts)} · {status.city}, {status.country}</span>
          </>) : <span>Locating…</span>}
        </div>
        {count !== null && <span style={{ fontSize: 12, color: '#9ca3af' }}>{count.toLocaleString()} visitors</span>}
      </div>
      <div ref={mapRef} style={{ width: '100%', height: 340, borderRadius: 12, overflow: 'hidden', border: '1px solid #e5e7eb' }} />
      <style>{`.maplibregl-ctrl-attrib{font-size:9px!important}.maplibregl-ctrl-group{border-radius:8px!important;overflow:hidden}`}</style>
    </div>
  );
}

// ─── Nav links ───────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: 'Experience', href: '#experience' },
  { label: 'Projects',   href: '#projects' },
  { label: 'Skills',     href: '#skills' },
  { label: 'Writing',    href: '#writing' },
  { label: 'Contact',    href: '#contact' },
];

// ─── Page ─────────────────────────────────────────────────────────────

type ExpTab = 'work' | 'involvement' | 'programs';
const EXP_TAB_ORDER: ExpTab[] = ['work', 'involvement', 'programs'];

export default function Home() {
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
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [expIdx]);

  const scrollTo = useCallback((href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{
          --bg:#ffffff;
          --bg2:#f9fafb;
          --border:#e5e7eb;
          --muted:#6b7280;
          --text:#111827;
          --accent:#2563eb;
          --accent-light:#eff6ff;
          --max:760px;
          --font:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
        }
        html{scroll-behavior:smooth;background:var(--bg)}
        body{background:var(--bg);color:var(--text);font-family:var(--font);font-size:15px;line-height:1.6;-webkit-font-smoothing:antialiased}

        /* Nav */
        nav{position:sticky;top:0;z-index:50;background:rgba(255,255,255,0.9);backdrop-filter:blur(12px);border-bottom:1px solid var(--border)}
        .nav-inner{display:flex;align-items:center;justify-content:space-between;max-width:var(--max);margin:0 auto;height:58px;padding:0 24px;gap:16px}
        .nav-brand{font-size:15px;font-weight:600;color:var(--text);text-decoration:none}
        .nav-links{display:flex;gap:6px}
        .nav-link{font-size:13px;color:var(--muted);text-decoration:none;padding:5px 10px;border-radius:6px;transition:color 0.15s,background 0.15s;background:transparent;border:none;cursor:pointer;font-family:var(--font)}
        .nav-link:hover{color:var(--text);background:var(--bg2)}

        /* Layout */
        main{max-width:var(--max);margin:0 auto;padding:0 24px 100px}
        section{padding-top:80px;scroll-margin-top:72px}

        /* Hero */
        .hero{padding-top:72px;padding-bottom:16px}
        .hero-tag{display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:500;color:var(--accent);background:var(--accent-light);padding:4px 10px;border-radius:999px;margin-bottom:20px;letter-spacing:0.02em}
        .hero-tag .dot{width:6px;height:6px;border-radius:50%;background:var(--accent)}
        .hero h1{font-size:40px;font-weight:700;letter-spacing:-0.03em;line-height:1.15;margin-bottom:8px;color:var(--text)}
        .hero-sub{font-size:17px;color:var(--muted);font-weight:400;margin-bottom:20px}
        .hero-bio{font-size:15px;color:#374151;line-height:1.75;max-width:600px;margin-bottom:28px}
        .hero-bio strong{color:var(--text);font-weight:600}
        .hero-ctas{display:flex;gap:10px;flex-wrap:wrap}
        .btn-primary{display:inline-flex;align-items:center;gap:6px;padding:10px 20px;font-size:14px;font-weight:500;background:var(--text);color:#fff;border-radius:8px;text-decoration:none;transition:background 0.15s;border:none;cursor:pointer;font-family:var(--font)}
        .btn-primary:hover{background:#374151}
        .btn-secondary{display:inline-flex;align-items:center;gap:6px;padding:10px 20px;font-size:14px;font-weight:500;color:var(--text);border:1px solid var(--border);background:transparent;border-radius:8px;text-decoration:none;transition:border-color 0.15s,background 0.15s;cursor:pointer;font-family:var(--font)}
        .btn-secondary:hover{background:var(--bg2);border-color:#d1d5db}

        /* Section titles */
        .sec-title{font-size:20px;font-weight:700;color:var(--text);letter-spacing:-0.02em;margin-bottom:24px}

        /* Experience tabs */
        .tabs{display:flex;gap:4px;margin-bottom:20px;background:var(--bg2);padding:4px;border-radius:10px;width:fit-content}
        .tab{padding:6px 16px;font-size:13px;font-weight:500;color:var(--muted);border:none;border-radius:7px;cursor:pointer;background:transparent;transition:color 0.15s,background 0.15s,box-shadow 0.15s;font-family:var(--font)}
        .tab:hover{color:var(--text)}
        .tab.is-active{color:var(--text);background:#fff;box-shadow:0 1px 3px rgba(0,0,0,0.10)}

        /* Carousel */
        .carousel{overflow:hidden;transition:height 340ms cubic-bezier(0.32,0.72,0.34,1)}
        .carousel-track{display:flex;transition:transform 360ms cubic-bezier(0.32,0.72,0.34,1);will-change:transform}
        .carousel-panel{flex:0 0 100%;min-width:100%;transition:opacity 220ms ease}
        .carousel-panel[aria-hidden="true"]{opacity:0.3}

        /* Experience rows */
        .exp-list{display:flex;flex-direction:column}
        .exp-row{display:flex;align-items:center;gap:16px;padding:20px 0;border-bottom:1px solid var(--border)}
        .exp-row:first-child{border-top:1px solid var(--border)}
        .exp-icon{width:80px;height:80px;border-radius:18px;background:var(--bg2);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-weight:800;color:#fff;letter-spacing:0.01em;font-size:clamp(11px,2.5vw,15px);line-height:1;text-align:center;padding:4px;word-break:break-all;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.10)}
        .exp-icon img{width:100%;height:100%;object-fit:contain;padding:12px;border-radius:0}
        .exp-arrow{font-size:15px;color:#d1d5db;flex-shrink:0}
        .exp-body{flex:1;min-width:0}
        .exp-top{display:flex;align-items:baseline;justify-content:space-between;gap:12px}
        .exp-name{font-size:15px;font-weight:600;color:var(--text)}
        .exp-year{font-size:12px;color:var(--muted);white-space:nowrap;flex-shrink:0}
        .exp-role{font-size:13px;color:var(--muted);margin-top:3px}
        .exp-desc{margin-top:8px;display:flex;flex-direction:column;gap:4px;list-style:none;padding:0}
        .exp-desc li{font-size:12.5px;color:#4b5563;line-height:1.6;padding-left:14px;position:relative}
        .exp-desc li::before{content:'·';position:absolute;left:2px;color:#9ca3af;font-weight:700;font-size:16px;line-height:1.3}

        /* Skills */
        .skills-grid{display:flex;flex-direction:column;gap:18px}
        .skill-group{}
        .skill-group-name{font-size:12px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px}
        .skill-tags{display:flex;flex-wrap:wrap;gap:6px}
        .skill-tag{font-size:13px;color:#374151;background:var(--bg2);border:1px solid var(--border);border-radius:6px;padding:4px 10px;font-weight:400}

        /* Projects */
        .proj-grid{display:flex;flex-direction:column;gap:16px}
        .proj-card{border:1px solid var(--border);border-radius:12px;padding:20px;text-decoration:none;color:inherit;transition:border-color 0.15s,box-shadow 0.15s;display:block}
        .proj-card:hover{border-color:#9ca3af;box-shadow:0 4px 16px rgba(0,0,0,0.06)}
        .proj-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}
        .proj-name{font-size:15px;font-weight:600;color:var(--text)}
        .proj-arrow{font-size:14px;color:var(--muted)}
        .proj-desc{font-size:13.5px;color:var(--muted);line-height:1.65;margin-bottom:12px}
        .proj-tags{display:flex;flex-wrap:wrap;gap:6px}
        .proj-tag{font-size:11px;font-weight:500;color:var(--accent);background:var(--accent-light);padding:3px 8px;border-radius:5px}

        /* Writing */
        details.post{border-bottom:1px solid var(--border)}
        details.post:first-of-type{border-top:1px solid var(--border)}
        details.post>summary{list-style:none;cursor:pointer;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:16px 0}
        details.post>summary::-webkit-details-marker{display:none}
        .post-left{display:flex;align-items:center;gap:10px}
        .post-chevron{font-size:11px;color:var(--muted);transition:transform 0.2s;display:inline-block}
        details.post[open] .post-chevron{transform:rotate(90deg)}
        .post-title{font-size:14px;font-weight:500;color:#374151}
        details.post:hover .post-title{color:var(--text)}
        .post-date{font-size:12px;color:var(--muted);white-space:nowrap;flex-shrink:0}
        .post-body{padding:0 0 20px 22px}
        .post-lede{font-size:15px;font-weight:500;color:var(--text);margin-bottom:12px;line-height:1.6}
        .post-body p{font-size:14px;color:#374151;line-height:1.75;margin-bottom:12px}
        .post-body p:last-child{margin-bottom:0}

        /* Visitor */
        .visitor-card{background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:20px}

        /* Contact */
        .contact-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
        .contact-card{border:1px solid var(--border);border-radius:10px;padding:16px 18px;background:#fff;text-decoration:none;color:inherit;transition:border-color 0.15s,box-shadow 0.15s;display:flex;flex-direction:column;gap:3px}
        .contact-card:hover{border-color:#9ca3af;box-shadow:0 2px 8px rgba(0,0,0,0.07)}
        .cc-label{font-size:11px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:0.06em}
        .cc-value{font-size:14px;color:var(--text);font-weight:500}
        .cc-arrow{font-size:12px;color:var(--muted);margin-top:4px}

        /* Footer */
        footer{max-width:var(--max);margin:0 auto;padding:28px 24px 40px;display:flex;align-items:center;justify-content:space-between;border-top:1px solid var(--border);flex-wrap:wrap;gap:12px}
        footer a{font-size:13px;color:var(--muted);text-decoration:none;transition:color 0.15s}
        footer a:hover{color:var(--text)}
        .footer-copy{font-size:12px;color:#9ca3af}

        @media(max-width:580px){
          .hero h1{font-size:30px}
          .nav-links{display:none}
          .contact-grid{grid-template-columns:1fr}
          footer{flex-direction:column;gap:12px}
        }
      `}</style>

      {/* ── Nav ── */}
      <nav>
        <div className="nav-inner">
          <a className="nav-brand" href="#top">Abdifatah Abdi</a>
          <div className="nav-links">
            {NAV_LINKS.map(l => (
              <button key={l.href} className="nav-link" onClick={() => scrollTo(l.href)}>{l.label}</button>
            ))}
          </div>
        </div>
      </nav>

      <main id="top">

        {/* ── Hero ── */}
        <section className="hero" id="about">
          <h1>Abdifatah Abdi</h1>
          <p className="hero-sub">Software Engineer &amp; Data Science · UW–Madison</p>

          <p className="hero-bio">
            Welcome. I&apos;m Abdifatah. I am a first-generation Somali-American who was born in Somalia and grew up in Milwaukee, Wisconsin.
          </p>
          <p className="hero-bio">
            I have always been interested in technology and engineering a better world. Growing up, I watched how access to the right tools and information could change someone&apos;s life entirely. That is what drove me into Computer Science — and after research internships and building real products, I knew this was exactly where I was meant to be.
          </p>
          <p className="hero-bio">
            I am passionate about Social Innovation, Entrepreneurship, and International Travel. I am an Arsenal and Denver Nuggets fan.
          </p>
          <p className="hero-bio">
            Currently studying <strong>Computer Science and Data Science</strong> at the <strong>University of Wisconsin–Madison</strong>, graduating December 2025.
          </p>
          <p className="hero-bio">
            I am always excited to connect — feel free to reach out.
          </p>
          <div className="hero-ctas">
            <button data-cal-link="abdifatah-abdi-l3cc0s" data-cal-config='{"layout":"month_view"}' className="btn-primary">
              Get in touch →
            </button>
            <a href="https://github.com/Abdifatah2002" target="_blank" rel="noopener" className="btn-secondary">GitHub</a>
            <a href="https://www.linkedin.com/in/abdifatah-abdi-ab5723197/" target="_blank" rel="noopener" className="btn-secondary">LinkedIn</a>
          </div>
        </section>

        {/* ── Experience ── */}
        <section id="experience">
          <h2 className="sec-title">Experience</h2>
          <div className="tabs">
            {(['work', 'involvement', 'programs'] as const).map(t => (
              <button key={t} className={`tab ${expTab === t ? 'is-active' : ''}`} onClick={() => setExpTab(t)}>
                {t === 'work' ? 'Work' : t === 'involvement' ? 'Involvement' : 'Programs'}
              </button>
            ))}
          </div>
          <div ref={expViewportRef} className="carousel">
            <div className="carousel-track" style={{ transform: `translateX(-${expIdx * 100}%)` }}>
              <div ref={el => { expPanelRefs.current[0] = el; }} className="carousel-panel" aria-hidden={expTab !== 'work'}>
                <div className="exp-list">
                  {experience.map((e, i) => (
                    <div key={i} className="exp-row">
                      <ExpIcon initials={e.initials} name={e.name} logo={e.logo} bg={e.bg} fg={e.fg} />
                      <span className="exp-arrow">→</span>
                      <div className="exp-body">
                        <div className="exp-top"><span className="exp-name">{e.name}</span><span className="exp-year">{e.year}</span></div>
                        <div className="exp-role">{e.role}</div>
                        {e.desc && <ul className="exp-desc">{e.desc.map((d, j) => <li key={j}>{d}</li>)}</ul>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div ref={el => { expPanelRefs.current[1] = el; }} className="carousel-panel" aria-hidden={expTab !== 'involvement'}>
                <div className="exp-list">
                  {involvement.map((e, i) => (
                    <div key={i} className="exp-row">
                      <ExpIcon initials={e.initials} name={e.name} logo={e.logo} bg={e.bg} fg={e.fg} />
                      <span className="exp-arrow">→</span>
                      <div className="exp-body">
                        <div className="exp-top"><span className="exp-name">{e.name}</span><span className="exp-year">{e.year}</span></div>
                        <div className="exp-role">{e.role}</div>
                        {e.desc && <ul className="exp-desc">{e.desc.map((d, j) => <li key={j}>{d}</li>)}</ul>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div ref={el => { expPanelRefs.current[2] = el; }} className="carousel-panel" aria-hidden={expTab !== 'programs'}>
                <div className="exp-list">
                  {programs.map((e, i) => (
                    <div key={i} className="exp-row">
                      <ExpIcon initials={e.initials} name={e.name} logo={e.logo} bg={e.bg} fg={e.fg} />
                      <span className="exp-arrow">→</span>
                      <div className="exp-body">
                        <div className="exp-top"><span className="exp-name">{e.program}</span><span className="exp-year">{e.year}</span></div>
                        <div className="exp-role">{e.name}</div>
                        {e.desc && <ul className="exp-desc">{e.desc.map((d, j) => <li key={j}>{d}</li>)}</ul>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Projects ── */}
        <section id="projects">
          <h2 className="sec-title">Projects</h2>
          <div className="proj-grid">
            {projects.map((p, i) => (
              <a key={i} className="proj-card" href={p.link} target="_blank" rel="noopener">
                <div className="proj-header">
                  <span className="proj-name">{p.name}</span>
                  <span className="proj-arrow">↗</span>
                </div>
                <p className="proj-desc">{p.desc}</p>
                <div className="proj-tags">
                  {p.tags.map(t => <span key={t} className="proj-tag">{t}</span>)}
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ── Skills ── */}
        <section id="skills">
          <h2 className="sec-title">Skills</h2>
          <div className="skills-grid">
            {techCategories.map(cat => (
              <div key={cat.name} className="skill-group">
                <div className="skill-group-name">{cat.name}</div>
                <div className="skill-tags">
                  {cat.items.map(t => <span key={t} className="skill-tag">{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Writing ── */}
        <section id="writing">
          <h2 className="sec-title">Writing</h2>
          {posts.map((post, i) => (
            <details key={i} className="post">
              <summary>
                <div className="post-left">
                  <span className="post-chevron">▶</span>
                  <span className="post-title">{post.title}</span>
                </div>
                <span className="post-date">{post.date}</span>
              </summary>
              <div className="post-body">
                {post.lede && <p className="post-lede">{post.lede}</p>}
                {post.paragraphs.map((p, j) => <p key={j}>{p}</p>)}
              </div>
            </details>
          ))}
        </section>

        {/* ── Visitor Map ── */}
        <section id="visitor">
          <h2 className="sec-title">Visitors</h2>
          <div className="visitor-card">
            <VisitorMap />
          </div>
        </section>

        {/* ── Contact ── */}
        <section id="contact">
          <h2 className="sec-title">Contact</h2>
          <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 20 }}>I&apos;m currently open to new opportunities. Feel free to reach out.</p>
          <div className="contact-grid">
            <a className="contact-card" href="mailto:abdiabdifatah102@gmail.com">
              <span className="cc-label">Email</span>
              <span className="cc-value">abdiabdifatah102@gmail.com</span>
              <span className="cc-arrow">Send a message →</span>
            </a>
            <a className="contact-card" href="https://www.linkedin.com/in/abdifatah-abdi-ab5723197/" target="_blank" rel="noopener">
              <span className="cc-label">LinkedIn</span>
              <span className="cc-value">AbdifatahAbdi</span>
              <span className="cc-arrow">Connect →</span>
            </a>
            <a className="contact-card" href="https://github.com/Abdifatah2002" target="_blank" rel="noopener">
              <span className="cc-label">GitHub</span>
              <span className="cc-value">Abdifatah2002</span>
              <span className="cc-arrow">See my code →</span>
            </a>
            <a className="contact-card" href="tel:+12624671001">
              <span className="cc-label">Phone</span>
              <span className="cc-value">(262) 467-1001</span>
              <span className="cc-arrow">Call or text →</span>
            </a>
          </div>
        </section>

      </main>

      <footer>
        <div style={{ display: 'flex', gap: 20 }}>
          <a href="https://github.com/Abdifatah2002" target="_blank" rel="noopener">GitHub</a>
          <a href="https://www.linkedin.com/in/abdifatah-abdi-ab5723197/" target="_blank" rel="noopener">LinkedIn</a>
          <a href="mailto:abdiabdifatah102@gmail.com">Email</a>
        </div>
        <span className="footer-copy">© 2025 Abdifatah Abdi</span>
      </footer>
    </>
  );
}
