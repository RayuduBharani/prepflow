// Pure helper functions for input detection (usable outside React components)
export const hasInputCallsFor = (code: string, language: string) => {
  switch (language) {
    case "python":
      return /input\s*\(/g.test(code);
    case "c":
      return /scanf\s*\(/g.test(code);
    case "cpp":
      return /(cin\s*>>|getline\s*\()/g.test(code);
    case "java":
      return /(\.nextLine\s*\(|\.nextInt\s*\(|\.nextDouble\s*\(|\.next\s*\(|Scanner\s+)/g.test(code);
    case "javascript":
      return /(readline\s*\(|prompt\s*\()/g.test(code);
    default:
      return false;
  }
};

export const inputCallsCountFor = (code: string, language: string) => {
  let matches: RegExpMatchArray | null = null;

  switch (language) {
    case "python":
      matches = code.match(/input\s*\(/g);
      break;
    case "c":
      matches = code.match(/scanf\s*\(/g);
      break;
    case "cpp":
      matches = code.match(/(cin\s*>>|getline\s*\()/g);
      break;
    case "java":
      matches = code.match(/(\.nextLine\s*\(|\.nextInt\s*\(|\.nextDouble\s*\(|\.next\s*\()/g);
      break;
    case "javascript":
      matches = code.match(/(readline\s*\(|prompt\s*\()/g);
      break;
  }

  return matches ? matches.length : 0;
};