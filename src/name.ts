import * as fs from "fs";
import * as path from "path";

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

// Use glob pattern to load all name JSON files
const jsons: NameData[] = (() => {
  const resourcePath = path.join(__dirname, "resources", "pokemon");
  const nameFiles = fs
    .readdirSync(resourcePath)
    .filter((file) =>
      file.match(/^(gen\d+(_[A-Za-z]+)?_name\.json|mega_name\.json)$/)
    );

  let allNames: NameData[] = [];

  for (const file of nameFiles) {
    // Load data from each file and concatenate
    const data = require(`./resources/pokemon/${file}`);
    allNames = allNames.concat(data);
  }

  return allNames;
})();
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
