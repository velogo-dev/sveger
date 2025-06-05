import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import { createRequestConfig } from '../../../utils/helpers';
import { withErrorHandling } from '../../../utils/error-handler';
import * as Types from '../../../types/index';

export interface loginUserQuery {
  /** The user name for login */
  username?: string;
  /** The password for login in clear text */
  password?: string;
}

/**
 * @description Logs user into the system
 * @tags user
 * @name loginUser
 * @summary Logs user into the system
 * @request GET:/user/login
 */
export const loginUser = (client: AxiosInstance) => async (
  query?: loginUserQuery,
  config?: AxiosRequestConfig,
): Promise<string> => {
  return withErrorHandling(async () => {
    const url = '/user/login';

    // Create request configuration with query parameters
    const requestConfig = createRequestConfig(query, config);

    // Make the API request
    const response = await client.get<string>(
      url,
      requestConfig,
    );

    return response.data;
  });
};