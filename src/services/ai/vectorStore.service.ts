import { Injectable, Logger } from '@nestjs/common';
import { CpuVectorStoreService } from './vectorStore/cpuVectorStore.service';
import { IHardware } from '../../interfaces/computer/hardware.interface';
import { VectorStore } from '@langchain/core/vectorstores';
import { ICpu } from '../../interfaces/computer/cpu.interface';
import { UnknownException } from '../../exceptions/unknown.exception';

@Injectable()
export class VectorStoreService {
  private readonly logger = new Logger(VectorStoreService.name);

  constructor(private readonly cpuVectorStoreService: CpuVectorStoreService) {}

  getVectorStore(
    hardware: Pick<IHardware, 'type' | 'vendorName'>,
    shopId: string = '3ec748a4-ef57-4ba6-8f47-e70509462ff3',
  ): Promise<VectorStore> {
    switch (hardware.type) {
      case 'CPU':
        return this.cpuVectorStoreService.getCpuVectorStore(
          hardware as ICpu,
          shopId,
        );
      default:
        throw new UnknownException({
          message: `TODO: IMPL ${hardware.type}`,
        });
    }
  }
}
