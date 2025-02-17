

import {snakeToCamel} from "../types/TemplateTypes";
import {TemplateNode} from "../types/TemplateNodes";
import {CodeSystem} from "@smile-cdr/fhirts/dist/FHIR-R4/classes/codeSystem";
import {ValueSet} from "@smile-cdr/fhirts/dist/FHIR-R4/classes/valueSet";
import {ValueSetInclude} from "@smile-cdr/fhirts/dist/FHIR-R4/classes/valueSetInclude";
import {ValueSetConcept} from "@smile-cdr/fhirts/dist/FHIR-R4/classes/valueSetConcept";

export const appendCodesystem = ( node : TemplateNode): string => {

  const { codeSystems } = node.builder;

  const csUrl = `http://openehr.org/localCS/${node.archetype_id}`;

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

  const vsId  = `${snakeToCamel(node.archetype_id,false)}-${snakeToCamel(node.localizedName,false)}`
  const vsUrl = `http://openehr.org/localVS/${vsId}`;
  const csUrl = `http://openehr.org/localCS/${node.archetype_id}`;

  const hasValueset = valueSets.some(system => system.url === vsUrl);

  if (hasValueset) return vsUrl || ''

  const newVS = new ValueSet();
  newVS.url = vsUrl
  newVS.id = node.archetype_id

  const vsInclude: ValueSetInclude = new ValueSetInclude();

  vsInclude.system = csUrl
  const vsConcept: ValueSetConcept = new ValueSetConcept()

  vsConcept.code = 'at005'
  vsConcept.display = 'Test'

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


