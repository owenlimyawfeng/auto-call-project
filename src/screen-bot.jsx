// Bot template library + Bot builder (linear step list)

const BOT_TEMPLATES = [
  { id: 'T1', name: 'Reminder Periodic Service', desc: 'Reminds members it\'s time for periodic service. Books appointment if interested.', cat: 'Service', steps: 7, lang: ['EN', 'BM'], runs: 4821, conv: '38%' },
  { id: 'T2', name: 'Subs Renewal Outreach',     desc: 'Pitches GoCar Subs renewal 60 days before plan end.',                            cat: 'Sales',    steps: 9, lang: ['EN', 'BM', 'CN'], runs: 1244, conv: '24%' },
  { id: 'T3', name: 'Win-back Voucher',          desc: 'Re-engages lapsed members with a one-time RM 50 voucher.',                       cat: 'Marketing',steps: 5, lang: ['EN', 'BM'], runs: 602, conv: '22%' },
  { id: 'T4', name: 'Upload Document',           desc: 'Reminds members with missing IDs/licenses to upload them.',                      cat: 'Ops',      steps: 4, lang: ['EN', 'BM'], runs: 1850, conv: '14%' },
  { id: 'T5', name: 'NPS Detractor Recovery',    desc: 'Calls NPS detractors, gathers feedback, offers resolution.',                     cat: 'CX',       steps: 6, lang: ['EN', 'BM'], runs: 412, conv: '31%' },
  { id: 'T6', name: 'Booking Confirmation',      desc: 'Confirms upcoming bookings 24h before pickup.',                                  cat: 'Service', steps: 4, lang: ['EN', 'BM'], runs: 8721, conv: '92%' },
];

function BotLibraryScreen() {
  const [tab, setTab] = useState('all');
  return (
    <CrmAppShell active="bots" breadcrumbs={['Call Center', 'Bot Templates']}
      topRight={<><CrmButton variant="secondary" size="sm" icon="import">Import</CrmButton><CrmButton variant="green" size="sm" icon="plus">New bot</CrmButton></>}>
      <CrmPageHeader title="Bot templates" subtitle="Reusable conversation flows for inbound and outbound calls."
        tabs={[
          { id: 'all', label: 'All templates', count: 12 },
        ]} activeTab={tab} onTab={setTab}/>

      <div style={{ padding: '16px 24px 12px', display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <CrmInput placeholder="Search templates…" icon="search" style={{ flex: '1 1 280px', maxWidth: 320 }} />
        <CrmSelect value="all" onChange={() => {}} options={['All categories', 'Service', 'Sales', 'Marketing', 'Ops', 'CX']} style={{ width: 160 }} />
        <CrmSelect value="all" onChange={() => {}} options={['All languages', 'English', 'Bahasa', 'Chinese']} style={{ width: 160 }} />
      </div>

      <div className="crm-scroll" style={{ flex: 1, overflowY: 'auto', padding: '0 24px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {BOT_TEMPLATES.map(t => (
            <CrmCard key={t.id} padding={18} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <span style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, #cfede4, #09A77E)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}><CrmIcon name="bot" size={20} /></span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 4 }}>{t.name}</div>
                  <CrmBadge tone="default" size="sm">{t.cat}</CrmBadge>
                </div>
              </div>
              <p style={{ margin: 0, fontSize: 12.5, color: 'var(--crm-fg-2)', lineHeight: 1.5, minHeight: 38 }}>{t.desc}</p>
              <div style={{ display: 'flex', gap: 4 }}>
                {t.lang.map(l => <span key={l} style={{ padding: '2px 7px', background: 'var(--crm-bg)', borderRadius: 4, fontSize: 10, fontWeight: 700, color: 'var(--crm-fg-2)' }}>{l}</span>)}
              </div>
            </CrmCard>
          ))}
        </div>
      </div>
    </CrmAppShell>
  );
}

// ────────── Bot builder (linear step list) ──────────
const BUILDER_STEPS = [
  { id: 1, kind: 'say',     title: 'Greeting',           body: 'Hi {{first_name}}, this is GoCar calling. Is this a good time?',                            voice: 'Aira (BM/EN)' },
  { id: 2, kind: 'listen',  title: 'Confirm availability', body: 'Listen for: yes / no / call back', branches: ['Yes → continue', 'No → reschedule', 'No answer → end'] },
  { id: 3, kind: 'say',     title: 'Reminder',           body: 'Your {{vehicle}} is due for periodic service on {{service_date}}. Would you like me to book a slot?', voice: 'Aira (BM/EN)' },
  { id: 4, kind: 'listen',  title: 'Capture intent',     body: 'Listen for: book / not now / talk to agent',                                       branches: ['Book → next', 'Not now → end with thanks', 'Agent → handoff'] },
  { id: 5, kind: 'action',  title: 'Pull available slots', body: 'API: GoCar Garage availability for {{nearest_branch}}',                          actor: 'system' },
  { id: 6, kind: 'say',     title: 'Offer slot',         body: 'I have {{slot_a}} or {{slot_b}}. Which works for you?',                              voice: 'Aira (BM/EN)' },
  { id: 7, kind: 'action',  title: 'Confirm booking',    body: 'API: Create service booking, send SMS confirmation',                                actor: 'system' },
];

function StepKindIcon({ kind }) {
  const map = {
    say:    { icon: 'mic',   bg: '#E0F2EC', color: 'var(--crm-green-deep)' },
    listen: { icon: 'ear',   bg: '#E1ECFB', color: 'var(--crm-info)' },
    action: { icon: 'bolt',  bg: '#FFF6DD', color: '#92400E' },
  }[kind];
  return <span style={{ width: 32, height: 32, borderRadius: 8, background: map.bg, color: map.color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><CrmIcon name={map.icon} size={15} /></span>;
}

function BotBuilderScreen() {
  const [selected, setSelected] = useState(3);
  return (
    <CrmAppShell active="bots" breadcrumbs={['Call Center', 'Bot Templates', 'Reminder Periodic Service']}
      topRight={<>
        <CrmBadge tone="completed" dot>Auto-saved</CrmBadge>
        <CrmButton size="sm" variant="secondary" icon="play">Test call</CrmButton>
        <CrmButton size="sm" variant="green" icon="check">Publish v3</CrmButton>
      </>}>
      <CrmPageHeader title="Reminder Periodic Service" subtitle="Linear bot flow · 7 steps · v2 published, v3 draft" />

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 380px', overflow: 'hidden' }}>
        {/* Canvas */}
        <div className="crm-scroll" style={{ overflowY: 'auto', padding: 24, background: 'var(--crm-bg)' }}>
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            {/* Trigger card */}
            <div style={{ padding: 14, background: 'var(--crm-navy)', color: '#fff', borderRadius: 10, marginBottom: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,.12)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><CrmIcon name="phoneOut" size={15} /></span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, opacity: 0.6, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Trigger</div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>Outbound campaign call placed</div>
              </div>
            </div>

            {BUILDER_STEPS.map((s, i) => {
              const sel = selected === s.id;
              return (
                <React.Fragment key={s.id}>
                  <div style={{ height: 14, width: 2, background: 'var(--crm-border-2)', marginLeft: 30 }} />
                  <div onClick={() => setSelected(s.id)} style={{
                    width: '100%', textAlign: 'left', padding: 14, fontFamily: 'inherit',
                    background: sel ? '#fff' : '#fff',
                    border: sel ? '1.5px solid var(--crm-green)' : '1px solid var(--crm-border)',
                    boxShadow: sel ? '0 0 0 4px rgba(9,167,126,.12)' : 'var(--crm-shadow-sm)',
                    borderRadius: 10, cursor: 'pointer', display: 'flex', gap: 12, alignItems: 'flex-start', boxSizing: 'border-box',
                  }}>
                    <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                      <span style={{ fontSize: 11, color: 'var(--crm-fg-3)', fontFamily: 'ui-monospace, monospace' }}>{String(s.id).padStart(2, '0')}</span>
                      <StepKindIcon kind={s.kind} />
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 700 }}>{s.title}</span>
                        <CrmBadge tone="default" size="sm">{s.kind}</CrmBadge>
                      </div>
                      <p style={{ margin: 0, fontSize: 12.5, color: 'var(--crm-fg-2)', lineHeight: 1.55 }}>{s.body}</p>
                      {s.branches && (
                        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
                          {s.branches.map(b => (
                            <div key={b} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--crm-fg-2)' }}>
                              <CrmIcon name="cornerR" size={11} style={{ color: 'var(--crm-fg-3)' }} />{b}
                            </div>
                          ))}
                        </div>
                      )}
                      {s.voice && <div style={{ marginTop: 8, fontSize: 11, color: 'var(--crm-fg-3)' }}>Voice · {s.voice}</div>}
                      {s.actor && <div style={{ marginTop: 8, fontSize: 11, color: 'var(--crm-fg-3)' }}>Runs as · {s.actor}</div>}
                    </div>
                    <div onClick={e => e.stopPropagation()} style={{ width: 28, height: 28, background: '#fff', border: '1px solid var(--crm-border)', borderRadius: 6, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><CrmIcon name="moreV" size={13} /></div>
                  </div>
                </React.Fragment>
              );
            })}

            <div style={{ height: 14, width: 2, background: 'var(--crm-border-2)', marginLeft: 30 }} />
            <button style={{
              width: '100%', padding: 14, fontFamily: 'inherit', cursor: 'pointer',
              background: 'transparent', border: '1.5px dashed var(--crm-border-2)',
              borderRadius: 10, color: 'var(--crm-fg-2)', fontWeight: 600, fontSize: 13,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}><CrmIcon name="plus" size={14} />Add step</button>

            <div style={{ height: 14, width: 2, background: 'var(--crm-border-2)', marginLeft: 30 }} />
            <div style={{ padding: 12, background: 'var(--crm-green-soft)', border: '1px solid var(--crm-green)', borderRadius: 10, textAlign: 'center', color: 'var(--crm-green-deep)', fontSize: 13, fontWeight: 700 }}>End of flow · Hang up &amp; log</div>
          </div>
        </div>

        {/* Right: step inspector */}
        <div style={{ borderLeft: '1px solid var(--crm-border)', background: '#fff', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--crm-border)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--crm-fg-2)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Step 03 · say</div>
            <h3 style={{ margin: '4px 0 0', fontSize: 16, fontWeight: 800 }}>Reminder</h3>
          </div>
          <div className="crm-scroll" style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--crm-fg-2)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6, display: 'block' }}>Bot says</label>
              <textarea defaultValue="Your {{vehicle}} is due for periodic service on {{service_date}}. Would you like me to book a slot?"
                style={{ width: '100%', minHeight: 92, padding: 10, border: '1px solid var(--crm-border)', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', resize: 'vertical', lineHeight: 1.5 }} />
              <div style={{ marginTop: 6, fontSize: 11, color: 'var(--crm-fg-2)' }}>Insert variable: {['{{first_name}}', '{{vehicle}}', '{{service_date}}', '{{nearest_branch}}'].map(v => (
                <span key={v} style={{ display: 'inline-block', margin: '4px 4px 0 0', padding: '2px 6px', background: 'var(--crm-bg)', borderRadius: 4, fontSize: 11, fontFamily: 'ui-monospace, monospace', color: 'var(--crm-fg-link)', cursor: 'pointer' }}>{v}</span>
              ))}</div>
            </div>

            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--crm-fg-2)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6, display: 'block' }}>Voice</label>
              <CrmSelect value="aira" onChange={() => {}} options={[
                { value: 'aira', label: 'Aira — Female, BM/EN, warm' },
                { value: 'kai',  label: 'Kai — Male, EN, professional' },
              ]} />
              <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                <CrmButton size="sm" variant="secondary" icon="play">Preview</CrmButton>
                <CrmButton size="sm" variant="ghost" icon="refresh">Re-render</CrmButton>
              </div>
            </div>

            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--crm-fg-2)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6, display: 'block' }}>Behavior</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  ['Allow interruption', true],
                  ['Wait 1.5s after speaking', true],
                  ['Repeat if no response', false],
                ].map(([k, on]) => (
                  <label key={k} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13 }}>
                    <span>{k}</span>
                    <span style={{
                      width: 32, height: 18, borderRadius: 999, background: on ? 'var(--crm-green)' : 'var(--crm-border-2)',
                      position: 'relative', transition: 'all .15s',
                    }}><span style={{ position: 'absolute', top: 2, left: on ? 16 : 2, width: 14, height: 14, borderRadius: 999, background: '#fff', transition: 'all .15s' }} /></span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--crm-fg-2)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6, display: 'block' }}>Translations</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[['English', true], ['Bahasa Malaysia', true], ['Chinese', false]].map(([l, ok]) => (
                  <div key={l} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', background: 'var(--crm-bg)', borderRadius: 6, fontSize: 12 }}>
                    <span>{l}</span>
                    {ok ? <CrmBadge tone="completed" size="sm">Translated</CrmBadge> : <CrmButton size="sm" variant="ghost">Translate</CrmButton>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </CrmAppShell>
  );
}

// ────────── Create new bot template ──────────
function CreateBotTemplateScreen() {
  const [vars, setVars] = useState([
    { id: 1, name: 'amount',  required: false, example: '120 USD' },
    { id: 2, name: 'dueDate', required: false, example: '20-05-2026' },
  ]);

  function addVar() {
    setVars(prev => [...prev, { id: Date.now(), name: '', required: false, example: '' }]);
  }
  function removeVar(id) {
    setVars(prev => prev.filter(v => v.id !== id));
  }

  const inputStyle = {
    width: '100%', padding: '9px 12px', fontSize: 13, fontFamily: 'inherit',
    border: '1px solid var(--crm-border-2)', borderRadius: 8, background: '#fff',
    color: 'var(--crm-fg-1)', boxSizing: 'border-box',
  };
  const labelStyle = {
    fontSize: 13, fontWeight: 600, color: 'var(--crm-fg-1)', marginBottom: 6, display: 'block',
  };

  return (
    <CrmAppShell active="bots" breadcrumbs={['Call Center', 'Caller Bots', 'New bot']}
      topRight={<>
        <CrmButton size="sm" variant="secondary">Cancel</CrmButton>
        <CrmButton size="sm" variant="green" icon="check">Save</CrmButton>
      </>}>

      <div className="crm-scroll" style={{ flex: 1, overflowY: 'auto', padding: 28, background: 'var(--crm-bg)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

          {/* ── Left column ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Name */}
            <div>
              <label style={labelStyle}>Name <span style={{ color: '#D8443C' }}>*</span></label>
              <input defaultValue="GollyCRM Monthly Billing" style={inputStyle} />
            </div>

            {/* Service */}
            <div>
              <label style={labelStyle}>Service <span style={{ color: '#D8443C' }}>*</span></label>
              <div style={{ position: 'relative' }}>
                <select defaultValue="golly" style={{ ...inputStyle, appearance: 'none', paddingRight: 36, cursor: 'pointer' }}>
                  <option value="golly">Golly</option>
                  <option value="sharing">GoCar Sharing</option>
                  <option value="subs">GoCar Subs</option>
                  <option value="ev">GoEV</option>
                  <option value="garage">GoCar Garage</option>
                </select>
                <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--crm-fg-2)' }}>▾</span>
              </div>
            </div>

            {/* Language */}
            <div>
              <label style={labelStyle}>Language</label>
              <div style={{ position: 'relative' }}>
                <select defaultValue="en" style={{ ...inputStyle, appearance: 'none', paddingRight: 36, cursor: 'pointer' }}>
                  <option value="en">English</option>
                  <option value="bm">Bahasa Malaysia</option>
                  <option value="cn">Chinese</option>
                  <option value="auto">Auto-detect</option>
                </select>
                <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--crm-fg-2)' }}>▾</span>
              </div>
            </div>

            {/* Voice */}
            <div>
              <label style={labelStyle}>Voice</label>
              <div style={{ position: 'relative', display: 'flex', gap: 0 }}>
                <select defaultValue="" style={{ ...inputStyle, appearance: 'none', paddingRight: 64, cursor: 'pointer', flex: 1 }}>
                  <option value="">Default voice</option>
                  <option value="aira">Aira — Female · BM/EN · Warm</option>
                  <option value="kai">Kai — Male · EN · Professional</option>
                  <option value="maya">Maya — Female · BM · Friendly</option>
                </select>
                <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: 8, pointerEvents: 'none' }}>
                  <span style={{ color: 'var(--crm-fg-3)', fontSize: 12 }}>✕</span>
                  <span style={{ color: 'var(--crm-fg-2)' }}>▾</span>
                </div>
              </div>
              <p style={{ margin: '6px 0 0', fontSize: 12, color: 'var(--crm-fg-2)' }}>The voice used during real calls and the playground. Leave empty to use the default.</p>
            </div>

            {/* Description */}
            <div>
              <label style={labelStyle}>Description</label>
              <textarea rows={3} defaultValue="Golly Monthly Billing reminder" style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} />
            </div>

            {/* Variables */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <label style={{ ...labelStyle, margin: 0 }}>Variables</label>
                <button onClick={addVar} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 12px', background: '#fff', border: '1px solid var(--crm-border-2)', borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', color: 'var(--crm-fg-1)' }}>
                  + Add
                </button>
              </div>

              {/* Always-available notice */}
              <div style={{ padding: '10px 14px', background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 8, fontSize: 12.5, color: '#1E40AF', marginBottom: 12, lineHeight: 1.5 }}>
                Always available in the prompt:{' '}
                <span style={{ color: '#D8443C', fontFamily: 'ui-monospace, monospace', fontWeight: 600 }}>{'{customerName}'}</span>,{' '}
                <span style={{ color: '#D8443C', fontFamily: 'ui-monospace, monospace', fontWeight: 600 }}>{'{phoneNumber}'}</span>.{' '}
                Don't add them here.
              </div>

              {/* Variables table */}
              <div style={{ border: '1px solid var(--crm-border)', borderRadius: 8, overflow: 'hidden', background: '#fff' }}>
                {/* Header */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 1fr 36px', padding: '8px 12px', background: '#fafbfc', borderBottom: '1px solid var(--crm-border)', fontSize: 12, fontWeight: 700, color: 'var(--crm-fg-2)' }}>
                  <span>Name</span>
                  <span style={{ textAlign: 'center' }}>Required</span>
                  <span>Example</span>
                  <span></span>
                </div>

                {vars.length === 0 && (
                  <div style={{ padding: '16px 12px', textAlign: 'center', fontSize: 13, color: 'var(--crm-fg-3)', fontStyle: 'italic' }}>No variables yet — click + Add</div>
                )}

                {vars.map((v, i) => (
                  <div key={v.id} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 1fr 36px', padding: '8px 12px', alignItems: 'center', borderBottom: i < vars.length - 1 ? '1px solid var(--crm-border)' : 'none', gap: 8 }}>
                    <input defaultValue={v.name} placeholder="variableName" style={{ padding: '6px 8px', border: '1px solid var(--crm-border)', borderRadius: 6, fontSize: 12, fontFamily: 'ui-monospace, monospace', color: 'var(--crm-fg-1)', width: '100%', boxSizing: 'border-box' }} />
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <input type="checkbox" defaultChecked={v.required} style={{ width: 15, height: 15, accentColor: 'var(--crm-green)', cursor: 'pointer' }} />
                    </div>
                    <input defaultValue={v.example} placeholder="e.g. 120 USD" style={{ padding: '6px 8px', border: '1px solid var(--crm-border)', borderRadius: 6, fontSize: 12, fontFamily: 'inherit', color: 'var(--crm-fg-1)', width: '100%', boxSizing: 'border-box' }} />
                    <button onClick={() => removeVar(v.id)} style={{ width: 28, height: 28, background: 'transparent', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#D8443C', borderRadius: 6 }}>
                      🗑
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right column ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Prompt content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <label style={labelStyle}>Prompt content <span style={{ color: '#D8443C' }}>*</span></label>
              <textarea
                rows={16}
                defaultValue={`You Are Golly AI Assistant, Make the call to Golly customer to remind about the Monthly Invoice for Golly CRM Service.\nFocus on when user will make the payment and process before due date.\nPayment information:\ntotal amount : {amount}\ndue date on {dueDate}.`}
                style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.7, flex: 1, minHeight: 260 }}
              />
            </div>

            {/* Voice playground */}
            <div style={{ padding: 20, background: '#fff', border: '1px solid var(--crm-border)', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 4 }}>Voice playground</div>
                <div style={{ fontSize: 13, color: 'var(--crm-fg-2)', lineHeight: 1.5 }}>Have a live conversation with the AI using this prompt.</div>
              </div>
              <button style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '10px 20px', background: 'var(--crm-navy)', color: '#fff',
                border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700,
                cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
              }}>
                ▶ Playground
              </button>
            </div>
          </div>

        </div>
      </div>
    </CrmAppShell>
  );
}

// ────────── Add step page ──────────
function BotAddStepScreen() {
  const [selectedKind, setSelectedKind] = useState('say');
  const [insertAfter, setInsertAfter]   = useState(3); // insert after step 3

  const kinds = [
    { id: 'say',    icon: 'mic',    bg: '#E0F2EC', color: 'var(--crm-green-deep)', label: 'Say',    desc: 'Bot speaks a scripted message to the caller. Supports variables and multi-language.' },
    { id: 'listen', icon: 'ear',    bg: '#E1ECFB', color: 'var(--crm-info)',       label: 'Listen', desc: 'Bot pauses and waits for the caller\'s response. Routes to branches based on intent.' },
    { id: 'action', icon: 'bolt',   bg: '#FFF6DD', color: '#92400E',               label: 'Action', desc: 'Execute a system task: API call, send SMS, update a CRM field, or fire a webhook.' },
    { id: 'branch', icon: 'branch', bg: '#F3E8FF', color: '#7C3AED',               label: 'Branch', desc: 'Conditional split: route the call differently based on data, time, or prior answers.' },
  ];

  const FLOW_STEPS = [
    { id: 1, kind: 'say',    label: 'Greeting' },
    { id: 2, kind: 'listen', label: 'Confirm availability' },
    { id: 3, kind: 'say',    label: 'Main message' },
    { id: 4, kind: 'listen', label: 'Capture intent' },
    { id: 5, kind: 'action', label: 'Fetch slots' },
    { id: 6, kind: 'say',    label: 'Offer slot' },
    { id: 7, kind: 'action', label: 'Confirm booking' },
  ];

  const kindMeta = Object.fromEntries(kinds.map(k => [k.id, k]));

  const vars = ['{{first_name}}','{{vehicle}}','{{service_date}}','{{nearest_branch}}','{{slot_a}}','{{slot_b}}'];

  return (
    <CrmAppShell active="bots" breadcrumbs={['Call Center', 'Bot Templates', 'Reminder Periodic Service', 'Add step']}
      topRight={<>
        <CrmButton size="sm" variant="secondary">Cancel</CrmButton>
        <CrmButton size="sm" variant="green" icon="plus">Add step</CrmButton>
      </>}>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 340px', overflow: 'hidden' }}>

        {/* ── Left: step configurator ── */}
        <div className="crm-scroll" style={{ overflowY: 'auto', padding: 24, background: 'var(--crm-bg)' }}>
          <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Step type picker */}
            <CrmCard padding={20}>
              <div style={{ marginBottom: 16 }}>
                <h3 style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 800 }}>Choose step type</h3>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--crm-fg-2)' }}>What should this step do in the conversation?</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                {kinds.map(k => (
                  <button key={k.id} onClick={() => setSelectedKind(k.id)} style={{
                    padding: 14, textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit',
                    background: selectedKind === k.id ? k.bg : '#fff',
                    border: selectedKind === k.id ? `1.5px solid ${k.color}` : '1px solid var(--crm-border)',
                    borderRadius: 10, display: 'flex', flexDirection: 'column', gap: 8,
                    transition: 'all .12s',
                  }}>
                    <span style={{ width: 36, height: 36, borderRadius: 9, background: selectedKind === k.id ? k.color : 'var(--crm-bg)', color: selectedKind === k.id ? '#fff' : 'var(--crm-fg-2)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CrmIcon name={k.icon} size={17} />
                    </span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: selectedKind === k.id ? k.color : 'var(--crm-fg-1)' }}>{k.label}</div>
                      <div style={{ fontSize: 11, color: 'var(--crm-fg-2)', marginTop: 3, lineHeight: 1.4 }}>{k.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </CrmCard>

            {/* Step name */}
            <CrmCard padding={20}>
              <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 800 }}>Step details</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <CrmInput label="Step name *" value="" onChange={() => {}} placeholder={`e.g. ${selectedKind === 'say' ? 'Offer booking slot' : selectedKind === 'listen' ? 'Capture customer intent' : selectedKind === 'action' ? 'Send SMS confirmation' : 'Route by membership tier'}`} />

                {/* Say: script editor */}
                {selectedKind === 'say' && (
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--crm-fg-2)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6, display: 'block' }}>Bot says *</label>
                    <textarea rows={5} placeholder="Type what the bot will say… Use {{variable}} to insert dynamic values." style={{ width: '100%', padding: '10px 12px', fontSize: 13, fontFamily: 'inherit', border: '1px solid var(--crm-border-2)', borderRadius: 8, resize: 'vertical', lineHeight: 1.6, boxSizing: 'border-box', color: 'var(--crm-fg-1)' }} />
                    <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      <span style={{ fontSize: 11, color: 'var(--crm-fg-2)', marginRight: 4, lineHeight: '22px' }}>Insert:</span>
                      {vars.map(v => (
                        <span key={v} style={{ padding: '2px 7px', background: 'var(--crm-bg)', border: '1px solid var(--crm-border)', borderRadius: 4, fontSize: 11, fontFamily: 'ui-monospace, monospace', color: 'var(--crm-info)', cursor: 'pointer' }}>{v}</span>
                      ))}
                    </div>
                    <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <CrmSelect label="Voice" value="aira" onChange={() => {}} options={[{value:'aira',label:'Aira — Female · BM/EN · Warm'},{value:'kai',label:'Kai — Male · EN · Professional'},{value:'maya',label:'Maya — Female · BM · Friendly'}]} />
                      <div style={{ display: 'flex', gap: 8 }}>
                        <CrmButton size="sm" variant="secondary" icon="play">Preview audio</CrmButton>
                        <CrmButton size="sm" variant="ghost">Translate</CrmButton>
                      </div>
                    </div>
                  </div>
                )}

                {/* Listen: intent config */}
                {selectedKind === 'listen' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--crm-fg-2)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6, display: 'block' }}>Listen for</label>
                      <textarea rows={3} placeholder="Describe what the bot should detect, e.g. yes / no / call back / speak to agent" style={{ width: '100%', padding: '10px 12px', fontSize: 13, fontFamily: 'inherit', border: '1px solid var(--crm-border-2)', borderRadius: 8, resize: 'vertical', lineHeight: 1.6, boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--crm-fg-2)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Branches</label>
                        <CrmButton size="sm" variant="ghost" icon="plus">Add branch</CrmButton>
                      </div>
                      {['Positive → continue', 'Negative → end with thanks', 'No response → retry', 'Agent requested → handoff'].map((b, i) => (
                        <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 6 }}>
                          <span style={{ width: 22, height: 22, borderRadius: 999, background: '#E1ECFB', color: 'var(--crm-info)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, flexShrink: 0 }}>{i+1}</span>
                          <input defaultValue={b} style={{ flex: 1, padding: '7px 10px', border: '1px solid var(--crm-border)', borderRadius: 7, fontSize: 12, fontFamily: 'inherit', color: 'var(--crm-fg-1)' }} />
                          <button style={{ width: 28, height: 28, background: '#fff', border: '1px solid var(--crm-border)', borderRadius: 6, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><CrmIcon name="trash" size={12} /></button>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <CrmSelect label="Silence timeout" value="4" onChange={() => {}} options={[{value:'2',label:'2 seconds'},{value:'4',label:'4 seconds'},{value:'6',label:'6 seconds'}]} />
                      <CrmSelect label="Max retries" value="1" onChange={() => {}} options={[{value:'0',label:'No retry'},{value:'1',label:'Retry once'},{value:'2',label:'Retry twice'}]} />
                    </div>
                  </div>
                )}

                {/* Action: API / system config */}
                {selectedKind === 'action' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <CrmSelect label="Action type *" value="api" onChange={() => {}} options={[{value:'api',label:'API call (GET / POST)'},{value:'sms',label:'Send SMS to caller'},{value:'email',label:'Send email notification'},{value:'tag',label:'Tag contact in CRM'},{value:'field',label:'Update CRM field'},{value:'webhook',label:'Fire webhook'}]} />
                    <CrmInput label="Endpoint URL" value="" onChange={() => {}} placeholder="https://api.gocar.my/v2/garage/slots" />
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--crm-fg-2)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6, display: 'block' }}>Payload / body</label>
                      <textarea rows={4} placeholder={'{\n  "member_id": "{{member_id}}",\n  "branch": "{{nearest_branch}}"\n}'} style={{ width: '100%', padding: '10px 12px', fontSize: 12, fontFamily: 'ui-monospace, monospace', border: '1px solid var(--crm-border-2)', borderRadius: 8, resize: 'vertical', lineHeight: 1.6, boxSizing: 'border-box', background: '#fafbfc' }} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <CrmSelect label="On success → go to" value="next" onChange={() => {}} options={[{value:'next',label:'Next step'},{value:'end',label:'End call'},{value:'custom',label:'Specific step…'}]} />
                      <CrmSelect label="On failure → go to" value="end" onChange={() => {}} options={[{value:'end',label:'End call'},{value:'agent',label:'Handoff to agent'},{value:'retry',label:'Retry once'}]} />
                    </div>
                  </div>
                )}

                {/* Branch: condition builder */}
                {selectedKind === 'branch' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <CrmSelect label="Branch on" value="field" onChange={() => {}} options={[{value:'field',label:'CRM field value'},{value:'time',label:'Time of day'},{value:'response',label:'Previous response'},{value:'tag',label:'Contact tag'},{value:'random',label:'Random split (A/B)'}]} />
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--crm-fg-2)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Conditions</label>
                        <CrmButton size="sm" variant="ghost" icon="plus">Add condition</CrmButton>
                      </div>
                      {[
                        ['membership_tier', '=', 'Gold', 'Go to step 4'],
                        ['membership_tier', '=', 'Silver', 'Go to step 5'],
                        ['Default', '', '', 'Go to step 6'],
                      ].map(([field, op, val, dest], i) => (
                        <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 8, padding: '10px 12px', background: i < 2 ? 'var(--crm-bg)' : '#fafbfc', borderRadius: 8, border: '1px solid var(--crm-border)' }}>
                          <span style={{ width: 18, height: 18, borderRadius: 999, background: '#F3E8FF', color: '#7C3AED', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 800, flexShrink: 0 }}>{i+1}</span>
                          {i < 2 ? (
                            <>
                              <input defaultValue={field} style={{ flex: 1, padding: '5px 8px', border: '1px solid var(--crm-border)', borderRadius: 6, fontSize: 11, fontFamily: 'ui-monospace, monospace' }} />
                              <select defaultValue={op} style={{ padding: '5px 8px', border: '1px solid var(--crm-border)', borderRadius: 6, fontSize: 11, fontFamily: 'inherit' }}><option>=</option><option>!=</option><option>&gt;</option><option>&lt;</option></select>
                              <input defaultValue={val} style={{ flex: 1, padding: '5px 8px', border: '1px solid var(--crm-border)', borderRadius: 6, fontSize: 11, fontFamily: 'ui-monospace, monospace' }} />
                            </>
                          ) : (
                            <span style={{ flex: 1, fontSize: 12, color: 'var(--crm-fg-2)', fontWeight: 600 }}>Default (all other cases)</span>
                          )}
                          <CrmIcon name="arrowR" size={12} style={{ color: 'var(--crm-fg-3)', flexShrink: 0 }} />
                          <input defaultValue={dest} style={{ flex: 1, padding: '5px 8px', border: '1px solid var(--crm-border)', borderRadius: 6, fontSize: 11, fontFamily: 'inherit' }} />
                          {i < 2 && <button style={{ width: 24, height: 24, background: 'transparent', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><CrmIcon name="trash" size={11} /></button>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CrmCard>

            {/* Behaviour */}
            <CrmCard padding={20}>
              <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 800 }}>Behaviour</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  ['Allow caller to interrupt',     selectedKind === 'say', 'Bot stops speaking when caller talks'],
                  ['Wait 1.5s after speaking',       selectedKind === 'say', 'Gives caller time to respond'],
                  ['Log this step to CRM',           true,                  'Records step outcome on the contact'],
                  ['Count step as a conversion point', false,               'Tracks when caller reaches this step'],
                ].map(([k, on, hint]) => (
                  <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: 'var(--crm-bg)', borderRadius: 8 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{k}</div>
                      <div style={{ fontSize: 11, color: 'var(--crm-fg-2)', marginTop: 2 }}>{hint}</div>
                    </div>
                    <span style={{ width: 36, height: 20, borderRadius: 999, background: on ? 'var(--crm-green)' : 'var(--crm-border-2)', position: 'relative', cursor: 'pointer', flexShrink: 0 }}>
                      <span style={{ position: 'absolute', top: 2, left: on ? 18 : 2, width: 16, height: 16, borderRadius: 999, background: '#fff' }} />
                    </span>
                  </div>
                ))}
              </div>
            </CrmCard>

            {/* Insert position */}
            <CrmCard padding={20}>
              <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 800 }}>Insert position</h3>
              <p style={{ margin: '0 0 14px', fontSize: 13, color: 'var(--crm-fg-2)' }}>Choose where this step will appear in the flow.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {['At the beginning', ...FLOW_STEPS.map(s => `After step ${s.id} · ${s.label}`), 'At the end'].map((opt, i) => {
                  const val = i === 0 ? 0 : i <= FLOW_STEPS.length ? i : FLOW_STEPS.length + 1;
                  const active = insertAfter === val;
                  return (
                    <button key={opt} onClick={() => setInsertAfter(val)} style={{
                      display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px',
                      background: active ? 'var(--crm-green-soft)' : '#fff',
                      border: active ? '1.5px solid var(--crm-green)' : '1px solid var(--crm-border)',
                      borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
                    }}>
                      <span style={{ width: 16, height: 16, borderRadius: 999, border: `2px solid ${active ? 'var(--crm-green)' : 'var(--crm-border-2)'}`, background: active ? 'var(--crm-green)' : '#fff', flexShrink: 0 }} />
                      <span style={{ fontSize: 13, fontWeight: active ? 700 : 400, color: active ? 'var(--crm-green-deep)' : 'var(--crm-fg-1)' }}>{opt}</span>
                    </button>
                  );
                })}
              </div>
            </CrmCard>

          </div>
        </div>

        {/* ── Right: flow preview ── */}
        <div style={{ borderLeft: '1px solid var(--crm-border)', background: '#fff', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--crm-border)' }}>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800 }}>Flow preview</h3>
            <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--crm-fg-2)' }}>New step shown in position.</p>
          </div>

          <div className="crm-scroll" style={{ flex: 1, overflowY: 'auto', padding: '14px 16px' }}>
            {/* Trigger */}
            <div style={{ padding: '8px 12px', background: 'var(--crm-navy)', color: '#fff', borderRadius: 8, marginBottom: 0, fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
              <CrmIcon name="phoneOut" size={12} /><span>Trigger · Outbound call</span>
            </div>

            {FLOW_STEPS.map((s, i) => {
              const m = { say: { bg: '#E0F2EC', color: 'var(--crm-green-deep)', icon: 'mic' }, listen: { bg: '#E1ECFB', color: 'var(--crm-info)', icon: 'ear' }, action: { bg: '#FFF6DD', color: '#92400E', icon: 'bolt' }, branch: { bg: '#F3E8FF', color: '#7C3AED', icon: 'branch' } }[s.kind];
              const insertHere = insertAfter === s.id;
              return (
                <React.Fragment key={s.id}>
                  <div style={{ width: 2, height: 12, background: 'var(--crm-border-2)', marginLeft: 17 }} />

                  {/* Existing step */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', background: '#fafbfc', border: '1px solid var(--crm-border)', borderRadius: 8, fontSize: 12 }}>
                    <span style={{ width: 26, height: 26, borderRadius: 6, background: m.bg, color: m.color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><CrmIcon name={m.icon} size={12} /></span>
                    <span style={{ fontWeight: 600 }}>{s.label}</span>
                    <span style={{ fontSize: 10, color: 'var(--crm-fg-3)', marginLeft: 'auto' }}>{s.id}</span>
                  </div>

                  {/* New step insertion indicator */}
                  {insertHere && (
                    <>
                      <div style={{ width: 2, height: 8, background: 'var(--crm-green)', marginLeft: 17 }} />
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 10px', background: 'var(--crm-green-soft)', border: '1.5px solid var(--crm-green)', borderRadius: 8, fontSize: 12 }}>
                        <span style={{ width: 26, height: 26, borderRadius: 6, background: 'var(--crm-green)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><CrmIcon name={kindMeta[selectedKind].icon} size={12} /></span>
                        <span style={{ fontWeight: 700, color: 'var(--crm-green-deep)' }}>New · {kindMeta[selectedKind].label} step</span>
                        <CrmBadge tone="completed" size="sm" style={{ marginLeft: 'auto' }}>New</CrmBadge>
                      </div>
                    </>
                  )}
                </React.Fragment>
              );
            })}

            {insertAfter > FLOW_STEPS.length && (
              <>
                <div style={{ width: 2, height: 8, background: 'var(--crm-green)', marginLeft: 17 }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 10px', background: 'var(--crm-green-soft)', border: '1.5px solid var(--crm-green)', borderRadius: 8, fontSize: 12 }}>
                  <span style={{ width: 26, height: 26, borderRadius: 6, background: 'var(--crm-green)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><CrmIcon name={kindMeta[selectedKind].icon} size={12} /></span>
                  <span style={{ fontWeight: 700, color: 'var(--crm-green-deep)' }}>New · {kindMeta[selectedKind].label} step</span>
                  <CrmBadge tone="completed" size="sm" style={{ marginLeft: 'auto' }}>New</CrmBadge>
                </div>
              </>
            )}

            <div style={{ width: 2, height: 12, background: 'var(--crm-border-2)', marginLeft: 17 }} />
            <div style={{ padding: '8px 10px', background: 'var(--crm-green-soft)', border: '1px solid var(--crm-green)', borderRadius: 8, textAlign: 'center', color: 'var(--crm-green-deep)', fontSize: 11, fontWeight: 700 }}>End · Hang up &amp; log</div>
          </div>

          {/* Bottom CTA */}
          <div style={{ padding: '14px 16px', borderTop: '1px solid var(--crm-border)', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <CrmButton variant="green" full icon="plus">Add step to flow</CrmButton>
            <CrmButton variant="secondary" full>Cancel</CrmButton>
          </div>
        </div>

      </div>
    </CrmAppShell>
  );
}

Object.assign(window, { BotLibraryScreen, BotBuilderScreen, CreateBotTemplateScreen, BotAddStepScreen });
