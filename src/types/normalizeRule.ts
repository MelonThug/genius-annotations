type NormalizeRule = {
  name: string;
  pattern: RegExp;
  replace?: any;
};

const NORMALIZE_RULES: NormalizeRule[] = [
{
    name: "metadata block purge",
    pattern: /\s*[\(\[]\s*[^()\[\]]*?\b(feat\.?|ft\.?|featuring|with|remaster(?:ed)?|live|demo|version|remix|mix|edit|explicit|clean|anniversary|ost|soundtrack|edition|acoustic|original|pt\.?|part|bonus|deluxe|expanded|ep|b[- ]?side)\b[^()\[\]]*?[\]\)]/gi,
    replace: ""
  },
  {
    name: "metadata separator purge",
    pattern: /\s*[-–—/|]\s*.*?\b(feat\.?|ft\.?|featuring|with|remaster(?:ed)?|live|demo|version|ver\.?|complete|remix|mix|edit|explicit|clean|anniversary|ost|soundtrack|edition|acoustic|original|pt\.?|part|bonus|deluxe|expanded|as featured in|b[- ]?side|from the|ep|radio|special|extended|session)\b.*$/gi,
    replace: ""
  },
  {
    name: "loose metadata purge",
    pattern: /[\s.]+\b(feat\.?|ft\.?|featuring|with|remaster(?:ed)?|live|demo|version|ver\.?|complete|remix|mix|edit|anniversary|ost|soundtrack|edition|acoustic|original|pt\.?|part|bonus|deluxe|expanded|ep|b[- ]?side|session|radio|special|extended)\b.*$/gi,
    replace: ""
  },
  {
    name: "restore censored words and acronyms",
    pattern: /[\p{L}\d*!@#%]+(?:\.[\p{L}\d*!@#%]+)+\.?|[\p{L}\d]+[*$!@#%]+[\p{L}\d]*|[*$!@#%]+[\p{L}\d]+/gu,
    replace: (match: string) => {
      let cleaned = match.toLowerCase();
      if (/^ni[*!@#%]+as?$/i.test(cleaned)) {
        return cleaned.endsWith('as') ? "niggas" : "nigga";
      }
      if (cleaned.includes('.')) return cleaned.replace(/\./g, '');
      if (cleaned.includes('$')) cleaned = cleaned.replace(/\$/g, 's');
      return cleaned.replace(/[*!@#%]/g, '');
    }
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