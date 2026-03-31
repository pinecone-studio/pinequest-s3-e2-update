const DOUBLE_CHARACTER_MAPPINGS: Array<[string, string]> = [
  ["нг", "ᠩ"],
  ["НГ", "ᠩ"],
  ["Нг", "ᠩ"],
];

const CHARACTER_MAPPINGS: Record<string, string> = {
  а: "ᠠ",
  А: "ᠠ",
  б: "ᠪ",
  Б: "ᠪ",
  в: "ᠸ",
  В: "ᠸ",
  г: "ᠭ",
  Г: "ᠭ",
  д: "ᠳ",
  Д: "ᠳ",
  е: "ᠡ",
  Е: "ᠡ",
  ё: "ᠶᠣ",
  Ё: "ᠶᠣ",
  ж: "ᠵ",
  Ж: "ᠵ",
  з: "ᠽ",
  З: "ᠽ",
  и: "ᠢ",
  И: "ᠢ",
  й: "ᠢ",
  Й: "ᠢ",
  к: "ᠺ",
  К: "ᠺ",
  л: "ᠯ",
  Л: "ᠯ",
  м: "ᠮ",
  М: "ᠮ",
  н: "ᠨ",
  Н: "ᠨ",
  о: "ᠣ",
  О: "ᠣ",
  ө: "ᠥ",
  Ө: "ᠥ",
  п: "ᠫ",
  П: "ᠫ",
  р: "ᠷ",
  Р: "ᠷ",
  с: "ᠰ",
  С: "ᠰ",
  т: "ᠲ",
  Т: "ᠲ",
  у: "ᠤ",
  У: "ᠤ",
  ү: "ᠦ",
  Ү: "ᠦ",
  ф: "ᠹ",
  Ф: "ᠹ",
  х: "ᠬ",
  Х: "ᠬ",
  ц: "ᠼ",
  Ц: "ᠼ",
  ч: "ᠴ",
  Ч: "ᠴ",
  ш: "ᠱ",
  Ш: "ᠱ",
  щ: "ᠱ",
  Щ: "ᠱ",
  ъ: "",
  Ъ: "",
  ы: "ᠢ",
  Ы: "ᠢ",
  ь: "",
  Ь: "",
  э: "ᠡ",
  Э: "ᠡ",
  ю: "ᠶᠦ",
  Ю: "ᠶᠦ",
  я: "ᠶᠠ",
  Я: "ᠶᠠ",
};

const GALIG_WORD_ALIASES: Record<string, string> = {
  aav: "abu",
};

const GALIG_SEQUENCE_MAPPINGS: Array<[string, string]> = [
  ["ng", "ᠩ"],
  ["sh", "ᠱ"],
  ["ch", "ᠴ"],
  ["ts", "ᠼ"],
  ["oe", "ᠥ"],
  ["ue", "ᠦ"],
  ["yo", "ᠶᠣ"],
  ["yu", "ᠶᠦ"],
  ["ya", "ᠶᠠ"],
];

const GALIG_CHARACTER_MAPPINGS: Record<string, string> = {
  a: "ᠠ",
  b: "ᠪ",
  c: "ᠼ",
  d: "ᠳ",
  e: "ᠡ",
  f: "ᠹ",
  g: "ᠭ",
  h: "ᠬ",
  i: "ᠢ",
  j: "ᠵ",
  k: "ᠺ",
  l: "ᠯ",
  m: "ᠮ",
  n: "ᠨ",
  o: "ᠣ",
  p: "ᠫ",
  q: "ᠬ",
  r: "ᠷ",
  s: "ᠰ",
  t: "ᠲ",
  u: "ᠤ",
  v: "ᠸ",
  w: "ᠸ",
  x: "ᠰ",
  y: "ᠶ",
  z: "ᠽ",
};

function convertCyrillicToTraditionalMongolian(text: string) {
  const normalized = DOUBLE_CHARACTER_MAPPINGS.reduce(
    (current, [source, target]) => current.replaceAll(source, target),
    text,
  );

  return Array.from(normalized)
    .map((character) => CHARACTER_MAPPINGS[character] ?? character)
    .join("");
}

function normalizeGaligText(text: string) {
  return text.replace(/[A-Za-z']+/g, (word) => {
    const normalizedWord = word.toLowerCase().replaceAll("'", "");
    return GALIG_WORD_ALIASES[normalizedWord] ?? normalizedWord;
  });
}

export function convertGaligToTraditionalMongolian(text: string) {
  const normalized = normalizeGaligText(text);
  let result = "";
  let index = 0;

  while (index < normalized.length) {
    const sequenceMatch = GALIG_SEQUENCE_MAPPINGS.find(([source]) =>
      normalized.startsWith(source, index),
    );

    if (sequenceMatch) {
      result += sequenceMatch[1];
      index += sequenceMatch[0].length;
      continue;
    }

    const character = normalized[index];
    result += GALIG_CHARACTER_MAPPINGS[character] ?? character;
    index += 1;
  }

  return result;
}

export function convertTextToTraditionalMongolian(text: string) {
  if (/[A-Za-z]/.test(text)) {
    return convertGaligToTraditionalMongolian(text);
  }

  return convertCyrillicToTraditionalMongolian(text);
}
