type NormalizeRule = {
  name: string;
  pattern: RegExp;
  replace?: string;
};

const NORMALIZE_RULES: NormalizeRule[] = [
  {
    name: "metadata block purge",
    pattern: /\s*[\(\[]\s*[^()\[\]]*?\b(feat\.?|ft\.?|featuring|with|remaster(?:ed)?|live|demo|version|remix|mix|edit|explicit|clean|anniversary|ost|soundtrack|edition|acoustic|original|pt\.?|part|bonus|deluxe|expanded|ep|b[- ]?side)\b[^()\[\]]*?[\]\)]/gi,
    replace: ""
  },
  {
    name: "metadata separator purge",
    pattern: /\s*[-–—/|]\s*.*\b(feat\.?|ft\.?|featuring|with|remaster(?:ed)?|live|demo|version|remix|mix|edit|explicit|clean|anniversary|ost|soundtrack|edition|acoustic|original|pt\.?|part|bonus|deluxe|expanded|as featured in|b[- ]?side|from the|ep|radio|special|extended|session)\b.*$/gi,
    replace: ""
  },
  {
    name: "year suffix purge",
    pattern: /\s*[-–—]\s*\d{4}\s*([-–—].*)?$/gi,
    replace: ""
  },
  {
    name: "ampersand to and",
    pattern: /\s*&\s*/g,
    replace: " and ",
  },
  {
    name: "remove special characters",
    pattern: /[^\p{L}\p{N}\s\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf'-]/gu,
    replace: " ",
  },
  {
    name: "collapse whitespace",
    pattern: /\s+/g,
    replace: " ",
  }
];

export { NORMALIZE_RULES }