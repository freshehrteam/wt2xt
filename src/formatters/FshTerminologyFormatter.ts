

import {snakeToCamel} from "../types/TemplateTypes";
import {TemplateNode} from "../types/TemplateNodes";
import {CodeSystem} from "@smile-cdr/fhirts/dist/FHIR-R4/classes/codeSystem";

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


export const formatValueSetDefinition = ( node: TemplateNode) => {

  const { ab } = node.builder;
  const techName = snakeToCamel(node.localizedName, true);

  ab.newline('');
  ab.append(`ValueSet: ${techName}`);
  ab.append(`Title: "${node.localizedName}"`);
}


