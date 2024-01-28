import { ICountry, ICurrency } from '../interfaces/common.interface';
import { UnknownException } from '../exceptions/unknown.exception';
export function getCurrency(country: ICountry): ICurrency {
  switch (country) {
    case 'KR':
      return 'KRW';

    case 'US':
      return 'USD';

    case 'VN':
      return 'VND';

    case 'JP':
      return 'JPY';

    case 'CN':
      return 'CNY';

    default:
      throw new UnknownException('Invalid country');
  }
}
