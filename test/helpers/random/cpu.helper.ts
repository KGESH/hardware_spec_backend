import * as typia from 'typia';
import * as uuid from 'uuid';
import { cpu } from '@prisma/client';
import {
  ICpu,
  ICpuCreate,
} from '../../../src/interfaces/computer/cpu.interface';

export class MockCpuHelper {
  static randomId = uuid.v4;
  static dto = typia.createRandom<ICpu>();
  static createDto = typia.createRandom<ICpuCreate>();
  static entity = typia.createRandom<cpu>();
  static create(entity: cpu) {
    return this.transform(entity);
  }
  static transform(entity: cpu): ICpu {
    return {
      id: entity.id,
      type: 'CPU',
      hwKey: entity.hw_key,
      normalizedHwKey: entity.normalized_hw_key,
      displayName: entity.model_name,
      vendorName: entity.vendor,
      coreCount: entity.core_count,
      threadCount: entity.thread_count,
      baseClock: entity.base_clock,
      boostClock: entity.boost_clock,
    };
  }
}
