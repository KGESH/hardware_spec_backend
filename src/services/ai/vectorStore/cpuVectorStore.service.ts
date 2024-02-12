import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  CPU_AMD_VECTOR_STORE,
  CPU_INTEL_VECTOR_STORE,
} from '../../../constants/ai.constants';
import { VectorStore } from '@langchain/core/vectorstores';
import { ICpu } from '../../../interfaces/computer/cpu.interface';
import { UnknownException } from '../../../exceptions/unknown.exception';
import { checkCpuVendor } from '../../../utils/brand/cpu/commonCpu.util';

@Injectable()
export class CpuVectorStoreService {
  private readonly logger = new Logger(CpuVectorStoreService.name);

  constructor(
    @Inject(CPU_INTEL_VECTOR_STORE)
    private readonly cpuIntelVectorStore: VectorStore,
    @Inject(CPU_AMD_VECTOR_STORE)
    private readonly cpuAmdVectorStore: VectorStore,
  ) {}

  getCpuVectorStore(cpu: ICpu): VectorStore {
    const vendor = checkCpuVendor(cpu.vendorName);
    switch (vendor) {
      case 'intel':
        return this.cpuIntelVectorStore;
      case 'amd':
        return this.cpuAmdVectorStore;
      default:
        throw new UnknownException({
          message: `Unknown CPU vendor: ${vendor}`,
        });
    }
  }
}
