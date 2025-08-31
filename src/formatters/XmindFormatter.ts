import * as fs from 'fs-extra';
import { parseXMindMarkToXMindFile} from "xmindmark";

import { DocBuilder } from "../DocBuilder";
import {  TemplateNode, TemplateInput } from "../types/TemplateNodes";
import { formatOccurrences, isAnyChoice, mapRmTypeText } from '../types/TemplateTypes';
import {formatRawOccurrencesText, getOutputBuffer} from "./DocFormatter";
import { extractTextInBrackets} from './FormatterUtils';

const headerIndent: string = '  -';
const eventIndent:  string = '    -';
const nodeIndent:   string = '      -';
const dvIndent:     string = '        -';

export const xmind = {

  formatHeader: (dBuilder : DocBuilder): void => {
    const { sb, wt } = dBuilder;
    sb.append(sb.newLineCoded(`Template: ${wt.templateId} \n ${wt.semVer} \n ${new Date().toDateString()}`));
  },

  formatCompositionHeader: (dBuilder: DocBuilder, f: TemplateNode) => {
    const {  sb } = dBuilder;
    sb.append(sb.newLineCoded(`- Composition: ${f.name}`))

    if (f?.children?.length)
      sb.append(`${headerIndent} attributes`)
  },

  formatCompositionContextHeader: (dBuilder: DocBuilder, _f: TemplateNode) => {
    const { sb} = dBuilder;
    sb.append(`${headerIndent} context`);
  },

  getOutputBuffer : async (docBuilder: DocBuilder): Promise<ArrayBufferLike> => {
      return await parseXMindMarkToXMindFile(docBuilder.toString()) as ArrayBufferLike;
  } ,

  saveFile: async (docBuilder: DocBuilder, outFile: any, useStdOut: boolean): Promise <number>  => {

    const outBuffer: ArrayBufferLike = await xmind.getOutputBuffer(docBuilder)// Ensure tmp directory exists

    console.log(`\n Exported : ${outFile}`);
    // Return the length of the written data as an approximation of bytes written
    return outBuffer.byteLength;
  },

  formatNodeContent: (dBuilder: DocBuilder, f: TemplateNode, _isChoice: boolean) => {
    const { sb, config } = dBuilder;
    const localName = f.localizedName ? f.localizedName : f.name
    const nodeName = localName ? localName : f.id
    const rmTypeText = mapRmTypeText(f.rmType);
    const occurrencesText = formatOccurrences(f, config.displayTechnicalOccurrences)
    sb.append(`${nodeIndent} ${nodeName} [${rmTypeText} ${occurrencesText}]`)
  },

  formatLeafHeader: (dBuilder: DocBuilder, f: TemplateNode) => {
    const { sb} = dBuilder;
    sb.append(`${headerIndent} ${f.name} ${f.rmType}`)
  },

  formatObservationEvent: (dBuilder: DocBuilder, f: TemplateNode) => {
    const { sb} = dBuilder;
    sb.append(`${eventIndent} ${f.name}  ${formatRawOccurrencesText(dBuilder, f)}`)
  },

  formatChoiceHeader: (dBuilder: DocBuilder, f: TemplateNode) => {
    const { sb} = dBuilder;
    if (f.children && isAnyChoice(f.children.map(child =>  child.rmType)))
      sb.append(`${dvIndent} All data types allowed`);
  },

  dvTypes: {
    formatDvCodedText: (dBuilder: DocBuilder, f: TemplateNode) => {
      const { sb, config} = dBuilder;

      f?.inputs?.forEach((item :TemplateInput) => {
        if (item.list ) {
          item.list.forEach((list) => {
          if (!config.hideXmindValues)
            sb.append(`${dvIndent} ${list.label} [B]`);
          })
        } else
          // Pick up an external valueset description annotation
        if (item.suffix === 'code' && f?.annotations?.['vset_description']) {
          // Convert /n characters to linebreaks
            const extRef = extractTextInBrackets(f.annotations?.['vset_description'])
          sb.append(`${dvIndent} ${extRef[0]} [B]`)
        }

        if (item.listOpen  && !config.hideXmindValues)
          sb.append( `${dvIndent} Other text/ coded text allowed [B]`);
      });
    },

    formatDvText: (dBuilder: DocBuilder, f: TemplateNode) => {
      const { sb , config} = dBuilder;

      if (f.inputs?.length) {
        f.inputs.forEach((input) => {
          if (input.list ) {
            input.list.forEach((listItem) => {
              if (!config.hideXmindValues)
                sb.append(`${dvIndent} ${listItem.value} [B]`)
            })
          }
          else
          if (input.suffix !== 'other' && f?.annotations?.['vset_description']) {
            // Pick up an external valueset description annotation
            const extRef = extractTextInBrackets(f.annotations?.['vset_description'])
            sb.append(`${dvIndent} ${extRef[0]} [B]`)
          }

          if (input.listOpen  && !config.hideXmindValues)
            sb.append(`${dvIndent} Other text/coded text allowed [B]`);

        });
//      appendDescription(f);
      }
    },

    formatDvOrdinal: (dBuilder: DocBuilder, f: TemplateNode) => {
      const { sb , config} = dBuilder;

      f.inputs?.forEach((input) => {
        if (input.list)
          input.list.forEach((listItem) => {
          if (!config.hideXmindValues)
            sb.append(`${dvIndent} (${listItem.ordinal}) ${listItem.label} [B]`)
          })
      })
    },

  }
}
