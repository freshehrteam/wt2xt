import { DocBuilder } from "../DocBuilder";
import {TemplateInput, TemplateNode} from "../types/TemplateNodes";
import {
  dataValueFHIRQuestionTypeMapper,
  formatOccurrences,
  isEntry,
  mapRmType2FHIR,
  snakeToCamel
} from '../types/TemplateTypes';
import {formatValueSetDefinition} from "./FshTerminologyFormatter";
import {formatLeafHeader} from "./DocFormatter.ts";

const formatLocalName = (f:TemplateNode) => {
  const name = f.localizedName ? f.localizedName : f.name;
  // Strip out any characters that are not numeric, alphabetical, underscore (_) or hyphen (-)
  return name ? name.replace(/[^a-zA-Z0-9_-]/g, '') : name;
};
const formatSpaces = (f:TemplateNode) => f.depth ? " ".repeat(f.depth * 2) : "";

const appendFSHQ = (dBuilder: DocBuilder, f: TemplateNode, _isChoice: boolean = false) => {
  const { sb } = dBuilder;

  // const choiceSuffix: string = isChoice?'x':'';
  // const nodeId: string = f.nodeId?f.nodeId:`RM`
  const multiOccurrence : boolean = f.max > 0

  sb.append(`* item[=].item[+].linkId = "1"`)
  sb.append(`* item[=].repeats = ${multiOccurrence}`)
  sb.append(`* item[=].item[=].definition = "http://example.org/sdh/dtr/aslp/StructureDefinition/aslp-sleep-study-order#ServiceRequest.code"`)
  sb.append(`* item[=].item[=].text = "${dBuilder.getDescription(f)}"`)
  sb.append(`* item[=].item[=].type = #${dataValueFHIRQuestionTypeMapper(f.rmType)}`)
  sb.append(`* item[=].item[=].answerValueSet = "http://example.org/sdh/dtr/aslp/ValueSet/aslp-a1-de1-codes-grouper"`)

 // sb.append(`${formatSpaces(f)}* ${snakeToCamel(f.id,true)}${choiceSuffix} ${formatOccurrences(f,true)} ${mapRmType2FHIR(f.rmType)} "${formatLocalName(f)}" "${nodeId}: "`)

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

export const fshq = {

  formatTemplateHeader: (dBuilder: DocBuilder) => {
    const { wt, sb} = dBuilder;
    const techName = snakeToCamel(wt.templateId,true);
    sb.append(`Instance: ${techName}`)
    sb.append(`InstanceOf: Questionnaire`)
    sb.append(`Title: "${wt.templateId}"`)
    sb.append(`Parent: Questionnaire`)
    sb.append(`Usage: #example`)
  },

  formatCompositionHeader: (docBuilder: DocBuilder, f: TemplateNode) => {
    const { sb } = docBuilder;

    const dateObj: Date = new Date()
    const currentIsoDate : string  = dateObj.toISOString()

    sb.append(`Description:  "${f.localizedDescriptions['en']}"`)
    sb.append(`* name = "${snakeToCamel(f.id,true)}"`)
    sb.append(`* status = #active`)
    sb.append(`* version = "${docBuilder.wt.semVer}"`)
    sb.append(`* url = "http://hl7.org/fhir/Questionnaire/bb"`)
    sb.append(`* publisher = "New South Wales Department of Health"`)
    sb.append(`* date = "${currentIsoDate}"`)
    sb.append(`* jurisdiction = urn:iso:std:iso:3166#`)
    sb.append(`* useContext.code = ""`)
    sb.append(`* meta.lastUpdated = "${currentIsoDate}"`)
   },

  formatCompositionContextHeader: (dBuilder: DocBuilder, f: TemplateNode) => {
    appendFSHQ(dBuilder,f)
  },

  formatNodeContent: (_dBuilder: DocBuilder, f: TemplateNode, isChoice: boolean) => {
    // Stop Choice being called twice as alreadty handled by Choice Header
    if (f.rmType === 'ELEMENT' || isChoice) return

  //  appendFSHLM(dBuilder,f)
  },

  formatLeafHeader: (dBuilder: DocBuilder, f: TemplateNode) => {
    appendFSHQ(dBuilder,f)
  },

  formatCluster: (dBuilder: DocBuilder, f: TemplateNode) => {
    appendFSHQ(dBuilder,f)
  },

  formatObservationEvent: (dBuilder: DocBuilder, f: TemplateNode) => {
    appendFSHQ(dBuilder,f)
  },
  formatEntryHeader: (dBuilder: DocBuilder, f: TemplateNode) => {
//    sb.append(`${spaces}* ${nodeName} ${occurrencesText} ${rmTypeText} "${localName}" "${f.nodeId}: ${localizedDescription}"`)
    //const { config } = dBuilder;

    //if (config.entriesOnly)
      //formatFSHDefinition(dBuilder, f);
    //else
      formatLeafHeader(dBuilder,f)

  },

  formatChoiceHeader: (dBuilder: DocBuilder, f: TemplateNode, _isChoice = true) => {
    const { sb} = dBuilder;

    let rmTypeText = '';
    let newText: string = ''
    f.children?.forEach((child: TemplateNode) => {
      child.parentNode = f
      newText = mapRmType2FHIR(child.rmType)
      if ((rmTypeText.length) === 0)
        rmTypeText = newText
      else {
        if (!rmTypeText.includes(newText))
          rmTypeText = rmTypeText.concat(' or ' + newText)
      }
    });

    sb.append(`${formatSpaces(f)}* ${snakeToCamel(f.id,true)}[x] ${formatOccurrences(f,true)} ${rmTypeText} "${formatLocalName(f)}" "${f.nodeId}: ${dBuilder.getDescription(f)}"`)
  },
  dvTypes: {
    formatDvCodedText: (dBuilder: DocBuilder, f: TemplateNode) => {
      const { ab } = dBuilder;

      appendFSHQ(dBuilder, f)
return
      formatValueSetDefinition(f)

      f?.inputs?.forEach((input: TemplateInput) => {
        if (input?.list) {
          if (input.suffix === 'code') {
            if (f?.annotations?.['vset_description'])
              appendExternalBinding(f, input)
            else
            if (input?.list.length >0) {
              input?.list?.forEach((item) => {
                ab.append(`* $local#${item.value} "${item.label}"`);
              })
              appendLocalBinding(f, input)
            }
          }
        }
      })
    },

    formatDvText: (dBuilder: DocBuilder, f: TemplateNode) => {
     // const { ab} = dBuilder;

      appendFSHQ(dBuilder,f)

  /*    f.inputs?.forEach((input: TemplateInput) => {
        if (input.suffix && !['other'].includes(input.suffix))
          if (f?.annotations?.['vset_description'])
            appendExternalBinding(f, input)
          else {

            input.list?.forEach((item) => {
              ab.append(`* $local$#{item.value} "${item.label}"`);
            })
            appendLocalBinding(f, input)
          }
      })*/
    },

    formatDvOrdinal: (dBuilder: DocBuilder, f: TemplateNode) => {
      const { sb , config} = dBuilder;

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

     appendFSHQ(dBuilder, f)
    },

    formatDvDefault: (dBuilder: DocBuilder, f: TemplateNode) => {
      appendFSHQ(dBuilder,f)
    },

  }
}
