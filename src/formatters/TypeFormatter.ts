import { DocBuilder } from "../DocBuilder";
import { TemplateNode } from "../types/TemplateNodes";
import { ExportFormat, FormatElementFn } from "./DocFormatter";
import { fshl } from "./FshLogicalModelFormatter";
 import { fshq } from "./FshQuestionnaireFormatter";
import { adoc } from "./AdocFormatter";
import { xmind } from "./XmindFormatter";
import {csv} from "./CsvFormatter.ts";

export const formatDvCodedText = (docBuilder: DocBuilder, f: TemplateNode): void => {

  let fn: FormatElementFn;

  switch (docBuilder.config.exportFormat) {
    case ExportFormat.xmind:
      fn = xmind.dvTypes.formatDvCodedText
      break;
    case ExportFormat.fshl:
      fn = fshl.dvTypes.formatDvCodedText
      break;
      case ExportFormat.fshq:
      fn = fshq.dvTypes.formatDvCodedText
      break;
    case ExportFormat.csv:
      fn = csv.dvTypes.formatDvCodedText
      break;

    default:
      fn = adoc.dvTypes.formatDvCodedText
      break;
  }

  if (fn)
    fn(docBuilder, f);
}

// export const formatDvChoice = (docBuilder: DocBuilder, f: TemplateNode): void => {
//
//   let fn: FormatElementFn;
//
//   switch (docBuilder.config.exportFormat) {
//     case ExportFormat.xmind:
//       break;
//     case ExportFormat.fsh:
//       break;
//     default:
//       fn = adoc.dvTypes.formatDvChoice
//       break;
//   }
//
//   if (fn)
//     fn(docBuilder, f);
// }

export const formatDvText = (docBuilder: DocBuilder, f: TemplateNode): void => {

  let fn: FormatElementFn;

  switch (docBuilder.config.exportFormat) {
    case ExportFormat.xmind:
      fn = xmind.dvTypes.formatDvText
      break;
    case ExportFormat.fshl:
      fn = fshl.dvTypes.formatDvText
      break;
    case ExportFormat.fshq:
      fn = fshq.dvTypes.formatDvText
      break;
    case ExportFormat.csv:
      fn = csv.dvTypes.formatDvText
      break;

    default:
      fn = adoc.dvTypes.formatDvText
      break;
  }
  if (fn)
    fn(docBuilder, f);
}

export const formatDvCount = (docBuilder: DocBuilder, f: TemplateNode): void => {

  let fn: FormatElementFn = () => {};

  switch (docBuilder.config.exportFormat) {
    case ExportFormat.xmind:
    case ExportFormat.fshl:
    case ExportFormat.fshq:
      break;
    case ExportFormat.csv:
      fn = csv.dvTypes.formatDvDefault
      break;
    default:
      fn = adoc.dvTypes.formatDvCount
      break;
  }
  if (fn)
    fn(docBuilder, f);
}

export const formatDvQuantity = (docBuilder: DocBuilder, f: TemplateNode): void => {

  let fn: FormatElementFn = () => {};

  switch (docBuilder.config.exportFormat) {
    case ExportFormat.xmind:
     break;
    case ExportFormat.fshl:
      fn = fshl.dvTypes.formatDvQuantity
      break;
      case ExportFormat.fshq:
      fn = fshq.dvTypes.formatDvQuantity
      break;
    case ExportFormat.csv:
      fn = csv.dvTypes.formatDvQuantity
      break;
    default:
      fn = adoc.dvTypes.formatDvQuantity
      break;
  }
  if (fn)
    fn(docBuilder, f);
}

export const formatDvOrdinal = (docBuilder: DocBuilder, f: TemplateNode): void => {

  let fn: FormatElementFn = () => {};

  switch (docBuilder.config.exportFormat) {
    case ExportFormat.xmind:
      fn = xmind.dvTypes.formatDvOrdinal
      break;
    case ExportFormat.fshl:
      break;
      case ExportFormat.fshq:
      break;
    case ExportFormat.csv:
      fn = csv.dvTypes.formatDvDefault
      break;
    default:
      fn = adoc.dvTypes.formatDvOrdinal
      break;
  }
  if (fn)
    fn(docBuilder, f);
}
export const formatDvDefault = (docBuilder: DocBuilder, f: TemplateNode): void => {

  let fn: FormatElementFn = () => {};

  switch (docBuilder.config.exportFormat) {
    case ExportFormat.xmind:
      break;
    case ExportFormat.fshl:
      fn = fshl.dvTypes.formatDvDefault
      break;
      case ExportFormat.fshq:
      fn = fshq.dvTypes.formatDvDefault
      break;
    case ExportFormat.csv:
      fn = csv.dvTypes.formatDvDefault
      break;
    default:
      fn = adoc.dvTypes.formatDvDefault
      break;
  }
  if (fn)
    fn(docBuilder, f);
}
