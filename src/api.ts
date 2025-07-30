import fastify from 'fastify';
import { FastifyRequest, FastifyReply } from 'fastify';
import * as fs from 'fs';
import path from 'path';
import { DocBuilder } from './DocBuilder';
import { Config, importConfig } from './BuilderConfig';
import { ExportFormat } from './formatters/DocFormatter';
import cors from '@fastify/cors';
import {WebTemplate} from "./types/WebTemplate.ts";
//import {ResolveRequestBody} from "fastify/types/type-provider";

// Create Fastify app
const app = fastify({
  logger: true,
  bodyLimit: 50 * 1024 * 1024 // 50MB
});

// Register CORS plugin
app.register(cors);

const PORT = process.env['PORT'] || 3000;

// POST endpoint to convert template
app.post<{
  Querystring: { format?: string, includeFileContent?: string },
  Body: { template: { webTemplate: WebTemplate } }
}>('/convert', async (req: FastifyRequest<{
  Querystring: { format?: string, includeFileContent?: string },
  Body: { template: { webTemplate: WebTemplate } }
}>, reply: FastifyReply) => {
  try {
    // Get the template from the request body
    if (!req.body.template || !req.body.template.webTemplate) {
      return reply.code(400).send({ error: 'No template provided' });
    }
    const template: WebTemplate = req.body.template.webTemplate;
    console.log ('body', req.body)

    // Get the output format from query parameters
    const formatParam = req.query.format || 'adoc';
    const exportFormatKey = formatParam as keyof typeof ExportFormat;

    if (!Object.keys(ExportFormat).includes(exportFormatKey)) {
      return reply.code(400).send({
        error: 'Invalid format',
        validFormats: Object.keys(ExportFormat)
      });
    }

    // Create a temporary directory for output if it doesn't exist
    const tempDir = path.join(process.cwd(), 'tmp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Generate a unique filename
    const timestamp = Date.now();
    const tempFilename = `template_${timestamp}`;
    const outputFilename = `${tempFilename}.${formatParam}`;
    const outputPath = path.join(tempDir, outputFilename);

    // Load default config
    const config: Config = importConfig('./config/wtconfig.json');

    // Override config with our settings
    config.exportFormat = ExportFormat[exportFormatKey];
    config.outFileDir = tempDir;
    config.outFilePath = outputPath;

    // Create DocBuilder and process the template
    const docBuilder = new DocBuilder(template, config);
    docBuilder.run();

    // Check if the file was created
  //  if (!fs.existsSync(outputPath)) {
  //    return reply.code(500).send({ error: 'Failed to generate output file' });
  //  }

    // Read the generated file
    const fileContent = fs.readFileSync(outputPath);

    // Check if the client wants the file content in the JSON response
    const includeFileContent = req.query.includeFileContent === 'true';

    if (includeFileContent) {
      // Include the file content in the JSON response
      const response = {
        filename: outputFilename,
        content: fileContent.toString('base64'),
        format: formatParam
      };

      reply.header('Content-Type', 'application/json');
      reply.send(response);
    } else {
      // Set appropriate content type based on format
      let contentType = 'text/plain';
      switch (formatParam) {
        case 'adoc':
          contentType = 'text/plain';
          break;
        case 'docx':
          contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
          break;
        case 'pdf':
          contentType = 'application/pdf';
          break;
        case 'fshl':
        case 'fsht':
        case 'fshq':
          contentType = 'text/plain';
          break;
        case 'xmind':
          contentType = 'application/octet-stream';
          break;
      }

      // Send the file as response
      reply.header('Content-Type', contentType);
      reply.header('Content-Disposition', `attachment; filename=${outputFilename}`);
      reply.send(fileContent);
    }

    // Clean up the temporary file
    fs.unlinkSync(outputPath);
  } catch (error) {
    console.error('Error processing template:', error);
    reply.code(500).send({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
});

// Start the server
const start = async () => {
  try {
    await app.listen({ port: Number(PORT), host: '0.0.0.0' });
    console.log(`API server running on port ${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

// Start the server if this file is run directly
if (require.main === module) {
  start().then();
}

export default app;
export { start };
