import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import { createRequestConfig, replacePath, validatePathParams } from '../../../utils/helpers';
import { withErrorHandling } from '../../../utils/error-handler';
import * as Types from '../../../types/index';

/**
 * @description Updated user
 * @tags user
 * @name updateUser
 * @summary Updated user
 * @request PUT:/user/{username}
 */
export const updateUser = (client: AxiosInstance) => async (username: string,
  data: Types.User,
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
    const response = await client.put<any>(
      url,
      data,
      requestConfig,
    );

    return response.data;
  });
};