import { OsDto } from './os.dto';
import { CpuDto } from './cpu.dto';
import { MotherboardDto } from './motherboard.dto';
import { GpuDto } from './gpu.dto';
import { RamDto } from './ram.dto';
import { DiskDto } from './disk.dto';

export type ComputerDto = {
  os?: OsDto;
  cpu?: CpuDto;
  motherboard?: MotherboardDto;
  gpu?: GpuDto;
  rams?: RamDto[];
  disks?: DiskDto[];
};

export type SystemInfoDto = {
  encodedId: string;
  computer: ComputerDto;
};

export type SystemInfoQuery = Pick<SystemInfoDto, 'encodedId'>;
