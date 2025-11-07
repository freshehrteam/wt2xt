import path from "path";

 type PandocStreamOptions = {
     input: Uint8Array | ReadableStream;
     outputFormat: string;               // e.g. 'pdf', 'html', 'docx'
     inputFormat?: string;
     title: string// e.g. 'docbook'
     pdfEngine?: string;                 // e.g. 'xelatex'
     image?: string;
     template?: string;                   // Latex template name
     platform?: string;                   // e.g. 'linux/arm64', 'linux/amd64'
 };

 const processPanDocstream = async(cmd: string[] , input: Uint8Array<ArrayBufferLike> | ReadableStream<any>): Promise<Uint8Array> => {
     const proc = Bun.spawn(cmd, {
         stdin: typeof input === 'object' && 'getReader' in input
             ? input
             : new Blob([input]).stream(),
         stdout: 'pipe',
         stderr: 'inherit'
     });

     const chunks: Uint8Array[] = [];
     for await (const chunk of proc.stdout) {
         chunks.push(chunk);
     }

     const totalLength = chunks.reduce((sum, c) => sum + c.length, 0);
     const output = new Uint8Array(totalLength);
     let offset = 0;
     for (const chunk of chunks) {
         output.set(chunk, offset);
         offset += chunk.length;
     }

     return output;
 }

 // Helpers to remove duplication
 const buildPandocArgs = (
     outputFormat: string,
     inputFormat: string,
     pdfEngine: string,
     cssPath: string,
     title: string = ''  // Add title parameter with default
 ): string[] => {
     return [
         '-f', inputFormat,
         '-t', 'html5',
         '--standalone',
         '--metadata', `title=${title}`,  // Add title metadata
         '--css', cssPath,
         '--embed-resources',
         ...(outputFormat === 'pdf' ? [`--pdf-engine=${pdfEngine}`] : [])
     ];
 };

const runWithDocker = async (image: string, args: string[], input: Uint8Array | ReadableStream): Promise<Uint8Array> => {
    // When running inside Docker, we need to use the host's actual path
    // Otherwise, use the current working directory
    const hostConfigPath = process.env.HOST_CONFIG_DIR || `${process.cwd()}/config`;
console.log('path', hostConfigPath);
    const cmd = [
        'docker', 'run', '--rm', '-i',
        '--volume', `${hostConfigPath}:/config:ro`,  // Mount from host path
        '--volume', '/var/run/docker.sock:/var/run/docker.sock',
        image,
        ...args,
    ];
    return await processPanDocstream(cmd, input);
};

 const runLocal = async (args: string[], input: Uint8Array | ReadableStream): Promise<Uint8Array> => {
     const cmd = [
         'pandoc',
         ...args,
     ];
     return await processPanDocstream(cmd, input);
 };

 // New: run pandoc using docker-compose shared network
 export async function runPandocDockerComposeStream(options: PandocStreamOptions & { template?: string }): Promise<Uint8Array> {
     // Delegate to the Docker runner (same behavior)
     return runPandocDockerStream(options);
 }

 export async function runPandocDockerStream(options: PandocStreamOptions): Promise<Uint8Array> {
     const {
         input,
         outputFormat,
         inputFormat = 'docbook',
         pdfEngine = 'xelatex',
         image = 'pandoc/latex:3.4',

     } = options;

     const args = buildPandocArgs(
         outputFormat,
         inputFormat,
         pdfEngine,
         '/config/defaultOutput.css'
     );


     return await runWithDocker(image, args, input);
 }


 // Run pandoc directly (no Docker). Useful when running inside a container to avoid docker-in-docker.
 export async function runPandocLocalStream(options: PandocStreamOptions & { template?: string }): Promise<Uint8Array> {
     const {
         input,
         outputFormat,
         inputFormat = 'docbook',
         pdfEngine = 'xelatex',
         title
     } = options;

     const args = buildPandocArgs(
         outputFormat,
         inputFormat,
         pdfEngine,
         './config/defaultOutput.css',
         title
     );

     return await runLocal(args, input);
 }
