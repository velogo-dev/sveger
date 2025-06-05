import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import { createRequestConfig } from '../../../utils/helpers';
import { withErrorHandling } from '../../../utils/error-handler';
import * as Types from '../../../types/index';

/**
 * @description Create user
 * @tags user
 * @name createUser
 * @summary Create user
 * @request POST:/user
 */
export const createUser = (client: AxiosInstance) => async (
  data: Types.User,
  config?: AxiosRequestConfig,
): Promise<any> => {
  return withErrorHandling(async () => {
    const url = '/user';

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