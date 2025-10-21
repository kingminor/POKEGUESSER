const BASE_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/';
const TOTAL_POKEMON = 1025;

// Register the service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(reg => console.log('Service Worker registered!', reg))
    .catch(err => console.error('SW registration failed:', err));
}

// Load Pokémon image by number
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

// Cache all Pokémon images
async function cacheAllPokemon() {
  if (!('caches' in window)) return alert('Caching not supported');

  const cache = await caches.open('pokemon-cache-v1.1');
  const progressBar = document.getElementById('progress-bar');
  const etaDisplay = document.getElementById('eta');

  // Show ETA when caching starts
  etaDisplay.style.display = 'inline';
  progressBar.value = 0;

  // Force browser to repaint the ETA span
  await new Promise(requestAnimationFrame);

  let totalFetchTime = 0; // sum of fetch times
  const startTime = Date.now();

  for (let i = 1; i <= TOTAL_POKEMON; i++) {
    const url = `${BASE_URL}${i}.png`;

    try {
      const fetchStart = Date.now();
      const response = await fetch(url);
      if (response.ok) {
        await cache.put(url, response.clone());
      } else {
        console.warn(`Failed to fetch Pokémon #${i}: Status ${response.status}`);
      }
      const fetchTime = (Date.now() - fetchStart) / 1000; // seconds
      totalFetchTime += fetchTime;

      // Calculate ETA using average fetch time
      const avgTimePerImage = totalFetchTime / i;
      const imagesLeft = TOTAL_POKEMON - i;
      const eta = (avgTimePerImage * imagesLeft).toFixed(1);

      // Update progress bar and ETA display
      progressBar.value = i;
      etaDisplay.textContent = `ETA: ${eta} sec`;

      console.log(`Cached Pokémon #${i} | ETA: ${eta} sec remaining`);
    } catch (err) {
      console.warn(`Failed to cache Pokémon #${i}:`, err);
    }
  }

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
  progressBar.value = TOTAL_POKEMON;

  // Hide ETA after caching completes
  etaDisplay.style.display = 'none';

  console.log(`All Pokémon images cached in ${totalTime} seconds!`);
  alert('All Pokémon images are cached!');
}


// Event listeners
const inputField = document.getElementById('pokedex-number');

document.getElementById('load-btn').addEventListener('click', () => {
  const number = inputField.value.trim();
  loadPokemon(number);
});

document.getElementById('cache-all-btn').addEventListener('click', cacheAllPokemon);

// Load Pokémon when pressing Enter in the input field
inputField.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    const number = inputField.value.trim();
    loadPokemon(number);
  }
});
