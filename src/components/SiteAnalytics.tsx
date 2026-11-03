'use client';

import {useEffect, useState} from 'react';
import {GoogleAnalytics, sendGAEvent} from '@next/third-parties/google';
import {analyticsHosts, analyticsPageLocation, analyticsReferrer, contactEvents, measurementId} from '@/lib/analytics-config.mjs';

export default function SiteAnalytics() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const privacy = navigator as Navigator & {globalPrivacyControl?: boolean};
    const optOut = (window as Window & Record<string, unknown>)[`ga-disable-${measurementId}`];
    if (!analyticsHosts.includes(location.hostname) || privacy.globalPrivacyControl || navigator.doNotTrack === '1' || optOut) return;

    // These commands precede the official component's config/page_view command.
    // The only page URL sent excludes query strings and hashes; referrers use origin only.
    window.dataLayer = window.dataLayer || [];
    const queue = function (..._args: unknown[]) {window.dataLayer!.push(arguments);};
    queue('set', {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      page_location: analyticsPageLocation(location.href),
      page_referrer: analyticsReferrer(document.referrer),
    });
    setEnabled(true);

    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const target = event.target.closest<HTMLElement>('[data-analytics-contact],a[href]');
      if (!target) return;
      let channel = target.dataset.analyticsContact;
      if (!channel && target instanceof HTMLAnchorElement) {
        if (target.protocol === 'mailto:') channel = 'email';
        else if (target.protocol === 'tel:') channel = 'phone';
        else if (target.hostname === 'wa.me') channel = 'whatsapp';
      }
      for (const item of contactEvents(channel, target.dataset.analyticsContext === 'enquiry')) {
        sendGAEvent('event', item.name, item.params);
      }
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return enabled ? <GoogleAnalytics gaId={measurementId}/> : null;
}
