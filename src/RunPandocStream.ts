type PandocStreamOptions = {
    input: Uint8Array | ReadableStream;
    outputFormat: string;               // e.g. 'pdf', 'html', 'docx'
    inputFormat?: string;               // e.g. 'docbook'
    pdfEngine?: string;                 // e.g. 'xelatex'
    image?: string;                     // Docker image name
};

export async function runPandocDockerStream(options: PandocStreamOptions): Promise<Uint8Array> {
    const {
        input,
        outputFormat,
        inputFormat = 'docbook',
        pdfEngine = 'xelatex',
        image = 'pandoc/latex:3.4'
    } = options;

    const cmd = [
        'docker', 'run', '--rm', '-i',
        image,
        '-f', inputFormat,
        '-t', outputFormat,
        ...(outputFormat === 'pdf' ? [`--pdf-engine=${pdfEngine}`] : [])
    ];

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
export async function runPandocDockerComposeStream(options: PandocStreamOptions & { network?: string }): Promise<Uint8Array> {
    const {
        input,
        outputFormat,
        inputFormat = 'docbook',
        pdfEngine = 'xelatex',
        image = 'pandoc/latex:3.4',
        network
    } = options;

    const net = network || Bun.env.DOCKER_COMPOSE_NETWORK || Bun.env.PANDOC_NETWORK || 'frontend';

    const cmd = [
        'docker', 'run', '--rm', '-i', '--volume', net,
        image,
        '-f', inputFormat,
        '-t', outputFormat,
        ...(outputFormat === 'pdf' ? [`--pdf-engine=${pdfEngine}`] : [])
    ];

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

// Run pandoc directly (no Docker). Useful when running inside a container to avoid docker-in-docker.
export async function runPandocLocalStream(options: PandocStreamOptions): Promise<Uint8Array> {
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

