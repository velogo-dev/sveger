import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import { createRequestConfig, replacePath, validatePathParams } from '../../../utils/helpers';
import { withErrorHandling } from '../../../utils/error-handler';
import * as Types from '../../../types/index';

/**
 * @description Find purchase order by ID
 * @tags store
 * @name getOrderById
 * @summary Find purchase order by ID
 * @request GET:/store/order/{orderId}
 */
export const getOrderById = (client: AxiosInstance) => async (orderId: number,
  config?: AxiosRequestConfig,
): Promise<Types.Order> => {
  return withErrorHandling(async () => {
    // Validate path parameters
    const pathParams = { orderId };
    validatePathParams('/store/order/{orderId}', pathParams);
    
    // Replace path parameters
    const url = replacePath('/store/order/{orderId}', pathParams);

    const requestConfig = createRequestConfig(undefined, config);

    // Make the API request
    const response = await client.get<Types.Order>(
      url,
      requestConfig,
    );

    return response.data;
  });
};