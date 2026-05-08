import Icon from '../components/Icon'

export function AboutScreen() {
  return (
    <div className="about-shell">
      <div>
        <div className="about-photo">
          <div className="ph">
            📷<br />Drop your<br />profile photo<br />here
          </div>
        </div>
        <div style={{ marginTop: 16, display: 'flex', gap: 6, flexDirection: 'column' }}>
          <a className="btn btn-secondary" href="https://www.linkedin.com" target="_blank" rel="noreferrer">
            <Icon name="external" size={13} /> View LinkedIn profile
          </a>
          <a className="btn btn-ghost" href="mailto:hello@example.com">
            <Icon name="mail" size={13} /> Get in touch
          </a>
        </div>
      </div>
      <div>
        <span className="eyebrow">The maker</span>
        <h1 className="about-name">Hi — I built Linkr.</h1>
        <p className="about-title">
          Independent product maker · AI &amp; data tooling · based in Canada 🇨🇦
        </p>
        <p style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--text)', margin: '0 0 16px', maxWidth: '60ch' }}>
          Linkr is a personal project — a fully-local LinkedIn connection manager that
          treats your data as <em>yours</em>. No cloud, no tracking, no sign-ups.
          I built it because I wanted a way to ask my network real questions like
          "who are the engineering leads I met in 2024?" without uploading a CSV to a third party.
        </p>
        <p style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--text-2)', margin: '0 0 24px', maxWidth: '60ch' }}>
          If you're hiring or want to talk about local-first AI, data UX, or
          product tooling, I'd love to chat.
        </p>

        <div className="about-section">
          <h4>What I work on</h4>
          <div className="skill-pills">
            {['AI Product', 'LLM Integration', 'Local-first apps', 'Data UX', 'React', 'TypeScript', 'Information design', 'Product Management'].map((s) => (
              <span key={s} className="skill-pill">{s}</span>
            ))}
          </div>
        </div>

        <div className="about-section">
          <h4>Recent ships</h4>
          <ul style={{ margin: 0, paddingLeft: 20, color: 'var(--text-2)', fontSize: 14, lineHeight: 1.7 }}>
            <li><strong style={{ color: 'var(--text)' }}>Linkr</strong> — this app, a private LinkedIn data explorer</li>
            <li><strong style={{ color: 'var(--text)' }}>Natural-language network search</strong> — translate questions into filters, fully on-device</li>
            <li><strong style={{ color: 'var(--text)' }}>FlexSearch indexing</strong> — instant search across thousands of connections</li>
          </ul>
        </div>

        <div className="about-section">
          <h4>Edit your bio</h4>
          <p style={{ fontSize: 12.5, color: 'var(--muted)', margin: 0 }}>
            Replace this content with your own in <code>src/screens/About.jsx</code> — the photo, name, headline, skill pills and ships list are all editable there.
          </p>
        </div>
      </div>
    </div>
  )
}
