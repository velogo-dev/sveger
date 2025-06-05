import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import { createRequestConfig } from '../../../utils/helpers';
import { withErrorHandling } from '../../../utils/error-handler';
import * as Types from '../../../types/index';

/**
 * @description Logs out current logged in user session
 * @tags user
 * @name logoutUser
 * @summary Logs out current logged in user session
 * @request GET:/user/logout
 */
export const logoutUser = (client: AxiosInstance) => async (
  config?: AxiosRequestConfig,
): Promise<any> => {
  return withErrorHandling(async () => {
    const url = '/user/logout';

    const requestConfig = createRequestConfig(undefined, config);

    // Make the API request
    const response = await client.get<any>(
      url,
      requestConfig,
    );

    return response.data;
  });
};