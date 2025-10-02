// src/lib/docker.ts
import Docker from 'dockerode';
import { PassThrough } from 'stream';

const docker = new Docker({ socketPath: '/var/run/docker.sock' });

export async function runOneShot(
    image: string,
    cmd: string[] = [],
    stdinData?: string | Buffer
): Promise<{ statusCode: number; stdout: Buffer; stderr: string }> {

    // Ensure image present (optional; remove if images are pre-pulled)
    await new Promise<void>((resolve, reject) => {
        docker.pull(image, (err: any, stream: NodeJS.ReadableStream) => {
            if (err) return reject(err);
            docker.modem.followProgress(stream, (e) => (e ? reject(e) : resolve()));
        });
    });

    // Prepare output capture streams
    const stdoutStream = new PassThrough();
    const stderrStream = new PassThrough();
    const stdoutChunks: Buffer[] = [];
    const stderrChunks: Buffer[] = [];
    stdoutStream.on('data', (buf: Buffer) => stdoutChunks.push(buf));
    stderrStream.on('data', (buf: Buffer) => stderrChunks.push(buf));

    // Use docker.run() with demuxed stdout/stderr
    const createOptions: any = {
        Image: image,
        Cmd: cmd,
        HostConfig: { AutoRemove: true },
        AttachStdout: true,
        AttachStderr: true,
        AttachStdin: Boolean(stdinData),
        OpenStdin: Boolean(stdinData),
        StdinOnce: Boolean(stdinData),
        Tty: false,
    };

    const statusCode = await new Promise<number>((resolve, reject) => {
        const hub: any = (docker as any).run(image, cmd, [stdoutStream, stderrStream], createOptions, {}, (err: any, result: any, _container: any) => {
            if (err) return reject(err);
            const code = (result && (result.StatusCode ?? result.Status ?? result.code)) ?? 0;
            resolve(code);
        });

        if (stdinData) {
            hub.on('stream', (stream: any) => {
                try {
                    stream.write(stdinData);
                } catch {}
                try {
                    if (stream.end) stream.end();
                } catch {}
            });
        }
    });

    const stdout = Buffer.concat(stdoutChunks);
    const stderr = Buffer.concat(stderrChunks).toString();
    return { statusCode, stdout, stderr };
}
