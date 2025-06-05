import type { AxiosInstance } from 'axios';
import { apiClient } from '../../config/axios.config';

// Import all operations for this resource
import { getInventory } from './operations/get-inventory';
import { placeOrder } from './operations/place-order';
import { getOrderById } from './operations/get-order-by-id';
import { deleteOrder } from './operations/delete-order';


/**
 * Store API Client
 * Contains all operations related to Store
 */
export class StoreApiClient {
  private client: AxiosInstance;

  constructor(client: AxiosInstance = apiClient) {
    this.client = client;
  }

  // Resource operations
  get getInventory() { return getInventory(this.client); }
  get placeOrder() { return placeOrder(this.client); }
  get getOrderById() { return getOrderById(this.client); }
  get deleteOrder() { return deleteOrder(this.client); }

}

/**
 * Default Store API client instance
 */
export const storeApi = new StoreApiClient();