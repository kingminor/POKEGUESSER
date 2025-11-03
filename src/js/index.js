import { GlobalInitialize } from "./global.js";

GlobalInitialize();

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
  console.log("Loaded Types");
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
  console.log("Loaded Generations");
}

function getSelectedOptions(containerId) {
  const container = document.getElementById(containerId);
  const checkedInputs = container.querySelectorAll('input[type="checkbox"]:checked');
  return Array.from(checkedInputs).map(input => input.id);
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

document.querySelector("#game-settings").addEventListener('submit', (event) => {
  event.preventDefault();

  const selectedTypes = getSelectedOptions('type-grid');
  const selectedGens = getSelectedOptions('gen-grid');

  console.log('Selected Types:', selectedTypes);
  console.log('Selected Generations:', selectedGens);

  // 1. Alert if either field has nothing selected
  if (selectedTypes.length === 0 || selectedGens.length === 0) {
    alert("Please select at least one Type and one Generation before continuing.");
    return; // stop form submission
  }

  // 2. Alert if ONLY Dark type is selected and no gen after 1 is selected
  const onlyDarkSelected = selectedTypes.length === 1 && selectedTypes.includes('dark');
  const hasGenAfter1 = selectedGens.some(gen => parseInt(gen, 10) > 1);

  if (onlyDarkSelected && !hasGenAfter1) {
    alert("If you select only the Dark type, please include at least one Generation after 1.");
    return; // stop form submission
  }

  const params = new URLSearchParams();
  if (selectedTypes.length) params.set('types', selectedTypes.join(','));
  if (selectedGens.length) params.set('gens', selectedGens.join(','));

  const url = `guesser.html?${params.toString()}`;
  window.location.href = url;

})