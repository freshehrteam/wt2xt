#!/usr/bin/env bun
import yargs from "yargs"
//import ora from 'ora';
import  * as fs from 'fs';
import { DocBuilder } from './DocBuilder';
import type { Config } from './BuilderConfig';
import { importConfig } from './BuilderConfig';
import {ExportFormat} from './formatters/DocFormatter';

const args = yargs(process.argv.slice(2)).options({
  'web-template': { type: 'string', describe: 'web template name',demandOption: true, alias: 'wt' },
  'out-file': { type: 'string', describe: 'Output file',demandOption: false, alias: 'o' },
  'out-dir': { type: 'string', demandOption: false, describe: 'Output folder', alias: 'od', default: './out'},
  'in-dir': { type: 'string', demandOption: false, describe: 'Input folder', alias: 'id', default: './templates'},
  'config-file': { type: 'string', demandOption: false, describe: 'Config file',alias: 'cfg', default: "./config/wtconfig.json"},
  'export-format': { type: 'string', demandOption: false, describe: 'Export format: adoc|docx|xmind|pdf|fshl|fshq (default: adoc)',alias: 'ex', default: "adoc"},
}).argv;

const config:Config = importConfig(args['config-file'])
const exportFormatKey = args['export-format'] as keyof typeof ExportFormat;

config.inFilePath = args['web-template']
config.inFileDir = args['in-dir']
config.exportFormat  = ExportFormat[exportFormatKey];
config.outFileDir = args['out-dir']
config.outFilePath = args['out-file']

console.log(`Processing ${config.inFilePath}`);

if (fs.existsSync(config.inFilePath)) {
  const inDoc:string = fs.readFileSync(config.inFilePath, { encoding: 'utf8', flag: 'r' });
  const docBuilder = new DocBuilder(JSON.parse(inDoc), config);

  await docBuilder.run();
}
else
  console.log('The input file does not exist:' + config.inFilePath);

//spinner.stop();
//spinner.clear()
