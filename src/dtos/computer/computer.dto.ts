import { IOperatingSystem } from './os.dto';
import { ICpu } from './cpu.dto';
import { IMotherboard } from './motherboard.dto';
import { IGpu } from './gpu.dto';
import { IRam } from './ram.dto';
import { IDisk } from './disk.dto';

export type IComputer = {
  os: IOperatingSystem;
  cpu: ICpu;
  motherboard?: IMotherboard;
  gpu?: IGpu;
  rams: IRam[];
  disks: IDisk[];
};
