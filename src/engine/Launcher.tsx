import { useState } from 'react'
import { PHLogo } from '../ui/PHLogo'
import { countries } from '../profiles/countries'
import { industries } from '../profiles/industries'
import { painsFor } from '../profiles/pains'
import { IndustryArt } from '../ui/IndustryArt'
import { agendaFor, fmtTime, pickSlides, totalSecs, type Agenda } from './agenda'
import { DeckThumb } from '../ui/DeckThumb'
import { arrangeFor, decks, getDeckSlides, resolveDeckId } from '../decks/registry'
import { defaultOutcomes } from '../decks/workshop/data'
import { buildCtx } from './buildCtx'
import type { SlideDef } from './context'

export interface Config { country: string; industry: string; client: string; theme: 'dark' | 'light'; logo?: string; headcount?: number; hrTeam?: number; pains?: string[]; customPain?: string; agenda?: Agenda; agendas?: Record<string, Agenda>; deck?: string; nav?: string; qrUrl?: string; qrPersonalise?: boolean; qrClientView?: boolean; qrLogoUrl?: string; presenter?: PresenterConfig }

/** Presenter / partner details typed on the settings screen. Blank company = Victory Information defaults. */
export interface PresenterConfig { company?: string; name?: string; title?: string; email?: string; phone?: string; web?: string; logo?: string }

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
/** Where the deck is hosted — pre-filled as the QR / team-link address (can still be changed or cleared). */
export const HOSTED_URL = 'https://presentation.peoplehub.biz'
export const emptyConfig: Config = { country: 'lk', industry: 'generic', client: '', theme: 'dark', qrUrl: HOSTED_URL }
export function loadConfig(): Config {
  try { return { ...emptyConfig, ...JSON.parse(localStorage.getItem(KEY) ?? '{}') } } catch { return emptyConfig }
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

export function Launcher({ initial, onStart, onExport, onGuide }: { initial: Config; onStart: (c: Config) => void; onExport: (c: Config) => void; onGuide: () => void }) {
  const [c, setC] = useState<Config>(initial)
  const set = (p: Partial<Config>) => { const n = { ...c, ...p }; setC(n); if (p.theme) document.documentElement.dataset.theme = p.theme }
  const co = countries[c.country], ind = industries[c.industry]
  const deckId = resolveDeckId(c.deck)
  const slides = getDeckSlides(deckId)
  const agenda = agendaFor(c, deckId)
  const deckDef = decks.find(d => d.id === deckId)!
  const chapterDefs = deckDef.chapters
  const previewCtx = buildCtx(c)
  const previewOutcomes = defaultOutcomes(previewCtx)
  const visible = pickSlides(arrangeFor(deckId, slides, previewOutcomes, c.nav), agenda, { ...previewCtx, outcomes: previewOutcomes })
  const chapterIds = agenda.chapters ?? chapterDefs?.map(ch => ch.id) ?? []
  const chapterRows = chapterDefs ? [...chapterIds.map(id => chapterDefs.find(ch => ch.id === id)).filter((ch): ch is { id: string; name: string } => !!ch), ...chapterDefs.filter(ch => !chapterIds.includes(ch.id))] : []
  const toggleChapter = (id: string) => setAgenda({ mode: 'chapters', chapters: chapterIds.includes(id) ? chapterIds.filter(x => x !== id) : [...chapterIds, id] })
  const moveChapter = (id: string, d: -1 | 1) => { const i = chapterIds.indexOf(id), j = i + d; if (i < 0 || j < 0 || j >= chapterIds.length) return; const n = [...chapterIds]; [n[i], n[j]] = [n[j], n[i]]; setAgenda({ mode: 'chapters', chapters: n }) }
  const setAgenda = (a: Partial<Agenda>) => set({ agendas: { ...(c.agendas ?? {}), [deckId]: { ...agenda, ...a } } })
  const pr = c.presenter ?? {}
  const setPresenter = (p: Partial<PresenterConfig>) => set({ presenter: { ...pr, ...p } })
  const manualIds = agenda.ids
  const orderedAll = agenda.mode === 'manual' ? [...manualIds.map(id => slides.find(s => s.id === id)).filter((s): s is SlideDef => !!s), ...slides.filter(s => !manualIds.includes(s.id))] : slides
  const toggleSlide = (id: string) => {
    if (manualIds.includes(id)) { setAgenda({ ids: manualIds.filter(x => x !== id) }); return }
    const pos = slides.findIndex(s => s.id === id)
    let at = 0
    manualIds.forEach((m, i) => { if (slides.findIndex(s => s.id === m) < pos) at = i + 1 })
    setAgenda({ ids: [...manualIds.slice(0, at), id, ...manualIds.slice(at)] })
  }
  const moveSlide = (id: string, d: -1 | 1) => {
    const i = manualIds.indexOf(id), j = i + d
    if (i < 0 || j < 0 || j >= manualIds.length) return
    const n = [...manualIds];[n[i], n[j]] = [n[j], n[i]]
    setAgenda({ ids: n })
  }
  const modeBtn = (label: string, active: boolean, onClick: () => void) => <Tile key={label} active={active} title={label} onClick={onClick} />

  return (
    <div className="fixed inset-0 overflow-auto" style={{ background: 'radial-gradient(ellipse at 15% 0%, color-mix(in srgb, var(--brand) 25%, transparent), transparent 55%), var(--bg)' }}>
      <div className="max-w-[1100px] mx-auto px-4 sm:px-8 py-6 sm:py-10">
        <div className="flex flex-wrap items-center gap-4 mb-6 sm:mb-8">
          <PHLogo className="h-16 w-16" />
          <div className="flex-1"><div className="serif text-[24px] sm:text-[32px] font-bold leading-tight">PeopleHub HRIS</div><div style={{ color: 'var(--mute)' }}>Sales presentation · configure before you present</div></div>
          <button onClick={onGuide} className="rounded-xl px-5 py-3 text-[15px] font-bold" style={{ background: 'var(--card)', border: '1.5px solid var(--line)' }}>📖 Presenter guide</button>
        </div>

        <section className="mb-6">
          <h2 className="text-[13px] tracking-[0.2em] uppercase font-bold mb-3" style={{ color: 'var(--brand2)' }}>Choose presentation <span className="normal-case tracking-normal font-normal" style={{ color: 'var(--mute)' }}>— each one keeps its own duration and slide selection</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {decks.map(d => {
              const ds = getDeckSlides(d.id), on = d.id === deckId
              return (
                <button key={d.id} onClick={() => set({ deck: d.id })} className="card text-left p-4 flex gap-4 items-center transition hover:brightness-110"
                  style={{ outline: on ? '2px solid var(--brand2)' : 'none', background: on ? 'color-mix(in srgb, var(--brand) 18%, var(--card))' : undefined }}>
                  <div className="w-[120px] h-[84px] flex-none rounded-lg overflow-hidden" style={{ background: 'var(--bg2)', border: '1px solid var(--line)' }}><DeckThumb id={d.id} /></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2"><b className="text-[18px]">{d.name}</b>
                      {d.badge && <span className="rounded-full px-2 py-0.5 text-[11px] font-bold" style={{ background: 'color-mix(in srgb, var(--warn) 22%, transparent)', color: 'var(--warn)' }}>{d.badge}</span>}
                      {on && <span className="rounded-full px-2 py-0.5 text-[11px] font-bold" style={{ background: 'color-mix(in srgb, var(--ok) 22%, transparent)', color: 'var(--ok)' }}>✓ Selected</span>}
                    </div>
                    <div className="text-[13.5px] mt-0.5" style={{ color: 'var(--mute)' }}>{d.tagline}</div>
                    <div className="text-[12.5px] mt-1.5" style={{ color: 'var(--mute)' }}><b style={{ color: 'var(--ink)' }}>Best for:</b> {d.bestFor} · {ds.length} slides · about {Math.round(totalSecs(ds) / 60)} min in full</div>
                  </div>
                </button>
              )
            })}
          </div>
        </section>

        {deckDef.navs && (
          <section className="mb-6">
            <h2 className="text-[13px] tracking-[0.2em] uppercase font-bold mb-3" style={{ color: 'var(--brand2)' }}>Navigation screen <span className="normal-case tracking-normal font-normal" style={{ color: 'var(--mute)' }}>— how the client explores the modules; only this one is shown</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[...deckDef.navs, { id: 'all', name: 'Show all of them', desc: 'Keep every navigation screen in the deck and decide on the day' }].map(n => {
                const on = (c.nav ?? deckDef.defaultNav) === n.id
                return <Tile key={n.id} active={on} title={n.name} sub={n.desc} onClick={() => set({ nav: n.id })} />
              })}
            </div>
          </section>
        )}

        <section className="card p-6 mb-6">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h2 className="text-[13px] tracking-[0.2em] uppercase font-bold" style={{ color: 'var(--brand2)' }}>Presenter / partner <span className="normal-case tracking-normal font-normal" style={{ color: 'var(--mute)' }}>— whose details appear on the opener, closing slide, PDF and team link</span></h2>
            {(pr.company || pr.name || pr.email || pr.phone || pr.web || pr.title || pr.logo) && <button onClick={() => set({ presenter: undefined })} className="text-[13px] underline flex-none" style={{ color: 'var(--mute)' }}>Reset to Victory Information</button>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {([['company', 'Company', co.contact.company], ['name', 'Presenter name', 'e.g. Nimal Perera'], ['title', 'Job title', 'e.g. Sales Manager'], ['email', 'Email', co.contact.email], ['phone', 'Phone', co.contact.phone], ['web', 'Website', co.contact.web]] as const).map(([k, label, ph]) => (
              <label key={k} className="text-[13px]">{label}
                <input value={pr[k] ?? ''} onChange={e => setPresenter({ [k]: e.target.value })} placeholder={ph}
                  className="w-full mt-1 rounded-xl px-3 py-2.5 text-[16px] outline-none" style={{ background: 'var(--card)', border: '1.5px solid var(--line)', color: 'var(--ink)' }} />
              </label>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-3">
            <div className="h-14 w-32 rounded-lg grid place-items-center overflow-hidden flex-none" style={{ background: '#fff', border: '1.5px dashed var(--line)' }}>
              {pr.logo ? <img src={pr.logo} alt="Presenter logo" className="max-h-full max-w-full object-contain p-1" /> : <span className="text-[11px] text-slate-500">No logo</span>}
            </div>
            <label className="cursor-pointer rounded-xl px-4 py-2 text-[13px] font-bold" style={{ background: 'var(--card)', border: '1.5px solid var(--line)' }}>
              Upload presenter / partner logo
              <input type="file" accept="image/*" className="hidden" onChange={async e => { const f = e.target.files?.[0]; if (f) { try { setPresenter({ logo: await readLogo(f) }) } catch { /* ignore unreadable file */ } } e.target.value = '' }} />
            </label>
            {pr.logo && <button onClick={() => setPresenter({ logo: undefined })} className="text-[13px] underline" style={{ color: 'var(--mute)' }}>Remove</button>}
            <span className="text-[12.5px]" style={{ color: 'var(--mute)' }}>Leave Company blank to present as Victory Information. If you enter a company, only the details you fill in are shown — nothing from Victory is added to your contact card.</span>
          </div>
        </section>

        <div className="grid md:grid-cols-2 gap-6">
          <section className="card p-6">
            <h2 className="text-[13px] tracking-[0.2em] uppercase font-bold mb-3" style={{ color: 'var(--brand2)' }}>1 · Country</h2>
            <div className="grid grid-cols-1 gap-2">
              {Object.values(countries).map(x => <Tile key={x.id} active={c.country === x.id} title={x.name} sub={`${x.currency} · ${x.taxName} · ${x.statutory.map(s => s.label).filter((v, i, a) => a.indexOf(v) === i).join(', ')}`} onClick={() => set({ country: x.id })} />)}
            </div>
          </section>

          <section className="card p-6">
            <h2 className="text-[13px] tracking-[0.2em] uppercase font-bold mb-3" style={{ color: 'var(--brand2)' }}>2 · Industry</h2>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(industries).map(x => <Tile key={x.id} active={c.industry === x.id} title={x.name} onClick={() => set({ industry: x.id })} />)}
            </div>
            <p className="text-[13.5px] mt-3" style={{ color: 'var(--mute)' }}>“{ind.headline}”</p>
            <IndustryArt id={c.industry} className="w-full h-[150px] mt-3" />
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

          <section className="card p-6">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {painsFor(c.country, c.industry).map(({ pain: p, tag }) => {
                const on = (c.pains ?? []).includes(p.id)
                const full = (c.pains ?? []).length >= 4
                return <Tile key={p.id} active={on} title={`${p.icon} ${p.label}`} sub={tag ? `${tag === 'country' ? co.name : ind.name} specific` : undefined} onClick={() => { if (!on && full) return; set({ pains: on ? (c.pains ?? []).filter(x => x !== p.id) : [...(c.pains ?? []), p.id] }) }} />
              })}
            </div>
            <input value={c.customPain ?? ''} onChange={e => set({ customPain: e.target.value })} placeholder="Another pain point in the client's own words (optional)"
              className="w-full mt-3 rounded-xl px-4 py-3 text-[16px] outline-none" style={{ background: 'var(--card)', border: '1.5px solid var(--line)', color: 'var(--ink)' }} />
          </section>

          <section className="card p-6 md:col-span-2">
            <h2 className="text-[13px] tracking-[0.2em] uppercase font-bold mb-3" style={{ color: 'var(--brand2)' }}>8 · Presentation time &amp; agenda <span className="normal-case tracking-normal font-normal" style={{ color: 'var(--mute)' }}>— hides or shows slides automatically, or schedule them yourself</span></h2>
            <div className={`grid grid-cols-2 sm:grid-cols-3 ${chapterDefs ? 'md:grid-cols-4 lg:grid-cols-7' : 'md:grid-cols-6'} gap-2`}>
              {modeBtn('Full deck', agenda.mode === 'full', () => setAgenda({ mode: 'full' }))}
              {[20, 30, 45].map(m => modeBtn(`${m} min`, agenda.mode === 'auto' && agenda.minutes === m, () => setAgenda({ mode: 'auto', minutes: m })))}
              <label className="rounded-xl px-3 py-2 flex items-center gap-2 text-[14px]" style={{ background: agenda.mode === 'auto' && ![20, 30, 45].includes(agenda.minutes) ? 'color-mix(in srgb, var(--brand) 30%, transparent)' : 'var(--card)', border: '1.5px solid var(--line)' }}>
                <input type="number" min={5} max={180} value={agenda.minutes} onChange={e => setAgenda({ mode: 'auto', minutes: Math.min(180, Math.max(5, Number(e.target.value) || 5)) })} className="w-14 bg-transparent outline-none font-bold text-[16px]" /> min
              </label>
              {chapterDefs && modeBtn('Pick chapters', agenda.mode === 'chapters', () => setAgenda({ mode: 'chapters', chapters: agenda.chapters ?? chapterDefs.map(ch => ch.id) }))}
              {modeBtn('Manual', agenda.mode === 'manual', () => setAgenda({ mode: 'manual', ids: agenda.mode === 'manual' && manualIds.length ? manualIds : visible.map(s => s.id) }))}
            </div>
            <p className="text-[14px] mt-3" style={{ color: 'var(--mute)' }}>
              <b style={{ color: 'var(--ink)' }}>{visible.length} of {slides.length} slides · about {fmtTime(totalSecs(visible))} min.</b>{' '}
              {agenda.mode === 'auto' ? 'Keeps the opener, challenges, packages and close, then adds the modules that matter most for this client’s industry and pain points until the time is used. Hidden slides can still be opened from the slide grid (G).' : agenda.mode === 'chapters' ? 'Tick the outcome chapters to include and use ▲ ▼ to set their order. The opening and closing slides always stay.' : agenda.mode === 'manual' ? 'Tick the slides to include and use ▲ ▼ to set the order.' : 'Every slide, in the standard order.'}
            </p>
            {agenda.mode === 'chapters' && (
              <div className="mt-3 flex flex-col gap-1.5">
                {chapterRows.map(ch => {
                  const on = chapterIds.includes(ch.id), i = chapterIds.indexOf(ch.id)
                  return (
                    <div key={ch.id} className="flex items-center gap-3 rounded-lg px-3 py-1.5 text-[14px]" style={{ background: on ? 'color-mix(in srgb, var(--brand) 18%, transparent)' : 'var(--card)', border: '1px solid var(--line)', opacity: on ? 1 : 0.65 }}>
                      <input type="checkbox" checked={on} onChange={() => toggleChapter(ch.id)} />
                      <span className="w-6 text-right" style={{ color: 'var(--mute)' }}>{on ? i + 1 : ''}</span>
                      <span className="flex-1 font-semibold">{ch.name}</span>
                      <button disabled={!on || i === 0} onClick={() => moveChapter(ch.id, -1)} className="px-2 disabled:opacity-25">▲</button>
                      <button disabled={!on || i === chapterIds.length - 1} onClick={() => moveChapter(ch.id, 1)} className="px-2 disabled:opacity-25">▼</button>
                    </div>
                  )
                })}
              </div>
            )}
            {agenda.mode === 'manual' && (
              <div className="mt-3 max-h-[320px] overflow-auto pr-1 flex flex-col gap-1.5">
                {orderedAll.map(s => {
                  const on = manualIds.includes(s.id), i = manualIds.indexOf(s.id)
                  return (
                    <div key={s.id} className="flex items-center gap-3 rounded-lg px-3 py-1.5 text-[14px]" style={{ background: on ? 'color-mix(in srgb, var(--brand) 18%, transparent)' : 'var(--card)', border: '1px solid var(--line)', opacity: on ? 1 : 0.65 }}>
                      <input type="checkbox" checked={on} onChange={() => toggleSlide(s.id)} />
                      <span className="w-6 text-right" style={{ color: 'var(--mute)' }}>{on ? i + 1 : ''}</span>
                      <span className="flex-1 font-semibold">{s.title} <span className="font-normal" style={{ color: 'var(--mute)' }}>· {s.section}</span></span>
                      <span style={{ color: 'var(--mute)' }}>{s.secs}s</span>
                      <button disabled={!on || i === 0} onClick={() => moveSlide(s.id, -1)} className="px-2 disabled:opacity-25">▲</button>
                      <button disabled={!on || i === manualIds.length - 1} onClick={() => moveSlide(s.id, 1)} className="px-2 disabled:opacity-25">▼</button>
                    </div>
                  )
                })}
              </div>
            )}
          </section>

          <section className="card p-6 md:col-span-2">
            <h2 className="text-[13px] tracking-[0.2em] uppercase font-bold mb-3" style={{ color: 'var(--brand2)' }}>9 · Client team link (QR code) <span className="normal-case tracking-normal font-normal" style={{ color: 'var(--mute)' }}>— shown on the closing slide and the PDF</span></h2>
            <input value={c.qrUrl ?? ''} onChange={e => set({ qrUrl: e.target.value })} placeholder="Private page where this deck is hosted, e.g. https://share.yourcompany.com/peoplehub/index.html"
              className="w-full rounded-xl px-4 py-3 text-[16px] outline-none" style={{ background: 'var(--card)', border: '1.5px solid var(--line)', color: 'var(--ink)' }} />
            <label className="flex items-center gap-2 mt-3 text-[14px]"><input type="checkbox" checked={c.qrPersonalise !== false} onChange={e => set({ qrPersonalise: e.target.checked })} /> Add this client’s settings (country, industry, name, numbers, pain points, theme, agenda) to the link so their team sees the same personalised deck.</label>
            <label className="flex items-center gap-2 mt-2 text-[14px]"><input type="checkbox" checked={c.qrClientView !== false} onChange={e => set({ qrClientView: e.target.checked })} /> Client view — hides presenter notes, the settings screen, the timer and export, and shows a “Prepared for” ribbon.</label>
            <input value={c.qrLogoUrl ?? ''} onChange={e => set({ qrLogoUrl: e.target.value })} placeholder="Client logo web address for the link (optional) — e.g. https://presentation.peoplehub.biz/logos/acme.png"
              className="w-full mt-3 rounded-xl px-4 py-3 text-[16px] outline-none" style={{ background: 'var(--card)', border: '1.5px solid var(--line)', color: 'var(--ink)' }} />
            <p className="text-[12.5px] mt-1" style={{ color: 'var(--mute)' }}>A logo can’t be packed into a QR code. To show it for the client’s team, put the image file in the site’s <code>public/logos/</code> folder, redeploy, and enter its address here.</p>
          </section>

          <section className="card p-6 flex flex-col md:col-span-2">
            <h2 className="text-[13px] tracking-[0.2em] uppercase font-bold mb-3" style={{ color: 'var(--brand2)' }}>Summary</h2>
            <ul className="text-[15px] leading-relaxed flex-1" style={{ color: 'var(--mute)' }}>
              <li><b style={{ color: 'var(--ink)' }}>Country:</b> {co.name} ({co.currency}, {co.taxName})</li>
              <li><b style={{ color: 'var(--ink)' }}>Industry:</b> {ind.name}</li>
              <li><b style={{ color: 'var(--ink)' }}>Presentation:</b> {decks.find(d => d.id === deckId)?.name}</li>
              <li><b style={{ color: 'var(--ink)' }}>Presenter:</b> {pr.company?.trim() || co.contact.company}{pr.name ? ` · ${pr.name}` : ''}</li>
              <li><b style={{ color: 'var(--ink)' }}>Client:</b> {c.client || '— none —'}{c.logo ? ' (logo added)' : ''}</li>
              <li><b style={{ color: 'var(--ink)' }}>Spotlight modules:</b> {ind.focusModules.join(', ')}</li>
              <li><b style={{ color: 'var(--ink)' }}>Numbers:</b> {c.headcount ? `${c.headcount} employees` : 'default sample'}{c.hrTeam ? ` · HR team of ${c.hrTeam}` : ''}</li>
              <li><b style={{ color: 'var(--ink)' }}>Pain points:</b> {(c.pains ?? []).length + (c.customPain?.trim() ? 1 : 0) || 'industry defaults'}</li>
              <li><b style={{ color: 'var(--ink)' }}>Deck:</b> {visible.length} slides · about {fmtTime(totalSecs(visible))} min ({agenda.mode})</li>
              <li><b style={{ color: 'var(--ink)' }}>QR link:</b> {c.qrUrl?.trim() ? 'set' : 'not set'}</li>
            </ul>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
              <button onClick={() => onStart(c)} className="sm:col-span-2 rounded-2xl py-4 text-[19px] font-extrabold text-white" style={{ background: 'linear-gradient(90deg, var(--brand), var(--accent))' }}>▶ Load presentation</button>
              <button onClick={() => onExport(c)} className="rounded-2xl py-4 text-[16px] font-bold" style={{ background: 'var(--card)', border: '1.5px solid var(--line)' }}>⬇ Export PDF leave-behind</button>
            </div>
          </section>
        </div>
        <p className="text-center text-[13px] mt-6" style={{ color: 'var(--mute)' }}>During the show: ←/→ navigate · G grid · N notes · T theme · F fullscreen · C back to this screen · ? shortcuts · L laser pointer · E export PDF</p>
      </div>
    </div>
  )
}
