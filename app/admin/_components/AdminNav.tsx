"use client";

import { usePathname } from "next/navigation";

export default function AdminNav({ claimsBadge = 0 }: { claimsBadge?: number }) {
  const pathname = usePathname();

  const NAV = [
    {
      href: "/admin",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
        </svg>
      ),
      label: "Dashboard",
      badge: 0,
    },
    {
      href: "/admin/aprobare",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
          <line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
        </svg>
      ),
      label: "Spre aprobare",
      badge: 0,
    },
    {
      href: "/admin/revendicari",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      ),
      label: "Revendicări",
      badge: claimsBadge,
    },
    {
      href: "/admin/nou",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      ),
      label: "Listing nou",
      badge: 0,
    },
  ];

  return (
    <nav className="flex flex-col gap-1 px-3">
      {NAV.map(({ href, icon, label, badge }) => {
        const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
        return (
          <a
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-colors ${
              active
                ? "bg-[#fff4f0] text-[#ff5a2e]"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <span className={active ? "text-[#ff5a2e]" : "text-gray-400"}>{icon}</span>
            <span className="flex-1">{label}</span>
            {badge > 0 && (
              <span className="bg-[#ff5a2e] text-white text-xs font-black w-5 h-5 rounded-full flex items-center justify-center">
                {badge}
              </span>
            )}
          </a>
        );
      })}
    </nav>
  );
}
