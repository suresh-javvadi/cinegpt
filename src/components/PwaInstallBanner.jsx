import { useEffect, useState } from "react";

const isIosSafari = () => {
  const ua = navigator.userAgent;
  const ios = /iphone|ipad|ipod/i.test(ua);
  const safari = /^((?!chrome|android|crios|fxios).)*safari/i.test(ua);
  return ios && safari;
};

const isStandalone = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  navigator.standalone === true;

const PwaInstallBanner = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [ios, setIos] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isStandalone()) return;
    if (sessionStorage.getItem("pwa-dismissed")) return;

    const handlePrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", handlePrompt);

    if (isIosSafari()) {
      setIos(true);
      setVisible(true);
    }

    return () => window.removeEventListener("beforeinstallprompt", handlePrompt);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setVisible(false);
    if (outcome === "dismissed") sessionStorage.setItem("pwa-dismissed", "1");
  };

  const handleDismiss = () => {
    sessionStorage.setItem("pwa-dismissed", "1");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9998] w-[calc(100%-2rem)] max-w-sm px-0 sm:hidden">
      <div
        className="bg-zinc-900/95 border border-white/10 rounded-2xl px-4 py-3 shadow-2xl shadow-black/60 flex items-center gap-3"
        style={{ backdropFilter: "blur(12px)" }}
      >
        <img
          src="/favIcon.png"
          alt="CineGPT"
          className="w-10 h-10 rounded-xl flex-shrink-0"
        />

        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-semibold leading-tight">Install CineGPT</p>
          {ios && !deferredPrompt ? (
            <p className="text-gray-400 text-[11px] mt-0.5 leading-snug">
              Tap{" "}
              <span className="inline-block text-gray-300 font-medium">
                &#x2B06;&#xFE0E; Share
              </span>{" "}
              → <span className="text-gray-300 font-medium">Add to Home Screen</span>
            </p>
          ) : (
            <p className="text-gray-400 text-[11px] mt-0.5">
              Add to your home screen
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {deferredPrompt && (
            <button
              onClick={handleInstall}
              className="text-xs font-semibold bg-white text-black px-3 py-1.5 rounded-lg active:scale-95 transition cursor-pointer"
            >
              Install
            </button>
          )}
          <button
            onClick={handleDismiss}
            className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-gray-300 transition cursor-pointer"
            aria-label="Dismiss"
          >
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PwaInstallBanner;
