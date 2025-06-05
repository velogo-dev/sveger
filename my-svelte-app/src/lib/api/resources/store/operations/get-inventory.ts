import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import { createRequestConfig } from '../../../utils/helpers';
import { withErrorHandling } from '../../../utils/error-handler';
import * as Types from '../../../types/index';

/**
 * @description Returns pet inventories by status
 * @tags store
 * @name getInventory
 * @summary Returns pet inventories by status
 * @request GET:/store/inventory
 */
export const getInventory = (client: AxiosInstance) => async (
  config?: AxiosRequestConfig,
): Promise<any> => {
  return withErrorHandling(async () => {
    const url = '/store/inventory';

    const requestConfig = createRequestConfig(undefined, config);

    // Make the API request
    const response = await client.get<any>(
      url,
      requestConfig,
    );

    return response.data;
  });
};