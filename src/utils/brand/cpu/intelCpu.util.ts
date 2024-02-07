type IntelCpu = {
  normalizedCategory: string; // e.g., "10th"
  normalizedName: string; // e.g., "I9 10900K"
  normalizedPrice: number; // e.g., 1000000
};

/**
 * @param model - "Intel(R) Core(TM) i7-8700K CPU @ 3.70GHz"
 * @returns normalizedCpuModelName - "i7 8700k"
 */
export function normalizeIntelCpuModel(model: string): string {
  // First, try to match the model names commonly found in Intel Core series
  const coreModelMatch = model.match(/\b(i\d[\s-]?\d+(K|KS|KF|F)?)\b/gi);

  // If a Core series model name is found, format it to remove dashes, ensure spaces, and lowercase
  if (coreModelMatch && coreModelMatch.length > 0) {
    return coreModelMatch[0].replace('-', ' ').toLowerCase(); // Adjusted here
  }

  // If not a Core series, look for other Intel processor series model identifiers (e.g., Pentium G645)
  const otherModelMatch = model.match(
    /\b(G\d{3,4}|J\d{3,4}|N\d{3,4}|E\d{3,4}|Q\d{3,4}|D\d{3,4})\b/gi,
  );

  // Return the first match found, formatted as required, or an empty string if no match
  return otherModelMatch && otherModelMatch.length > 0
    ? otherModelMatch[0].toLowerCase().replace('-', ' ') // Ensure consistent formatting
    : '';
}

/**
 * @param name - "커피I7 8700K"
 * @returns normalizedCpuModelName - "i7 8700k"
 */
export function normalizeIntelCpuName(name: string): string {
  return name
    .replace(
      /[\uAC00-\uD7A3]+(I\d+\s?\d+K?|G\d+\s?\d*|Q\d+\s?\d+|E\d+\s?\d+)/gi,
      '$1',
    )
    .toLowerCase();
}

export function normalizeIntelCpu({
  category,
  name,
  priceString,
}: {
  category: string;
  name: string;
  priceString: string;
}): IntelCpu {
  const normalizedCategory = category
    .replace(/\ufeff/g, '') // Remove the ZWNBSP (Byte Order Mark)
    .trim()
    .replace(/[\[\]]/g, '') // Remove the '[' and ']'
    .trim()
    .replace('세대', 'th')
    .trim()
    .replace('소켓', 'socket')
    .trim();

  const normalizedPrice = parseInt(priceString.replace(/,/g, ''));
  const normalizedName = normalizeIntelCpuName(name);

  return {
    normalizedCategory,
    normalizedName,
    normalizedPrice,
  };
}
