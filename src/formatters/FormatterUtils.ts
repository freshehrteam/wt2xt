export function extractTextInBrackets(input: string): string[] {
  // The regular expression matches text within square brackets.
  const regex = /\[(.*?)]/g;
  let match;
  const matches: string[] = [];

  while ((match = regex.exec(input)) !== null) {
    if (match[1])
        matches.push(match[1]);
  }

  return matches;
}


