const fs   = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { marked } = require('marked');

const root = __dirname;

// ── helpers ────────────────────────────────────────────────────────────────

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function escape(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Bold spans in author strings → <span class="me">name</span>
function formatAuthors(str) {
  return escape(str)
    .replace(/\*\*(.+?)\*\*/g, '<span class="me">$1</span>')
    .replace(/\*/g, '<sup>*</sup>');
}

// ── bio ────────────────────────────────────────────────────────────────────

const bioRaw  = read('content/bio.md').trim();
const bioHtml = marked.parse(bioRaw)
  .replace(/<a /g, '<a target="_blank" ');

// ── publications ───────────────────────────────────────────────────────────

const PLINK_ICONS = {
  paper:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
  pdf:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
  arxiv:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 17 L12 7 L16 17"/><line x1="10" y1="13" x2="14" y2="13"/></svg>`,
  code:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
  bibtex:  `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>`,
  project: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`,
};

function plinkIcon(label) {
  return PLINK_ICONS[label.toLowerCase().replace(/[^a-z]/g, '')] || '';
}

function buildPublications(pubs) {
  return pubs.map(p => {
    const links = (p.links || []).map(l =>
      `            <a class="plink" href="${escape(l.url)}">${plinkIcon(l.label)}${escape(l.label)}</a>`
    ).join('\n');

    const thumb = p.thumb
      ? `<img class="pub-thumb" src="${escape(p.thumb)}" alt="${escape(p.title)}" loading="lazy">`
      : '';

    return `
        <div class="pub-entry">
          <div class="pub-top">
            ${thumb}
            <div class="pub-meta">
              <span class="pub-venue">${escape(p.venue)}</span>
              <div class="pub-title">${escape(p.title)}</div>
              <div class="pub-authors">${formatAuthors(p.authors)}</div>
            </div>
          </div>
          <div class="pub-tldr">${escape(p.tldr)}</div>
          <div class="pub-links">
${links}
          </div>
        </div>`;
  }).join('\n');
}

// ── experience ─────────────────────────────────────────────────────────────

function buildTimeline(entries, roleKey, orgKey) {
  return entries.map(e => {
    const chips = (e.tags || []).map(t =>
      `          <span class="tl-chip">${escape(t)}</span>`
    ).join('\n');

    const chipsHtml = chips
      ? `\n          <div class="tl-chips">\n${chips}\n          </div>`
      : '';

    const descHtml = e.bullets && e.bullets.length
      ? `<ul class="tl-bullets">${e.bullets.map(b => `<li>${escape(b)}</li>`).join('')}</ul>`
      : `<div class="tl-desc">${escape(e.description || '')}</div>`;

    const timeHtml = e.current
      ? `${escape(e.date)}<span class="live-dot"></span>`
      : escape(e.date);

    return `
        <div class="tl-entry">
          <div class="tl-time">${timeHtml}</div>
          <div class="tl-body">
            <div class="tl-role">${escape(e[roleKey])}</div>
            <div class="tl-org">${e.org_url ? `<a href="${escape(e.org_url)}" target="_blank">${escape(e[orgKey])}</a>` : escape(e[orgKey])}</div>
            ${e.advisor ? `<div class="tl-advisor">${escape(e.advisor)}</div>` : ''}
            ${descHtml}${chipsHtml}
          </div>
        </div>`;
  }).join('\n');
}

// ── service ────────────────────────────────────────────────────────────────

function buildService(rows) {
  return rows.map(r =>
    `        <span class="svc-chip"><span class="svc-venue">${escape(r.venue)}</span><span class="svc-years">${escape(r.years)}</span></span>`
  ).join('\n');
}

// ── awards ─────────────────────────────────────────────────────────────────

function buildAwards(awards) {
  return awards.map(a => {
    const desc = a.desc ? `<span class="rec-desc">${escape(a.desc)}</span>` : '';
    return `        <li class="rec-row">
          <div class="rec-main"><span class="rec-name">${escape(a.name)}</span>${desc}</div>
          <span class="rec-venue">${escape(a.venue)}</span>
        </li>`;
  }).join('\n');
}

// ── research cards ─────────────────────────────────────────────────────────

const RC_SVGS = {
  distillation: `<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <!-- Source flask (round-bottom, left) -->
    <line x1="17" y1="13" x2="31" y2="13"/>
    <line x1="20" y1="13" x2="20" y2="27"/>
    <line x1="28" y1="13" x2="28" y2="27"/>
    <circle cx="24" cy="39" r="13"/>
    <path d="M12 43 Q24 40 36 43" stroke-width="1.3" opacity="0.5"/>
    <!-- Steam above neck -->
    <path d="M21 13 Q19 9 21 5" stroke-width="1.3" opacity="0.55"/>
    <path d="M27 12 Q29 8 27 4" stroke-width="1.3" opacity="0.55"/>
    <!-- Heat marks below -->
    <line x1="15" y1="56" x2="19" y2="53" stroke-width="1.2" opacity="0.5"/>
    <line x1="24" y1="57" x2="24" y2="54" stroke-width="1.2" opacity="0.5"/>
    <line x1="33" y1="56" x2="29" y2="53" stroke-width="1.2" opacity="0.5"/>
    <!-- Still head (bent adapter) -->
    <line x1="28" y1="13" x2="37" y2="13"/>
    <line x1="37" y1="13" x2="44" y2="20"/>
    <!-- Condenser jacket (two parallel lines) -->
    <line x1="44" y1="20" x2="62" y2="37"/>
    <line x1="41" y1="24" x2="59" y2="41"/>
    <line x1="59" y1="41" x2="62" y2="37"/>
    <!-- Drop tube to collector -->
    <line x1="60.5" y1="39" x2="60.5" y2="52"/>
    <!-- Collection flask (Erlenmeyer, right) -->
    <line x1="57" y1="52" x2="64" y2="52"/>
    <path d="M57 52 Q50 61 50 68 Q50 77 61 77 Q72 77 72 68 Q72 61 64 52"/>
    <path d="M52 70 Q61 67 70 70" stroke-width="1.2" opacity="0.45"/>
    <circle cx="61" cy="55" r="1.5" fill="currentColor" stroke="none" opacity="0.55"/>
  </svg>`,
  diffing: `<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="4" y="12" width="28" height="38" rx="4"/>
    <line x1="9" y1="22" x2="27" y2="22" stroke-width="1.3" opacity="0.5"/>
    <line x1="9" y1="30" x2="27" y2="30" stroke-width="1.3" opacity="0.5"/>
    <line x1="9" y1="38" x2="23" y2="38" stroke-width="1.3" opacity="0.5"/>
    <line x1="9" y1="44" x2="27" y2="44" stroke-width="1.3" opacity="0.5"/>
    <rect x="7" y="26" width="22" height="8" fill="currentColor" stroke="none" opacity="0.2"/>
    <rect x="48" y="12" width="28" height="38" rx="4"/>
    <line x1="53" y1="22" x2="71" y2="22" stroke-width="1.3" opacity="0.5"/>
    <line x1="53" y1="30" x2="71" y2="30" stroke-width="1.3" opacity="0.5"/>
    <line x1="53" y1="38" x2="71" y2="38" stroke-width="2.5"/>
    <line x1="53" y1="44" x2="71" y2="44" stroke-width="1.3" opacity="0.5"/>
    <rect x="51" y="26" width="22" height="8" fill="currentColor" stroke="none" opacity="0.4"/>
    <line x1="34" y1="31" x2="46" y2="31" stroke-width="1.6"/>
    <path d="M37 28 L34 31 L37 34" stroke-width="1.6"/>
    <path d="M43 28 L46 31 L43 34" stroke-width="1.6"/>
    <path d="M32 70 L40 58 L48 70 Z" stroke-width="1.8"/>
  </svg>`,
  'distribution-shift': `<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-linecap="round">
    <line x1="5" y1="66" x2="75" y2="66" stroke-width="1.2" opacity="0.4"/>
    <path d="M5 66 C9 66 13 65 17 58 C21 51 23 37 26 27 C28 21 30 17 32 17 C34 17 36 21 38 27 C41 37 43 51 47 58 C51 65 55 66 59 66" stroke-width="2" stroke-dasharray="4 3" opacity="0.5"/>
    <path d="M21 66 C25 66 29 65 33 58 C37 51 39 37 42 27 C44 21 46 17 48 17 C50 17 52 21 54 27 C57 37 59 51 63 58 C67 65 71 66 75 66" stroke-width="2.2"/>
    <line x1="28" y1="11" x2="46" y2="11" stroke-width="1.8"/>
    <path d="M42 8 L46 11 L42 14" stroke-width="1.8"/>
  </svg>`,
};

function buildResearchCards(items) {
  const cards = items.map(item => {
    const svg = RC_SVGS[item.id] || '';
    return `      <div class="rc-card" data-id="${item.id}">
        <div class="rc-front">
          <div class="rc-thumb">${svg}</div>
          <div class="rc-title">${escape(item.title)}</div>
          <div class="rc-tagline">${escape(item.tagline)}</div>
          <button class="rc-toggle" aria-expanded="false">Explore →</button>
        </div>
      </div>`;
  }).join('\n');

  const panes = items.map(item => {
    const links = (item.links || []).map(l => {
      if (l.meta) {
        return `          <a class="rc-link" href="${escape(l.url)}" target="_blank"><span class="rc-link-cite">${escape(l.meta)}</span><span class="rc-link-name">${escape(l.title)}</span></a>`;
      }
      return `          <a class="rc-link" href="${escape(l.url)}" target="_blank"><span class="rc-link-cite">${escape(l.title)}</span></a>`;
    }).join('\n');
    const linksHtml = links
      ? `<div class="rc-papers"><span class="rc-label">${escape(item.links_label || 'Links')}</span>\n${links}\n        </div>`
      : '';
    return `    <div class="rc-detail-pane" data-for="${item.id}" hidden>
      <p class="rc-desc">${escape(item.body)}</p>
      ${linksHtml}
    </div>`;
  }).join('\n');

  return `<div class="rc-cards">\n${cards}\n    </div>\n    <div class="rc-detail">\n${panes}\n    </div>`;
}

// ── assemble ───────────────────────────────────────────────────────────────

const pubs      = yaml.load(read('content/publications.yaml'));
const exp       = yaml.load(read('content/experience.yaml'));
const edu       = yaml.load(read('content/education.yaml'));
const svc       = yaml.load(read('content/service.yaml'));
const awards    = yaml.load(read('content/awards.yaml'));
const research  = yaml.load(read('content/research.yaml'));

let html = read('template.html');

html = html.replace('<!-- {{BIO}} -->', bioHtml);
html = html.replace('<!-- {{PUBLICATIONS}} -->', buildPublications(pubs));
html = html.replace('<!-- {{EXPERIENCE}} -->',  buildTimeline(exp, 'role', 'org'));
html = html.replace('<!-- {{EDUCATION}} -->',   buildTimeline(edu, 'degree', 'school'));
html = html.replace('<!-- {{SERVICE}} -->',     buildService(svc));
html = html.replace('<!-- {{AWARDS}} -->',      buildAwards(awards));
html = html.replace('<!-- {{INTERESTS}} -->',   buildResearchCards(research));

fs.writeFileSync(path.join(root, 'index.html'), html);
console.log('✓ index.html generated');
