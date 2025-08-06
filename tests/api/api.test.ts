import { describe, expect, it, beforeAll, afterAll } from "bun:test";
import { start, close } from "../../src/api/api.ts";
import testTemplate from "../resources/testTemplate.json"

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
  const BASE_URL = `http://localhost:${PORT}/api/v1`;

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
    // Load a sample template from the test resource
    // Test with the default output format (adoc)
    const response = await fetch(`${BASE_URL}/convert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testTemplate)
    });

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toContain('text/plain');

    const text = await response.text();
    expect(text).toBeTruthy();
  });

  it("should return error for invalid format", async () => {
    // Create a minimal template for testing

    // Test with invalid output format
    const response = await fetch(`${BASE_URL}/convert?out=invalid_format`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testTemplate)
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


it("should return matching .adoc output", async () => {
    // Test with invalid JSON
    const adocOutput = await Bun.file('./tests/resources/testTemplate.adoc').text();
    const response = await fetch(`${BASE_URL}/convert`, {
        method: 'POST',

        headers: {
            'Content-Type': 'application/json',
            accept: 'text/plain',
        },
        body: JSON.stringify(testTemplate)
    });

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toContain('text/plain');
    const textData = await response.text();
    expect(textData).toBe(adocOutput);
    console.log(textData)
});
});
