import { useState, useMemo } from 'react'
import Icon from '../components/Icon'
import { DOMAIN_RULES, parseNLQuery } from '../data'

const Donut = ({ data, total, size = 200 }) => {
  if (!data.length || !total) return null
  const radius = size / 2 - 6
  const inner = radius * 0.62
  const cx = size / 2, cy = size / 2
  let cum = 0
  const slices = data.map(([label, count]) => {
    const start = cum / total
    cum += count
    const end = cum / total
    const a0 = start * Math.PI * 2 - Math.PI / 2
    const a1 = end * Math.PI * 2 - Math.PI / 2
    const large = end - start > 0.5 ? 1 : 0
    const x0 = cx + radius * Math.cos(a0), y0 = cy + radius * Math.sin(a0)
    const x1 = cx + radius * Math.cos(a1), y1 = cy + radius * Math.sin(a1)
    const xi0 = cx + inner * Math.cos(a0), yi0 = cy + inner * Math.sin(a0)
    const xi1 = cx + inner * Math.cos(a1), yi1 = cy + inner * Math.sin(a1)
    const d = `M ${x0} ${y0} A ${radius} ${radius} 0 ${large} 1 ${x1} ${y1} L ${xi1} ${yi1} A ${inner} ${inner} 0 ${large} 0 ${xi0} ${yi0} Z`
    const rule = DOMAIN_RULES.find((r) => r.label === label)
    const color = rule ? rule.color : 'oklch(60% 0.005 240)'
    return <path key={label} d={d} fill={color} />
  })
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} style={{ display: 'block' }}>
      {slices}
      <text x={cx} y={cy - 4} textAnchor="middle" fontSize="22" fontWeight="600" fill="var(--text)" letterSpacing="-0.02em">{total.toLocaleString()}</text>
      <text x={cx} y={cy + 14} textAnchor="middle" fontSize="10" fill="var(--muted)" fontFamily="var(--font-mono)">TOTAL</text>
    </svg>
  )
}

const TimelineBars = ({ data, height = 160 }) => {
  if (!data.length) return null
  const max = Math.max(...data.map((d) => d[1]))
  return (
    <div style={{ position: 'relative', height: height + 24 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', height, gap: 6, padding: '0 4px' }}>
        {data.map(([year, count]) => (
          <div key={year} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted)' }}>{count}</div>
            <div style={{
              width: '100%', maxWidth: 38,
              height: (count / max) * height,
              background: 'linear-gradient(180deg, var(--accent) 0%, var(--accent-hover) 100%)',
              borderRadius: '4px 4px 0 0', minHeight: 2,
            }} />
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-2)', marginTop: 4 }}>{year}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

const AIHero = ({ records, onResult }) => {
  const [q, setQ] = useState('')
  const [result, setResult] = useState(null)
  const suggestions = [
    'Engineering leads I met in 2024',
    'Recruiters who endorsed me',
    'Founders and executives',
    'Product managers connected last year',
    'Anyone who recommended me',
  ]
  const run = (text) => {
    if (!text.trim()) return
    const r = parseNLQuery(text, records)
    setResult(r)
    onResult && onResult(r)
  }
  return (
    <div className="ai-hero">
      <div className="label-row">
        <span className="ai-pill"><Icon name="sparkles" size={11} /> ASK LINKR</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)' }}>Natural language → filters</span>
      </div>
      <h2>Who are you looking for?</h2>
      <input
        className="ai-search-input"
        placeholder='Try: "Who are the engineering leads I met in 2024?"'
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && run(q)}
      />
      <div className="ai-suggestions">
        {suggestions.map((s) => (
          <span key={s} className="ai-chip" onClick={() => { setQ(s); run(s) }}>{s}</span>
        ))}
      </div>
      {result && (
        <div className="ai-result-card">
          <div className="answer">
            Found <strong>{result.results.length.toLocaleString()}</strong> {result.results.length === 1 ? 'person' : 'people'} matching "{result.query}".
            {result.results.length > 0 && ' Open Discovery to view cards.'}
          </div>
          {result.filters.length > 0 && (
            <div className="filters-applied">
              {result.filters.map((f, i) => <span key={i} className="ai-filter-chip">{f.label}</span>)}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const Insights = ({ records, agg, recentCount, topCompany, topDomain }) => {
  const peakYear = agg.byYear.slice().sort((a, b) => b[1] - a[1])[0]
  const endorsedPct = agg.total ? Math.round((agg.endorsed / agg.total) * 100) : 0
  const distinctCompanies = new Set(records.map((r) => r.company).filter(Boolean)).size

  const insights = [
    {
      icon: 'trend',
      headline: `${topDomain[0]} is your strongest domain`,
      body: `${topDomain[1].toLocaleString()} of your ${agg.total.toLocaleString()} connections work in ${topDomain[0]} — about ${agg.total ? Math.round(topDomain[1] / agg.total * 100) : 0}% of your network.`,
    },
    {
      icon: 'people',
      headline: `${distinctCompanies.toLocaleString()} distinct companies`,
      body: `Your network spans ${distinctCompanies.toLocaleString()} organizations. Top concentration: ${topCompany[0]} (${topCompany[1]} people).`,
    },
    peakYear && {
      icon: 'chart-pie',
      headline: `${peakYear[0]} was your peak networking year`,
      body: `You added ${peakYear[1]} new connections that year — more than any other in your history.`,
    },
    {
      icon: 'sparkles',
      headline: `${endorsedPct}% of your network has endorsed your skills`,
      body: `${agg.endorsed.toLocaleString()} people have actively vouched for at least one skill. ${agg.recommended} have written full recommendations.`,
    },
  ].filter(Boolean)

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      {insights.map((ins, i) => (
        <div key={i} style={{ padding: '14px 16px', background: 'var(--bg-2)', borderRadius: 'var(--r-md)', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ width: 24, height: 24, borderRadius: 6, background: 'var(--accent-soft)', color: 'var(--accent)', display: 'grid', placeItems: 'center' }}>
              <Icon name={ins.icon} size={13} />
            </span>
            <span style={{ fontSize: 13, fontWeight: 600 }}>{ins.headline}</span>
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.55 }}>{ins.body}</div>
        </div>
      ))}
    </div>
  )
}

export function DashboardScreen({ records, agg, onNavigate }) {
  const recentCount = useMemo(() => {
    const ninety = new Date()
    ninety.setDate(ninety.getDate() - 90)
    return records.filter((r) => r.connectedDate && r.connectedDate >= ninety).length
  }, [records])

  const topCompany = agg.byCompany[0] || ['—', 0]
  const topDomain  = agg.byDomain[0]  || ['—', 0]

  return (
    <div>
      <AIHero records={records} onResult={(r) => onNavigate(r)} />

      <div className="kpi-grid">
        <div className="kpi">
          <div className="label">Connections</div>
          <div className="value">{agg.total.toLocaleString()}</div>
          <div className="delta">across {new Set(records.map(r => r.company).filter(Boolean)).size.toLocaleString()} companies</div>
        </div>
        <div className="kpi">
          <div className="label">Endorsed me</div>
          <div className="value">{agg.endorsed.toLocaleString()}</div>
          <div className="delta">{agg.total ? Math.round((agg.endorsed / agg.total) * 100) : 0}% of network</div>
        </div>
        <div className="kpi">
          <div className="label">Recommended me</div>
          <div className="value">{agg.recommended.toLocaleString()}</div>
          <div className="delta">Public testimonials</div>
        </div>
        <div className="kpi">
          <div className="label">Reachable by email</div>
          <div className="value">{agg.withEmail.toLocaleString()}</div>
          <div className="delta">{agg.total ? Math.round((agg.withEmail / agg.total) * 100) : 0}% shared their email</div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="col">
          <div className="card">
            <div className="card-head">
              <h3>Role mix</h3>
              <span className="sub">What they do — separate from seniority</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 24, alignItems: 'center' }}>
              <Donut data={agg.byDomain} total={agg.total} />
              <div>
                {agg.byDomain.map(([label, count]) => {
                  const rule = DOMAIN_RULES.find((r) => r.label === label)
                  const color = rule ? rule.color : 'oklch(60% 0.005 240)'
                  const pct = agg.total ? (count / agg.total) * 100 : 0
                  return (
                    <div key={label} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto auto', gap: 10, alignItems: 'center', padding: '7px 0', borderBottom: '1px solid var(--border)' }}>
                      <span style={{ width: 10, height: 10, borderRadius: 3, background: color }} />
                      <span style={{ fontSize: 13, fontWeight: 500 }}>{label}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--muted)' }}>{pct.toFixed(1)}%</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontVariantNumeric: 'tabular-nums', minWidth: 32, textAlign: 'right' }}>{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-head">
              <h3>Connections over time</h3>
              <span className="sub">By year added · {agg.byYear.length} year{agg.byYear.length === 1 ? '' : 's'} of history</span>
            </div>
            <TimelineBars data={agg.byYear} />
          </div>

          <div className="card">
            <div className="card-head"><h3>Insights</h3><span className="sub">Patterns Linkr noticed</span></div>
            <Insights records={records} agg={agg} recentCount={recentCount} topCompany={topCompany} topDomain={topDomain} />
          </div>
        </div>

        <div className="col">
          <div className="card">
            <div className="card-head"><h3>Top companies</h3><span className="sub">Top 8</span></div>
            <div>
              {agg.byCompany.slice(0, 8).map(([name, count]) => {
                const max = agg.byCompany[0][1]
                return (
                  <div key={name} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 500 }}>{name}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--muted)' }}>{count}</span>
                    </div>
                    <div className="bar-track"><div className="bar-fill" style={{ width: (count / max * 100) + '%' }} /></div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="card">
            <div className="card-head">
              <h3>Seniority mix</h3>
              <span className="sub">Manager, Director, VP — separate from role</span>
            </div>
            <div>
              {agg.byRole.slice(0, 8).map(([name, count]) => {
                const max = agg.byRole[0][1]
                const pct = agg.total ? (count / agg.total * 100) : 0
                return (
                  <div key={name} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 500 }}>{name}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--muted)' }}>{count} · {pct.toFixed(0)}%</span>
                    </div>
                    <div className="bar-track"><div className="bar-fill" style={{ width: (count / max * 100) + '%', background: 'var(--badge-e)' }} /></div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
