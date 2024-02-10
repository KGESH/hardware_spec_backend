import { ICpuVendor } from '../../../interfaces/computer/cpu.interface';
import { UnknownException } from '../../../exceptions/unknown.exception';

export function checkCpuVendor(model: string): ICpuVendor {
  if (isIntelCpu(model)) {
    return 'intel';
  } else if (isAmdCpu(model)) {
    return 'amd';
  }

  throw new UnknownException({
    message: 'Unknown CPU vendor',
  });
}

export function isIntelCpu(model: string): boolean {
  return model.toLowerCase().includes('intel');
}

export function isAmdCpu(model: string): boolean {
  return model.toLowerCase().includes('amd');
}
