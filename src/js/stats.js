import { GlobalInitialize } from "./global.js";
import { loadAllPokemonData } from "./loader.js";
GlobalInitialize();

const main = document.querySelector("#main");

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
        <div class="entry">
            <h3>${currentPokemon.name}</h3>
            <p>Dex#: ${id}</p>
            <p>Score: ${item.score}</p>
            <p>Time: ${item.time}</p>
            <p>Hints Used: ${item.hintsUsed}</p>
        </div>
        `;
    }).join("");

    main.innerHTML = html;
}
