// Reports / dashboard for managers + Customer profile screen

const VOLUME_DATA = [320, 380, 410, 450, 420, 510, 480, 520, 540, 580, 560, 610, 640, 620];
const SLA_DATA    = [88, 90, 91, 89, 92, 93, 91, 94, 92, 93, 95, 94, 92, 93];
const BOT_DATA    = [42, 48, 51, 55, 58, 56, 60, 62, 61, 64, 65, 63, 67, 68];

function ReportsScreen() {
  const [tab, setTab] = useState('volume');
  return (
    <CrmAppShell active="reports" breadcrumbs={['Call Center', 'Reports']}
      topRight={<>
        <CrmSelect value="30d" onChange={() => {}} options={[
          { value: '7d', label: 'Last 7 days' },
          { value: '30d', label: 'Last 30 days' },
          { value: 'qtd', label: 'Quarter to date' },
        ]} style={{ width: 160 }}/>
        <CrmButton variant="secondary" size="sm" icon="download">Export</CrmButton>
      </>}>
      <CrmPageHeader title="Reports" subtitle="Live operational view across calls, bots, and campaigns."
        tabs={[
          { id: 'volume',    label: 'Volume & SLA' },
          { id: 'bot',       label: 'Bot performance' },
          { id: 'campaign',  label: 'Campaign ROI' },
          { id: 'agent',     label: 'Agent leaderboard' },
        ]} activeTab={tab} onTab={setTab}/>

      <div className="crm-scroll" style={{ flex: 1, overflowY: 'auto', padding: 24, background: 'var(--crm-bg)' }}>
        {/* Top KPI strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 20 }}>
          <CrmKPI label="Calls (30d)"  value="14,821" delta="+22%" icon="phone" />
          <CrmKPI label="Answer rate"  value="91.3%" delta="+2.1pp" icon="phoneIn" />
          <CrmKPI label="AHT"          value="3m 41s" delta="−12s" icon="clock" sub="↓ better" />
          <CrmKPI label="Abandonment"  value="3.2%"   delta="−0.6pp" icon="phoneMissed" deltaTone="up" />
          <CrmKPI label="CSAT"         value="4.6 / 5" delta="+0.2" icon="smile" />
        </div>

        {/* Main chart */}
        <CrmCard padding={20} style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800 }}>Call volume vs answer rate</h3>
              <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--crm-fg-2)' }}>Daily, last 14 days</p>
            </div>
            <div style={{ display: 'flex', gap: 14, fontSize: 12 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--crm-green)' }} />Calls</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 2, background: 'var(--crm-info)' }} />Answer %</span>
            </div>
          </div>
          {/* Chart */}
          <div style={{ position: 'relative', height: 240, paddingLeft: 36, paddingBottom: 24 }}>
            {/* Y axis */}
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontSize: 10, color: 'var(--crm-fg-3)' }}>
              {[700, 525, 350, 175, 0].map(v => <span key={v}>{v}</span>)}
            </div>
            {/* Bars */}
            <div style={{ position: 'absolute', left: 36, right: 0, top: 0, bottom: 24, display: 'flex', alignItems: 'flex-end', gap: 6 }}>
              {VOLUME_DATA.map((v, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: '100%', height: `${v / 700 * 100}%`, background: 'var(--crm-green)', borderRadius: '4px 4px 0 0', position: 'relative' }}>
                    {i === 13 && <span style={{ position: 'absolute', top: -22, left: '50%', transform: 'translateX(-50%)', fontSize: 11, fontWeight: 700, color: 'var(--crm-fg-1)' }}>{v}</span>}
                  </div>
                </div>
              ))}
            </div>
            {/* Line overlay */}
            <svg style={{ position: 'absolute', left: 36, right: 0, top: 0, bottom: 24, width: 'calc(100% - 36px)', height: 'calc(100% - 24px)', overflow: 'visible' }} preserveAspectRatio="none" viewBox="0 0 100 100">
              <polyline fill="none" stroke="var(--crm-info)" strokeWidth="0.6" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round"
                points={SLA_DATA.map((v, i) => `${(i + 0.5) / SLA_DATA.length * 100},${100 - ((v - 80) / 20) * 100}`).join(' ')} />
              {SLA_DATA.map((v, i) => (
                <circle key={i} cx={(i + 0.5) / SLA_DATA.length * 100} cy={100 - ((v - 80) / 20) * 100} r="1" fill="#fff" stroke="var(--crm-info)" strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
              ))}
            </svg>
            {/* X axis */}
            <div style={{ position: 'absolute', left: 36, right: 0, bottom: 0, display: 'flex', fontSize: 10, color: 'var(--crm-fg-3)' }}>
              {['Apr 20','21','22','23','24','25','26','27','28','29','30','May 1','2','3'].map(d => <span key={d} style={{ flex: 1, textAlign: 'center' }}>{d}</span>)}
            </div>
          </div>
        </CrmCard>

        {/* Two-column row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16, marginBottom: 16 }}>
          <CrmCard padding={20}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800 }}>Bot deflection rate</h3>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--crm-fg-2)' }}>Calls fully resolved by bot, no human handoff</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--crm-green-deep)' }}>68%</div>
                <div style={{ fontSize: 11, color: 'var(--crm-green)' }}>+5pp vs prior period</div>
              </div>
            </div>
            <CrmSpark data={BOT_DATA} fill height={120} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--crm-border)' }}>
              {[
                ['Successful resolves', '4,123'],
                ['Handoff to agent', '1,540'],
                ['Avg bot duration', '54s'],
              ].map(([k, v]) => (
                <div key={k}>
                  <div style={{ fontSize: 11, color: 'var(--crm-fg-2)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700 }}>{k}</div>
                  <div style={{ fontSize: 18, fontWeight: 800, marginTop: 2 }}>{v}</div>
                </div>
              ))}
            </div>
          </CrmCard>

          <CrmCard padding={20}>
            <h3 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 800 }}>Sentiment breakdown</h3>
            <p style={{ margin: '0 0 18px', fontSize: 12, color: 'var(--crm-fg-2)' }}>Across all completed calls</p>

            {/* Donut */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <svg width="120" height="120" viewBox="0 0 36 36" style={{ flexShrink: 0 }}>
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="var(--crm-bg)" strokeWidth="3.5" />
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#22C55E" strokeWidth="3.5" strokeDasharray="68 32" strokeDashoffset="25" transform="rotate(-90 18 18)" />
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#E0A100" strokeWidth="3.5" strokeDasharray="22 78" strokeDashoffset="-43" transform="rotate(-90 18 18)" />
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#D8443C" strokeWidth="3.5" strokeDasharray="10 90" strokeDashoffset="-65" transform="rotate(-90 18 18)" />
                <text x="18" y="19" textAnchor="middle" fontSize="6" fontWeight="800" fill="var(--crm-fg-1)">+72</text>
              </svg>
              <div style={{ flex: 1 }}>
                {[
                  ['Positive', 68, '#22C55E'],
                  ['Neutral',  22, '#E0A100'],
                  ['Negative', 10, '#D8443C'],
                ].map(([l, p, c]) => (
                  <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, fontSize: 13 }}>
                    <span style={{ width: 10, height: 10, borderRadius: 2, background: c }} />
                    <span style={{ flex: 1, color: 'var(--crm-fg-2)' }}>{l}</span>
                    <span style={{ fontWeight: 700 }}>{p}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CrmCard>
        </div>

        {/* Agent leaderboard */}
        <CrmCard padding={0}>
          <div style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--crm-border)' }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800 }}>Agent leaderboard</h3>
            <CrmButton size="sm" variant="ghost">View all</CrmButton>
          </div>
          <div style={{
            display: 'grid', gridTemplateColumns: '40px 1fr 110px 110px 110px 110px 130px',
            padding: '10px 20px', background: '#fafbfc', borderBottom: '1px solid var(--crm-border)',
            fontSize: 11, fontWeight: 700, color: 'var(--crm-fg-2)', textTransform: 'uppercase', letterSpacing: '0.04em',
          }}>
            <span>#</span><span>Agent</span><span>Calls</span><span>AHT</span><span>CSAT</span><span>Sentiment</span><span>QA score</span>
          </div>
          {[
            { n: 'Sai Chang Choo', calls: 287, aht: '3m 22s', csat: '4.8', sent: 84, qa: 9.2 },
            { n: 'Naili Aishah',   calls: 264, aht: '3m 48s', csat: '4.7', sent: 79, qa: 9.0 },
            { n: 'Lishalinee K.',  calls: 251, aht: '3m 35s', csat: '4.7', sent: 78, qa: 8.9 },
            { n: 'Faiz Hakim',     calls: 233, aht: '4m 02s', csat: '4.6', sent: 72, qa: 8.7 },
            { n: 'Mei Ling Wong',  calls: 221, aht: '3m 51s', csat: '4.5', sent: 71, qa: 8.6 },
          ].map((a, i) => (
            <div key={a.n} style={{
              display: 'grid', gridTemplateColumns: '40px 1fr 110px 110px 110px 110px 130px',
              padding: '14px 20px', alignItems: 'center', fontSize: 13,
              borderBottom: i < 4 ? '1px solid var(--crm-border)' : 'none',
            }}>
              <span style={{ fontWeight: 800, color: i === 0 ? 'var(--crm-green-deep)' : 'var(--crm-fg-2)' }}>{i + 1}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <CrmAvatar name={a.n} size={30} />
                <span style={{ fontWeight: 700 }}>{a.n}</span>
              </div>
              <span style={{ fontWeight: 600 }}>{a.calls}</span>
              <span>{a.aht}</span>
              <span>★ {a.csat}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ flex: 1, height: 5, background: 'var(--crm-bg)', borderRadius: 999, overflow: 'hidden', maxWidth: 70 }}>
                  <span style={{ display: 'block', width: `${a.sent}%`, height: '100%', background: 'var(--crm-green)' }} />
                </span>
                <span style={{ fontSize: 11, color: 'var(--crm-fg-2)' }}>+{a.sent}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontWeight: 800, color: 'var(--crm-green-deep)' }}>{a.qa}</span>
                <span style={{ fontSize: 11, color: 'var(--crm-fg-3)' }}>/ 10</span>
              </div>
            </div>
          ))}
        </CrmCard>
      </div>
    </CrmAppShell>
  );
}

// ────────── Customer profile during call ──────────
function CustomerProfileScreen() {
  return (
    <CrmAppShell active="customers" breadcrumbs={['Customers', 'Aisyah Rahman']}
      topRight={<><CrmButton variant="secondary" size="sm" icon="mail">Email</CrmButton><CrmButton variant="green" size="sm" icon="phoneOut">Call</CrmButton></>}>
      <div className="crm-scroll" style={{ flex: 1, overflowY: 'auto', padding: 24, background: 'var(--crm-bg)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20 }}>
          {/* Left identity card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <CrmCard padding={20} style={{ textAlign: 'center' }}>
              <CrmAvatar name="Aisyah Rahman" size={72} />
              <h2 style={{ margin: '12px 0 4px', fontSize: 18, fontWeight: 800 }}>Aisyah Rahman</h2>
              <div style={{ fontSize: 12, color: 'var(--crm-fg-2)' }}>Member · Joined Mar 2023</div>
              <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 10 }}>
                <CrmBadge tone="completed" dot>Verified</CrmBadge>
                <CrmBadge tone="bot" size="sm">Gold tier</CrmBadge>
              </div>
            </CrmCard>
            <CrmCard padding={16}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--crm-fg-2)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>Contact</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
                {[
                  ['phone', '+60 12-345 7890'],
                  ['mail',  'aisyah.r@example.my'],
                  ['pin',   'Mont Kiara, KL'],
                  ['cal',   'Last seen · 2h ago'],
                ].map(([i, v]) => (
                  <div key={v} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <CrmIcon name={i} size={14} style={{ color: 'var(--crm-fg-2)' }} />
                    <span>{v}</span>
                  </div>
                ))}
              </div>
            </CrmCard>
            <CrmCard padding={16}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--crm-fg-2)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>Lifetime value</div>
              <div style={{ fontSize: 24, fontWeight: 800 }}>RM 14,820</div>
              <CrmSpark data={[200, 320, 280, 410, 380, 460, 520, 480, 540, 610, 580, 660]} fill height={50} />
              <div style={{ fontSize: 11, color: 'var(--crm-fg-2)', marginTop: 6 }}>148 bookings · 4 vehicles owned</div>
            </CrmCard>
          </div>

          {/* Right tabs / content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* KPI row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              <CrmKPI label="Bookings (90d)" value="22" delta="+5" icon="briefcase" />
              <CrmKPI label="Open tickets" value="1" icon="ticket" sub="TK-1284" />
              <CrmKPI label="CSAT avg" value="4.8" icon="smile" />
              <CrmKPI label="Calls (90d)" value="11" icon="phone" />
            </div>

            {/* Tabs */}
            <div style={{ background: '#fff', borderRadius: 'var(--crm-radius)', border: '1px solid var(--crm-border)', boxShadow: 'var(--crm-shadow-sm)' }}>
              <div style={{ display: 'flex', borderBottom: '1px solid var(--crm-border)', padding: '0 16px' }}>
                {['Overview', 'Bookings', 'Vehicles', 'Tickets', 'Calls', 'Documents'].map((t, i) => (
                  <button key={t} style={{
                    padding: '14px 14px 12px', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                    fontSize: 13, fontWeight: i === 0 ? 700 : 500, color: i === 0 ? 'var(--crm-fg-1)' : 'var(--crm-fg-2)',
                    borderBottom: i === 0 ? '2px solid var(--crm-green)' : '2px solid transparent',
                  }}>{t}</button>
                ))}
              </div>

              {/* Recent bookings */}
              <div style={{ padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800 }}>Recent bookings</h3>
                  <CrmButton size="sm" variant="ghost" iconRight="chevR">View all</CrmButton>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { plate: 'VPQ 7400', model: 'Perodua Bezza', date: 'Today · 08:42 → 09:54', loc: 'Mont Kiara', status: 'completed', cost: 'RM 38' },
                    { plate: 'JQQ 704',  model: 'Honda City',     date: '28 Apr · 14:00 → 22:00', loc: 'KL Sentral', status: 'completed', cost: 'RM 124' },
                    { plate: 'AKH 4448', model: 'Toyota Vios',    date: '14 Apr · 10:00 → 18:00', loc: 'Petaling Jaya', status: 'completed', cost: 'RM 96' },
                    { plate: 'BNV 8821', model: 'Perodua Myvi',   date: '10 May · 09:00 → 18:00', loc: 'Bangsar', status: 'pending',   cost: 'RM 110' },
                  ].map((b, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', background: 'var(--crm-bg)', borderRadius: 8 }}>
                      <span style={{ width: 40, height: 40, borderRadius: 8, background: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--crm-shadow-sm)' }}>
                        <CrmIcon name="car" size={18} style={{ color: 'var(--crm-fg-1)' }}/>
                      </span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>{b.model} <span style={{ fontFamily: 'ui-monospace, monospace', color: 'var(--crm-fg-2)', marginLeft: 6 }}>{b.plate}</span></div>
                        <div style={{ fontSize: 11, color: 'var(--crm-fg-2)', marginTop: 2 }}>{b.date} · {b.loc}</div>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700 }}>{b.cost}</span>
                      <CrmBadge tone={b.status} dot>{b.status}</CrmBadge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div style={{ padding: '0 20px 20px', borderTop: '1px solid var(--crm-border)' }}>
                <h3 style={{ margin: '20px 0 14px', fontSize: 14, fontWeight: 800 }}>Activity</h3>
                <div style={{ position: 'relative', paddingLeft: 18 }}>
                  <span style={{ position: 'absolute', left: 5, top: 6, bottom: 6, width: 2, background: 'var(--crm-border)' }} />
                  {[
                    { c: 'var(--crm-green)', t: '10:42 today', d: 'Inbound call · Lost & Found ticket TK-1284 raised by Sai C.' },
                    { c: 'var(--crm-info)',  t: '09:54 today', d: 'Booking VPQ 7400 returned at Mont Kiara' },
                    { c: 'var(--crm-warning)', t: '28 Apr',    d: 'Auto-call: Booking confirmation reminder · answered by bot' },
                    { c: 'var(--crm-fg-3)',  t: '14 Apr',     d: 'Email: Monthly summary opened' },
                  ].map((e, i) => (
                    <div key={i} style={{ position: 'relative', paddingBottom: 12 }}>
                      <span style={{ position: 'absolute', left: -18, top: 4, width: 12, height: 12, borderRadius: 999, background: e.c, boxShadow: '0 0 0 3px #fff' }} />
                      <div style={{ fontSize: 11, color: 'var(--crm-fg-2)', fontWeight: 600 }}>{e.t}</div>
                      <div style={{ fontSize: 13, color: 'var(--crm-fg-1)' }}>{e.d}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CrmAppShell>
  );
}

Object.assign(window, { ReportsScreen, CustomerProfileScreen });
