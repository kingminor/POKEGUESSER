// --- GETS ALL POKEMON, USE loadSelectedGenerations() Instead;
// export async function loadAllPokemonData() {
//     try{
//         let response = await fetch("./data/allpokemon.json");
//         if (!response.ok) {
//             throw new Error(`HTTP error! Status: ${response.status}`);
//         }
//         return await response.json();
//     }
//     catch (error) {
//         console.error("Failed to load Pokémon data:", error);
//         return null;
//     }
// }

export async function loadSelectedGenerations(selectedGens) {
    const fetchPromises = selectedGens.map(async (gen) => {
        try {
            const response = await fetch(`./data/gen${gen}.json`);
            if (!response.ok) throw new Error(`Failed to fetch gen${gen}.json: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error(error);
            return []; // return empty array if fetch fails
        }
    });

    const gensData = await Promise.all(fetchPromises);

    // Combine into single array
    const combinedData = gensData.flat();

    // Sort by pokedexNumber
    combinedData.sort((a, b) => a.pokedexNumber - b.pokedexNumber);

    return combinedData;
}
