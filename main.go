package main

import (
	"flag"
	"fmt"
	"log"

	"github.com/velogo-dev/sveger/generator"
)

func main() {
	var (
		inputPath        = flag.String("input", "", "Path to OpenAPI spec file (required)")
		outputPath       = flag.String("output", "./generated", "Output directory")
		language         = flag.String("lang", "typescript", "Target language (typescript)")
		splitFiles       = flag.Bool("split", true, "Split files (one endpoint per file)")
		useAxios         = flag.Bool("axios", true, "Generate Axios integration")
		baseURL          = flag.String("base-url", "", "Base URL (optional, will use spec URL if not provided)")
		timeout          = flag.String("timeout", "10000", "Request timeout in milliseconds")
		authType         = flag.String("auth", "bearer", "Authentication type (bearer, apikey, basic, none)")
		withInterceptors = flag.Bool("interceptors", false, "Include request/response interceptors")
	)

	flag.Parse()

	if *inputPath == "" {
		flag.Usage()
		log.Fatal("Error: input path is required")
	}

	config := generator.Config{
		InputPath:        *inputPath,
		OutputPath:       *outputPath,
		Language:         *language,
		SplitFiles:       *splitFiles,
		UseAxios:         *useAxios,
		BaseURL:          *baseURL,
		Timeout:          *timeout,
		AuthType:         *authType,
		WithInterceptors: *withInterceptors,
	}

	fmt.Printf("Generating API client...\n")
	fmt.Printf("Input: %s\n", config.InputPath)
	fmt.Printf("Output: %s\n", config.OutputPath)
	fmt.Printf("Language: %s\n", config.Language)
	fmt.Printf("Split files: %t\n", config.SplitFiles)
	fmt.Printf("Use Axios: %t\n", config.UseAxios)
	if config.UseAxios {
		fmt.Printf("Base URL: %s\n", config.BaseURL)
		fmt.Printf("Timeout: %s\n", config.Timeout)
		fmt.Printf("Auth Type: %s\n", config.AuthType)
		fmt.Printf("With Interceptors: %t\n", config.WithInterceptors)
	}

	switch config.Language {
	case "typescript":
		err := generator.GenerateTypeScript(config)
		if err != nil {
			log.Fatal(err)
		}
	default:
		log.Fatalf("unsupported language: %s", config.Language)
	}

	fmt.Println("✅ API client generated successfully!")
}