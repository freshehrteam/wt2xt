// src/lib/docker.ts
import Docker from 'dockerode';

const docker = new Docker({ socketPath: '/var/run/docker.sock' });

export async function runOneShot(
    image: string,
    cmd: string[] = []
): Promise<{ statusCode: number; logs: string }> {

  console.log('image',image)
    console.log('cmd',cmd)
    // Ensure image present (optional; remove if images are pre-pulled)
    await new Promise<void>((resolve, reject) => {
        docker.pull(image, (err: any, stream: NodeJS.ReadableStream) => {
            if (err) return reject(err);
            docker.modem.followProgress(stream, (e) => (e ? reject(e) : resolve()));
        });
    });

    const container = await docker.createContainer({
        Image: image,
        Cmd: cmd,
        // Auto-remove so it doesn't accumulate
        HostConfig: { AutoRemove: true },
        // Optional resource limits
        // HostConfig: { AutoRemove: true, Memory: 512 * 1024 * 1024, CpuQuota: 50000 }
    });

    await container.start();

    // Collect logs (optional)
    const stream = await container.logs({ stdout: true, stderr: true, follow: true });
    let logs = '';
    await new Promise<void>((resolve, reject) => {
        stream.on('data', (buf) => (logs += buf.toString()));
        stream.on('end', () => resolve());
        stream.on('error', (e) => reject(e));
    });

    const { StatusCode } = await container.wait();
    return { statusCode: StatusCode ?? 0, logs };
}
