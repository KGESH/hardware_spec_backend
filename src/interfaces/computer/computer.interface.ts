import { IOs } from './os.interface';
import { ICpu } from './cpu.interface';
import { IMotherboard } from './motherboard.interface';
import { IGpu } from './gpu.interface';
import { IDisk } from './disk.interface';
import { IRam } from './ram.interface';

export type IComputer = {
  os?: IOs;
  cpu?: ICpu;
  motherboard?: IMotherboard;
  gpu?: IGpu;
  rams?: IRam[];
  disks?: IDisk[];
};
