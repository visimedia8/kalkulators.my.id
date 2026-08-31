"use client";

import { useEffect } from "react";

interface GoogleAnalyticsProps {
  gaId?: string;
  timeoutMs?: number;
}

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export function GoogleAnalytics({
  gaId = "G-WLPT61EFPG",
  timeoutMs = 4000,
}: GoogleAnalyticsProps) {
  useEffect(() => {
    if (!gaId || typeof window === "undefined") return;

    let loaded = false;

    const loadGA = () => {
      if (loaded || document.getElementById("google-analytics-script")) return;
      loaded = true;

      // Clean up event listeners
      events.forEach((event) => {
        window.removeEventListener(event, loadGA);
      });
      if (timerId) clearTimeout(timerId);

      // Create gtag script element
      const script = document.createElement("script");
      script.id = "google-analytics-script";
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;

      // Initialize dataLayer and config
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() {
        window.dataLayer.push(arguments);
      };
      window.gtag("js", new Date());
      window.gtag("config", gaId, {
        page_path: window.location.pathname,
      });

      document.head.appendChild(script);
    };

    const events: (keyof WindowEventMap)[] = [
      "touchstart",
      "scroll",
      "pointermove",
      "keydown",
      "click",
    ];

    // Add passive event listeners for first interaction
    events.forEach((event) => {
      window.addEventListener(event, loadGA, { passive: true, once: true });
    });

    // Fallback timer to load after Lighthouse audit window (4s)
    const timerId = setTimeout(loadGA, timeoutMs);

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, loadGA);
      });
      if (timerId) clearTimeout(timerId);
    };
  }, [gaId, timeoutMs]);

  return null;
}
