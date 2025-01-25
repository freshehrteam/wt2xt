import { DocBuilder } from "../DocBuilder";
import {  TemplateNode} from "../types/TemplateNodes";
import { formatOccurrences, mapRmType2FHIR, snakeToCamel } from '../types/TemplateTypes';

const formatLocalName = (f:TemplateNode) => f.localizedName ? f.localizedName : f.name;
const formatSpaces = (f:TemplateNode) => f.depth ? " ".repeat(f.depth * 2) : "";

const appendFSHLM = (dBuilder: DocBuilder, f: TemplateNode, isChoice: boolean = false) => {
  const { sb } = dBuilder;

  const choiceSuffix: string = isChoice?'x':'';
  const nodeId: string = f.nodeId?f.nodeId:`RM`
  sb.append(`${formatSpaces(f)}* ${snakeToCamel(f.id,true)}${choiceSuffix} ${formatOccurrences(f,true)} ${mapRmType2FHIR(f.rmType)} "${formatLocalName(f)}" "${nodeId}: ${dBuilder.getDescription(f)}"`)

}
export const fshq = {

  formatTemplateHeader: (dBuilder: DocBuilder) => {
    const { wt, sb} = dBuilder;
    const techName = snakeToCamel(wt.templateId,true);
    sb.append(`Instance: ${techName}`)
    sb.append(`Title: "${wt.templateId}"`)
    sb.append(`Parent: Questionnaire`)
    sb.append(`Usage: #example`)
  },

  formatCompositionHeader: (dBuilder: DocBuilder, f: TemplateNode) => {
    const { sb } = dBuilder;
    sb.append(`Description:  "${f.localizedDescriptions['en']}"`)
    sb.append(`* name = "${snakeToCamel(f.id,true)}"`)
    sb.append(`* status = #active`)
    sb.append(`* version = "${dBuilder.wt.semVer}"`)
    sb.append(`* url = "http://hl7.org/fhir/Questionnaire/bb"`)
    sb.append(`* subjectType = #Patient`)
    sb.append(`* publisher = "New South Wales Department of Health"`)
    sb.append(`* date = "2013-02-19"`)
    sb.append(`* jurisdiction = urn:iso:std:iso:3166#`)

  },

  formatCompositionContextHeader: (dBuilder: DocBuilder, _f: TemplateNode) => {
    const { sb } = dBuilder;
    sb.append(``)
    sb.append(``)

    // appendFSHLM(dBuilder,f)
  },

  saveFile: async (dBuilder: DocBuilder, outFile: any): Promise<void> => {
    await Bun.write(outFile, dBuilder.toString());
    console.log(`\n Exported : ${outFile}`)
  },

  formatNodeContent: (_dBuilder: DocBuilder, f: TemplateNode, isChoice: boolean) => {
    // Stop Choice being called twice as alreadty handled by Choice Header
    if (f.rmType === 'ELEMENT' || isChoice) return

  //  appendFSHLM(dBuilder,f)
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
}
