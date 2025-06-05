// Generated types from OpenAPI specification

export interface ApiResponse {
  code?: number;
  message?: string;
  type?: string;
}

export interface Category {
  id?: number;
  name?: string;
}

export interface Pet {
  category?: Category;
  id?: number;
  name: string;
  photoUrls: string[];
  status?: string;
  tags?: Tag[];
}

export interface Tag {
  id?: number;
  name?: string;
}

