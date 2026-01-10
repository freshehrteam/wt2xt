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
import {StringBuilder} from "../StringBuilder.ts";


const Separator: string = ',';
const Quoter : string = '"';
const csvColumns: string[] = [
    'Node ID',
    'openehr Name',
    'EHDS Name',
    'openEHR Description',
    'openEHR Comment',
    'EHDS Description',
    'openEHR Cardinality',
    'openEHR Datatype',
    'openEHR Values',
    'EHDS Binding',
    'EHDS Values',
    'Concept Map',
    'openEHR Path',
    'EHDS Path',
    'MappingNotes']



//const sanitiseFhirName  = (name: string): string  => name.replace(/[^a-zA-Z0-9_-]/g, '_')

const formatCsvNode = (value: string, firstCol: boolean = false) => {
  const cleanValue  = value? value.replace(/[",]+/g, '') : ''
  const quotedValue = `${Quoter}${cleanValue}${Quoter}`
  return `${firstCol ? "":Separator}`+ quotedValue

}

const formatLocalName = (f:TemplateNode) => f.localizedName ? f.localizedName : f.name;
  // Strip out any characters that are not numeric, alphabetical, underscore (_) or hyphen (-)

const formatSpaces = (node:TemplateNode) => {
  if (!node.depth)
    node.depth = 0
  return " ".repeat(node.depth * 2)
}

//const formatNodeId = (f: TemplateNode):string => f.nodeId?f.nodeId:`RM`

const appendRow = (dBuilder: DocBuilder, f: TemplateNode, constraintBuilder: StringBuilder|null = null) => {
  const {sb,config} = dBuilder;



  const nodeId = (f: TemplateNode) =>
  {
    const isRootNode =  isEntry(f.rmType) || isSection(f.rmType)
    if (isRootNode)
      return (f.nodeId || f.id)
    else
      return ''
  }
  const openehrComment: string = f?.annotations?.['comment']|| ''
  const mapTargetName=  () => {
    return f?.annotations?.['mapTargetName']|| f?.localizedName
  }
  const mapTargetDescription =f?.annotations?.['mapTargetDescription']|| ''
  const archetypeNodeId :string =  f?.localizedName|| ''
  const mapTargetConstraints: string = f?.annotations?.['mapTargetConstraints']|| ''
  const mapTargetBindings: string = f?.annotations?.['mapTargetBindings']|| ''
  const conceptMapUrl: string = f?.annotations?.['conceptMapUrl']|| ''
  const mapTargetNotes: string = f?.annotations?.['mapTargetNotes']|| ''
  const mapTargetFhirPath: string = f?.annotations?.['mapTargetFhirPath']|| ''

  const openehrConstraints:string = constraintBuilder?.toString() || ''
  const rmDatatype = mapRmTypeText(f.rmType)
 // const datatype: string = constraint?rmDatatype + '\n' + constraint: rmDatatype
  const aqlString = f?.aqlPath || '/'

  sb.append(
      formatCsvNode(nodeId(f), true)
      + formatCsvNode(archetypeNodeId)
      + formatCsvNode(mapTargetName())
      + formatCsvNode(dBuilder.getDescription(f))
      + formatCsvNode(openehrComment)
      //    + formatCsvNode(formatLocalName(f))
      + formatCsvNode(mapTargetDescription)
      + formatCsvNode(formatOccurrences(f, true))
      + formatCsvNode(rmDatatype)
      + formatCsvNode(openehrConstraints)
      + formatCsvNode(mapTargetBindings)
      + formatCsvNode(mapTargetConstraints)
      + formatCsvNode(conceptMapUrl)
      + formatCsvNode(aqlString)
      + formatCsvNode(mapTargetFhirPath)
      + formatCsvNode(mapTargetNotes))
}

const appendExternalBinding = (f: TemplateNode, input: TemplateInput) => {
  const { sb } = f.builder;
  // Pick up an external valueset description annotation
  const params = new URLSearchParams(f.annotations?.['vset_description'])
  const bindingFSH: string = `from ${params.get('url')} (${input?.listOpen?'preferred':'required'})`
  sb.append(`${formatSpaces(f)}* ${snakeToCamel(f.localizedName ? f.localizedName : f.id, isEntry(f.rmType))} ${bindingFSH}`)
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
    appendRow(dBuilder,f)
  },


  formatNodeContent: (dBuilder: DocBuilder, f: TemplateNode, isChoice: boolean) => {
    // Stop Choice being called twice as alreadty handled by Choice Header
    if (f.rmType === 'ELEMENT' || isChoice ) return

  //  appendRow(dBuilder,f)
  },

  formatEntryHeader: (dBuilder: DocBuilder, f: TemplateNode) => {
//    sb.append(`${spaces}* ${nodeName} ${occurrencesText} ${rmTypeText} "${localName}" "${f.nodeId}: ${localizedDescription}"`)
  //  const { config } = dBuilder;

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

      const cb = new StringBuilder();

      for (const item of f?.inputs || []) {

        if (item.suffix !== 'code') break

        const term =  item?.terminology || 'local'

        item.list?.forEach((list) => cb.append(` ${list.label} ${term}:${list.value}`))

        if (!item.list) {
          cb.append(term.replace('//fhir.hl7.org/ValueSet/$expand?url=',' '))
          if (f?.annotations?.["vset_description"]) {
            // Convert /n characters to linebreaks
            const newLined = f.annotations?.["vset_description"].replace(/\\n/g, String.fromCharCode(10));
            cb.append(newLined)
          }
        }

        if (item.listOpen)
          cb.append('-Other Text/CodedText allowed');

      }

      appendRow(dBuilder, f,cb)

    },

formatDvText: (dBuilder: DocBuilder, f: TemplateNode) => {
  const cb = new StringBuilder();

  f.inputs?.forEach((input: TemplateInput) => {
    if (input.suffix && !['other'].includes(input.suffix))
        if (f?.annotations?.['vset_description'])
        appendExternalBinding(f, input)
      else {
        input.list?.forEach((item) => {
          cb.append(` ${item.value} ${item.label}`);
        })
       // appendLocalBinding(f, input,undefined)
      }
    })
  appendRow(dBuilder, f,cb)

},

formatDvOrdinal: (dBuilder: DocBuilder, f: TemplateNode) => {
  const cb = new StringBuilder();
//    appendCodesystem(f)
  f.inputs?.forEach((input) => {
    if (input.list)
      input.list.forEach((listItem) => {
          cb.append(`[${listItem.ordinal}] ${listItem.label} local::${listItem.value}`)
      })
  })
  appendRow(dBuilder, f, cb)
},

formatDvQuantity: (dBuilder: DocBuilder, f: TemplateNode) => {

      let unitStr = ''
      const cb = new StringBuilder();
      f.inputs?.forEach((item) => {
        if (item.suffix === 'unit') {
          item.list?.forEach((val) => unitStr = unitStr.concat(` ${val.label}\n`))
          cb.append(unitStr)
        }
      });
      appendRow(dBuilder, f, cb)
    },

    formatDvDefault: (dBuilder: DocBuilder, f: TemplateNode) => {
      appendRow(dBuilder,f)
    },

}
}
