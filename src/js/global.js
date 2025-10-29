// PUT ALL CODE THAT WILL RUN ON EVERY PAGE HERE
import { setHeaderFooter } from "./header-footer.mjs";

export function Initalize(){

    // Register the service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => console.log('Service Worker registered!', reg))
      .catch(err => console.error('SW registration failed:', err));
  }

  setHeaderFooter();
}