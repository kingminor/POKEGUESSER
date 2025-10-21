// Base URL for Pokémon images
const BASE_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/';

// Register the service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(reg => console.log('Service Worker registered!', reg))
    .catch(err => console.error('SW registration failed:', err));
}

// Load Pokémon image by Pokédex number
async function loadPokemon(pokedexNumber) {
  if (!pokedexNumber) return;

  const IMAGE_URL = `${BASE_URL}${pokedexNumber}.png`;

  try {
    const response = await fetch(IMAGE_URL);
    if (!response.ok) throw new Error('Pokémon not found');
    const blob = await response.blob();
    document.getElementById('pokemon-img').src = URL.createObjectURL(blob);
  } catch (err) {
    console.error(err);
    alert('Failed to load Pokémon. Make sure the number is valid.');
  }
}

// Handle button click
document.getElementById('load-btn').addEventListener('click', () => {
  const number = document.getElementById('pokedex-number').value.trim();
  loadPokemon(number);
});
