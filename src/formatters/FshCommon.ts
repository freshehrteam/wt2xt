import { sushiClient } from 'fsh-sushi';
import { DocBuilder } from '../DocBuilder';
import {appendCodeSystemFSH} from "./FshTerminologyFormatter.ts";
import {OutputBufferType, saveOutputArray} from "./DocFormatter.ts";

const buildFSHString = (docBuilder:DocBuilder) : string => {
    appendCodeSystemFSH(docBuilder)
    docBuilder.cb.newline('')
    return docBuilder.toString()
}

const convertFSHtoJson = async (exportFSH: string): Promise<OutputBufferType> => {
    try {
        // Create a single ZIP containing all FHIR JSON files
        const {default: JSZip} = await import('jszip')
        const zip = new JSZip()

        zip.file('fsh.fsh', exportFSH)

        const results = await sushiClient.fshToFhir(exportFSH, {
            fhirVersion: "4.0.1",
            logLevel: "error",
        })

        results.fhir.forEach((fhirObject: any) => {
            const fhirType: string = fhirObject.resourceType || 'Resource'
            const fhirId: string = fhirObject.id || Math.random().toString(36).slice(2)
            const filename = `${fhirType}-${fhirId}.json`
            zip.file(filename, JSON.stringify(fhirObject, null, 2))
        })

        return await zip.generateAsync({type: 'arraybuffer'})

    } catch (err) {
        console.log(`Sushi error: ${err}`)
        // Return an empty ArrayBuffer to satisfy OutputBufferType on error
        return new ArrayBuffer(0)
    }
}

export const fsh = {

    getOutputBuffer: async (docBuilder: DocBuilder): Promise<OutputBufferType> => {
        return buildFSHString(docBuilder)
    },
    saveFile: async (docBuilder: DocBuilder, outFile: string, useStdout: boolean) => {
        // Ensure the directory exists
        const outputBuffer: OutputBufferType = await fsh.getOutputBuffer(docBuilder)
        return saveOutputArray(outputBuffer, outFile, useStdout);
    },
}

export const fhirl = {

    getOutputBuffer: async (docBuilder: DocBuilder): Promise<OutputBufferType> => {
        const fshString = buildFSHString(docBuilder)
            return convertFSHtoJson(fshString)
    }
}
