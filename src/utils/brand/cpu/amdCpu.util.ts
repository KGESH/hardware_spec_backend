import { UnknownException } from '../../../exceptions/unknown.exception';

type Ryzen = {
  isRyzen: true;
  normalizedCategory: string;
  normalizedName: string;
  normalizedPrice: number;
};

type NonRyzen = {
  isRyzen: false;
  normalizedCategory: string;
  normalizedName: string;
  normalizedPrice: number;
};

type AmdCpu = Ryzen | NonRyzen;

type AmdSeries = 'ryzen' | 'amd';

export function getAmdBrand(model: string): AmdSeries {
  if (isRyzenSeries(model)) {
    return 'ryzen';
  } else {
    return 'amd';
  }
}

export function isRyzenSeries(model: string): boolean {
  return model.toLowerCase().includes('ryzen');
}

export function normalizeAmdCpuName(name: string): string {
  // Attempt to match Ryzen pattern first
  const ryzenMatch = name.match(/라이젠(\d+)\s(?:[가-힣]+)?(\d+)(X3D|X|G)?/i);
  if (ryzenMatch) {
    const [, series, model, suffix = ''] = ryzenMatch;
    return `Ryzen${series} ${model}${suffix}`.toLowerCase();
  } else {
    // For non-Ryzen CPUs, simply prefix with "amd" and include the model number
    // Attempt to extract model number directly if specific AMD pattern is not matched
    const nameWithoutKorean = name.replace(/[가-힣]+/g, '').trim();
    const nonRyzenMatch =
      nameWithoutKorean.match(/AMD\s*([가-힣]*\d+)(.*)/i) ||
      nameWithoutKorean.match(/(\d+)/);
    if (nonRyzenMatch) {
      const model = nonRyzenMatch[1];
      return `amd ${model}`.toLowerCase();
    }
  }

  // Default to original name if no specific pattern matches or in unexpected format
  return name.toLowerCase();
}

export function normalizeAmdCpu({
  category,
  name,
  priceString,
}: {
  category: string;
  name: string;
  priceString: string;
}): AmdCpu {
  const normalizedCategory = category
    .replace('세대', 'th')
    .replace(/\ufeff/g, '') // Remove the ZWNBSP (Byte Order Mark)
    .trim()
    .replace(/[\[\]]/g, '') // Remove the '[' and ']'
    .trim();

  const cleanedPriceString = priceString.replace(/[^\d,]/g, '').trim();
  const normalizedPrice = parseInt(cleanedPriceString.replace(/,/g, ''), 10);

  const normalizedName = normalizeAmdCpuName(name);

  // Determine if it's Ryzen based on the presence of "ryzen" in the normalized name
  const isRyzen = normalizedName.includes('ryzen');

  return {
    isRyzen,
    normalizedCategory,
    normalizedName,
    normalizedPrice,
  };
}
