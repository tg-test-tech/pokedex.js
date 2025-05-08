const API_BASE_URL = "http://localhost:3000";

async function fetchFromAPI(endpoint, params = "") {
  const url = `${API_BASE_URL}${endpoint}${params ? "?" + params : ""}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(
      `API request failed for ${endpoint} with params ${params}:`,
      error
    );
    throw error;
  }
}

async function demonstrateAPI() {
  console.log("=== Pokemon API Examples ===\n");

  // 1. List all Pokemon with limit & offset
  console.log("1. Listing Pokemon with limit=5 & offset=10:");
  const listPokemon = await fetchFromAPI(
    "/api/pokemon",
    "lang=en&limit=5&offset=10"
  );
  console.log(`Total: ${listPokemon.total}, Retrieved: ${listPokemon.count}`);
  listPokemon.data.forEach((p) => console.log(`- #${p.id} ${p.name}`));
  console.log("\n");

  // 2. Get Pokemon by ID
  console.log("2. Getting Charizard (ID: 6):");
  const charizard = await fetchFromAPI("/api/pokemon/6", "lang=en");
  console.log(`Name: ${charizard.name}`);
  console.log(`Types: ${charizard.type.join(", ")}`);
  console.log(`Base Stats: ${JSON.stringify(charizard.baseStats, null, 2)}`);
  console.log("\n");

  // 3. Search by name
  console.log("3. Searching for Pokemon by name 'Mewtwo':");
  const searchByName = await fetchFromAPI(
    "/api/pokemon",
    "lang=en&name=Mewtwo"
  );
  console.log(`Found: ${searchByName.count}`);
  searchByName.data.forEach((p) => console.log(`- #${p.id} ${p.name}`));
  console.log("\n");

  // 4. Search by type & generation (e.g., Fire type, gen 1)
  console.log("4. Fire-type Pokemon from Generation 1:");
  const fireGen1 = await fetchFromAPI(
    "/api/pokemon",
    "lang=en&type=Fire&generation=1"
  );
  console.log(`Found: ${fireGen1.count}`);
  fireGen1.data.forEach((p) => console.log(`- #${p.id} ${p.name}`));
  console.log("\n");

  // 5. Search by egg group & canMegaEvolve
  console.log("5. Pokemon in 'Dragon' egg group that can Mega Evolve:");
  const dragonMega = await fetchFromAPI(
    "/api/pokemon",
    "lang=en&eggGroup=Dragon&canMegaEvolve=true"
  );
  console.log(`Found: ${dragonMega.count}`);
  dragonMega.data.forEach((p) => console.log(`- #${p.id} ${p.name}`));
  console.log("\n");

  // 6. Search by baseStatTotal, operator, sortBy, limit, offset
  console.log(
    "6. Pokemon with baseStatTotal >= 600, sorted by NationalNumber (limit 5):"
  );
  const strongPokemon = await fetchFromAPI(
    "/api/pokemon",
    "lang=en&baseStatTotal=600&operator=>=&sortBy=NationalNumber&limit=5&offset=0"
  );
  console.log(`Found: ${strongPokemon.count}`);
  strongPokemon.data.forEach((p) =>
    console.log(`- #${p.id} ${p.name}: ${JSON.stringify(p.baseStats, null, 2)}`)
  );
  console.log("\n");

  // 7. Search by inGalarPokedex
  console.log("7. Pokemon in Galar Pokédex:");
  const galar = await fetchFromAPI(
    "/api/pokemon",
    "lang=en&inGalarPokedex=true"
  );
  console.log(`Found: ${galar.count}`);
  galar.data.slice(0, 10).forEach((p) => {
    const displayName = p.formName ? `${p.formName} ${p.name}` : p.name;
    console.log(`- #${p.id} ${displayName}`);
  });
  console.log("\n");

  // 8. Get all types
  console.log("8. All Pokemon Types:");
  const types = await fetchFromAPI("/api/types", "lang=en");
  console.log(`Total types: ${types.count}`);
  console.log(types.data.join(", "));
  console.log("\n");

  // 9. Get all abilities
  console.log("9. All Pokemon Abilities:");
  const abilities = await fetchFromAPI("/api/abilities", "lang=en");
  console.log(`Total abilities: ${abilities.count}`);
  console.log(abilities.data.join(", "));
  console.log("\n");

  // 10. Get all egg groups
  console.log("10. All Pokemon Egg Groups:");
  const eggGroups = await fetchFromAPI("/api/egg-groups", "lang=en");
  console.log(`Total egg groups: ${eggGroups.count}`);
  console.log(eggGroups.data.join(", "));
  console.log("\n");

  // 11. Get all generations
  console.log("11. Available Generations:");
  const generations = await fetchFromAPI("/api/generations");
  console.log(`Total generations: ${generations.count}`);
  console.log(generations.data.join(", "));
}

if (require.main === module) {
  demonstrateAPI().catch(console.error);
}

module.exports = { fetchFromAPI, demonstrateAPI };
