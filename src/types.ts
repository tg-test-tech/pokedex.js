/**
 * Common types and types for the Pokedex application
 */

/**
 * JSON‐loading types for names and forms
 */
export type NameData = {
  id: string;
  name: {
    ja: string;
    en: string;
  };
};

export type FormName = {
  formId: string;
  ja: string;
  en: string;
};

export type FormNameData = {
  id: number;
  names: FormName[];
};

/**
 * type representing a Pokémon’s base statistics
 */
export type PokemonStatus = {
  H: string; // HP
  A: string; // Attack
  B: string; // Defense
  C: string; // Special Attack
  D: string; // Special Defense
  S: string; // Speed
};

/**
 * type representing a Pokémon’s ability
 */
export type PokemonAbility = {
  name: string;
  hidden: boolean;
  terastallised?: boolean;
};

/**
 * type representing a Pokémon’s raw ability data from JSON
 */
export type RawAbility = {
  name: string; // Name might start with "*" to indicate hidden ability
  terastallised?: boolean;
};

/**
 * type representing a Pokémon’s regional ID information
 */
export type LocalId = {
  galar?: string;
  paldea?: string;
};

/**
 * type representing a Mega Evolution of a Pokémon
 */
export type MegaPokemonData = {
  id: string;
  name: string;
  type: string[];
  abilities: RawAbility[];
  status: PokemonStatus;
  egg_groups: string[];
};

/**
 * type for an initialized Mega Pokémon
 */
export type MegaPokemon = {
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
};

/**
 * type representing raw Pokémon data from JSON
 */
export type RawPokemonData = {
  id: string;
  name: string;
  formId?: string;
  localId?: LocalId;
  type: string[];
  abilities: RawAbility[];
  status: PokemonStatus;
  egg_groups: string[];
  mega_evolve?: boolean;
};

/**
 * Type for the mega Pokémon mapping
 */
export type MegaPokemonMap = Record<string, MegaPokemonData[]>;

/**
 * Valid operators for base stat total comparison
 */
export type StatOperator = ">" | ">=" | "<" | "<=" | "=";

/**
 * Valid sort keys for Pokemon list
 */
export type SortKey = "Lexicographical" | "NationalNumber";
