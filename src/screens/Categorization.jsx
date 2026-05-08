import Icon from '../components/Icon'
import { DOMAIN_RULES } from '../data'

export function CategorizationScreen({ records, agg, onOpenDomain }) {
  const total = agg.total || 1

  const allCategories = DOMAIN_RULES.map((rule) => {
    const items = records.filter((r) => (r.roles || [r.domain]).includes(rule.key))
    const companies = {}
    items.forEach((r) => {
      if (r.company) companies[r.company] = (companies[r.company] || 0) + 1
    })
    const topCompanies = Object.entries(companies).sort((a, b) => b[1] - a[1]).slice(0, 5)
    return { rule, items, count: items.length, topCompanies }
  })

  const titleFreq = {}
  records.forEach((r) => {
    if (!r.position) return
    r.position.replace(/[(),/&]/g, ' ').split(/\s+/)
      .map((w) => w.trim())
      .filter((w) => w.length > 2 && !/^\d+$/.test(w))
      .forEach((w) => {
        const lw = w.toLowerCase()
        if (['the','and','for','with','of','in','to','at','or','as'].includes(lw)) return
        titleFreq[lw] = (titleFreq[lw] || 0) + 1
      })
  })
  const cloud = Object.entries(titleFreq).filter(([, c]) => c >= 3).sort((a, b) => b[1] - a[1]).slice(0, 60)
  const maxCloud = cloud[0] ? cloud[0][1] : 1

  return (
    <div>
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-head">
          <h3>How Linkr categorizes your network</h3>
          <span className="sub">Multi-tag · one person can land in several role buckets</span>
        </div>
        <p style={{ margin: 0, color: 'var(--text-2)', fontSize: 13.5, lineHeight: 1.6, maxWidth: '70ch' }}>
          We assign every connection to one or more <strong>role tags</strong> based on what their title says they <em>do</em>.
          An "Engineering Manager" lands in both <strong>Engineering &amp; Tech</strong> and <strong>Managers</strong>.
          Seniority (VP, Director, Lead) is tracked as a separate dimension.
          Bucket totals can sum to more than your network size because of multi-tagging — that's by design.
        </p>
      </div>

      <div className="cat-grid">
        {allCategories.map(({ rule, items, count, topCompanies }) => {
          const pct = total ? (count / total) * 100 : 0
          return (
            <div key={rule.key} className="cat-card" onClick={() => onOpenDomain(rule.key)}>
              <div className="head">
                <div className="ic" style={{ background: rule.color }}><Icon name="people" size={18} /></div>
                <h3>{rule.label}</h3>
                <span className="pct">{pct.toFixed(1)}%</span>
              </div>
              <div className="cat-bar-track">
                <div className="cat-bar-fill" style={{ width: pct + '%', background: rule.color }} />
              </div>
              <div className="stats">
                <div className="stat-item">
                  <div className="num">{count.toLocaleString()}</div>
                  <div className="lbl">people</div>
                </div>
                <div className="stat-item">
                  <div className="num">{topCompanies.length}</div>
                  <div className="lbl">top cos</div>
                </div>
                <div className="stat-item">
                  <div className="num">{items.filter((r) => r.endorsed).length}</div>
                  <div className="lbl">endorsed</div>
                </div>
              </div>
              <div className="top-tags">
                {topCompanies.map(([co, c]) => (
                  <span key={co} className="top-tag">{co} <span style={{ color: 'var(--faint)', marginLeft: 3 }}>{c}</span></span>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ marginTop: 24 }}>
        <div className="card-head">
          <h3 style={{ margin: 0, fontSize: 13.5, fontWeight: 600 }}>Title tag cloud</h3>
          <span className="sub">Most common words across all titles</span>
        </div>
        <div className="tag-cloud">
          {cloud.map(([w, c]) => {
            const t = c / maxCloud
            return (
              <span key={w} className="tag-cloud-item"
                style={{ fontSize: 12 + t * 22, fontWeight: 400 + Math.round(t * 300), opacity: 0.45 + t * 0.55 }}
                title={c + ' connections'}>
                {w}
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}
