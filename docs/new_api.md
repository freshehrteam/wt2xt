# New API Documentation

This document describes the new API endpoint for converting templates using the DocBuilder's streaming output.

## Overview

The new API provides a streamlined way to convert templates to various formats using the DocBuilder's `toString()` method. Unlike the original API, this version streams the output directly without writing to temporary files.

## Endpoint

### POST /convert

Converts a template to the specified format and returns the result as a streamed response.

#### Request

- **Method**: POST
- **URL**: `/convert`
- **Query Parameters**:
  - `out` (optional): The output format. Default is 'adoc'. Valid values are the keys of the `ExportFormat` enum.
- **Headers**:
  - `Content-Type`: `application/json`
- **Body**: A JSON object representing a WebTemplate.

#### Response

- **Status Code**: 200 OK
- **Content-Type**: Varies based on the output format
- **Body**: The streamed output from DocBuilder.toString()

#### Error Responses

- **400 Bad Request**:
  - Invalid request body
  - No template provided
  - Invalid format
- **404 Not Found**:
  - Endpoint not found
- **500 Internal Server Error**:
  - Server-side error during processing

## Examples

### Basic Usage

```http
POST /convert HTTP/1.1
Host: localhost:3001
Content-Type: application/json

{
  "templateId": "example_template",
  "version": "1.0.0",
  "defaultLanguage": "en",
  "tree": {
    "id": "example",
    "name": "Example Template",
    "localizedName": "Example Template",
    "rmType": "COMPOSITION",
    "nodeId": "openEHR-EHR-COMPOSITION.example.v1",
    "min": 1,
    "max": 1,
    "children": []
  }
}
```

### Specifying Output Format

```http
POST /convert?out=adoc HTTP/1.1
Host: localhost:3001
Content-Type: application/json

{
  "templateId": "example_template",
  "version": "1.0.0",
  "defaultLanguage": "en",
  "tree": {
    "id": "example",
    "name": "Example Template",
    "localizedName": "Example Template",
    "rmType": "COMPOSITION",
    "nodeId": "openEHR-EHR-COMPOSITION.example.v1",
    "min": 1,
    "max": 1,
    "children": []
  }
}
```

## Differences from Original API

The new API differs from the original API in the following ways:

1. **Streaming Output**: The new API streams the output directly from DocBuilder.toString() without writing to temporary files.
2. **Query Parameter**: Uses 'out' instead of 'format' for specifying the output format.
3. **No File Handling**: Does not create or manage temporary files.
4. **Simplified Response**: Returns the content directly without additional metadata.

## Implementation Details

The new API is implemented using Bun's HTTP server and streaming capabilities. It processes the template using DocBuilder and streams the output directly to the client.

Key components:
- **DocBuilder**: Used to process the template and generate the output.
- **ReadableStream**: Used to stream the output to the client.
- **Bun.serve**: Used to create the HTTP server.

## Running the API

To start the API server:

```bash
bun run src/api/new_api.ts
```

The server will start on port 3001 by default. You can change the port by setting the `PORT` environment variable.
