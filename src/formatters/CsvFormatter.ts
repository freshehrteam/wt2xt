import { DocBuilder } from "../DocBuilder";
import { TemplateInput, TemplateNode } from '../types/TemplateNodes';
import {
  formatOccurrences,
  isEntry,
  isSection,
  mapRmType2FHIR,
  mapRmTypeText,
  snakeToCamel
} from '../types/TemplateTypes';
import {formatLeafHeader} from './DocFormatter';
import {appendCodesystem, appendCodeSystemFSH, formatValueSetDefinition} from './FshTerminologyFormatter';
import {StringBuilder} from "../StringBuilder.ts";


const Separator: string = ',';
const Quoter : string = '"';

const csvColumns: string[] = ['EHDS Name','Node ID','Text','Description','Data type','Included','Occurrences','Comments','Path','Mapping Comments']//const sanitiseFhirName  = (name: string): string  => name.replace(/[^a-zA-Z0-9_-]/g, '_')

const formatCsvNode = (value: string, firstCol: boolean = false) => {
  return (firstCol ? "" : Separator )+ Quoter + value.replace(/[",]+/g, '') + Quoter
}

const formatLocalName = (f:TemplateNode) => f.localizedName ? f.localizedName : f.name;
  // Strip out any characters that are not numeric, alphabetical, underscore (_) or hyphen (-)

const formatSpaces = (node:TemplateNode) => {
  if (!node.depth)
    node.depth = 0
  return " ".repeat(node.depth * 2)
}

const formatNodeId = (f: TemplateNode):string => f.nodeId?f.nodeId:`RM`

const appendRow = (dBuilder: DocBuilder, f: TemplateNode, constraintBuilder: StringBuilder|null = null) => {
  const {sb} = dBuilder;

  const isRootNode =  isEntry(f.rmType) || isSection(f.rmType)
  const nodeId: string = isRootNode? (f.nodeId || f.id): ''
  const comment: string = f?.annotations?.['comment']|| ''
  const ehdsName: string = f?.annotations?.['ehdsName']|| ''
  const fhirPath: string = f?.annotations?.['fhirPath']|| ''
  const constraint = constraintBuilder?.toString()
  const rmDatatype = mapRmTypeText(f.rmType)
  const datatype: string = constraint?rmDatatype + '\n' + constraint: rmDatatype

      sb.append(`${formatCsvNode(ehdsName, true)}${formatCsvNode(nodeId)}${formatCsvNode(formatLocalName(f))}${formatCsvNode(dBuilder.getDescription(f))}${formatCsvNode(datatype)}${formatCsvNode('true')}${formatCsvNode(formatOccurrences(f, false))}${formatCsvNode(comment)}${formatCsvNode(f.aqlPath)}${formatCsvNode(fhirPath)}${formatCsvNode('')}`)
}

const appendExternalBinding = (f: TemplateNode, input: TemplateInput) => {
  const { sb } = f.builder;
  // Pick up an external valueset description annotation
  const params = new URLSearchParams(f.annotations?.['vset_description'])
  const bindingFSH: string = `from ${params.get('url')} (${input?.listOpen?'preferred':'required'})`
  sb.append(`${formatSpaces(f)}* ${snakeToCamel(f.localizedName ? f.localizedName : f.id, isEntry(f.rmType))} ${bindingFSH}`)
};

const appendLocalBinding = (f: TemplateNode, input: TemplateInput, uniqueVSName: string|undefined) => {
  const { sb } = f.builder;

  const nodeName = snakeToCamel(f.localizedName ? f.localizedName : f.id, false)
  const vsName = uniqueVSName?uniqueVSName:snakeToCamel(f.localizedName ? f.localizedName : f.id, true)
    // Pick up an external valueset description annotation
  const bindingFSH: string = `from ${vsName} (${input?.listOpen?'preferred':'required'})`
  sb.append(`${formatSpaces(f)}* ${nodeName} ${bindingFSH}`)
};


export const csv = {

  formatTemplateHeader: (dBuilder: DocBuilder) => {

    const { sb } = dBuilder;
    let rowString = ''
    csvColumns.forEach((element: string,index) => {
      rowString = rowString.concat(formatCsvNode(element, index === 0));
    });

    sb.append(rowString);
  },


    formatCompositionHeader: (dBuilder: DocBuilder, f: TemplateNode) => {

    const { config } = dBuilder;

    if (config.entriesOnly) return

   // formatFSHDefinition(dBuilder,f)
  },


  formatNodeContent: (dBuilder: DocBuilder, f: TemplateNode, isChoice: boolean) => {
    // Stop Choice being called twice as alreadty handled by Choice Header
    if (f.rmType === 'ELEMENT' || isChoice ) return

  //  appendRow(dBuilder,f)
  },

  formatEntryHeader: (dBuilder: DocBuilder, f: TemplateNode) => {
//    sb.append(`${spaces}* ${nodeName} ${occurrencesText} ${rmTypeText} "${localName}" "${f.nodeId}: ${localizedDescription}"`)
    const { config } = dBuilder;

  //  if (config.entriesOnly)
  //    formatFSHDefinition(dBuilder, f);

    formatLeafHeader(dBuilder,f)
  },

  formatLeafHeader: (dBuilder: DocBuilder, f: TemplateNode) => {
   appendRow(dBuilder,f)
  },

  formatCluster: (dBuilder: DocBuilder, f: TemplateNode) => {
    appendRow(dBuilder,f)
  },

  formatObservationEvent: (dBuilder: DocBuilder, f: TemplateNode) => {
    appendRow(dBuilder,f)
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

//    sb.append(`${formatSpaces(f)}* ${snakeToCamel(f.id,false)}[x] ${formatOccurrences(f,true)} ${rmTypeText} "${formatLocalName(f)}" "${f.nodeId}: ${dBuilder.getDescription(f)}"`)
//    sb.append(`${spaces}* ${nodeName}[x] ${occurrencesText} ${rmTypeText} "${localName}" "${f.nodeId}: ${localizedDescription}"`)
  },

  dvTypes: {

    formatDvCodedText: (dBuilder: DocBuilder, f: TemplateNode) => {

      const { sb, config } = dBuilder;
      const cb = new StringBuilder();

      f?.inputs?.forEach((item) => {
        const term = item.terminology === undefined ? 'local' : item.terminology;
        if (item.list) {
          item.list.forEach((list) => {
            const termPhrase = `${term}:${list.value}`
                cb.append(`-  ${list.label} ${termPhrase}`)
          })
        } else
            // Pick up an external Valueset description annotation
        if (item.suffix === 'code' && f?.annotations?.["vset_description"]) {
          // Convert /n characters to linebreaks
          const newLined = f.annotations?.["vset_description"].replace(/\\n/g, String.fromCharCode(10));
          cb.append(newLined)
        }

        if (item.listOpen)
          cb.append(`* _Other text/ coded text allowed_`);

        appendRow(dBuilder, f,cb)
      });
    },

formatDvText: (dBuilder: DocBuilder, f: TemplateNode) => {
  const { ab} = dBuilder;

  appendRow(dBuilder, f)
  return

  appendCodeSystemFSH(dBuilder)
  //  const uniqueVS = formatValueSetDefinition(f)

      f.inputs?.forEach((input: TemplateInput) => {
        if (input.suffix && !['other'].includes(input.suffix))
            if (f?.annotations?.['vset_description'])
            appendExternalBinding(f, input)
          else {
            input.list?.forEach((item) => {
              ab.append(`* $local$#{item.value} "${item.label}"`);
            })
            appendLocalBinding(f, input,undefined)
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

      appendRow(dBuilder, f)
//      appendFSHLM(dBuilder, f, ' '+ unitStr)
    },

    formatDvDefault: (dBuilder: DocBuilder, f: TemplateNode) => {
      appendRow(dBuilder,f)
    },

}
}
