import { GlobalInitialize } from "./global.js";
import { loadAllPokemonData } from "./loader.js";
GlobalInitialize();

const tableBody = document.querySelector("#tableBody");

let scoreStorageString = localStorage.getItem("scoreStorageObject");
if (scoreStorageString === null) {
    main.innerHTML = `<h1>No saved scores yet.</h1>`;
} else {
    let pokemonData = await loadAllPokemonData();
    let scoreStorageObject = JSON.parse(scoreStorageString);

    // Convert object entries into an array and sort by score descending
    const sortedEntries = Object.entries(scoreStorageObject).sort(
        ([, a], [, b]) => b.score - a.score
    );

    const html = sortedEntries.map(([id, item]) => {
        let currentPokemon = pokemonData[id - 1];
        return `
        <tr class="entry">
            <td><img class="tableImage" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${currentPokemon.pokedexNumber}.png"></td>
            <td>${currentPokemon.name}</td>
            <td>Dex#: ${id}</td>
            <td>Score: ${item.score}</td>
            <td>Time: ${item.time}</td>
            <td>Hints Used: ${item.hintsUsed}</td>
        </tr>
        `;
    }).join("");

    tableBody.innerHTML = html;
}
