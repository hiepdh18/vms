import { IResource } from './resource.interface';

export interface IRole {
  id: number;
  name: string;
  key: string;
  desc: string;
  resources?: IResource[];
  createdAt: Date;
  updatedAt: Date;
}
