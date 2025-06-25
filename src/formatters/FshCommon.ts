import { sushiClient } from 'fsh-sushi';
import { DocBuilder } from '../DocBuilder';

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
        await Bun.write(exportFileName, JSON.stringify(dBuilder.jb,null,2));
        console.log(`\n Exported : ${exportFileName}`)
    },

    saveFile: async (dBuilder: DocBuilder, outFile: any): Promise<number> => {

      appendCodeSystemFSH(dBuilder)
      dBuilder.cb.newline('')
      const exportFileName = `${outFile}.fsh`
      const writeNumber = await Bun.write(exportFileName, dBuilder.toString());
      console.log(`\n Exported : ${exportFileName}`)
      fsh.convertFSH(outFile, exportFileName)
        return writeNumber
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
