#!/bin/bash

# Demo script untuk testing CLI tool sveger
echo "=== Testing Sveger CLI Tool ==="

# Download sample OpenAPI spec
echo "Downloading sample OpenAPI spec..."
curl -s https://petstore.swagger.io/v2/swagger.json -o petstore.json

# Test dengan default settings (non-interactive mode untuk demo)
echo "Testing with default settings..."
echo -e "petstore.json\n./generated\ntypescript\ny\ny\n" | ./sveger

# Show generated files
echo "Generated files:"
find ./generated -type f -name "*.ts" | head -10

echo "=== Demo completed ==="