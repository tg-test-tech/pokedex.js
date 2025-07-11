/* eslint no-unused-expressions: 0 */

import { expect } from "chai";
import Pokedex from "../src/index";
import { Validator, ValidatorResult, Schema } from "jsonschema";
import schema from "../src/resources/schema.json";
import {
  LocalId,
  PokemonAbility,
  PokemonStatus,
  MegaPokemon,
} from "../src/types";

const v = new Validator();
type Pokemon = {
  id: string;
  localId?: LocalId;
  name: string;
  formName?: string;
  type: string[];
  ability: PokemonAbility[];
  eggGroup: string[];
  baseStats: PokemonStatus & { total: number };
  generation?: number;
  megaEvolution?: MegaPokemon[];
};

const isValidPokemon = (value: unknown): value is Pokemon => {
  const validateResult: ValidatorResult = v.validate(value, schema as Schema);
  if (validateResult.errors.length === 0) {
    return true;
  } else {
    console.log(validateResult);
    return false;
  }
};

const bst = (pokemon: Pokemon): number => {
  return (
    Number(pokemon.baseStats.H) +
    Number(pokemon.baseStats.A) +
    Number(pokemon.baseStats.B) +
    Number(pokemon.baseStats.C) +
    Number(pokemon.baseStats.D) +
    Number(pokemon.baseStats.S)
  );
};

describe("Pokedex class", () => {
  describe("language: foo)", () => {
    it("throws Error", () => {
      expect(() => new Pokedex("foo")).to.throw(
        Error,
        "Language 'foo' is not supported."
      );
    });
  });

  describe("language ja)", () => {
    const pokedex = new Pokedex();

    it("returns expected Pokemon (id: 25)", () => {
      const actual = pokedex.id(25).getPokemonAsJson();
      const expected =
        '[{"id":"25","localId":{"galar":"194","paldea":"74"},"name":"ピカチュウ","type":["でんき"],"ability":[{"name":"せいでんき","hidden":false},{"name":"ひらいしん","hidden":true}],"eggGroup":["陸上","妖精"],"baseStats":{"H":"35","A":"55","B":"40","C":"50","D":"50","S":"90"},"generation":1}]';

      expect(actual).to.deep.equal(expected);
    });

    it("returns expected Pokemon (name: ピカチュウ)", () => {
      const actual = pokedex.name("ピカチュウ").getPokemonAsJson();
      const expected =
        '[{"id":"25","localId":{"galar":"194","paldea":"74"},"name":"ピカチュウ","type":["でんき"],"ability":[{"name":"せいでんき","hidden":false},{"name":"ひらいしん","hidden":true}],"eggGroup":["陸上","妖精"],"baseStats":{"H":"35","A":"55","B":"40","C":"50","D":"50","S":"90"},"generation":1}]';
      expect(actual).to.deep.equal(expected);
    });

    it("returns expected Pokemon Array (filter by type: でんき, generation: 1)", () => {
      const actual = pokedex.generation(1).type("でんき").getPokemonAsJson();
      const isExpected = (pokemon: Pokemon) =>
        isValidPokemon(pokemon) &&
        pokemon.type.includes("でんき") &&
        pokemon.generation === 1;

      expect(JSON.parse(actual).every(isExpected)).to.be.true;
    });

    it("can return Pokemon with expected base stat", () => {
      const bstIn200and210Closed: Pokemon[] = JSON.parse(
        pokedex
          .baseStatTotal(">=", 200)
          .baseStatTotal("<=", "210")
          .getPokemonAsJson()
      );
      const isExpected = (pokemon: Pokemon) =>
        isValidPokemon(pokemon) && bst(pokemon) >= 200 && bst(pokemon) <= 210;
      expect(bstIn200and210Closed.every(isExpected)).to.be.true;

      const bstIn200and210: Pokemon[] = JSON.parse(
        pokedex
          .baseStatTotal(">", "200")
          .baseStatTotal("<", 210)
          .getPokemonAsJson()
      );
      const isExpected2 = (pokemon: Pokemon) =>
        isValidPokemon(pokemon) && bst(pokemon) >= 200 && bst(pokemon) <= 210;
      expect(bstIn200and210.every(isExpected2)).to.be.true;

      const bst200: Pokemon[] = JSON.parse(
        pokedex.baseStatTotal("=", 200).getPokemonAsJson()
      );
      const isExpected3 = (pokemon: Pokemon) =>
        isValidPokemon(pokemon) && bst(pokemon) === 200;
      expect(bst200.every(isExpected3)).to.be.true;

      const bst210: Pokemon[] = JSON.parse(
        pokedex.baseStatTotal("=", "210").getPokemonAsJson()
      );
      const isExpected4 = (pokemon: Pokemon) =>
        isValidPokemon(pokemon) && bst(pokemon) === 210;
      expect(bst210.every(isExpected4)).to.be.true;

      expect(bst200.length + bstIn200and210.length + bst210.length).to.equal(
        bstIn200and210Closed.length
      );
    });

    it("returns Galar region new Pokemon", () => {
      const actual = pokedex.generation(8).getPokemonAsJson();
      const isExpected = (pokemon: Pokemon) =>
        isValidPokemon(pokemon) && pokemon.generation === 8;

      expect(JSON.parse(actual).every(isExpected)).to.be.true;
    });

    it("sorts lexicographically", () => {
      const actual: Pokemon[] = JSON.parse(
        pokedex
          .type("はがね")
          .type("フェアリー")
          .sort("Lexicographical")
          .getPokemonAsJson()
      );
      expect(actual.every((pokemon: Pokemon) => isValidPokemon(pokemon))).to.be
        .true;

      expect(actual).to.have.length(7);
      expect(actual[0].name).to.equal("カヌチャン");
      expect(actual[1].name).to.equal("クチート");
      expect(actual[2].name).to.equal("クレッフィ");
      expect(actual[3].name).to.equal("ザシアン");
      expect(actual[3].formName).to.equal("けんのおう");
      expect(actual[4].name).to.equal("デカヌチャン");
      expect(actual[5].name).to.equal("ナカヌチャン");
      expect(actual[6].name).to.equal("マギアナ");
    });

    it("sorts by national number", () => {
      const actual: Pokemon[] = JSON.parse(
        pokedex
          .type("はがね")
          .type("フェアリー")
          .sort("NationalNumber")
          .getPokemonAsJson()
      );
      expect(actual.every((pokemon: Pokemon) => isValidPokemon(pokemon))).to.be
        .true;

      expect(actual).to.have.length(7);
      expect(actual[0].id).to.equal("303");
      expect(actual[1].id).to.equal("707");
      expect(actual[2].id).to.equal("801");
      expect(actual[3].id).to.equal("888");
      expect(actual[4].id).to.equal("957");
      expect(actual[5].id).to.equal("958");
      expect(actual[6].id).to.equal("959");
    });

    it("returns expected Pokemon Array (Galar Pokédex)", () => {
      const actual = pokedex.inGalarPokedex().getPokemonAsJson();
      const isExpected = (pokemon: Pokemon) =>
        isValidPokemon(pokemon) && pokemon.localId?.galar !== undefined;

      // 400 + ニャース、バリヤード、ロトム（ヒート、ウォッシュ、フロスト、スピン、カット）、バスラオ、ヒヒダルマ、デスマス、ニャオニクス、ギルガルド
      // バケッチャ（中、大、特大）、パンプジン（中、大、特大）、ヨワシ、ストリンダー、コオリッポ、イエッサン、ザシアン、ザマゼンタ、ムゲンダイナ
      expect(JSON.parse(actual)).to.have.lengthOf(425);
      expect(JSON.parse(actual).every(isExpected)).to.be.true;
    });

    it("returns empty array for not defined name", () => {
      const actual = pokedex.name("foo").getPokemonAsJson();
      expect(actual).to.deep.equal("[]");
    });

    it("returns empty array for not defined id", () => {
      const actual = pokedex.id(0).getPokemonAsJson();
      expect(actual).to.deep.equal("[]");
    });
  });

  describe("language: en", () => {
    const pokedex = new Pokedex("en");

    it("returns expected Pokemon (id: 25)", () => {
      const actual = pokedex.id(25).getPokemonAsJson();
      const expected =
        '[{"id":"25","localId":{"galar":"194","paldea":"74"},"name":"Pikachu","type":["Electric"],"ability":[{"name":"Static","hidden":false},{"name":"Lightning Rod","hidden":true}],"eggGroup":["Field","Fairy"],"baseStats":{"H":"35","A":"55","B":"40","C":"50","D":"50","S":"90"},"generation":1}]';
      expect(actual).to.deep.equal(expected);
    });

    it("returns expected Pokemon (name: Pikachu)", () => {
      const actual = pokedex.name("Pikachu").getPokemonAsJson();
      const expected =
        '[{"id":"25","localId":{"galar":"194","paldea":"74"},"name":"Pikachu","type":["Electric"],"ability":[{"name":"Static","hidden":false},{"name":"Lightning Rod","hidden":true}],"eggGroup":["Field","Fairy"],"baseStats":{"H":"35","A":"55","B":"40","C":"50","D":"50","S":"90"},"generation":1}]';
      expect(actual).to.deep.equal(expected);
    });

    it("returns expected Pokemon Array (filter by type: Psychic, eggGroup: Field)", () => {
      const actual = pokedex
        .type("Psychic")
        .eggGroup("Field")
        .getPokemonAsJson();
      const isExpected = (pokemon: Pokemon) =>
        isValidPokemon(pokemon) &&
        pokemon.type.includes("Psychic") &&
        pokemon.eggGroup.includes("Field");

      expect(JSON.parse(actual).every(isExpected)).to.be.true;
    });

    it("returns expected Pokemon Array (mega)", () => {
      const actual = pokedex.canMegaEvolve().getPokemonAsJson();
      const isExpected = (pokemon: Pokemon) =>
        isValidPokemon(pokemon) && pokemon.megaEvolution !== undefined;

      expect(JSON.parse(actual).every(isExpected)).to.be.true;
    });

    it("returns expected Pokemon Array (Galar Pokédex)", () => {
      const actual = pokedex.inGalarPokedex().getPokemonAsJson();
      const isExpected = (pokemon: Pokemon) =>
        isValidPokemon(pokemon) && pokemon.localId?.galar !== undefined;

      expect(JSON.parse(actual)).to.have.lengthOf(425);
      expect(JSON.parse(actual).every(isExpected)).to.be.true;
    });

    it("sorts lexicographically", () => {
      const actual: Pokemon[] = JSON.parse(
        pokedex
          .type("Steel")
          .type("Fairy")
          .sort("Lexicographical")
          .getPokemonAsJson()
      );
      expect(actual.every((pokemon: Pokemon) => isValidPokemon(pokemon))).to.be
        .true;

      expect(actual).to.have.length(7);
      expect(actual[0].name).to.equal("Klefki");
      expect(actual[1].name).to.equal("Magearna");
      expect(actual[2].name).to.equal("Mawile");
      expect(actual[3].name).to.equal("Tinkatink");
      expect(actual[4].name).to.equal("Tinkaton");
      expect(actual[5].name).to.equal("Tinkatuff");
      expect(actual[6].name).to.equal("Zacian");
      expect(actual[6].formName).to.equal("Crowned Sword");
    });

    it("sorts by national number", () => {
      const actual: Pokemon[] = JSON.parse(
        pokedex
          .type("Steel")
          .type("Fairy")
          .sort("NationalNumber")
          .getPokemonAsJson()
      );
      expect(actual.every((pokemon: Pokemon) => isValidPokemon(pokemon))).to.be
        .true;

      expect(actual).to.have.length(7);
      expect(actual[0].id).to.equal("303");
      expect(actual[1].id).to.equal("707");
      expect(actual[2].id).to.equal("801");
      expect(actual[3].id).to.equal("888");
      expect(actual[4].id).to.equal("957");
      expect(actual[5].id).to.equal("958");
      expect(actual[6].id).to.equal("959");
    });
  });
});
