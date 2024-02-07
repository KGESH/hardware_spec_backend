type AmdGpu = {
  normalizedCategory: string;
  normalizedName: string;
  normalizedPrice: number;
};

export function normalizeAmdGpuName(name: string): string {
  const cleanName = name.trim().toLowerCase();

  // Define multiple regex patterns to cover different naming conventions
  const patterns = [
    // Pattern for names with brand, series, optional suffix (ti, super), and memory size
    /(rtx|gtx|gt)(\d{3,4})\s?((ti|super)?)\s?(\d{1,2}(gb|g))?/i,
    // Pattern for names where series comes first followed by a suffix without spacing
    /(\d{4})(gt|gts|gtx|rtx|gt|ti)(\d{0,2})\s?(\d{1,2}(gb|g))?/i,
  ];

  for (const regex of patterns) {
    if (regex.test(cleanName)) {
      return cleanName.replace(regex, (match, p1, p2, p3, p4, p5) => {
        // Determine if it's a brand or series based on the pattern matched
        const brand = ['rtx', 'gtx', 'gt', 'gts'].includes(p1) ? p1 : '';
        const series = brand ? p2 : p1;
        const suffix = brand ? p3 : p2;
        const memory = p4 ? p4 : p5 ? p5 : '';

        // Reconstruct the name with proper spacing
        let formattedName = brand ? `${brand} ${series}` : `${series}${suffix}`;
        if (memory) formattedName += ` ${memory}`;

        return formattedName;
      });
    }
  }

  // Return the original name if no pattern matches
  return cleanName;
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
  // Raw category e.g. [ 4000시리즈 ], [ 3000시리즈 ], [ 2000시리즈 ], [ 1000시리즈 ],
  // [ 900시리즈 ], [ 700시리즈 ], [ 600시리즈 ], [ 500시리즈 ], [ 400이하 ]
  const normalizedCategory = category
    .replace(/[\[\]]/g, '') // Remove the '[' and ']'
    .replace(/\ufeff/g, '') // Remove the ZWNBSP (Byte Order Mark)
    .replace(/\u200B/g, '') // Remove the ZWSP (Zero Width Space)
    .trim()
    .replace('시리즈', 'series')
    .replace('미만', 'under')
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
