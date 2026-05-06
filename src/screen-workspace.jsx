// Agent Workspace — 3-pane live-call screen
// Left: queue. Center: customer + call. Right: notes + scripts.

const AW_QUEUE = [
  { id: 'q1', name: 'Aisyah Rahman', phone: '+60 12-345 7890', wait: '0:42', priority: 'high', topic: 'Lost & Found — VPQ7400', tags: ['Sharing', 'Returning'] },
  { id: 'q2', name: 'Daniel Tan',    phone: '+60 16-887 1129', wait: '1:18', priority: 'med',  topic: 'Late return reminder',   tags: ['Subs'] },
  { id: 'q3', name: 'Hoang Huy',     phone: '+84 974 066 422', wait: '2:05', priority: 'med',  topic: 'Booking inquiry',        tags: ['Sharing', 'New'] },
  { id: 'q4', name: 'Mr. Ben',       phone: '+60 19-887 4521', wait: '3:32', priority: 'low',  topic: 'Bot escalation',         tags: ['Garage'] },
  { id: 'q5', name: 'Owen Lim',      phone: '+60 12-734 5779', wait: '4:11', priority: 'low',  topic: 'Insurance renewal',      tags: ['GoInsuran'] },
];

const AW_RECENT = [
  { id: 'r1', name: 'Sarah Lee', phone: '+60 12-449 8821', when: 'Just now',   dir: 'outbound', dur: '4m 22s', status: 'completed' },
  { id: 'r2', name: 'Kyle Ng',   phone: '+60 16-880 4422', when: '12 min ago', dir: 'outbound', dur: '0m 06s', status: 'missed' },
  { id: 'r3', name: 'Jia Min',   phone: '+60 17-201 6633', when: '38 min ago', dir: 'inbound',  dur: '7m 14s', status: 'completed' },
];

// Customer details for active call
const ACTIVE_CUSTOMER = {
  name: 'Aisyah Rahman',
  phone: '+60 12-345 7890',
  email: 'aisyah.r@gmail.com',
  member: 'GoCar Member · Since Mar 2023',
  tier: 'Gold',
  trust: 96,
  city: 'Kuala Lumpur',
  language: 'EN / BM',
  recentBookings: [
    { code: 'VPQ7400', car: 'Perodua Bezza', plate: 'VPQ 7400', when: 'May 1 — May 2', status: 'returning', service: 'Sharing', amount: 'RM 142.50' },
    { code: 'JQQ704',  car: 'Honda City',    plate: 'JQQ 704',  when: 'Apr 18 — Apr 19', status: 'completed', service: 'Sharing', amount: 'RM 89.00' },
    { code: 'AKH4448', car: 'Nissan Serena', plate: 'AKH 4448', when: 'Mar 02 — Mar 06', status: 'completed', service: 'Sharing', amount: 'RM 412.00' },
  ],
  openTickets: [
    { id: 'TK-1284', subject: 'Lost AirPods in VPQ 7400', priority: 'high', status: 'open', age: '38m' },
    { id: 'TK-1192', subject: 'Refund for early return', priority: 'med', status: 'pending', age: '3d' },
  ],
  history: [
    { type: 'call',    when: 'Apr 28', text: 'Outbound auto-call — payment reminder. Promised to settle by May 2.' },
    { type: 'email',   when: 'Apr 21', text: 'Sent return confirmation for booking JQQ704.' },
    { type: 'booking', when: 'Apr 18', text: 'Booked Honda City for 24h — Mont Kiara to KLIA.' },
  ],
};

// Conversation transcript (live-ish)
const LIVE_TRANSCRIPT = [
  { who: 'customer', t: '00:04', text: 'Hi, I think I left my AirPods in the car I just returned.' },
  { who: 'agent',    t: '00:09', text: 'Hi Aisyah, sorry to hear that. Let me pull up your booking right now.' },
  { who: 'customer', t: '00:14', text: 'It was the Bezza, plate VPQ 7400. Returned it about an hour ago at Mont Kiara.' },
  { who: 'agent',    t: '00:21', text: 'Got it — I see VPQ 7400 returned at 09:54. I\'ll raise a Lost & Found right away.' },
  { who: 'customer', t: '00:32', text: 'How long does it usually take to find them?' },
  { who: 'agent',    t: '00:36', text: 'Our team checks the car within 4 hours. We\'ll text you once we have an update.' },
];

// Knowledge base
const KB_ARTICLES = [
  { id: 'kb1', title: 'Lost & Found — Standard procedure', cat: 'Operations', popular: true },
  { id: 'kb2', title: 'Refund eligibility & timelines',     cat: 'Billing' },
  { id: 'kb3', title: 'Late return penalty calculator',     cat: 'Billing' },
  { id: 'kb4', title: 'Escalating to fleet manager',         cat: 'Operations' },
  { id: 'kb5', title: 'GoCar Subs: pause vs cancel',         cat: 'Subscriptions' },
];

// Scripts
const SCRIPTS = [
  {
    id: 's1', title: 'Lost item — opening',
    text: '"Hi {name}, I\'m sorry to hear about the lost item. Can you confirm the booking code and the approximate location in the car? I\'ll raise a Lost & Found ticket right now and our fleet team will check within 4 hours."',
  },
  {
    id: 's2', title: 'Refund eligibility',
    text: '"Refunds are processed within 7 business days back to your original payment method. For early returns, the unused hours are credited as GoPocket points. Would you prefer the credit or cash refund?"',
  },
];

function PriorityDot({ level }) {
  const c = level === 'high' ? '#D8443C' : level === 'med' ? '#E0A100' : '#9A999C';
  return <span style={{ width: 6, height: 6, borderRadius: 999, background: c, flexShrink: 0 }} />;
}

// ───────────────── Pane: Queue ─────────────────
function QueuePane({ activeId, onPick }) {
  const [tab, setTab] = useState('queue');
  return (
    <div style={{ width: 280, background: '#fff', borderRight: '1px solid var(--crm-border)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
      {/* Header */}
      <div style={{ padding: '14px 16px 0', borderBottom: '1px solid var(--crm-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: 'var(--crm-fg-1)' }}>Call Queue</h3>
          <CrmBadge tone="live" dot>{AW_QUEUE.length} waiting</CrmBadge>
        </div>
        <div style={{ display: 'flex', gap: 4, marginTop: 12 }}>
          {[
            { id: 'queue', label: 'Queue', count: AW_QUEUE.length },
            { id: 'recent', label: 'Recent', count: AW_RECENT.length },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: '8px 10px', background: 'transparent', border: 'none', cursor: 'pointer',
              fontFamily: 'inherit', fontSize: 12, fontWeight: 600,
              color: tab === t.id ? 'var(--crm-fg-1)' : 'var(--crm-fg-2)',
              borderBottom: tab === t.id ? '2px solid var(--crm-green)' : '2px solid transparent',
              marginBottom: -1, display: 'inline-flex', alignItems: 'center', gap: 6,
            }}>
              {t.label}
              <span style={{
                padding: '1px 6px', borderRadius: 999, fontSize: 10, fontWeight: 700,
                background: tab === t.id ? 'var(--crm-green)' : 'var(--crm-bg)',
                color: tab === t.id ? '#fff' : 'var(--crm-fg-2)',
              }}>{t.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="crm-scroll" style={{ flex: 1, overflowY: 'auto' }}>
        {tab === 'queue' && AW_QUEUE.map(c => {
          const active = c.id === activeId;
          return (
            <button key={c.id} onClick={() => onPick && onPick(c.id)} style={{
              width: '100%', textAlign: 'left', padding: '12px 16px', cursor: 'pointer',
              background: active ? 'var(--crm-green-soft)' : 'transparent',
              border: 'none', borderLeft: active ? '3px solid var(--crm-green)' : '3px solid transparent',
              borderBottom: '1px solid var(--crm-border)', fontFamily: 'inherit',
              display: 'flex', gap: 10, alignItems: 'flex-start',
            }}>
              <CrmAvatar name={c.name} size={36} status={c.priority === 'high' ? 'busy' : null} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--crm-fg-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: c.priority === 'high' ? 'var(--crm-danger)' : 'var(--crm-fg-2)', fontWeight: 700, flexShrink: 0 }}>
                    <PriorityDot level={c.priority} />{c.wait}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--crm-fg-2)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.topic}</div>
                <div style={{ display: 'flex', gap: 4, marginTop: 6, flexWrap: 'wrap' }}>
                  {c.tags.map(t => (
                    <span key={t} style={{
                      padding: '1px 6px', background: 'var(--crm-bg)', borderRadius: 4,
                      fontSize: 10, fontWeight: 600, color: 'var(--crm-fg-2)',
                    }}>{t}</span>
                  ))}
                </div>
              </div>
            </button>
          );
        })}
        {tab === 'recent' && AW_RECENT.map(c => (
          <div key={c.id} style={{
            padding: '12px 16px', borderBottom: '1px solid var(--crm-border)',
            display: 'flex', gap: 10, alignItems: 'center',
          }}>
            <CrmAvatar name={c.name} size={32} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, fontWeight: 700 }}>{c.name}</span>
                <span style={{ fontSize: 10, color: 'var(--crm-fg-3)' }}>{c.when}</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--crm-fg-2)', display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                <CrmIcon name={c.status === 'missed' ? 'phoneMissed' : (c.dir === 'inbound' ? 'phoneIn' : 'phoneOut')} size={12} style={{ color: c.status === 'missed' ? 'var(--crm-danger)' : 'var(--crm-fg-2)' }} />
                {c.dur}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: 12, borderTop: '1px solid var(--crm-border)' }}>
        <CrmButton variant="secondary" icon="keypad" full size="sm">Open Dialer</CrmButton>
      </div>
    </div>
  );
}

// ───────────────── Pane: Customer + Call (center) ─────────────────
function Waveform({ active }) {
  const bars = 40;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 2, height: 28 }}>
      {Array.from({ length: bars }).map((_, i) => {
        const h = 4 + Math.abs(Math.sin(i * 0.7) * 18) + (i % 3) * 2;
        return (
          <span key={i} style={{
            width: 3, height: h, borderRadius: 2,
            background: 'var(--crm-green)',
            animation: active ? `crm-wave ${0.6 + (i % 5) * 0.12}s ease-in-out ${i * 0.04}s infinite` : 'none',
          }} />
        );
      })}
    </div>
  );
}

function SentimentMeter({ value = 72 }) {
  // 0-100; > 60 positive, 40-60 neutral, < 40 negative
  const tone = value >= 60 ? 'positive' : value >= 40 ? 'neutral' : 'negative';
  const color = tone === 'positive' ? '#22C55E' : tone === 'neutral' ? '#E0A100' : '#D8443C';
  const label = tone === 'positive' ? 'Positive' : tone === 'neutral' ? 'Neutral' : 'Negative';
  const icon = tone === 'positive' ? 'smile' : tone === 'neutral' ? 'meh' : 'frown';
  return (
    <div style={{
      padding: 12, background: '#fff', border: '1px solid var(--crm-border)', borderRadius: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--crm-fg-2)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Live Sentiment</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700, color }}>
          <CrmIcon name={icon} size={14} />{label}
        </span>
      </div>
      <div style={{ height: 6, background: 'var(--crm-bg)', borderRadius: 999, overflow: 'hidden', position: 'relative' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(90deg, #D8443C 0%, #E0A100 50%, #22C55E 100%)',
          opacity: 0.18,
        }} />
        <div style={{
          position: 'absolute', top: -3, left: `${value}%`, transform: 'translateX(-50%)',
          width: 12, height: 12, borderRadius: 999, background: color,
          boxShadow: '0 0 0 3px #fff, 0 1px 4px rgba(0,0,0,.15)',
        }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 10, color: 'var(--crm-fg-3)' }}>
        <span>−</span><span>0</span><span>+</span>
      </div>
    </div>
  );
}

function CallControl({ icon, label, onClick, danger, primary, active, big }) {
  const sz = big ? 56 : 44;
  let bg = '#fff', fg = 'var(--crm-fg-1)', shadow = 'var(--crm-shadow-sm)', border = '1px solid var(--crm-border-2)';
  if (danger) { bg = '#D8443C'; fg = '#fff'; border = 'none'; shadow = '0 6px 16px rgba(216,68,60,.30)'; }
  else if (primary) { bg = 'var(--crm-green)'; fg = '#fff'; border = 'none'; shadow = '0 6px 16px rgba(9,167,126,.28)'; }
  else if (active) { bg = 'var(--crm-navy)'; fg = '#fff'; border = 'none'; }
  return (
    <button onClick={onClick} style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
      background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
    }}>
      <span style={{
        width: sz, height: sz, borderRadius: '50%',
        background: bg, color: fg, border, boxShadow: shadow,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <CrmIcon name={icon} size={big ? 24 : 18} strokeWidth={2} />
      </span>
      <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--crm-fg-2)' }}>{label}</span>
    </button>
  );
}

function ActiveCallBar({ duration, recording, onToggleRecord, onMute, muted, onHold, held, onEnd }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #00563F 0%, #09A77E 100%)',
      color: '#fff', borderRadius: 14, padding: '16px 20px',
      boxShadow: '0 12px 32px rgba(0,86,63,0.28)',
      display: 'flex', alignItems: 'center', gap: 20,
    }}>
      <div style={{ position: 'relative' }}>
        <CrmAvatar name={ACTIVE_CUSTOMER.name} size={48} />
        <span style={{ position: 'absolute', inset: -6, borderRadius: 999, border: '2px solid rgba(255,255,255,.4)' }} className="crm-pulse-ring" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 16, fontWeight: 800 }}>{ACTIVE_CUSTOMER.name}</span>
          <CrmBadge tone="inbound" size="sm" style={{ background: 'rgba(255,255,255,.18)', color: '#fff' }}>Inbound</CrmBadge>
          <span style={{ fontSize: 12, opacity: 0.85 }}>{ACTIVE_CUSTOMER.phone}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, opacity: 0.9 }}>
            <CrmIcon name="clock" size={13} />{duration}
          </span>
          {recording && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700 }}>
              <span className="crm-blink" style={{ width: 8, height: 8, borderRadius: 999, background: '#fff' }} />
              Recording · Consent obtained
            </span>
          )}
        </div>
      </div>
      <Waveform active />
    </div>
  );
}

function AgentWorkspaceCenter({ duration, recording }) {
  const [tab, setTab] = useState('details');
  const c = ACTIVE_CUSTOMER;

  return (
    <div className="crm-scroll" style={{ flex: 1, overflowY: 'auto', background: 'var(--crm-bg)' }}>
      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <ActiveCallBar duration={duration} recording={recording} />

        {/* Call controls bar */}
        <div style={{
          background: '#fff', border: '1px solid var(--crm-border)', borderRadius: 14,
          padding: 16, display: 'flex', alignItems: 'center', gap: 24, justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
            <CallControl icon="micOff" label="Mute" />
            <CallControl icon="pause2" label="Hold" />
            <CallControl icon="keypad" label="Keypad" />
            <CallControl icon="transfer" label="Transfer" />
          </div>
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <CallControl icon="endCall" label="End call" danger big />
          </div>
        </div>

        {/* Customer header card */}
        <CrmCard padding={0}>
          <div style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14, borderBottom: '1px solid var(--crm-border)' }}>
            <CrmAvatar name={c.name} size={56} ring="#cfede4" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: 'var(--crm-fg-1)' }}>{c.name}</h2>
                <span style={{
                  padding: '2px 8px', background: 'linear-gradient(135deg, #FFD700 0%, #B8860B 100%)',
                  color: '#fff', borderRadius: 4, fontSize: 10, fontWeight: 800, letterSpacing: '0.04em',
                }}>GOLD</span>
                <span style={{ fontSize: 12, color: 'var(--crm-fg-2)' }}>· Trust score {c.trust}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--crm-fg-2)', marginTop: 4, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><CrmIcon name="phone" size={12} />{c.phone}</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><CrmIcon name="mail" size={12} />{c.email}</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><CrmIcon name="pin" size={12} />{c.city}</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><CrmIcon name="globe" size={12} />{c.language}</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--crm-fg-3)', marginTop: 4 }}>{c.member}</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <CrmButton variant="secondary" size="sm" icon="user">Profile</CrmButton>
              <CrmButton variant="secondary" size="sm" icon="ticket">New Ticket</CrmButton>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--crm-border)', padding: '0 18px' }}>
            {[
              { id: 'details', label: 'Bookings & Vehicles' },
              { id: 'tickets', label: 'Open Tickets', count: c.openTickets.length },
              { id: 'history', label: 'Activity' },
              { id: 'transcript', label: 'Live Transcript' },
            ].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                padding: '12px 14px', background: 'transparent', border: 'none', cursor: 'pointer',
                fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
                color: tab === t.id ? 'var(--crm-fg-1)' : 'var(--crm-fg-2)',
                borderBottom: tab === t.id ? '2px solid var(--crm-green)' : '2px solid transparent',
                marginBottom: -1, display: 'inline-flex', alignItems: 'center', gap: 6,
              }}>
                {t.label}
                {t.count != null && <span style={{
                  padding: '1px 6px', borderRadius: 999, fontSize: 10, fontWeight: 700,
                  background: tab === t.id ? 'var(--crm-green)' : 'var(--crm-bg)',
                  color: tab === t.id ? '#fff' : 'var(--crm-fg-2)',
                }}>{t.count}</span>}
              </button>
            ))}
          </div>

          <div style={{ padding: 18 }}>
            {tab === 'details' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {c.recentBookings.map(b => (
                  <div key={b.code} style={{
                    display: 'grid', gridTemplateColumns: '40px 1fr auto auto auto', gap: 14, alignItems: 'center',
                    padding: '12px 14px', background: '#fff', border: '1px solid var(--crm-border)', borderRadius: 10,
                  }}>
                    <span style={{
                      width: 40, height: 40, borderRadius: 8, background: 'var(--crm-green-soft)',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--crm-green-deep)',
                    }}><CrmIcon name="car" size={20} /></span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--crm-fg-1)' }}>{b.car} <span style={{ fontWeight: 500, color: 'var(--crm-fg-2)' }}>· {b.plate}</span></div>
                      <div style={{ fontSize: 11, color: 'var(--crm-fg-2)', marginTop: 2 }}>#{b.code} · {b.service} · {b.when}</div>
                    </div>
                    <CrmBadge tone={b.status === 'returning' ? 'pending' : 'completed'}>{b.status === 'returning' ? 'Returning' : 'Completed'}</CrmBadge>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--crm-fg-1)' }}>{b.amount}</span>
                    <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--crm-fg-2)' }}><CrmIcon name="chevR" size={16} /></button>
                  </div>
                ))}
              </div>
            )}

            {tab === 'tickets' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {c.openTickets.map(t => (
                  <div key={t.id} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 14px', background: '#fff', border: '1px solid var(--crm-border)', borderRadius: 10,
                  }}>
                    <span style={{
                      width: 36, height: 36, borderRadius: 8,
                      background: t.priority === 'high' ? '#FDECEB' : '#FFF6DD',
                      color: t.priority === 'high' ? '#991B1B' : '#92400E',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    }}><CrmIcon name="ticket" size={16} /></span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{t.subject}</div>
                      <div style={{ fontSize: 11, color: 'var(--crm-fg-2)', marginTop: 2 }}>#{t.id} · opened {t.age} ago</div>
                    </div>
                    <CrmBadge tone={t.status === 'open' ? 'live' : 'pending'}>{t.status}</CrmBadge>
                    <CrmButton size="sm" variant="secondary">Open</CrmButton>
                  </div>
                ))}
              </div>
            )}

            {tab === 'history' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {c.history.map((h, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, paddingBottom: 14, position: 'relative' }}>
                    <div style={{ width: 32, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <span style={{
                        width: 28, height: 28, borderRadius: 8, background: 'var(--crm-green-soft)',
                        color: 'var(--crm-green-deep)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}><CrmIcon name={h.type === 'call' ? 'phone' : h.type === 'email' ? 'mail' : 'car'} size={14} /></span>
                      {i < c.history.length - 1 && <span style={{ flex: 1, width: 2, background: 'var(--crm-border)', marginTop: 4 }} />}
                    </div>
                    <div style={{ flex: 1, paddingTop: 4 }}>
                      <div style={{ fontSize: 13, color: 'var(--crm-fg-1)' }}>{h.text}</div>
                      <div style={{ fontSize: 11, color: 'var(--crm-fg-3)', marginTop: 4 }}>{h.when}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === 'transcript' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {LIVE_TRANSCRIPT.map((m, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 10, color: 'var(--crm-fg-3)', fontFamily: 'ui-monospace, monospace', width: 36, paddingTop: 3 }}>{m.t}</span>
                    <CrmAvatar name={m.who === 'agent' ? 'Sai Chang Choo' : c.name} size={28} />
                    <div style={{
                      flex: 1, padding: '8px 12px',
                      background: m.who === 'agent' ? 'var(--crm-green-soft)' : '#fff',
                      border: '1px solid var(--crm-border)',
                      borderRadius: m.who === 'agent' ? '10px 10px 2px 10px' : '10px 10px 10px 2px',
                      fontSize: 13, color: 'var(--crm-fg-1)',
                    }}>{m.text}</div>
                  </div>
                ))}
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '8px 12px', background: '#fff', border: '1px dashed var(--crm-border-2)', borderRadius: 10, color: 'var(--crm-fg-3)', fontSize: 12 }}>
                  <span className="crm-blink" style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--crm-green)' }} />
                  Listening… auto-transcribing in EN
                </div>
              </div>
            )}
          </div>
        </CrmCard>
      </div>
    </div>
  );
}

// ───────────────── Pane: Notes / Sentiment / Scripts (right) ─────────────────
function NotesPane() {
  const [notes, setNotes] = useState('Customer called about lost AirPods in VPQ 7400 (Bezza, returned 09:54 May 3 at Mont Kiara).\n\n— Raised L&F ticket TK-1284\n— SLA: fleet check within 4h\n— Will SMS update');
  const [tab, setTab] = useState('notes');
  return (
    <div style={{ width: 340, background: '#fff', borderLeft: '1px solid var(--crm-border)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
      <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--crm-border)' }}>
        <SentimentMeter value={72} />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--crm-border)', padding: '0 12px' }}>
        {[
          { id: 'notes', label: 'Notes', icon: 'edit' },
          { id: 'scripts', label: 'Scripts', icon: 'doc' },
          { id: 'kb', label: 'Knowledge', icon: 'book' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: '10px 12px', background: 'transparent', border: 'none', cursor: 'pointer',
            fontFamily: 'inherit', fontSize: 12, fontWeight: 600,
            color: tab === t.id ? 'var(--crm-fg-1)' : 'var(--crm-fg-2)',
            borderBottom: tab === t.id ? '2px solid var(--crm-green)' : '2px solid transparent',
            marginBottom: -1, display: 'inline-flex', alignItems: 'center', gap: 6,
          }}>
            <CrmIcon name={t.icon} size={13} />{t.label}
          </button>
        ))}
      </div>

      <div className="crm-scroll" style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
        {tab === 'notes' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, fontWeight: 700 }}>Call notes</span>
              <span style={{ fontSize: 11, color: 'var(--crm-green)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--crm-green)' }} />
                Auto-saved
              </span>
            </div>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={10} style={{
              padding: 12, border: '1px solid var(--crm-border-2)', borderRadius: 8,
              fontSize: 13, fontFamily: 'inherit', resize: 'vertical', outline: 'none',
              background: '#fff', color: 'var(--crm-fg-1)',
            }} />

            <div>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--crm-fg-2)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Tags</span>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                {['Lost & Found', 'Sharing', 'Resolved', '+ Add'].map((t, i) => (
                  <span key={i} style={{
                    padding: '4px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600,
                    background: i === 3 ? 'transparent' : 'var(--crm-bg)',
                    color: 'var(--crm-fg-1)', border: i === 3 ? '1px dashed var(--crm-border-2)' : 'none',
                    cursor: 'pointer',
                  }}>{t}</span>
                ))}
              </div>
            </div>

            <div>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--crm-fg-2)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Wrap-up disposition</span>
              <CrmSelect value="resolved" onChange={() => {}} options={[
                { value: 'resolved', label: 'Resolved' },
                { value: 'follow', label: 'Follow-up scheduled' },
                { value: 'escalated', label: 'Escalated to manager' },
                { value: 'noanswer', label: 'No answer / abandoned' },
              ]} style={{ marginTop: 8 }} />
            </div>
          </div>
        )}

        {tab === 'scripts' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {SCRIPTS.map(s => (
              <div key={s.id} style={{
                padding: 12, background: 'var(--crm-bg)', borderRadius: 10,
                border: '1px solid var(--crm-border)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 700 }}>{s.title}</span>
                  <CrmIcon name="copy" size={13} style={{ color: 'var(--crm-fg-2)', cursor: 'pointer' }} />
                </div>
                <p style={{ margin: 0, fontSize: 12, lineHeight: 1.6, color: 'var(--crm-fg-1)' }}>{s.text}</p>
              </div>
            ))}
          </div>
        )}

        {tab === 'kb' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <CrmInput placeholder="Search knowledge base…" icon="search" />
            <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {KB_ARTICLES.map(a => (
                <a key={a.id} href="#" style={{
                  padding: '10px 12px', borderRadius: 8, background: 'transparent',
                  display: 'flex', alignItems: 'center', gap: 8,
                  fontSize: 12, color: 'var(--crm-fg-1)', textDecoration: 'none',
                  border: '1px solid transparent',
                }} onMouseEnter={e => { e.currentTarget.style.background = 'var(--crm-bg)'; e.currentTarget.style.borderColor = 'var(--crm-border)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}>
                  <CrmIcon name="doc" size={14} style={{ color: 'var(--crm-fg-2)' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{a.title}</div>
                    <div style={{ fontSize: 10, color: 'var(--crm-fg-3)', marginTop: 2 }}>{a.cat}</div>
                  </div>
                  {a.popular && <CrmBadge tone="completed" size="sm">Popular</CrmBadge>}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ───────────────── Whole workspace ─────────────────
function AgentWorkspace() {
  const [duration, setDuration] = useState('00:36');
  useEffect(() => {
    let s = 36;
    const t = setInterval(() => {
      s++;
      const m = String(Math.floor(s / 60)).padStart(2, '0');
      const sec = String(s % 60).padStart(2, '0');
      setDuration(`${m}:${sec}`);
    }, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <CrmAppShell active="workspace" agentStatus="busy"
      breadcrumbs={['Call Center', 'Agent Workspace', 'Live call']}
      topRight={<CrmButton variant="green" size="sm" icon="phone" iconRight="chevD">Make call</CrmButton>}>
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <QueuePane activeId="q1" />
        <AgentWorkspaceCenter duration={duration} recording />
        <NotesPane />
      </div>
    </CrmAppShell>
  );
}

Object.assign(window, { AgentWorkspace, QueuePane, AgentWorkspaceCenter, NotesPane });
