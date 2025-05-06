interface NameData {
  id: string;
  name: {
    ja: string;
    en: string;
  };
}

interface FormNameData {
  id: number;
  names: FormName[];
}

interface FormName {
  formId: string;
  ja: string;
  en: string;
}

const jsons: NameData[] = [].concat(
  require("./resources/pokemon/gen1_name.json"),
  require("./resources/pokemon/gen2_name.json"),
  require("./resources/pokemon/gen3_name.json"),
  require("./resources/pokemon/gen4_name.json"),
  require("./resources/pokemon/gen5_name.json"),
  require("./resources/pokemon/gen6_name.json"),
  require("./resources/pokemon/gen7_name.json"),
  require("./resources/pokemon/gen8_name.json"),
  require("./resources/pokemon/gen8_LegendsArceus_name.json"),
  require("./resources/pokemon/gen9_name.json"),
  require("./resources/pokemon/mega_name.json")
);
const nameMap = new Map<string, { ja: string; en: string }>(
  jsons.map((obj) => [obj.id, obj.name])
);

const formNameJson: FormNameData[] = require("./resources/pokemon/form_name.json");
const formNameMap = new Map<string, FormName[]>(
  formNameJson.map((obj) => [obj.id.toString(), obj.names])
);

export const getName = (id: string, lang: string): string => {
  const name = nameMap.get(id);
  if (!name) {
    throw new Error(`Name not found for id: ${id}`);
  }

  if (lang === "ja") {
    return name.ja;
  } else if (lang === "en") {
    return name.en;
  }

  throw new Error(`Unsupported language: ${lang}`);
};

export const getFormName = (
  id: string,
  formId: string,
  lang: string
): string => {
  const names = formNameMap.get(id);
  if (names === undefined) {
    throw new Error(`Undefined: ${id}, ${formId}, ${lang}`);
  }
  const name = names.find((n) => {
    return n.formId === formId;
  });
  if (!name) {
    throw new Error(`Form name not found for id: ${id}, formId: ${formId}`);
  }

  if (lang === "ja") {
    return name.ja;
  } else if (lang === "en") {
    return name.en;
  }

  throw new Error(`Unsupported language: ${lang}`);
};
