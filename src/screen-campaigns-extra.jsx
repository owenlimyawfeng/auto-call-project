// Auto-call campaign — extended screens
// 1. CampaignsKanban       — Draft / Scheduled / Running / Completed columns
// 2. CampaignsDashboard    — operational dashboard, big numbers + table
// 3. CampaignsControlRoom  — live "war room" with in-flight calls
// 4. CampaignDetail        — drill into one running campaign
// 5. CampaignBuilderV2     — single-page builder w/ voice preview + cost + approval
// 6. RecipientListsScreen  — list management + DNC
// 7. SchedulingScreen      — calling windows, throttling, retry rules

const C_KAN = {
  draft: [
    { id: 'D1', name: 'GoEV Promo — KL Sentral',  recipients: 0,    template: 'EV Awareness',     bot: 'EV AI', owner: 'Sai',   created: '2h' },
    { id: 'D2', name: 'July Loyalty Refresh',     recipients: 1820, template: 'Loyalty Tier',     bot: 'Sharing AI', owner: 'Naili', created: '1d' },
  ],
  scheduled: [
    { id: 'S1', name: 'Subs Renewal — Q2',        recipients: 412,  template: 'Subs Renewal',     bot: 'Subs AI', owner: 'Sai',   when: '05 May · 09:00' },
    { id: 'S2', name: 'Document Upload Reminder', recipients: 220,  template: 'Upload Document',  bot: 'Sharing AI', owner: 'Faiz', when: '04 May · 14:00' },
    { id: 'S3', name: 'Booking Confirm 24h',      recipients: 92,   template: 'Booking Confirm',  bot: 'Sharing AI', owner: 'auto', when: 'Daily · 10:00', recurring: true },
  ],
  running: [
    { id: 'R1', name: 'Periodic Service Reminder — May', recipients: 250, done: 142, template: 'Reminder Service', bot: 'Sharing AI', owner: 'Sai', conv: 38, eta: '12 min', live: 6 },
    { id: 'R2', name: 'NPS Detractor Recovery',          recipients: 80,  done: 41,  template: 'NPS Recovery',     bot: 'Sharing AI', owner: 'Mei',  conv: 31, eta: '28 min', live: 3 },
  ],
  completed: [
    { id: 'C1', name: 'Lapsed Members Win-back',  recipients: 602,  template: 'Win-back Voucher', bot: 'Sharing AI', owner: 'Sai', finished: '28 Apr', conv: 22 },
    { id: 'C2', name: 'NPS Follow-up',            recipients: 120,  template: 'NPS Recovery',     bot: 'Sharing AI', owner: 'Mei', finished: '25 Apr', conv: 31 },
    { id: 'C3', name: 'Document Upload Reminder', recipients: 220,  template: 'Upload Document',  bot: 'Sharing AI', owner: 'Faiz', finished: '20 Apr', conv: 14 },
  ],
};

const KAN_COLS = [
  { id: 'draft',     label: 'Draft',     accent: '#9A999C', tone: 'draft' },
  { id: 'scheduled', label: 'Scheduled', accent: '#1E63D6', tone: 'scheduled' },
  { id: 'running',   label: 'Running',   accent: '#09A77E', tone: 'running' },
  { id: 'completed', label: 'Completed', accent: '#0B7A5C', tone: 'completed' },
];

function KanCard({ c, col }) {
  const pct = c.done && c.recipients ? Math.round(c.done / c.recipients * 100) : 0;
  return (
    <div style={{
      background: '#fff', border: '1px solid var(--crm-border)', borderRadius: 10,
      padding: 12, boxShadow: 'var(--crm-shadow-sm)', cursor: 'grab',
      borderLeft: col === 'running' ? '3px solid var(--crm-green)' : '1px solid var(--crm-border)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <span style={{ width: 22, height: 22, borderRadius: 6, background: 'var(--crm-green-soft)', color: 'var(--crm-green-deep)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><CrmIcon name="bot" size={11} /></span>
        <span style={{ fontSize: 11, color: 'var(--crm-fg-2)', fontWeight: 600 }}>{c.bot}</span>
        {c.recurring && <CrmBadge tone="default" size="sm">Recurring</CrmBadge>}
        <span style={{ flex: 1 }} />
        <button style={{ width: 22, height: 22, background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--crm-fg-3)' }}><CrmIcon name="moreV" size={13} /></button>
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4, lineHeight: 1.35 }}>{c.name}</div>
      <div style={{ fontSize: 11, color: 'var(--crm-fg-2)', marginBottom: 10 }}>{c.template}</div>

      {col === 'running' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--crm-fg-2)', marginBottom: 4, fontWeight: 600 }}>
            <span>{c.done} / {c.recipients}</span>
            <span>{pct}%</span>
          </div>
          <div style={{ height: 5, background: 'var(--crm-bg)', borderRadius: 999, overflow: 'hidden', marginBottom: 10 }}>
            <div style={{ width: `${pct}%`, height: '100%', background: 'var(--crm-green)' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', background: 'var(--crm-green-soft)', borderRadius: 6, fontSize: 11, color: 'var(--crm-green-deep)', fontWeight: 600 }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--crm-green)', boxShadow: '0 0 0 0 rgba(9,167,126,.4)', animation: 'pulse 1.6s infinite' }} />
            {c.live} calls in-flight · ETA {c.eta}
          </div>
        </>
      )}

      {col === 'scheduled' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--crm-fg-2)', padding: '6px 8px', background: 'var(--crm-bg)', borderRadius: 6 }}>
          <CrmIcon name="cal" size={11} />
          <span>{c.when}</span>
          <span style={{ marginLeft: 'auto', fontWeight: 700, color: 'var(--crm-fg-1)' }}>{c.recipients} rcpts</span>
        </div>
      )}

      {col === 'draft' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--crm-fg-2)' }}>
          <CrmIcon name="users" size={11} /><span>{c.recipients ? `${c.recipients} rcpts` : 'No recipients'}</span>
          <span style={{ marginLeft: 'auto' }}>{c.created} ago</span>
        </div>
      )}

      {col === 'completed' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--crm-fg-2)' }}>
          <span>{c.recipients} calls</span>
          <span style={{ color: 'var(--crm-green-deep)', fontWeight: 700, marginLeft: 'auto' }}>{c.conv}% conv</span>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--crm-border)' }}>
        <CrmAvatar name={c.owner === 'auto' ? 'Auto' : c.owner} size={20} />
        <span style={{ fontSize: 11, color: 'var(--crm-fg-2)' }}>{c.owner === 'auto' ? 'System' : c.owner}</span>
      </div>
    </div>
  );
}

function CampaignsKanban() {
  return (
    <CrmAppShell active="campaigns" breadcrumbs={['Call Center', 'Auto Call Campaigns']}
      topRight={<><CrmButton variant="secondary" size="sm" icon="list">List view</CrmButton><CrmButton variant="green" size="sm" icon="plus">New Campaign</CrmButton></>}>
      <CrmPageHeader title="Auto Call Campaigns" subtitle="Drag campaigns through the pipeline. Schedule a draft to lock it in." />
      <div style={{ flex: 1, padding: 24, overflow: 'auto', background: 'var(--crm-bg)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, minWidth: 1100 }}>
          {KAN_COLS.map(col => (
            <div key={col.id} style={{ display: 'flex', flexDirection: 'column', minHeight: 600 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px',
                background: '#fff', border: '1px solid var(--crm-border)', borderRadius: '10px 10px 0 0',
                borderBottom: 'none',
              }}>
                <span style={{ width: 8, height: 8, borderRadius: 999, background: col.accent }} />
                <span style={{ fontSize: 13, fontWeight: 800 }}>{col.label}</span>
                <span style={{ fontSize: 11, color: 'var(--crm-fg-2)', background: 'var(--crm-bg)', padding: '2px 8px', borderRadius: 999, fontWeight: 700 }}>{C_KAN[col.id].length}</span>
                <span style={{ flex: 1 }} />
                <button style={{ width: 22, height: 22, background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--crm-fg-3)' }}><CrmIcon name="plus" size={14} /></button>
              </div>
              <div style={{
                flex: 1, padding: 10, display: 'flex', flexDirection: 'column', gap: 10,
                background: col.id === 'running' ? '#F4FBF8' : '#fafbfc',
                border: '1px solid var(--crm-border)', borderTop: 'none', borderRadius: '0 0 10px 10px',
              }}>
                {C_KAN[col.id].map(c => <KanCard key={c.id} c={c} col={col.id} />)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </CrmAppShell>
  );
}

// ────────── 2. Operational dashboard ──────────
function CampaignsDashboard() {
  return (
    <CrmAppShell active="campaigns" breadcrumbs={['Call Center', 'Auto Call Campaigns']}
      topRight={<>
        <CrmSelect value="today" onChange={() => {}} options={['Today', 'This week', 'This month']} style={{ width: 130 }}/>
        <CrmButton variant="green" size="sm" icon="plus">New Campaign</CrmButton>
      </>}>
      <CrmPageHeader title="Auto Call Campaigns" subtitle="Operational view — what's running right now, and how it's performing." />
      <div className="crm-scroll" style={{ flex: 1, overflow: 'auto', padding: 24, background: 'var(--crm-bg)' }}>

        {/* Hero strip with live activity */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16, marginBottom: 16 }}>
          <CrmCard padding={20}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--crm-green)', boxShadow: '0 0 0 4px rgba(9,167,126,.16)' }} />
                  <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--crm-green-deep)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Live</span>
                </div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>Calls per minute</h3>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--crm-fg-2)' }}>Across 2 running campaigns</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 36, fontWeight: 800, lineHeight: 1, letterSpacing: '-0.02em' }}>14.2</div>
                <div style={{ fontSize: 11, color: 'var(--crm-green)', fontWeight: 700 }}>+2.1 vs last hour</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 80 }}>
              {[6, 8, 7, 10, 12, 9, 11, 13, 14, 12, 15, 14, 16, 13, 14, 15, 17, 14, 18, 16, 14, 15, 13, 14].map((v, i) => (
                <div key={i} style={{ flex: 1, height: `${v / 18 * 100}%`, background: i > 18 ? 'var(--crm-green)' : 'var(--crm-green-deep)', opacity: i > 18 ? 1 : 0.55, borderRadius: '2px 2px 0 0' }} />
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--crm-fg-3)', marginTop: 6 }}>
              <span>−24m</span><span>−18m</span><span>−12m</span><span>−6m</span><span>now</span>
            </div>
          </CrmCard>

          <CrmCard padding={20}>
            <h3 style={{ margin: '0 0 12px', fontSize: 16, fontWeight: 800 }}>Today's pipeline</h3>
            {[
              ['Calls placed',     '342',   '↑ 18%', 'var(--crm-green)'],
              ['Connected',        '234 · 68%', '↑ 4pp', 'var(--crm-green)'],
              ['Bot resolved',     '156 · 67%', '↑ 6pp', 'var(--crm-green)'],
              ['Escalated to agent', '24 · 10%', '↓ 2pp', 'var(--crm-warning)'],
              ['Conversions',      '38 · 16%', '↑ 1.8pp', 'var(--crm-green)'],
            ].map(([k, v, d, c]) => (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--crm-border)', fontSize: 13 }}>
                <span style={{ flex: 1, color: 'var(--crm-fg-2)' }}>{k}</span>
                <span style={{ fontWeight: 700, color: 'var(--crm-fg-1)' }}>{v}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: c, minWidth: 56, textAlign: 'right' }}>{d}</span>
              </div>
            ))}
          </CrmCard>
        </div>

        {/* Alerts */}
        <CrmCard padding={0} style={{ marginBottom: 16 }}>
          <div style={{ padding: '12px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--crm-border)' }}>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800 }}>Alerts &amp; signals</h3>
            <CrmButton size="sm" variant="ghost">All alerts</CrmButton>
          </div>
          {[
            { tone: 'warn',   icon: 'alert',     title: 'Subs Renewal — Q2', body: 'Connect rate dropped to 38% (target ≥ 50%). Consider re-record voice or shift to lunchtime slots.', t: '4m ago' },
            { tone: 'info',   icon: 'info',      title: 'Document Upload Reminder', body: 'Paused for review — 220 / 220 recipients DNC-checked, awaiting compliance sign-off.', t: '12m ago' },
            { tone: 'good',   icon: 'sparkle',   title: 'Periodic Service May — milestone', body: 'Crossed 50% completion with 38% conversion — best campaign of the quarter.', t: '28m ago' },
          ].map((a, i, arr) => {
            const palette = { warn: ['#FFF6DD', '#92400E'], info: ['#E1ECFB', '#1A4FAA'], good: ['#E0F2EC', '#0B7A5C'] }[a.tone];
            return (
              <div key={i} style={{ display: 'flex', gap: 12, padding: '14px 18px', borderBottom: i < arr.length - 1 ? '1px solid var(--crm-border)' : 'none', alignItems: 'flex-start' }}>
                <span style={{ width: 32, height: 32, borderRadius: 8, background: palette[0], color: palette[1], display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <CrmIcon name={a.icon} size={15} />
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{a.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--crm-fg-2)', marginTop: 2, lineHeight: 1.5 }}>{a.body}</div>
                </div>
                <span style={{ fontSize: 11, color: 'var(--crm-fg-3)', whiteSpace: 'nowrap' }}>{a.t}</span>
              </div>
            );
          })}
        </CrmCard>

        {/* Compact campaign table */}
        <CrmCard padding={0}>
          <div style={{ padding: '12px 18px', borderBottom: '1px solid var(--crm-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800 }}>All campaigns</h3>
            <div style={{ display: 'flex', gap: 8 }}>
              <CrmButton size="sm" variant="secondary" icon="filter">Filter</CrmButton>
              <CrmButton size="sm" variant="secondary" icon="download">Export</CrmButton>
            </div>
          </div>
          <div style={{
            display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 2fr 90px 90px 110px',
            padding: '10px 18px', background: '#fafbfc', borderBottom: '1px solid var(--crm-border)',
            fontSize: 11, fontWeight: 700, color: 'var(--crm-fg-2)', textTransform: 'uppercase', letterSpacing: '0.04em',
          }}>
            <span>Campaign</span><span>Status</span><span>Bot</span><span>Progress</span><span>Conn.</span><span>Conv.</span><span></span>
          </div>
          {[
            { n: 'Periodic Service May', s: 'running',   b: 'Sharing AI', d: 142, t: 250, conn: '71%', conv: '38%' },
            { n: 'NPS Detractor Recovery', s: 'running', b: 'Sharing AI', d: 41,  t: 80,  conn: '64%', conv: '31%' },
            { n: 'Subs Renewal Q2',     s: 'scheduled', b: 'Subs AI',     d: 0,   t: 412, conn: '—', conv: '—' },
            { n: 'Document Upload Reminder', s: 'paused', b: 'Sharing AI', d: 88, t: 220, conn: '52%', conv: '14%' },
            { n: 'Lapsed Members Win-back', s: 'completed', b: 'Sharing AI', d: 602, t: 602, conn: '69%', conv: '22%' },
          ].map((c, i) => (
            <div key={c.n} style={{
              display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 2fr 90px 90px 110px',
              padding: '12px 18px', alignItems: 'center', fontSize: 12,
              borderBottom: i < 4 ? '1px solid var(--crm-border)' : 'none',
            }}>
              <span style={{ fontWeight: 700 }}>{c.n}</span>
              <CrmBadge tone={c.s} dot>{c.s}</CrmBadge>
              <span style={{ color: 'var(--crm-fg-2)' }}>{c.b}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ flex: 1, height: 5, background: 'var(--crm-bg)', borderRadius: 999, overflow: 'hidden' }}>
                  <span style={{ display: 'block', width: c.t ? `${c.d / c.t * 100}%` : '0%', height: '100%', background: c.s === 'paused' ? 'var(--crm-warning)' : 'var(--crm-green)' }} />
                </span>
                <span style={{ fontSize: 11, color: 'var(--crm-fg-2)', whiteSpace: 'nowrap' }}>{c.d} / {c.t}</span>
              </div>
              <span style={{ fontWeight: 600 }}>{c.conn}</span>
              <span style={{ fontWeight: 700, color: c.conv === '—' ? 'var(--crm-fg-3)' : 'var(--crm-green-deep)' }}>{c.conv}</span>
              <CrmButton size="sm" variant="secondary">Open</CrmButton>
            </div>
          ))}
        </CrmCard>
      </div>
    </CrmAppShell>
  );
}

// ────────── 3. Live control room ──────────
function CampaignsControlRoom() {
  return (
    <CrmAppShell active="campaigns" breadcrumbs={['Call Center', 'Auto Call Campaigns', 'Control Room']}
      topRight={<>
        <CrmBadge tone="completed" dot>Live · 9 calls</CrmBadge>
        <CrmButton variant="secondary" size="sm" icon="pause">Pause all</CrmButton>
      </>}>
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 360px', overflow: 'hidden', background: '#0F1A2C', color: '#fff' }}>
        {/* Main grid */}
        <div className="crm-scroll" style={{ overflow: 'auto', padding: 20 }}>
          {/* Hero numbers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
            {[
              ['Calls in flight', '9',   'var(--crm-green)'],
              ['Placed today',    '342', '#fff'],
              ['Connect rate',    '68%', '#fff'],
              ['Conversions',     '38',  '#fff'],
            ].map(([l, v, c]) => (
              <div key={l} style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 11, opacity: 0.6, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{l}</div>
                <div style={{ fontSize: 32, fontWeight: 800, color: c, letterSpacing: '-0.02em', lineHeight: 1 }}>{v}</div>
              </div>
            ))}
          </div>

          {/* In-flight calls */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800 }}>In-flight calls</h3>
              <span style={{ fontSize: 11, opacity: 0.6 }}>Auto-refresh · 2s</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {[
                { n: 'Aisyah R.',  p: '+60 12-345 7890', step: 'Confirm slot',     bot: 'Sharing AI', t: '00:42', s: 'positive', wave: [3, 5, 8, 6, 9, 11, 7, 8, 10, 6] },
                { n: 'Daniel T.',  p: '+60 16-887 1129', step: 'Greeting',         bot: 'Subs AI',    t: '00:08', s: 'neutral',  wave: [2, 3, 4, 5, 6, 4, 5, 3, 4, 5] },
                { n: 'Hoang H.',   p: '+84 974 066 422', step: 'Capture intent',   bot: 'Sharing AI', t: '00:24', s: 'neutral',  wave: [3, 5, 4, 6, 8, 6, 5, 4, 6, 7] },
                { n: 'Kyle Ng',    p: '+60 16-880 4422', step: 'Reminder',         bot: 'Sharing AI', t: '00:18', s: 'positive', wave: [4, 6, 8, 7, 9, 10, 8, 7, 9, 8] },
                { n: 'Mr. Ben',    p: '+60 19-887 4521', step: 'Handoff requested', bot: 'Garage AI',  t: '01:02', s: 'negative', wave: [6, 9, 12, 10, 13, 11, 14, 12, 11, 10], flag: true },
                { n: 'Owen Lim',   p: '+60 12-734 5779', step: 'End',              bot: 'Sharing AI', t: '01:18', s: 'positive', wave: [3, 4, 5, 4, 6, 5, 4, 5, 6, 4] },
              ].map(c => {
                const sentMap = { positive: '#22C55E', neutral: '#E0A100', negative: '#D8443C' };
                return (
                  <div key={c.n} style={{
                    background: c.flag ? 'rgba(216,68,60,.12)' : 'rgba(255,255,255,.05)',
                    border: c.flag ? '1px solid rgba(216,68,60,.4)' : '1px solid rgba(255,255,255,.08)',
                    borderRadius: 10, padding: 14,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                      <CrmAvatar name={c.n} size={32} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>{c.n}</div>
                        <div style={{ fontSize: 11, opacity: 0.6, fontFamily: 'ui-monospace, monospace' }}>{c.p}</div>
                      </div>
                      <span style={{ width: 8, height: 8, borderRadius: 999, background: sentMap[c.s] }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, height: 24, marginBottom: 8 }}>
                      {c.wave.map((h, i) => <span key={i} style={{ flex: 1, height: `${h * 6}%`, background: 'var(--crm-green)', borderRadius: 1, opacity: 0.4 + (i / c.wave.length) * 0.6 }} />)}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, opacity: 0.7 }}>
                      <span>{c.step}</span>
                      <span style={{ fontFamily: 'ui-monospace, monospace' }}>{c.t}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 4, marginTop: 10 }}>
                      <button style={{ flex: 1, padding: '6px 8px', background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 6, color: '#fff', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>Listen</button>
                      <button style={{ flex: 1, padding: '6px 8px', background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 6, color: '#fff', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>Whisper</button>
                      <button style={{ flex: 1, padding: '6px 8px', background: c.flag ? '#D8443C' : 'rgba(255,255,255,.08)', border: c.flag ? 'none' : '1px solid rgba(255,255,255,.12)', borderRadius: 6, color: '#fff', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>{c.flag ? 'Take over' : 'Take over'}</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right rail */}
        <div style={{ borderLeft: '1px solid rgba(255,255,255,.08)', padding: 18, display: 'flex', flexDirection: 'column', gap: 16, overflow: 'auto' }}>
          <div>
            <div style={{ fontSize: 11, opacity: 0.6, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Active campaigns</div>
            {[
              { n: 'Periodic Service May', d: 142, t: 250, eta: '12m' },
              { n: 'NPS Detractor Recovery', d: 41, t: 80, eta: '28m' },
            ].map(c => (
              <div key={c.n} style={{ padding: 12, background: 'rgba(255,255,255,.05)', borderRadius: 10, marginBottom: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>{c.n}</div>
                <div style={{ height: 5, background: 'rgba(255,255,255,.1)', borderRadius: 999, overflow: 'hidden', marginBottom: 6 }}>
                  <div style={{ width: `${c.d / c.t * 100}%`, height: '100%', background: 'var(--crm-green)' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, opacity: 0.7 }}>
                  <span>{c.d} / {c.t} · ETA {c.eta}</span>
                  <span>{Math.round(c.d / c.t * 100)}%</span>
                </div>
              </div>
            ))}
          </div>

          <div>
            <div style={{ fontSize: 11, opacity: 0.6, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Live alerts</div>
            {[
              ['#D8443C', 'Mr. Ben requested handoff', '12s ago'],
              ['#E0A100', 'Subs Renewal connect 38% — below target', '4m ago'],
              ['#22C55E', 'Periodic Service crossed 50% — pacing well', '12m ago'],
            ].map(([c, t, w]) => (
              <div key={t} style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
                <span style={{ width: 6, borderRadius: 999, background: c }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{t}</div>
                  <div style={{ fontSize: 10, opacity: 0.5, marginTop: 2 }}>{w}</div>
                </div>
              </div>
            ))}
          </div>

          <div>
            <div style={{ fontSize: 11, opacity: 0.6, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Sentiment now</div>
            <div style={{ display: 'flex', gap: 4, height: 36, borderRadius: 6, overflow: 'hidden' }}>
              <span style={{ flex: 6, background: '#22C55E' }} />
              <span style={{ flex: 2.5, background: '#E0A100' }} />
              <span style={{ flex: 1.5, background: '#D8443C' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, opacity: 0.7, marginTop: 6 }}>
              <span style={{ color: '#22C55E' }}>60%</span><span style={{ color: '#E0A100' }}>25%</span><span style={{ color: '#D8443C' }}>15%</span>
            </div>
          </div>
        </div>
      </div>
    </CrmAppShell>
  );
}

// ────────── 4. Campaign detail ──────────
function CampaignDetailScreen() {
  return (
    <CrmAppShell active="campaigns" breadcrumbs={['Call Center', 'Auto Call Campaigns', 'Periodic Service Reminder — May']}
      topRight={<>
        <CrmButton size="sm" variant="secondary" icon="pause">Pause</CrmButton>
        <CrmButton size="sm" variant="secondary" icon="edit">Edit</CrmButton>
        <CrmButton size="sm" variant="green" icon="bar">Reports</CrmButton>
      </>}>
      <div style={{ padding: '20px 24px', background: '#fff', borderBottom: '1px solid var(--crm-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Periodic Service Reminder — May</h1>
          <CrmBadge tone="running" dot>Running</CrmBadge>
          <span style={{ fontSize: 12, color: 'var(--crm-fg-2)' }}>Started 03 May, 10:00</span>
        </div>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--crm-fg-2)' }}>Targets owners 90+ days past last service · Sharing AI bot · 250 recipients</p>

        {/* Big progress bar */}
        <div style={{ marginTop: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
            <span style={{ fontWeight: 700 }}>142 of 250 calls placed · 57%</span>
            <span style={{ color: 'var(--crm-fg-2)' }}>ETA 12 minutes · 6 in-flight</span>
          </div>
          <div style={{ height: 10, background: 'var(--crm-bg)', borderRadius: 999, overflow: 'hidden', display: 'flex' }}>
            <div style={{ width: '57%', background: 'var(--crm-green)' }} />
            <div style={{ width: '2.4%', background: 'var(--crm-green)', opacity: 0.5, animation: 'pulse 1.4s infinite' }} />
          </div>
        </div>
      </div>

      <div className="crm-scroll" style={{ flex: 1, overflow: 'auto', padding: 24, background: 'var(--crm-bg)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Funnel */}
            <CrmCard padding={20}>
              <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 800 }}>Outcome funnel</h3>
              {[
                ['Placed',         142, 142, 'var(--crm-green)'],
                ['Connected',      101, 142, 'var(--crm-green)'],
                ['Engaged',         85, 142, 'var(--crm-green)'],
                ['Booking offered', 72, 142, 'var(--crm-info)'],
                ['Booked (conv.)',  38, 142, 'var(--crm-green-deep)'],
              ].map(([l, v, base, c]) => (
                <div key={l} style={{ display: 'grid', gridTemplateColumns: '140px 1fr 80px 60px', alignItems: 'center', gap: 12, padding: '8px 0' }}>
                  <span style={{ fontSize: 13, color: 'var(--crm-fg-2)' }}>{l}</span>
                  <span style={{ height: 22, background: 'var(--crm-bg)', borderRadius: 4, overflow: 'hidden', display: 'flex', alignItems: 'center', paddingLeft: 6 }}>
                    <span style={{ width: `${v / base * 100}%`, height: '100%', background: c, borderRadius: 4, marginLeft: -6 }} />
                  </span>
                  <span style={{ fontWeight: 700, fontSize: 13 }}>{v}</span>
                  <span style={{ fontSize: 11, color: 'var(--crm-fg-2)' }}>{Math.round(v / base * 100)}%</span>
                </div>
              ))}
            </CrmCard>

            {/* Recent outcomes */}
            <CrmCard padding={0}>
              <div style={{ padding: '12px 18px', borderBottom: '1px solid var(--crm-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800 }}>Latest outcomes</h3>
                <CrmButton size="sm" variant="ghost">All 142</CrmButton>
              </div>
              {[
                ['Aisyah R.', '+60 12-345 7890', '0:48', 'Booked', 'positive', 'completed'],
                ['Kyle Ng',   '+60 16-880 4422', '0:06', 'No answer', '—', 'missed'],
                ['Hoang H.',  '+84 974 066 422', '0:44', 'Undecided', 'neutral', 'completed'],
                ['Mr. Ben',   '+60 19-887 4521', '0:57', 'Escalated', 'negative', 'escalated'],
                ['Daniel T.', '+60 16-887 1129', '0:48', 'Booked',  'positive', 'completed'],
                ['Owen Lim',  '+60 12-734 5779', '1:22', 'No response', 'neutral', 'completed'],
              ].map((r, i, arr) => {
                const sMap = { positive: '#22C55E', neutral: '#E0A100', negative: '#D8443C' };
                return (
                  <div key={i} style={{
                    display: 'grid', gridTemplateColumns: '1fr 160px 80px 130px 100px 110px',
                    padding: '12px 18px', alignItems: 'center', fontSize: 12,
                    borderBottom: i < arr.length - 1 ? '1px solid var(--crm-border)' : 'none',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <CrmAvatar name={r[0]} size={26} />
                      <span style={{ fontWeight: 600 }}>{r[0]}</span>
                    </div>
                    <span style={{ color: 'var(--crm-fg-2)', fontFamily: 'ui-monospace, monospace' }}>{r[1]}</span>
                    <span style={{ fontWeight: 600 }}>{r[2]}</span>
                    <span>{r[3]}</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      {r[4] !== '—' && <span style={{ width: 8, height: 8, borderRadius: 999, background: sMap[r[4]] }} />}
                      <span style={{ color: 'var(--crm-fg-2)' }}>{r[4]}</span>
                    </span>
                    <CrmBadge tone={r[5] === 'completed' ? 'completed' : r[5] === 'missed' ? 'missed' : 'pending'}>{r[5]}</CrmBadge>
                  </div>
                );
              })}
            </CrmCard>
          </div>

          {/* Right rail */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <CrmCard padding={16}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--crm-fg-2)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>Cost so far</div>
              <div style={{ fontSize: 28, fontWeight: 800 }}>RM 59.64</div>
              <div style={{ fontSize: 12, color: 'var(--crm-fg-2)', marginTop: 4 }}>Est. total · RM 105.00</div>
              <div style={{ height: 5, background: 'var(--crm-bg)', borderRadius: 999, marginTop: 10, overflow: 'hidden' }}>
                <div style={{ width: '57%', height: '100%', background: 'var(--crm-green)' }} />
              </div>
            </CrmCard>
            <CrmCard padding={16}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--crm-fg-2)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>Setup</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--crm-fg-2)' }}>Bot template</span><span style={{ fontWeight: 700 }}>Reminder Service v3</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--crm-fg-2)' }}>Voice</span><span style={{ fontWeight: 700 }}>Aira (BM/EN)</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--crm-fg-2)' }}>Calling window</span><span style={{ fontWeight: 700 }}>10:00–18:00</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--crm-fg-2)' }}>Pacing</span><span style={{ fontWeight: 700 }}>15 / min</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--crm-fg-2)' }}>Retry</span><span style={{ fontWeight: 700 }}>2× · 4h apart</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--crm-fg-2)' }}>Approved by</span><span style={{ fontWeight: 700 }}>Mei Ling W.</span></div>
              </div>
            </CrmCard>
            <CrmCard padding={16}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--crm-fg-2)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>Actions</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <CrmButton size="sm" variant="secondary" full>Add recipients (CSV)</CrmButton>
                <CrmButton size="sm" variant="secondary" full>Edit bot script</CrmButton>
                <CrmButton size="sm" variant="secondary" full>Adjust pacing</CrmButton>
                <CrmButton size="sm" variant="ghost" full>Duplicate</CrmButton>
              </div>
            </CrmCard>
          </div>
        </div>
      </div>
    </CrmAppShell>
  );
}

// ────────── 5. Builder v2 — single-page ──────────
function CampaignBuilderV2() {
  return (
    <CrmAppShell active="campaigns" breadcrumbs={['Call Center', 'Auto Call Campaigns', 'New campaign']}
      topRight={<>
        <CrmButton size="sm" variant="ghost">Save draft</CrmButton>
        <CrmButton size="sm" variant="secondary" icon="users">Request approval</CrmButton>
        <CrmButton size="sm" variant="green" icon="play">Launch</CrmButton>
      </>}>
      <CrmPageHeader title="New campaign" subtitle="One page · live preview · live cost estimate · approval before launch." />
      <div className="crm-scroll" style={{ flex: 1, overflow: 'auto', padding: 24, background: 'var(--crm-bg)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 }}>
          {/* Left: setup */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <CrmCard padding={20}>
              <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 800 }}>① Basics</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <CrmInput label="Campaign name" value="Periodic Service Reminder — May" onChange={() => {}} />
                <CrmSelect label="Service line" value="sharing" onChange={() => {}} options={[{value:'sharing',label:'GoCar Sharing'},{value:'subs',label:'GoCar Subs'},{value:'ev',label:'GoEV'}]} />
              </div>
            </CrmCard>

            <CrmCard padding={20}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800 }}>② Recipients</h3>
                <CrmBadge tone="completed" dot>250 valid · 0 DNC</CrmBadge>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', padding: 12, background: 'var(--crm-bg)', borderRadius: 8 }}>
                <span style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--crm-green-soft)', color: 'var(--crm-green-deep)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><CrmIcon name="upload" size={15} /></span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>service_reminder_may.csv</div>
                  <div style={{ fontSize: 11, color: 'var(--crm-fg-2)' }}>250 rows · validated · phone, name, plate, due_date</div>
                </div>
                <CrmButton size="sm" variant="ghost">Replace</CrmButton>
                <CrmButton size="sm" variant="ghost">Add segment</CrmButton>
              </div>
            </CrmCard>

            <CrmCard padding={20}>
              <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 800 }}>③ Bot &amp; voice</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <CrmSelect label="Bot template" value="rs" onChange={() => {}} options={[{value:'rs',label:'Reminder Periodic Service · 7 steps'},{value:'sub',label:'Subs Renewal · 9 steps'}]} />
                <CrmSelect label="Voice" value="aira" onChange={() => {}} options={[{value:'aira',label:'Aira — Female, BM/EN, warm'},{value:'kai',label:'Kai — Male, EN'}]} />
              </div>
              {/* Live voice preview */}
              <div style={{ padding: 14, background: 'linear-gradient(135deg, #E0F2EC, #fff)', border: '1px solid var(--crm-green)', borderRadius: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <span style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--crm-green)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><CrmIcon name="sparkle" size={14} /></span>
                  <span style={{ fontSize: 13, fontWeight: 800 }}>Live voice preview</span>
                  <span style={{ flex: 1 }} />
                  <CrmButton size="sm" variant="green" icon="play">Play sample</CrmButton>
                </div>
                <div style={{ fontSize: 12, color: 'var(--crm-fg-2)', marginBottom: 8 }}>Hear how the bot will sound to a real customer — variables filled with row 1 of your CSV.</div>
                <div style={{ padding: 10, background: '#fff', borderRadius: 6, fontSize: 13, lineHeight: 1.6, fontStyle: 'italic', color: 'var(--crm-fg-1)' }}>
                  "Hi <b style={{ color: 'var(--crm-green-deep)', fontStyle: 'normal' }}>Aisyah</b>, this is GoCar calling. Your <b style={{ color: 'var(--crm-green-deep)', fontStyle: 'normal' }}>Bezza VPQ 7400</b> is due for periodic service on <b style={{ color: 'var(--crm-green-deep)', fontStyle: 'normal' }}>12 May</b>. Would you like me to book a slot?"
                </div>
                {/* Audio scrubber */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10 }}>
                  <span style={{ fontSize: 10, fontFamily: 'ui-monospace, monospace', color: 'var(--crm-fg-2)' }}>0:00</span>
                  <div style={{ flex: 1, height: 24, background: '#fff', borderRadius: 4, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', padding: '0 4px', gap: 1 }}>
                    {Array.from({ length: 80 }).map((_, i) => {
                      const h = 4 + Math.abs(Math.sin(i * 0.4) * 14);
                      return <span key={i} style={{ flex: 1, height: h, background: 'var(--crm-green)', opacity: 0.55, borderRadius: 1 }} />;
                    })}
                  </div>
                  <span style={{ fontSize: 10, fontFamily: 'ui-monospace, monospace', color: 'var(--crm-fg-2)' }}>0:08</span>
                </div>
              </div>
            </CrmCard>

            <CrmCard padding={20}>
              <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 800 }}>④ Schedule</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--crm-fg-2)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6, display: 'block' }}>Start date</label>
                  <input type="date" defaultValue="2026-05-05" style={{ width: '100%', padding: '9px 12px', fontSize: 13, fontFamily: 'inherit', border: '1px solid var(--crm-border-2)', borderRadius: 8, background: '#fff', color: 'var(--crm-fg-1)', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--crm-fg-2)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6, display: 'block' }}>Start time</label>
                  <input type="time" defaultValue="10:00" style={{ width: '100%', padding: '9px 12px', fontSize: 13, fontFamily: 'inherit', border: '1px solid var(--crm-border-2)', borderRadius: 8, background: '#fff', color: 'var(--crm-fg-1)', boxSizing: 'border-box' }} />
                </div>
                <CrmSelect label="Retry rule" value="2x" onChange={() => {}} options={['2× · 4h apart', '3× · 24h apart', 'No retry']} />
              </div>
            </CrmCard>

            <CrmCard padding={20}>
              <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 800 }}>⑤ Compliance &amp; approval</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  ['DNC list checked',  true,  'Auto'],
                  ['Inside calling hours', true, 'Auto'],
                  ['Consent flag present on every row', true, 'Auto'],
                  ['Manager approval', false, 'Pending — Mei Ling W.'],
                ].map(([k, ok, sub]) => (
                  <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: 'var(--crm-bg)', borderRadius: 8 }}>
                    <span style={{ width: 22, height: 22, borderRadius: 999, background: ok ? 'var(--crm-green-soft)' : '#FFF6DD', color: ok ? 'var(--crm-green-deep)' : '#92400E', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CrmIcon name={ok ? 'check' : 'clock'} size={12} />
                    </span>
                    <span style={{ flex: 1, fontSize: 13 }}>{k}</span>
                    <span style={{ fontSize: 11, color: ok ? 'var(--crm-green-deep)' : 'var(--crm-warning)' }}>{sub}</span>
                  </div>
                ))}
              </div>
            </CrmCard>
          </div>

          {/* Right: live estimator */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 0, alignSelf: 'flex-start' }}>
            <CrmCard padding={20} style={{ background: 'linear-gradient(135deg, #0F1A2C, #1A2740)', color: '#fff', border: 'none' }}>
              <div style={{ fontSize: 11, opacity: 0.6, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Live estimate</div>
              <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1 }}>RM 105.00</div>
              <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>250 calls × est. 52s × RM 0.42</div>

              <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,.1)', display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12 }}>
                {[
                  ['Calls planned',     '250'],
                  ['Est. connect rate', '68% · ~170 calls'],
                  ['Est. conversion',   '38% · ~38 bookings'],
                  ['Est. duration',     '17 minutes'],
                  ['Est. cost / conversion', 'RM 2.76'],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ opacity: 0.7 }}>{k}</span>
                    <span style={{ fontWeight: 700 }}>{v}</span>
                  </div>
                ))}
              </div>
            </CrmCard>

            <CrmCard padding={16}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--crm-fg-2)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>Approval</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <CrmAvatar name="Mei Ling Wong" size={32} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>Mei Ling Wong</div>
                  <div style={{ fontSize: 11, color: 'var(--crm-fg-2)' }}>Call Center Lead</div>
                </div>
                <CrmBadge tone="pending" dot>Pending</CrmBadge>
              </div>
              <CrmButton size="sm" variant="green" full icon="send">Send for approval</CrmButton>
              <p style={{ fontSize: 11, color: 'var(--crm-fg-2)', margin: '10px 0 0', lineHeight: 1.5 }}>Campaign will launch automatically once Mei approves.</p>
            </CrmCard>

            <CrmCard padding={16}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--crm-fg-2)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>Last similar campaign</div>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>April Service Reminder</div>
              <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'var(--crm-fg-2)' }}>
                <span>220 calls</span><span>·</span><span>71% conn</span><span>·</span><span>34% conv</span>
              </div>
              <CrmButton size="sm" variant="ghost" full style={{ marginTop: 10 }}>Copy settings →</CrmButton>
            </CrmCard>
          </div>
        </div>
      </div>
    </CrmAppShell>
  );
}

// ────────── 6. Recipient lists ──────────
function RecipientListsScreen() {
  return (
    <CrmAppShell active="campaigns" breadcrumbs={['Call Center', 'Auto Call Campaigns', 'Recipient lists']}
      topRight={<><CrmButton size="sm" variant="secondary" icon="upload">Upload CSV</CrmButton><CrmButton size="sm" variant="green" icon="plus">New list</CrmButton></>}>
      <CrmPageHeader title="Recipient lists" subtitle="Manage the contact lists used across your auto-call campaigns." />

      <div className="crm-scroll" style={{ flex: 1, overflow: 'auto', padding: 24, background: 'var(--crm-bg)' }}>
        <CrmCard padding={0}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1.6fr 90px 100px 1fr 100px 60px',
            padding: '12px 16px', background: '#fafbfc', borderBottom: '1px solid var(--crm-border)',
            fontSize: 11, fontWeight: 700, color: 'var(--crm-fg-2)', textTransform: 'uppercase', letterSpacing: '0.04em',
          }}>
            <span>List</span><span>Rows</span><span>Valid</span><span>Source</span><span>Used in</span><span></span>
          </div>
          {[
            { n: 'May Service Reminders',     rows: 250,  valid: 250,  src: 'CSV upload',   used: '1 camp' },
            { n: 'Subs renewal — May/Jun',    rows: 412,  valid: 408,  src: 'CRM segment',  used: '1 camp' },
            { n: 'Lapsed members 180d',       rows: 1820, valid: 1762, src: 'CRM segment',  used: '2 camps' },
            { n: 'Documents missing',         rows: 220,  valid: 220,  src: 'CSV upload',   used: '1 camp' },
            { n: 'NPS detractors Q1',         rows: 80,   valid: 80,   src: 'CSV upload',   used: '1 camp' },
            { n: 'EV waitlist — KL',          rows: 654,  valid: 612,  src: 'CSV upload',   used: '0 camps' },
          ].map((r, i, arr) => (
            <div key={r.n} style={{
              display: 'grid', gridTemplateColumns: '1.6fr 90px 100px 1fr 100px 60px',
              padding: '14px 16px', alignItems: 'center', fontSize: 12,
              borderBottom: i < arr.length - 1 ? '1px solid var(--crm-border)' : 'none',
            }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{r.n}</div>
                <div style={{ fontSize: 10, color: 'var(--crm-fg-3)', marginTop: 2 }}>Updated 2h ago</div>
              </div>
              <span style={{ fontWeight: 700 }}>{r.rows.toLocaleString()}</span>
              <span style={{ color: 'var(--crm-green-deep)', fontWeight: 700 }}>{r.valid.toLocaleString()}</span>
              <span style={{ color: 'var(--crm-fg-2)' }}>{r.src}</span>
              <span style={{ color: 'var(--crm-fg-2)' }}>{r.used}</span>
              <button style={{ width: 28, height: 28, background: '#fff', border: '1px solid var(--crm-border-2)', borderRadius: 6, cursor: 'pointer' }}><CrmIcon name="moreV" size={13} /></button>
            </div>
          ))}
        </CrmCard>
      </div>
    </CrmAppShell>
  );
}

// ────────── 7. Scheduling + throttling ──────────
function SchedulingScreen() {
  const HOURS = ['7','8','9','10','11','12','13','14','15','16','17','18','19','20'];
  const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const cellState = (d, h) => {
    const hr = parseInt(HOURS[h]);
    if (DAYS[d] === 'Sun') return 'off';
    if (hr < 9 || hr >= 18) return 'off';
    if (DAYS[d] === 'Sat' && hr >= 14) return 'off';
    if (hr >= 12 && hr < 13) return 'soft'; // lunch
    return 'on';
  };

  return (
    <CrmAppShell active="campaigns" breadcrumbs={['Call Center', 'Auto Call Campaigns', 'Scheduling rules']}
      topRight={<CrmButton size="sm" variant="green" icon="check">Save defaults</CrmButton>}>
      <CrmPageHeader title="Scheduling, throttling &amp; retries" subtitle="Org-wide defaults. Individual campaigns can override." />

      <div className="crm-scroll" style={{ flex: 1, overflow: 'auto', padding: 24, background: 'var(--crm-bg)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <CrmCard padding={20}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800 }}>Calling windows</h3>
                  <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--crm-fg-2)' }}>Click cells to toggle. Soft = throttled, off = no calls.</p>
                </div>
                <div style={{ display: 'flex', gap: 14, fontSize: 11 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--crm-green)' }} />Active</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 12, height: 12, borderRadius: 3, background: '#FFE7B0' }} />Throttled</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--crm-bg)', border: '1px solid var(--crm-border-2)' }} />Off</span>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: `60px repeat(${HOURS.length}, 1fr)`, gap: 4 }}>
                <span></span>
                {HOURS.map(h => <span key={h} style={{ fontSize: 10, color: 'var(--crm-fg-3)', textAlign: 'center' }}>{h}</span>)}
                {DAYS.map((d, di) => (
                  <React.Fragment key={d}>
                    <span style={{ fontSize: 11, color: 'var(--crm-fg-2)', fontWeight: 700, alignSelf: 'center' }}>{d}</span>
                    {HOURS.map((h, hi) => {
                      const s = cellState(di, hi);
                      const map = { on: 'var(--crm-green)', soft: '#FFE7B0', off: '#fff' };
                      return <span key={hi} style={{
                        height: 32, borderRadius: 4, background: map[s],
                        border: s === 'off' ? '1px solid var(--crm-border)' : 'none',
                        cursor: 'pointer',
                      }} />;
                    })}
                  </React.Fragment>
                ))}
              </div>
            </CrmCard>

            <CrmCard padding={20}>
              <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 800 }}>Throttling</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--crm-fg-2)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6, display: 'block' }}>Max concurrent calls · 25</label>
                  <input type="range" min="1" max="100" defaultValue="25" style={{ width: '100%', accentColor: 'var(--crm-green)' }} />
                  <div style={{ fontSize: 11, color: 'var(--crm-fg-2)', marginTop: 4 }}>How many bot calls can run simultaneously.</div>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--crm-fg-2)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6, display: 'block' }}>Calls per minute · 15</label>
                  <input type="range" min="1" max="60" defaultValue="15" style={{ width: '100%', accentColor: 'var(--crm-green)' }} />
                  <div style={{ fontSize: 11, color: 'var(--crm-fg-2)', marginTop: 4 }}>Pacing rate. Drops if connect rate &lt; 50%.</div>
                </div>
              </div>
            </CrmCard>

            <CrmCard padding={20}>
              <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 800 }}>Retry rules</h3>
              {[
                { trigger: 'No answer',          retries: 2, gap: '4h', tone: 'on' },
                { trigger: 'Voicemail',          retries: 1, gap: '24h', tone: 'on' },
                { trigger: 'Busy',               retries: 3, gap: '30m', tone: 'on' },
                { trigger: 'Customer hung up',   retries: 0, gap: '—',   tone: 'off' },
                { trigger: 'Network error',      retries: 2, gap: '15m', tone: 'on' },
              ].map((r, i, arr) => (
                <div key={r.trigger} style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--crm-border)' : 'none', fontSize: 13 }}>
                  <span style={{ fontWeight: 600 }}>{r.trigger}</span>
                  <span style={{ color: 'var(--crm-fg-2)' }}>Retry <b style={{ color: 'var(--crm-fg-1)' }}>{r.retries}×</b></span>
                  <span style={{ color: 'var(--crm-fg-2)' }}>after <b style={{ color: 'var(--crm-fg-1)' }}>{r.gap}</b></span>
                  <span style={{ width: 32, height: 18, borderRadius: 999, background: r.tone === 'on' ? 'var(--crm-green)' : 'var(--crm-border-2)', position: 'relative', justifySelf: 'end' }}>
                    <span style={{ position: 'absolute', top: 2, left: r.tone === 'on' ? 16 : 2, width: 14, height: 14, borderRadius: 999, background: '#fff' }} />
                  </span>
                </div>
              ))}
            </CrmCard>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <CrmCard padding={16}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--crm-fg-2)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>What this means</div>
              <p style={{ fontSize: 12, color: 'var(--crm-fg-1)', lineHeight: 1.6, margin: 0 }}>
                With these defaults you'll dial roughly <b>5,400 calls / week</b>, never before 9am or after 6pm, and respect Saturday afternoons + Sundays.
              </p>
            </CrmCard>
            <CrmCard padding={16}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--crm-fg-2)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>Compliance</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12 }}>
                {[
                  'Within MY consumer-call hours',
                  'Respects DNC registry',
                  '15-min grace before retry on busy',
                  'Logs every attempt for audit',
                ].map(t => (
                  <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 16, height: 16, borderRadius: 999, background: 'var(--crm-green-soft)', color: 'var(--crm-green-deep)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><CrmIcon name="check" size={10} /></span>
                    {t}
                  </div>
                ))}
              </div>
            </CrmCard>
          </div>
        </div>
      </div>
    </CrmAppShell>
  );
}

// Pulse keyframe (used by Kanban cards + detail screen)
if (typeof document !== 'undefined' && !document.getElementById('crm-pulse-kf')) {
  const s = document.createElement('style');
  s.id = 'crm-pulse-kf';
  s.textContent = '@keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(9,167,126,.35) } 70% { box-shadow: 0 0 0 8px rgba(9,167,126,0) } 100% { box-shadow: 0 0 0 0 rgba(9,167,126,0) } }';
  document.head.appendChild(s);
}

Object.assign(window, {
  CampaignsKanban,
  CampaignsDashboard,
  CampaignsControlRoom,
  CampaignDetailScreen,
  CampaignBuilderV2,
  RecipientListsScreen,
  SchedulingScreen,
});
