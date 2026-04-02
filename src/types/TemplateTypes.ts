import { TemplateNode } from './TemplateNodes';

export function isEntry(rmType: string) {
  return ['OBSERVATION', 'EVALUATION', 'INSTRUCTION', 'ACTION', 'ADMIN_ENTRY', 'GENERIC_ENTRY'].includes(rmType);
}

export function isEvent(rmType: string) {
  return ['EVENT', 'POINT_EVENT', 'INTERVAL_EVENT'].includes(rmType);
}

export function isActivity(rmType: string) {
  return ['ACTIVITY'].includes(rmType);
}

export function isISMTransition(rmType: string) {
  return ['ISM_TRANSITION'].includes(rmType);
}

export function isSection(rmType: string) {
  return ['SECTION'].includes(rmType);
}

export function isEventContext(rmType: string) {
  return ['EVENT_CONTEXT'].includes(rmType);
}

export function isComposition(rmType: string) {
  return ['COMPOSITION'].includes(rmType);
}

export function isCluster(rmType: string) {
  return ['CLUSTER'].includes(rmType);
}

export function isPartyProxy(rmType: string) {
  return ['PARTY_PROXY'].includes(rmType);
}

//export function isDvChoice(rmType: string) {
//  return ['ELEMENT'].includes(rmType);
//}

export function isBranchNode(rmType:string) {
  return !isDataValue(rmType) || isPartyProxy(rmType) || isEntry(rmType) || isEventContext(rmType) || isActivity(rmType) || isEvent(rmType) || isISMTransition(rmType) || isSection(rmType) || isCluster(rmType)
}

export function isAnyChoice(rmType: string[]) {
  // compares the list of Choices with the whole DataValues array and sends true if all the values exist.
  const dvDataTypes: string[] = Object.keys(DvDataValues).filter(key => isNaN(+key))

  const missing: string[] = dvDataTypes.filter(item =>  (rmType.indexOf(item) < 0 ))

  return (missing.length === 0)

}

export const snakeToCamel = (s: string, forceInitialCap : boolean) => {
  if (!s) return '*undefined*'

    const indexInit = forceInitialCap?-1:0

  return s
    .replace(/[_\/\-\[\].]/g,' ')
    .replace(/^\w|[A-Z]|\b\w/g, (letter, index) =>
      index === indexInit
        ? letter.toLowerCase()
        : letter.toUpperCase()
    )
    .replace(/\s+|[&_\-?()[]/g, '')
}

export const isRMAttribute= (node: TemplateNode) :boolean => node.inContext || false

export const isArchetype= (rmType: string, nodeId: string) => {
  return ['COMPOSITION','OBSERVATION', 'EVALUATION', 'INSTRUCTION', 'SECTION', 'ACTION', 'ADMIN_ENTRY', 'GENERIC_ENTRY', 'CLUSTER', 'ELEMENT'].includes(rmType)
      &&  nodeId.substring(0,2) !== 'at'
}

export const mapRmTypeText = (rmTypeString: string) => {
  let rmType = rmTypeString
  let intervalPrefix = ''
  if (rmTypeString.startsWith('DV_INTERVAL')) {
    intervalPrefix = "Interval of "
    rmType = rmTypeString.replace(/(^.*<|>.*$)/g, '');
  }
  return `${intervalPrefix}${lookupDatatypeText(rmType, BaseTypesFormat.OPENEHR_WT)}`
}

// export const mapRmTypetoFSHL = (rmTypeString: string) => {
//   let rmType = rmTypeString
//   let intervalPrefix = ''
//   if (rmTypeString.startsWith('DV_INTERVAL')) {
//     intervalPrefix = "DvInterval-"
//     rmType = rmTypeString.replace(/(^.*<|>.*$)/g, '');
//   }
//   return `${intervalPrefix}${lookupDatatypeText(rmType, BaseTypesFormat.OPENEHR_RM)}`
// }

export const mapRmType2FHIR = (rmTypeString: string, dataTypeFormat: BaseTypesFormat) => {
  switch (dataTypeFormat) {
    case BaseTypesFormat.FHIR:
      return dataValueFHIRMapper(rmTypeString)
    case BaseTypesFormat.OPENEHR_RM:
      return dataValueFHSLMapper(rmTypeString)
    default:
      return dataValueFHSLMapper(rmTypeString)
  }
}

export enum DvDataValues{
  'DV_CODED_TEXT',
  'DV_TEXT',
  'DV_DATE',
  'DV_DATE_TIME',
  'DV_TIME',
  'DV_ORDINAL',
  'DV_SCALE',
  'DV_COUNT',
  'DV_DURATION',
  'DV_URI',
  'DV_QUANTITY',
  'DV_BOOLEAN',
  'DV_IDENTIFIER',
  'DV_PROPORTION',
  'DV_EHR_URI',
  'DV_MULTIMEDIA',
  'DV_PARSABLE',
}

export enum BaseTypesFormat {
  'FHIR',
  'OPENEHR_RM',
  'OPENEHR_WT',
  'ISO_CDI'
}

export enum NonDvDataValues{
  'DV_STATE' ,
  'ELEMENT',
  'STRING'
}

export enum OtherDisplayableNodes{
  'CODE_PHRASE',
  'PARTY_PROXY'
}

// type DisplayableNodes = DataValues | OtherDisplayableNodes

export function isDataValue(rmType: string)
{
  return Object.keys(DvDataValues).includes(rmType) || Object.keys(NonDvDataValues).includes(rmType)
}

export function isDisplayableNode(rmType: string)
{
  return Object.keys(DvDataValues).includes(rmType) || Object.keys(OtherDisplayableNodes).includes(rmType)
}

// Unified datatype mapping table: rows = RM types, columns = BaseTypesFormat values
const DatatypeTable: Record<string, Partial<Record<BaseTypesFormat, string>>> = {
  ELEMENT:        { [BaseTypesFormat.FHIR]: 'Choice',           [BaseTypesFormat.OPENEHR_RM]: 'Choice',         [BaseTypesFormat.OPENEHR_WT]: 'Choice' },
  DV_CODED_TEXT:  { [BaseTypesFormat.FHIR]: 'CodeableConcept',  [BaseTypesFormat.OPENEHR_RM]: 'DV_CODED_TEXT',  [BaseTypesFormat.OPENEHR_WT]: 'CodedText' },
  DV_TEXT:        { [BaseTypesFormat.FHIR]: 'CodeableConcept',  [BaseTypesFormat.OPENEHR_RM]: 'DV_TEXT',        [BaseTypesFormat.OPENEHR_WT]: 'Text' },
  DV_ORDINAL:     { [BaseTypesFormat.FHIR]: 'CodeableConcept',  [BaseTypesFormat.OPENEHR_RM]: 'DV_ORDINAL',     [BaseTypesFormat.OPENEHR_WT]: 'Ordinal' },
  DV_SCALE:       { [BaseTypesFormat.FHIR]: 'CodeableConcept',  [BaseTypesFormat.OPENEHR_RM]: 'DV_SCALE',       [BaseTypesFormat.OPENEHR_WT]: 'Scale' },
  DV_QUANTITY:    { [BaseTypesFormat.FHIR]: 'Quantity',         [BaseTypesFormat.OPENEHR_RM]: 'DV_QUANTITY',    [BaseTypesFormat.OPENEHR_WT]: 'Quantity' },
  DV_DURATION:    { [BaseTypesFormat.FHIR]: 'Duration',         [BaseTypesFormat.OPENEHR_RM]: 'DV_DURATION',    [BaseTypesFormat.OPENEHR_WT]: 'Duration' },
  DV_COUNT:       { [BaseTypesFormat.FHIR]: 'Count',            [BaseTypesFormat.OPENEHR_RM]: 'DV_COUNT',       [BaseTypesFormat.OPENEHR_WT]: 'Count' },
  DV_DATE_TIME:   { [BaseTypesFormat.FHIR]: 'dateTime',         [BaseTypesFormat.OPENEHR_RM]: 'DV_DATE_TIME',   [BaseTypesFormat.OPENEHR_WT]: 'DateTime' },
  DV_INTERVAL:    {                                             [BaseTypesFormat.OPENEHR_RM]: 'DV_INTERVAL' },
  DV_IDENTIFIER:  { [BaseTypesFormat.FHIR]: 'Identifier',        [BaseTypesFormat.OPENEHR_RM]: 'DV_IDENTIFIER',  [BaseTypesFormat.OPENEHR_WT]: 'Identifier' },
  DV_MULTIMEDIA:  { [BaseTypesFormat.FHIR]: 'Attachment',       [BaseTypesFormat.OPENEHR_RM]: 'DV_MULTIMEDIA',  [BaseTypesFormat.OPENEHR_WT]: 'Multimedia' },
  DV_URI:         { [BaseTypesFormat.FHIR]: 'uri',              [BaseTypesFormat.OPENEHR_RM]: 'DV_URI',         [BaseTypesFormat.OPENEHR_WT]: 'ExternalURI' },
  DV_EHR_URI:     { [BaseTypesFormat.FHIR]: 'uri',              [BaseTypesFormat.OPENEHR_RM]: 'DV_EHR_URI',     [BaseTypesFormat.OPENEHR_WT]: 'InternalURI' },
  DV_PARSABLE:    { [BaseTypesFormat.FHIR]: 'string',           [BaseTypesFormat.OPENEHR_RM]: 'DV_PARSABLE',    [BaseTypesFormat.OPENEHR_WT]: 'Parsable text' },
  DV_PROPORTION:  { [BaseTypesFormat.FHIR]: 'Ratio',            [BaseTypesFormat.OPENEHR_RM]: 'DV_PROPORTION',  [BaseTypesFormat.OPENEHR_WT]: 'Proportion' },
  DV_STATE:       { [BaseTypesFormat.FHIR]: 'State',            [BaseTypesFormat.OPENEHR_RM]: 'DV_STATE',       [BaseTypesFormat.OPENEHR_WT]: 'State' },
  DV_BOOLEAN:     { [BaseTypesFormat.FHIR]: 'boolean',          [BaseTypesFormat.OPENEHR_RM]: 'DV_BOOLEAN',     [BaseTypesFormat.OPENEHR_WT]: 'Boolean' },
  DV_DATE:        { [BaseTypesFormat.FHIR]: 'date',             [BaseTypesFormat.OPENEHR_RM]: 'DV_DATE',        [BaseTypesFormat.OPENEHR_WT]: 'Date' },
  DV_TIME:        { [BaseTypesFormat.FHIR]: 'time',             [BaseTypesFormat.OPENEHR_RM]: 'DV_DATE',        [BaseTypesFormat.OPENEHR_WT]: 'Time' },
  CODE_PHRASE:    { [BaseTypesFormat.FHIR]: 'Coding',           [BaseTypesFormat.OPENEHR_RM]: 'CODE_PHRASE',   [BaseTypesFormat.OPENEHR_WT]: 'CodePhrase' },
  PARTY_PROXY:    { [BaseTypesFormat.FHIR]: 'BackboneElement',  [BaseTypesFormat.OPENEHR_RM]: 'PARTY_PROXY',   [BaseTypesFormat.OPENEHR_WT]: 'Party' },
  STRING:         { [BaseTypesFormat.FHIR]: 'string',           [BaseTypesFormat.OPENEHR_RM]: 'STRING',        [BaseTypesFormat.OPENEHR_WT]: 'String' },
  EVALUATION:     { [BaseTypesFormat.FHIR]: 'Evaluation',       [BaseTypesFormat.OPENEHR_RM]: 'EVALUATION',    [BaseTypesFormat.OPENEHR_WT]: 'Evaluation' },
  SECTION:        { [BaseTypesFormat.FHIR]: 'Section',          [BaseTypesFormat.OPENEHR_RM]: 'SECTION',       [BaseTypesFormat.OPENEHR_WT]: 'Section' },
  OBSERVATION:    { [BaseTypesFormat.FHIR]: 'Observation',      [BaseTypesFormat.OPENEHR_RM]: 'OBSERVATION',   [BaseTypesFormat.OPENEHR_WT]: 'Observation' },
  INSTRUCTION:    { [BaseTypesFormat.FHIR]: 'Instruction',      [BaseTypesFormat.OPENEHR_RM]: 'INSTRUCTION',   [BaseTypesFormat.OPENEHR_WT]: 'Instruction' },
  ACTION:         { [BaseTypesFormat.FHIR]: 'Action',           [BaseTypesFormat.OPENEHR_RM]: 'ACTION',        [BaseTypesFormat.OPENEHR_WT]: 'Action' },
  ADMIN_ENTRY:    { [BaseTypesFormat.FHIR]: 'AdminEntry',       [BaseTypesFormat.OPENEHR_RM]: 'ADMIN_ENTRY',   [BaseTypesFormat.OPENEHR_WT]: 'Admin Entry' },
  GENERIC_ENTRY:  { [BaseTypesFormat.FHIR]: 'GenericEntry',     [BaseTypesFormat.OPENEHR_RM]: 'GENERIC_ENTRY', [BaseTypesFormat.OPENEHR_WT]: 'GenericEntry' },
  EVENT:          { [BaseTypesFormat.FHIR]: 'Event',            [BaseTypesFormat.OPENEHR_RM]: 'EVENT',         [BaseTypesFormat.OPENEHR_WT]: 'Event' },
  EVENT_CONTEXT:  { [BaseTypesFormat.FHIR]: 'BackboneElement',  [BaseTypesFormat.OPENEHR_RM]: 'EVENT_CONTEXT', [BaseTypesFormat.OPENEHR_WT]: 'EventContext' },
  CLUSTER:        { [BaseTypesFormat.FHIR]: 'Cluster',          [BaseTypesFormat.OPENEHR_RM]: 'CLUSTER',       [BaseTypesFormat.OPENEHR_WT]: 'Cluster' },
  COMPOSITION:    { [BaseTypesFormat.FHIR]: 'Composition',      [BaseTypesFormat.OPENEHR_RM]: 'COMPOSITION',   [BaseTypesFormat.OPENEHR_WT]: 'Composition' },
}

export const lookupDatatypeText = (rmType: string, format: BaseTypesFormat): string => {
   return DatatypeTable[rmType]?.[format] ?? `RM type not supported: ${rmType}`
}
export const openEHR2FHIRQuestionTypeTable = {
  ELEMENT: 'choice',
  DV_CODED_TEXT: 'choice',
  DV_TEXT: 'string',
  DV_ORDINAL: 'choice',
  DV_SCALE: 'choice',
  DV_QUANTITY: 'quantity',
  DV_DURATION: 'duration',
  DV_COUNT: 'quantity',
  DV_DATE_TIME: 'dateTime',
  DV_IDENTIFIER: 'identifier',
  DV_MULTIMEDIA: 'attachment',
  DV_URI: "uri",
  DV_EHR_URI: "uri",
  DV_PARSABLE: "string",
  DV_PROPORTION: "Proportion",
  DV_STATE: "State",
  DV_BOOLEAN: "boolean",
  DV_DATE: "date",
  DV_TIME: "time",
  CODE_PHRASE: "coding",
  PARTY_PROXY: "group",
  STRING: "string",
  EVALUATION:"group",
  SECTION: "group",
  OBSERVATION:"group",
  INSTRUCTION: "group",
  ACTION:"group",
  ADMIN_ENTRY: "group",
  GENERIC_ENTRY: "group",
  EVENT: "group",
  CLUSTER: "group",
  COMPOSITION: "group",

}

export const openEHRInterval2FHIRTable = {
  DV_QUANTITY: 'Range',
  DV_DURATION: 'Duration',
  DV_COUNT: 'Range',
  DV_DATE_TIME: 'Period',
  DV_PROPORTION: "Proportion",
  DV_DATE: "Period",
  DV_TIME: "Period",
}



export const dataValueLabelMapper = (dataValue: string) =>
  lookupDatatypeText(dataValue, BaseTypesFormat.OPENEHR_WT)

export const dataValueFHIRMapper = (dataValue: string) => {
  if (isBranchNode(dataValue))
    return 'BackboneElement'
  return lookupDatatypeText(dataValue, BaseTypesFormat.FHIR)
}

export const dataValueFHSLMapper = (dataValue: string) => {
  let rmType = dataValue
  let intervalPrefix = ''
  if (dataValue.startsWith('DV_INTERVAL')) {
    intervalPrefix = "DvInterval-"
    rmType = dataValue.replace(/(^.*<|>.*$)/g, '');
  }
  return `${intervalPrefix}${lookupDatatypeText(rmType, BaseTypesFormat.OPENEHR_RM)}`
}

export const dataValueFHIRQuestionTypeMapper = (dataValue: string): string => {
  if (isBranchNode(dataValue))
    return 'group'
  return openEHR2FHIRQuestionTypeTable[dataValue as keyof typeof openEHR2FHIRQuestionTypeTable] || `(FHIR Question type not supported) ${dataValue}`
}

export const dataValueIntervalFHIRMapper = (dataValue: string) =>
  openEHRInterval2FHIRTable[dataValue as keyof typeof openEHRInterval2FHIRTable] || `RM Interval type not supported ${dataValue}`


export const isMandatory = (node: TemplateNode): boolean => node.min > 0

export const isMultiple = (node: TemplateNode): boolean => (node.max != 1)

export const formatOccurrences = (f: TemplateNode, techDisplay :boolean = true) => {

  let min =''
  let max = ''

  if (techDisplay)
  {
    max = f.max < 0 ? '*' : `${f.max}`;
    return `${f.min}..${max}`
  }

  if (f.min === 0 && f.max ===1)
    return 'optional'

  if (f.min === 0)
    min= ''
  else
    if (f.min === 1)
    min = 'mandatory'
  else
    min = `${f.min}`

  if (f.max < 0)
    max = 'recurring'
  else if (f.max === 1)
    max = ''
  else
    max = `multiple: ${f.max}`

 if (min === '')
  return max
 else if (max === '')
  return min
 else
  return `${min}, ${max}`

}
