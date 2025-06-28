import { sushiClient } from 'fsh-sushi';
import { DocBuilder } from '../DocBuilder';
import * as fs from 'fs-extra';

const appendCodeSystemFSH = ( docBuilder :DocBuilder) => {
   return
    const {cb, codeSystems} = docBuilder;
    for (const cs of codeSystems) {
        cb.newline('')
        cb.append(`CodeSystem: ${cs.id}`);
        cb.append(`Id: ${cs.id}`);
        cb.append( `Title: "${cs.title}"`);
        cb.newline(`* ^url = "${cs.url}"`)
    }
}
export const fsh = {

    saveJson: async (dBuilder: DocBuilder, outFile: any): Promise<void> => {

        const exportFileName = `${outFile}.json`
        await fs.writeFile(exportFileName, JSON.stringify(dBuilder.jb,null,2));
        console.log(`\n Exported : ${exportFileName}`)
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

  convertFSH: (exportFSH: string, outFile: any) => {
    let exportFileName: string = '';

    sushiClient.fshToFhir(exportFSH, {
        fhirVersion: "4.0.1",
        logLevel: "error",
      })
        .then((results) => {
           results.fhir.forEach((fhirObject) => {
             const fhirType: string = fhirObject.resourceType;
             const fhirId: string = fhirObject.id;
             exportFileName = `${outFile}-${fhirType}-${fhirId}.json`
             fs.writeFile(exportFileName, JSON.stringify(fhirObject))
               .then(() => {
                 console.log(`Converted from FSH : ${outFile}-${fhirType}-${fhirId}.json`)
               })
           })// handle results
        })
        .catch((err) => {
          console.log(`Sushi error: ${err}`)// handle thrown errors
        });
  },

}
