import { useState, useRef } from 'react'
import Icon from '../components/Icon'
import { parseCSV } from '../data'

const Logo = ({ size = 32 }) => (
  <div className="brand-row" style={{ marginBottom: 0 }}>
    <div className="mark" style={{ width: size, height: size }}>
      <Icon name="chain" size={size * 0.55} stroke={2} />
    </div>
    <div className="wordmark">linkr</div>
  </div>
)

// ── Screen 1 — Instructions ──────────────────────────────────────
const FooterCredit = () => (
  <div className="center-shell-foot">
    Made by <a href="http://linkedin.com/in/kiranvaidya" target="_blank" rel="noreferrer" style={{ color: 'var(--accent)' }}>Kiran</a> with <span style={{ color: 'var(--danger)' }}>♥</span> in Canada
  </div>
)

export function InstructionsScreen({ onContinue }) {
  return (
    <div className="center-shell">
      <div className="center-shell-main">
        <div className="center-card">
          <div style={{ marginBottom: 28 }}><Logo size={36} /></div>
          <span className="eyebrow">Step 1 of 3 · One-time setup</span>
          <h1 className="display">First, request your data from LinkedIn.</h1>
          <p className="lead">
            Linkr runs entirely on your device — your network never leaves the browser.
            To get started, we need the CSV files inside your LinkedIn data archive.
          </p>

          <div className="steps">
            <div className="step">
              <div className="step-num">1</div>
              <div>
                <h4>Sign in to LinkedIn</h4>
                <p>Open LinkedIn in another tab and make sure you're logged in to your account.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-num">2</div>
              <div>
                <h4>Open the data download page</h4>
                <p>Go to your settings and find the Data privacy section.</p>
                <a className="url" href="https://www.linkedin.com/mypreferences/d/download-my-data" target="_blank" rel="noreferrer">
                  <Icon name="external" size={12} />
                  linkedin.com/mypreferences/d/download-my-data
                </a>
              </div>
            </div>
            <div className="step">
              <div className="step-num">3</div>
              <div>
                <h4>Choose the larger archive</h4>
                <p>
                  Select <strong>"Download larger data archive, including connections,
                  verifications, contacts, account history, and information we infer
                  about you."</strong> Then submit the request.
                </p>
              </div>
            </div>
            <div className="step">
              <div className="step-num">4</div>
              <div>
                <h4>Wait for the full archive</h4>
                <p>
                  LinkedIn sends a small starter file right away, but it doesn't contain
                  everything we need. The full archive arrives by email in <strong>24 to 48 hours</strong>.
                  Unzip it when it arrives and come back here.
                </p>
              </div>
            </div>
            <div className="step">
              <div className="step-num">5</div>
              <div>
                <h4>Prefer to watch?</h4>
                <p>A 2-minute walkthrough video shows the same steps end-to-end.</p>
                <a className="url" href="https://youtu.be/1dknR7otvXg?si=ZTMKy2depjSCfVgs" target="_blank" rel="noreferrer">
                  <Icon name="youtube" size={12} />
                  youtu.be/1dknR7otvXg
                </a>
              </div>
            </div>
          </div>

          <div className="callout">
            <strong>Heads up:</strong> the small file LinkedIn sends instantly is not enough —
            please wait for the full archive (24–48 hrs). It contains <code>Connections.csv</code>,
            <code> Endorsement_Received_Info.csv</code> and <code>Recommendations_Received.csv</code>.
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
            <button className="btn btn-primary btn-lg" onClick={onContinue}>
              I have my CSV files <Icon name="check" size={14} />
            </button>
          </div>
        </div>
      </div>
      <FooterCredit />
    </div>
  )
}

// ── Screen 2 — Login choice ──────────────────────────────────────
export function LoginChoiceScreen({ onChoose, onBack }) {
  const [pick, setPick] = useState(null)
  const [user, setUser] = useState('')
  const [pwd, setPwd] = useState('')

  return (
    <div className="center-shell">
      <div className="center-shell-main">
        <div className="center-card">
          <div style={{ marginBottom: 28 }}><Logo size={36} /></div>
          <span className="eyebrow">Step 2 of 3 · Sign-in preference</span>
          <h1 className="display">How would you like to sign in?</h1>
          <p className="lead">
            Both options keep your data 100% local. Pick whatever feels right —
            you can change this later in settings.
          </p>

          <div className="login-grid">
            <button className={'login-option' + (pick === 'guest' ? ' selected' : '')} onClick={() => setPick('guest')}>
              <div className="ic"><Icon name="ghost" size={18} /></div>
              <h4>Guest mode</h4>
              <p>No account, no password. Open the app and you're in. Best for personal devices.</p>
            </button>
            <button className={'login-option' + (pick === 'account' ? ' selected' : '')} onClick={() => setPick('account')}>
              <div className="ic"><Icon name="lock" size={18} /></div>
              <h4>Username &amp; password</h4>
              <p>Lock the app behind a local password (stored only in your browser).</p>
            </button>
          </div>

          {pick === 'account' && (
            <div className="card" style={{ marginTop: 16 }}>
              <div className="field">
                <label>Username</label>
                <input value={user} onChange={(e) => setUser(e.target.value)} placeholder="kiran.v" />
              </div>
              <div className="field">
                <label>Password</label>
                <input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="••••••••" />
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <button className="btn btn-ghost btn-lg" onClick={onBack}>
              ← Back
            </button>
            <button
              className="btn btn-primary btn-lg"
              disabled={!pick || (pick === 'account' && (!user || !pwd))}
              style={{ opacity: !pick || (pick === 'account' && (!user || !pwd)) ? 0.5 : 1 }}
              onClick={() => onChoose(pick)}
            >
              Continue <Icon name="check" size={14} />
            </button>
          </div>
        </div>
      </div>
      <FooterCredit />
    </div>
  )
}

// ── Screen 3 — CSV Import ────────────────────────────────────────
function Dropzone({ required, file, onFile, children }) {
  const [drag, setDrag] = useState(false)
  const inputRef = useRef(null)

  const handleFiles = (files) => {
    if (!files || !files[0]) return
    onFile(files[0])
  }

  return (
    <div
      className={'dropzone' + (drag ? ' dragover' : '') + (file ? ' loaded' : '')}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => { e.preventDefault(); setDrag(false); handleFiles(e.dataTransfer.files) }}
    >
      <span className={'dropzone-tag' + (required ? ' required' : '')}>
        {required ? 'Required' : 'Optional'}
      </span>
      <div className="icon-big">
        {file ? <Icon name="check" size={18} stroke={2.4} /> : <Icon name="csv" size={18} />}
      </div>
      {children}
      {file && (
        <div className="stats">✓ {file.name} · {file.rows.toLocaleString()} rows</div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        style={{ display: 'none' }}
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  )
}

export function ImportScreen({ onImported, onBack }) {
  const [conn, setConn] = useState(null)
  const [endo, setEndo] = useState(null)
  const [rec, setRec] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleFile = async (file, setter) => {
    const text = await file.text()
    const rows = await parseCSV(text)
    setter({ name: file.name, rows: rows.length, data: rows })
  }

  const loadSample = async () => {
    setLoading(true)
    try {
      const fetchText = async (path) => {
        const r = await fetch(path)
        if (!r.ok) throw new Error('Fetch failed: ' + path)
        return r.text()
      }
      const [c, e, r] = await Promise.all([
        fetchText('/uploads/Connections.csv'),
        fetchText('/uploads/Endorsement_Received_Info.csv'),
        fetchText('/uploads/Recommendations_Received.csv'),
      ])
      const [crows, erows, rrows] = await Promise.all([
        parseCSV(c), parseCSV(e), parseCSV(r),
      ])
      setConn({ name: 'Connections.csv', rows: crows.length, data: crows })
      setEndo({ name: 'Endorsement_Received_Info.csv', rows: erows.length, data: erows })
      setRec({ name: 'Recommendations_Received.csv', rows: rrows.length, data: rrows })
    } catch (e) {
      console.warn('Could not load sample data:', e)
    }
    setLoading(false)
  }

  const handleImport = () => {
    if (!conn) return
    onImported({
      connections: conn.data,
      endorsements: endo ? endo.data : [],
      recommendations: rec ? rec.data : [],
    })
  }

  return (
    <div className="center-shell">
      <div className="center-shell-main">
        <div className="center-card">
          <div style={{ marginBottom: 28 }}><Logo size={36} /></div>
          <span className="eyebrow">Step 3 of 3 · Import your data</span>
          <h1 className="display">Drop your three CSV files.</h1>
          <p className="lead">
            Drag &amp; drop, or click any tile to browse.
            Connections is required; the other two unlock badges and richer insights.
          </p>

          <div className="import-grid">
            <Dropzone required file={conn} onFile={(f) => handleFile(f, setConn)}>
              <h4>Connections.csv</h4>
              <p className="desc">Your master list — every 1st-degree connection with name, role and company.</p>
            </Dropzone>
            <Dropzone file={endo} onFile={(f) => handleFile(f, setEndo)}>
              <h4>Endorsement_Received_Info.csv</h4>
              <p className="desc">Adds a thumbs-up badge to anyone who endorsed your skills.</p>
            </Dropzone>
            <Dropzone file={rec} onFile={(f) => handleFile(f, setRec)}>
              <h4>Recommendations_Received.csv</h4>
              <p className="desc">Adds an award badge to anyone who recommended you.</p>
            </Dropzone>
          </div>

          <div className="callout info">
            <strong>Privacy:</strong> files are parsed in your browser. Nothing is uploaded.
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button className="btn btn-ghost btn-lg" onClick={onBack}>
              ← Back
            </button>
            <button className="btn btn-primary btn-lg" disabled={!conn} onClick={handleImport}
              style={{ opacity: conn ? 1 : 0.5 }}>
              Build my network intelligence <Icon name="check" size={14} />
            </button>
            <button className="btn btn-secondary" onClick={loadSample} disabled={loading}>
              {loading ? 'Loading…' : 'Try with sample data'}
            </button>
            <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--muted)' }}>
              {conn ? conn.rows.toLocaleString() + ' connections ready' : '0 connections'}
            </span>
          </div>
        </div>
      </div>
      <FooterCredit />
    </div>
  )
}
