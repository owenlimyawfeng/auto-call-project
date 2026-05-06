// Call Logs (redesign of provided screenshot) + Single Call Detail

const LOG_ROWS = [
  { id: 'L1', when: '03/05/26 10:42', code: '#6FES9V', dir: 'inbound',  type: 'agent', phone: '+60 12-345 7890', contact: 'Aisyah Rahman', agent: 'Sai C.',     dur: '4m 22s', summary: 'Lost & found — AirPods in VPQ 7400. Ticket TK-1284 raised.', sentiment: 'positive', status: 'completed', recording: true },
  { id: 'L2', when: '03/05/26 10:38', code: '#V28QLC', dir: 'outbound', type: 'bot',   phone: '+60 16-887 1129', contact: 'Daniel Tan',     agent: 'Sharing AI', dur: '0m 48s', summary: 'Customer requested booking link for later this week.',          sentiment: 'positive', status: 'completed', recording: true },
  { id: 'L3', when: '03/05/26 10:21', code: '#C8VDQ8', dir: 'outbound', type: 'bot',   phone: '+84 974 066 422', contact: 'Hoang Huy',      agent: 'Sharing AI', dur: '0m 44s', summary: 'Customer undecided about booking maintenance.',                  sentiment: 'neutral',  status: 'completed', recording: true },
  { id: 'L4', when: '03/05/26 09:59', code: '#JWYS4D', dir: 'outbound', type: 'bot',   phone: '+60 16-880 4422', contact: 'Kyle Ng',        agent: 'Sharing AI', dur: '0m 06s', summary: '—',                                                              sentiment: '—',        status: 'missed',    recording: false },
  { id: 'L5', when: '03/05/26 09:42', code: '#UZBGFZ', dir: 'outbound', type: 'bot',   phone: '+60 19-887 4521', contact: 'Mr. Ben',        agent: 'Garage AI',  dur: '0m 57s', summary: 'Customer requested to speak with a human — escalated.',          sentiment: 'negative', status: 'escalated', recording: true, flag: true },
  { id: 'L6', when: '03/05/26 09:31', code: '#L9M5CZ', dir: 'inbound',  type: 'agent', phone: '+60 16-377 1829', contact: 'Sai',            agent: 'Lishalinee',  dur: '1m 33s', summary: 'Customer requested booking link for Melaka.',                    sentiment: 'positive', status: 'completed', recording: true },
  { id: 'L7', when: '02/05/26 18:06', code: '#43YMNS', dir: 'outbound', type: 'bot',   phone: '+84 974 066 422', contact: 'Mr. Huy Ken',    agent: 'Sharing AI', dur: '0m 20s', summary: 'No payment discussed; document upload reminder sent.',           sentiment: 'neutral',  status: 'completed', recording: true },
  { id: 'L8', when: '02/05/26 17:35', code: '#8LWRBL', dir: 'outbound', type: 'bot',   phone: '+60 12-734 5779', contact: 'Owen Lim',       agent: 'Sharing AI', dur: '1m 22s', summary: 'Customer did not respond to payment reminder.',                  sentiment: 'neutral',  status: 'completed', recording: true },
  { id: 'L9', when: '02/05/26 15:18', code: '#AENG6C', dir: 'inbound',  type: 'agent', phone: '+60 12-734 5779', contact: 'Owen Lim',       agent: 'Naili A.',    dur: '3m 11s', summary: 'Customer booked payment-related service appointment.',           sentiment: 'positive', status: 'completed', recording: true },
  { id: 'L10', when: '02/05/26 14:45', code: '#Q2WRTB', dir: 'outbound', type: 'agent', phone: '+60 17-201 6633', contact: 'Jia Min',        agent: 'Sai C.',     dur: '7m 14s', summary: 'Walkthrough of Subs vs Sharing — leaning Subs.',                 sentiment: 'positive', status: 'completed', recording: true },
];

function dirIcon(dir, status) {
  if (status === 'missed') return { icon: 'phoneMissed', color: 'var(--crm-danger)' };
  if (dir === 'inbound')   return { icon: 'phoneIn',  color: 'var(--crm-info)' };
  return { icon: 'phoneOut', color: 'var(--crm-green)' };
}

function SentimentDot({ value }) {
  if (value === '—' || !value) return <span style={{ color: 'var(--crm-fg-3)', fontSize: 11 }}>—</span>;
  const map = {
    positive: { c: '#22C55E', l: 'Positive' },
    neutral:  { c: '#E0A100', l: 'Neutral' },
    negative: { c: '#D8443C', l: 'Negative' },
  }[value] || { c: '#9A999C', l: value };
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--crm-fg-1)' }}>
      <span style={{ width: 8, height: 8, borderRadius: 999, background: map.c }} />
      {map.l}
    </span>
  );
}

function CallLogsScreen() {
  const [tab, setTab] = useState('all');
  const [selected, setSelected] = useState(null);

  return (
    <CrmAppShell active="logs" breadcrumbs={['Call Center', 'Call Logs']}
      topRight={<><CrmButton variant="secondary" size="sm" icon="download">Export CSV</CrmButton><CrmButton variant="green" size="sm" icon="upload">Upload CSV</CrmButton></>}>
      <CrmPageHeader title="Call Logs" subtitle="Every inbound, outbound, and bot call across the workspace."
        tabs={[
          { id: 'all', label: 'All', count: 1284 },
          { id: 'inbound', label: 'Inbound', count: 412 },
          { id: 'outbound', label: 'Outbound', count: 872 },
          { id: 'bot', label: 'Bot calls', count: 645 },
          { id: 'missed', label: 'Missed & failed', count: 47 },
        ]}
        activeTab={tab} onTab={setTab}
        right={<>
          <CrmButton variant="secondary" size="sm" icon="filter">Filters</CrmButton>
          <CrmButton variant="secondary" size="sm" icon="cal">Today</CrmButton>
        </>}/>

      {/* KPI strip */}
      <div style={{ padding: '16px 24px 0', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
        <CrmKPI label="Calls today"   value="142"   delta="+18%" icon="phone" sub="vs yesterday" />
        <CrmKPI label="Answer rate"   value="91.3%" delta="+2.1pp" icon="phoneIn" />
        <CrmKPI label="Avg handle"    value="3m 41s" delta="−12s" icon="clock" sub="target ≤ 4m" />
        <CrmKPI label="Bot deflect"   value="58%"   delta="+4pp" icon="bot" sub="of inbound" />
        <CrmKPI label="Sentiment"     value="+72"   delta="+5" icon="smile" sub="100 = max positive" />
      </div>

      {/* Filter row */}
      <div style={{ padding: '16px 24px 12px', display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <CrmInput placeholder="Search phone, contact, code…" icon="search" style={{ flex: '1 1 280px', maxWidth: 360 }} />
        <CrmSelect value="all" onChange={() => {}} options={[{ value: 'all', label: 'All agents' }, { value: 'me', label: 'My calls' }]} style={{ width: 160 }} />
        <CrmSelect value="all" onChange={() => {}} options={[{ value: 'all', label: 'All services' }, { value: 'sharing', label: 'GoCar Sharing' }, { value: 'subs', label: 'GoCar Subs' }]} style={{ width: 160 }} />
        <CrmSelect value="all" onChange={() => {}} options={[{ value: 'all', label: 'All sentiment' }, { value: 'pos', label: 'Positive' }, { value: 'neg', label: 'Negative' }]} style={{ width: 160 }} />
        <span style={{ flex: 1 }} />
        <span style={{ fontSize: 12, color: 'var(--crm-fg-2)' }}>1,284 calls · 03 Apr → 03 May</span>
      </div>

      {/* Table */}
      <div style={{ padding: '0 24px 24px', flex: 1, overflowY: 'auto' }}>
        <CrmCard padding={0} style={{ overflow: 'hidden' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '160px 110px 1fr 140px 130px 90px 1fr 130px 110px 60px',
            gap: 0, padding: '12px 16px', background: '#fafbfc',
            borderBottom: '1px solid var(--crm-border)', fontSize: 11, fontWeight: 700,
            color: 'var(--crm-fg-2)', textTransform: 'uppercase', letterSpacing: '0.04em',
          }}>
            <span>Date / Type</span>
            <span>Code</span>
            <span>Contact</span>
            <span>Phone</span>
            <span>Agent / Bot</span>
            <span>Duration</span>
            <span>Summary</span>
            <span>Sentiment</span>
            <span>Status</span>
            <span></span>
          </div>
          {LOG_ROWS.map((r, i) => {
            const di = dirIcon(r.dir, r.status);
            const isSel = selected === r.id;
            return (
              <button key={r.id} onClick={() => setSelected(r.id)} style={{
                display: 'grid', gridTemplateColumns: '160px 110px 1fr 140px 130px 90px 1fr 130px 110px 60px',
                gap: 0, padding: '14px 16px', alignItems: 'center', textAlign: 'left',
                background: isSel ? 'var(--crm-green-soft)' : (r.flag ? '#FEF8F7' : '#fff'),
                border: 'none', borderBottom: i < LOG_ROWS.length - 1 ? '1px solid var(--crm-border)' : 'none',
                cursor: 'pointer', fontFamily: 'inherit', width: '100%',
              }}>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--crm-fg-1)', fontWeight: 600 }}>{r.when}</div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                    <CrmBadge tone={r.dir}>
                      <CrmIcon name={di.icon} size={10} />
                      {r.dir}
                    </CrmBadge>
                    {r.type === 'bot' && <CrmBadge tone="bot" size="sm">Bot</CrmBadge>}
                  </div>
                </div>
                <span style={{ fontSize: 12, fontFamily: 'ui-monospace, monospace', color: 'var(--crm-fg-1)', fontWeight: 600 }}>{r.code}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                  <CrmAvatar name={r.contact} size={28} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--crm-fg-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.contact}</span>
                </div>
                <span style={{ fontSize: 12, color: 'var(--crm-fg-2)', fontFamily: 'ui-monospace, monospace' }}>{r.phone}</span>
                <span style={{ fontSize: 12, color: 'var(--crm-fg-1)' }}>{r.agent}</span>
                <span style={{ fontSize: 12, color: 'var(--crm-fg-1)', fontWeight: 600 }}>{r.dur}</span>
                <span style={{ fontSize: 12, color: 'var(--crm-fg-2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: 12 }}>{r.summary}</span>
                <SentimentDot value={r.sentiment} />
                <CrmBadge tone={r.status === 'missed' ? 'missed' : r.status === 'escalated' ? 'pending' : 'completed'}>
                  {r.status}
                </CrmBadge>
                <span style={{ display: 'flex', justifyContent: 'flex-end', gap: 4 }}>
                  {r.recording && <CrmIcon name="play" size={14} style={{ color: 'var(--crm-fg-2)' }} />}
                  <CrmIcon name="chevR" size={14} style={{ color: 'var(--crm-fg-3)' }} />
                </span>
              </button>
            );
          })}
        </CrmCard>
      </div>
    </CrmAppShell>
  );
}

// ────────── Single call detail ──────────
const DETAIL_TRANSCRIPT = [
  { who: 'agent',    t: '00:00', text: 'Hi, this is Sai from GoCar. Am I speaking with Aisyah?' },
  { who: 'customer', t: '00:04', text: 'Hi yes, this is Aisyah. I think I left my AirPods in the car I just returned.' },
  { who: 'agent',    t: '00:11', text: 'Sorry to hear that — let me pull up the booking. Was this the Bezza, plate VPQ 7400?' },
  { who: 'customer', t: '00:17', text: 'Yes, that\'s the one. Returned it at Mont Kiara about an hour ago.' },
  { who: 'agent',    t: '00:22', text: 'I see VPQ 7400 returned at 09:54. I\'ll raise a Lost & Found ticket right now and get our fleet team to check the car within 4 hours.', highlight: true },
  { who: 'customer', t: '00:34', text: 'Great. Will I get an update by SMS?' },
  { who: 'agent',    t: '00:38', text: 'Yes — once we find them we\'ll text you and arrange pickup or delivery. Anything else I can help with?' },
  { who: 'customer', t: '00:46', text: 'No that\'s all, thank you so much!' },
  { who: 'agent',    t: '00:49', text: 'Drive safe, Aisyah. Talk to you soon.' },
];

function CallDetailScreen() {
  return (
    <CrmAppShell active="logs" breadcrumbs={['Call Center', 'Call Logs', '#6FES9V']}
      topRight={<><CrmButton variant="secondary" size="sm" icon="download">Download recording</CrmButton><CrmButton variant="primary" size="sm" icon="ticket">Linked ticket TK-1284</CrmButton></>}>
      <div className="crm-scroll" style={{ flex: 1, overflowY: 'auto', background: 'var(--crm-bg)', padding: 24 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 }}>
          {/* Main column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
            {/* Header */}
            <CrmCard padding={20}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <CrmAvatar name="Aisyah Rahman" size={56} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Aisyah Rahman</h2>
                    <CrmBadge tone="inbound" dot>Inbound</CrmBadge>
                    <CrmBadge tone="completed">Completed</CrmBadge>
                    <span style={{ fontSize: 12, color: 'var(--crm-fg-2)', fontFamily: 'ui-monospace, monospace' }}>#6FES9V</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--crm-fg-2)', marginTop: 6, display: 'flex', gap: 16 }}>
                    <span>+60 12-345 7890</span>
                    <span>·</span>
                    <span>03 May 2026 · 10:42</span>
                    <span>·</span>
                    <span>Handled by Sai Chang Choo</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em' }}>4m 22s</div>
                  <div style={{ fontSize: 11, color: 'var(--crm-fg-2)' }}>Duration</div>
                </div>
              </div>
            </CrmCard>

            {/* Audio player */}
            <CrmCard padding={16} title="Recording" right={<>
              <CrmButton size="sm" variant="ghost" icon="download">Download</CrmButton>
              <CrmButton size="sm" variant="ghost" icon="copy">Copy link</CrmButton>
            </>}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <button style={{
                  width: 48, height: 48, borderRadius: 999, background: 'var(--crm-green)',
                  border: 'none', color: '#fff', cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 6px 14px rgba(9,167,126,.28)',
                }}><CrmIcon name="play" size={20} /></button>
                <div style={{ flex: 1 }}>
                  <div style={{ height: 36, background: 'var(--crm-bg)', borderRadius: 6, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', padding: '0 4px', gap: 1 }}>
                    {Array.from({ length: 64 }).map((_, i) => {
                      const h = 6 + Math.abs(Math.sin(i * 0.55) * 18) + (i % 4) * 2;
                      const past = i < 18;
                      return <span key={i} style={{ flex: 1, height: h, background: past ? 'var(--crm-green)' : 'var(--crm-border-2)', borderRadius: 1 }} />;
                    })}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11, color: 'var(--crm-fg-2)', fontFamily: 'ui-monospace, monospace' }}>
                    <span>01:14</span><span>4:22</span>
                  </div>
                </div>
                <CrmButton size="sm" variant="secondary">1.0×</CrmButton>
              </div>
            </CrmCard>

            {/* AI summary */}
            <CrmCard padding={20}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #cfede4, #09A77E)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}><CrmIcon name="sparkle" size={15} /></span>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800 }}>AI Summary</h3>
                <span style={{ fontSize: 11, color: 'var(--crm-fg-2)' }}>Generated 2 min after call</span>
              </div>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.65, color: 'var(--crm-fg-1)' }}>
                Customer reported leaving AirPods in returned vehicle (Bezza, VPQ 7400) at Mont Kiara. Agent confirmed return time, raised Lost &amp; Found ticket TK-1284, and committed to a 4-hour fleet check + SMS update. Customer was satisfied and ended the call positively.
              </p>
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--crm-border)' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--crm-fg-2)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>Action items</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { done: true, text: 'Raised L&F ticket TK-1284' },
                    { done: false, text: 'Fleet team to check VPQ 7400 within 4h' },
                    { done: false, text: 'SMS update to customer' },
                  ].map((a, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
                      <span style={{
                        width: 18, height: 18, borderRadius: 4,
                        background: a.done ? 'var(--crm-green)' : '#fff',
                        border: a.done ? 'none' : '1.5px solid var(--crm-border-2)',
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
                      }}>{a.done && <CrmIcon name="check" size={12} />}</span>
                      <span style={{ textDecoration: a.done ? 'line-through' : 'none', color: a.done ? 'var(--crm-fg-2)' : 'var(--crm-fg-1)' }}>{a.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CrmCard>

            {/* Transcript */}
            <CrmCard padding={0} title="Transcript" right={<CrmButton size="sm" variant="ghost" icon="copy">Copy all</CrmButton>}>
              <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
                {DETAIL_TRANSCRIPT.map((m, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 10, color: 'var(--crm-fg-3)', fontFamily: 'ui-monospace, monospace', width: 36, paddingTop: 4 }}>{m.t}</span>
                    <CrmAvatar name={m.who === 'agent' ? 'Sai Chang Choo' : 'Aisyah Rahman'} size={28} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11, color: 'var(--crm-fg-2)', marginBottom: 3, fontWeight: 600 }}>
                        {m.who === 'agent' ? 'Sai (agent)' : 'Aisyah (customer)'}
                      </div>
                      <div style={{
                        padding: '8px 12px',
                        background: m.highlight ? 'var(--crm-green-soft)' : 'var(--crm-bg)',
                        border: m.highlight ? '1px solid var(--crm-green)' : '1px solid var(--crm-border)',
                        borderRadius: 8,
                        fontSize: 13, color: 'var(--crm-fg-1)', lineHeight: 1.55,
                      }}>{m.text}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CrmCard>
          </div>

          {/* Side rail */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <CrmCard padding={16}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--crm-fg-2)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>Sentiment over time</div>
              <CrmSpark data={[60, 65, 55, 50, 58, 70, 78, 82, 80, 85]} fill height={48} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--crm-fg-2)', marginTop: 6 }}>
                <span>Start</span><span>+72 avg</span><span>End</span>
              </div>
            </CrmCard>
            <CrmCard padding={16}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--crm-fg-2)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>Topics mentioned</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {[['Lost item', 4], ['VPQ 7400', 3], ['SMS update', 2], ['Mont Kiara', 1], ['SLA', 1]].map(([t, n]) => (
                  <span key={t} style={{ padding: '4px 10px', background: 'var(--crm-bg)', borderRadius: 999, fontSize: 11, fontWeight: 600 }}>
                    {t} <span style={{ color: 'var(--crm-fg-3)' }}>· {n}</span>
                  </span>
                ))}
              </div>
            </CrmCard>
            <CrmCard padding={16}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--crm-fg-2)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>Linked records</div>
              {[
                { icon: 'ticket', label: 'TK-1284 — Lost AirPods', tone: 'pending' },
                { icon: 'briefcase', label: 'Booking VPQ 7400', tone: 'completed' },
                { icon: 'user', label: 'Aisyah Rahman (Gold)', tone: null },
              ].map((l, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < 2 ? '1px solid var(--crm-border)' : 'none' }}>
                  <span style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--crm-green-soft)', color: 'var(--crm-green-deep)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CrmIcon name={l.icon} size={14} />
                  </span>
                  <span style={{ flex: 1, fontSize: 12, fontWeight: 600 }}>{l.label}</span>
                  <CrmIcon name="chevR" size={14} style={{ color: 'var(--crm-fg-3)' }} />
                </div>
              ))}
            </CrmCard>
            <CrmCard padding={16}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--crm-fg-2)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>QA score</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontSize: 28, fontWeight: 800, color: 'var(--crm-green)' }}>9.2</span>
                <span style={{ fontSize: 12, color: 'var(--crm-fg-2)' }}>/ 10 · Excellent</span>
              </div>
              <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {[['Greeting & ID', 10], ['Empathy', 9], ['Resolution', 9], ['Wrap-up', 9]].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                    <span style={{ flex: 1, color: 'var(--crm-fg-2)' }}>{k}</span>
                    <span style={{ width: 80, height: 4, background: 'var(--crm-bg)', borderRadius: 999, overflow: 'hidden' }}>
                      <span style={{ display: 'block', width: `${v * 10}%`, height: '100%', background: 'var(--crm-green)' }} />
                    </span>
                    <span style={{ fontWeight: 600 }}>{v}</span>
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

Object.assign(window, { CallLogsScreen, CallDetailScreen });
