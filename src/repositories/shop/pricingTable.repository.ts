import { BaseRepository } from '../base.repository';
import { PricingTableDto } from '../../dtos/shop/pricing.table.dto';

export class PricingTableRepository extends BaseRepository<
  { str: string },
  PricingTableDto
> {
  protected _transform(entity: { str: string }): PricingTableDto {
    throw new Error('Method not implemented.');
  }
}
