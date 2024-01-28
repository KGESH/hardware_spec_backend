import { tags } from 'typia';
import { ICountry } from '../common.interface';

export type IShop = {
  id: string & tags.Format<'uuid'>;
  name: string;
  country: ICountry;
  createdAt: string & tags.Format<'date-time'>;
  updatedAt: string & tags.Format<'date-time'>;
  deletedAt: (string & tags.Format<'date-time'>) | null;
};

export type IShopQuery = Pick<IShop, 'id'>;

export type IShopCreate = Pick<IShop, 'name' | 'country'>;

export type IShopUpdate = Pick<IShop, 'id'> & Partial<IShopCreate>;
