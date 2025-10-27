type PandocStreamOptions = {
    input: Uint8Array | ReadableStream;
    outputFormat: string;               // e.g. 'pdf', 'html', 'docx'
    inputFormat?: string;               // e.g. 'docbook'
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

// New: run pandoc using docker-compose shared network
export async function runPandocDockerComposeStream(options: PandocStreamOptions & { template?: string }): Promise<Uint8Array> {
    const {
        input,
        outputFormat,
        inputFormat = 'docbook',
        pdfEngine = 'xelatex',
        image = 'pandoc/latex:3.4',

    } = options;

    // Auto-detect platform if not specified

    const cmd = [
        'docker', 'run', '--rm', '-i',
        '--volume', '/var/run/docker.sock:/var/run/docker.sock',
        image,
        '-f', inputFormat,
        '-t', outputFormat,
        ...(outputFormat === 'pdf' ? [`--pdf-engine=${pdfEngine}`] : [])
    ];
//    console.log('Host Docker stream')

    return await processPanDocstream(cmd, input);
}

export async function runPandocDockerStream(options: PandocStreamOptions): Promise<Uint8Array> {
    const {
        input,
        outputFormat,
        inputFormat = 'docbook',
        pdfEngine = 'xelatex',
        image = 'pandoc/latex:3.4',

    } = options;

    // Auto-detect platform if not specified

    const cmd = [
        'docker', 'run', '--rm', '-i',
        '--volume', '/var/run/docker.sock:/var/run/docker.sock',
        image,
        '-f', inputFormat,
        '-t', outputFormat,
        ...(outputFormat === 'pdf' ? [`--pdf-engine=${pdfEngine}`] : [])
    ];
//    console.log('Host Docker stream')

    return await processPanDocstream(cmd, input);
}


// Run pandoc directly (no Docker). Useful when running inside a container to avoid docker-in-docker.
export async function runPandocLocalStream(options: PandocStreamOptions & { template?: string }): Promise<Uint8Array> {
    const {
        input,
        outputFormat,
        inputFormat = 'docbook',
        pdfEngine = 'xelatex',
    } = options;

    const cmd = [
        'pandoc',
        '-f', inputFormat,
        '-t', outputFormat,
        ...(outputFormat === 'pdf' ? [`--pdf-engine=${pdfEngine}`] : [])
    ];

//    console.log('local Docker pandoc stream', cmd)
    return await processPanDocstream(cmd, input);


}

