/**
 * URL to fetch all Pokémon from the PokéAPI.
 * Using a high limit to retrieve all Pokémon at once.
 */
const urlList = 'https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0';

/**
 * Array to store all Pokémon fetched from the API.
 * This allows selecting a random Pokémon without refetching.
 */
let allPokemon = [];

/**
 * Fetch the full list of Pokémon from the given URL.
 * 
 * @param {string} url - The PokéAPI endpoint to fetch the Pokémon list.
 */
async function GetPokemonList(url) {
    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            allPokemon = data.results; // Store results in global array
            console.log(data);
            // Uncomment to populate the full list in the UI
            // doStuffList(data); 
            pickRandomPokemon(); // Automatically pick the first random Pokémon
        } else {
            console.error("Failed to fetch Pokémon list:", response.status);
        }
    } catch (error) {
        console.error("Error fetching Pokémon list:", error);
    }
}

/**
 * Populate a <ul> element with the list of Pokémon names.
 * 
 * @param {Object} data - JSON response containing the Pokémon list.
 */
function doStuffList(data) {
    const pokeListElement = document.querySelector("#outputList");
    const pokelist = data.results;
    pokelist.forEach(element => {
        const html = `<li>${element.name}</li>`;
        pokeListElement.innerHTML += html; // Append each Pokémon name
    });
}

/**
 * Pick a random Pokémon from the full list and fetch its details.
 */
function pickRandomPokemon() {
    if (allPokemon.length === 0) return;
    const randomIndex = Math.floor(Math.random() * allPokemon.length);
    const randomPokemon = allPokemon[randomIndex];
    getPokemon(randomPokemon.url); // Fetch full Pokémon data
}

/**
 * Fetch detailed data for a single Pokémon.
 * 
 * @param {string} url - The PokéAPI endpoint for the specific Pokémon.
 */
async function getPokemon(url) {
    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            doStuff(data); // Display the Pokémon in the UI
        } else {
            console.error("Failed to fetch Pokémon data:", response.status);
        }
    } catch (error) {
        console.error("Error fetching Pokémon data:", error);
    }
}

/**
 * Display the selected Pokémon in the UI.
 * Adds buttons for revealing the Pokémon, playing its cry, and picking another.
 * 
 * @param {Object} data - JSON object containing detailed Pokémon data.
 */
function doStuff(data) {
    const outputElement = document.querySelector("#output");

    // Initially hide the Pokémon image and name
    const html = `<h2 id="pokemonName" style="visibility:hidden;">${data.name}</h2>
                  <img id="pokemonImage" src="${data.sprites.other["official-artwork"].front_default}" alt="${data.name}" style="filter: brightness(0) invert(0);">`;
    outputElement.innerHTML = html;

    const img = document.querySelector("#pokemonImage");
    const nameElement = document.querySelector("#pokemonName");

    // Button to reveal Pokémon's name and image
    const revealButton = document.createElement("button");
    revealButton.textContent = "Reveal Pokémon";
    revealButton.style.display = "block";
    revealButton.style.marginTop = "10px";

    revealButton.addEventListener("click", () => {
        img.style.filter = "brightness(1) invert(0)"; // Reveal image
        nameElement.style.visibility = "visible";     // Reveal name
        revealButton.disabled = true;                 // Disable after click
    });

    // Button to play Pokémon's cry (if available)
    const cryButton = document.createElement("button");
    cryButton.textContent = "Play cry";
    cryButton.style.display = "block";
    cryButton.style.marginTop = "10px";

    cryButton.addEventListener("click", () => {
        if (data.cries && data.cries.latest) {
            const sound = new Audio(data.cries.latest);
            sound.play();
        } else {
            alert("Cry not available for this Pokémon!");
        }
    });

    // Button to pick another random Pokémon
    const randomButton = document.createElement("button");
    randomButton.id = "randomButton";
    randomButton.textContent = "Pick Another Pokémon";
    randomButton.style.display = "block";
    randomButton.style.marginTop = "10px";

    randomButton.addEventListener("click", pickRandomPokemon);

    // Append buttons in the desired order
    outputElement.appendChild(cryButton);
    outputElement.appendChild(revealButton);
    outputElement.appendChild(randomButton);
}

// Initialize the app by fetching the full Pokémon list
GetPokemonList(urlList);
