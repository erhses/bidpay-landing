'use client';

import { type ReactNode, useSyncExternalStore } from 'react';
import { links } from '@/content/site';

const subscribe = () => () => {};
const storeForThisDevice = () => {
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/.test(ua)) return links.appStore;
  if (/Android/.test(ua)) return links.googlePlay;
  return null;
};

/** On a phone this opens the right store. On a computer it jumps to the QR code at the foot of the page. */
export default function DownloadLink({ className, children }: { className?: string; children: ReactNode }) {
  const store = useSyncExternalStore(subscribe, storeForThisDevice, () => null);
  return store ? (
    <a className={className} href={store} target="_blank" rel="noopener">
      {children}
    </a>
  ) : (
    <a className={className} href="#tatah">
      {children}
    </a>
  );
}
