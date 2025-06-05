import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import { createRequestConfig, replacePath, validatePathParams } from '../../../utils/helpers';
import { withErrorHandling } from '../../../utils/error-handler';
import * as Types from '../../../types/index';

/**
 * @description Get user by user name
 * @tags user
 * @name getUserByName
 * @summary Get user by user name
 * @request GET:/user/{username}
 */
export const getUserByName = (client: AxiosInstance) => async (username: string,
  config?: AxiosRequestConfig,
): Promise<Types.User> => {
  return withErrorHandling(async () => {
    // Validate path parameters
    const pathParams = { username };
    validatePathParams('/user/{username}', pathParams);
    
    // Replace path parameters
    const url = replacePath('/user/{username}', pathParams);

    const requestConfig = createRequestConfig(undefined, config);

    // Make the API request
    const response = await client.get<Types.User>(
      url,
      requestConfig,
    );

    return response.data;
  });
};