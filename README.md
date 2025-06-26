# wt2xt

App to convert openEHR 'web templates' to Asciidoc, Xmind and other output formats.

## Purpose 
Documentation for clinical applications should be written and maintained in one single truth. 
The openEHR web template is such a resource. This project generates asciidoc files and other exports for a given template. 

## Usage 
```
❯ wt2xt
Options:
    --help                  Show help                             [boolean]
    --version               Show version number                   [boolean]
    --web-template, -wt     Source web template                   [string] [required]
    --out-file,     -o                                            [string]
    --export-format, -ex    Export format (default:adoc)          [string] adoc|xmind|docx|pdf|fshl
    -- config-file,  -cfg    default: "config/wtconfig.json"       [string]

 ``` 

## Export formats

- `adoc`: Asciidoc
- `xmind` : Xmind mindmap
- `docx` : Word document (see dependencies below)
- `pdf` : PDF document (see dependencies below)
- `fshl` : FHIR Logical model (creates FSH + )
- 
## Export format dependencies 

- **Adoc** (asciidoc) and **Xmind** are supported natively.


- **Docx** requires a local install of [Pandoc](https://pandoc.org/installing.html)


- **PDF** requires local install of [Pandoc](https://pandoc.org/installing.html) and [BasicTex](https://www.neelsomani.com/blog/get-mactex-faster-easily-using-basictex.php) - for macOS.


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
}
```



## Docker Usage

This application can be run using Docker, which eliminates the need to install dependencies locally. The Docker image includes Pandoc and TeX Live (BasicTex equivalent for Linux), so you can generate DOCX and PDF formats without installing these dependencies on your local machine.

The Dockerfile also includes the Pandoc and BasicTex dependencies

### Building the Docker Image

```bash
docker build -t wt2docbx .
```

### Running with Docker

```bash
docker run -v $(pwd)/templates:/app/templates -v $(pwd)/out:/app/out -v $(pwd)/config:/app/config wt2docbx --web-template=./templates/example.json --export-format=adoc
```

### Using Docker Compose

1. Build and run the application:

```bash
docker-compose run wt2docbx --web-template=./templates/example.json --export-format=adoc
```

2. Or, modify the `command` in `docker-compose.yml` and run:

```bash
docker-compose up
```

The Docker setup mounts the following directories as volumes:
- `./templates`: Input templates directory
- `./out`: Output directory
- `./config`: Configuration directory

This allows you to work with files on your local machine while running the application in a container.
