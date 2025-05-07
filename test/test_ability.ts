import { expect } from "chai";
import { getAbility } from "../src/ability";

describe("Ability class", () => {
  it("test ability", () => {
    const abilities = [
      {
        name: "しんりょく",
      },
      {
        name: "*ようりょくそ",
      },
    ];

    const actual = getAbility(abilities, "ja");
    expect(actual).to.have.length(2);
  });
});
