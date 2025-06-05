import type { AxiosInstance } from 'axios';
import { apiClient } from '../../config/axios.config';

// Import all operations for this resource
import { uploadFile } from './operations/upload-file';
import { addPet } from './operations/add-pet';
import { updatePet } from './operations/update-pet';
import { findPetsByStatus } from './operations/find-pets-by-status';
import { findPetsByTags } from './operations/find-pets-by-tags';
import { getPetById } from './operations/get-pet-by-id';
import { updatePetWithForm } from './operations/update-pet-with-form';
import { deletePet } from './operations/delete-pet';


/**
 * Pet API Client
 * Contains all operations related to Pet
 */
export class PetApiClient {
  private client: AxiosInstance;

  constructor(client: AxiosInstance = apiClient) {
    this.client = client;
  }

  // Resource operations
  get uploadFile() { return uploadFile(this.client); }
  get addPet() { return addPet(this.client); }
  get updatePet() { return updatePet(this.client); }
  get findPetsByStatus() { return findPetsByStatus(this.client); }
  get findPetsByTags() { return findPetsByTags(this.client); }
  get getPetById() { return getPetById(this.client); }
  get updatePetWithForm() { return updatePetWithForm(this.client); }
  get deletePet() { return deletePet(this.client); }

}

/**
 * Default Pet API client instance
 */
export const petApi = new PetApiClient();