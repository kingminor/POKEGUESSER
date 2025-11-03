import { Initalize } from "./global.js";
import {loadSelectedGenerations} from "./loader.js";

let selectedGens = [];
let selectedTypes = [];
let availablePokemon = [];

function parseURLParams() {
    // Get query params from the URL
    const params = new URLSearchParams(window.location.search);

    // Get types and generations as arrays
    selectedTypes = params.get('types') ? params.get('types').split(',') : [];
    selectedGens = params.get('gens') ? params.get('gens').split(',') : [];

    console.log('Selected Types from URL:', selectedTypes);
    console.log('Selected Generations from URL:', selectedGens);
}

function filterPokemonByTypes(pokemonList, selectedTypes){
    return pokemonList.filter(pokemon =>
        pokemon.type.some(t => selectedTypes.includes(t))
    );
}

//The code that gets run
Initalize(); // Initalize from global script
parseURLParams(); // Parse Param URLS
availablePokemon = await loadSelectedGenerations(selectedGens);
availablePokemon = filterPokemonByTypes(availablePokemon, selectedTypes)
console.log(availablePokemon);