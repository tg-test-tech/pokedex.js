/**
 * Common interfaces and types for the Pokedex application
 */

/**
 * JSON‐loading interfaces for names and forms
 */
export interface NameData {
  id: string;
  name: {
    ja: string;
    en: string;
  };
}

export interface FormName {
  formId: string;
  ja: string;
  en: string;
}

export interface FormNameData {
  id: number;
  names: FormName[];
}

/**
 * Interface representing a Pokémon’s base statistics
 */
export interface PokemonStatus {
  H: string; // HP
  A: string; // Attack
  B: string; // Defense
  C: string; // Special Attack
  D: string; // Special Defense
  S: string; // Speed
}

/**
 * Interface representing a Pokémon’s ability
 */
export interface PokemonAbility {
  name: string;
  hidden: boolean;
  terastallised?: boolean;
}

/**
 * Interface representing a Pokémon’s raw ability data from JSON
 */
export interface RawAbility {
  name: string; // Name might start with "*" to indicate hidden ability
  terastallised?: boolean;
}

/**
 * Interface representing a Pokémon’s regional ID information
 */
export interface LocalId {
  galar?: string;
  paldea?: string;
}

/**
 * Interface representing a Mega Evolution of a Pokémon
 */
export interface MegaPokemonData {
  id: string;
  name: string;
  type: string[];
  abilities: RawAbility[];
  status: PokemonStatus;
  egg_groups: string[];
}

/**
 * Interface for an initialized Mega Pokémon
 */
export interface MegaPokemon {
  name: string;
  type: string[];
  ability: PokemonAbility[];
  baseStats: {
    H: string;
    A: string;
    B: string;
    C: string;
    D: string;
    S: string;
    total: number;
  };
}

/**
 * Interface representing raw Pokémon data from JSON
 */
export interface RawPokemonData {
  id: string;
  name: string;
  formId?: string;
  localId?: LocalId;
  type: string[];
  abilities: RawAbility[];
  status: PokemonStatus;
  egg_groups: string[];
  mega_evolve?: boolean;
}

/**
 * Type for the mega Pokémon mapping
 */
export interface MegaPokemonMap {
  [pokemonId: string]: MegaPokemonData[];
}

/**
 * Valid operators for base stat total comparison
 */
export type StatOperator = ">" | ">=" | "<" | "<=" | "=";

/**
 * Valid sort keys for Pokemon list
 */
export type SortKey = "Lexicographical" | "NationalNumber";