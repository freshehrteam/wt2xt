import { test, describe, expect, beforeAll, afterAll } from "bun:test";
import app from "../src/api";
import fs from "fs";
import path from "path";

describe("API Tests", () => {
  // Setup and teardown
  beforeAll(async () => {
    // Create tmp directory if it doesn't exist
    const tempDir = path.join(process.cwd(), "tmp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
  });

  afterAll(async () => {
    // Clean up any test files that might have been created
    await app.close();
  });

  describe("POST /convert", () => {
    test("should convert a template to adoc format", async () => {
      // Create a simple template for testing
      const template = {
        "webTemplate": {
          "templateId": "test_template",
          "version": "1.0.0",
          "defaultLanguage": "en",
          "languages": ["en"],
          "tree": {
            "id": "test_composition",
            "name": "Test Composition",
            "localizedName": "Test Composition",
            "rmType": "COMPOSITION",
            "nodeId": "openEHR-EHR-COMPOSITION.test.v1",
            "min": 1,
            "max": 1,
            "localizedNames": {
              "en": "Test Composition"
            },
            "localizedDescriptions": {
              "en": "A test composition for API testing."
            },
            "aqlPath": "",
            "children": []
          }
        }
      };

      // Make the request to the API
      const response = await app.inject({
        method: "POST",
        url: "/convert?format=adoc",
        payload: {
          template: template
        }
      });

      // Verify the response
      expect(response.statusCode).toBe(200);
      expect(response.headers["content-type"]).toContain("text/plain");
      expect(response.headers["content-disposition"]).toContain("attachment; filename=template_");
      expect(response.headers["content-disposition"]).toContain(".adoc");

      // Verify the content (basic check)
      expect(response.body).toBeTruthy();
      expect(response.body.length).toBeGreaterThan(0);
    });

    test("should return 400 if no template is provided", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/convert?format=adoc",
        payload: {}
      });

      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.body)).toHaveProperty("error", "No template provided");
    });

    test("should return 400 if an invalid format is provided", async () => {
      const template = {
        "webTemplate": {
          "templateId": "test_template",
          "tree": {
            "id": "test_composition",
            "rmType": "COMPOSITION"
          }
        }
      };

      const response = await app.inject({
        method: "POST",
        url: "/convert?format=invalid_format",
        payload: {
          template: template
        }
      });

      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.body)).toHaveProperty("error", "Invalid format");
      expect(JSON.parse(response.body)).toHaveProperty("validFormats");
    });

    test("should use adoc as default format if none is provided", async () => {
      const template = {
        "webTemplate": {
          "templateId": "test_template",
          "version": "1.0.0",
          "defaultLanguage": "en",
          "languages": ["en"],
          "tree": {
            "id": "test_composition",
            "name": "Test Composition",
            "rmType": "COMPOSITION",
            "nodeId": "openEHR-EHR-COMPOSITION.test.v1"
          }
        }
      };

      const response = await app.inject({
        method: "POST",
        url: "/convert",
        payload: {
          template: template
        }
      });

      expect(response.statusCode).toBe(200);
      expect(response.headers["content-type"]).toContain("text/plain");
      expect(response.headers["content-disposition"]).toContain(".adoc");
    });

    test("should include file content in JSON response when includeFileContent=true", async () => {
      const template = {
        "webTemplate": {
          "templateId": "test_template",
          "version": "1.0.0",
          "defaultLanguage": "en",
          "languages": ["en"],
          "tree": {
            "id": "test_composition",
            "name": "Test Composition",
            "rmType": "COMPOSITION",
            "nodeId": "openEHR-EHR-COMPOSITION.test.v1",
            "min": 1,
            "max": 1,
            "localizedNames": {
              "en": "Test Composition"
            },
            "localizedDescriptions": {
              "en": "A test composition for API testing."
            },
            "aqlPath": "",
            "children": []
          }
        }
      };

      const response = await app.inject({
        method: "POST",
        url: "/convert?format=adoc&includeFileContent=true",
        payload: {
          template: template
        }
      });

      // Verify the response
      expect(response.statusCode).toBe(200);
      expect(response.headers["content-type"]).toContain("application/json");

      // Parse the response body
      const responseBody = JSON.parse(response.body);

      // Verify the response structure
      expect(responseBody).toHaveProperty("filename");
      expect(responseBody).toHaveProperty("content");
      expect(responseBody).toHaveProperty("format", "adoc");

      // Verify the content is a non-empty base64 string
      expect(responseBody.content).toBeTruthy();
      expect(responseBody.content.length).toBeGreaterThan(0);

      // Verify the filename
      expect(responseBody.filename).toContain("template_");
      expect(responseBody.filename).toContain(".adoc");
    });
  });
});
