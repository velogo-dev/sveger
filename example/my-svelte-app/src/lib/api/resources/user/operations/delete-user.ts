import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import { createRequestConfig, replacePath, validatePathParams } from '../../../utils/helpers';
import { withErrorHandling } from '../../../utils/error-handler';
import * as Types from '../../../types/index';

/**
 * @description Delete user
 * @tags user
 * @name deleteUser
 * @summary Delete user
 * @request DELETE:/user/{username}
 */
export const deleteUser = (client: AxiosInstance) => async (username: string,
  config?: AxiosRequestConfig,
): Promise<any> => {
  return withErrorHandling(async () => {
    // Validate path parameters
    const pathParams = { username };
    validatePathParams('/user/{username}', pathParams);
    
    // Replace path parameters
    const url = replacePath('/user/{username}', pathParams);

    const requestConfig = createRequestConfig(undefined, config);

    // Make the API request
    const response = await client.delete<any>(
      url,
      requestConfig,
    );

    return response.data;
  });
};