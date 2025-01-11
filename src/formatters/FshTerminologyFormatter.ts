

import { StringBuilder } from '../StringBuilder';
import {snakeToCamel} from "../types/TemplateTypes";
import {TemplateNode} from "../types/TemplateNodes";

export const formatValueSetDefinition = ( f: TemplateNode) => {

  const { ab } = f.builder;
  const techName = snakeToCamel(f.localizedName, true);

  ab.newline('');

  ab.append(`Alias: $local = http://openehr.org/${f.archetype_id}`);
  ab.append(`ValueSet: ${techName}`);
  ab.append(`Title: "${f.localizedName}"`);
}

export const formatCodeSystemDefinition = ( f: TemplateNode) => {

  const { cb } = f.builder;

  cb.newline('')
  cb.append(`CodeSystem: http://openehr.org/${f.archetype_id}CS`);
  cb.append(`Id: ${f.archetype_id}}`);
  // url, status, purpose, and other metadata could be defined here using caret syntax (omitted)
}

export const appendCodeSystemItem = (cb : StringBuilder, itemCode: string, itemDescription:string, itemRubric: string) => {
  cb.append(`* #${itemCode} ${itemRubric} 
      "${itemDescription}"`)
}

export const fsht = {



}
