import { normalizeIntelCpuName } from '../../../src/utils/brand/cpu/intelCpu.util';
import {
  checkCpuVendorByModelName,
  isAmdCpu,
  isIntelCpu,
} from '../../../src/utils/brand/cpu/commonCpu.util';
import { ICpuVendor } from '../../../src/interfaces/computer/cpu.interface';

describe('[Spec] Cpu Utils', () => {
  describe('[INTEL]', () => {
    describe('[CPU Vendor]', () => {
      it('should be intel cpu', () => {
        const model = 'Intel(R) Core(TM) i7-8700K CPU @ 3.70GHz';
        const expectVendor: ICpuVendor = 'intel';

        const vendor = checkCpuVendorByModelName(model);

        expect(vendor).toEqual(expectVendor);
      });
      it('should be true', () => {
        const model = 'Intel(R) Core(TM) i9-13900KS CPU @ 6.00GHz';

        const isIntel = isIntelCpu(model);

        expect(isIntel).toEqual(true);
      });
    });
    describe('[Normalize Intel cpu name]', () => {
      it('should be normalized cpu name', () => {
        const name = '커피I7 8700K';

        const normalizedCpuModelName = normalizeIntelCpuName(name);

        expect(normalizedCpuModelName).toBe('i7 8700k');
      });
    });
  });

  describe('[AMD]', () => {
    describe('[CPU Vendor]', () => {
      it('should be amd cpu', () => {
        const model = 'AMD Ryzen 7 5800X 8-Core Processor';
        const expectVendor: ICpuVendor = 'amd';

        const vendor = checkCpuVendorByModelName(model);

        expect(vendor).toEqual(expectVendor);
      });
      it('should be false', () => {
        const model = 'AMD Ryzen 7 5800X 8-Core Processor';

        const isAmd = isAmdCpu(model);

        expect(isAmd).toEqual(true);
      });
    });
  });
});
