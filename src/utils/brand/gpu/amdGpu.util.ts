type AmdGpu = {
  normalizedCategory: string;
  normalizedName: string;
  normalizedPrice: number;
};

export function normalizeAmdGpuName(name: string): string {
  const cleanName = name.trim().toLowerCase();
  return cleanName
    .replace('라데온', 'radeon') // Replace Korean characters with English
    .replace('천계열', '000 ' + 'family'); // e.g. "ATI HD7천계열" -> "ATI HD7000 family", "ATI HD6천계열" -> "ATI HD6000 family"
}

export function normalizeAmdGpu({
  category,
  name,
  priceString,
}: {
  category: string;
  name: string;
  priceString: string;
}): AmdGpu {
  // Raw category e.g. [ 7000시리즈 ], [ 6000시리즈 ], [ 500시리즈 ], [ 400시리즈 ], [ 300미만 ]
  const normalizedCategory = category
    .replace(/[\[\]]/g, '') // Remove the '[' and ']'
    .replace(/\ufeff/g, '') // Remove the ZWNBSP (Byte Order Mark)
    .replace(/\u200B/g, '') // Remove the ZWSP (Zero Width Space)
    .trim()
    .replace('시리즈', 'series')
    .replace('300미만', '400under')
    .trim();

  const cleanedPriceString = priceString.replace(/[^\d,]/g, '').trim();
  const normalizedPrice = parseInt(cleanedPriceString.replace(/,/g, ''), 10);

  const normalizedName = normalizeAmdGpuName(name);

  return {
    normalizedCategory,
    normalizedName,
    normalizedPrice,
  };
}
