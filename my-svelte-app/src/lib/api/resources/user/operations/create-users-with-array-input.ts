import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import { createRequestConfig } from '../../../utils/helpers';
import { withErrorHandling } from '../../../utils/error-handler';
import * as Types from '../../../types/index';

/**
 * @description Creates list of users with given input array
 * @tags user
 * @name createUsersWithArrayInput
 * @summary Creates list of users with given input array
 * @request POST:/user/createWithArray
 */
export const createUsersWithArrayInput = (client: AxiosInstance) => async (
  data: Types.User[],
  config?: AxiosRequestConfig,
): Promise<any> => {
  return withErrorHandling(async () => {
    const url = '/user/createWithArray';

    const requestConfig = createRequestConfig(undefined, config);

    // Make the API request
    const response = await client.post<any>(
      url,
      data,
      requestConfig,
    );

    return response.data;
  });
};