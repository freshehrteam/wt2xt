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

export const mapRmTypeText = (rmTypeString: string, baseTypesFormat: BaseTypesFormat) => {
  let rmType = rmTypeString
  let intervalPrefix = ''
  if (rmTypeString.startsWith('DV_INTERVAL')) {
    intervalPrefix = "Interval of "
    rmType = rmTypeString.replace(/(^.*<|>.*$)/g, '');
  }
  return `${intervalPrefix}${lookupDatatypeText(rmType, baseTypesFormat)}`
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

export const mapRmType2FHIR = (rmTypeString: string, baseTypesFormat: BaseTypesFormat) => {
  switch (baseTypesFormat) {
    case BaseTypesFormat.fhir:
      return dataValueFHIRMapper(rmTypeString)
    default:
      return dataValueFHSLMapper(rmTypeString, baseTypesFormat)
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
  'fhir',
  'rm',
  'wt',
  'cdi'
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
  ELEMENT:        { [BaseTypesFormat.fhir]: 'Choice',           [BaseTypesFormat.rm]: 'ELEMENT',         [BaseTypesFormat.wt]: 'Choice',         [BaseTypesFormat.cdi]: 'DataValueType' },
  DV_CODED_TEXT:  { [BaseTypesFormat.fhir]: 'CodeableConcept',  [BaseTypesFormat.rm]: 'DV_CODED_TEXT',  [BaseTypesFormat.wt]: 'CodedText',      [BaseTypesFormat.cdi]: 'ConceptType' },
  DV_TEXT:        { [BaseTypesFormat.fhir]: 'CodeableConcept',  [BaseTypesFormat.rm]: 'DV_TEXT',        [BaseTypesFormat.wt]: 'Text',           [BaseTypesFormat.cdi]: 'ConceptType' },
  DV_ORDINAL:     { [BaseTypesFormat.fhir]: 'CodeableConcept',  [BaseTypesFormat.rm]: 'DV_ORDINAL',     [BaseTypesFormat.wt]: 'Ordinal',        [BaseTypesFormat.cdi]: 'OrdinalType' },
  DV_SCALE:       { [BaseTypesFormat.fhir]: 'CodeableConcept',  [BaseTypesFormat.rm]: 'DV_SCALE',       [BaseTypesFormat.wt]: 'Scale',          [BaseTypesFormat.cdi]: 'OrdinalType' },
  DV_QUANTITY:    { [BaseTypesFormat.fhir]: 'Quantity',         [BaseTypesFormat.rm]: 'DV_QUANTITY',    [BaseTypesFormat.wt]: 'Quantity',       [BaseTypesFormat.cdi]: 'QuantityType' },
  DV_DURATION:    { [BaseTypesFormat.fhir]: 'Duration',         [BaseTypesFormat.rm]: 'DV_DURATION',    [BaseTypesFormat.wt]: 'Duration',       [BaseTypesFormat.cdi]: 'DurationType' },
  DV_COUNT:       { [BaseTypesFormat.fhir]: 'Count',            [BaseTypesFormat.rm]: 'DV_COUNT',       [BaseTypesFormat.wt]: 'Count',          [BaseTypesFormat.cdi]: 'NumberType' },
  DV_DATE_TIME:   { [BaseTypesFormat.fhir]: 'dateTime',         [BaseTypesFormat.rm]: 'DV_DATE_TIME',   [BaseTypesFormat.wt]: 'DateTime',       [BaseTypesFormat.cdi]: 'DateTimeType' },
  DV_INTERVAL:    {                                             [BaseTypesFormat.rm]: 'DV_INTERVAL',                                            [BaseTypesFormat.cdi]: 'RangeType' },
  DV_IDENTIFIER:  { [BaseTypesFormat.fhir]: 'Identifier',        [BaseTypesFormat.rm]: 'DV_IDENTIFIER',  [BaseTypesFormat.wt]: 'Identifier',      [BaseTypesFormat.cdi]: 'IdentifierType' },
  DV_MULTIMEDIA:  { [BaseTypesFormat.fhir]: 'Attachment',       [BaseTypesFormat.rm]: 'DV_MULTIMEDIA',  [BaseTypesFormat.wt]: 'Multimedia',     [BaseTypesFormat.cdi]: 'AttachmentType' },
  DV_URI:         { [BaseTypesFormat.fhir]: 'uri',              [BaseTypesFormat.rm]: 'DV_URI',         [BaseTypesFormat.wt]: 'ExternalURI',    [BaseTypesFormat.cdi]: 'UrlType' },
  DV_EHR_URI:     { [BaseTypesFormat.fhir]: 'uri',              [BaseTypesFormat.rm]: 'DV_EHR_URI',     [BaseTypesFormat.wt]: 'InternalURI',    [BaseTypesFormat.cdi]: 'UrlType' },
  DV_PARSABLE:    { [BaseTypesFormat.fhir]: 'string',           [BaseTypesFormat.rm]: 'DV_PARSABLE',    [BaseTypesFormat.wt]: 'Parsable text',  [BaseTypesFormat.cdi]: 'StringType' },
  DV_PROPORTION:  { [BaseTypesFormat.fhir]: 'Ratio',            [BaseTypesFormat.rm]: 'DV_PROPORTION',  [BaseTypesFormat.wt]: 'Proportion',     [BaseTypesFormat.cdi]: 'QuantityType' },
  DV_STATE:       { [BaseTypesFormat.fhir]: 'State',            [BaseTypesFormat.rm]: 'DV_STATE',       [BaseTypesFormat.wt]: 'State',          [BaseTypesFormat.cdi]: 'CodeType' },
  DV_BOOLEAN:     { [BaseTypesFormat.fhir]: 'boolean',          [BaseTypesFormat.rm]: 'DV_BOOLEAN',     [BaseTypesFormat.wt]: 'Boolean',        [BaseTypesFormat.cdi]: 'BooleanType' },
  DV_DATE:        { [BaseTypesFormat.fhir]: 'date',             [BaseTypesFormat.rm]: 'DV_DATE',        [BaseTypesFormat.wt]: 'Date',           [BaseTypesFormat.cdi]: 'DateTimeType' },
  DV_TIME:        { [BaseTypesFormat.fhir]: 'time',             [BaseTypesFormat.rm]: 'DV_DATE',        [BaseTypesFormat.wt]: 'Time',           [BaseTypesFormat.cdi]: 'DateTimeType' },
  CODE_PHRASE:    { [BaseTypesFormat.fhir]: 'Coding',           [BaseTypesFormat.rm]: 'CODE_PHRASE',    [BaseTypesFormat.wt]: 'CodePhrase',     [BaseTypesFormat.cdi]: 'CodeType' },
  PARTY_PROXY:    { [BaseTypesFormat.fhir]: 'BackboneElement',  [BaseTypesFormat.rm]: 'PARTY_PROXY',    [BaseTypesFormat.wt]: 'Party',          [BaseTypesFormat.cdi]: 'ReferenceType' },
  STRING:         { [BaseTypesFormat.fhir]: 'string',           [BaseTypesFormat.rm]: 'string',         [BaseTypesFormat.wt]: 'String',         [BaseTypesFormat.cdi]: 'StringType' },
  EVALUATION:     { [BaseTypesFormat.fhir]: 'Evaluation',       [BaseTypesFormat.rm]: 'EVALUATION',     [BaseTypesFormat.wt]: 'Evaluation',     [BaseTypesFormat.cdi]: 'Entry' },
  SECTION:        { [BaseTypesFormat.fhir]: 'Section',          [BaseTypesFormat.rm]: 'SECTION',        [BaseTypesFormat.wt]: 'Section',        [BaseTypesFormat.cdi]: 'Section' },
  OBSERVATION:    { [BaseTypesFormat.fhir]: 'Observation',      [BaseTypesFormat.rm]: 'OBSERVATION',    [BaseTypesFormat.wt]: 'Observation',    [BaseTypesFormat.cdi]: 'Entry' },
  INSTRUCTION:    { [BaseTypesFormat.fhir]: 'Instruction',      [BaseTypesFormat.rm]: 'INSTRUCTION',    [BaseTypesFormat.wt]: 'Instruction',    [BaseTypesFormat.cdi]: 'Entry' },
  ACTION:         { [BaseTypesFormat.fhir]: 'Action',           [BaseTypesFormat.rm]: 'ACTION',         [BaseTypesFormat.wt]: 'Action',         [BaseTypesFormat.cdi]: 'Entry' },
  ADMIN_ENTRY:    { [BaseTypesFormat.fhir]: 'AdminEntry',       [BaseTypesFormat.rm]: 'ADMIN_ENTRY',    [BaseTypesFormat.wt]: 'Admin Entry',    [BaseTypesFormat.cdi]: 'Entry' },
  GENERIC_ENTRY:  { [BaseTypesFormat.fhir]: 'GenericEntry',     [BaseTypesFormat.rm]: 'GENERIC_ENTRY',  [BaseTypesFormat.wt]: 'GenericEntry',   [BaseTypesFormat.cdi]: 'Entry' },
  EVENT:          { [BaseTypesFormat.fhir]: 'Event',            [BaseTypesFormat.rm]: 'EVENT',          [BaseTypesFormat.wt]: 'Event',          [BaseTypesFormat.cdi]: 'BackboneElement' },
  EVENT_CONTEXT:  { [BaseTypesFormat.fhir]: 'BackboneElement',  [BaseTypesFormat.rm]: 'EVENT_CONTEXT',  [BaseTypesFormat.wt]: 'EventContext',   [BaseTypesFormat.cdi]: 'BackboneElement' },
  CLUSTER:        { [BaseTypesFormat.fhir]: 'Cluster',          [BaseTypesFormat.rm]: 'CLUSTER',        [BaseTypesFormat.wt]: 'Cluster',        [BaseTypesFormat.cdi]: 'BackboneElement' },
  COMPOSITION:    { [BaseTypesFormat.fhir]: 'Composition',      [BaseTypesFormat.rm]: 'COMPOSITION',    [BaseTypesFormat.wt]: 'Composition',    [BaseTypesFormat.cdi]: 'Composition' },
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
  lookupDatatypeText(dataValue, BaseTypesFormat.wt)

export const dataValueFHIRMapper = (dataValue: string) => {
  if (isBranchNode(dataValue))
    return 'BackboneElement'
  return lookupDatatypeText(dataValue, BaseTypesFormat.fhir)
}

export const dataValueFHSLMapper = (dataValue: string, baseTypesFormat: BaseTypesFormat) => {
  let rmType = dataValue

  let intervalPrefix = ''
  let intervalSuffix = ''
  if (dataValue.startsWith('DV_INTERVAL')) {
    intervalPrefix = "DV_INTERVAL<"
    intervalSuffix = ">"
    rmType = dataValue.replace(/(^.*<|>.*$)/g, '');
  }
  return `${intervalPrefix}${lookupDatatypeText(rmType, baseTypesFormat)}${intervalSuffix}`
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
