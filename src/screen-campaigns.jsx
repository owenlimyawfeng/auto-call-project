// Auto-call Campaigns list + Campaign builder (CSV upload → template → schedule)

const CAMPAIGNS = [
  { id: 'C1', name: 'Periodic Service Reminder — May', desc: 'Targets owners 90d past last service', template: 'Reminder Periodic Service', service: 'Sharing AI', status: 'running',   progress: [142, 250], schedule: '03 May 2026, 10:00', created: '02 May, 09:14', conv: 38, agent: 'Sharing AI' },
  { id: 'C2', name: 'Subs Renewal — Q2',                desc: '60d before subscription end',         template: 'Subs Renewal Outreach',  service: 'Subs AI',    status: 'scheduled', progress: [0, 412],   schedule: '05 May 2026, 09:00', created: '01 May, 16:22', conv: null, agent: 'Subs AI' },
  { id: 'C3', name: 'Lapsed Members Win-back',          desc: '180d inactive members',              template: 'Win-back Voucher',       service: 'Sharing AI', status: 'completed', progress: [602, 602], schedule: '28 Apr 2026, 14:00', created: '27 Apr, 11:00', conv: 22, agent: 'Sharing AI' },
  { id: 'C4', name: 'Document Upload Reminder',         desc: 'Members with missing docs',           template: 'GoCar Remind Upload Doc',template: 'Upload Document',       service: 'Sharing AI', status: 'paused',    progress: [88, 220],  schedule: '30 Apr 2026, 12:00', created: '29 Apr, 17:55', conv: 14, agent: 'Sharing AI' },
  { id: 'C5', name: 'GoEV Promo — KL Sentral',          desc: 'EV launch lead nurturing',            template: 'EV Awareness',           service: 'EV AI',      status: 'draft',     progress: [0, 0],     schedule: '—',                  created: '02 May, 18:01', conv: null, agent: 'EV AI' },
  { id: 'C6', name: 'NPS Follow-up',                    desc: 'Detractors from last 30d',            template: 'NPS Detractor Recovery', service: 'Sharing AI', status: 'completed', progress: [120, 120], schedule: '25 Apr 2026, 14:00', created: '24 Apr, 10:14', conv: 31, agent: 'Sharing AI' },
];

const PENDING_CAMPAIGNS = [
  { id: 'P1', name: 'GoEV Promo — KL Sentral',   desc: 'EV launch lead nurturing',      template: 'EV Awareness',           recipients: 654,  requestedBy: 'Kai Lim',       requestedAt: '02 May, 18:01', approver: 'Mei Ling Wong' },
  { id: 'P2', name: 'Subs Renewal — Q2',          desc: '60d before subscription end',   template: 'Subs Renewal Outreach',  recipients: 412,  requestedBy: 'Aisyah R.',     requestedAt: '01 May, 16:22', approver: 'Mei Ling Wong' },
  { id: 'P3', name: 'NPS Detractor Recovery — May',desc: 'Detractors from last 30d',     template: 'NPS Detractor Recovery', recipients: 97,   requestedBy: 'Daniel T.',     requestedAt: '03 May, 09:40', approver: 'Mei Ling Wong' },
];

const BOT_TEMPLATES_CAMP = [
  { id: 'T1', name: 'Reminder Periodic Service', cat: 'Service',   steps: 7, lang: 'BM / EN', runs: 4821, conv: '38%' },
  { id: 'T2', name: 'Subs Renewal Outreach',     cat: 'Sales',     steps: 9, lang: 'BM / EN / CN', runs: 1244, conv: '24%' },
  { id: 'T3', name: 'Win-back Voucher',          cat: 'Marketing', steps: 5, lang: 'BM / EN', runs: 602,  conv: '22%' },
  { id: 'T4', name: 'Upload Document',           cat: 'Ops',       steps: 4, lang: 'BM / EN', runs: 1850, conv: '14%' },
  { id: 'T5', name: 'NPS Detractor Recovery',    cat: 'CX',        steps: 6, lang: 'BM / EN', runs: 412,  conv: '31%' },
  { id: 'T6', name: 'Booking Confirmation',      cat: 'Service',   steps: 4, lang: 'BM / EN', runs: 8721, conv: '92%' },
];

const RECIPIENT_LISTS_CAMP = [
  { id: 'L1', name: 'May Service Reminders',   rows: 250,  valid: 250,  src: 'CSV upload',  used: '1 camp' },
  { id: 'L2', name: 'Subs renewal — May/Jun',  rows: 412,  valid: 408,  src: 'CRM segment', used: '1 camp' },
  { id: 'L3', name: 'Lapsed members 180d',     rows: 1820, valid: 1762, src: 'CRM segment', used: '2 camps' },
  { id: 'L4', name: 'Documents missing',       rows: 220,  valid: 220,  src: 'CSV upload',  used: '1 camp' },
  { id: 'L5', name: 'NPS detractors Q1',       rows: 80,   valid: 80,   src: 'CSV upload',  used: '1 camp' },
  { id: 'L6', name: 'EV waitlist — KL',        rows: 654,  valid: 612,  src: 'CSV upload',  used: '0 camps' },
];

function CampaignsScreen() {
  const [tab, setTab] = useState('all');
  return (
    <CrmAppShell active="campaigns" breadcrumbs={['Call Center', 'Auto Call Campaigns']}
      topRight={<><CrmButton variant="secondary" size="sm" icon="template">Board</CrmButton><CrmButton variant="green" size="sm" icon="plus" onClick={() => { const lbl = Array.from(document.querySelectorAll('*')).find(e => e.textContent.trim() === 'V1 · 5-step wizard' && e.children.length === 0); let frame = lbl; while (frame && frame.offsetWidth !== 1440) frame = frame && frame.parentElement; if (frame) frame.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}>New Campaign</CrmButton></>}>
      <CrmPageHeader title="Auto Call Campaigns" subtitle="Bot-driven outbound campaigns. Upload a list, pick a template, schedule, go."
        tabs={[
          { id: 'all',        label: 'All campaigns',    count: 24 },
          { id: 'pending',    label: 'Pending approval', count: 3 },
          { id: 'templates',  label: 'Templates',        count: 12 },
          { id: 'recipients', label: 'Recipient lists',  count: 18 },
        ]} activeTab={tab} onTab={setTab}/>

      {/* ── All campaigns ── */}
      {tab === 'all' && <>
        <div style={{ padding: '16px 24px 0', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          <CrmKPI label="Calls placed (30d)" value="14,821" delta="+22%" icon="phoneOut" />
          <CrmKPI label="Connect rate" value="68.4%" delta="+3.1pp" icon="signal" />
          <CrmKPI label="Conversion" value="11.2%" delta="+1.8pp" icon="trend" sub="calls → bookings/renewals" />
          <CrmKPI label="Cost / connect" value="RM 0.42" delta="−RM 0.04" icon="wallet" deltaTone="up" />
        </div>
        <div style={{ padding: '16px 24px 12px', display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <CrmInput placeholder="Search campaigns…" icon="search" style={{ flex: '1 1 280px', maxWidth: 360 }} />
          <CrmSelect value="all" onChange={() => {}} options={['All statuses', 'Running', 'Scheduled', 'Paused', 'Completed', 'Draft']} style={{ width: 160 }} />
          <CrmSelect value="all" onChange={() => {}} options={['All bots', 'Sharing AI', 'Subs AI', 'Garage AI', 'EV AI']} style={{ width: 160 }} />
          <CrmButton variant="secondary" size="sm" icon="filter">More filters</CrmButton>
        </div>
        <div style={{ padding: '0 24px 24px', flex: 1, overflowY: 'auto' }}>
          <CrmCard padding={0}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.4fr 1fr 1fr 1.5fr 1fr 1fr 110px', padding: '12px 16px', background: '#fafbfc', borderBottom: '1px solid var(--crm-border)', fontSize: 11, fontWeight: 700, color: 'var(--crm-fg-2)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              <span>Campaign</span><span>Template</span><span>Bot</span><span>Status</span><span>Progress</span><span>Conv.</span><span>Schedule</span><span></span>
            </div>
            {CAMPAIGNS.map((c, i) => (
              <div key={c.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1.4fr 1fr 1fr 1.5fr 1fr 1fr 110px', padding: '14px 16px', alignItems: 'center', borderBottom: i < CAMPAIGNS.length - 1 ? '1px solid var(--crm-border)' : 'none' }}>
                <div><div style={{ fontSize: 13, fontWeight: 700 }}>{c.name}</div><div style={{ fontSize: 11, color: 'var(--crm-fg-2)', marginTop: 2 }}>{c.desc}</div></div>
                <span style={{ fontSize: 12 }}>{c.template}</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12 }}><span style={{ width: 22, height: 22, borderRadius: 6, background: 'var(--crm-green-soft)', color: 'var(--crm-green-deep)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><CrmIcon name="bot" size={12} /></span>{c.agent}</span>
                <CrmBadge tone={c.status} dot>{c.status}</CrmBadge>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--crm-fg-2)', marginBottom: 4 }}><span>{c.progress[0]} / {c.progress[1]} calls</span><span>{c.progress[1] ? Math.round(c.progress[0] / c.progress[1] * 100) : 0}%</span></div>
                  <div style={{ height: 6, background: 'var(--crm-bg)', borderRadius: 999, overflow: 'hidden' }}><div style={{ width: `${c.progress[1] ? c.progress[0] / c.progress[1] * 100 : 0}%`, height: '100%', background: c.status === 'paused' ? 'var(--crm-warning)' : 'var(--crm-green)' }} /></div>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: c.conv != null ? 'var(--crm-fg-1)' : 'var(--crm-fg-3)' }}>{c.conv != null ? `${c.conv}%` : '—'}</span>
                <span style={{ fontSize: 11, color: 'var(--crm-fg-2)' }}>{c.schedule}</span>
                <span style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
                  <CrmButton size="sm" variant="secondary">Open</CrmButton>
                  <button style={{ width: 30, height: 28, background: '#fff', border: '1px solid var(--crm-border-2)', borderRadius: 6, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><CrmIcon name="moreV" size={14} /></button>
                </span>
              </div>
            ))}
          </CrmCard>
        </div>
      </>}

      {/* ── Pending approval ── */}
      {tab === 'pending' && <>
        <div style={{ padding: '16px 24px 12px', display: 'flex', gap: 10, alignItems: 'center' }}>
          <CrmInput placeholder="Search…" icon="search" style={{ flex: '1 1 280px', maxWidth: 360 }} />
        </div>
        <div style={{ padding: '0 24px 24px', flex: 1, overflowY: 'auto' }}>
          <CrmCard padding={0}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.6fr 100px 1.2fr 1.4fr 120px', padding: '12px 16px', background: '#fafbfc', borderBottom: '1px solid var(--crm-border)', fontSize: 11, fontWeight: 700, color: 'var(--crm-fg-2)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              <span>Campaign</span><span>Template</span><span>Recipients</span><span>Requested by</span><span>Approver</span><span></span>
            </div>
            {PENDING_CAMPAIGNS.map((c, i) => (
              <div key={c.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1.6fr 100px 1.2fr 1.4fr 120px', padding: '14px 16px', alignItems: 'center', borderBottom: i < PENDING_CAMPAIGNS.length - 1 ? '1px solid var(--crm-border)' : 'none' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--crm-fg-2)', marginTop: 2 }}>{c.desc}</div>
                </div>
                <span style={{ fontSize: 12, color: 'var(--crm-fg-1)' }}>{c.template}</span>
                <span style={{ fontSize: 12, fontWeight: 700 }}>{c.recipients.toLocaleString()}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CrmAvatar name={c.requestedBy} size={24} />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{c.requestedBy}</div>
                    <div style={{ fontSize: 10, color: 'var(--crm-fg-3)' }}>{c.requestedAt}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CrmAvatar name={c.approver} size={24} />
                  <span style={{ fontSize: 12, color: 'var(--crm-fg-2)' }}>{c.approver}</span>
                </div>
                <span style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
                  <CrmButton size="sm" variant="green">Approve</CrmButton>
                  <CrmButton size="sm" variant="secondary">Review</CrmButton>
                </span>
              </div>
            ))}
          </CrmCard>
        </div>
      </>}

      {/* ── Templates ── */}
      {tab === 'templates' && <>
        <div style={{ padding: '16px 24px 12px', display: 'flex', gap: 10, alignItems: 'center' }}>
          <CrmInput placeholder="Search templates…" icon="search" style={{ flex: '1 1 280px', maxWidth: 360 }} />
          <CrmSelect value="all" onChange={() => {}} options={['All categories', 'Service', 'Sales', 'Marketing', 'Ops', 'CX']} style={{ width: 160 }} />
          <span style={{ flex: 1 }} />
          <CrmButton variant="green" size="sm" icon="plus">New template</CrmButton>
        </div>
        <div style={{ padding: '0 24px 24px', flex: 1, overflowY: 'auto' }}>
          <CrmCard padding={0}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 100px 80px 1fr 80px 80px 80px', padding: '12px 16px', background: '#fafbfc', borderBottom: '1px solid var(--crm-border)', fontSize: 11, fontWeight: 700, color: 'var(--crm-fg-2)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              <span>Template</span><span>Category</span><span>Steps</span><span>Languages</span><span>Runs</span><span>Conv.</span><span></span>
            </div>
            {BOT_TEMPLATES_CAMP.map((t, i) => (
              <div key={t.id} style={{ display: 'grid', gridTemplateColumns: '2fr 100px 80px 1fr 80px 80px 80px', padding: '14px 16px', alignItems: 'center', borderBottom: i < BOT_TEMPLATES_CAMP.length - 1 ? '1px solid var(--crm-border)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--crm-green-soft)', color: 'var(--crm-green-deep)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><CrmIcon name="bot" size={15} /></span>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>{t.name}</span>
                </div>
                <CrmBadge tone="default" size="sm">{t.cat}</CrmBadge>
                <span style={{ fontSize: 12, color: 'var(--crm-fg-2)' }}>{t.steps} steps</span>
                <span style={{ fontSize: 12, color: 'var(--crm-fg-2)' }}>{t.lang}</span>
                <span style={{ fontSize: 12, fontWeight: 700 }}>{t.runs.toLocaleString()}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--crm-green-deep)' }}>{t.conv}</span>
                <span style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
                  <button style={{ width: 30, height: 28, background: '#fff', border: '1px solid var(--crm-border-2)', borderRadius: 6, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><CrmIcon name="moreV" size={14} /></button>
                </span>
              </div>
            ))}
          </CrmCard>
        </div>
      </>}

      {/* ── Recipient lists ── */}
      {tab === 'recipients' && <>
        <div style={{ padding: '16px 24px 12px', display: 'flex', gap: 10, alignItems: 'center' }}>
          <CrmInput placeholder="Search lists…" icon="search" style={{ flex: '1 1 280px', maxWidth: 360 }} />
          <span style={{ flex: 1 }} />
          <CrmButton variant="secondary" size="sm" icon="upload">Upload CSV</CrmButton>
          <CrmButton variant="green" size="sm" icon="plus">New list</CrmButton>
        </div>
        <div style={{ padding: '0 24px 24px', flex: 1, overflowY: 'auto' }}>
          <CrmCard padding={0}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 90px 100px 1fr 100px 60px', padding: '12px 16px', background: '#fafbfc', borderBottom: '1px solid var(--crm-border)', fontSize: 11, fontWeight: 700, color: 'var(--crm-fg-2)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              <span>List</span><span>Rows</span><span>Valid</span><span>Source</span><span>Used in</span><span></span>
            </div>
            {RECIPIENT_LISTS_CAMP.map((r, i) => (
              <div key={r.id} style={{ display: 'grid', gridTemplateColumns: '2fr 90px 100px 1fr 100px 60px', padding: '14px 16px', alignItems: 'center', borderBottom: i < RECIPIENT_LISTS_CAMP.length - 1 ? '1px solid var(--crm-border)' : 'none' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{r.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--crm-fg-3)', marginTop: 2 }}>Updated 2h ago</div>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700 }}>{r.rows.toLocaleString()}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--crm-green-deep)' }}>{r.valid.toLocaleString()}</span>
                <span style={{ fontSize: 12, color: 'var(--crm-fg-2)' }}>{r.src}</span>
                <span style={{ fontSize: 12, color: 'var(--crm-fg-2)' }}>{r.used}</span>
                <button style={{ width: 28, height: 28, background: '#fff', border: '1px solid var(--crm-border-2)', borderRadius: 6, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><CrmIcon name="moreV" size={13} /></button>
              </div>
            ))}
          </CrmCard>
        </div>
      </>}

    </CrmAppShell>
  );
}

// ────────── Campaign builder ──────────
function CampaignBuilderScreen() {
  const [step, setStep] = useState(1);
  const STEPS = [
    { id: 1, label: 'Basic' },
    { id: 2, label: 'Recipients' },
    { id: 3, label: 'Bot template' },
    { id: 4, label: 'Schedule & rules' },
    { id: 5, label: 'Review' },
  ];

  // ── Step 1: Basic ──────────────────────────────────
  function StepBasic() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <CrmCard padding={20}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>Campaign basics</h3>
            <span style={{ fontSize: 12, color: 'var(--crm-fg-2)' }}>· Step 1 of 5</span>
          </div>
          <p style={{ margin: '0 0 20px', fontSize: 13, color: 'var(--crm-fg-2)' }}>Name your campaign and describe what it's trying to achieve.</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <CrmInput label="Campaign name *" value="Periodic Service Reminder — May" onChange={() => {}} />
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--crm-fg-2)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6, display: 'block' }}>Description</label>
              <textarea rows={3} defaultValue="Targets GoCar Sharing members whose vehicles are 90+ days past their last periodic service." style={{ width: '100%', padding: '10px 12px', fontSize: 13, fontFamily: 'inherit', border: '1px solid var(--crm-border-2)', borderRadius: 8, resize: 'vertical', color: 'var(--crm-fg-1)', background: '#fff', boxSizing: 'border-box' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <CrmSelect label="Service line *" value="sharing" onChange={() => {}} options={[{value:'sharing',label:'GoCar Sharing'},{value:'subs',label:'GoCar Subs'},{value:'ev',label:'GoEV'},{value:'garage',label:'GoCar Garage'}]} />
              <CrmSelect label="Call from *" value="n1" onChange={() => {}} options={[{value:'n1',label:'+60 3-2770 0001 · Sharing'},{value:'n2',label:'+60 3-2770 0002 · Subs'},{value:'n3',label:'+60 3-2770 0003 · GoEV'},{value:'n4',label:'+60 3-2770 0004 · Garage'}]} />
            </div>
            <CrmSelect label="Goal" value="book" onChange={() => {}} options={[{value:'book',label:'Booking / appointment'},{value:'renew',label:'Subscription renewal'},{value:'remind',label:'Reminder only'},{value:'survey',label:'NPS / survey'},{value:'winback',label:'Win-back'}]} />
          </div>
        </CrmCard>

        <CrmCard padding={20}>
          <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 800 }}>Tags &amp; ownership</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <CrmSelect label="Owner" value="sai" onChange={() => {}} options={[{value:'sai',label:'Sai Chang Cho'},{value:'mei',label:'Mei Ling Wong'},{value:'naili',label:'Naili Aziz'}]} />
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--crm-fg-2)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6, display: 'block' }}>Tags</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, padding: '8px 10px', border: '1px solid var(--crm-border-2)', borderRadius: 8, background: '#fff', minHeight: 38 }}>
                {['service', 'may-2026', 'sharing'].map(t => (
                  <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', background: 'var(--crm-bg)', border: '1px solid var(--crm-border)', borderRadius: 999, fontSize: 11, fontWeight: 600, color: 'var(--crm-fg-2)' }}>
                    {t}
                    <CrmIcon name="close" size={9} />
                  </span>
                ))}
                <span style={{ fontSize: 12, color: 'var(--crm-fg-3)', alignSelf: 'center', marginLeft: 2 }}>+ add tag</span>
              </div>
            </div>
          </div>
        </CrmCard>
      </div>
    );
  }

  // ── Step 2: Recipients ─────────────────────────────
  function StepRecipients() {
    const [src, setSrc] = useState('list');
    const SOURCES = [
      { id: 'csv',     icon: 'upload', label: 'Upload CSV',  sub: 'Drop a list of phone numbers' },
      { id: 'list',    icon: 'users',  label: 'Saved list',  sub: '18 lists available' },
      { id: 'segment', icon: 'filter', label: 'CRM segment', sub: 'Filter from members' },
    ];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <CrmCard padding={20}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>Recipients</h3>
            <span style={{ fontSize: 12, color: 'var(--crm-fg-2)' }}>· Step 2 of 5</span>
          </div>
          <p style={{ margin: '0 0 16px', fontSize: 13, color: 'var(--crm-fg-2)' }}>Upload a CSV, pick an existing list, or build a segment from your CRM.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 18 }}>
            {SOURCES.map(o => (
              <button key={o.id} onClick={() => setSrc(o.id)} style={{
                padding: 14, textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit',
                background: src === o.id ? 'var(--crm-green-soft)' : '#fff',
                border: src === o.id ? '1.5px solid var(--crm-green)' : '1px solid var(--crm-border)',
                borderRadius: 10, display: 'flex', gap: 10, alignItems: 'flex-start',
              }}>
                <span style={{ width: 32, height: 32, borderRadius: 8, background: src === o.id ? 'var(--crm-green)' : 'var(--crm-bg)', color: src === o.id ? '#fff' : 'var(--crm-fg-2)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CrmIcon name={o.icon} size={16} />
                </span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{o.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--crm-fg-2)', marginTop: 2 }}>{o.sub}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Upload CSV */}
          {src === 'csv' && <>
            <div style={{ padding: '24px', border: '2px dashed var(--crm-border-2)', borderRadius: 12, background: '#fafbfc', textAlign: 'center' }}>
              <span style={{ width: 48, height: 48, borderRadius: 12, background: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--crm-shadow-sm)' }}><CrmIcon name="upload" size={22} /></span>
              <div style={{ fontSize: 14, fontWeight: 700, marginTop: 12 }}>Drop your CSV here</div>
              <div style={{ fontSize: 12, color: 'var(--crm-fg-2)', marginTop: 4 }}>or <a href="#" style={{ color: 'var(--crm-green)' }}>browse files</a> · max 10,000 rows · <a href="#" style={{ color: 'var(--crm-fg-2)' }}>download template</a></div>
            </div>
            <div style={{ marginTop: 16, padding: 14, border: '1px solid var(--crm-border)', borderRadius: 10, background: '#fff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--crm-green-soft)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><CrmIcon name="doc" size={16} /></span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>service_reminder_may.csv</div>
                  <div style={{ fontSize: 11, color: 'var(--crm-fg-2)', marginTop: 2 }}>250 rows · 14 KB · uploaded 12s ago</div>
                </div>
                <CrmBadge tone="completed" dot>Validated</CrmBadge>
                <button style={{ width: 30, height: 30, background: '#fff', border: '1px solid var(--crm-border-2)', borderRadius: 6, cursor: 'pointer' }}><CrmIcon name="trash" size={14} /></button>
              </div>
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--crm-border)' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--crm-fg-2)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>Column mapping</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 16px 1fr', gap: 10, alignItems: 'center' }}>
                  {[['phone_number','Phone *'],['first_name','Contact name'],['plate','Vehicle plate'],['service_due','Service due date']].map(([from, to]) => (
                    <React.Fragment key={from}>
                      <span style={{ padding: '8px 10px', background: 'var(--crm-bg)', borderRadius: 6, fontSize: 12, fontFamily: 'ui-monospace, monospace' }}>{from}</span>
                      <CrmIcon name="arrowR" size={14} style={{ color: 'var(--crm-fg-3)' }} />
                      <CrmSelect value={to} onChange={() => {}} options={[to, 'Skip column']} />
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--crm-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--crm-fg-2)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Preview · first 3 rows</span>
                  <span style={{ fontSize: 11, color: 'var(--crm-green)', display: 'inline-flex', alignItems: 'center', gap: 4 }}><CrmIcon name="check" size={12} /> All numbers valid (MY format)</span>
                </div>
                <div style={{ background: '#fafbfc', borderRadius: 6, overflow: 'hidden', border: '1px solid var(--crm-border)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', padding: '8px 12px', fontSize: 11, fontWeight: 700, color: 'var(--crm-fg-2)', textTransform: 'uppercase', letterSpacing: '0.04em', background: '#fff', borderBottom: '1px solid var(--crm-border)' }}>
                    <span>Phone</span><span>Name</span><span>Plate</span><span>Due</span>
                  </div>
                  {[['+60 12-345 7890','Aisyah R.','VPQ 7400','12 May'],['+60 16-880 4422','Kyle Ng','JQQ 704','15 May'],['+60 17-201 6633','Jia Min','AKH 4448','18 May']].map((r, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', padding: '10px 12px', fontSize: 12, borderBottom: i < 2 ? '1px solid var(--crm-border)' : 'none' }}>
                      {r.map((v, j) => <span key={j} style={{ color: j===0?'var(--crm-fg-1)':'var(--crm-fg-2)', fontFamily: j===0?'ui-monospace, monospace':'inherit', fontWeight: j===0?600:400 }}>{v}</span>)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>}

          {/* Saved list */}
          {src === 'list' && <>
            <CrmInput placeholder="Search lists…" icon="search" style={{ marginBottom: 10 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {RECIPIENT_LISTS_CAMP.map((l, i) => (
                <div key={l.id} style={{
                  padding: '12px 14px', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12,
                  background: i === 0 ? 'var(--crm-green-soft)' : '#fff',
                  border: i === 0 ? '1.5px solid var(--crm-green)' : '1px solid var(--crm-border)',
                }}>
                  <span style={{ width: 34, height: 34, borderRadius: 8, background: i === 0 ? 'var(--crm-green)' : 'var(--crm-bg)', color: i === 0 ? '#fff' : 'var(--crm-fg-2)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <CrmIcon name="users" size={15} />
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{l.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--crm-fg-2)', marginTop: 2 }}>{l.rows.toLocaleString()} contacts · {l.src} · updated 2h ago</div>
                  </div>
                  {i === 0 && <CrmBadge tone="completed" dot>Selected</CrmBadge>}
                </div>
              ))}
            </div>
          </>}

          {/* CRM segment */}
          {src === 'segment' && (
            <div style={{ padding: 24, border: '1px solid var(--crm-border)', borderRadius: 12, background: '#fafbfc', textAlign: 'center' }}>
              <span style={{ width: 48, height: 48, borderRadius: 12, background: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--crm-shadow-sm)', margin: '0 auto' }}><CrmIcon name="filter" size={22} /></span>
              <div style={{ fontSize: 14, fontWeight: 700, marginTop: 12 }}>Build a CRM segment</div>
              <div style={{ fontSize: 12, color: 'var(--crm-fg-2)', marginTop: 4, marginBottom: 14 }}>Filter members by plan, activity, location and more.</div>
              <CrmButton variant="secondary" size="sm" icon="filter">Open segment builder</CrmButton>
            </div>
          )}
        </CrmCard>
      </div>
    );
  }

  // ── Step 3: Bot template ───────────────────────────
  function StepBotTemplate() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <CrmCard padding={20}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>Bot template</h3>
            <span style={{ fontSize: 12, color: 'var(--crm-fg-2)' }}>· Step 3 of 5</span>
            <span style={{ flex: 1 }} />
            <CrmButton size="sm" variant="green" icon="plus">New Bot Template</CrmButton>
          </div>
          <p style={{ margin: '0 0 16px', fontSize: 13, color: 'var(--crm-fg-2)' }}>Choose a pre-built script or customise your own. Variables are filled from your recipient list.</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { id: 'rs',  label: 'Reminder Periodic Service', steps: 7, lang: 'BM / EN', tags: ['booking','service'], active: true,  desc: 'Greets the customer, states service due date, offers to book a slot, handles reschedule.' },
              { id: 'sub', label: 'Subs Renewal Outreach',     steps: 9, lang: 'BM / EN', tags: ['renewal','subs'],   active: false, desc: 'Reminds of expiry, presents renewal offer, collects card confirmation or escalates.' },
              { id: 'wb',  label: 'Win-back Voucher',          steps: 6, lang: 'EN',       tags: ['winback','promo'],  active: false, desc: 'Acknowledges inactivity, offers exclusive voucher, captures acceptance.' },
              { id: 'nps', label: 'NPS Detractor Recovery',   steps: 5, lang: 'BM / EN', tags: ['nps','cx'],         active: false, desc: 'Opens with empathy, asks for the key issue, logs sentiment, books callback if needed.' },
            ].map(t => (
              <button key={t.id} style={{
                padding: 14, textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', width: '100%',
                background: t.active ? 'var(--crm-green-soft)' : '#fff',
                border: t.active ? '1.5px solid var(--crm-green)' : '1px solid var(--crm-border)',
                borderRadius: 10, display: 'flex', gap: 12, alignItems: 'flex-start',
              }}>
                <span style={{ width: 38, height: 38, borderRadius: 10, background: t.active ? 'var(--crm-green)' : 'var(--crm-bg)', color: t.active ? '#fff' : 'var(--crm-fg-2)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <CrmIcon name="bot" size={18} />
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                    <span style={{ fontSize: 13, fontWeight: 700 }}>{t.label}</span>
                    <span style={{ fontSize: 11, color: 'var(--crm-fg-2)' }}>{t.steps} steps · {t.lang}</span>
                    {t.tags.map(g => <span key={g} style={{ fontSize: 10, padding: '2px 7px', background: 'var(--crm-bg)', border: '1px solid var(--crm-border)', borderRadius: 999, color: 'var(--crm-fg-2)', fontWeight: 600 }}>{g}</span>)}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--crm-fg-2)', lineHeight: 1.4 }}>{t.desc}</div>
                </div>
                {t.active && <span style={{ width: 20, height: 20, borderRadius: 999, background: 'var(--crm-green)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><CrmIcon name="check" size={11} /></span>}
              </button>
            ))}
          </div>
        </CrmCard>

        <CrmCard padding={20}>
          <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 800 }}>Voice &amp; language</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <CrmSelect label="Voice persona" value="aira" onChange={() => {}} options={[{value:'aira',label:'Aira — Female · BM/EN · Warm'},{value:'kai',label:'Kai — Male · EN · Professional'},{value:'maya',label:'Maya — Female · BM · Friendly'}]} />
            <CrmSelect label="Primary language" value="bm" onChange={() => {}} options={[{value:'bm',label:'Bahasa Malaysia (default)'},{value:'en',label:'English'},{value:'auto',label:'Auto-detect from member profile'}]} />
          </div>

          {/* Script preview */}
          <div style={{ background: 'linear-gradient(135deg, var(--crm-green-soft), #fff)', border: '1px solid var(--crm-green)', borderRadius: 10, padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--crm-green)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><CrmIcon name="sparkle" size={13} /></span>
              <span style={{ fontSize: 13, fontWeight: 800 }}>Script preview · Row 1 variables filled</span>
              <span style={{ flex: 1 }} />
              <CrmButton size="sm" variant="green" icon="play">Play sample</CrmButton>
            </div>
            <div style={{ padding: 12, background: '#fff', borderRadius: 8, fontSize: 13, lineHeight: 1.7, color: 'var(--crm-fg-1)' }}>
              <p style={{ margin: '0 0 8px', fontStyle: 'italic' }}>"Selamat tengah hari, boleh saya bercakap dengan <b style={{ fontStyle:'normal', color:'var(--crm-green-deep)' }}>Aisyah</b>?"</p>
              <p style={{ margin: '0 0 8px', fontStyle: 'italic' }}>"Saya menghubungi dari GoCar berkaitan kenderaan <b style={{ fontStyle:'normal', color:'var(--crm-green-deep)' }}>Bezza VPQ 7400</b> anda yang perlu servis berkala sebelum <b style={{ fontStyle:'normal', color:'var(--crm-green-deep)' }}>12 Mei</b>."</p>
              <p style={{ margin: 0, fontStyle: 'italic' }}>"Boleh saya tempah slot servis untuk anda hari ini?"</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12 }}>
              <span style={{ fontSize: 10, fontFamily: 'ui-monospace, monospace', color: 'var(--crm-fg-2)' }}>0:00</span>
              <div style={{ flex: 1, height: 24, background: '#fff', borderRadius: 4, overflow: 'hidden', display: 'flex', alignItems: 'center', padding: '0 4px', gap: 1 }}>
                {Array.from({ length: 80 }).map((_, i) => (
                  <span key={i} style={{ flex: 1, height: 4 + Math.abs(Math.sin(i * 0.45) * 12), background: 'var(--crm-green)', opacity: 0.5, borderRadius: 1 }} />
                ))}
              </div>
              <span style={{ fontSize: 10, fontFamily: 'ui-monospace, monospace', color: 'var(--crm-fg-2)' }}>0:11</span>
            </div>
          </div>
        </CrmCard>

      </div>
    );
  }

  // ── Step 4: Schedule & rules ───────────────────────
  function StepSchedule() {
    const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    const WORKING_HOURS = ['8','9','10','11','12','13','14','15','16','17','18'];
    const ALL_HOURS     = ['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23'];
    const fmtH = h => { const n=parseInt(h); if(n===0) return '12am'; if(n<12) return `${n}am`; if(n===12) return '12pm'; return `${n-12}pm`; };

    const [timeRange, setTimeRange] = useState('working');
    const HOURS = timeRange === '24h' ? ALL_HOURS : WORKING_HOURS;

    // Grid keyed by actual hour value so state persists when toggling mode
    const initGrid = () => {
      const g = {};
      DAYS.forEach((d, di) => {
        for (let hr = 0; hr < 24; hr++) {
          let on = false;
          if (d !== 'Sun') {
            if (hr >= 9 && hr < 18) on = true;
            if (d === 'Sat' && hr >= 14) on = false;
          }
          g[`${di}-${hr}`] = on ? 'on' : 'off';
        }
      });
      return g;
    };
    const [grid, setGrid] = useState(initGrid);
    const toggle = (di, hr) => setGrid(g => ({ ...g, [`${di}-${hr}`]: g[`${di}-${hr}`] === 'on' ? 'off' : 'on' }));

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <CrmCard padding={20}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>Schedule &amp; rules</h3>
            <span style={{ fontSize: 12, color: 'var(--crm-fg-2)' }}>· Step 4 of 5</span>
          </div>
          <p style={{ margin: '0 0 18px', fontSize: 13, color: 'var(--crm-fg-2)' }}>Define when calls go out and what happens on no-answer.</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--crm-fg-2)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6, display: 'block' }}>Start date</label>
              <input type="date" defaultValue="2026-05-05" style={{ width: '100%', padding: '9px 12px', fontSize: 13, fontFamily: 'inherit', border: '1px solid var(--crm-border-2)', borderRadius: 8, background: '#fff', color: 'var(--crm-fg-1)', boxSizing: 'border-box' }} />
            </div>
            <CrmSelect
              label="Time range"
              value={timeRange}
              onChange={setTimeRange}
              options={[
                { value: 'working', label: 'Working hours' },
                { value: '24h',     label: '24 hours' },
              ]}
            />
          </div>

          {/* Calling window grid */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 700 }}>Calling window</span>
              <div style={{ display: 'flex', gap: 12, fontSize: 11 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><span style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--crm-green)' }} />Active</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><span style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--crm-bg)', border: '1px solid var(--crm-border-2)' }} />Off</span>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: `52px repeat(${HOURS.length}, 1fr)`, gap: 3 }}>
              <span />
              {HOURS.map(h => <span key={h} style={{ fontSize: 10, color: 'var(--crm-fg-3)', textAlign: 'center', paddingBottom: 4 }}>{timeRange === '24h' ? fmtH(h) : h}</span>)}
              {DAYS.map((d, di) => (
                <React.Fragment key={d}>
                  <span style={{ fontSize: 11, color: 'var(--crm-fg-2)', fontWeight: 700, alignSelf: 'center', paddingRight: 4 }}>{d}</span>
                  {HOURS.map(h => {
                    const hr = parseInt(h);
                    const on = grid[`${di}-${hr}`] === 'on';
                    return (
                      <span key={h} onClick={() => toggle(di, hr)} style={{
                        height: 28, borderRadius: 4, cursor: 'pointer', transition: 'background .1s',
                        background: on ? 'var(--crm-green)' : '#fff',
                        border: on ? 'none' : '1px solid var(--crm-border)',
                      }} />
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </CrmCard>

        <CrmCard padding={20}>
          <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 800 }}>Retry rules</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {[
              { trigger: 'No answer',      retries: 2, gap: '4 hours',  on: true },
              { trigger: 'Voicemail',      retries: 1, gap: '24 hours', on: true },
              { trigger: 'Busy',           retries: 3, gap: '30 min',   on: true },
              { trigger: 'Hung up',        retries: 0, gap: '—',        on: false },
              { trigger: 'Network error',  retries: 2, gap: '15 min',   on: true },
            ].map((r, i, arr) => (
              <div key={r.trigger} style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 48px', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--crm-border)' : 'none', fontSize: 13 }}>
                <span style={{ fontWeight: 600 }}>{r.trigger}</span>
                <span style={{ color: 'var(--crm-fg-2)' }}>Retry <b style={{ color: 'var(--crm-fg-1)' }}>{r.retries}×</b></span>
                <span style={{ color: 'var(--crm-fg-2)' }}>after <b style={{ color: 'var(--crm-fg-1)' }}>{r.gap}</b></span>
                <span style={{ width: 36, height: 20, borderRadius: 999, background: r.on ? 'var(--crm-green)' : 'var(--crm-border-2)', position: 'relative', cursor: 'pointer', display: 'inline-block' }}>
                  <span style={{ position: 'absolute', top: 2, left: r.on ? 18 : 2, width: 16, height: 16, borderRadius: 999, background: '#fff' }} />
                </span>
              </div>
            ))}
          </div>
        </CrmCard>
      </div>
    );
  }

  // ── Step 5: Review ─────────────────────────────────
  function StepReview() {
    const sections = [
      {
        title: 'Basic',
        step: 1,
        rows: [
          ['Campaign name',  'Periodic Service Reminder — May'],
          ['Service line',   'GoCar Sharing'],
          ['Type',           'Outbound'],
          ['Goal',           'Booking / appointment'],
          ['Priority',       'Normal'],
          ['Owner',          'Sai Chang Cho'],
        ],
      },
      {
        title: 'Recipients',
        step: 2,
        rows: [
          ['Source',         'CSV upload'],
          ['File',           'service_reminder_may.csv'],
          ['Total rows',     '250'],
          ['Valid numbers',  '250'],
          ['DNC removed',    '0'],
        ],
      },
      {
        title: 'Bot template',
        step: 3,
        rows: [
          ['Template',       'Reminder Periodic Service · 7 steps'],
          ['Voice',          'Aira — Female · BM/EN · Warm'],
          ['Language',       'Bahasa Malaysia'],
          ['Est. call time', '52 seconds'],
        ],
      },
      {
        title: 'Schedule & rules',
        step: 4,
        rows: [
          ['Start',          '05 May 2026 · 10:00'],
          ['Calling window', 'Weekday 09:00–18:00, Sat until 14:00'],
          ['Retry',          'No answer 2× / 4h, Busy 3× / 30min'],
        ],
      },
    ];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <CrmCard padding={20}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>Review &amp; launch</h3>
            <span style={{ fontSize: 12, color: 'var(--crm-fg-2)' }}>· Step 5 of 5</span>
          </div>
          <p style={{ margin: '0 0 18px', fontSize: 13, color: 'var(--crm-fg-2)' }}>Double-check every setting before sending for approval or launching.</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {sections.map(sec => (
              <div key={sec.title} style={{ border: '1px solid var(--crm-border)', borderRadius: 10, overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#fafbfc', borderBottom: '1px solid var(--crm-border)' }}>
                  <span style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--crm-fg-2)' }}>Step {sec.step} · {sec.title}</span>
                  <button onClick={() => setStep(sec.step)} style={{ fontSize: 12, fontWeight: 700, color: 'var(--crm-green)', background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <CrmIcon name="edit" size={12} /> Edit
                  </button>
                </div>
                <div style={{ padding: '4px 0' }}>
                  {sec.rows.map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 14px', fontSize: 13 }}>
                      <span style={{ color: 'var(--crm-fg-2)' }}>{k}</span>
                      <span style={{ fontWeight: 600, color: 'var(--crm-fg-1)', textAlign: 'right', maxWidth: '60%' }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CrmCard>

        {/* Compliance */}
        <CrmCard padding={20}>
          <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 800 }}>Compliance checklist</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              ['DNC registry checked against all 250 numbers', true],
              ['All numbers in Malaysia calling hours window', true],
              ['Consent flag present on every recipient row',  true],
              ['Retry rules within regulatory limits',         true],
              ['Manager approval',                            false, 'Pending — Mei Ling Wong'],
            ].map(([k, ok, sub]) => (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: ok ? 'var(--crm-green-soft)' : '#FFF6DD', borderRadius: 8 }}>
                <span style={{ width: 22, height: 22, borderRadius: 999, background: ok ? 'var(--crm-green)' : '#F59E0B', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <CrmIcon name={ok ? 'check' : 'clock'} size={12} />
                </span>
                <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: ok ? 'var(--crm-green-deep)' : '#92400E' }}>{k}</span>
                {sub && <span style={{ fontSize: 11, fontWeight: 700, color: '#92400E' }}>{sub}</span>}
              </div>
            ))}
          </div>
        </CrmCard>

        {/* Launch CTA */}
        <CrmCard padding={20} style={{ background: 'linear-gradient(135deg, #0F1A2C, #1A2740)', border: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ flex: 1, color: '#fff' }}>
              <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 4 }}>Ready to go?</div>
              <div style={{ fontSize: 12, opacity: 0.7, lineHeight: 1.5 }}>Send to Mei Ling for approval — the campaign auto-launches once approved. Or save as a draft to revisit later.</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <CrmButton size="sm" variant="green" icon="send">Send for approval</CrmButton>
              <CrmButton size="sm" variant="secondary">Save as draft</CrmButton>
            </div>
          </div>
        </CrmCard>
      </div>
    );
  }

  const stepLabels = { 1:'Basic', 2:'Recipients', 3:'Bot template', 4:'Schedule & rules', 5:'Review' };

  return (
    <CrmAppShell active="campaigns" breadcrumbs={['Call Center', 'Auto Call Campaigns', 'New campaign']}
      topRight={<>
        <CrmButton variant="secondary" size="sm">Save draft</CrmButton>
        {step > 1 && <CrmButton variant="secondary" size="sm" icon="arrowL" onClick={() => setStep(s => Math.max(1, s - 1))}>Back</CrmButton>}
        {step < 5
          ? <CrmButton variant="green" size="sm" iconRight="arrowR" onClick={() => setStep(s => Math.min(5, s + 1))}>Continue</CrmButton>
          : <CrmButton variant="green" size="sm" icon="send">Send for approval</CrmButton>
        }
      </>}>
      <CrmPageHeader title="New auto-call campaign" subtitle="Set up an outbound campaign in 5 steps." />

      {/* Stepper */}
      <div style={{ padding: '16px 24px', background: '#fff', borderBottom: '1px solid var(--crm-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {STEPS.map((s, i) => (
            <React.Fragment key={s.id}>
              <button onClick={() => setStep(s.id)} style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: '4px 6px', borderRadius: 6 }}>
                <span style={{
                  width: 26, height: 26, borderRadius: 999,
                  background: s.id < step ? 'var(--crm-green)' : s.id === step ? 'var(--crm-navy)' : 'var(--crm-bg)',
                  color: s.id <= step ? '#fff' : 'var(--crm-fg-2)',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 800, flexShrink: 0,
                }}>{s.id < step ? <CrmIcon name="check" size={13} /> : s.id}</span>
                <span style={{ fontSize: 13, fontWeight: s.id === step ? 700 : 500, color: s.id === step ? 'var(--crm-fg-1)' : 'var(--crm-fg-2)', whiteSpace: 'nowrap' }}>{s.label}</span>
              </button>
              {i < STEPS.length - 1 && <span style={{ flex: 1, height: 2, background: s.id < step ? 'var(--crm-green)' : 'var(--crm-border)', borderRadius: 999, minWidth: 12 }} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="crm-scroll" style={{ flex: 1, overflowY: 'auto', padding: 24, background: 'var(--crm-bg)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>
          <div>
            {step === 1 && <StepBasic />}
            {step === 2 && <StepRecipients />}
            {step === 3 && <StepBotTemplate />}
            {step === 4 && <StepSchedule />}
            {step === 5 && <StepReview />}
          </div>

          {/* Persistent side summary */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Campaign summary */}
            <CrmCard padding={16}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--crm-fg-2)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>Campaign summary</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9, fontSize: 12 }}>
                {[
                  ['Name',       'Periodic Service May'],
                  ['Type',       'Outbound'],
                  ['Recipients', step >= 2 ? '250' : '—'],
                  ['Template',   step >= 3 ? 'Reminder Service' : '—'],
                  ['Start',      step >= 4 ? '05 May · 10:00' : '—'],
                  ['Est. cost',  step >= 2 ? 'RM 105.00' : '—'],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--crm-fg-2)' }}>{k}</span>
                    <span style={{ fontWeight: 700, color: v === '—' ? 'var(--crm-fg-3)' : 'var(--crm-fg-1)' }}>{v}</span>
                  </div>
                ))}
              </div>
            </CrmCard>

            {/* Compliance */}
            <CrmCard padding={16}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--crm-fg-2)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>Compliance</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  ['DNC list checked',             step >= 2],
                  ['Within calling hours (9–6)',   step >= 4],
                  ['Consent flag present',          step >= 2],
                  ['Retry rules set',               step >= 4],
                  ['Manager approval',              false],
                ].map(([k, ok]) => (
                  <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                    <span style={{ width: 16, height: 16, borderRadius: 999, background: ok ? 'var(--crm-green-soft)' : '#FFF6DD', color: ok ? 'var(--crm-green-deep)' : '#92400E', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <CrmIcon name={ok ? 'check' : 'clock'} size={9} />
                    </span>
                    <span style={{ color: ok ? 'var(--crm-fg-1)' : 'var(--crm-fg-2)' }}>{k}</span>
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

Object.assign(window, { CampaignsScreen, CampaignBuilderScreen });
