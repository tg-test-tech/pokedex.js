const typeMap = new Map<string, string>([
  ["ノーマル", "Normal"],
  ["ほのお", "Fire"],
  ["みず", "Water"],
  ["でんき", "Electric"],
  ["くさ", "Grass"],
  ["こおり", "Ice"],
  ["かくとう", "Fighting"],
  ["どく", "Poison"],
  ["じめん", "Ground"],
  ["ひこう", "Flying"],
  ["エスパー", "Psychic"],
  ["むし", "Bug"],
  ["いわ", "Rock"],
  ["ゴースト", "Ghost"],
  ["ドラゴン", "Dragon"],
  ["あく", "Dark"],
  ["はがね", "Steel"],
  ["フェアリー", "Fairy"],
]);

/**
 * Get the type names translated to the specified language
 * @param type Array of type names in Japanese
 * @param lang Language (ja or en)
 * @returns Array of type names in the specified language
 */
export const getType = (type: string[], lang: string): string[] => {
  if (lang === "ja") {
    return type;
  } else if (lang === "en") {
    return type.map((t) => {
      const englishType = typeMap.get(t);
      if (!englishType) {
        throw new Error(`Type translation not found for: ${t}`);
      }
      return englishType;
    });
  }

  throw new Error(`Unsupported language: ${lang}`);
};
