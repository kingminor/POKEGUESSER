
import { setHeaderFooter } from "./header-footer.mjs";

setHeaderFooter();

// Register the service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(reg => console.log('Service Worker registered!', reg))
    .catch(err => console.error('SW registration failed:', err));
}

function checkboxTemplate(elementId, list) {
  const element = document.getElementById(elementId);
  let attributeText = '';
  for (let i = 0; i < list.length; i ++) {
    attributeText = list[i].toLowerCase();
    attributeText = attributeText.replace(/\s/g, '');
    element.insertAdjacentHTML('beforeend', `
      <div>
        <label for="${attributeText}">${list[i]}</label>
        <input id="${attributeText}" type="checkbox" checked>
      </div>
    `);
  }
}

const types = [
  'Bug',
  'Dark',
  'Dragon',
  'Electric',
  'Fairy',
  'Fighting',
  'Fire',
  'Flying',
  'Ghost',
  'Grass',
  'Ground',
  'Ice',
  'Normal',
  'Poison',
  'Psychic',
  'Rock',
  'Steel',
  'Water'
];
const generations = [
  'Gen 1',
  'Gen 2',
  'Gen 3',
  'Gen 4',
  'Gen 5',
  'Gen 6',
  'Gen 7',
  'Gen 8'
];

checkboxTemplate('type-grid', types);
checkboxTemplate('gen-grid', generations);
