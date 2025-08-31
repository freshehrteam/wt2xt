// Simple test script to verify PanDocFormatter changes
import { DocBuilder } from "./src/DocBuilder.js";
import { importConfig } from "./src/BuilderConfig.js";
import { ExportFormat, getOutputBuffer } from "./src/formatters/DocFormatter.js";
import * as fs from 'fs-extra';

// Sample content for testing
const sampleContent = {
  "templateId": "test_template",
  "semVer": "1.0.0",
  "defaultLanguage": "en",
  "tree": {
    "id": "test",
    "name": "Test Template",
    "localizedName": "Test Template",
    "rmType": "COMPOSITION",
    "nodeId": "openEHR-EHR-COMPOSITION.test.v1",
    "localizedDescriptions": {
      "en": "A test template for verifying file cleanup"
    },
    "children": []
  }
};

async function runTest() {
  console.log("Starting test...");

  // Load default config
  const config = await importConfig('./config/wtconfig.json');

  // Test PDF export
  console.log("Testing PDF export...");
  config.exportFormat = ExportFormat.pdf;
  const pdfBuilder = new DocBuilder(sampleContent, config);
  await pdfBuilder.run(true);
  const pdfBuffer = await getOutputBuffer(pdfBuilder);
  console.log(`PDF buffer size: ${pdfBuffer.byteLength} bytes`);

  // Check if temporary files were cleaned up
  const tmpFiles = await fs.readdir('./tmp');
  console.log(`Temporary files after PDF export: ${tmpFiles.length}`);

  // Test DOCX export
  console.log("\nTesting DOCX export...");
  config.exportFormat = ExportFormat.docx;
  const docxBuilder = new DocBuilder(sampleContent, config);
  await docxBuilder.run(true);
  const docxBuffer = await getOutputBuffer(docxBuilder);
  console.log(`DOCX buffer size: ${docxBuffer.byteLength} bytes`);

  // Check if temporary files were cleaned up
  const tmpFilesAfterDocx = await fs.readdir('./tmp');
  console.log(`Temporary files after DOCX export: ${tmpFilesAfterDocx.length}`);

  // Test MD export
  console.log("\nTesting MD export...");
  config.exportFormat = ExportFormat.md;
  const mdBuilder = new DocBuilder(sampleContent, config);
  await mdBuilder.run(true);
  const mdText = await getOutputBuffer(mdBuilder);
  console.log(`MD text length: ${mdText.length} characters`);

  // Check if temporary files were cleaned up
  const tmpFilesAfterMd = await fs.readdir('./tmp');
  console.log(`Temporary files after MD export: ${tmpFilesAfterMd.length}`);

  console.log("\nTest completed!");
}

runTest().catch(console.error);
