const BASE_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/';
const BASE_CRY_URL = 'https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/';
const TOTAL_POKEMON = 1025;

// Register the service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(reg => console.log('Service Worker registered!', reg))
    .catch(err => console.error('SW registration failed:', err));
}

// Global variable to track currently playing cry
let currentCryAudio = null;

// Load Pokémon image and play cry by number
async function loadPokemon(pokedexNumber) {
  if (!pokedexNumber) return;

  const IMAGE_URL = `${BASE_URL}${pokedexNumber}.png`;
  const CRY_URL = `${BASE_CRY_URL}${pokedexNumber}.ogg`;

  try {
    const imageResponse = await fetch(IMAGE_URL);
    const imageBlob = await imageResponse.blob();
    document.getElementById('pokemon-img').src = URL.createObjectURL(imageBlob);

    const cryResponse = await fetch(CRY_URL);
    const cryBlob = await cryResponse.blob();
    const audioURL = URL.createObjectURL(cryBlob);

    if (currentCryAudio) {
      currentCryAudio.pause();
      currentCryAudio.currentTime = 0;
    }

    currentCryAudio = new Audio(audioURL);
    currentCryAudio.play().catch(err => console.warn('Could not play cry:', err));

  } catch (err) {
    console.error(err);
    alert('Failed to load Pokémon. Make sure the number is valid.');
  }
}


// Cache all Pokémon images and cries
async function cacheAllPokemon() {
  if (!('caches' in window)) return alert('Caching not supported');

  const cache = await caches.open('pokemon-cache-v1.1');
  const progressBar = document.getElementById('progress-bar');
  const etaDisplay = document.getElementById('eta');

  etaDisplay.style.display = 'inline';
  progressBar.value = 0;

  await new Promise(requestAnimationFrame);

  let totalFetchTime = 0;
  const startTime = Date.now();

  for (let i = 1; i <= TOTAL_POKEMON; i++) {
    const imageUrl = `${BASE_URL}${i}.png`;
    const cryUrl = `${BASE_CRY_URL}${i}.ogg`;

    try {
      const fetchStart = Date.now();

      // Fetch image
      const imageResponse = await fetch(imageUrl);
      if (imageResponse.ok) await cache.put(imageUrl, imageResponse.clone());

      // Fetch cry
      const cryResponse = await fetch(cryUrl);
      if (cryResponse.ok) await cache.put(cryUrl, cryResponse.clone());

      const fetchTime = (Date.now() - fetchStart) / 1000; // seconds
      totalFetchTime += fetchTime;

      // ETA calculation
      const avgTimePerPokemon = totalFetchTime / i;
      const pokemonLeft = TOTAL_POKEMON - i;
      const eta = (avgTimePerPokemon * pokemonLeft).toFixed(1);

      // Update progress bar and ETA
      progressBar.value = i;
      etaDisplay.textContent = `ETA: ${eta} sec`;

      console.log(`Cached Pokémon #${i} (image + cry) | ETA: ${eta} sec remaining`);
    } catch (err) {
      console.warn(`Failed to cache Pokémon #${i}:`, err);
    }
  }

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
  progressBar.value = TOTAL_POKEMON;
  etaDisplay.style.display = 'none';

  console.log(`All Pokémon images and cries cached in ${totalTime} seconds!`);
  alert('All Pokémon images and cries are cached!');
}

// Event listeners
const inputField = document.getElementById('pokedex-number');

document.getElementById('load-btn').addEventListener('click', () => {
  const number = inputField.value.trim();
  loadPokemon(number);
});

document.getElementById('cache-all-btn').addEventListener('click', cacheAllPokemon);

inputField.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    const number = inputField.value.trim();
    loadPokemon(number);
  }
});
