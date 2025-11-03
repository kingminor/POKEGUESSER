import { GlobalInitialize } from "./global.js";
import {loadSelectedGenerations} from "./loader.js";

const pokemonSilhouette = document.querySelector("#silhouette");
const input = document.querySelector("#pokemon-input");
const datalist = document.querySelector("#pokemon-list");

let selectedGens = [];
let selectedTypes = [];
let availablePokemon = [];

function parseURLParams() {
    // Get query params from the URL
    const params = new URLSearchParams(window.location.search);

    // Get types and generations as arrays
    selectedTypes = params.get('types') ? params.get('types').split(',').map(t => t.trim()) : [];
    selectedGens = params.get('gens') ? params.get('gens').split(',').map(g => g.trim()) : [];

    console.log('Selected Types from URL:', selectedTypes);
    console.log('Selected Generations from URL:', selectedGens);
}

function filterPokemonByTypes(pokemonList, selectedTypes){
    return pokemonList.filter(pokemon =>
        pokemon.type.some(t => selectedTypes.includes(t))
    );
}

//The code that gets run
GlobalInitialize(); // Initalize from global script
parseURLParams(); // Parse Param URLS
availablePokemon = await loadSelectedGenerations(selectedGens); //Loads pokemon based on selected Generations
availablePokemon = filterPokemonByTypes(availablePokemon, selectedTypes) // Filters By type
console.log(availablePokemon);
if(availablePokemon.length === 0) {
    throw new Error("Pokemon List is Empty, Check URL Params!")
}
let selectedPokemon = availablePokemon[Math.floor(Math.random() * availablePokemon.length)] // Selects random pokemon
pokemonSilhouette.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${selectedPokemon.pokedexNumber}.png`;
input.addEventListener("input", () => {
    const value = input.value.toLowerCase();

    // Check if the input exactly matches any Pokémon name
    const exactMatch = availablePokemon.some(pokemon => pokemon.name.toLowerCase() === value);

    // If there's an exact match, clear the datalist so suggestions disappear
    if (exactMatch) {
        datalist.innerHTML = "";
        return;
    }

    // Filter by Pokémon name
    const filtered = availablePokemon.filter(pokemon =>
        pokemon.name.toLowerCase().includes(value)
    );

    datalist.innerHTML = "";

    // Add only the names to the datalist
    filtered.slice(0, 20).forEach(pokemon => {
        const option = document.createElement("option");
        option.value = pokemon.name; // use name property
        datalist.appendChild(option);
    });
});
