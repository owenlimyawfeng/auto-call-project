// GollyCRM — Shell, icons, primitives shared across all screens
// Loaded as Babel script; exposes everything on window.

const { useState, useEffect, useRef, useMemo, Fragment } = React;

// ───────────────────────── Icon library ─────────────────────────
// Lucide-style 24px paths. stroke 1.75 by default — fits CRM density.
const CRM_ICONS = {
  // Navigation
  dashboard: '<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>',
  inbox: '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11Z"/>',
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z"/>',
  phoneIn: '<polyline points="16 2 16 8 22 8"/><line x1="22" y1="2" x2="16" y2="8"/><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z"/>',
  phoneOut: '<polyline points="22 8 22 2 16 2"/><line x1="16" y1="8" x2="22" y2="2"/><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z"/>',
  phoneMissed: '<line x1="22" y1="2" x2="16" y2="8"/><line x1="16" y1="2" x2="22" y2="8"/><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z"/>',
  phoneOff: '<path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 5 13.4"/><path d="M22 2 2 22"/><path d="M2 2v3a2 2 0 0 0 2 2h3"/>',
  voicemail: '<circle cx="6" cy="12" r="4"/><circle cx="18" cy="12" r="4"/><line x1="6" y1="16" x2="18" y2="16"/>',
  bot: '<rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/>',
  campaign: '<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
  template: '<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/>',
  list: '<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>',
  bar: '<line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/><line x1="3" y1="20" x2="21" y2="20"/>',
  users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  ticket: '<path d="M3 7v2a3 3 0 1 1 0 6v2c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-2a3 3 0 1 1 0-6V7c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2Z"/><line x1="13" y1="5" x2="13" y2="7"/><line x1="13" y1="11" x2="13" y2="13"/><line x1="13" y1="17" x2="13" y2="19"/>',
  car: '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>',
  // Actions / chrome
  search: '<circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  help: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  minus: '<line x1="5" y1="12" x2="19" y2="12"/>',
  x: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
  check: '<polyline points="20 6 9 17 4 12"/>',
  filter: '<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
  more: '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
  moreV: '<circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>',
  chevR: '<polyline points="9 18 15 12 9 6"/>',
  chevL: '<polyline points="15 18 9 12 15 6"/>',
  chevD: '<polyline points="6 9 12 15 18 9"/>',
  chevU: '<polyline points="18 15 12 9 6 15"/>',
  arrowR: '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
  arrowL: '<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 19"/>',
  edit: '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5Z"/>',
  copy: '<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  trash: '<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z"/>',
  cal: '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  // Call controls
  mic: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/>',
  micOff: '<line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"/><line x1="12" y1="19" x2="12" y2="22"/>',
  pause: '<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>',
  play: '<polygon points="5 3 19 12 5 21 5 3"/>',
  transfer: '<polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>',
  record: '<circle cx="12" cy="12" r="6"/>',
  endCall: '<path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 5 13.4"/><path d="M22 2 2 22"/>',
  keypad: '<circle cx="6" cy="6" r="1"/><circle cx="12" cy="6" r="1"/><circle cx="18" cy="6" r="1"/><circle cx="6" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="18" cy="12" r="1"/><circle cx="6" cy="18" r="1"/><circle cx="12" cy="18" r="1"/><circle cx="18" cy="18" r="1"/>',
  speaker: '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>',
  volume: '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>',
  // Status & feel
  smile: '<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>',
  meh: '<circle cx="12" cy="12" r="10"/><line x1="8" y1="15" x2="16" y2="15"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>',
  frown: '<circle cx="12" cy="12" r="10"/><path d="M16 16s-1.5-2-4-2-4 2-4 2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>',
  zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  alert: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
  info: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
  // Misc
  book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/>',
  mail: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2Z"/><polyline points="22 6 12 13 2 6"/>',
  star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  sparkle: '<path d="m12 3-1.9 5.8L4 10.7l5.8 1.9L12 18l1.9-5.4 5.8-1.9-5.8-1.9Z"/>',
  flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  trend: '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>',
  trendD: '<polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/>',
  mic2: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/>',
  send: '<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>',
  paperclip: '<path d="M21.44 11.05 12.25 20.24a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 17.99 8.83l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/>',
  globe: '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  fork: '<circle cx="6" cy="3" r="2"/><circle cx="6" cy="21" r="2"/><circle cx="18" cy="12" r="2"/><path d="M6 5v6a4 4 0 0 0 4 4h2a4 4 0 0 0 4-4V10"/>',
  refresh: '<polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>',
  pause2: '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  doc: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>',
  folder: '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>',
  layers: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
  branch: '<line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/>',
  message: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  loader: '<line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>',
  signal: '<path d="M2 20h.01"/><path d="M7 20v-4"/><path d="M12 20v-8"/><path d="M17 20V8"/><path d="M22 4v16"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  bookmark: '<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>',
  briefcase: '<rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
};

function CrmIcon({ name, size = 18, strokeWidth = 1.75, style, className, ...rest }) {
  const path = CRM_ICONS[name] || '';
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink: 0, ...style }} className={className} {...rest}
      dangerouslySetInnerHTML={{ __html: path }} />
  );
}

// ───────────────────────── Avatar ─────────────────────────
const AVATAR_COLORS = [
  ['#FFE4D2', '#B45309'],
  ['#DCFCE7', '#166534'],
  ['#DBEAFE', '#1D4ED8'],
  ['#FCE7F3', '#9D174D'],
  ['#EDE9FE', '#5B21B6'],
  ['#FEF3C7', '#92400E'],
  ['#CFFAFE', '#155E75'],
  ['#FEE2E2', '#991B1B'],
];
function avatarColor(name) {
  let h = 0;
  for (let i = 0; i < (name || '').length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}
function initials(name) {
  return (name || '?').split(/\s+/).slice(0, 2).map(p => p[0]).join('').toUpperCase();
}
function CrmAvatar({ name, size = 32, status, ring }) {
  const [bg, fg] = avatarColor(name);
  return (
    <span style={{ position: 'relative', display: 'inline-block', flexShrink: 0 }}>
      <span style={{
        width: size, height: size, borderRadius: '50%',
        background: bg, color: fg, fontWeight: 700,
        fontSize: Math.max(10, size * 0.38),
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: ring ? '0 0 0 2px #fff, 0 0 0 4px ' + ring : 'none',
      }}>{initials(name)}</span>
      {status && (
        <span style={{
          position: 'absolute', right: -1, bottom: -1,
          width: Math.max(8, size * 0.32), height: Math.max(8, size * 0.32),
          borderRadius: '50%', border: '2px solid #fff',
          background: status === 'online' ? '#22C55E' : status === 'busy' ? '#D8443C' : status === 'away' ? '#E0A100' : '#9A999C',
        }} />
      )}
    </span>
  );
}

// ───────────────────────── Button ─────────────────────────
function CrmButton({ variant = 'primary', size = 'md', icon, iconRight, children, onClick, full, style, disabled, type, danger }) {
  const sizes = {
    sm: { h: 30, px: 10, fs: 12, gap: 6, ig: 14 },
    md: { h: 36, px: 14, fs: 13, gap: 8, ig: 16 },
    lg: { h: 44, px: 20, fs: 14, gap: 10, ig: 18 },
  }[size];
  const base = {
    height: sizes.h, padding: icon || iconRight ? `0 ${sizes.px}px` : `0 ${sizes.px + 2}px`,
    fontSize: sizes.fs, fontWeight: 600, fontFamily: 'inherit',
    borderRadius: 8, border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: sizes.gap,
    transition: 'transform .12s ease, background .15s ease, color .15s ease, box-shadow .15s ease',
    width: full ? '100%' : 'auto', whiteSpace: 'nowrap',
  };
  let v = {};
  if (danger) {
    v = { background: '#D8443C', color: '#fff' };
  } else {
    v = ({
      primary: { background: 'var(--crm-navy)', color: '#fff' },
      green:   { background: 'var(--crm-green)', color: '#fff', boxShadow: '0 4px 12px rgba(9,167,126,.22)' },
      secondary: { background: '#fff', color: 'var(--crm-fg-1)', border: '1px solid var(--crm-border-2)' },
      ghost: { background: 'transparent', color: 'var(--crm-fg-1)' },
      ghostNavy: { background: 'transparent', color: 'var(--crm-navy-fg)' },
      dim: { background: '#F1F3F5', color: 'var(--crm-fg-1)' },
    })[variant];
  }
  if (disabled) v = { background: '#EBEBED', color: '#9A999C' };
  if (variant === 'secondary' || (v && v.border)) {
    base.height = sizes.h - 2;
  }
  return (
    <button type={type || 'button'} onClick={disabled ? undefined : onClick}
      onMouseDown={e => !disabled && (e.currentTarget.style.transform = 'scale(0.97)')}
      onMouseUp={e => (e.currentTarget.style.transform = '')}
      onMouseLeave={e => (e.currentTarget.style.transform = '')}
      style={{ ...base, ...v, ...style }}>
      {icon && <CrmIcon name={icon} size={sizes.ig} />}
      {children}
      {iconRight && <CrmIcon name={iconRight} size={sizes.ig} />}
    </button>
  );
}

// ───────────────────────── Chip / Badge ─────────────────────────
function CrmChip({ active, children, onClick, count, size = 'md' }) {
  const h = size === 'sm' ? 28 : 32;
  return (
    <button onClick={onClick} style={{
      height: h, padding: '0 12px', display: 'inline-flex', alignItems: 'center', gap: 6,
      background: active ? 'var(--crm-navy)' : '#fff',
      color: active ? '#fff' : 'var(--crm-fg-1)',
      border: active ? 'none' : '1px solid var(--crm-border-2)',
      borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer',
      whiteSpace: 'nowrap',
    }}>
      <span>{children}</span>
      {count != null && (
        <span style={{
          padding: '1px 6px', borderRadius: 999, fontSize: 11, fontWeight: 700,
          background: active ? 'rgba(255,255,255,.2)' : 'var(--crm-bg)',
          color: active ? '#fff' : 'var(--crm-fg-2)',
        }}>{count}</span>
      )}
    </button>
  );
}

const STATUS_PALETTE = {
  completed: { bg: '#DCFCE7', fg: '#166534' },
  active:    { bg: '#DCFCE7', fg: '#166534' },
  live:      { bg: '#FEE2E2', fg: '#991B1B' },
  draft:     { bg: '#F1F3F5', fg: '#5C6573' },
  scheduled: { bg: '#E5EEFF', fg: '#1D4ED8' },
  running:   { bg: '#E5EEFF', fg: '#1D4ED8' },
  paused:    { bg: '#FFF6DD', fg: '#92400E' },
  pending:   { bg: '#FFF6DD', fg: '#92400E' },
  missed:    { bg: '#FDECEB', fg: '#991B1B' },
  failed:    { bg: '#FDECEB', fg: '#991B1B' },
  inbound:   { bg: '#EFEBFC', fg: '#5B21B6' },
  outbound:  { bg: '#DCF0F5', fg: '#155E75' },
  bot:       { bg: '#DCFCE7', fg: '#166534' },
  unassigned:{ bg: '#FFF6DD', fg: '#92400E' },
  solving:   { bg: '#DCFCE7', fg: '#166534' },
};
function CrmBadge({ tone = 'draft', children, dot, style, size = 'md' }) {
  const p = STATUS_PALETTE[tone] || { bg: '#F1F3F5', fg: '#5C6573' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: size === 'sm' ? '2px 8px' : '3px 10px',
      background: p.bg, color: p.fg,
      borderRadius: size === 'sm' ? 4 : 6,
      fontSize: size === 'sm' ? 10 : 11, fontWeight: 700,
      letterSpacing: '0.02em',
      textTransform: tone === 'inbound' || tone === 'outbound' ? 'uppercase' : 'none',
      ...style,
    }}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: 999, background: p.fg }} />}
      {children}
    </span>
  );
}

// ───────────────────────── Sidebar / Topbar ─────────────────────────
const NAV_SECTIONS = [
  {
    label: 'Immediate Attention',
    badge: 53,
    items: [],
  },
  {
    label: 'Customer Service & Support',
    open: false,
    items: [
      { id: 'inbox',  icon: 'inbox',  label: 'Team Inbox', count: 998 },
      { id: 'open',   icon: 'star',   label: 'My Open' },
      { id: 'unassigned', icon: 'flag', label: 'Unassigned', count: 35 },
      { id: 'tickets', icon: 'ticket', label: 'Tickets', count: 121 },
    ],
  },
  {
    label: 'Call Center',
    open: true,
    items: [
      { id: 'queue',     icon: 'phoneIn',  label: 'Queue & Live',  count: 7, live: true },
      { id: 'workspace', icon: 'phone',    label: 'Agent Workspace' },
      { id: 'logs',      icon: 'list',     label: 'Call Logs', count: 1284 },
      { id: 'campaigns', icon: 'campaign', label: 'Auto Call Campaigns' },
      { id: 'bots',       icon: 'bot',      label: 'Caller Bots' },
      { id: 'botInsight', icon: 'trend',    label: 'Insight' },
      { id: 'reports',    icon: 'bar',      label: 'Reports & Analytics' },
    ],
  },
  {
    label: 'Lead Management',
    open: false,
    items: [],
  },
  {
    label: 'AI Agents',
    open: false,
    items: [],
  },
];

function CrmSidebar({ active, onNav, collapsed }) {
  const w = collapsed ? 64 : 248;
  return (
    <aside className="crm-scroll-dark" style={{
      width: w, background: 'var(--crm-navy)', color: 'var(--crm-navy-fg)',
      display: 'flex', flexDirection: 'column', flexShrink: 0,
      borderRight: '1px solid var(--crm-navy-line)',
      overflowY: 'auto',
      transition: 'width .18s ease',
    }}>
      {/* Brand */}
      <div style={{
        height: 56, display: 'flex', alignItems: 'center', gap: 8,
        padding: '0 16px', borderBottom: '1px solid var(--crm-navy-line)',
        flexShrink: 0,
      }}>
        <span style={{
          width: 28, height: 28, borderRadius: 7,
          background: 'var(--crm-green)', display: 'inline-flex',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <CrmIcon name="phone" size={16} style={{ color: '#fff' }} strokeWidth={2.4} />
        </span>
        {!collapsed && (
          <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.01em', color: '#fff' }}>
            Golly<span style={{ color: 'var(--crm-green)' }}>CRM</span>
          </span>
        )}
      </div>

      {NAV_SECTIONS.map((sec, i) => (
        <div key={i} style={{ padding: '10px 8px 6px', borderBottom: '1px solid var(--crm-navy-line)' }}>
          {!collapsed && (
            <div style={{
              padding: '6px 10px 8px', display: 'flex',
              alignItems: 'center', justifyContent: 'space-between',
              fontSize: 11, fontWeight: 700, letterSpacing: '0.06em',
              textTransform: 'uppercase', color: 'var(--crm-navy-fg-2)',
            }}>
              <span>{sec.label}</span>
              {sec.badge ? (
                <span style={{
                  padding: '1px 7px', background: 'var(--crm-green)',
                  color: '#fff', borderRadius: 999, fontSize: 10,
                }}>{sec.badge}</span>
              ) : sec.items.length === 0 ? <CrmIcon name="plus" size={12} /> : <CrmIcon name="minus" size={12} />}
            </div>
          )}
          {sec.items.map(item => {
            const isActive = active === item.id;
            const isSub = !!item.sub;
            return (
              <button key={item.id} onClick={() => onNav && onNav(item.id)} style={{
                width: '100%', height: isSub ? 32 : 38,
                padding: collapsed ? '0' : isSub ? '0 10px 0 36px' : '0 10px',
                display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between',
                gap: 10, background: isActive ? 'var(--crm-green)' : 'transparent',
                color: isActive ? '#fff' : isSub ? 'var(--crm-navy-fg-2)' : 'var(--crm-navy-fg)',
                border: 'none', borderRadius: 8, cursor: 'pointer',
                fontSize: isSub ? 12 : 13, fontWeight: isActive ? 700 : isSub ? 500 : 500, fontFamily: 'inherit',
                marginBottom: 2, position: 'relative',
              }}
              onMouseEnter={e => !isActive && (e.currentTarget.style.background = 'var(--crm-navy-3)')}
              onMouseLeave={e => !isActive && (e.currentTarget.style.background = 'transparent')}>
                <span style={{ display: 'flex', alignItems: 'center', gap: isSub ? 7 : 10, minWidth: 0 }}>
                  {isSub && !collapsed && (
                    <span style={{ width: 1, height: 14, background: 'var(--crm-navy-line)', flexShrink: 0, marginRight: 2 }} />
                  )}
                  <CrmIcon name={item.icon} size={isSub ? 14 : 17} />
                  {!collapsed && <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</span>}
                </span>
                {!collapsed && (item.live ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span className="crm-blink" style={{ width: 6, height: 6, borderRadius: 999, background: isActive ? '#fff' : '#22C55E' }} />
                    <span style={{
                      padding: '1px 7px', borderRadius: 999, fontSize: 10, fontWeight: 700,
                      background: isActive ? 'rgba(255,255,255,.2)' : 'var(--crm-navy-3)',
                      color: isActive ? '#fff' : '#fff',
                    }}>{item.count}</span>
                  </span>
                ) : item.count != null ? (
                  <span style={{
                    padding: '1px 7px', borderRadius: 999, fontSize: 10, fontWeight: 700,
                    background: isActive ? 'rgba(255,255,255,.22)' : 'var(--crm-navy-3)',
                    color: '#fff',
                  }}>{item.count > 999 ? '999+' : item.count}</span>
                ) : null)}
              </button>
            );
          })}
        </div>
      ))}
      <div style={{ flex: 1 }} />
    </aside>
  );
}

function CrmTopBar({ title, breadcrumbs, right, agentStatus = 'online', onStatusChange }) {
  const statusMap = {
    online: { bg: '#22C55E', label: 'Available' },
    busy:   { bg: '#D8443C', label: 'On a call' },
    away:   { bg: '#E0A100', label: 'Away' },
    offline:{ bg: '#9A999C', label: 'Offline' },
  };
  const s = statusMap[agentStatus];
  return (
    <header style={{
      height: 56, background: 'var(--crm-navy)', color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 20px', flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
        {breadcrumbs ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--crm-navy-fg-2)' }}>
            {breadcrumbs.map((c, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                {i > 0 && <CrmIcon name="chevR" size={13} />}
                <span style={{ color: i === breadcrumbs.length - 1 ? '#fff' : 'var(--crm-navy-fg-2)', fontWeight: i === breadcrumbs.length - 1 ? 600 : 400 }}>{c}</span>
              </span>
            ))}
          </div>
        ) : (
          <span style={{ fontSize: 14, fontWeight: 600 }}>{title}</span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Search */}
        <div style={{
          height: 34, display: 'flex', alignItems: 'center', gap: 8,
          padding: '0 12px', background: 'var(--crm-navy-3)',
          borderRadius: 8, color: 'var(--crm-navy-fg-2)', fontSize: 13,
          minWidth: 240,
        }}>
          <CrmIcon name="search" size={15} />
          <span>Search calls, contacts, campaigns…</span>
          <span style={{ marginLeft: 'auto', padding: '1px 6px', background: 'var(--crm-navy-4)', borderRadius: 4, fontSize: 11, fontWeight: 600 }}>⌘K</span>
        </div>

        {right}

        <button style={iconBtn}><CrmIcon name="bell" size={17} />
          <span style={{ position: 'absolute', top: 4, right: 4, width: 7, height: 7, borderRadius: 999, background: 'var(--crm-green)' }} />
        </button>
        <button style={iconBtn}><CrmIcon name="help" size={17} /></button>

        {/* Agent status */}
        <button onClick={onStatusChange} style={{
          height: 34, padding: '0 10px 0 8px', display: 'flex', alignItems: 'center', gap: 8,
          background: 'var(--crm-navy-3)', border: 'none', borderRadius: 8,
          color: '#fff', fontFamily: 'inherit', fontSize: 12, fontWeight: 600, cursor: 'pointer',
        }}>
          <CrmAvatar name="Sai Chang Choo" size={24} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.1 }}>
            <span style={{ fontSize: 12, fontWeight: 700 }}>Sai Chang Choo</span>
            <span style={{ fontSize: 10, color: 'var(--crm-navy-fg-2)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: s.bg }} />
              {s.label}
            </span>
          </div>
          <CrmIcon name="chevD" size={13} style={{ color: 'var(--crm-navy-fg-2)' }} />
        </button>
      </div>
    </header>
  );
}

const iconBtn = {
  width: 34, height: 34, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  background: 'var(--crm-navy-3)', border: 'none', borderRadius: 8,
  color: '#fff', cursor: 'pointer', position: 'relative',
};

// ───────────────────────── Page chrome ─────────────────────────
function CrmAppShell({ active, onNav, breadcrumbs, title, topRight, children, agentStatus, onStatusChange }) {
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--crm-bg)' }}>
      <CrmTopBar breadcrumbs={breadcrumbs} title={title} right={topRight} agentStatus={agentStatus} onStatusChange={onStatusChange} />
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <CrmSidebar active={active} onNav={onNav} />
        <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>{children}</main>
      </div>
    </div>
  );
}

function CrmPageHeader({ title, subtitle, breadcrumbs, right, tabs, activeTab, onTab }) {
  return (
    <div style={{
      padding: '16px 24px 0', background: '#fff',
      borderBottom: '1px solid var(--crm-border)', flexShrink: 0,
    }}>
      {breadcrumbs && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--crm-fg-2)', marginBottom: 8 }}>
          {breadcrumbs.map((c, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              {i > 0 && <CrmIcon name="chevR" size={12} />}
              <span style={{ color: i === breadcrumbs.length - 1 ? 'var(--crm-fg-1)' : 'var(--crm-fg-2)', fontWeight: i === breadcrumbs.length - 1 ? 600 : 500 }}>{c}</span>
            </span>
          ))}
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: tabs ? 16 : 18 }}>
        <div>
          <h1 style={{
            margin: 0, fontSize: 22, fontWeight: 800, letterSpacing: '-0.01em',
            color: 'var(--crm-fg-1)',
          }}>{title}</h1>
          {subtitle && <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--crm-fg-2)' }}>{subtitle}</p>}
        </div>
        {right && <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>{right}</div>}
      </div>
      {tabs && (
        <div style={{ display: 'flex', gap: 4, marginTop: -4 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => onTab && onTab(t.id)} style={{
              padding: '10px 14px', background: 'transparent', border: 'none', cursor: 'pointer',
              fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
              color: activeTab === t.id ? 'var(--crm-fg-1)' : 'var(--crm-fg-2)',
              borderBottom: activeTab === t.id ? '2px solid var(--crm-green)' : '2px solid transparent',
              marginBottom: -1, display: 'inline-flex', alignItems: 'center', gap: 6,
            }}>
              {t.label}
              {t.count != null && (
                <span style={{
                  padding: '1px 7px', borderRadius: 999, fontSize: 10, fontWeight: 700,
                  background: activeTab === t.id ? 'var(--crm-green)' : 'var(--crm-bg)',
                  color: activeTab === t.id ? '#fff' : 'var(--crm-fg-2)',
                }}>{t.count}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ───────────────────────── Card ─────────────────────────
function CrmCard({ children, style, padding = 16, title, right, footer }) {
  return (
    <div style={{
      background: '#fff', border: '1px solid var(--crm-border)',
      borderRadius: 12, boxShadow: 'var(--crm-shadow-sm)',
      ...style,
    }}>
      {title && (
        <div style={{
          padding: '12px 16px', borderBottom: '1px solid var(--crm-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--crm-fg-1)' }}>{title}</div>
          {right}
        </div>
      )}
      <div style={{ padding }}>{children}</div>
      {footer && (
        <div style={{ padding: '10px 16px', borderTop: '1px solid var(--crm-border)' }}>{footer}</div>
      )}
    </div>
  );
}

// ───────────────────────── Input / Select / Textarea ─────────────────────────
function CrmInput({ label, value, onChange, placeholder, icon, type, hint, error, required, style }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6, ...style }}>
      {label && (
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--crm-fg-1)' }}>
          {label}{required && <span style={{ color: 'var(--crm-danger)' }}> *</span>}
        </span>
      )}
      <div style={{
        height: 38, padding: '0 12px', display: 'flex', alignItems: 'center', gap: 8,
        background: '#fff', border: `1px solid ${error ? 'var(--crm-danger)' : 'var(--crm-border-2)'}`,
        borderRadius: 8,
      }}>
        {icon && <CrmIcon name={icon} size={15} style={{ color: 'var(--crm-fg-3)' }} />}
        <input type={type || 'text'} value={value || ''} placeholder={placeholder}
          onChange={e => onChange && onChange(e.target.value)} style={{
            flex: 1, border: 'none', outline: 'none', background: 'transparent',
            fontSize: 13, fontFamily: 'inherit', color: 'var(--crm-fg-1)',
          }} />
      </div>
      {hint && !error && <span style={{ fontSize: 11, color: 'var(--crm-fg-3)' }}>{hint}</span>}
      {error && <span style={{ fontSize: 11, color: 'var(--crm-danger)' }}>{error}</span>}
    </label>
  );
}

function CrmSelect({ label, value, onChange, options, hint, style }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6, ...style }}>
      {label && <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--crm-fg-1)' }}>{label}</span>}
      <div style={{
        height: 38, padding: '0 12px', display: 'flex', alignItems: 'center', gap: 8,
        background: '#fff', border: '1px solid var(--crm-border-2)', borderRadius: 8,
        position: 'relative', cursor: 'pointer',
      }}>
        <select value={value || ''} onChange={e => onChange && onChange(e.target.value)} style={{
          flex: 1, border: 'none', outline: 'none', background: 'transparent',
          fontSize: 13, fontFamily: 'inherit', color: 'var(--crm-fg-1)', appearance: 'none',
          cursor: 'pointer',
        }}>
          {options.map(o => typeof o === 'string'
            ? <option key={o} value={o}>{o}</option>
            : <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <CrmIcon name="chevD" size={14} style={{ color: 'var(--crm-fg-3)', pointerEvents: 'none' }} />
      </div>
      {hint && <span style={{ fontSize: 11, color: 'var(--crm-fg-3)' }}>{hint}</span>}
    </label>
  );
}

function CrmTextarea({ label, value, onChange, placeholder, rows = 4, style }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6, ...style }}>
      {label && <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--crm-fg-1)' }}>{label}</span>}
      <textarea rows={rows} value={value || ''} placeholder={placeholder}
        onChange={e => onChange && onChange(e.target.value)} style={{
          padding: 12, border: '1px solid var(--crm-border-2)', borderRadius: 8,
          fontSize: 13, fontFamily: 'inherit', color: 'var(--crm-fg-1)',
          resize: 'vertical', outline: 'none', background: '#fff',
        }} />
    </label>
  );
}

// ───────────────────────── Toggle ─────────────────────────
function CrmToggle({ value, onChange, label, size = 'md' }) {
  const w = size === 'sm' ? 28 : 34;
  const h = size === 'sm' ? 16 : 20;
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
      <span style={{
        width: w, height: h, borderRadius: 999, position: 'relative',
        background: value ? 'var(--crm-green)' : 'var(--crm-border-2)',
        transition: 'background .15s',
      }}>
        <span style={{
          position: 'absolute', top: 2, left: value ? w - h + 2 : 2,
          width: h - 4, height: h - 4, borderRadius: 999,
          background: '#fff', transition: 'left .15s',
        }} />
      </span>
      <input type="checkbox" checked={!!value} onChange={e => onChange(e.target.checked)} style={{ display: 'none' }} />
      {label && <span style={{ fontSize: 12, color: 'var(--crm-fg-1)' }}>{label}</span>}
    </label>
  );
}

// ───────────────────────── KPI Card ─────────────────────────
function CrmKPI({ label, value, delta, deltaTone, icon, sub, hint }) {
  return (
    <div style={{
      background: '#fff', border: '1px solid var(--crm-border)',
      borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--crm-fg-2)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</span>
        {icon && <span style={{
          width: 28, height: 28, background: 'var(--crm-green-soft)', color: 'var(--crm-green-deep)',
          borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}><CrmIcon name={icon} size={15} /></span>}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--crm-fg-1)' }}>{value}</span>
        {delta && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 2,
            fontSize: 11, fontWeight: 700,
            color: deltaTone === 'down' ? 'var(--crm-danger)' : 'var(--crm-green)',
          }}>
            <CrmIcon name={deltaTone === 'down' ? 'trendD' : 'trend'} size={12} />
            {delta}
          </span>
        )}
      </div>
      {(sub || hint) && <span style={{ fontSize: 11, color: 'var(--crm-fg-2)' }}>{sub || hint}</span>}
    </div>
  );
}

// ───────────────────────── Sparkline / mini bars ─────────────────────────
function CrmSpark({ data, color = '#09A77E', height = 40, fill }) {
  const max = Math.max(...data) || 1;
  const min = Math.min(...data);
  const w = 200, h = height;
  const path = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min || 1)) * (h - 6) - 3;
    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ width: '100%', height, display: 'block' }}>
      {fill && (
        <path d={`${path} L ${w} ${h} L 0 ${h} Z`} fill={color} opacity="0.12" />
      )}
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CrmBars({ data, color = 'var(--crm-green)', height = 60, max }) {
  const m = max || Math.max(...data.map(d => d.value));
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height, width: '100%' }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minWidth: 0 }}>
          <div style={{
            width: '100%', height: `${(d.value / m) * 100}%`,
            background: d.color || color, borderRadius: '3px 3px 0 0', minHeight: 2,
          }} />
        </div>
      ))}
    </div>
  );
}

// ───────────────────────── Empty state ─────────────────────────
function CrmEmpty({ icon, title, body, action }) {
  return (
    <div style={{
      padding: 32, textAlign: 'center', display: 'flex', flexDirection: 'column',
      alignItems: 'center', gap: 8,
    }}>
      <span style={{
        width: 48, height: 48, borderRadius: 12, background: 'var(--crm-bg)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--crm-fg-3)',
      }}><CrmIcon name={icon || 'inbox'} size={22} /></span>
      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--crm-fg-1)' }}>{title}</div>
      {body && <div style={{ fontSize: 12, color: 'var(--crm-fg-2)', maxWidth: 320 }}>{body}</div>}
      {action}
    </div>
  );
}

// expose to other Babel scopes
Object.assign(window, {
  CrmIcon, CrmAvatar, CrmButton, CrmChip, CrmBadge,
  CrmSidebar, CrmTopBar, CrmAppShell, CrmPageHeader,
  CrmCard, CrmInput, CrmSelect, CrmTextarea, CrmToggle,
  CrmKPI, CrmSpark, CrmBars, CrmEmpty,
  avatarColor, initials,
});
