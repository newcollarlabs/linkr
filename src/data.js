/* ================================================================
   Linkr data layer — CSV parsing, categorization, indexing
================================================================ */
import Papa from 'papaparse';
import FlexSearch from 'flexsearch';

// -------- Domain / Role categorization --------
export const DOMAIN_RULES = [
  {
    key: "hr_talent",
    label: "HR & Talent",
    color: "oklch(58% 0.14 25)",
    patterns: [
      /\brecruit/i, /\btalent\b/i, /\bsourc(er|ing)\b/i, /\bheadhunt/i,
      /\bhuman resourc/i, /\bpeople (and|&) culture/i, /\bpeople partner/i,
      /\bhrbp\b/i, /\bhr\b/i, /\bstaffing\b/i, /\bpeople ops/i, /\bppl ops/i,
      /\bvp people\b/i, /\bchief people/i, /\bchro\b/i, /\borganizational develop/i,
      /\blearning (and|&) development/i, /\bl&d\b/i,
    ],
  },
  {
    key: "engineering",
    label: "Engineering & Tech",
    color: "oklch(50% 0.13 245)",
    patterns: [
      /\bengineer\b/i, /\bengineering\b/i, /\bdeveloper\b/i, /\bsoftware\b/i,
      /\bdevops\b/i, /\bsre\b/i, /\barchitect\b/i, /\bplatform\b/i,
      /\bml engineer/i, /\bmachine learning/i, /\bai engineer\b/i,
      /\binfrastructure\b/i, /\bsystems? analyst\b/i, /\bsystem analyst\b/i,
      /\bcto\b/i, /\bvp engineering\b/i, /\bqa\b/i,
      /\btest (engineer|automation)/i, /\bfull[- ]?stack\b/i, /\bfront[- ]?end\b/i,
      /\bback[- ]?end\b/i, /\bsecurity engineer/i, /\bsysadmin/i,
      /\btechnical (lead|recruiter|writer|program)/i,
      /\bsolutions? (architect|engineer)/i, /\bcybersecurity\b/i,
      /\bdba\b/i, /\bnetwork engineer/i, /\bcloud\b/i,
    ],
  },
  {
    key: "data_research",
    label: "Data & Research",
    color: "oklch(52% 0.13 220)",
    patterns: [
      /\bdata (scientist|analyst|engineer)\b/i, /\bdata science/i,
      /\banalytics\b/i, /\banalyst\b/i, /\bresearcher\b/i, /\bresearch (scientist|lead|manager)/i,
      /\bbi (developer|analyst)/i, /\bbusiness intelligence/i,
      /\bquant\b/i, /\bstatistician/i, /\beconomist/i,
    ],
  },
  {
    key: "product_design",
    label: "Product & Design",
    color: "oklch(52% 0.14 295)",
    patterns: [
      /\bproduct manager\b/i, /\bproduct lead\b/i, /\bproduct owner\b/i,
      /\bgroup product/i, /\bvp product\b/i, /\bcpo\b/i, /\bhead of product/i,
      /\bdesigner\b/i, /\bux\b/i, /\bui\b/i, /\buser experience/i,
      /\bdesign (lead|manager|director)/i, /\bproduct design/i,
      /\bbusiness systems analyst/i, /\bgraphic design/i,
      /\bcreative director/i, /\bart director/i,
    ],
  },
  {
    key: "sales",
    label: "Sales & Business Development",
    color: "oklch(58% 0.13 50)",
    patterns: [
      /\bsales\b/i, /\baccount (executive|manager)\b/i, /\bbdr\b/i, /\bsdr\b/i,
      /\bbusiness development\b/i, /\brevenue\b/i, /\bcro\b/i,
      /\bpartnerships?\b/i, /\bquota\b/i, /\benterprise sales\b/i,
    ],
  },
  {
    key: "marketing",
    label: "Marketing & Communications",
    color: "oklch(58% 0.13 75)",
    patterns: [
      /\bmarketing\b/i, /\bbrand\b/i, /\bgrowth\b/i, /\bcontent\b/i,
      /\bdemand gen/i, /\bseo\b/i, /\bcommunications?\b/i,
      /\bcmo\b/i, /\bsocial media\b/i, /\bpublic relations/i, /\bpr manager/i,
      /\bcopywriter/i, /\beditor\b/i, /\bjournalist/i,
    ],
  },
  {
    key: "customer_success",
    label: "Customer Success & Support",
    color: "oklch(56% 0.13 175)",
    patterns: [
      /\bcustomer success/i, /\bcustomer support/i, /\bsupport (engineer|manager|specialist)/i,
      /\bcustomer experience\b/i, /\bcx\b/i, /\bclient success/i, /\bcsm\b/i,
      /\bclient services?/i, /\bclient relations\b/i,
    ],
  },
  {
    key: "founders_exec",
    label: "Founders & Executives",
    color: "oklch(45% 0.14 155)",
    patterns: [
      /\bfounder\b/i, /\bco[- ]?founder\b/i, /\bceo\b/i, /\bcoo\b/i, /\bcfo\b/i,
      /\bpresident\b/i, /\bowner\b/i, /\bmanaging director\b/i,
      /\bgeneral manager\b/i, /\bmanaging partner\b/i, /\bchief executive/i,
      /\bentrepreneur/i, /\bproprietor/i,
    ],
  },
  {
    key: "consulting",
    label: "Consulting & Advisory",
    color: "oklch(50% 0.12 195)",
    patterns: [
      /\bconsultant\b/i, /\bconsulting\b/i, /\badvisor\b/i, /\badvisory\b/i,
      /\bprincipal consultant\b/i, /\bfinancial consultant/i,
      /\bfractional\b/i, /\bcoach\b/i,
    ],
  },
  {
    key: "operations",
    label: "Operations & Project Mgmt",
    color: "oklch(52% 0.10 95)",
    patterns: [
      /\boperations\b/i, /\bops\b/i, /\bsupply chain\b/i, /\blogistics\b/i,
      /\bprocurement\b/i, /\bbiz ops\b/i, /\bbusiness operations\b/i,
      /\bproject (manager|coordinator|lead)/i, /\bprogram (manager|director|lead)/i,
      /\bscrum master\b/i, /\bagile coach\b/i, /\bpmo\b/i,
    ],
  },
  {
    key: "manager",
    label: "Managers",
    color: "oklch(50% 0.11 280)",
    patterns: [
      /\bmanager\b/i, /\bmgr\b/i, /\bteam lead\b/i, /\bsupervisor\b/i,
      /\bhead of\b/i, /\bdirector\b/i,
    ],
  },
  {
    key: "analyst",
    label: "Analysts",
    color: "oklch(52% 0.12 215)",
    patterns: [
      /\banalyst\b/i, /\bbusiness analyst\b/i, /\bsystems? analyst\b/i,
      /\bfinancial analyst\b/i, /\bdata analyst\b/i, /\bresearch analyst\b/i,
    ],
  },
  {
    key: "junior",
    label: "Jr / Associates",
    color: "oklch(58% 0.10 130)",
    patterns: [
      /\bjunior\b/i, /\bjr\.?\b/i, /\bassociate\b/i, /\bintern\b/i,
      /\bgraduate\b/i, /\btrainee\b/i, /\bentry[- ]level\b/i,
      /\bcoordinator\b/i, /\bspecialist i\b/i,
    ],
  },
  {
    key: "ic",
    label: "Individual Contributors",
    color: "oklch(55% 0.08 250)",
    patterns: [],
  },
];

export const ROLE_RULES = [
  { key: "manager",   label: "Manager",              pattern: /\bmanager\b/i },
  { key: "director",  label: "Director",             pattern: /\bdirector\b/i },
  { key: "lead",      label: "Lead",                 pattern: /\blead\b/i },
  { key: "senior",    label: "Senior",               pattern: /\bsenior\b|\bsr\.?\b/i },
  { key: "principal", label: "Principal",            pattern: /\bprincipal\b/i },
  { key: "vp",        label: "VP",                   pattern: /\bvp\b|\bvice president\b/i },
  { key: "chief",     label: "C-Suite",              pattern: /\bchief\b|\bc[ept]o\b/i },
  { key: "founder",   label: "Founder",              pattern: /\bfounder\b/i },
  { key: "ic",        label: "Individual Contributor", pattern: /^.*$/i },
];

export function classifyRoles(position) {
  if (!position) return [{ key: "other", label: "Other", color: "oklch(60% 0.005 240)" }];
  const hits = [];
  for (const rule of DOMAIN_RULES) {
    if (rule.key === "ic") continue;
    if (rule.patterns.some((p) => p.test(position))) hits.push(rule);
  }
  const hasSeniorTag = hits.some((h) =>
    h.key === "manager" || h.key === "founders_exec" || h.key === "junior"
  );
  if (!hasSeniorTag) {
    const ic = DOMAIN_RULES.find((r) => r.key === "ic");
    if (ic) hits.push(ic);
  }
  if (!hits.length) hits.push({ key: "other", label: "Other", color: "oklch(60% 0.005 240)" });
  return hits;
}

export function classifyDomain(position) {
  return classifyRoles(position)[0];
}

export function classifyRole(position) {
  if (!position) return ROLE_RULES[ROLE_RULES.length - 1];
  for (const rule of ROLE_RULES.slice(0, -1)) {
    if (rule.pattern.test(position)) return rule;
  }
  return ROLE_RULES[ROLE_RULES.length - 1];
}

// -------- Skill-tag extraction --------
const SKILL_KEYWORDS = [
  "Recruiting", "Talent Acquisition", "Engineering", "Software", "Product Management",
  "UX", "Design", "Sales", "Marketing", "Finance", "Banking", "Operations",
  "Strategy", "Data", "AI", "Machine Learning", "Cloud", "Security",
  "Consulting", "Customer Success", "Growth", "Branding", "Content",
  "Analytics", "DevOps", "Architecture",
];

export function extractSkills(position) {
  if (!position) return [];
  const out = [];
  for (const k of SKILL_KEYWORDS) {
    if (new RegExp("\\b" + k.replace(/[+]/g, "\\+") + "\\b", "i").test(position)) {
      out.push(k);
    }
  }
  return out.slice(0, 3);
}

// -------- Date helpers --------
export function parseDate(str) {
  if (!str) return null;
  const m = String(str).trim().match(/^(\d{1,2}) (\w{3,}) (\d{4})$/);
  if (m) {
    const months = { Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11 };
    return new Date(parseInt(m[3]), months[m[2].slice(0,3)] || 0, parseInt(m[1]));
  }
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
}

// -------- Avatar helpers --------
export function avatarColor(name) {
  const palette = [
    "oklch(55% 0.14 250)", "oklch(55% 0.14 25)", "oklch(55% 0.14 145)",
    "oklch(55% 0.14 75)", "oklch(55% 0.14 295)", "oklch(55% 0.14 195)",
    "oklch(55% 0.14 350)", "oklch(55% 0.14 105)", "oklch(50% 0.14 220)",
  ];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return palette[h % palette.length];
}

export function initials(first, last) {
  const f = (first || "").trim();
  const l = (last || "").trim();
  return ((f ? f[0] : "") + (l ? l[0] : "")).toUpperCase() || "·";
}

// -------- CSV parsing --------
export function parseCSV(input) {
  return new Promise((resolve, reject) => {
    const config = {
      header: true,
      skipEmptyLines: true,
      complete: (res) => resolve(res.data),
      error: (e) => reject(e),
    };
    if (typeof input !== "string") {
      Papa.parse(input, config);
      return;
    }
    // Strip LinkedIn preamble before the real header row
    const lines = input.split(/\r?\n/);
    const headerIdx = lines.findIndex((l) => /^(First Name|Endorsement Date)/i.test(l));
    const text = headerIdx > 0 ? lines.slice(headerIdx).join("\n") : input;
    Papa.parse(text, config);
  });
}

// -------- Build master record set --------
export function buildRecords({ connections, endorsements, recommendations }) {
  const endorsersByUrl = new Map();
  const endorsementsByUrl = new Map();
  (endorsements || []).forEach((e) => {
    const url = (e["Endorser Public Url"] || "").toLowerCase()
      .replace(/^https?:\/\//, "").replace(/^www\./, "");
    if (!url) return;
    endorsersByUrl.set(url, true);
    if (!endorsementsByUrl.has(url)) endorsementsByUrl.set(url, []);
    endorsementsByUrl.get(url).push({ skill: e["Skill Name"], date: e["Endorsement Date"] });
  });

  const recommendersByName = new Map();
  (recommendations || []).forEach((r) => {
    const key = ((r["First Name"] || "") + "|" + (r["Last Name"] || "")).toLowerCase().trim();
    recommendersByName.set(key, { text: r["Text"], date: r["Creation Date"] });
  });

  return (connections || []).map((c, idx) => {
    const first = (c["First Name"] || "").trim();
    const last  = (c["Last Name"]  || "").trim();
    const url   = (c["URL"]        || "").trim();
    const urlNorm = url.toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "");
    const company  = (c["Company"]  || "").trim();
    const position = (c["Position"] || "").trim();
    const connectedOn = c["Connected On"] || "";
    const date = parseDate(connectedOn);
    const roleTags = classifyRoles(position);
    const primary  = roleTags[0];
    const role     = classifyRole(position);
    const nameKey  = (first + "|" + last).toLowerCase().trim();

    return {
      id: idx + 1,
      firstName: first, lastName: last,
      fullName: (first + " " + last).trim(),
      url, urlNorm,
      email: c["Email Address"] || "",
      company, position,
      connectedOn,
      connectedDate: date,
      connectedYear: date ? date.getFullYear() : null,
      domain: primary.key, domainLabel: primary.label, domainColor: primary.color,
      roles: roleTags.map((t) => t.key),
      roleTags: roleTags.map((t) => ({ key: t.key, label: t.label, color: t.color })),
      role: role.key, roleLabel: role.label,
      skills: extractSkills(position),
      endorsed: endorsersByUrl.has(urlNorm),
      endorsedDetails: endorsementsByUrl.get(urlNorm) || [],
      recommended: recommendersByName.has(nameKey),
      recommendedDetail: recommendersByName.get(nameKey) || null,
      avatar: { initials: initials(first, last), color: avatarColor(first + last) },
    };
  });
}

// -------- Build FlexSearch index --------
export function buildIndex(records) {
  const index = new FlexSearch.Document({
    tokenize: "forward",
    cache: true,
    document: {
      id: "id",
      index: ["fullName", "company", "position", "domainLabel"],
      store: false,
    },
  });
  records.forEach((r) => index.add(r));
  return index;
}

// -------- Aggregations --------
export function aggregate(records) {
  const byDomain = {}, byCompany = {}, byYear = {}, byRole = {}, byMonth = {};

  records.forEach((r) => {
    (r.roleTags || [{ key: r.domain, label: r.domainLabel }]).forEach((rt) => {
      byDomain[rt.label] = (byDomain[rt.label] || 0) + 1;
    });
    if (r.company) byCompany[r.company] = (byCompany[r.company] || 0) + 1;
    if (r.connectedYear) byYear[r.connectedYear] = (byYear[r.connectedYear] || 0) + 1;
    byRole[r.roleLabel] = (byRole[r.roleLabel] || 0) + 1;
    if (r.connectedDate) {
      const k = r.connectedDate.getFullYear() + "-" +
        String(r.connectedDate.getMonth() + 1).padStart(2, "0");
      byMonth[k] = (byMonth[k] || 0) + 1;
    }
  });

  const sortDesc = (obj) => Object.entries(obj).sort((a, b) => b[1] - a[1]);

  return {
    total: records.length,
    withEmail: records.filter((r) => r.email).length,
    endorsed: records.filter((r) => r.endorsed).length,
    recommended: records.filter((r) => r.recommended).length,
    byDomain: sortDesc(byDomain),
    byCompany: sortDesc(byCompany),
    byRole: sortDesc(byRole),
    byYear: Object.entries(byYear).sort((a, b) => Number(a[0]) - Number(b[0])),
    byMonth: Object.entries(byMonth).sort((a, b) => a[0].localeCompare(b[0])),
  };
}

// -------- NL query parser --------
export function parseNLQuery(q, records) {
  const filters = [];
  const lower = q.toLowerCase();

  const domainHits = [];
  DOMAIN_RULES.forEach((d) => {
    const aliases = [d.label.toLowerCase(), d.key.replace(/_/g, " ")];
    if (aliases.some((a) => lower.includes(a))) domainHits.push(d.key);
  });
  if (/\b(engineer|engineering|developer|software|tech)\b/.test(lower) && !domainHits.includes("engineering")) domainHits.push("engineering");
  if (/\b(recruit|hr|talent)\b/.test(lower) && !domainHits.includes("hr_talent")) domainHits.push("hr_talent");
  if (/\b(product|design|ux|ui)\b/.test(lower) && !domainHits.includes("product_design")) domainHits.push("product_design");
  if (/\b(sales|business development)\b/.test(lower) && !domainHits.includes("sales")) domainHits.push("sales");
  if (/\b(marketing|growth|brand|communications?)\b/.test(lower) && !domainHits.includes("marketing")) domainHits.push("marketing");
  if (/\b(operations|ops|supply chain|project manager|program manager)\b/.test(lower) && !domainHits.includes("operations")) domainHits.push("operations");
  if (/\b(analyst|analysts)\b/.test(lower) && !domainHits.includes("analyst")) domainHits.push("analyst");
  if (/\b(junior|jr\.?|associate|intern|entry[- ]level|graduate)\b/.test(lower) && !domainHits.includes("junior")) domainHits.push("junior");
  if (/\bindividual contributor|\bic\b/.test(lower) && !domainHits.includes("ic")) domainHits.push("ic");
  if (/\bmanagers?\b/.test(lower) && !domainHits.includes("manager")) domainHits.push("manager");
  if (/\b(customer success|support|cx)\b/.test(lower) && !domainHits.includes("customer_success")) domainHits.push("customer_success");
  if (/\b(data|analytics|research)\b/.test(lower) && !domainHits.includes("data_research")) domainHits.push("data_research");
  if (/\b(founder|ceo|cto|cfo|coo|president|exec)\b/.test(lower) && !domainHits.includes("founders_exec")) domainHits.push("founders_exec");
  if (/\b(consult|advis)/.test(lower) && !domainHits.includes("consulting")) domainHits.push("consulting");

  const roleHits = [];
  if (/\b(lead|leads)\b/.test(lower)) roleHits.push("lead");
  if (/\b(director|directors)\b/.test(lower)) roleHits.push("director");
  if (/\b(manager|managers)\b/.test(lower)) roleHits.push("manager");
  if (/\b(senior|sr\.?)\b/.test(lower)) roleHits.push("senior");
  if (/\b(vp|vice president)\b/.test(lower)) roleHits.push("vp");
  if (/\b(founder|ceo|chief)\b/.test(lower)) roleHits.push("founder", "chief");
  if (/\b(principal)\b/.test(lower)) roleHits.push("principal");

  const yearMatch = lower.match(/\b(20\d{2})\b/);
  const now = new Date();
  let yearFilter = yearMatch ? Number(yearMatch[1]) : null;
  if (/\bthis year\b/.test(lower)) yearFilter = now.getFullYear();
  if (/\blast year\b/.test(lower)) yearFilter = now.getFullYear() - 1;

  const onlyEndorsed    = /\bendorse/.test(lower);
  const onlyRecommended = /\brecommend/.test(lower);
  const companyMatch = q.match(/\b(?:at|from|in)\s+([A-Z][\w&. ]+?)(?:[,.?]|$)/);
  const companyHint  = companyMatch ? companyMatch[1].trim() : null;

  domainHits.forEach((d) => {
    const rule = DOMAIN_RULES.find((r) => r.key === d);
    if (rule) filters.push({ kind: "domain", value: d, label: rule.label });
  });
  roleHits.forEach((r) => {
    const rule = ROLE_RULES.find((rr) => rr.key === r);
    if (rule) filters.push({ kind: "role", value: r, label: rule.label });
  });
  if (yearFilter)       filters.push({ kind: "year",        value: yearFilter,  label: "Connected " + yearFilter });
  if (onlyEndorsed)     filters.push({ kind: "endorsed",    value: true,        label: "Endorsed me" });
  if (onlyRecommended)  filters.push({ kind: "recommended", value: true,        label: "Recommended me" });
  if (companyHint)      filters.push({ kind: "company",     value: companyHint, label: "Company: " + companyHint });

  const results = records.filter((r) => {
    if (domainHits.length && !(r.roles || [r.domain]).some((rk) => domainHits.includes(rk))) return false;
    if (roleHits.length   && !roleHits.includes(r.role)) return false;
    if (yearFilter        && r.connectedYear !== yearFilter) return false;
    if (onlyEndorsed      && !r.endorsed) return false;
    if (onlyRecommended   && !r.recommended) return false;
    if (companyHint       && !r.company.toLowerCase().includes(companyHint.toLowerCase())) return false;
    return true;
  });

  return { filters, results, query: q };
}

// -------- Persistent annotations --------
const ANN_KEY = "linkr_annotations_v1";

export function loadAnnotations() {
  try { return JSON.parse(localStorage.getItem(ANN_KEY) || "{}"); }
  catch { return {}; }
}

export function saveAnnotations(ann) {
  localStorage.setItem(ANN_KEY, JSON.stringify(ann));
}

export function getAnnotation(ann, record) {
  return ann[record.urlNorm] || ann[String(record.id)] || { tags: [], note: "" };
}

export function setAnnotation(ann, record, value) {
  const key = record.urlNorm || String(record.id);
  ann[key] = value;
  saveAnnotations(ann);
}

// Alias kept for compatibility
export const ROLE_TAG_RULES = DOMAIN_RULES;
