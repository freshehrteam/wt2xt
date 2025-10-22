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
