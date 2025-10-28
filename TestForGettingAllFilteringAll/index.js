async function getPokemonData() {
  let response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0");
  let json = await response.json();
  let pokemonList = json.results;
  console.log(pokemonList);
  const allPokemon = await fetchAllPokemonDetails(pokemonList);
  console.log(allPokemon);
}
getPokemonData();

async function fetchAllPokemonDetails(pokemonList) {
  const results = await Promise.all(
    pokemonList.map(async (p) => {
      // From main endpoint
      const mainResponse = await fetch(p.url);
      const mainData = await mainResponse.json();

      // From Species Endpoint
      const speciesResponse = await fetch(mainData.species.url);
      const speciesData = await speciesResponse.json();

      // From Evolution Chain Endpoint
      const evolutionChainResponse = await fetch(speciesData.evolution_chain.url);
      const evolutionChainData = await evolutionChainResponse.json();

      // Parse evolution properly
      const { evolvesFrom, evolvesTo, evolutionTrigger } = parseEvolution(
        evolutionChainData.chain,
        mainData.name
      );

      return {
        baseUrl: p.url,
        speciesUrl: mainData.species.url,
        evolutionChainUrl: speciesData.evolution_chain.url,
        pokedexNumber: mainData.id,
        name: mainData.name,
        species: speciesData.genera?.find((g) => g.language.name === "en")?.genus || "Unknown",
        generation: speciesData.generation?.name || "Unknown",
        color: speciesData.color.name,
        type: mainData.types.map((item) => item.type.name),
        baseStats: {
          hp: mainData.stats[0].base_stat,
          attack: mainData.stats[1].base_stat,
          defense: mainData.stats[2].base_stat,
          specialAttack: mainData.stats[3].base_stat,
          specialDefense: mainData.stats[4].base_stat,
          speed: mainData.stats[5].base_stat,
        },
        abilities: {
          normal: mainData.abilities
            .filter((a) => !a.is_hidden)
            .map((a) => ({ name: a.ability.name, url: a.ability.url })),
          hidden: mainData.abilities
            .filter((a) => a.is_hidden)
            .map((a) => ({ name: a.ability.name, url: a.ability.url })),
        },
        height: mainData.height,
        weight: mainData.weight,
        primaryHabitat: speciesData.habitat?.name || "Unknown",
        shape: speciesData.shape?.name || "Unknown",
        captureRate: speciesData.capture_rate,
        baseExperience: mainData.base_experience,
        baseHappiness: speciesData.base_happiness,
        growthRate: speciesData.growth_rate?.name || "Unknown",
        eggGroups: speciesData.egg_groups?.map((g) => g.name) || [],
        evolvesFrom,
        evolvesTo: evolvesTo.length ? evolvesTo : ["None"],
        evolutionTrigger,
        isFinalEvolution: evolvesTo.length === 0,
        isLegendary: speciesData.is_legendary,
        isMythical: speciesData.is_mythical,
        isBaby: speciesData.is_baby,
        hatchCounter: speciesData.hatch_counter,
        forms: mainData.forms,
        flavorText:
          speciesData.flavor_text_entries.find((f) => f.language.name === "en")?.flavor_text.replace(/\n|\f/g, "") ||
          "",
      };
    })
  );
  return results;
}

function parseEvolution(chain, currentName) {
  let evolvesFrom = null;
  let evolvesTo = [];
  let evolutionTrigger = "None";

  function traverse(node, parent = null) {
    if (node.species.name === currentName) {
      // Record parent
      if (parent) {
        evolvesFrom = {
          name: parent.species.name,
          url: parent.species.url,
        };

        // How current Pokémon evolved
        const evoDetails = node.evolution_details?.[0] || {};
        evolutionTrigger = getEvolutionMethod(evoDetails);
      }

      // Next evolutions
      evolvesTo = node.evolves_to.map((e) => e.species.name);
    }

    node.evolves_to.forEach((child) => traverse(child, node));
  }

  traverse(chain);

  return { evolvesFrom, evolvesTo, evolutionTrigger };
}

function getEvolutionMethod(evoData) {
  const {
    min_level,
    min_happiness,
    min_affection,
    min_beauty,
    item,
    held_item,
    known_move,
    trade_species,
    time_of_day,
    trigger,
  } = evoData;

  if (!trigger) return "Unknown";

  let method = "";

  switch (trigger.name) {
    case "level-up":
      if (min_level) method = `Level ${min_level}`;
      else if (min_happiness) method = "Friendship";
      else if (min_affection) method = "High Affection";
      else if (min_beauty) method = "High Beauty";
      else method = "Level Up";
      break;

    case "trade":
      if (held_item) method = `Trade while holding ${held_item.name}`;
      else if (trade_species) method = `Trade for ${trade_species.name}`;
      else method = "Trade";
      break;

    case "use-item":
      if (item) method = `Use ${item.name}`;
      else method = "Use Evolution Item";
      break;

    case "shed":
      method = "When Nincada evolves (special case)";
      break;

    case "spin":
      method = "Spin around (special case)";
      break;

    case "tower-of-darkness":
      method = "Train at the Tower of Darkness";
      break;

    case "tower-of-waters":
      method = "Train at the Tower of Waters";
      break;

    default:
      method = trigger.name.replace("-", " ");
  }

  if (time_of_day) {
    const timeLabel =
      time_of_day === "day" ? "(day)" : time_of_day === "night" ? "(night)" : `(${time_of_day})`;
    method += ` ${timeLabel}`;
  }

  return method.trim();
}
