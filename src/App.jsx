import { useState, useEffect } from 'react'
import Icon from './components/Icon'
import { InstructionsScreen, LoginChoiceScreen, ImportScreen } from './screens/Onboarding'
import { DashboardScreen } from './screens/Dashboard'
import { DiscoveryScreen } from './screens/Discovery'
import { CategorizationScreen } from './screens/Categorization'
import { AboutScreen } from './screens/About'
import { buildRecords, buildIndex, aggregate, loadAnnotations, setAnnotation } from './data'

const STORAGE_KEY = 'linkr_state_v1'

const ACCENT_PALETTE = {
  blue:   { name: 'Pacific', primary: 'oklch(48% 0.15 250)', soft: 'oklch(96% 0.03 250)', soft2: 'oklch(92% 0.05 250)', hover: 'oklch(42% 0.16 250)' },
  indigo: { name: 'Indigo',  primary: 'oklch(45% 0.16 280)', soft: 'oklch(96% 0.03 280)', soft2: 'oklch(92% 0.05 280)', hover: 'oklch(40% 0.17 280)' },
  teal:   { name: 'Teal',    primary: 'oklch(48% 0.12 195)', soft: 'oklch(96% 0.025 195)', soft2: 'oklch(92% 0.04 195)', hover: 'oklch(42% 0.13 195)' },
  forest: { name: 'Forest',  primary: 'oklch(45% 0.12 155)', soft: 'oklch(96% 0.025 155)', soft2: 'oklch(92% 0.04 155)', hover: 'oklch(40% 0.13 155)' },
  ink:    { name: 'Ink',     primary: 'oklch(28% 0.02 250)', soft: 'oklch(95% 0.005 250)', soft2: 'oklch(90% 0.008 250)', hover: 'oklch(22% 0.02 250)' },
}

const SOL_ADDR = '8FdJ7zCnbMPQ4q3aPyMqBqCH9rwDk6m7E6tNqV2hX9rL'
const BTC_ADDR = 'bc1qexampleexampleexampleexampleexampleex0'

function AppFooter() {
  const [open, setOpen] = useState(null)
  const qr = (data) => `https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=8&data=${encodeURIComponent(data)}`
  return (
    <footer className="app-footer">
      <div className="footer-inner">
        <span>Made with <span className="heart">♥</span> in Canada · Linkr is local-first · nothing leaves your browser</span>
        <span className="footer-spacer" />
        <a className="footer-link coffee-link" href="https://buymeacoffee.com" target="_blank" rel="noreferrer">
          <Icon name="coffee" size={13} /> Buy me a coffee
        </a>
        <button className="footer-link" onClick={() => setOpen(open === 'sol' ? null : 'sol')}>
          <span className="crypto-mark sol">◎</span> Solana
        </button>
        <button className="footer-link" onClick={() => setOpen(open === 'btc' ? null : 'btc')}>
          <span className="crypto-mark btc">₿</span> Bitcoin
        </button>
      </div>
      {open && (
        <div className="qr-popover-backdrop" onClick={() => setOpen(null)}>
          <div className="qr-popover" onClick={(e) => e.stopPropagation()}>
            <div className="qr-head">
              <span className={'crypto-mark ' + open}>{open === 'sol' ? '◎' : '₿'}</span>
              <strong>{open === 'sol' ? 'Solana' : 'Bitcoin'} tip jar</strong>
              <button className="x-btn" onClick={() => setOpen(null)}><Icon name="x" size={13} /></button>
            </div>
            <img className="qr-img" src={qr(open === 'sol' ? SOL_ADDR : BTC_ADDR)} alt={open + ' QR'} />
            <div className="qr-addr">{open === 'sol' ? SOL_ADDR : BTC_ADDR}</div>
            <div className="qr-help">Scan or copy · thanks for the support 🙏</div>
          </div>
        </div>
      )}
    </footer>
  )
}

function AccentPicker({ accent, setAccent }) {
  return (
    <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 50, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '12px 14px', boxShadow: 'var(--shadow-lg)' }}>
      <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Accent</div>
      <div style={{ display: 'flex', gap: 8 }}>
        {Object.entries(ACCENT_PALETTE).map(([key, val]) => (
          <button key={key} title={val.name}
            onClick={() => setAccent(key)}
            style={{
              width: 22, height: 22, borderRadius: '50%', border: accent === key ? '2px solid var(--text)' : '2px solid transparent',
              background: val.primary, cursor: 'pointer', transform: accent === key ? 'scale(1.1)' : 'scale(1)',
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default function App() {
  const [stage, setStage] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}').stage || 'instructions' }
    catch { return 'instructions' }
  })
  const [authMode, setAuthMode] = useState(null)
  const [records, setRecords] = useState([])
  const [agg, setAgg] = useState(null)
  const [index, setIndex] = useState(null)
  const [annotations, setAnnotations] = useState({})
  const [activeNav, setActiveNav] = useState('dashboard')
  const [discoveryFilter, setDiscoveryFilter] = useState(null)
  const [accent, setAccent] = useState('blue')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ stage }))
  }, [stage])

  useEffect(() => {
    setAnnotations(loadAnnotations())
  }, [])

  useEffect(() => {
    const a = ACCENT_PALETTE[accent] || ACCENT_PALETTE.blue
    const root = document.documentElement
    root.style.setProperty('--accent', a.primary)
    root.style.setProperty('--accent-hover', a.hover)
    root.style.setProperty('--accent-soft', a.soft)
    root.style.setProperty('--accent-soft-2', a.soft2)
  }, [accent])

  const handleImported = (csv) => {
    const recs = buildRecords(csv)
    setRecords(recs)
    setAgg(aggregate(recs))
    setIndex(buildIndex(recs))
    setStage('app')
    setActiveNav('dashboard')
  }

  const navigateToDiscovery = (nlResult) => {
    if (nlResult?.filters) {
      const dom  = nlResult.filters.filter((f) => f.kind === 'domain').map((f) => f.value)
      const roles = nlResult.filters.filter((f) => f.kind === 'role').map((f) => f.value)
      const years = nlResult.filters.filter((f) => f.kind === 'year').map((f) => String(f.value))
      const endorsed    = nlResult.filters.some((f) => f.kind === 'endorsed')
      const recommended = nlResult.filters.some((f) => f.kind === 'recommended')
      setDiscoveryFilter({ domains: dom, roles, years, endorsed, recommended })
    }
    setActiveNav('discovery')
  }

  const openDomain = (key) => {
    setDiscoveryFilter({ domains: [key], roles: [], years: [], endorsed: false, recommended: false })
    setActiveNav('discovery')
  }

  const resetAll = () => {
    if (!confirm('This will clear your imported data and start over. Continue?')) return
    localStorage.removeItem(STORAGE_KEY)
    setStage('instructions')
    setRecords([]); setAgg(null); setIndex(null)
  }

  if (stage === 'instructions') return <InstructionsScreen onContinue={() => setStage('login')} />
  if (stage === 'login') return <LoginChoiceScreen onChoose={(m) => { setAuthMode(m); setStage('import') }} />
  if (stage === 'import' || (stage === 'app' && records.length === 0)) return <ImportScreen onImported={handleImported} />

  const navItems = [
    { key: 'dashboard',     label: 'Network Pulse', icon: 'home',   count: agg?.total },
    { key: 'discovery',     label: 'Discovery',     icon: 'search' },
    { key: 'categorization',label: 'Segments',      icon: 'tag' },
  ]

  const titleByKey = {
    dashboard:      { title: 'Network Pulse', crumb: 'Live insights & analytics' },
    discovery:      { title: 'Discovery',     crumb: 'Search · filter · sort' },
    categorization: { title: 'Segments',      crumb: 'Roles, tags & groups' },
    about:          { title: 'About',         crumb: 'The maker' },
  }
  const head = titleByKey[activeNav]

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <button className="sidebar-brand brand-button" onClick={() => setActiveNav('dashboard')} title="Go to Network Pulse">
          <div className="mark"><Icon name="chain" size={15} stroke={2.2} /></div>
          <div className="wordmark">linkr<sup>v1</sup></div>
        </button>
        <nav className="sidebar-nav">
          <div className="label">Workspace</div>
          {navItems.map((n) => (
            <button key={n.key}
              className={'nav-item' + (activeNav === n.key ? ' active' : '')}
              onClick={() => { setActiveNav(n.key); if (n.key === 'discovery') setDiscoveryFilter(null) }}
            >
              <Icon name={n.icon} size={15} className="icon" />
              {n.label}
              {n.count != null && <span className="count">{n.count.toLocaleString()}</span>}
            </button>
          ))}
          <div className="label">Maker</div>
          <button className={'nav-item' + (activeNav === 'about' ? ' active' : '')} onClick={() => setActiveNav('about')}>
            <Icon name="user" size={15} className="icon" /> About Me
          </button>
        </nav>
        <div className="sidebar-foot">
          <div style={{ padding: '8px 10px', fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--muted)' }}>
            {authMode === 'account'
              ? <><Icon name="lock" size={11} stroke={2} /> Local account</>
              : <><Icon name="ghost" size={11} stroke={2} /> Guest mode</>}
          </div>
          <button className="nav-item" onClick={resetAll}>
            <Icon name="logout" size={15} className="icon" /> Reset &amp; re-import
          </button>
        </div>
      </aside>

      <div className="app-main">
        <header className="topbar">
          <h1>{head.title}</h1>
          <span className="crumb">/ {head.crumb}</span>
          <div className="spacer" />
          <span className="pill"><span className="dot" /> {agg.total.toLocaleString()} connections loaded · local-only</span>
        </header>
        <main className="canvas">
          {activeNav === 'dashboard' && (
            <DashboardScreen records={records} agg={agg} onNavigate={navigateToDiscovery} />
          )}
          {activeNav === 'discovery' && (
            <DiscoveryScreen
              records={records} index={index} agg={agg}
              annotations={annotations} setAnnotations={setAnnotations}
              initialFilter={discoveryFilter}
              key={JSON.stringify(discoveryFilter || {})}
            />
          )}
          {activeNav === 'categorization' && (
            <CategorizationScreen records={records} agg={agg} onOpenDomain={openDomain} />
          )}
          {activeNav === 'about' && <AboutScreen />}
        </main>
        <AppFooter />
      </div>

      <AccentPicker accent={accent} setAccent={setAccent} />
    </div>
  )
}
