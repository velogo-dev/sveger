// Generated types from OpenAPI specification

export interface company_dto_CompanyResponse {
  address?: string;
  company_type?: constants_CompanyType;
  created_at?: string;
  description?: string;
  domain?: string;
  email?: string;
  id?: string;
  label?: string;
  level?: string;
  logo?: string;
  name?: string;
  npwp?: string;
  phone?: string;
  saldo?: number;
  slogan?: string;
  status?: constants_CompanyStatus;
  updated_at?: string;
  user_id?: string;
}

export enum constants_CompanyStatus {
  CompanyStatusInactive = "inactive",
  CompanyStatusActive = "active",
  CompanyStatusUnderReview = "under_review",
  CompanyStatusRejected = "rejected",
}


export enum constants_CompanyType {
  COMPANY_TYPE_PERSONAL = "personal",
  COMPANY_TYPE_CV = "cv",
  COMPANY_TYPE_PT = "pt",
  COMPANY_TYPE_PT_ASING = "pt_asing",
}


