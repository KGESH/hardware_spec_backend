import { CountryDto } from '../common.dto';
import { tags } from 'typia';
import { ICountry } from '../../interfaces/common.interface';

export type ShopDto = {
  id: string & tags.Format<'uuid'>;
  name: string;
  country: ICountry;
};

export type ShopCreateDto = {
  name: string;
  country: CountryDto;
};

export type ShopUpdateDto = Pick<ShopDto, 'id'> & Partial<ShopCreateDto>;
