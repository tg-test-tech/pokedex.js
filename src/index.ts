import { Pokemon } from "./pokemon";
import type { RawPokemonData, StatOperator, SortKey } from "./types";
import * as fs from "fs";
import * as path from "path";

/**
 * Returns list of Pokemon.
 *
 * @param {string} lang language
 * @return {Pokemon[]} array of pokemon
 */
const getAll = (lang: string): Pokemon[] => {
  const resourcePath = path.join(__dirname, "resources", "pokemon");
  const allPokemon: Pokemon[] = [];

  // Get all JSON files in the pokemon resources directory
  const files = fs
    .readdirSync(resourcePath)
    .filter((file) => file.endsWith(".json") && !file.endsWith("_name.json"));

  for (const file of files) {
    // Extract generation number from filename
    let genNumber: number;

    if (file.startsWith("gen")) {
      // Handle regular generation files (gen1.json, gen2.json, etc.)
      const match = file.match(/gen(\d+)/);
      genNumber = match !== null ? Number(match[1]) : 1;
    } else if (file.includes("LegendsArceus")) {
      // Handle Legends Arceus files
      genNumber = 8;
    } else if (file.startsWith("form_")) {
      // Handle form files (form_3.json, form_4.json, etc.)
      const match = file.match(/form_(\d+)/);
      genNumber = match !== null ? Number(match[1]) : 1;
    } else {
      // Skip any other files
      continue;
    }

    // Load the data and create Pokemon objects
    const filePath = path.join(resourcePath, file);
    const raw = fs.readFileSync(filePath, "utf8");
    const pokemonData = JSON.parse(raw) as RawPokemonData[];
    const pokemonList = pokemonData.map(
      (p: RawPokemonData) => new Pokemon(p, genNumber, lang)
    );
    allPokemon.push(...pokemonList);
  }

  return allPokemon;
};

/**
 * A class of a Pokédex.
 */
class Pokedex {
  lang: string;
  allPoke: Pokemon[];
  poke: Pokemon[];

  /**
   * Creates a new Pokédex instance of a given language
   *
   * @param {String} [lang=ja] language ('en' or 'ja', defaults to 'ja')
   */
  constructor(lang?: string) {
    if (lang === undefined) {
      this.lang = "ja";
    } else if (lang === "ja" || lang === "en") {
      this.lang = lang;
    } else {
      throw new Error(`Language '${lang}' is not supported.`);
    }

    this.allPoke = getAll(this.lang);
    this.poke = this.allPoke;
  }

  /**
   * Filters a list of Pokémon with ID
   *
   * @param {number|string} id ID of Pokémon
   * @return {Pokedex} this instance
   */
  id(id: number | string): this {
    this.poke = this.poke.filter((pokemon) => String(id) === pokemon.id);
    return this;
  }

  /**
   * Filters a list of Pokémon with name
   *
   * @param {string} name Name of Pokémon
   * @return {Pokedex} this instance
   */
  name(name: string): this {
    this.poke = this.poke.filter((pokemon) => name === pokemon.name);
    return this;
  }

  /**
   * Filters a list of Pokémon with type
   *
   * @param {string} type Type of Pokémon
   * @return {Pokedex} this instance
   */
  type(type: string): this {
    this.poke = this.poke.filter((pokemon) => pokemon.type.includes(type));
    return this;
  }

  /**
   * Filters a list of Pokémon with egg group
   *
   * @param {string} eggGroup Egg group of Pokémon
   * @return {Pokedex} this instance
   */
  eggGroup(eggGroup: string): this {
    this.poke = this.poke.filter((pokemon) =>
      pokemon.eggGroup.includes(eggGroup)
    );
    return this;
  }

  /**
   * Takes Pokémon whose base stat total matches to given operator and value
   *
   * @param {string} operator an operator to compare with 'value' (one of '>', '>=', '<', '<=', '=')
   * @param {number|string} value value to compare
   * @return {Pokedex} this instance
   */
  baseStatTotal(operator: StatOperator, value: number | string): this {
    const numValue = Number(value);

    switch (operator) {
      case ">":
        this.poke = this.poke.filter(
          (pokemon) => pokemon.baseStats.total > numValue
        );
        break;
      case ">=":
        this.poke = this.poke.filter(
          (pokemon) => pokemon.baseStats.total >= numValue
        );
        break;
      case "<":
        this.poke = this.poke.filter(
          (pokemon) => pokemon.baseStats.total < numValue
        );
        break;
      case "<=":
        this.poke = this.poke.filter(
          (pokemon) => pokemon.baseStats.total <= numValue
        );
        break;
      case "=":
        this.poke = this.poke.filter(
          (pokemon) => pokemon.baseStats.total === numValue
        );
        break;
      default:
        // This shouldn't happen due to the type, but keeping for runtime safety
        throw new Error(`Invalid operator (${String(operator)}).`);
    }
    return this;
  }

  /**
   * Takes Pokémon which can Mega Evolve (including Primal Reversion, Ultra Burst)
   * @return {Pokedex} this instance
   */
  canMegaEvolve(): this {
    this.poke = this.poke.filter(
      (pokemon) => pokemon.megaEvolution !== undefined
    );
    return this;
  }

  /**
   * Filters a list of Pokémon by a generation when the Pokémon was introduced
   *
   * @param {number|string} gen Generation
   * @return {Pokedex} this instance
   */
  generation(gen: number | string): this {
    this.poke = this.poke.filter(
      (pokemon) => String(pokemon.generation) === String(gen)
    );
    return this;
  }

  /**
   * Takes Pokémon which is listed in the Galar Pokédex
   *
   * @return {Pokedex} this instance
   */
  inGalarPokedex(): this {
    this.poke = this.poke.filter(
      (pokemon) => pokemon.localId?.galar !== undefined
    );

    this.poke.forEach((pokemon) => {
      delete pokemon.megaEvolution;
    });

    return this;
  }

  /**
   * Sorts Pokémon list according to a given sortKey
   *
   * @param {string} sortKey - one of "NationalNumber" or "Lexicographical"
   * @return {Pokedex} this instance
   */
  sort(sortKey: SortKey): this {
    switch (sortKey) {
      case "Lexicographical":
        this.poke.sort((a, b) => a.compareName(b));
        break;
      case "NationalNumber":
        this.poke.sort((a, b) => a.compareId(b));
        break;
      default:
        // This shouldn't happen due to the type, but keeping for runtime safety
        throw new Error(`Invalid sortKey (${String(sortKey)}).`);
    }
    return this;
  }

  /**
   * Returns a list of Pokémon.
   *
   * @return {Pokemon[]} result
   */
  getPokemon(): Pokemon[] {
    const ret = this.poke;
    this.poke = this.allPoke;
    return ret;
  }

  /**
   * Returns JSON String of a list of Pokémon.
   *
   * @return {string} result
   */
  getPokemonAsJson(): string {
    const ret = this.poke;
    this.poke = this.allPoke;
    return JSON.stringify(ret);
  }

  /**
   * Returns JSON String of a list of Pokémon.
   *
   * @return {string} result
   * @deprecated Use {@link getPokemon} or {@link getPokemonAsJson} instead.
   */
  get(): string {
    const ret = this.poke;
    this.poke = this.allPoke;
    return JSON.stringify(ret);
  }
}

export = Pokedex;
