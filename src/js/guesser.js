import { GlobalInitialize } from "./global.js";
import {weightToKilograms, heightToMeters, formatTime} from "./converts-and-formaters.js";
import {loadSelectedGenerations} from "./loader.js";

const pokemonSilhouette = document.querySelector("#silhouette");
const input = document.querySelector("#pokemon-input");
const datalist = document.querySelector("#pokemon-list");
const form = document.querySelector("#guess-form");
const loadingDialog = document.querySelector("#loading-dialog");
const loadingBar = document.querySelector("#loading-bar");
const startButton = document.querySelector("#start-button");
const congratsDialog = document.querySelector("#congrats-dialog");
const hintButton = document.querySelector("#reveal");
const loadingImage = document.querySelector("#loading-image");
let hintsUsed = 0;
let pokemonImage;

let selectedGens = [];
let selectedTypes = [];
let availablePokemon = [];

//Sets random image
const randomImageId = Math.floor(Math.random() * 7);
switch (randomImageId) {
    case 0:
        loadingImage.src = "./media/nyan-pikachu.gif";
        break;
    case 1:
        loadingImage.src = "./media/pikachu-escape.gif";
        break;
    case 2:
        loadingImage.src = "./media/pikachu-ketchup.gif";
        break;
    case 3:
        loadingImage.src = "./media/run-charmander-run.gif";
        break;
    case 4:
        loadingImage.src = "./media/umbreon-sleep.gif";
        break;
    case 5:
        loadingImage.src = "./media/umbreon-y.gif";
        break;
    case 6:
        loadingImage.src = "./media/umbreon.gif";
}

function parseURLParams() {
    // Get query params from the URL
    const params = new URLSearchParams(window.location.search);

    // Get types and generations as arrays
    selectedTypes = params.get('types') ? params.get('types').split(',').map(t => t.trim()) : [];
    selectedGens = params.get('gens') ? params.get('gens').split(',').map(g => g.trim()) : [];

    console.log('Selected Types from URL:', selectedTypes);
    console.log('Selected Generations from URL:', selectedGens);

    if(!selectedTypes.length || !selectedGens.length) {
        console.log("Invalid URL Parameters, returning to home page!");
        window.location.href = "index.html"
    }
}

function filterPokemonByTypes(pokemonList, selectedTypes){
    return pokemonList.filter(pokemon =>
        pokemon.type.some(t => selectedTypes.includes(t))
    );
}

//The code that gets run
input.focus();
GlobalInitialize(); // Initalize from global script
loadingDialog.show();
loadingDialog.style.display = "flex";
parseURLParams(); // Parse Param URLS
loadingBar.value = 10;
availablePokemon = await loadSelectedGenerations(selectedGens); //Loads pokemon based on selected Generations
availablePokemon = filterPokemonByTypes(availablePokemon, selectedTypes); // Filters By type
loadingBar.value = 20;
console.log(availablePokemon);
if(availablePokemon.length === 0) {
    throw new Error("Pokemon List is Empty, Check URL Params!")
}
let selectedPokemon = availablePokemon[Math.floor(Math.random() * availablePokemon.length)] // Selects random pokemon

loadingBar.value = 33;
function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

let response = await fetch(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${selectedPokemon.pokedexNumber}.png`);
loadingBar.value = 45;
let blob = await response.blob();
loadingBar.value = 56;
pokemonImage = await blobToBase64(blob);

pokemonSilhouette.src = pokemonImage;
loadingBar.value = 75;


// TIMER FUNCTIONS
let startTime = 0;
let elapsedTime = 0;
let timerInterval;

function startTimer() {
  startTime = Date.now() - elapsedTime;
  timerInterval = setInterval(() => {
    elapsedTime = Date.now() - startTime;
  }, 10);
}

function stopTimer() {
  clearInterval(timerInterval);
}

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

function calculateScore(timeElapsed, hintsUsed) {
    // Hints normalization (0 best, 1 worst)
    const hintsNorm = hintsUsed / 6;

    // Time decay factor
    // decayRate tuned for ~5 seconds average
    const decayRate = 0.00005; // roughly gives ~50% score drop at 5s (500 centiseconds)
    const timeFactor = Math.exp(-decayRate * timeElapsed);

    // Weighted combination
    const weightTime = 0.7;
    const weightHints = 0.3;
    const combined = weightTime * timeFactor + weightHints * (1 - hintsNorm);

    // Scale to 0-10000
    const score = Math.round(combined * 100000);
    return score;

}  

form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (loadingDialog.style.display == 'flex') {
        return;
    }

    console.log(e);

    const guess = e.target[0].value.trim().toLowerCase();

    if (guess === selectedPokemon.name.toLowerCase()){
        stopTimer();
        let time = formatTime(elapsedTime);
        let score = calculateScore(elapsedTime, hintsUsed);
        congratsDialog.innerHTML = `
            <div>
                <h2>You Got It!</h2>
                <h3>It Was ${selectedPokemon.name}</h3>
                <p>Time: ${time.seconds}.${time.centiseconds} Seconds</p>
                <p>Hints Used: ${hintsUsed}</p>
                <p>Score: ${score}</p>
                <img src="${pokemonImage}">
                <button id="play-again">Play Again</button>
                <button id="closeCongrats">Close</button>
            </div>`;

            congratsDialog.show();
            congratsDialog.style.display = 'flex';

            let scoreStorageString = localStorage.getItem("scoreStorageObject");
            if (!scoreStorageString) {
                // If nothing stored yet, create an empty one
                localStorage.setItem("scoreStorageObject", JSON.stringify({}));
                scoreStorageString = "{}";
            }
            let scoreStorageObject = JSON.parse(scoreStorageString);

            if(scoreStorageObject.hasOwnProperty(`${selectedPokemon.pokedexNumber}`)){
                if (scoreStorageObject[selectedPokemon.pokedexNumber].score < score) {
                    scoreStorageObject[selectedPokemon.pokedexNumber] = formatRun();
                }
            }
            else{
                scoreStorageObject[selectedPokemon.pokedexNumber] = formatRun();
            }

            localStorage.setItem("scoreStorageObject", JSON.stringify(scoreStorageObject));


            function formatRun(){
                return {
                    score: score,
                    time: elapsedTime,
                    hintsUsed: hintsUsed
                }
            }

            const restartGame = () => {

                congratsDialog.style.display = 'none';
                window.location.reload();
            };

            congratsDialog.querySelector("#play-again").addEventListener("click", restartGame);

            congratsDialog.addEventListener("keydown", (e) => {
                if(e.key === "Enter"){
                    restartGame();
                }
            });

            document.querySelector("#closeCongrats").addEventListener("click", (e) => {
                congratsDialog.style.display = "none";
                window.location.href = "index.html";
            });
    }
    else {
        // Remove classes to allow re-triggering
        input.classList.remove("input-wiggle", "input-error");
        void input.offsetWidth; // force reflow
        
        // Add error classes
        input.classList.add("input-wiggle", "input-error");

        // Optional: remove red after a second
        setTimeout(() => {
            input.classList.remove("input-error");
        }, 800);

        return;
    }
});

loadingBar.value = 85;

hintButton.addEventListener('click', (e) => {
    switch (hintsUsed) {
        case 0:
            hintButton.insertAdjacentHTML("beforebegin", `<p>This pokemon is primarily ${selectedPokemon.color}.</p>`);
            break;
        case 1:
            if(selectedPokemon.type.length === 1){
                hintButton.insertAdjacentHTML("beforebegin", `<p>This pokemon is a ${selectedPokemon.type[0]} type.</p>`)
            }
            else {
                hintButton.insertAdjacentHTML("beforebegin", `<p>This pokemon is a ${selectedPokemon.type[0]} and ${selectedPokemon.type[1]} type.</p>`)
            }
            break;
        case 2:
            hintButton.insertAdjacentHTML("beforebegin", `<p>This pokemon is from ${selectedPokemon.generation.replace("-", " ")}</p>`);
            break;
        case 3:
            let heightInMeters = heightToMeters(selectedPokemon.height);
            let weightInKilograms = weightToKilograms(selectedPokemon.weight);
            hintButton.insertAdjacentHTML("beforebegin", `<p>This pokemon is ${weightInKilograms}KG and ${heightInMeters} meters tall.</p>`);
            break;
        case 4:
            hintButton.insertAdjacentHTML("beforebegin", `<p>This pokemon is #${selectedPokemon.pokedexNumber} in the National Dex</p>`);
            break;
        case 5:
            hintButton.insertAdjacentHTML("beforebegin", `<p>One Pokedex Entry Says: ${selectedPokemon.flavorText}</p>`);
            hintButton.classList.add("hide");
            break;
        default:
            alert("No more hints to show!");
            break;
    }

    hintsUsed++;
});

loadingBar.value = 95;

function closeLoading() {
    loadingDialog.style.display = 'none';
    input.focus();
    startTimer();
}

startButton.addEventListener('click', (e) => {
    closeLoading();
})

document.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && loadingDialog.style.display == 'flex') {
        e.preventDefault();
        closeLoading();
    }
});


loadingBar.value = 100;
startButton.classList.remove("hide");
startButton.classList.add("grow-shrink");