import { ICpuVendor } from '../../../interfaces/computer/cpu.interface';
import { UnknownException } from '../../../exceptions/unknown.exception';
import * as typia from 'typia';

export function checkCpuVendor(vendorName: string): ICpuVendor {
  const vendor = vendorName.toLowerCase();
  const isIntel = typia.is<'intel'>(vendor);
  const isAmd = typia.is<'amd'>(vendor);

  if (!isIntel && !isAmd) {
    throw new UnknownException({ message: `Unknown CPU vendor: ${vendor}` });
  }

  if (isIntel) {
    return 'intel';
  } else {
    return 'amd';
  }
}

export function checkCpuVendorByModelName(model: string): ICpuVendor {
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
