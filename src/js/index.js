
import { setHeaderFooter } from "./header-footer.mjs";

setHeaderFooter();

// Register the service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(reg => console.log('Service Worker registered!', reg))
    .catch(err => console.error('SW registration failed:', err));
}

function typeTemplate(elementId, list) {
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

function genTemplate(elementId, list){
  const element = document.getElementById(elementId);
  let attributeText = '';
  for (let i = 0; i < list.length; i ++) {
    attributeText = list[i].toLowerCase();
    attributeText = attributeText.replace(/\s/g, '');
    element.insertAdjacentHTML('beforeend', `
      <div>
        <label for="${attributeText}">Gen ${list[i]}</label>
        <input id="${attributeText}" type="checkbox" checked>
      </div>
    `);
  }
}

// --- Gets All 1025 Pokemon Data (Old Functionality)
// const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0");
// const data = await response.json();
// const allPokemon = data.results;
// const allPokemon1025 = allPokemon.slice(0, 1025);
// Log results
// console.log(allPokemon1025);
// console.log(`Showing ${allPokemon1025.length} Pokémon`);

//test function
// const response2 = await fetch("https://pokeapi.co/api/v2/pokemon/197/");
// const data2 = await response2.json();
// console.log(data2);


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
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9'
];

typeTemplate('type-grid', types);
genTemplate('gen-grid', generations);
