type IntelCpu = {
  normalizedCategory: string; // e.g., "10th"
  normalizedName: string; // e.g., "I9 10900K"
  normalizedPrice: number; // e.g., 1000000
};

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
