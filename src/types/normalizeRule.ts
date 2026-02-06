type NormalizeRule = {
  name: string;
  pattern: RegExp;
  replace?: string;
};

const NORMALIZE_RULES: NormalizeRule[] = [
  // ---------- FEATURE / COLLAB NOISE ----------
  {
    name: "feat (parentheses or brackets)",
    pattern: /\s*[\(\[]\s*feat[^\)\]]*[\)\]]/gi,
    replace: "",
  },
  {
    name: "feat / ft / featuring (dash form)",
    pattern: /\s*-\s*(feat\.?|ft\.?|featuring)\b.*$/gi,
    replace: "",
  },

  // ---------- WITH ----------
  {
    name: "with (parentheses or brackets)",
    pattern: /\s*[\(\[]\s*with[^\)\]]*[\)\]]/gi,
    replace: "",
  },
  {
    name: "with (dash form)",
    pattern: /\s*-\s*with\b.*$/gi,
    replace: "",
  },

  // ---------- VERSION NOISE ----------
  {
    name: "remaster / remastered (any year)",
    pattern: /\s*[-(]?\s*\d*\s*remaster(?:ed)?\s*\d*\)?/gi,
    replace: "",
  },
  {
    name: "live versions",
    pattern: /\s*[-(]?\s*live\b.*$/gi,
    replace: "",
  },
  {
    name: "radio edit",
    pattern: /\s*[-(]?\s*radio edit\b.*$/gi,
    replace: "",
  },
  {
    name: "mono / stereo",
    pattern: /\s*[-(]?\s*(mono|stereo)\b.*$/gi,
    replace: "",
  },
  {
    name: "explicit / clean tags",
    pattern: /\s*[-(]?\s*(explicit|clean)\b.*$/gi,
    replace: "",
  },
  {
    name: "bonus / deluxe / expanded",
    pattern: /\s*[-(]?\s*(bonus track|deluxe|expanded edition)\b.*$/gi,
    replace: "",
  },

  // ---------- STRUCTURAL NORMALIZATION ----------
  {
    name: "ampersand to and",
    pattern: /\s*&\s*/g,
    replace: " and ",
  },
  {
    name: "normalize dash spacing",
    pattern: /\s*[-–—]\s*/g,
    replace: " ",
  },
  {
    name: "remove brackets but keep text",
    pattern: /[\(\[]([^\)\]]+)[\)\]]/g,
    replace: " $1 ",
  },
];

export { NORMALIZE_RULES }