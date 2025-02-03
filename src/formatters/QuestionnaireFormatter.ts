import { DocBuilder } from "../DocBuilder";
import {TemplateInput, TemplateNode} from "../types/TemplateNodes";

import {
  dataValueFHIRQuestionTypeMapper,
  formatOccurrences, isEntry, isMandatory, isMultiple, isRMAttribute, mapRmType2FHIR, snakeToCamel
} from '../types/TemplateTypes';
import {formatValueSetDefinition} from "./FshTerminologyFormatter";
import {formatLeafHeader} from "./DocFormatter.ts";

import {Questionnaire} from "@smile-cdr/fhirts/dist/FHIR-R4/classes/questionnaire";
import {QuestionnaireItem} from "@smile-cdr/fhirts/dist/FHIR-R4/classes/questionnaireItem";
import {Coding} from "@smile-cdr/fhirts/dist/FHIR-R4/classes/coding";
import StatusEnum = Questionnaire.StatusEnum;
import TypeEnum = QuestionnaireItem.TypeEnum;

const formatLocalName = (f:TemplateNode) => f.localizedName ? f.localizedName : f.name;
const formatSpaces = (f:TemplateNode) => f.depth ? " ".repeat(f.depth * 2) : "";

const formatCode = (node:TemplateNode) :Coding  => {
  return {code: node.id, system: isRMAttribute(node)? 'openehr.rm': 'openehr.local'}
};

const appendFSHQ = (dBuilder: DocBuilder, node: TemplateNode, isLeafNode: boolean ) => {

  // const choiceSuffix: string = isChoice?'x':'';
  // const nodeId: string = f.nodeId?f.nodeId:`RM`

  const qItem: QuestionnaireItem = new (QuestionnaireItem)

  qItem.linkId = (++dBuilder.idCounter).toString();
  qItem.code = [formatCode(node)]
  qItem.definition = node.aqlPath
  qItem.readOnly = false
  qItem.required = isMandatory(node)
  qItem.type = dataValueFHIRQuestionTypeMapper(node.rmType) as TypeEnum | undefined
  // qItem.answerOption
  // qItem.answerValueSet
  qItem.repeats = isMultiple(node)
  qItem.text = node.name;
  qItem.item = []
 // node.push(qItem);
  if( isLeafNode)
    dBuilder.currentItem = qItem.item;
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

  formatTemplateHeader: (docBuilder: DocBuilder) => {
    let { wt,jb} = docBuilder;

    const techName = snakeToCamel(wt.templateId,true);
    const dateObj: Date = new Date()
    const currentIsoDate : string  = dateObj.toISOString()

    const questionnaire = jb;

    // questionnaire.code =
    questionnaire.resourceType = 'Questionnaire'
    questionnaire.meta = {};
    questionnaire.meta.source = `${wt.templateId}`;
    questionnaire.meta.versionId = `${wt.templateId}:${wt.semVer}`;
    questionnaire.date = `${currentIsoDate}`
    questionnaire.id = techName
    questionnaire.name =  techName
    questionnaire.title = `${wt.templateId}`
    questionnaire.status = StatusEnum.Active
    questionnaire.version = `${wt.semVer}`
    questionnaire.url = "http://hl7.org/fhir/Questionnaire/bb";
    questionnaire.item = []
    docBuilder.currentItem = questionnaire.item
  },

  formatCompositionHeader: (_docBuilder: DocBuilder, _f: TemplateNode) => {
   },

  formatCompositionContextHeader: (dBuilder: DocBuilder, f: TemplateNode) => {
    appendFSHQ(dBuilder,f, true)
  },

  formatNodeContent: (dBuilder: DocBuilder, f: TemplateNode, _isChoice: boolean) => {
    // Stop Choice being called twice as alreadty handled by Choice Header
  //  if (f.rmType === 'ELEMENT' || isChoice) return
    appendFSHQ(dBuilder,f,false)
  },

  formatLeafHeader: (dBuilder: DocBuilder, f: TemplateNode) => {
    appendFSHQ(dBuilder,f,true)
  },

  formatCluster: (dBuilder: DocBuilder, f: TemplateNode) => {
    appendFSHQ(dBuilder,f,true)
  },

  formatObservationEvent: (dBuilder: DocBuilder, f: TemplateNode) => {
    appendFSHQ(dBuilder,f,true)
  },
  formatEntryHeader: (dBuilder: DocBuilder, f: TemplateNode) => {
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

      appendFSHQ(dBuilder, f,false)
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

      appendFSHQ(dBuilder,f,false)

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

     appendFSHQ(dBuilder, f,false)
    },

    formatDvDefault: (dBuilder: DocBuilder, f: TemplateNode) => {
      appendFSHQ(dBuilder,f,false)
    },

  }
}
