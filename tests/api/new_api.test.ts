import { describe, expect, it, beforeAll, afterAll } from "bun:test";
import { start, close } from "../../src/api/new_api";
import fs from 'fs';
import path from 'path';

// Define interface for error response
interface ErrorResponse {
  error: string;
  validFormats?: string[];
  details?: string;
}

describe("new_api", () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let server: Bun.Serve | null = null;
  const PORT = 3001;
  const BASE_URL = `http://localhost:${PORT}`;

  // Start the server before all tests
  beforeAll(async () => {
    server = await start();
  });

  // Close the server after all tests
  afterAll(async () => {
    await close();
  });

  it("should return 404 for non-existent routes", async () => {
    const response = await fetch(`${BASE_URL}/nonexistent`);
    expect(response.status).toBe(404);
  });

  it("should return 404 for GET requests to /convert", async () => {
    const response = await fetch(`${BASE_URL}/convert`);
    expect(response.status).toBe(404);
  });

  it("should handle POST requests to /convert with valid JSON", async () => {
    // Load a sample template from the test resources
    const sampleTemplatePath = path.join(process.cwd(), 'tests', 'resources', 'sample_template.json');
    let sampleTemplate;

    // If the sample template doesn't exist, create a minimal one for testing
    if (!fs.existsSync(sampleTemplatePath)) {
      sampleTemplate = {
        "templateId": "test_template",
        "version": "1.0.0",
        "defaultLanguage": "en",
        "tree": {
          "id": "test",
          "name": "Test Template",
          "localizedName": "Test Template",
          "rmType": "COMPOSITION",
          "nodeId": "openEHR-EHR-COMPOSITION.test.v1",
          "min": 1,
          "max": 1,
          "children": []
        }
      };
    } else {
      sampleTemplate = JSON.parse(fs.readFileSync(sampleTemplatePath, 'utf8'));
    }

    // Test with default output format (adoc)
    const response = await fetch(`${BASE_URL}/convert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sampleTemplate)
    });

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toContain('text/plain');

    const text = await response.text();
    expect(text).toBeTruthy();
  });

  it("should handle POST requests with 'out' parameter", async () => {
    // Create a minimal template for testing
    const sampleTemplate = {
      "templateId": "test_template",
      "version": "1.0.0",
      "defaultLanguage": "en",
      "tree": {
        "id": "test",
        "name": "Test Template",
        "localizedName": "Test Template",
        "rmType": "COMPOSITION",
        "nodeId": "openEHR-EHR-COMPOSITION.test.v1",
        "min": 1,
        "max": 1,
        "children": []
      }
    };

    // Test with 'adoc' output format
    const response = await fetch(`${BASE_URL}/convert?out=adoc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sampleTemplate)
    });

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toContain('text/plain');

    const text = await response.text();
    expect(text).toBeTruthy();
  });

  it("should return error for invalid format", async () => {
    // Create a minimal template for testing
    const sampleTemplate = {
      "templateId": "test_template",
      "version": "1.0.0",
      "defaultLanguage": "en",
      "tree": {
        "id": "test",
        "name": "Test Template",
        "localizedName": "Test Template",
        "rmType": "COMPOSITION",
        "nodeId": "openEHR-EHR-COMPOSITION.test.v1",
        "min": 1,
        "max": 1,
        "children": []
      }
    };

    // Test with invalid output format
    const response = await fetch(`${BASE_URL}/convert?out=invalid_format`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sampleTemplate)
    });

    expect(response.status).toBe(400);
    const data = await response.json() as ErrorResponse;
    expect(data.error).toBe('Invalid format');
    expect(data.validFormats).toBeTruthy();
  });

  it("should return error for invalid JSON", async () => {
    // Test with invalid JSON
    const response = await fetch(`${BASE_URL}/convert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: '{ invalid json }'
    });

    expect(response.status).toBe(400);
    const data = await response.json() as ErrorResponse;
    expect(data.error).toBe('Invalid request body');
  });
});
