// PUT ALL CODE THAT WILL RUN ON EVERY PAGE HERE
import { setHeaderFooter } from "./header-footer.mjs";

export function GlobalInitialize(){

    // Register the service worker (DISABLED FOR TESTING);
  // if ('serviceWorker' in navigator) {
  //   navigator.serviceWorker.register('/service-worker.js')
  //     .then(reg => console.log('Service Worker registered!', reg))
  //     .catch(err => console.error('SW registration failed:', err));
  // }

  if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => {
      registration.unregister().then((boolean) => {
        if (boolean) {
          console.log('Service worker unregistered successfully:', registration);
        } else {
          console.log('Service worker could not be unregistered:', registration);
        }
      });
    });
  });
}
  setHeaderFooter();
}
