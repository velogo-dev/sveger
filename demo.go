package main

import (
	"fmt"
	"log"
	"os"

	"github.com/velogo-dev/sveger/generator"
)

func demo() {
	// Demo dengan Bearer auth config
	config := generator.Config{
		InputPath:        "petstore.json",
		OutputPath:       "./generated_bearer",
		Language:         "typescript",
		SplitFiles:       true,
		UseAxios:         true,
		BaseURL:          "https://petstore.swagger.io/v2",
		Timeout:          "5000",
		AuthType:         "bearer",
		WithInterceptors: true,
	}

	// Clean output directory
	os.RemoveAll(config.OutputPath)

	fmt.Printf("🚀 Generating API client with Bearer auth...\n")
	fmt.Printf("Base URL: %s\n", config.BaseURL)
	fmt.Printf("Timeout: %s ms\n", config.Timeout)
	fmt.Printf("Auth Type: %s\n", config.AuthType)
	fmt.Printf("With Interceptors: %t\n", config.WithInterceptors)

	err := generator.GenerateTypeScript(config)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("✅ API client generated successfully!")

	// Demo dengan API Key config
	config2 := generator.Config{
		InputPath:        "petstore.json",
		OutputPath:       "./generated_apikey",
		Language:         "typescript",
		SplitFiles:       true,
		UseAxios:         true,
		BaseURL:          "https://api.example.com",
		Timeout:          "15000",
		AuthType:         "apikey",
		WithInterceptors: true,
	}

	os.RemoveAll(config2.OutputPath)

	fmt.Printf("\n🚀 Generating API client with API Key auth...\n")
	fmt.Printf("Base URL: %s\n", config2.BaseURL)
	fmt.Printf("Timeout: %s ms\n", config2.Timeout)
	fmt.Printf("Auth Type: %s\n", config2.AuthType)

	err = generator.GenerateTypeScript(config2)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("✅ API client with API Key generated successfully!")
}