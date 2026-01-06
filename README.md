# wt2xt

App to convert openEHR 'web templates' to Asciidoc, Xmind and other output formats.

## Purpose 
Documentation for clinical applications should be written and maintained in one single truth. 
The openEHR web template is such a resource. This project generates asciidoc files and other exports for a given template. 

## Installation


This application should be run using [Bun](https://bun.sh/), a fast JavaScript runtime and package manager.

1. Install Bun:
```bash
curl -fsSL https://bun.sh/install | bash
```

2. Install dependencies:
```bash
bun install
```

3. Build the application:
```bash
bun run build
```


## CLI Usage 
```
❯ wt2xt
Options:
    --help                  Show help                              [boolean]
    --version               Show version number                    [boolean]
    --web-template, -wt     Source web template                    [string] [required]
    --out-file,     -o       THe output file (default:import filename [string]
    --export-format, -ex    Export format (default:adoc)           [string] adoc|xmind|docx|pdf|fshl|fhirl|html|csv
    -- config-file,  -cfg    default: "config/wtconfig.json"           [string]

 ``` 

### Running with Bun

```bash
bun run start -- --web-template=./templates/example.json
```

Or for development:

```bash
bun run dev -- --web-template=./templates/example.json
```

## Export formats

- `adoc`  : Asciidoc
- `xmind` : Xmind mindmap
- `docx`  : Word document (see dependencies below)
- `pdf`   : PDF document (see dependencies below)
- `md`    : Markdown document (see dependencies below)
- `fshl`  : FHIR Logical model (FSH + FHIR datatypes)
- `fhirl` : FHIR Logical model (Zipped JSON + FHIR datatypes)
- `html`  : HTML document (see dependencies below)
- `csv`   : CSV document


## Export format dependencies 

- **Adoc** (asciidoc), **Xmind**, **HTML** and **CSV** are supported natively.

- **Docx** **PDF** and **MD** require a local install of Pandoc Latex or will load a Pandoc/latex Docker image if running in a Docker container.

- **MD** includes embedded HTML to recreate the more complex ASCIIDoc tables 

## Configuration

The default configuration is

```
{
  //Display occurences as e.g. [1..1] rather than 'mandatory'
  "displayTechnicalOccurrences": false,

  //Hide atCodes and Rm attribute ids
  "hideNodeIds": true,

  // Skip specific AQL paths
  "skippedAQLPaths": [],

  //Include specifc annotations
  "includedAnnotations": [],

  //Exclude theese specific RM attribute tags
  "excludedRMTags": ["territory","language", "encoding","subject"],

  // Optionsal top level title to replace the template root name
  "title": "",

  // Display the AQL paths of eacNode instead of a Description
  "displayAQLPaths": false,

  //Display a Table of contents
   "displayToc": false,
  
  // Return 
}
```

## Annotations

These Template annotations are recognised by the CSV export

- `vset_description` : Human readable external Valueset description 
- `mapTargetName` : Name of the equivalent node in the mapping target 
- `mapTargetConstraints` : Constraints on the target node 
- `mapTargetNotes`: Notes on the mapping 
- `conceptMapUrl`: Url of any related FHIR concept map 
- `mapTargetFhirPath`: The FHIR path to the mapping target node 

## API Usage

The application now provides an API endpoint that allows you to convert templates programmatically.

### Starting the API Server

```bash
# Using Bun
bun run api

# Using Bun with auto-reload for development
bun run api:dev
```

### API Endpoints

#### POST /convert

Converts a JSON template to the specified format.

**Query Parameters:**
- `exportAs` (optional): The output format (adoc, docx, pdf, fshl, fhirl, xmind, md, html, csv). Default: adoc

**Request Body:**
- `body`: A JSON web-template or a JSON object containing the JSON template, and an optional config document

**Response:**
- An object containing the exported file content

**Example using curl:**

```bash
# Example 1: Download the file directly
curl -X POST \
  "http://localhost:3000/convert?exportAs=adoc" \
  -H "Content-Type: application/json" \
  -d '{"template": {...}}' \


```
```bash
# Example 2
curl -X POST \
"http://localhost:3000/convert?exportAs=fhirl" \
-H "Content-Type: application/json" \
-d '{"template": {...}}' \


```

**Example using JavaScript fetch:**

```javascript
// Example 1: Download the file directly
const response = await fetch('http://localhost:3000/convert?format=pdf', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    template: {...} // Your JSON template
  }),
});

if (response.ok) {
  const blob = await response.blob();
  // Save or display the file
}

// Example 2: Get the file content in JSON response
const jsonResponse = await fetch('http://localhost:3000/convert?format=pdf&includeFileContent=true', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    template: {...} // Your JSON template
  }),
});

if (jsonResponse.ok) {
  const data = await jsonResponse.json();
  // data contains: { filename, format, content }
  // content is base64-encoded file content

  // To convert base64 to a Blob:
  const binaryString = atob(data.content);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  const blob = new Blob([bytes], { type: getContentType(data.format) });

  // Now you can use the blob
}

// Helper function to get content type based on format
function getContentType(format) {
  switch (format) {
    case 'adoc': return 'text/plain';
    case 'docx': return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    case 'pdf': return 'application/pdf';
    case 'fshl': case 'fsht': case 'fshq': return 'text/plain';
    case 'xmind': return 'application/octet-stream';
    default: return 'text/plain';
  }
}
```

## Docker Usage

This application can be run using Docker, which eliminates the need to install dependencies locally. The Docker image is now based on Bun instead of Node.js for improved performance. It includes Pandoc and TeX Live (BasicTex equivalent for Linux), so you can generate DOCX and PDF formats without installing these dependencies on your local machine.

### Building the Docker Image

```bash
docker build -t wt2xt .
```

### Running with Docker

```bash
docker run -v $(pwd)/templates:/app/templates -v $(pwd)/out:/app/out -v $(pwd)/tmp:/app/tmp -v $(pwd)/config:/app/config wt2xt --web-template=./templates/example.json --export-format=adoc
```

### Using Docker Compose

#### Running the API Server

The docker-compose.yml file is configured to run the API server by default:

```bash
docker-compose up
```

This will start the API server on port 3000, which you can access at http://localhost:3000.


## Authentication

Basic authentication can be enabled for the API using environment variables. When not set, authentication is disabled (useful for local development and existing tests).

- API_USER: Username required for Basic Auth
- API_PASS: Password required for Basic Auth
- PORT (optional): Port to run the API server on (default 3000)

You can provide these via a .env file in the project root (copy .env.example to .env):

```
# .env
API_USER=youruser
API_PASS=yourpass
# PORT=3000
```

- Bun automatically loads .env files when running locally with `bun run`.
- Docker Compose now includes `env_file: .env`, so variables in your local .env are passed to the container.

When both API_USER and API_PASS are set, the following endpoints require authentication:
- POST /api/v1/convert
- GET /api/v1/config
- POST /api/v1/config

The health endpoint remains public:
- GET /api/v1/heartbeat → 204

Example usage with curl when auth is enabled:

```bash
curl -u "$API_USER:$API_PASS" \
  -X POST "http://localhost:3000/api/v1/convert?exportAs=adoc" \
  -H "Content-Type: application/json" \
  -d @./templates/example.json
```

Docker Compose: create a `.env` file in the project root and run:

```bash
docker-compose up
```
