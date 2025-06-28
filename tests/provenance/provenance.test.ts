import { DocBuilder } from '../../src/DocBuilder';
import fs from 'node:fs';
import { Config, importConfig } from '../../src/BuilderConfig';
import { fetchADArchetype } from '../../src/provenance/openEProvenance';
import {describe, test, expect, beforeAll} from "@jest/globals";

let builder: DocBuilder;

beforeAll(() => {
  // This will run once before all tests.
  const config:Config = importConfig('')
  const inDoc:string = fs.readFileSync('tests/resources/wt.json', { encoding: 'utf8', flag: 'r' });
  builder  = new DocBuilder(JSON.parse(inDoc), config)

});

describe('Provenance  tests', () => {


  test('Should fetch archetype original namespace', async() => {
    await fetchADArchetype('openEHR-EHR-ADMIN_ENTRY.visual_certification_uk.v0', builder.config.ADUsername, builder.config.ADPassword, builder.config.ADRepositoryId,"")
      .then(data => {
       expect(data.description.otherDetails.original_namespace). toBe('uk-com.freshehr')
      })
      .catch((error) => {
        console.error("Error:", error)
      } )
  });


});
