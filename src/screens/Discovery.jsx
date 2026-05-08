import { useState, useMemo } from 'react'
import Icon from '../components/Icon'
import { DOMAIN_RULES, ROLE_RULES, getAnnotation, setAnnotation } from '../data'

const PersonCard = ({ r, ann, onEdit, onCompany, onRole }) => {
  const a = ann || { tags: [], note: '' }
  const openLinkedIn = (e) => {
    e.stopPropagation()
    if (r.url) window.open(r.url, '_blank', 'noopener,noreferrer')
  }
  return (
    <div className="person-card">
      <div className="card-actions visible">
        <button className="icon-btn" onClick={(e) => { e.stopPropagation(); onEdit(r) }} title="Edit annotations">
          <Icon name="edit" size={13} />
        </button>
      </div>
      <div className="person-card-row">
        <button className="avatar avatar-btn" style={{ background: r.avatar.color }} onClick={openLinkedIn} title="Open LinkedIn profile">
          {r.avatar.initials}
        </button>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div className="person-name-row">
            <button className="person-name link-name" onClick={openLinkedIn}>{r.fullName}</button>
            {r.endorsed && (
              <span className="rel-icon endorsed" title="Endorsed your skills">
                <Icon name="thumbs-up" size={12} stroke={2} />
              </span>
            )}
            {r.recommended && (
              <span className="rel-icon recommended" title="Wrote a recommendation for you">
                <Icon name="award" size={12} stroke={2} />
              </span>
            )}
          </div>
          <div className="person-pos">
            <Icon name="id-badge" size={12} />
            <span>{r.position || <em style={{ color: 'var(--faint)' }}>No title</em>}</span>
          </div>
          <div className="person-co">
            <Icon name="briefcase" size={12} />
            <button className="link-inline" onClick={() => onCompany(r.company)} disabled={!r.company}>
              {r.company || <em style={{ color: 'var(--faint)' }}>—</em>}
            </button>
          </div>
          {r.email && (
            <div className="person-co" title={r.email}>
              <Icon name="mail" size={12} />
              <a className="link-inline" href={'mailto:' + r.email} onClick={(e) => e.stopPropagation()}>{r.email}</a>
            </div>
          )}
        </div>
      </div>

      <div className="person-tags">
        <span className="meta-chip">
          <Icon name="calendar" size={11} />
          {r.connectedOn || '—'}
        </span>
        {a.tags.slice(0, 3).map((t, i) => (
          <span key={i} className="tag tag-custom">
            <Icon name="tag" size={10} stroke={2} />{t}
          </span>
        ))}
      </div>

      <div className="person-meta">
        {(r.roleTags || [{ key: r.domain, label: r.domainLabel, color: r.domainColor }]).slice(0, 3).map((rt) => (
          <button key={rt.key} className="role-link" onClick={() => onRole(rt.key)}>
            <span className="role-dot" style={{ background: rt.color || 'var(--accent)' }} />
            {rt.label}
          </button>
        ))}
        <span className="seniority-chip">
          <Icon name="people" size={11} /> {r.roleLabel}
        </span>
        {a.note && <span className="note-flag" title={a.note}><Icon name="info" size={11} /> note</span>}
      </div>
    </div>
  )
}

const EditModal = ({ record, ann, onClose, onSave }) => {
  const [tags, setTags] = useState(ann.tags || [])
  const [note, setNote] = useState(ann.note || '')
  const [input, setInput] = useState('')
  if (!record) return null

  const addTag = (t) => {
    const v = (t || input).trim()
    if (!v || tags.includes(v)) return
    setTags([...tags, v])
    setInput('')
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Edit annotation</h3>
        <div className="sub">{record.fullName} · {record.position}</div>

        <div className="field">
          <label>Auto-detected roles</label>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {(record.roleTags || [{ key: record.domain, label: record.domainLabel }]).map((rt) => (
              <span key={rt.key} className="tag tag-domain">{rt.label}</span>
            ))}
            <span className="tag">{record.roleLabel}</span>
          </div>
        </div>

        <div className="field">
          <label>Custom tags</label>
          <div className="tag-editor">
            {tags.map((t, i) => (
              <span key={i} className="tag tag-custom">
                {t}<span className="x" onClick={() => setTags(tags.filter((_, j) => j !== i))}>×</span>
              </span>
            ))}
            <input
              placeholder="Add tag and press Enter…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            />
          </div>
          <div style={{ display: 'flex', gap: 4, marginTop: 8, flexWrap: 'wrap' }}>
            {['High priority', 'Mentor', 'Reach out Q1', 'Customer', 'Investor', 'Personal friend'].map((s) => (
              <button key={s} className="btn btn-sm btn-secondary" onClick={() => addTag(s)} type="button">+ {s}</button>
            ))}
          </div>
        </div>

        <div className="field">
          <label>Private note</label>
          <textarea placeholder="Met at SaaStr 2024, intro to engineering team…" value={note} onChange={(e) => setNote(e.target.value)} />
        </div>

        <div className="modal-foot">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => onSave({ tags, note })}>Save</button>
        </div>
      </div>
    </div>
  )
}

export function DiscoveryScreen({ records, index, agg, annotations, setAnnotations, initialFilter }) {
  const [q, setQ] = useState(initialFilter?.searchQ || '')
  const [domains, setDomains] = useState(new Set(initialFilter?.domains || []))
  const [roles, setRoles] = useState(new Set(initialFilter?.roles || []))
  const [years, setYears] = useState(new Set(initialFilter?.years || []))
  const [companyFilter, setCompanyFilter] = useState(initialFilter?.company || '')
  const [onlyEndorsed, setOnlyEndorsed] = useState(!!initialFilter?.endorsed)
  const [onlyRecommended, setOnlyRecommended] = useState(!!initialFilter?.recommended)
  const [editing, setEditing] = useState(null)
  const [sort, setSort] = useState('recent')
  const [limit, setLimit] = useState(60)

  const searchIds = useMemo(() => {
    if (!q.trim() || !index) return null
    const res = index.search(q, { limit: 1000 })
    const ids = new Set()
    res.forEach((r) => r.result.forEach((id) => ids.add(id)))
    return ids
  }, [q, index])

  const filtered = useMemo(() => {
    let arr = records
    if (searchIds) arr = arr.filter((r) => searchIds.has(r.id))
    if (companyFilter) arr = arr.filter((r) => r.company === companyFilter)
    if (domains.size) arr = arr.filter((r) => (r.roles || [r.domain]).some((rk) => domains.has(rk)))
    if (roles.size) arr = arr.filter((r) => roles.has(r.role))
    if (years.size) arr = arr.filter((r) => r.connectedYear && years.has(String(r.connectedYear)))
    if (onlyEndorsed) arr = arr.filter((r) => r.endorsed)
    if (onlyRecommended) arr = arr.filter((r) => r.recommended)
    if (sort === 'recent') arr = [...arr].sort((a, b) => (b.connectedDate?.getTime() || 0) - (a.connectedDate?.getTime() || 0))
    else if (sort === 'name') arr = [...arr].sort((a, b) => a.fullName.localeCompare(b.fullName))
    else if (sort === 'company') arr = [...arr].sort((a, b) => (a.company || '').localeCompare(b.company || ''))
    return arr
  }, [records, searchIds, domains, roles, years, onlyEndorsed, onlyRecommended, sort, companyFilter])

  const toggle = (set, value, setter) => {
    const next = new Set(set)
    if (next.has(value)) next.delete(value); else next.add(value)
    setter(next)
  }

  const handleSave = (val) => {
    const ann = { ...annotations }
    setAnnotation(ann, editing, val)
    setAnnotations(ann)
    setEditing(null)
  }

  const clearAll = () => {
    setDomains(new Set()); setRoles(new Set()); setYears(new Set())
    setOnlyEndorsed(false); setOnlyRecommended(false); setQ(''); setCompanyFilter('')
  }

  const yearsList = Object.fromEntries(agg.byYear)
  const domainCounts = Object.fromEntries(agg.byDomain.map(([l, c]) => {
    const rule = DOMAIN_RULES.find((r) => r.label === l)
    return [rule ? rule.key : 'other', c]
  }))
  const roleCounts = Object.fromEntries(agg.byRole.map(([l, c]) => {
    const rule = ROLE_RULES.find((r) => r.label === l)
    return [rule ? rule.key : 'ic', c]
  }))

  const activeFilters = [
    ...[...domains].map((d) => ({ kind: 'domain', v: d, label: DOMAIN_RULES.find((r) => r.key === d)?.label })),
    ...[...roles].map((r) => ({ kind: 'role', v: r, label: ROLE_RULES.find((rr) => rr.key === r)?.label })),
    ...[...years].map((y) => ({ kind: 'year', v: y, label: y })),
    onlyEndorsed && { kind: 'endorsed', label: 'Endorsed me' },
    onlyRecommended && { kind: 'recommended', label: 'Recommended me' },
  ].filter(Boolean)

  return (
    <div className="discovery-shell">
      <aside className="filter-rail">
        <div className="filter-group">
          <h4>Role</h4>
          {[...DOMAIN_RULES, { key: 'other', label: 'Other' }].map((d) => (
            <label key={d.key} className="filter-checkbox">
              <input type="checkbox" checked={domains.has(d.key)} onChange={() => toggle(domains, d.key, setDomains)} />
              <span>{d.label}</span>
              <span className="count">{domainCounts[d.key] || 0}</span>
            </label>
          ))}
        </div>
        <div className="filter-group">
          <h4 style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ fontSize: 13 }}>🏗️</span> Seniority
          </h4>
          {ROLE_RULES.map((r) => (
            <label key={r.key} className="filter-checkbox">
              <input type="checkbox" checked={roles.has(r.key)} onChange={() => toggle(roles, r.key, setRoles)} />
              <span>{r.label}</span>
              <span className="count">{roleCounts[r.key] || 0}</span>
            </label>
          ))}
        </div>
        <div className="filter-group">
          <h4>Connected year</h4>
          {Object.keys(yearsList).sort((a, b) => Number(b) - Number(a)).slice(0, 12).map((y) => (
            <label key={y} className="filter-checkbox">
              <input type="checkbox" checked={years.has(y)} onChange={() => toggle(years, y, setYears)} />
              <span>{y}</span>
              <span className="count">{yearsList[y]}</span>
            </label>
          ))}
        </div>
        <div className="filter-group">
          <h4>Relationship</h4>
          <label className="filter-checkbox">
            <input type="checkbox" checked={onlyEndorsed} onChange={(e) => setOnlyEndorsed(e.target.checked)} />
            <span><strong style={{ color: 'var(--badge-e)' }}>👍</strong> Endorsed me</span>
            <span className="count">{agg.endorsed}</span>
          </label>
          <label className="filter-checkbox">
            <input type="checkbox" checked={onlyRecommended} onChange={(e) => setOnlyRecommended(e.target.checked)} />
            <span><strong style={{ color: 'var(--badge-r)' }}>🏆</strong> Recommended me</span>
            <span className="count">{agg.recommended}</span>
          </label>
        </div>
        {activeFilters.length > 0 && (
          <button className="btn btn-secondary btn-sm" style={{ width: '100%' }} onClick={clearAll}>Clear all filters</button>
        )}
      </aside>

      <div className="discovery-main">
        {companyFilter && (
          <div className="active-filter-bar">
            <Icon name="briefcase" size={13} />
            Filtering by company: <strong>{companyFilter}</strong>
            <button className="x-btn" onClick={() => setCompanyFilter('')}><Icon name="x" size={12} /></button>
          </div>
        )}
        <div className="discovery-toolbar">
          <div className="search-wrap">
            <span className="search-icon"><Icon name="search" size={15} /></span>
            <input className="search-input" placeholder="Search names, companies, titles…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <select className="btn btn-secondary" value={sort} onChange={(e) => setSort(e.target.value)} style={{ padding: '9px 14px' }}>
            <option value="recent">Most recent</option>
            <option value="name">Name A→Z</option>
            <option value="company">Company A→Z</option>
          </select>
          <span className="toolbar-meta">{filtered.length.toLocaleString()} result{filtered.length === 1 ? '' : 's'}</span>
        </div>

        {filtered.length === 0 ? (
          <div className="empty">
            <Icon name="search" size={28} />
            <h3>No matches</h3>
            <p>Try removing a filter or broadening your search.</p>
          </div>
        ) : (
          <>
            <div className="cards-grid">
              {filtered.slice(0, limit).map((r) => (
                <PersonCard
                  key={r.id} r={r}
                  ann={getAnnotation(annotations, r)}
                  onEdit={(rec) => setEditing(rec)}
                  onCompany={(co) => setCompanyFilter(co)}
                  onRole={(d) => setDomains(new Set([d]))}
                />
              ))}
            </div>
            {filtered.length > limit && (
              <div style={{ textAlign: 'center', marginTop: 24 }}>
                <button className="btn btn-secondary" onClick={() => setLimit(limit + 60)}>
                  Show {Math.min(60, filtered.length - limit)} more · {filtered.length - limit} remaining
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {editing && (
        <EditModal
          record={editing}
          ann={getAnnotation(annotations, editing)}
          onClose={() => setEditing(null)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}
