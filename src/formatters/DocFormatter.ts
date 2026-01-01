import { DocBuilder } from "../DocBuilder";
import  {adoc }from "./AdocFormatter"
import {xmind } from "./XmindFormatter"
import { TemplateNode } from "../types/TemplateNodes";
import { formatOccurrences } from "../types/TemplateTypes";
import {docx, html, md, pdf} from "./PanDocFormatter";
import { csv} from './CsvFormatter';
import { fshl} from './FshLogicalModelFormatter';

import { fshq } from './QuestionnaireFormatter.ts';
import {fsh,fhirl} from'./FshCommon.ts'
import * as fs from "fs-extra";
import path  from "path";


export enum ExportFormat {
  adoc = 'adoc',
  xmind = 'xmind',
  docx = 'docx',
  md = 'md',
  pdf = 'pdf',
  fshl  = 'fshl',
  fhirl = 'fhirl',
  fsht = 'fsht',
  fshq = 'fshq',
  html = 'html',
  csv = 'csv'
}

export type OutputBufferType = ArrayBufferLike|string;

type FormatHeaderFn = (db: DocBuilder) => void ;
type SaveFileFn = (db: DocBuilder, outFile: string, apiMode:boolean) =>  Promise<number|void>;
type GetOutPutBufferFn = (db: DocBuilder) =>  Promise<ArrayBufferLike|string|void>;
type FormatCompositionHeaderFn = (dBuilder: DocBuilder, f: TemplateNode) => void;
export type FormatElementFn  = (docBuilder: DocBuilder, f: TemplateNode) => void;
type FormatNodeContentFn = (dBuilder: DocBuilder, f: TemplateNode, isChoice: boolean) => void;

export const formatTemplateHeader = (docBuilder: DocBuilder): void => {

   let fn: (dBuilder: DocBuilder) => void = () => {};
   switch (docBuilder.config.exportFormat){
    case ExportFormat.xmind:
      fn= xmind.formatHeader
      break;
     case ExportFormat.fshl:
         case ExportFormat.fhirl:
       break;
     case ExportFormat.fshq:
       fn = fshq.formatTemplateHeader
       break;
       case ExportFormat.csv:
           fn = csv.formatTemplateHeader
           break;

       default:
        fn= adoc.formatTemplateHeader
       break;
   }

  if(fn)
    fn(docBuilder);
 }

export const formatCompositionHeader = (docBuilder: DocBuilder, f: TemplateNode): void => {

  let fn: FormatCompositionHeaderFn|null = null;

  switch (docBuilder.config.exportFormat) {
    case ExportFormat.xmind:
      fn = xmind.formatCompositionHeader
      break;
    case ExportFormat.fshl:
      case ExportFormat.fhirl:
          fn = fshl.formatCompositionHeader
          break;
      case ExportFormat.fshq:
      fn = fshq.formatCompositionHeader
      break;
      case ExportFormat.csv:
          break;

    default:
      fn = adoc.formatCompositionHeader
      break;
  }

  if (fn)
    fn(docBuilder, f);
}

export const formatProvenanceTable = (docBuilder: DocBuilder) => {

  let fn: FormatHeaderFn = () => {};

  switch (docBuilder.config.exportFormat) {
    case ExportFormat.docx:
    case ExportFormat.pdf:
    case ExportFormat.adoc:
    case ExportFormat.html:
          fn = adoc.formatProvenanceTable
      break;
    case ExportFormat.xmind:
      break;
    case ExportFormat.fshl:
    case ExportFormat.fshq:
      case ExportFormat.fhirl:
      break;
      case ExportFormat.csv:
          break;
  }

  if (fn)
      fn(docBuilder);

}

export const formatChoiceHeader = (docBuilder: DocBuilder, f: TemplateNode): void => {

  let fn: FormatElementFn|null = null

  switch (docBuilder.config.exportFormat) {
    case ExportFormat.xmind:
      fn = xmind.formatChoiceHeader
      break;
    case ExportFormat.fshl:
      case ExportFormat.fhirl:
      fn = fshl.formatChoiceHeader
      break;
    case ExportFormat.fshq:
      fn = fshq.formatChoiceHeader
      break;
      case ExportFormat.csv:
          break;

    default:
      fn = adoc.formatChoiceHeader
      break;
  }

  if (fn)
    fn(docBuilder, f);
}

export const formatNodeHeader = (docBuilder: DocBuilder): void => {

  let fn: FormatHeaderFn = () => {};

  switch (docBuilder.config.exportFormat) {
    case ExportFormat.xmind:
      break;
    case ExportFormat.fshl:
      case ExportFormat.fhirl:
    case ExportFormat.fshq:
      break;
      case ExportFormat.csv:
          break;
    default:
      fn = adoc.formatNodeHeader
      break;
  }

  if (fn)
    fn(docBuilder);
}

export const formatNodeFooter = (docBuilder: DocBuilder, f: TemplateNode): void => {

  let fn: FormatElementFn = () => {};

  switch (docBuilder.config.exportFormat) {
    case ExportFormat.xmind:
    case ExportFormat.fshl:
      case ExportFormat.fhirl:
    case ExportFormat.fshq:
      break;
      case ExportFormat.csv:
          break;
    default:
      fn = adoc.formatNodeFooter
      break;
  }

  if (fn)
    fn(docBuilder, f);
}

export const formatCompositionContextHeader = (docBuilder: DocBuilder, f: TemplateNode): void => {

  let fn: FormatElementFn|null = null;

  switch (docBuilder.config.exportFormat) {
    case ExportFormat.xmind:
      fn = xmind.formatCompositionContextHeader
      break;
    case ExportFormat.fshl:
      case ExportFormat.fhirl:
      fn = fshl.formatCompositionContextHeader
      break;
      case ExportFormat.fshq:
      fn = fshq.formatCompositionContextHeader
      break;
      case ExportFormat.csv:
          break;
    default:
      fn = adoc.formatCompositionContextHeader
      break;
  }

  if (fn)
    fn(docBuilder, f);
}

export const formatEntryHeader = (docBuilder: DocBuilder, f: TemplateNode): void => {
  let fn: FormatElementFn|null = null;

  switch (docBuilder.config.exportFormat) {
    case ExportFormat.xmind:
      fn = xmind.formatLeafHeader
      break;
    case ExportFormat.fshl:
      case ExportFormat.fhirl:
      fn = fshl.formatEntryHeader;
      break;
      case ExportFormat.fshq:
      fn = fshq.formatEntryHeader;
      break;
      case ExportFormat.csv:
          fn = csv.formatEntryHeader;
          break;
    default:
      fn = adoc.formatLeafHeader
      break;
  }

  if (fn)
    fn(docBuilder, f);
}

export const formatLeafHeader = (docBuilder: DocBuilder, f: TemplateNode): void => {
  let fn: FormatElementFn|null = null;

  switch (docBuilder.config.exportFormat) {
    case ExportFormat.xmind:
      fn = xmind.formatLeafHeader
      break;
      case ExportFormat.fshl:
      case ExportFormat.fhirl:
        fn = fshl.formatLeafHeader;
        break;
        case ExportFormat.fshq:
        fn = fshq.formatLeafHeader;
        break;
      case ExportFormat.csv:
          fn = csv.formatLeafHeader;
          break;
    default:
        fn = adoc.formatLeafHeader
        break;
    }

  if (fn)
    fn(docBuilder, f);
}

export const formatObservationEvent = (docBuilder: DocBuilder, f: TemplateNode): void => {
  let fn: FormatElementFn|null = null;

  switch (docBuilder.config.exportFormat) {
    case ExportFormat.xmind:
      fn = xmind.formatObservationEvent
      break;
    case ExportFormat.fshl:
      case ExportFormat.fhirl:
      fn = fshl.formatObservationEvent
      break;
    case ExportFormat.fshq:
      fn = fshq.formatObservationEvent
      break;
      case ExportFormat.csv:
          break;
    default:
      fn = adoc.formatObservationEvent
      break;
  }

  if (fn)
    fn(docBuilder, f);
}

export const formatInstructionActivity = (docBuilder: DocBuilder, f: TemplateNode): void => {
  let fn: FormatElementFn = () => {};

  switch (docBuilder.config.exportFormat) {
    case ExportFormat.xmind:
    case ExportFormat.fshl:
      case ExportFormat.fhirl:
    case ExportFormat.fshq:
      break;
      case ExportFormat.csv:
          break;
    default:
      fn = adoc.formatInstructionActivity
      break;
  }

  if (fn)
    fn(docBuilder, f);
}

export const formatCluster = (docBuilder: DocBuilder, f: TemplateNode): void => {
  let fn: FormatElementFn|null = null;

  switch (docBuilder.config.exportFormat) {
    case ExportFormat.xmind:
        fn = xmind.formatCluster
        break;
      case ExportFormat.fshl:
      case ExportFormat.fhirl:
      fn = fshl.formatCluster
      break;
      case ExportFormat.fshq:
      fn = fshq.formatCluster
      break;
      case ExportFormat.csv:
          fn = csv.formatCluster
          break
    default:
      fn = adoc.formatCluster
      break;
  }

  if (fn)
    fn(docBuilder, f);
}


function createFileLink(absolutePath: string): string {
    const fileUrl = `file://${encodeURI(absolutePath)}`;
    // ANSI hyperlink with fallback to plain file:// URL
    return `\x1b]8;;${fileUrl}\x1b\\${absolutePath}\x1b]8;;\x1b\\ (${fileUrl})`;
}

export const saveOutputArray = async (outputBuffer:ArrayBufferLike|string, outFile: string,  useStdout:boolean) => {

//    console.log('outfile', outFile)
    if (useStdout)
        await Bun.write(Bun.stdout, outputBuffer);
    else
    {
        await fs.ensureDir(path.dirname(outFile));
        await Bun.write(outFile, outputBuffer);
// Usage:
        console.log(`\n Exported: ${createFileLink(path.resolve(outFile))}`);
//        console.log(`\n Exported : ${outFile}`);
    }
    // Return the length of the written data as an approximation of bytes written
    if (typeof(outputBuffer) === 'string')
        return outputBuffer.length
    else
        return outputBuffer.byteLength
}

export const getOutputBuffer = async (docBuilder: DocBuilder) : Promise<ArrayBufferLike |string |void> => {
    let fn: GetOutPutBufferFn;

    const exportFormat= docBuilder.config.exportFormat
//console.log('getOutputbuffer: ', docBuilder.config.exportFormat);
    switch (exportFormat) {
        case ExportFormat.xmind:
            fn = adoc.getOutputBuffer;
            break
        case ExportFormat.fhirl:
            fn = fhirl.getOutputBuffer
            break;
        case ExportFormat.fshq:
            fn = adoc.getOutputBuffer
            break;
        case ExportFormat.docx:
            fn = docx.getOutputBuffer
            break;
        case ExportFormat.md:
            fn = md.getOutputBuffer
            break;
        case ExportFormat.pdf:
            fn = pdf.getOutputBuffer
            break;
        case ExportFormat.html:
            fn = html.getOutputBuffer
            break;

        case ExportFormat.csv:
            fn = adoc.getOutputBuffer
            break;

        default:
            fn = adoc.getOutputBuffer
            break
    }
    if (fn)
        return await fn(docBuilder)
    else
        return
}
export const saveFile  = async (docBuilder: DocBuilder, outFile: string, useStdOut :boolean): Promise<number|void> => {
    let fn: SaveFileFn;

    switch (docBuilder.config.exportFormat) {
        case ExportFormat.xmind:
            fn = xmind.saveFile;
            break
        case ExportFormat.fsht:
        case ExportFormat.fshl:
        case ExportFormat.fhirl:
            fn = fsh.saveFile
            break;
        case ExportFormat.fshq:
            fn = fsh.saveFile
            break;

        case ExportFormat.md:
            fn = md.saveFile
            break;

        case ExportFormat.docx:
            fn = docx.saveFile
            break;
        case ExportFormat.pdf:
            fn = pdf.saveFile
            break;
        case ExportFormat.html:
            fn = html.saveFile
            break;
        case ExportFormat.csv:
            fn = adoc.saveFile
            break;

        default:
            fn = adoc.saveFile
            break
    }
    if (fn)
        await fn(docBuilder,outFile,useStdOut)
}

export const formatNodeContent= (dBuilder: DocBuilder, f: TemplateNode, isChoice: boolean) => {
  let fn: FormatNodeContentFn;

  switch (dBuilder.config.exportFormat) {
    case ExportFormat.xmind:
      fn = xmind.formatNodeContent
      break;
    case ExportFormat.fshl:
      case ExportFormat.fhirl:
      fn = fshl.formatNodeContent
      break
    case ExportFormat.fshq:
      fn = fshq.formatNodeContent
      break
      case ExportFormat.csv:
          fn = csv.formatNodeContent
          break;
    default:
      fn = adoc.formatNodeContent
      break
  }

  if (fn)
    fn(dBuilder, f, isChoice)
}

export const formatAnnotations= (dBuilder: DocBuilder, f: TemplateNode) =>{
  let fn: FormatElementFn = () => {};

  switch (dBuilder.config.exportFormat) {
    case ExportFormat.fshl:
      case ExportFormat.fhirl:
    case ExportFormat.fshq:
      break;
    case ExportFormat.xmind:
      case ExportFormat.csv:
          break;
    default:
      fn = adoc.formatAnnotations
      break
  }

  if (fn)
    fn(dBuilder, f)
}

export const formatUnsupported= (dBuilder: DocBuilder, f: TemplateNode) =>{
  let fn: FormatElementFn = () => {};

  switch (dBuilder.config.exportFormat) {
    case ExportFormat.xmind:
    case ExportFormat.fshl:
      case ExportFormat.fhirl:
    case ExportFormat.fshq:
     break;
      case ExportFormat.csv:
          break;

      default:
      fn = adoc.formatUnsupported
      break
  }

  if (fn)
    fn(dBuilder, f)
}

export const formatOccurrencesText= (dBuilder: DocBuilder, f: TemplateNode) => {
  const occurrencesText = formatRawOccurrencesText(dBuilder,f);
  return occurrencesText ? `**${occurrencesText}**` : ``;
}

export const formatRawOccurrencesText= (dBuilder: DocBuilder, f: TemplateNode) => {
  const occurrencesText = formatOccurrences(f, dBuilder.config.displayTechnicalOccurrences);
  return occurrencesText ? `[${occurrencesText}]` : ``;
}


