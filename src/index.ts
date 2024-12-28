#!/usr/bin/env bun
import yargs from "yargs"
import ora from 'ora';
import  * as fs from 'node:fs';
import { DocBuilder } from './DocBuilder';
import type { Config } from './BuilderConfig';
import { importConfig } from './BuilderConfig';
import { ExportFormat } from './formatters/DocFormatter';

const args = yargs(process.argv.slice(2)).options({
  'web-template': { type: 'string', describe: 'web template name',demandOption: true, alias: 'wt' },
  'out-file': { type: 'string', describe: 'Output file',demandOption: false, alias: 'o' },
  'out-dir': { type: 'string', demandOption: false, describe: 'Output folder', alias: 'od', default: './out'},
  'in-dir': { type: 'string', demandOption: false, describe: 'Input folder', alias: 'id', default: './templates'},
  'config-file': { type: 'string', demandOption: false, describe: 'Config file',alias: 'cfg', default: "./config/wtconfig.json"},
  'export-format': { type: 'string', demandOption: false, describe: 'Export format: adoc|docx|xmind|pdf|fshl (default: adoc)',alias: 'ex', default: "adoc"},
}).argv;

const config:Config = importConfig(args['config-file'])
const exportFormatKey = args['export-format'] as keyof typeof ExportFormat;

config.inFilePath = args['web-template']
config.inFileDir = args['in-dir']
config.exportFormat  = ExportFormat[exportFormatKey];
config.outFileDir = args['out-dir']
config.outFilePath = args['out-file']

const spinner = ora(`Processing ${config.inFilePath}`).start();

if (fs.existsSync(config.inFilePath)) {
  const inDoc:string = fs.readFileSync(config.inFilePath, { encoding: 'utf8', flag: 'r' });
  new DocBuilder(JSON.parse(inDoc), config);
}
else
  console.log('The input file does not exist:' + config.inFilePath);

spinner.stop();
