const Icon = ({ name, size = 16, stroke = 1.6, className, style }) => {
  const props = {
    width: size, height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: stroke,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className,
    style: { width: size, height: size, ...style },
  }
  switch (name) {
    case "home":      return <svg {...props}><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /></svg>
    case "search":    return <svg {...props}><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
    case "tag":       return <svg {...props}><path d="M3 12V4h8l9 9-8 8-9-9z" /><circle cx="7.5" cy="7.5" r="1.2" fill="currentColor" /></svg>
    case "user":      return <svg {...props}><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" /></svg>
    case "upload":    return <svg {...props}><path d="M12 3v13" /><path d="M7 8l5-5 5 5" /><path d="M4 17v3h16v-3" /></svg>
    case "edit":      return <svg {...props}><path d="M4 20l4-1 11-11-3-3L5 16l-1 4z" /></svg>
    case "external":  return <svg {...props}><path d="M14 4h6v6" /><path d="M20 4l-9 9" /><path d="M19 14v6H5V6h6" /></svg>
    case "sparkles":  return <svg {...props}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.5 5.5l2.8 2.8M15.7 15.7l2.8 2.8M5.5 18.5l2.8-2.8M15.7 8.3l2.8-2.8" /></svg>
    case "check":     return <svg {...props}><path d="M5 12l5 5 9-11" /></svg>
    case "chain":     return <svg {...props}><path d="M10 14a4 4 0 0 1 0-5.7l3-3a4 4 0 0 1 5.7 5.7l-1.5 1.5" /><path d="M14 10a4 4 0 0 1 0 5.7l-3 3a4 4 0 0 1-5.7-5.7l1.5-1.5" /></svg>
    case "filter":    return <svg {...props}><path d="M3 5h18l-7 9v6l-4-2v-4z" /></svg>
    case "x":         return <svg {...props}><path d="M5 5l14 14M19 5L5 19" /></svg>
    case "plus":      return <svg {...props}><path d="M12 5v14M5 12h14" /></svg>
    case "logout":    return <svg {...props}><path d="M14 4h5v16h-5" /><path d="M14 12H4" /><path d="M8 8l-4 4 4 4" /></svg>
    case "lock":      return <svg {...props}><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
    case "ghost":     return <svg {...props}><path d="M5 11a7 7 0 0 1 14 0v9l-2.5-1.5L14 20l-2-1.5L10 20l-2.5-1.5L5 20z" /><circle cx="9" cy="10" r="1" fill="currentColor" /><circle cx="15" cy="10" r="1" fill="currentColor" /></svg>
    case "youtube":   return <svg {...props}><rect x="2" y="6" width="20" height="12" rx="3" /><path d="M10 9.5l5 2.5-5 2.5z" fill="currentColor" /></svg>
    case "csv":       return <svg {...props}><path d="M14 3H6v18h12V7l-4-4z" /><path d="M14 3v4h4" /><path d="M9 13h2M9 17h6M13 13h2" /></svg>
    case "trend":     return <svg {...props}><path d="M3 17l6-6 4 4 8-9" /><path d="M14 6h7v7" /></svg>
    case "chart-pie": return <svg {...props}><path d="M21 12A9 9 0 1 1 12 3v9z" /><path d="M21 12a9 9 0 0 0-9-9v9z" /></svg>
    case "people":    return <svg {...props}><circle cx="9" cy="8" r="3.5" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" /><path d="M16 5a3.5 3.5 0 0 1 0 7" /><path d="M21 20c0-2.5-1.5-4.7-4-5.5" /></svg>
    case "info":      return <svg {...props}><circle cx="12" cy="12" r="9" /><path d="M12 8v.01M11 12h1v5h1" /></svg>
    case "heart":     return <svg {...props} fill="currentColor" stroke="none"><path d="M12 21s-7-4.5-9.5-9.2A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 5.8C19 16.5 12 21 12 21z" /></svg>
    case "settings":  return <svg {...props}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" /></svg>
    case "mail":      return <svg {...props}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>
    case "thumbs-up": return <svg {...props}><path d="M7 11v9H4a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h3z" /><path d="M7 11l4-7c1.5 0 2.5 1 2.5 2.5V10h5.5a2 2 0 0 1 2 2.3l-1 6A2 2 0 0 1 18 20H7" /></svg>
    case "award":     return <svg {...props}><circle cx="12" cy="9" r="6" /><path d="M9 14l-2 7 5-3 5 3-2-7" /></svg>
    case "briefcase": return <svg {...props}><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /><path d="M3 12h18" /></svg>
    case "calendar":  return <svg {...props}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 9h18M8 3v4M16 3v4" /></svg>
    case "id-badge":  return <svg {...props}><rect x="4" y="4" width="16" height="16" rx="2" /><circle cx="12" cy="10" r="2.5" /><path d="M8 17c0-2 1.8-3 4-3s4 1 4 3" /></svg>
    case "coffee":    return <svg {...props}><path d="M3 8h13v6a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z" /><path d="M16 10h2a3 3 0 0 1 0 6h-2" /><path d="M7 4c0 1 1 1 1 2s-1 1-1 2M11 4c0 1 1 1 1 2s-1 1-1 2" /></svg>
    case "wallet":    return <svg {...props}><rect x="3" y="6" width="18" height="14" rx="2" /><path d="M3 10h18" /><circle cx="17" cy="15" r="1" fill="currentColor" /></svg>
    default:          return <svg {...props}><circle cx="12" cy="12" r="9" /></svg>
  }
}

export default Icon
