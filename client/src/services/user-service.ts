import httpApi from '../http/index.js';
import type { AxiosResponse } from 'axios';
import type { IUser } from '../models/IUser';

export default class UserService {
  static async fetchUsers(): Promise<AxiosResponse<IUser[]>> {
    return await httpApi.get<IUser[]>('/users');
  }
}
