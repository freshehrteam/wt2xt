import { sushiClient } from 'fsh-sushi';
import { DocBuilder } from '../DocBuilder';
import * as fs from 'fs-extra';
import {appendCodeSystemFSH} from "./FshTerminologyFormatter.ts";
import {OutputBufferType} from "./DocFormatter.ts";

export const fsh = {

    getOutputBuffer: async (docBuilder: DocBuilder): Promise<OutputBufferType> => {
        appendCodeSystemFSH(docBuilder)
        docBuilder.cb.newline('')
        return docBuilder.toString()
    },

    saveFile: async (dBuilder: DocBuilder, outFile: any): Promise<number> => {

      appendCodeSystemFSH(dBuilder)
      dBuilder.cb.newline('')
      const exportFileName = `${outFile}.fsh`
      const exportFSH = dBuilder.toString()
      await fs.writeFile(exportFileName, exportFSH);
      console.log(`\nExported : ${exportFileName}`)
      fsh.convertFSH(exportFSH, exportFileName)
      // Return the length of the written data as an approximation of bytes written
      return Buffer.from(exportFSH).length;
  },

  convertFSH: async (exportFSH: string, outFile: any) => {
    try {
      const results = await sushiClient.fshToFhir(exportFSH, {
        fhirVersion: "4.0.1",
        logLevel: "error",
      })

      // Create a single ZIP containing all FHIR JSON files
      const { default: JSZip } = await import('jszip')
      const zip = new JSZip()

      results.fhir.forEach((fhirObject: any) => {
        const fhirType: string = fhirObject.resourceType || 'Resource'
        const fhirId: string = fhirObject.id || Math.random().toString(36).slice(2)
        const filename = `${fhirType}-${fhirId}.json`
        zip.file(filename, JSON.stringify(fhirObject, null, 2))
      })

      const zipBuffer: Uint8Array = await zip.generateAsync({ type: 'uint8array' })
      const zipFileName = `${outFile}.zip`
      await fs.writeFile(zipFileName, zipBuffer)
      console.log(`Converted from FSH (zipped): ${zipFileName}`)
    } catch (err) {
      console.log(`Sushi error: ${err}`)
    }
  },

}
