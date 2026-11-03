'use client';

import Script from 'next/script';
import {useEffect, useRef, useState} from 'react';
import {clarityPreferenceKey, clarityTagUrl, privacyBlocksRecording, readRecordingPreference, recordingConsent, recordingEnvironmentAllowed, saveRecordingPreference} from '@/lib/clarity-config.mjs';

type ClarityFunction = {(...args: unknown[]): void; q?: IArguments[]};
type ClarityWindow = Window & {clarity?: ClarityFunction};

function clarityQueue(): ClarityFunction {
  const browser = window as ClarityWindow;
  if (!browser.clarity) {
    const queue: ClarityFunction = function (..._args: unknown[]) {(queue.q = queue.q || []).push(arguments);};
    browser.clarity = queue;
  }
  return browser.clarity;
}

export default function SiteClarity({production}: {production: boolean}) {
  const [open, setOpen] = useState(false);
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [blocked, setBlocked] = useState(false);
  const [requested, setRequested] = useState(false);
  const [notice, setNotice] = useState('');
  const eligible = useRef(false), currentChoice = useRef(false), ready = useRef(false), stopped = useRef(false);
  const heading = useRef<HTMLHeadingElement>(null), opener = useRef<HTMLElement | null>(null);

  function apply(choice: boolean | null) {
    setAllowed(choice);
    currentChoice.current = choice === true && eligible.current;
    const existing = (window as ClarityWindow).clarity;
    if (currentChoice.current) {
      const clarity = clarityQueue();
      clarity('consentv2', recordingConsent(true));
      if (ready.current && stopped.current) {clarity('start'); stopped.current = false;}
      setRequested(true);
    } else if (existing) {
      existing('consentv2', recordingConsent(false));
      existing('stop');
      stopped.current = true;
    }
  }

  useEffect(() => {
    const privacy = navigator as Navigator & {globalPrivacyControl?: boolean};
    setBlocked(privacyBlocksRecording(privacy));
    eligible.current = recordingEnvironmentAllowed(production, location.hostname, privacy, location.href, document.referrer);
    let choice: boolean | null = null;
    try {choice = readRecordingPreference(localStorage);} catch {}
    apply(choice);
    setOpen(eligible.current && choice === null);
    const onPreferences = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const control = event.target.closest<HTMLElement>('[data-recording-preferences]');
      if (control) {opener.current = control; setNotice(''); setOpen(true);}
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === clarityPreferenceKey || event.key === null) {
        let preference = null;
        try {preference = readRecordingPreference(localStorage);} catch {}
        apply(preference);
      }
    };
    document.addEventListener('click', onPreferences);
    window.addEventListener('storage', onStorage);
    return () => {document.removeEventListener('click', onPreferences); window.removeEventListener('storage', onStorage);};
  }, [production]);

  useEffect(() => {if (open && opener.current) heading.current?.focus();}, [open]);

  function close() {setOpen(false); opener.current?.focus();}
  function choose(value: boolean) {
    let saved = false;
    try {saved = saveRecordingPreference(localStorage, value);} catch {}
    apply(value);
    if (saved) close();
    else setNotice('Your browser could not save this preference. Your choice applies to this page only.');
  }

  return <>
    {requested ? <Script id="microsoft-clarity" src={clarityTagUrl} strategy="lazyOnload" onReady={()=>{
      ready.current = true;
      if (!currentChoice.current) {clarityQueue()('consentv2', recordingConsent(false)); clarityQueue()('stop'); stopped.current = true;}
    }}/> : null}
    {open ? <section className="recording-preferences" aria-labelledby="recording-heading" aria-describedby="recording-description" data-clarity-mask="true">
      <h2 id="recording-heading" ref={heading} tabIndex={-1}>Session recording</h2>
      <p id="recording-description">{blocked ? 'Session recording is off because of your browser’s privacy settings.' : 'Allow Microsoft Clarity to record masked page interactions? Contact form fields are masked. This choice controls session recording only.'}</p>
      {!blocked ? <a className="recording-privacy" href="https://privacy.microsoft.com/en-us/privacystatement" target="_blank" rel="noopener noreferrer">Microsoft privacy statement</a> : null}
      {allowed !== null && !blocked ? <p className="recording-current">Current preference: {allowed ? 'allowed' : 'declined'}.</p> : null}
      <div className="recording-actions">{!blocked ? <><button type="button" onClick={()=>choose(true)}>Allow recording</button><button type="button" onClick={()=>choose(false)}>Decline</button></> : <button type="button" onClick={close}>Done</button>}</div>
      {notice ? <><p role="status">{notice}</p><button type="button" className="recording-dismiss" onClick={close}>Close preferences</button></> : null}
    </section> : null}
  </>;
}
