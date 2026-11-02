'use client';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowUpRight, Check, Plus } from 'lucide-react';
import { briefSchema, enquiryLinks, type Brief } from '@/lib/brief';
import { site } from '@/data/site';
import { services } from '@/data/services';
import { GhostText } from './ui/TextEffects';

export default function ContactBrief() {
  const [fields, setFields] = useState({name:'',contact:'',message:''});
  const [selected, setSelected] = useState<string[]>([]);
  const [brief, setBrief] = useState<Brief|null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const heading = useRef<HTMLHeadingElement>(null);
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => { try { localStorage.removeItem('socialmint-brief'); } catch {} }, []);
  useEffect(() => { if (brief) heading.current?.focus(); }, [brief]);
  const links = brief ? enquiryLinks(brief, site.email, site.phone) : null;
  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(''); setNotice('');
    if (new FormData(event.currentTarget).get('company')) return;
    const result = briefSchema.safeParse({...fields,services:selected});
    if (!result.success) {
      setError(result.error.issues[0].message);
      const name = String(result.error.issues[0].path[0]);
      const input = form.current?.elements.namedItem(name);
      if (input instanceof HTMLElement) input.focus();
      return;
    }
    setBrief(result.data);
  }
  async function copy() {
    if (!links) return;
    try { await navigator.clipboard.writeText(links.body); setNotice('Enquiry copied. Paste it into WhatsApp or your email.'); }
    catch { setNotice('Copy is unavailable in this browser. Select the enquiry text below to copy it, or download a copy.'); }
  }
  function download() {
    if (!links) return;
    try {
      const url = URL.createObjectURL(new Blob([links.body], {type:'text/plain;charset=utf-8'}));
      const anchor = document.createElement('a'); anchor.href=url; anchor.download='socialmint-enquiry.txt';
      document.body.appendChild(anchor); anchor.click(); anchor.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch { setNotice('Download unavailable. Select and copy the enquiry text below.'); }
  }
  return <div className="brief-panel">
    <div className="brief-heading"><h3><GhostText prefix="Tell us " text="your story."/></h3><ArrowUpRight/></div>
    {brief && links ? <div className="brief-review">
      <h4 ref={heading} tabIndex={-1}>Ready for your review.</h4>
      <p>Choose WhatsApp or email, then send your enquiry there. Nothing has been sent yet.</p>
      {(links.copyForEmail || links.copyForWhatsapp) && <p>Your enquiry is too long to prefill every app reliably. Copy the full text first and paste it after opening the app.</p>}
      <label htmlFor="brief-preview">Your enquiry</label>
      <textarea id="brief-preview" readOnly value={links.body} rows={7}/>
      <div className="brief-delivery">
        <a className="button primary" href={links.whatsapp} target="_blank" rel="noopener noreferrer">{links.copyForWhatsapp?'Open WhatsApp':'Continue in WhatsApp'} <ArrowUpRight size={18}/></a>
        <a className="text-button" href={links.email}>{links.copyForEmail?'Open email':'Continue in email'} <ArrowUpRight size={18}/></a>
      </div>
      <div className="brief-tools"><button type="button" onClick={copy}>Copy enquiry</button><button type="button" onClick={download}>Download text</button><button type="button" onClick={()=>{setBrief(null);setNotice('');}}>Edit enquiry</button><button type="button" onClick={()=>{setBrief(null);setFields({name:'',contact:'',message:''});setSelected([]);setNotice('');}}>Clear enquiry</button></div>
      <p role="status" aria-live="polite">{notice}</p>
      <small className="form-note">Your details stay in this tab until you choose a contact app. Reloading or leaving clears the form.</small>
    </div> : <form ref={form} onSubmit={prepare} noValidate aria-describedby="brief-help brief-error">
      <label>Your name<input name="name" maxLength={100} autoComplete="name" placeholder="What should we call you?" required value={fields.name} onChange={e=>setFields({...fields,name:e.target.value})}/></label>
      <label>Email or WhatsApp<input name="contact" maxLength={254} autoComplete="email" placeholder="Where can we reach you?" required value={fields.contact} onChange={e=>setFields({...fields,contact:e.target.value})}/></label>
      <fieldset><legend>I’m interested in</legend><div className="service-chips">{services.map(service=><button key={service.short} type="button" aria-pressed={selected.includes(service.short)} onClick={()=>setSelected(items=>items.includes(service.short)?items.filter(item=>item!==service.short):[...items,service.short])}>{service.short}{selected.includes(service.short)?<Check size={12}/>:<Plus size={12}/>}</button>)}</div></fieldset>
      <label>What do you want to grow?<textarea name="message" maxLength={3000} rows={3} placeholder="A little about your brand and your next big idea…" required value={fields.message} onChange={e=>setFields({...fields,message:e.target.value})}/></label>
      <input className="honeypot" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true"/>
      <p id="brief-error" className="form-error" role="alert">{error}</p>
      <button className="button primary submit" type="submit">Review enquiry <ArrowUpRight size={18}/></button>
      <small id="brief-help" className="form-note">Review your details, then send through WhatsApp or email. No account needed.</small>
      <noscript><p>Please use the direct email or WhatsApp links to contact us.</p></noscript>
    </form>}
  </div>;
}
