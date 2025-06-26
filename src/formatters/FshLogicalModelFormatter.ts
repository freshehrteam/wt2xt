import { DocBuilder } from "../DocBuilder";
import { TemplateInput, TemplateNode } from '../types/TemplateNodes';
import { formatOccurrences, isEntry, mapRmType2FHIR, snakeToCamel } from '../types/TemplateTypes';
import { formatLeafHeader } from './DocFormatter';
import {appendCodesystem, formatValueSetDefinition} from './FshTerminologyFormatter';

//const sanitiseFhirName  = (name: string): string  => name.replace(/[^a-zA-Z0-9_-]/g, '_')

const formatLocalName = (f:TemplateNode) => f.localizedName ? f.localizedName : f.name;
  // Strip out any characters that are not numeric, alphabetical, underscore (_) or hyphen (-)
const formatSpaces = (node:TemplateNode) => {
  if (!node.depth)
    node.depth = 0
  return " ".repeat(node.depth * 2)
}

const formatNodeId = (f: TemplateNode):string => f.nodeId?f.nodeId:`RM`

const formatDescription = (dBuilder:DocBuilder,f:TemplateNode,typeConstraint: string = '') =>

    wrapTripleQuote(`\`[${formatNodeId(f)}${typeConstraint}]\`
                             ${dBuilder.getDescription(f)})`)

const wrapTripleQuote = (inString: string) => `"""${inString}"""`

const appendFSHLM = (dBuilder: DocBuilder, f: TemplateNode, typeConstraint: string = '') => {
  const { sb } = dBuilder;
  sb.append(`${formatSpaces(f)}* ${snakeToCamel(f.localizedName?f.localizedName:f.id,isEntry(f.rmType))} ${formatOccurrences(f,true)} ${mapRmType2FHIR(f.rmType)} "${formatLocalName(f)}" ${formatDescription(dBuilder,f,typeConstraint)}`)
}


const appendExternalBinding = (f: TemplateNode, input: TemplateInput) => {
  const { sb } = f.builder;
  // Pick up an external valueset description annotation
  const params = new URLSearchParams(f.annotations?.['vset_description'])
  const bindingFSH: string = `from ${params.get('url')} (${input?.listOpen?'preferred':'required'})`
  sb.append(`${formatSpaces(f)}* ${snakeToCamel(f.localizedName ? f.localizedName : f.id, isEntry(f.rmType))} ${bindingFSH}`)
};

const appendLocalBinding = (f: TemplateNode, input: TemplateInput) => {
  const { sb } = f.builder;

  const nodeName = snakeToCamel(f.localizedName ? f.localizedName : f.id, false)
  const vsName = snakeToCamel(f.localizedName ? f.localizedName : f.id, true)
  // Pick up an external valueset description annotation
  const bindingFSH: string = `from ${vsName} (${input?.listOpen?'preferred':'required'})`
  sb.append(`${formatSpaces(f)}* ${nodeName} ${bindingFSH}`)
};

const formatFSHDefinition = (dBuilder: DocBuilder, f: TemplateNode) => {
  const { sb,wt,config } = dBuilder;
  const techName = snakeToCamel(f.localizedName, true);

  sb.append(`Logical: ${techName}`);
  sb.append(`Title: "${wt.templateId}"`);
  sb.append(`Parent: Element`);
  sb.append(`Description: ${formatDescription(dBuilder,f)}`);
  sb.append(`* ^name = "${snakeToCamel(techName, true)}"`);
  sb.append(`* ^status = #active`);
  sb.append(`* ^version = "${wt.semVer}"`);
  sb.append(`* ^url = "${config.fhirBaseUrl}/StructureDefinition/${snakeToCamel(techName, true)}"`);
}


export const fshl = {

  formatCompositionHeader: (dBuilder: DocBuilder, f: TemplateNode) => {

    const { config } = dBuilder;

    if (config.entriesOnly) return

    formatFSHDefinition(dBuilder,f)
  },

  formatCompositionContextHeader: (dBuilder: DocBuilder, f: TemplateNode) => {
    appendFSHLM(dBuilder,f)
  },

  formatNodeContent: (_docBuilder: DocBuilder | null, f: TemplateNode, isChoice: boolean) => {
    // Stop Choice being called twice as alreadty handled by Choice Header
    if (f.rmType === 'ELEMENT' || isChoice ) return

//     appendFSHLM(dBuilder,f)
  },

  formatEntryHeader: (dBuilder: DocBuilder, f: TemplateNode) => {
//    sb.append(`${spaces}* ${nodeName} ${occurrencesText} ${rmTypeText} "${localName}" "${f.nodeId}: ${localizedDescription}"`)
    const { config } = dBuilder;

    if (config.entriesOnly)
      formatFSHDefinition(dBuilder, f);
    else
      formatLeafHeader(dBuilder,f)
  },

  formatLeafHeader: (dBuilder: DocBuilder, f: TemplateNode) => {
    appendFSHLM(dBuilder,f)
  },

  formatCluster: (dBuilder: DocBuilder, f: TemplateNode) => {
    appendFSHLM(dBuilder,f)
  },

  formatObservationEvent: (dBuilder: DocBuilder, f: TemplateNode) => {
    appendFSHLM(dBuilder,f)
  },

  formatChoiceHeader: (dBuilder: DocBuilder, f: TemplateNode, _isChoice = true) => {
    const { sb} = dBuilder;

    let rmTypeText = '';
    let newText: string = ''
    f.children?.forEach((child) => {
      child.parentNode = f
      newText = mapRmType2FHIR(child.rmType)
      if ((rmTypeText.length) === 0)
        rmTypeText = newText
      else {
        if (!rmTypeText.includes(newText))
          rmTypeText = rmTypeText.concat(' or ' + newText)
      }
    });

    sb.append(`${formatSpaces(f)}* ${snakeToCamel(f.id,false)}[x] ${formatOccurrences(f,true)} ${rmTypeText} "${formatLocalName(f)}" "${f.nodeId}: ${dBuilder.getDescription(f)}"`)
//    sb.append(`${spaces}* ${nodeName}[x] ${occurrencesText} ${rmTypeText} "${localName}" "${f.nodeId}: ${localizedDescription}"`)
  },

  dvTypes: {
    formatDvCodedText: (dBuilder: DocBuilder, f: TemplateNode) => {
      const { ab } = dBuilder;

      appendFSHLM(dBuilder, f)

      const csUrl = appendCodesystem(f)

      formatValueSetDefinition(f)

      f?.inputs?.forEach((input: TemplateInput) => {
          if (input.suffix === 'code') {
            if (f?.annotations?.['vset_description'])
              appendExternalBinding(f, input)
            else
            {
              if (input.list && input.list.length >0) {
                input.list?.forEach((item) => {
                ab.append(`* ${csUrl}#${item.value} "${item.label}"`);
              })

              }
              appendLocalBinding(f, input)
             }
          }
      })
    },

formatDvText: (dBuilder: DocBuilder, f: TemplateNode) => {
  const { ab} = dBuilder;

   appendFSHLM(dBuilder,f)
  appendCodesystem(f)

      f.inputs?.forEach((input: TemplateInput) => {
        if (input.suffix && !['other'].includes(input.suffix))
            if (f?.annotations?.['vset_description'])
            appendExternalBinding(f, input)
          else {

            input.list?.forEach((item) => {
              ab.append(`* $local$#{item.value} "${item.label}"`);
            })
            appendLocalBinding(f, input)
          }
    })
},

  formatDvOrdinal: (dBuilder: DocBuilder, f: TemplateNode) => {
  const { sb , config} = dBuilder;

    appendCodesystem(f)
  f.inputs?.forEach((input) => {
    if (input.list)
      input.list.forEach((listItem) => {
        if (!config.hideXmindValues)
          sb.append(`${formatSpaces(f)} (${listItem.ordinal}) ${listItem.label} [B]`)
      })
  })
},
    formatDvQuantity: (dBuilder: DocBuilder, f: TemplateNode) => {

      let unitStr = ' | '

        f.inputs?.forEach((item) => {
          if (item.list && item.suffix === 'unit') {
            item.list.forEach((val) => {
              unitStr = unitStr.concat(`${val.label}`);
            });
          }
        });

      appendFSHLM(dBuilder, f, ' '+ unitStr)
    },

    formatDvDefault: (dBuilder: DocBuilder, f: TemplateNode) => {
      appendFSHLM(dBuilder,f)
    },

}
}
