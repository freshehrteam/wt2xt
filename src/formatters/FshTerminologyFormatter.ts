

import {snakeToCamel} from "../types/TemplateTypes";
import {TemplateNode} from "../types/TemplateNodes";
import {CodeSystem} from "@smile-cdr/fhirts/dist/FHIR-R4/classes/codeSystem";
import {ValueSet} from "@smile-cdr/fhirts/dist/FHIR-R4/classes/valueSet";
import {ValueSetInclude} from "@smile-cdr/fhirts/dist/FHIR-R4/classes/valueSetInclude";
import {ValueSetConcept} from "@smile-cdr/fhirts/dist/FHIR-R4/classes/valueSetConcept";
import {ValueSetDesignation} from "@smile-cdr/fhirts/dist/FHIR-R4/classes/valueSetDesignation";
import {DocBuilder} from "../DocBuilder.ts";

const formatCodeSystemUrl = (node : TemplateNode) : string => `http://openehr.org/archetypes/${node.archetype_id}/CS`
const formatCodeSystemId = (node : TemplateNode) : string =>`CodeSystem-${snakeToCamel(node.localizedName,true)}`


const formatValueSetId = (node : TemplateNode) : string =>`Valueset-${snakeToCamel(node.archetype_id,false)}-${snakeToCamel(node.localizedName, true)}`
const formatValueSetUrl = (node : TemplateNode) : string => `http://openehr.org/archetypes/${node.archetype_id}`
// ``

export const appendCodeSystemFSH = ( docBuilder :DocBuilder) => {
    return
    const {cb, codeSystems} = docBuilder;
    for (const cs of codeSystems) {
        cb.newline('')
        cb.append(`CodeSystem: ${cs.id}`);
        cb.append(`Id: ${cs.id}`);
        cb.append( `Title: "${cs.title}"`);
        cb.newline(`* ^url = "${cs.url}"`)
    }
}

//const formatValuesetName = (node : TemplateNode) : string => `http://openehr.org/ckm/archetypes/${node.archetype_id}`

export const appendCodesystem = ( node : TemplateNode): string => {

  const { codeSystems } = node.builder;

  const csUrl: string = formatCodeSystemUrl(node)
  const hasSystem = codeSystems.some(system => system.url === csUrl);

  if (hasSystem) return csUrl || ''

  const newCS = new CodeSystem();
  const csId = formatCodeSystemId(node)
  newCS.url = csUrl
  newCS.id = csId
  newCS.title= node.localizedName

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

const getUniqueName = (base: string, existing: string[] | Set<string>): string => {
    const has = (name: string) =>
        Array.isArray(existing) ? existing.includes(name) : (existing as Set<string>).has(name);

    if (!has(base)) return base;

    // Start at 2: first duplicate becomes <base>2
    let i = 2;
    let candidate = `${base}${i}`;
    while (has(candidate)) {
        i += 1;
        candidate = `${base}${i}`;
    }
    return candidate;
};

export const formatValueSetDefinition = (node: TemplateNode):string => {
    const { ab, valueSetNames,fshLogicalRoot } = node.builder; // valueSetNames: string[] or Set<string>

    const baseTechName = `${fshLogicalRoot}${snakeToCamel(node.localizedName, true)}`;
    const uniqueTechName = getUniqueName(baseTechName, valueSetNames);

    // Track the chosen name to avoid collisions later in the same run
    if (Array.isArray(valueSetNames)) {
        valueSetNames.push(uniqueTechName);
    } else {
        (valueSetNames as Set<string>).add(uniqueTechName);
    }

    ab.newline('');
    ab.append(`ValueSet: ${uniqueTechName}`);
    ab.append(`Title: "${node.localizedName}"`);

    return uniqueTechName
};



