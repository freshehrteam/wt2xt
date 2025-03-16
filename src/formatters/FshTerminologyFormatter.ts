

import {snakeToCamel} from "../types/TemplateTypes";
import {TemplateNode} from "../types/TemplateNodes";
import {CodeSystem} from "@smile-cdr/fhirts/dist/FHIR-R4/classes/codeSystem";
import {ValueSet} from "@smile-cdr/fhirts/dist/FHIR-R4/classes/valueSet";
import {ValueSetInclude} from "@smile-cdr/fhirts/dist/FHIR-R4/classes/valueSetInclude";
import {ValueSetConcept} from "@smile-cdr/fhirts/dist/FHIR-R4/classes/valueSetConcept";
import {ValueSetDesignation} from "@smile-cdr/fhirts/dist/FHIR-R4/classes/valueSetDesignation";

const formatCodeSystemUrl = (node : TemplateNode) : string => `http://openehr.org/ckm/archetypes/${node.archetype_id}`

const formatValueSetId = (node : TemplateNode) : string =>`${snakeToCamel(node.archetype_id,false)}-${snakeToCamel(node.localizedName,false)}`

const formatValueSetUrl = (node : TemplateNode) : string => `http://openehr.org/ckm/archetypes/${node.archetype_id}`
// ``

//const formatValuesetName = (node : TemplateNode) : string => `http://openehr.org/ckm/archetypes/${node.archetype_id}`

export const appendCodesystem = ( node : TemplateNode): string => {

  const { codeSystems } = node.builder;

  const csUrl: string = formatCodeSystemUrl(node)
  const hasSystem = codeSystems.some(system => system.url === csUrl);

  if (hasSystem) return csUrl || ''

  const newCS = new CodeSystem();
  newCS.url = csUrl
  newCS.id = node.archetype_id

  codeSystems.push(newCS)
  return newCS.url || ''

}

export const appendValueset = ( node : TemplateNode): string => {

  const { valueSets } = node.builder;


  const vsId: string  = formatValueSetId(node)
  const vsUrl = formatValueSetUrl(node)
  const csUrl = formatCodeSystemUrl(node)

  const hasValueset = valueSets.some( valueSet => valueSet.id === vsId);

  if (hasValueset) return vsUrl || ''

  const newVS = new ValueSet();
  newVS.url = vsUrl
  newVS.id = vsId


  const vsInclude: ValueSetInclude = new ValueSetInclude();

  vsInclude.system = csUrl
  const vsConcept: ValueSetConcept = new ValueSetConcept()

  vsConcept.code = 'at005'
  vsConcept.display = 'Test'
  const vsDesignation: ValueSetDesignation = new ValueSetDesignation()

  vsDesignation.language = 'no-nb'
  vsDesignation.value = 'asasdad'

  vsConcept.designation?.push(vsDesignation)

  vsInclude.concept = []

  vsInclude.concept.push(vsConcept)

  newVS.compose?.include.push(vsInclude)


  valueSets.push(newVS)
  return newVS.url || ''

}


export const formatValueSetDefinition = ( node: TemplateNode) => {

  const { ab } = node.builder;
  const techName = snakeToCamel(node.localizedName, true);

  ab.newline('');
  ab.append(`ValueSet: ${techName}`);
  ab.append(`Title: "${node.localizedName}"`);
}


