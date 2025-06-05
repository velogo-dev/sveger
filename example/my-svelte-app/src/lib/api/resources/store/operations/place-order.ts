import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import { createRequestConfig } from '../../../utils/helpers';
import { withErrorHandling } from '../../../utils/error-handler';
import * as Types from '../../../types/index';

/**
 * @description Place an order for a pet
 * @tags store
 * @name placeOrder
 * @summary Place an order for a pet
 * @request POST:/store/order
 */
export const placeOrder = (client: AxiosInstance) => async (
  data: Types.Order,
  config?: AxiosRequestConfig,
): Promise<Types.Order> => {
  return withErrorHandling(async () => {
    const url = '/store/order';

    const requestConfig = createRequestConfig(undefined, config);

    // Make the API request
    const response = await client.post<Types.Order>(
      url,
      data,
      requestConfig,
    );

    return response.data;
  });
};