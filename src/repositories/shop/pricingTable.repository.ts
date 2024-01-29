import { BaseRepository } from '../base.repository';
import { IPricingTable } from '../../interfaces/shop/pricingTable.interface';

export class PricingTableRepository extends BaseRepository<
  { str: string },
  IPricingTable
> {
  protected _transform(entity: { str: string }): IPricingTable {
    throw new Error('Method not implemented.');
  }
}
