import { useState } from 'react'
import { countries } from '../profiles/countries'
import { industries } from '../profiles/industries'
import { painOptions } from '../profiles/pains'

export interface Config { country: string; industry: string; client: string; theme: 'dark' | 'light'; logo?: string; headcount?: number; hrTeam?: number; pains?: string[]; customPain?: string }

/** Downscale an uploaded logo so it fits comfortably in browser storage. */
function readLogo(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const k = Math.min(1, 480 / img.width, 240 / img.height)
      const c = document.createElement('canvas')
      c.width = Math.max(1, Math.round(img.width * k)); c.height = Math.max(1, Math.round(img.height * k))
      c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height)
      URL.revokeObjectURL(url)
      resolve(c.toDataURL('image/png'))
    }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Unsupported image')) }
    img.src = url
  })
}

const KEY = 'peoplehub-deck-config'
export function loadConfig(): Config {
  const d: Config = { country: 'lk', industry: 'generic', client: '', theme: 'dark' }
  try { return { ...d, ...JSON.parse(localStorage.getItem(KEY) ?? '{}') } } catch { return d }
}
export function saveConfig(c: Config) { try { localStorage.setItem(KEY, JSON.stringify(c)) } catch { /* storage unavailable */ } }

function Tile({ active, title, sub, onClick }: { active: boolean; title: string; sub?: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="text-left rounded-xl px-4 py-3 transition" style={{ background: active ? 'color-mix(in srgb, var(--brand) 30%, transparent)' : 'var(--card)', border: `1.5px solid ${active ? 'var(--brand2)' : 'var(--line)'}` }}>
      <div className="font-bold text-[16px]">{title}</div>
      {sub && <div className="text-[12.5px] mt-0.5" style={{ color: 'var(--mute)' }}>{sub}</div>}
    </button>
  )
}

export function Launcher({ initial, onStart }: { initial: Config; onStart: (c: Config) => void }) {
  const [c, setC] = useState<Config>(initial)
  const set = (p: Partial<Config>) => { const n = { ...c, ...p }; setC(n); if (p.theme) document.documentElement.dataset.theme = p.theme }
  const co = countries[c.country], ind = industries[c.industry]

  return (
    <div className="fixed inset-0 overflow-auto" style={{ background: 'radial-gradient(ellipse at 15% 0%, color-mix(in srgb, var(--brand) 25%, transparent), transparent 55%), var(--bg)' }}>
      <div className="max-w-[1100px] mx-auto px-8 py-10">
        <div className="flex items-center gap-4 mb-8">
          <img src="./logo-black.png" alt="PeopleHub" className="h-16 w-16 rounded-full bg-white p-0.5" />
          <div><div className="serif text-[32px] font-bold leading-tight">PeopleHub HRIS</div><div style={{ color: 'var(--mute)' }}>Sales presentation · configure before you present</div></div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <section className="card p-6">
            <h2 className="text-[13px] tracking-[0.2em] uppercase font-bold mb-3" style={{ color: 'var(--brand2)' }}>1 · Country</h2>
            <div className="grid grid-cols-1 gap-2">
              {Object.values(countries).map(x => <Tile key={x.id} active={c.country === x.id} title={x.name} sub={`${x.currency} · ${x.taxName} · ${x.statutory.map(s => s.label).filter((v, i, a) => a.indexOf(v) === i).join(', ')}`} onClick={() => set({ country: x.id })} />)}
            </div>
          </section>

          <section className="card p-6">
            <h2 className="text-[13px] tracking-[0.2em] uppercase font-bold mb-3" style={{ color: 'var(--brand2)' }}>2 · Industry</h2>
            <div className="grid grid-cols-2 gap-2 max-h-[360px] overflow-auto pr-1">
              {Object.values(industries).map(x => <Tile key={x.id} active={c.industry === x.id} title={x.name} onClick={() => set({ industry: x.id })} />)}
            </div>
            <p className="text-[13.5px] mt-3" style={{ color: 'var(--mute)' }}>“{ind.headline}”</p>
          </section>

          <section className="card p-6">
            <h2 className="text-[13px] tracking-[0.2em] uppercase font-bold mb-3" style={{ color: 'var(--brand2)' }}>3 · Client</h2>
            <input value={c.client} onChange={e => set({ client: e.target.value })} placeholder="Client name (optional) — e.g. Acme Garments"
              className="w-full rounded-xl px-4 py-3 text-[16px] outline-none" style={{ background: 'var(--card)', border: '1.5px solid var(--line)', color: 'var(--ink)' }} />
            <h2 className="text-[13px] tracking-[0.2em] uppercase font-bold mt-5 mb-3" style={{ color: 'var(--brand2)' }}>4 · Client logo</h2>
            <div className="flex items-center gap-4">
              <div className="h-20 w-40 rounded-xl grid place-items-center overflow-hidden flex-none" style={{ background: '#fff', border: '1.5px dashed var(--line)' }}>
                {c.logo ? <img src={c.logo} alt="Client logo" className="max-h-full max-w-full object-contain p-2" /> : <span className="text-[12px] text-slate-500">No logo</span>}
              </div>
              <div className="flex flex-col gap-2">
                <label className="cursor-pointer rounded-xl px-4 py-2 text-[14px] font-bold text-center" style={{ background: 'var(--card)', border: '1.5px solid var(--line)' }}>
                  Upload logo (PNG / JPG / SVG)
                  <input type="file" accept="image/*" className="hidden" onChange={async e => { const f = e.target.files?.[0]; if (f) { try { set({ logo: await readLogo(f) }) } catch { /* ignore unreadable file */ } } e.target.value = '' }} />
                </label>
                {c.logo && <button onClick={() => set({ logo: undefined })} className="text-[13px] underline text-left" style={{ color: 'var(--mute)' }}>Remove logo</button>}
              </div>
            </div>
            <h2 className="text-[13px] tracking-[0.2em] uppercase font-bold mt-5 mb-3" style={{ color: 'var(--brand2)' }}>5 · Theme</h2>
            <div className="grid grid-cols-2 gap-2">
              <Tile active={c.theme === 'dark'} title="Dark" sub="Best for projectors & large screens" onClick={() => set({ theme: 'dark' })} />
              <Tile active={c.theme === 'light'} title="Light" sub="Best for bright rooms" onClick={() => set({ theme: 'light' })} />
            </div>
          </section>

          <section className="card p-6 md:col-span-2">
            <h2 className="text-[13px] tracking-[0.2em] uppercase font-bold mb-3" style={{ color: 'var(--brand2)' }}>6 · Client numbers <span className="normal-case tracking-normal font-normal" style={{ color: 'var(--mute)' }}>— personalises the value estimator and dashboards</span></h2>
            <div className="grid grid-cols-2 gap-4">
              {([['headcount', 'Number of employees', 'e.g. 850'], ['hrTeam', 'HR team size', 'e.g. 6']] as const).map(([k, label, ph]) => (
                <label key={k} className="text-[14px]">{label}
                  <input type="number" min={1} value={c[k] ?? ''} placeholder={ph} onChange={e => set({ [k]: e.target.value ? Math.max(1, Number(e.target.value)) : undefined })}
                    className="w-full mt-1 rounded-xl px-4 py-3 text-[16px] outline-none" style={{ background: 'var(--card)', border: '1.5px solid var(--line)', color: 'var(--ink)' }} />
                </label>
              ))}
            </div>
          </section>

          <section className="card p-6 md:col-span-2">
            <h2 className="text-[13px] tracking-[0.2em] uppercase font-bold mb-3" style={{ color: 'var(--brand2)' }}>7 · Client pain points <span className="normal-case tracking-normal font-normal" style={{ color: 'var(--mute)' }}>— pick up to 4; they are tracked through the modules</span></h2>
            <div className="grid grid-cols-2 gap-2">
              {painOptions.map(p => {
                const on = (c.pains ?? []).includes(p.id)
                const full = (c.pains ?? []).length >= 4
                return <Tile key={p.id} active={on} title={`${p.icon} ${p.label}`} onClick={() => { if (!on && full) return; set({ pains: on ? (c.pains ?? []).filter(x => x !== p.id) : [...(c.pains ?? []), p.id] }) }} />
              })}
            </div>
            <input value={c.customPain ?? ''} onChange={e => set({ customPain: e.target.value })} placeholder="Another pain point in the client's own words (optional)"
              className="w-full mt-3 rounded-xl px-4 py-3 text-[15px] outline-none" style={{ background: 'var(--card)', border: '1.5px solid var(--line)', color: 'var(--ink)' }} />
          </section>

          <section className="card p-6 flex flex-col md:col-span-2">
            <h2 className="text-[13px] tracking-[0.2em] uppercase font-bold mb-3" style={{ color: 'var(--brand2)' }}>Summary</h2>
            <ul className="text-[15px] leading-relaxed flex-1" style={{ color: 'var(--mute)' }}>
              <li><b style={{ color: 'var(--ink)' }}>Country:</b> {co.name} ({co.currency}, {co.taxName})</li>
              <li><b style={{ color: 'var(--ink)' }}>Industry:</b> {ind.name}</li>
              <li><b style={{ color: 'var(--ink)' }}>Client:</b> {c.client || '— none —'}{c.logo ? ' (logo added)' : ''}</li>
              <li><b style={{ color: 'var(--ink)' }}>Spotlight modules:</b> {ind.focusModules.join(', ')}</li>
              <li><b style={{ color: 'var(--ink)' }}>Numbers:</b> {c.headcount ? `${c.headcount} employees` : 'default sample'}{c.hrTeam ? ` · HR team of ${c.hrTeam}` : ''}</li>
              <li><b style={{ color: 'var(--ink)' }}>Pain points:</b> {(c.pains ?? []).length + (c.customPain?.trim() ? 1 : 0) || 'industry defaults'}</li>
              <li><b style={{ color: 'var(--ink)' }}>Deck:</b> 45 slides · 27 modules · IT deep-dive · packages</li>
            </ul>
            <button onClick={() => onStart(c)} className="mt-4 rounded-2xl py-4 text-[19px] font-extrabold text-white" style={{ background: 'linear-gradient(90deg, var(--brand), var(--accent))' }}>▶ Load presentation</button>
          </section>
        </div>
        <p className="text-center text-[13px] mt-6" style={{ color: 'var(--mute)' }}>During the show: ←/→ navigate · G grid · N notes · T theme · F fullscreen · C back to this screen</p>
      </div>
    </div>
  )
}
