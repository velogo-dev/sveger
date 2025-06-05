import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import { createRequestConfig } from '../../../utils/helpers';
import { withErrorHandling } from '../../../utils/error-handler';
import * as Types from '../../../types/index';

export interface getApiV1CompanyListQuery {
  /** User ID */
  user_id?: string;
  /** Page */
  page?: number;
  /** Per Page */
  per_page?: number;
  /** Search by name */
  name?: string;
  /** Search by status */
  status?: string;
}

/**
 * @description List Company
 * @tags Company
 * @name getApiV1CompanyList
 * @summary List Company
 * @request GET:/api/v1/company/list
 */
export const getApiV1CompanyList = (client: AxiosInstance) => async (
  query?: getApiV1CompanyListQuery,
  config?: AxiosRequestConfig,
): Promise<{ data: { data: Types.company_dto_CompanyResponse[]; pagination: any }; error: boolean; message: string }> => {
  return withErrorHandling(async () => {
    const url = '/api/v1/company/list';

    // Create request configuration with query parameters
    const requestConfig = createRequestConfig(query, config);

    // Make the API request
    const response = await client.get<{ data: { data: Types.company_dto_CompanyResponse[]; pagination: any }; error: boolean; message: string }>(
      url,
      requestConfig,
    );

    return response.data;
  });
};