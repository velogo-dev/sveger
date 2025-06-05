# Sveger - TypeScript API Client Generator

Sveger is a powerful Go-based tool that generates TypeScript API clients from OpenAPI/Swagger specifications. It creates clean, type-safe, and production-ready TypeScript code with modern patterns and best practices.

## Features

✨ **Modern TypeScript Generation**
- Full TypeScript support with proper type safety
- Modern ES6+ syntax with async/await
- Tree-shakeable modular architecture
- Comprehensive JSDoc documentation

🏗️ **Professional Architecture**
- Resource-based organization (company, user, store, etc.)
- Individual operation files for better maintainability
- Unified API client with configurable instances
- Clean separation of concerns

🔧 **Axios Integration**
- Built-in Axios HTTP client
- Configurable interceptors for requests/responses
- Error handling with centralized error management
- Support for custom configurations

🎯 **Developer Experience**
- IntelliSense support with full type completion
- Flexible API client instantiation
- Environment-aware logging (development/production)
- Comprehensive utility functions

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd sveger

# Build the project
go build -o sveger main.go
```

## Quick Start

### 1. Generate API Client

```bash
# Basic usage
./sveger -input petstore.json -output ./generated-api

# With custom configuration
./sveger -input api-spec.yaml -output ./src/api -timeout 15000
```

```

### 2. Use Generated Client

```typescript
import { ApiClient, CompanyApiClient } from './generated-api';

// Option 1: Use unified API client with default configuration
const api = new ApiClient();
const companies = await api.company.getApiV1CompanyList();

// Option 2: Use with custom configuration
const customApi = new ApiClient({
  timeout: 10000,
  headers: {
    'Authorization': 'Bearer your-token'
  }
});

// Option 3: Use individual resource clients
const companyClient = new CompanyApiClient();
const result = await companyClient.getApiV1CompanyList();
```

## Command Line Options

| Flag | Description | Default | Example |
|------|-------------|---------|---------|
| `-input` | Path to OpenAPI/Swagger specification file | Required | `-input petstore.json` |
| `-output` | Output directory for generated files | Required | `-output ./src/api` |
| `-timeout` | HTTP client timeout in milliseconds | `10000` | `-timeout 15000` |
| `-auth` | Authentication type | `bearer` | `-auth bearer` |

## Generated Structure

The generator creates a well-organized directory structure:

```
sveger/
├── config/
│   ├── axios.config.ts      # Axios instance configuration
│   ├── constants.ts         # API constants and endpoints
│   └── interceptors.ts      # Request/response interceptors
├── types/
│   ├── index.ts            # Type exports barrel file
│   ├── common.types.ts     # Common type definitions
│   ├── company.types.ts    # Company-specific types
│   ├── user.types.ts       # User-specific types
│   └── store.types.ts      # Store-specific types
├── utils/
│   ├── error-handler.ts    # Error handling utilities
│   ├── helpers.ts          # General helper functions
│   └── query-builder.ts    # Query parameter builders
├── resources/
│   ├── company/
│   │   ├── operations/
│   │   │   └── get-api-v1-company-list.ts
│   │   ├── company-api.client.ts
│   │   └── index.ts
│   ├── user/
│   │   ├── operations/
│   │   │   ├── create-user.ts
│   │   │   ├── get-user-by-name.ts
│   │   │   └── update-user.ts
│   │   ├── user-api.client.ts
│   │   └── index.ts
│   └── store/
│       ├── operations/
│       │   └── place-order.ts
│       ├── store-api.client.ts
│       └── index.ts
└── index.ts                # Main API client export
```

## Usage Examples

### Basic API Calls

```typescript
import { api } from './generated-api';

// Get company list with query parameters
const companies = await api.company.getApiV1CompanyList({
  page: 1,
  per_page: 10,
  status: 'active'
});

// Create a new user
const newUser = await api.user.createUser({
  username: 'john_doe',
  email: 'john@example.com',
  firstName: 'John',
  lastName: 'Doe'
});

// Place an order
const order = await api.store.placeOrder({
  petId: 123,
  quantity: 2,
  shipDate: '2024-01-15T10:00:00Z',
  status: 'placed',
  complete: false
});
```

### Custom Configuration

```typescript
import { ApiClient, createAxiosInstance } from './generated-api';

// Option 1: Pass configuration object
const apiWithConfig = new ApiClient({
  baseURL: 'https://api.example.com',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'your-api-key'
  }
});

// Option 2: Pass custom Axios instance
const customAxios = createAxiosInstance({
  timeout: 20000,
  withCredentials: true
});
const apiWithAxios = new ApiClient(customAxios);
```

### Error Handling

```typescript
import { api, isApiError } from './generated-api';

try {
  const user = await api.user.getUserByName('nonexistent');
} catch (error) {
  if (isApiError(error)) {
    console.error('API Error:', error.message);
    console.error('Status:', error.status);
    console.error('Data:', error.data);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

### Type Safety

```typescript
import { api, Types } from './generated-api';

// Full type safety with IntelliSense support
const createNewUser = async (userData: Types.User): Promise<Types.User> => {
  return await api.user.createUser(userData);
};

// Type-safe query parameters
const searchCompanies = async (filters: {
  status?: 'active' | 'inactive';
  page?: number;
  per_page?: number;
}) => {
  return await api.company.getApiV1CompanyList(filters);
};
```

## Configuration

### Environment Variables

The generated client supports environment-aware configuration:

```typescript
// In development, detailed logging is enabled
if (import.meta.env.NODE_ENV === 'development') {
  console.log('🚀 API Request:', requestData);
}
```

### Interceptors

Customize request and response handling:

```typescript
import { createAxiosInstance } from './generated-api';

const customClient = createAxiosInstance({
  baseURL: 'https://api.example.com'
});

// Add custom request interceptor
customClient.interceptors.request.use((config) => {
  config.headers['X-Custom-Header'] = 'custom-value';
  return config;
});
```

## TypeScript Support

The generated code is fully compatible with:
- TypeScript 4.5+
- Strict mode compilation
- Modern module resolution
- Vite and other modern bundlers

### Type Exports

```typescript
// Import specific types
import type { User, Company, Order } from './generated-api';

// Import all types under namespace
import * as Types from './generated-api';
const user: Types.User = { /* ... */ };
```

## Advanced Features

### Query Building

```typescript
import { QueryBuilder, createQueryBuilder } from './generated-api';

// Method 1: Using the QueryBuilder class
const queryBuilder = new QueryBuilder()
  .add('status', 'active')
  .add('page', 1)
  .addArray('tags', ['typescript', 'api'])
  .addBoolean('verified', true)
  .addParams({ sort_by: 'created_at', sort_order: 'desc' });

const queryParams = queryBuilder.build();

// Method 2: Using the factory function
const builder = createQueryBuilder()
  .paginate({ page: 1, per_page: 20 })
  .sort({ sort_by: 'name', sort_order: 'asc' })
  .filter({ status: 'active', verified: true });
```

### Utility Functions

```typescript
import { 
  mergeConfigs, 
  createRequestConfig, 
  validatePathParams,
  withErrorHandling 
} from './generated-api';

// Merge multiple configurations
const config = mergeConfigs(defaultConfig, customConfig);

// Validate path parameters
validatePathParams('/users/{id}/posts/{postId}', { id: '123', postId: '456' });
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Requirements

- Go 1.19+
- OpenAPI 3.0 or Swagger 2.0 specification file

## Supported Input Formats

- JSON (`.json`)
- YAML (`.yaml`, `.yml`)
- OpenAPI 3.0
- Swagger 2.0

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Changelog

### v1.0.0
- Initial release with TypeScript generation
- Resource-based architecture
- Full type safety and modern ES6+ syntax
- Axios integration with interceptors
- Comprehensive error handling
- Professional project structure

---

**Built with ❤️ using Go and TypeScript**