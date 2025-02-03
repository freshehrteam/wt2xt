import { sushiClient } from 'fsh-sushi';
import { DocBuilder } from '../DocBuilder';

export const fsh = {

    saveJson: async (dBuilder: DocBuilder, outFile: any): Promise<void> => {

        const exportFileName = `${outFile}.json`
        await Bun.write(exportFileName, JSON.stringify(dBuilder.jb,null,2));
        console.log(`\n Exported : ${exportFileName}`)
    },

    saveFile: async (dBuilder: DocBuilder, outFile: any): Promise<void> => {

      const exportFileName = `${outFile}.fsh`
      await Bun.write(exportFileName, dBuilder.toString());
    console.log(`\n Exported : ${exportFileName}`)
    fsh.convertFSH(outFile, exportFileName)
  },

  convertFSH: (dBuilder: DocBuilder, outFile: any) => {
    const str = dBuilder.toString()
    let exportFileName: string = '';
    sushiClient.fshToFhir(str, {
        //  dependencies: [{ packageId: "hl7.fhir.us.core", version: "4.0.1" }],
        logLevel: "error",
      })
        .then((results) => {
           results.fhir.forEach( async (fhirObject) => {
             const fhirType: string = fhirObject.resourceType;
             const fhirId: string = fhirObject.id;
           exportFileName = `${outFile}-${fhirType}-${fhirId}.json`
          await Bun.write(exportFileName, JSON.stringify(fhirObject));
          console.log(`\n Exported : ${exportFileName}`)
           })// handle results
        })
        .catch((err) => {
          console.log(`Sushi error: ${err}`)// handle thrown errors
        });
  },

}
