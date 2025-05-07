import { expect } from "chai";
import { getName, getFormName } from "../src/name";

describe("Name class", () => {
  it("returns corrent name", () => {
    const actual1 = getName("12", "ja");
    expect(actual1).equal("バタフリー");
  });

  it("returns corrent name", () => {
    const actual1 = getFormName("19", "a", "ja");
    expect(actual1).equal("アローラのすがた");
  });
});
