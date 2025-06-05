import type { AxiosInstance } from 'axios';
import { apiClient } from '../../config/axios.config';

// Import all operations for this resource
import { createUsersWithListInput } from './operations/create-users-with-list-input';
import { getUserByName } from './operations/get-user-by-name';
import { updateUser } from './operations/update-user';
import { deleteUser } from './operations/delete-user';
import { createUser } from './operations/create-user';
import { loginUser } from './operations/login-user';
import { logoutUser } from './operations/logout-user';
import { createUsersWithArrayInput } from './operations/create-users-with-array-input';


/**
 * User API Client
 * Contains all operations related to User
 */
export class UserApiClient {
  private client: AxiosInstance;

  constructor(client: AxiosInstance = apiClient) {
    this.client = client;
  }

  // Resource operations
  get createUsersWithListInput() { return createUsersWithListInput(this.client); }
  get getUserByName() { return getUserByName(this.client); }
  get updateUser() { return updateUser(this.client); }
  get deleteUser() { return deleteUser(this.client); }
  get createUser() { return createUser(this.client); }
  get loginUser() { return loginUser(this.client); }
  get logoutUser() { return logoutUser(this.client); }
  get createUsersWithArrayInput() { return createUsersWithArrayInput(this.client); }

}

/**
 * Default User API client instance
 */
export const userApi = new UserApiClient();