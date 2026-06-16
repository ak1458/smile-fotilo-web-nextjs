'use client';

import { usePathname } from 'next/navigation';
import { NavBar } from './NavBar';
import { MobileBottomNav } from './MobileBottomNav';
import { ChatSupportWrapper } from './ChatSupportWrapper';

// The /portfolio route is a standalone immersive experience with its own
// nav, menu and footer — it must NOT render the site-wide chrome.
function isImmersive(pathname: string | null) {
  return !!pathname && pathname.startsWith('/portfolio');
}

export function SiteChromeTop() {
  const pathname = usePathname();
  if (isImmersive(pathname)) return null;
  return <NavBar />;
}

export function SiteChromeBottom() {
  const pathname = usePathname();
  if (isImmersive(pathname)) return null;
  return (
    <>
      <ChatSupportWrapper />
      <MobileBottomNav />
    </>
  );
}
