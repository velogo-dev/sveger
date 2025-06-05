import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import { createRequestConfig, replacePath, validatePathParams } from '../../../utils/helpers';
import { withErrorHandling } from '../../../utils/error-handler';
import * as Types from '../../../types/index';

/**
 * @description Delete purchase order by ID
 * @tags store
 * @name deleteOrder
 * @summary Delete purchase order by ID
 * @request DELETE:/store/order/{orderId}
 */
export const deleteOrder = (client: AxiosInstance) => async (orderId: number,
  config?: AxiosRequestConfig,
): Promise<any> => {
  return withErrorHandling(async () => {
    // Validate path parameters
    const pathParams = { orderId };
    validatePathParams('/store/order/{orderId}', pathParams);
    
    // Replace path parameters
    const url = replacePath('/store/order/{orderId}', pathParams);

    const requestConfig = createRequestConfig(undefined, config);

    // Make the API request
    const response = await client.delete<any>(
      url,
      requestConfig,
    );

    return response.data;
  });
};