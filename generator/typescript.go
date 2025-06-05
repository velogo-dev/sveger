package generator

import (
	"bytes"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"text/template"

	"gopkg.in/yaml.v3"
)

type Config struct {
	InputPath        string
	OutputPath       string
	Language         string
	SplitFiles       bool
	UseAxios         bool
	BaseURL          string
	Timeout          string
	AuthType         string
	WithInterceptors bool
}

type OpenAPISpec struct {
	OpenAPI     string              `yaml:"openapi" json:"openapi"`
	Swagger     string              `yaml:"swagger" json:"swagger"` // Swagger 2.0
	Info        Info                `yaml:"info" json:"info"`
	Host        string              `yaml:"host" json:"host"`         // Swagger 2.0
	BasePath    string              `yaml:"basePath" json:"basePath"` // Swagger 2.0
	Servers     []Server            `yaml:"servers" json:"servers"`
	Paths       map[string]PathItem `yaml:"paths" json:"paths"`
	Components  Components          `yaml:"components" json:"components"`
	Definitions map[string]*Schema  `yaml:"definitions" json:"definitions"` // Swagger 2.0
}

type Info struct {
	Title   string `yaml:"title" json:"title"`
	Version string `yaml:"version" json:"version"`
}

type Server struct {
	URL string `yaml:"url" json:"url"`
}

type PathItem struct {
	Get    *Operation `yaml:"get,omitempty" json:"get,omitempty"`
	Post   *Operation `yaml:"post,omitempty" json:"post,omitempty"`
	Put    *Operation `yaml:"put,omitempty" json:"put,omitempty"`
	Delete *Operation `yaml:"delete,omitempty" json:"delete,omitempty"`
	Patch  *Operation `yaml:"patch,omitempty" json:"patch,omitempty"`
}

type Operation struct {
	OperationID string              `yaml:"operationId" json:"operationId"`
	Summary     string              `yaml:"summary" json:"summary"`
	Tags        []string            `yaml:"tags" json:"tags"`
	Parameters  []Parameter         `yaml:"parameters" json:"parameters"`
	RequestBody *RequestBody        `yaml:"requestBody" json:"requestBody"`
	Responses   map[string]Response `yaml:"responses" json:"responses"`
}

type Parameter struct {
	Name        string  `yaml:"name" json:"name"`
	In          string  `yaml:"in" json:"in"`
	Required    bool    `yaml:"required" json:"required"`
	Schema      *Schema `yaml:"schema" json:"schema"`
	Description string  `yaml:"description" json:"description"`
	// Swagger 2.0 direct type fields
	Type   string `yaml:"type" json:"type"`
	Format string `yaml:"format" json:"format"`
}

type RequestBody struct {
	Required bool                       `yaml:"required" json:"required"`
	Content  map[string]MediaTypeObject `yaml:"content" json:"content"`
}

type MediaTypeObject struct {
	Schema *Schema `yaml:"schema" json:"schema"`
}

type Response struct {
	Description string                     `yaml:"description" json:"description"`
	Content     map[string]MediaTypeObject `yaml:"content" json:"content"` // OpenAPI 3.0
	Schema      *Schema                    `yaml:"schema" json:"schema"`   // Swagger 2.0
}

type Components struct {
	Schemas map[string]*Schema `yaml:"schemas" json:"schemas"`
}

type Schema struct {
	Type          string             `yaml:"type" json:"type"`
	Format        string             `yaml:"format" json:"format"`
	Properties    map[string]*Schema `yaml:"properties" json:"properties"`
	Items         *Schema            `yaml:"items" json:"items"`
	Required      []string           `yaml:"required" json:"required"`
	Ref           string             `yaml:"$ref" json:"$ref"`
	AllOf         []*Schema          `yaml:"allOf" json:"allOf"`
	OneOf         []*Schema          `yaml:"oneOf" json:"oneOf"`
	AnyOf         []*Schema          `yaml:"anyOf" json:"anyOf"`
	Enum          []interface{}      `yaml:"enum" json:"enum"`
	XEnumVarnames []string           `yaml:"x-enum-varnames" json:"x-enum-varnames"`
}

func GenerateTypeScript(config Config) error {
	spec, err := loadOpenAPISpec(config.InputPath)
	if err != nil {
		return fmt.Errorf("failed to load OpenAPI spec: %w", err)
	}

	err = os.MkdirAll(config.OutputPath, 0755)
	if err != nil {
		return fmt.Errorf("failed to create output directory: %w", err)
	}

	// Generate new structured API client
	return generateStructuredApiClient(spec, config)
}

func loadOpenAPISpec(path string) (*OpenAPISpec, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}

	var spec OpenAPISpec

	if strings.HasSuffix(strings.ToLower(path), ".json") {
		err = json.Unmarshal(data, &spec)
	} else {
		err = yaml.Unmarshal(data, &spec)
	}

	if err != nil {
		return nil, err
	}

	return &spec, nil
}

func getTypeFromSchema(schema *Schema, spec *OpenAPISpec) string {
	return getTypeFromSchemaWithContext(schema, spec, false)
}

func getTypeFromSchemaWithContext(schema *Schema, spec *OpenAPISpec, isTypesFile bool) string {
	if schema == nil {
		return "any"
	}

	if schema.Ref != "" {
		refName := getRefName(schema.Ref)
		if isTypesFile {
			return refName
		}
		return "Types." + refName
	}

	switch schema.Type {
	case "string":
		return "string"
	case "number", "integer":
		return "number"
	case "boolean":
		return "boolean"
	case "array":
		itemType := getTypeFromSchemaWithContext(schema.Items, spec, isTypesFile)
		return fmt.Sprintf("%s[]", itemType)
	case "object":
		return "any"
	default:
		return "any"
	}
}

func getRefName(ref string) string {
	parts := strings.Split(ref, "/")
	name := parts[len(parts)-1]
	return sanitizeTypeName(name)
}

func sanitizeTypeName(name string) string {
	// Sanitize the name to be a valid TypeScript identifier
	// Replace dots with underscores and remove other invalid characters
	name = strings.ReplaceAll(name, ".", "_")
	name = strings.ReplaceAll(name, "-", "_")
	name = strings.ReplaceAll(name, " ", "_")

	return name
}

func contains(slice []string, item string) bool {
	for _, s := range slice {
		if s == item {
			return true
		}
	}
	return false
}

// Generate operation ID from HTTP method and path when missing
func generateOperationID(httpMethod, path string) string {
	// Remove leading slash and replace slashes with underscores
	cleanPath := strings.TrimPrefix(path, "/")
	cleanPath = strings.ReplaceAll(cleanPath, "/", "_")

	// Replace path parameters {id} with "ById" etc
	cleanPath = strings.ReplaceAll(cleanPath, "{", "_")
	cleanPath = strings.ReplaceAll(cleanPath, "}", "")

	// Replace other special characters
	cleanPath = strings.ReplaceAll(cleanPath, "-", "_")
	cleanPath = strings.ReplaceAll(cleanPath, ".", "_")

	// Convert to camelCase
	parts := strings.Split(cleanPath, "_")
	var result strings.Builder

	// First part is lowercase
	if len(parts) > 0 {
		result.WriteString(strings.ToLower(httpMethod))
		for _, part := range parts {
			if part != "" {
				// Capitalize first letter manually to avoid deprecated strings.Title
				if len(part) > 0 {
					result.WriteString(strings.ToUpper(part[:1]) + strings.ToLower(part[1:]))
				}
			}
		}
	}

	return result.String()
}

func getOperationDescription(op *Operation) string {
	if op.Summary != "" {
		return op.Summary
	}
	return "API operation"
}

func getOperationSummary(op *Operation) string {
	if op.Summary != "" {
		return op.Summary
	}
	return "API operation"
}

func getOperationTags(op *Operation) string {
	if len(op.Tags) > 0 {
		return strings.Join(op.Tags, ", ")
	}
	return "API"
}

func getParamTypeString(param Parameter) string {
	// Check OpenAPI 3.0 style (with Schema)
	if param.Schema != nil {
		switch param.Schema.Type {
		case "string":
			return "string"
		case "number", "integer":
			return "number"
		case "boolean":
			return "boolean"
		case "array":
			if param.Schema.Items != nil {
				itemType := getParamTypeFromDirectType(param.Schema.Items.Type)
				return itemType + "[]"
			}
			return "any[]"
		default:
			return "any"
		}
	}

	// Check Swagger 2.0 style (direct type fields)
	if param.Type != "" {
		return getParamTypeFromDirectType(param.Type)
	}

	return "any"
}

func getParamTypeFromDirectType(paramType string) string {
	switch paramType {
	case "string":
		return "string"
	case "number", "integer":
		return "number"
	case "boolean":
		return "boolean"
	case "array":
		return "any[]"
	default:
		return "any"
	}
}

func generateReturnType(op *Operation, spec *OpenAPISpec) string {
	// Check both OpenAPI 3.0 and Swagger 2.0 responses
	for code, response := range op.Responses {
		if code == "200" || code == "201" {
			// OpenAPI 3.0 style (with content)
			if response.Content != nil {
				for _, content := range response.Content {
					if content.Schema != nil {
						returnType := getTypeFromSchema(content.Schema, spec)
						if returnType != "any" {
							return returnType
						}
					}
				}
			}
			// Swagger 2.0 style (direct schema)
			if response.Schema != nil {
				returnType := getTypeFromSchema(response.Schema, spec)
				if returnType != "any" {
					return returnType
				}

				// Handle allOf schemas more specifically
				if len(response.Schema.AllOf) > 0 {
					return generateAllOfReturnType(response.Schema.AllOf, spec)
				}
			}
		}
	}

	return "any"
}

// Generate return type for allOf schemas
func generateAllOfReturnType(allOfSchemas []*Schema, spec *OpenAPISpec) string {
	// Look for data structure in allOf
	for _, subSchema := range allOfSchemas {
		if subSchema.Properties != nil {
			// Check if this has a data property with array of specific types
			if dataProperty, ok := subSchema.Properties["data"]; ok {
				if len(dataProperty.AllOf) > 0 {
					// Look for the actual data array in nested allOf
					for _, dataSubSchema := range dataProperty.AllOf {
						if dataSubSchema.Properties != nil {
							if arrayProperty, ok := dataSubSchema.Properties["data"]; ok {
								if arrayProperty.Type == "array" && arrayProperty.Items != nil {
									if arrayProperty.Items.Ref != "" {
										itemType := getTypeFromSchema(arrayProperty.Items, spec)
										// Create a response interface with the specific array type
										return fmt.Sprintf("{ data: { data: %s[]; pagination: any }; error: boolean; message: string }", itemType)
									}
								}
							}
						}
					}
				}
				// Simple data property
				if dataProperty.Type == "array" && dataProperty.Items != nil {
					if dataProperty.Items.Ref != "" {
						itemType := getTypeFromSchema(dataProperty.Items, spec)
						return fmt.Sprintf("%s[]", itemType)
					}
				}
			}
		}

		// Check for direct ref to useful types
		if subSchema.Ref != "" {
			refType := getTypeFromSchema(subSchema, spec)
			if refType != "any" && !strings.Contains(refType, "pkg_") && !strings.Contains(refType, "fiber_") {
				return refType
			}
		}
	}

	// Fallback to any if we can't determine the type
	return "any"
}

func writeFile(path, content string) error {
	dir := filepath.Dir(path)
	err := os.MkdirAll(dir, 0755)
	if err != nil {
		return err
	}

	return os.WriteFile(path, []byte(content), 0644)
}

// Template data structures
type TypeDef struct {
	IsReference bool
	IsInterface bool
	IsArray     bool
	IsEnum      bool
	RefName     string
	Type        string
	ItemType    string
	Properties  map[string]PropertyDef
	EnumValues  []string
	EnumMembers []EnumMember
}

type EnumMember struct {
	Name  string
	Value string
}

type PropertyDef struct {
	Type     string
	Optional bool
}

type TypesTemplateData struct {
	Types map[string]TypeDef
}

type MethodDef struct {
	Name            string
	Params          string
	ReturnType      string
	MethodBody      string
	Method          string
	Path            string
	PathTemplate    string
	HasConfig       bool
	HasQueryParams  bool
	HasFormData     bool
	HasRequestBody  bool
	HasPathParams   bool
	HasTypes        bool
	QueryParams     []ParamDef
	FormParams      []ParamDef
	PathParams      []PathParamDef
	RequestBody     string
	RequestBodyType string
	Description     string
	Summary         string
	Tags            string
	HttpMethod      string
}

type ParamDef struct {
	Name        string
	ParamName   string
	Required    bool
	Type        string
	Description string
}

type PathParamDef struct {
	Name        string
	ParamName   string
	IsLast      bool
	Type        string
	Description string
}

type ApiMethodTemplateData struct {
	IsSingleFile    bool
	HasTypes        bool
	TypeImports     string
	Name            string
	Params          string
	ReturnType      string
	MethodBody      string
	Methods         []MethodDef
	Description     string
	Summary         string
	Tags            string
	HttpMethod      string
	Path            string
	PathTemplate    string
	Method          string
	HasQueryParams  bool
	HasPathParams   bool
	HasRequestBody  bool
	QueryParams     []ParamDef
	PathParams      []PathParamDef
	RequestBodyType string
}

type IndexTemplateData struct {
	IsSingleFile bool
	Exports      []string
}

type ConfigTemplateData struct {
	BaseURL          string
	Timeout          string
	AuthType         string
	TokenKey         string
	HeaderName       string
	WithInterceptors bool
}

// Template helper functions
func loadTemplate(name string) (*template.Template, error) {
	templatePath := filepath.Join("generator", "templates", name)
	return template.ParseFiles(templatePath)
}

func executeTemplate(tmpl *template.Template, data any) (string, error) {
	var buf bytes.Buffer
	err := tmpl.Execute(&buf, data)
	if err != nil {
		return "", err
	}
	return buf.String(), nil
}

// Convert schema to TypeDef for template
func schemaToTypeDef(name string, schema *Schema, spec *OpenAPISpec) TypeDef {
	typeDef := TypeDef{}

	// Handle references
	if schema.Ref != "" {
		typeDef.IsReference = true
		typeDef.RefName = getRefName(schema.Ref)
		return typeDef
	}

	// Handle arrays
	if schema.Type == "array" && schema.Items != nil {
		typeDef.IsArray = true
		typeDef.ItemType = getTypeFromSchemaWithContext(schema.Items, spec, true)
		return typeDef
	}

	// Handle enums
	if len(schema.Enum) > 0 {
		typeDef.IsEnum = true

		// Check if we have x-enum-varnames for proper enum member names
		if len(schema.XEnumVarnames) == len(schema.Enum) {
			// Generate proper enum members with names
			for i, val := range schema.Enum {
				member := EnumMember{
					Name:  schema.XEnumVarnames[i],
					Value: fmt.Sprintf(`"%v"`, val),
				}
				typeDef.EnumMembers = append(typeDef.EnumMembers, member)
			}
		} else {
			// Fallback to union type for compatibility
			for _, val := range schema.Enum {
				typeDef.EnumValues = append(typeDef.EnumValues, fmt.Sprintf(`"%v"`, val))
			}
		}
		return typeDef
	}

	// Handle objects
	if schema.Type == "object" || len(schema.Properties) > 0 {
		typeDef.IsInterface = true
		typeDef.Properties = make(map[string]PropertyDef)

		for propName, propSchema := range schema.Properties {
			prop := PropertyDef{
				Type:     getTypeFromSchemaWithContext(propSchema, spec, true),
				Optional: !contains(schema.Required, propName),
			}
			typeDef.Properties[propName] = prop
		}
		return typeDef
	}

	// Handle primitive types
	typeDef.Type = getTypeFromSchemaWithContext(schema, spec, true)
	return typeDef
}

// Generate structured API client with new directory structure
func generateStructuredApiClient(spec *OpenAPISpec, config Config) error {
	// Create directory structure
	if err := createDirectoryStructure(config.OutputPath); err != nil {
		return fmt.Errorf("failed to create directory structure: %w", err)
	}

	// Generate config files
	if err := generateConfigFiles(spec, config); err != nil {
		return fmt.Errorf("failed to generate config files: %w", err)
	}

	// Generate types
	if err := generateStructuredTypes(spec, config); err != nil {
		return fmt.Errorf("failed to generate types: %w", err)
	}

	// Generate utils
	if err := generateUtilsFiles(config); err != nil {
		return fmt.Errorf("failed to generate utils files: %w", err)
	}

	// Generate resources
	if err := generateResourcesStructure(spec, config); err != nil {
		return fmt.Errorf("failed to generate resources: %w", err)
	}

	// Generate main index file
	if err := generateMainIndex(spec, config); err != nil {
		return fmt.Errorf("failed to generate main index: %w", err)
	}

	return nil
}

// Create the directory structure
func createDirectoryStructure(outputPath string) error {
	dirs := []string{
		"config",
		"types",
		"utils",
		"resources",
	}

	for _, dir := range dirs {
		if err := os.MkdirAll(filepath.Join(outputPath, dir), 0755); err != nil {
			return err
		}
	}

	return nil
}

// Generate config files
func generateConfigFiles(spec *OpenAPISpec, config Config) error {
	configPath := filepath.Join(config.OutputPath, "config")

	// Generate axios.config.ts
	axiosConfigTmpl, err := loadTemplate("config/axios-config.tmpl")
	if err != nil {
		return err
	}
	axiosConfigContent, err := executeTemplate(axiosConfigTmpl, struct{}{})
	if err != nil {
		return err
	}
	if err := writeFile(filepath.Join(configPath, "axios.config.ts"), axiosConfigContent); err != nil {
		return err
	}

	// Generate interceptors.ts
	interceptorsTmpl, err := loadTemplate("config/interceptors.tmpl")
	if err != nil {
		return err
	}
	interceptorsContent, err := executeTemplate(interceptorsTmpl, struct{}{})
	if err != nil {
		return err
	}
	if err := writeFile(filepath.Join(configPath, "interceptors.ts"), interceptorsContent); err != nil {
		return err
	}

	// Generate constants.ts
	constantsTmpl, err := loadTemplate("config/constants.tmpl")
	if err != nil {
		return err
	}

	// Determine base URL
	baseURL := config.BaseURL
	if baseURL == "" && len(spec.Servers) > 0 {
		baseURL = spec.Servers[0].URL
	}
	if baseURL == "" {
		baseURL = "https://api.example.com"
	}

	// Determine timeout
	timeout := "10000"
	if config.Timeout != "" {
		timeout = config.Timeout
	}

	constantsData := ConfigTemplateData{
		BaseURL: baseURL,
		Timeout: timeout,
	}

	constantsContent, err := executeTemplate(constantsTmpl, constantsData)
	if err != nil {
		return err
	}
	if err := writeFile(filepath.Join(configPath, "constants.ts"), constantsContent); err != nil {
		return err
	}

	return nil
}

// Generate structured types
func generateStructuredTypes(spec *OpenAPISpec, config Config) error {
	typesPath := filepath.Join(config.OutputPath, "types")

	// Generate common.types.ts
	commonTypesTmpl, err := loadTemplate("types/common-types.tmpl")
	if err != nil {
		return err
	}
	commonTypesContent, err := executeTemplate(commonTypesTmpl, struct{}{})
	if err != nil {
		return err
	}
	if err := writeFile(filepath.Join(typesPath, "common.types.ts"), commonTypesContent); err != nil {
		return err
	}

	// Generate resource-specific type files based on tags
	resources := groupOperationsByTag(spec)

	for resourceName := range resources {
		resourceTypeFile := fmt.Sprintf("%s.types.ts", strings.ToLower(resourceName))

		// Filter types that belong to this resource
		resourceTypes := filterTypesForResource(spec, resourceName)

		if len(resourceTypes) > 0 {
			typesTmpl, err := loadTemplate("types.tmpl")
			if err != nil {
				return err
			}

			data := TypesTemplateData{
				Types: resourceTypes,
			}

			typesContent, err := executeTemplate(typesTmpl, data)
			if err != nil {
				return err
			}

			if err := writeFile(filepath.Join(typesPath, resourceTypeFile), typesContent); err != nil {
				return err
			}
		}
	}

	// Generate types index.ts with only files that actually exist
	if err := generateTypesIndexWithFiles(spec, config); err != nil {
		return err
	}

	return nil
}

// Generate utils files
func generateUtilsFiles(config Config) error {
	utilsPath := filepath.Join(config.OutputPath, "utils")

	utilFiles := []string{
		"error-handler.tmpl",
		"query-builder.tmpl",
		"helpers.tmpl",
	}

	for _, file := range utilFiles {
		tmpl, err := loadTemplate(fmt.Sprintf("utils/%s", file))
		if err != nil {
			return err
		}

		content, err := executeTemplate(tmpl, struct{}{})
		if err != nil {
			return err
		}

		fileName := strings.Replace(file, ".tmpl", ".ts", 1)
		if err := writeFile(filepath.Join(utilsPath, fileName), content); err != nil {
			return err
		}
	}

	return nil
}

// Group operations by tag/resource
func groupOperationsByTag(spec *OpenAPISpec) map[string][]MethodDef {
	resources := make(map[string][]MethodDef)

	for path, pathItem := range spec.Paths {
		methods := []struct {
			name string
			op   *Operation
		}{
			{"GET", pathItem.Get},
			{"POST", pathItem.Post},
			{"PUT", pathItem.Put},
			{"DELETE", pathItem.Delete},
			{"PATCH", pathItem.Patch},
		}

		for _, method := range methods {
			if method.op != nil {
				// Generate operationId if missing
				if method.op.OperationID == "" {
					method.op.OperationID = generateOperationID(method.name, path)
				}

				// Determine resource name from tags or path
				resourceName := "default"
				if len(method.op.Tags) > 0 {
					resourceName = method.op.Tags[0]
				} else {
					// Extract from path
					pathParts := strings.Split(strings.Trim(path, "/"), "/")
					if len(pathParts) > 0 {
						resourceName = pathParts[0]
					}
				}

				methodDef := MethodDef{
					Name:            method.op.OperationID,
					HttpMethod:      method.name,
					Path:            path,
					PathTemplate:    path,
					Method:          strings.ToLower(method.name),
					ReturnType:      generateReturnType(method.op, spec),
					Description:     getOperationDescription(method.op),
					Summary:         getOperationSummary(method.op),
					Tags:            getOperationTags(method.op),
					HasQueryParams:  false,
					HasPathParams:   false,
					HasRequestBody:  false,
					QueryParams:     []ParamDef{},
					PathParams:      []PathParamDef{},
					RequestBodyType: "any",
				}

				// Process parameters
				for _, param := range method.op.Parameters {
					switch param.In {
					case "query":
						methodDef.HasQueryParams = true
						queryParam := ParamDef{
							Name:        param.Name,
							Type:        getParamTypeString(param),
							Required:    param.Required,
							Description: param.Description,
						}
						methodDef.QueryParams = append(methodDef.QueryParams, queryParam)
					case "path":
						methodDef.HasPathParams = true
						pathParam := PathParamDef{
							Name:        param.Name,
							Type:        getParamTypeString(param),
							Description: param.Description,
						}
						methodDef.PathParams = append(methodDef.PathParams, pathParam)
					case "body":
						methodDef.HasRequestBody = true
						if param.Schema != nil {
							methodDef.RequestBodyType = getTypeFromSchema(param.Schema, spec)
						} else {
							methodDef.RequestBodyType = "any"
						}
					}
				}

				// Handle OpenAPI 3.0 request body
				if method.op.RequestBody != nil && !methodDef.HasRequestBody {
					methodDef.HasRequestBody = true
					if content, ok := method.op.RequestBody.Content["application/json"]; ok && content.Schema != nil {
						methodDef.RequestBodyType = getTypeFromSchema(content.Schema, spec)
					} else {
						methodDef.RequestBodyType = "any"
					}
				}

				resources[resourceName] = append(resources[resourceName], methodDef)
			}
		}
	}

	return resources
}

// Filter types for a specific resource
func filterTypesForResource(spec *OpenAPISpec, resourceName string) map[string]TypeDef {
	types := make(map[string]TypeDef)
	relatedTypes := make(map[string]bool)

	// Get all schemas from both OpenAPI 3.0 and Swagger 2.0
	allSchemas := make(map[string]*Schema)
	if spec.Components.Schemas != nil {
		for name, schema := range spec.Components.Schemas {
			allSchemas[name] = schema
		}
	}
	if spec.Definitions != nil {
		for name, schema := range spec.Definitions {
			allSchemas[name] = schema
		}
	}

	// Find types used in operations tagged with this resource
	for path, pathItem := range spec.Paths {
		methods := []struct {
			name string
			op   *Operation
		}{
			{"GET", pathItem.Get},
			{"POST", pathItem.Post},
			{"PUT", pathItem.Put},
			{"DELETE", pathItem.Delete},
			{"PATCH", pathItem.Patch},
		}

		for _, method := range methods {
			if method.op != nil {
				// Check if this operation belongs to the current resource
				operationResourceName := "default"
				if len(method.op.Tags) > 0 {
					operationResourceName = method.op.Tags[0]
				} else {
					// Extract from path
					pathParts := strings.Split(strings.Trim(path, "/"), "/")
					if len(pathParts) > 0 {
						operationResourceName = pathParts[0]
					}
				}

				// If this operation belongs to our resource, find all types it uses
				if strings.EqualFold(operationResourceName, resourceName) {
					// Find types in parameters
					for _, param := range method.op.Parameters {
						if param.Schema != nil {
							findTypesInSchema(param.Schema, allSchemas, relatedTypes)
						}
					}

					// Find types in request body
					if method.op.RequestBody != nil {
						for _, content := range method.op.RequestBody.Content {
							if content.Schema != nil {
								findTypesInSchema(content.Schema, allSchemas, relatedTypes)
							}
						}
					}

					// Find types in responses
					for _, response := range method.op.Responses {
						// OpenAPI 3.0 style
						if response.Content != nil {
							for _, content := range response.Content {
								if content.Schema != nil {
									findTypesInSchema(content.Schema, allSchemas, relatedTypes)
								}
							}
						}
						// Swagger 2.0 style
						if response.Schema != nil {
							findTypesInSchema(response.Schema, allSchemas, relatedTypes)
						}
					}
				}
			}
		}
	}

	// Also find types that directly match the resource name for completeness
	for name, schema := range allSchemas {
		if strings.Contains(strings.ToLower(name), strings.ToLower(resourceName)) ||
			strings.EqualFold(name, resourceName) {
			relatedTypes[name] = true
			findReferencedTypes(schema, allSchemas, relatedTypes)
		}
	}

	// Convert all related types to TypeDef
	for name := range relatedTypes {
		if schema, exists := allSchemas[name]; exists {
			sanitizedName := sanitizeTypeName(name)
			types[sanitizedName] = schemaToTypeDef(name, schema, spec)
		}
	}

	return types
}

// Find types referenced in a schema for type collection
func findTypesInSchema(schema *Schema, allSchemas map[string]*Schema, relatedTypes map[string]bool) {
	if schema == nil {
		return
	}

	// Check direct reference
	if schema.Ref != "" {
		refName := getRefName(schema.Ref)
		if _, exists := allSchemas[refName]; exists {
			relatedTypes[refName] = true
			// Recursively find references in the referenced type
			if refSchema, ok := allSchemas[refName]; ok {
				findReferencedTypes(refSchema, allSchemas, relatedTypes)
			}
		}
	}

	// Check properties
	if schema.Properties != nil {
		for _, propSchema := range schema.Properties {
			findTypesInSchema(propSchema, allSchemas, relatedTypes)
		}
	}

	// Check array items
	if schema.Items != nil {
		findTypesInSchema(schema.Items, allSchemas, relatedTypes)
	}

	// Check allOf, oneOf, anyOf
	for _, subSchema := range schema.AllOf {
		findTypesInSchema(subSchema, allSchemas, relatedTypes)
	}
	for _, subSchema := range schema.OneOf {
		findTypesInSchema(subSchema, allSchemas, relatedTypes)
	}
	for _, subSchema := range schema.AnyOf {
		findTypesInSchema(subSchema, allSchemas, relatedTypes)
	}
}

// Find types referenced by a schema
func findReferencedTypes(schema *Schema, allSchemas map[string]*Schema, relatedTypes map[string]bool) {
	if schema == nil {
		return
	}

	// Check direct reference
	if schema.Ref != "" {
		refName := getRefName(schema.Ref)
		if _, exists := allSchemas[refName]; exists {
			relatedTypes[refName] = true
			// Recursively find references in the referenced type
			if refSchema, ok := allSchemas[refName]; ok {
				findReferencedTypes(refSchema, allSchemas, relatedTypes)
			}
		}
	}

	// Check properties
	if schema.Properties != nil {
		for _, propSchema := range schema.Properties {
			findReferencedTypes(propSchema, allSchemas, relatedTypes)
		}
	}

	// Check array items
	if schema.Items != nil {
		findReferencedTypes(schema.Items, allSchemas, relatedTypes)
	}

	// Check allOf, oneOf, anyOf
	for _, subSchema := range schema.AllOf {
		findReferencedTypes(subSchema, allSchemas, relatedTypes)
	}
	for _, subSchema := range schema.OneOf {
		findReferencedTypes(subSchema, allSchemas, relatedTypes)
	}
	for _, subSchema := range schema.AnyOf {
		findReferencedTypes(subSchema, allSchemas, relatedTypes)
	}
}

// Generate types index file with actual generated files
func generateTypesIndexWithFiles(spec *OpenAPISpec, config Config) error {
	typesPath := filepath.Join(config.OutputPath, "types")
	resources := groupOperationsByTag(spec)

	var content strings.Builder
	content.WriteString("// Auto-generated types index\n\n")
	content.WriteString("export * from './common.types';\n")

	// Only add exports for type files that actually have content
	resourceNames := make([]string, 0)
	for resourceName := range resources {
		resourceTypes := filterTypesForResource(spec, resourceName)
		if len(resourceTypes) > 0 {
			resourceNames = append(resourceNames, strings.ToLower(resourceName))
		}
	}

	sort.Strings(resourceNames)
	for _, name := range resourceNames {
		content.WriteString(fmt.Sprintf("export * from './%s.types';\n", name))
	}

	return writeFile(filepath.Join(typesPath, "index.ts"), content.String())
}

// Generate resources structure
func generateResourcesStructure(spec *OpenAPISpec, config Config) error {
	resourcesPath := filepath.Join(config.OutputPath, "resources")
	resources := groupOperationsByTag(spec)

	for resourceName, operations := range resources {
		resourceLower := strings.ToLower(resourceName)
		resourcePath := filepath.Join(resourcesPath, resourceLower)
		operationsPath := filepath.Join(resourcePath, "operations")

		// Create resource directory and operations subdirectory
		if err := os.MkdirAll(operationsPath, 0755); err != nil {
			return err
		}

		// Generate individual operation files
		for _, operation := range operations {
			if err := generateResourceOperation(operation, operationsPath); err != nil {
				return fmt.Errorf("failed to generate operation %s: %w", operation.Name, err)
			}
		}

		// Generate resource API client
		if err := generateResourceApiClient(resourceName, operations, resourcePath); err != nil {
			return fmt.Errorf("failed to generate resource API client for %s: %w", resourceName, err)
		}

		// Generate resource index
		if err := generateResourceIndex(resourceName, operations, resourcePath); err != nil {
			return fmt.Errorf("failed to generate resource index for %s: %w", resourceName, err)
		}
	}

	return nil
}

// Generate individual resource operation
func generateResourceOperation(operation MethodDef, operationsPath string) error {
	tmpl, err := loadTemplate("resource-operation.tmpl")
	if err != nil {
		return err
	}

	// Add HasTypes field
	operationData := operation
	operationData.HasTypes = true

	content, err := executeTemplate(tmpl, operationData)
	if err != nil {
		return err
	}

	fileName := fmt.Sprintf("%s.ts", toKebabCase(operation.Name))
	return writeFile(filepath.Join(operationsPath, fileName), content)
}

// Generate resource API client
func generateResourceApiClient(resourceName string, operations []MethodDef, resourcePath string) error {
	tmpl, err := loadTemplate("resource-api-client.tmpl")
	if err != nil {
		return err
	}

	// Prepare operation data with file names
	operationData := make([]struct {
		Name     string
		FileName string
	}, len(operations))

	for i, op := range operations {
		operationData[i] = struct {
			Name     string
			FileName string
		}{
			Name:     op.Name,
			FileName: toKebabCase(op.Name),
		}
	}

	data := struct {
		ResourceName      string
		ResourceNameLower string
		Operations        []struct {
			Name     string
			FileName string
		}
	}{
		ResourceName:      toTitleCase(resourceName),
		ResourceNameLower: strings.ToLower(resourceName),
		Operations:        operationData,
	}

	content, err := executeTemplate(tmpl, data)
	if err != nil {
		return err
	}

	fileName := fmt.Sprintf("%s-api.client.ts", strings.ToLower(resourceName))
	return writeFile(filepath.Join(resourcePath, fileName), content)
}

// Generate resource index
func generateResourceIndex(resourceName string, operations []MethodDef, resourcePath string) error {
	var content strings.Builder
	content.WriteString("// Auto-generated resource index\n\n")

	// Export all operations
	for _, op := range operations {
		fileName := toKebabCase(op.Name)
		content.WriteString(fmt.Sprintf("export { %s } from './operations/%s';\n", op.Name, fileName))
	}

	content.WriteString("\n")

	// Export the API client
	resourceLower := strings.ToLower(resourceName)
	content.WriteString(fmt.Sprintf("export { %sApiClient, %sApi } from './%s-api.client';\n",
		toTitleCase(resourceName), resourceLower, resourceLower))

	return writeFile(filepath.Join(resourcePath, "index.ts"), content.String())
}

// Generate main index
func generateMainIndex(spec *OpenAPISpec, config Config) error {
	tmpl, err := loadTemplate("main-index.tmpl")
	if err != nil {
		return err
	}

	resources := groupOperationsByTag(spec)
	resourceData := make([]struct {
		ResourceName      string
		ResourceNameLower string
	}, 0, len(resources))

	for resourceName := range resources {
		resourceData = append(resourceData, struct {
			ResourceName      string
			ResourceNameLower string
		}{
			ResourceName:      toTitleCase(resourceName),
			ResourceNameLower: strings.ToLower(resourceName),
		})
	}

	// Sort resources for consistent output
	sort.Slice(resourceData, func(i, j int) bool {
		return resourceData[i].ResourceName < resourceData[j].ResourceName
	})

	data := struct {
		Resources []struct {
			ResourceName      string
			ResourceNameLower string
		}
	}{
		Resources: resourceData,
	}

	content, err := executeTemplate(tmpl, data)
	if err != nil {
		return err
	}

	return writeFile(filepath.Join(config.OutputPath, "index.ts"), content)
}

// Helper functions

// Convert string to kebab-case
func toKebabCase(s string) string {
	var result strings.Builder
	for i, r := range s {
		if i > 0 && r >= 'A' && r <= 'Z' {
			result.WriteRune('-')
		}
		result.WriteRune(r)
	}
	return strings.ToLower(result.String())
}

// Convert string to TitleCase
func toTitleCase(s string) string {
	if len(s) == 0 {
		return s
	}
	return strings.ToUpper(s[:1]) + s[1:]
}
