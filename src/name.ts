import * as fs from "fs";
import * as path from "path";
import type { NameData, FormNameData } from "./types";

// Use glob pattern to load all name JSON files
const jsons: NameData[] = (() => {
  const resourcePath = path.join(__dirname, "resources", "pokemon");
  const nameFiles = fs
    .readdirSync(resourcePath)
    .filter((file) =>
      file.match(/^(gen\d+(_[A-Za-z]+)?_name\.json|mega_name\.json)$/)
    );

  return nameFiles.flatMap((file) => {
    const filePath = path.join(resourcePath, file);
    return JSON.parse(fs.readFileSync(filePath, "utf8")) as NameData[];
  });
})();

// Get form name data
const formNameData: FormNameData[] = (() => {
  const resourcePath = path.join(__dirname, "resources", "pokemon");
  const nameFiles = fs
    .readdirSync(resourcePath)
    .filter((file) => file.match(/^form(_\d+)?(_[A-Za-z]+)?_name\.json$/));

  return nameFiles.flatMap((file) => {
    const filePath = path.join(resourcePath, file);
    return JSON.parse(fs.readFileSync(filePath, "utf8")) as FormNameData[];
  });
})();

// Create a map of pokemon id to name data for efficient lookup
const nameMap: Map<string, NameData> = new Map<string, NameData>(
  jsons.map((data) => [data.id, data])
);

// Create a map of pokemon id to form name data for efficient lookup
const formNameMap: Map<number, FormNameData> = new Map<number, FormNameData>(
  formNameData.map((data) => [data.id, data])
);

/**
 * Get the name of a Pokemon
 * @param id Pokemon ID
 * @param lang Language (ja or en)
 * @returns Pokemon name
 */
export const getName = (id: string, lang: string): string => {
  const data = nameMap.get(id);
  if (data === undefined) {
    throw new Error(`Pokemon not found with id: ${id}`);
  }

  switch (lang) {
    case "ja":
      return data.name.ja;
    case "en":
      return data.name.en;
    default:
      throw new Error(`Unsupported language: ${lang}`);
  }
};

/**
 * Get the form name of a Pokemon
 * @param id Pokemon ID
 * @param formId Form ID
 * @param lang Language (ja or en)
 * @returns Form name
 */
export const getFormName = (
  id: string,
  formId: string,
  lang: string
): string => {
  const pokemonId = Number(id);
  const data = formNameMap.get(pokemonId);
  if (data === undefined) {
    throw new Error(
      `Pokemon not found with id: ${id}, formId: ${formId}, and lang ${lang}`
    );
  }

  const form = data.names.find((name) => name.formId === formId);
  if (form === undefined) {
    throw new Error(
      `Form name not found for id: ${id}, formId: ${formId}, and lang ${lang}`
    );
  }

  switch (lang) {
    case "ja":
      return form.ja;
    case "en":
      return form.en;
    default:
      throw new Error(`Unsupported language: ${lang}`);
  }
};
