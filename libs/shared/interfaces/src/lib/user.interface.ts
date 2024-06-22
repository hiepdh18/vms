import { IRole } from './role.interface';

export interface IUser {
  id: number;
  username: string;
  password: string;
  name: string;
  email: string;
  roleId: number;
  role?: IRole;
  refreshToken: string;
  createdAt: string;
  updatedAt: string;
  isLocked?: boolean | any;
}
