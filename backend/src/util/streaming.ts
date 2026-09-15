import { Response } from "express";

type OnEventFromStreamingVariablesType<T> = {
    event: T;
    dt: { stream_id: string };
    sendResponse: (dt: Object) => void;
}

export type StreamerConfigType<T> = {
    onStreamStart?: (dt: { stream_id: string }) => void;
    onEventFromStreaming: (eventInput: OnEventFromStreamingVariablesType<T>) => void | "CONTINUE";
    onStreamFinish?: (dt: { stream_id: string }) => void;
    onStreamError?: (errorMessage: Error) => void;
}

const handleStreaming = async <T>(res: Response, eventStream: AsyncIterable<T>, configs: StreamerConfigType<T>) => {

    const { onEventFromStreaming, onStreamFinish, onStreamStart, onStreamError } = configs;
    const headers = new Map();

    headers.set('Content-Type', 'text/event-stream');
    headers.set('Cache-Control', 'no-cache');
    headers.set('Connection', 'keep-alive');
    res.setHeaders(headers);

    const stream_id = crypto.randomUUID();
    onStreamStart?.({ stream_id });
    try {
        for await (const event of eventStream) {
            const flag = onEventFromStreaming({
                event,
                dt: { stream_id },
                sendResponse: (dt) => res.write(`data: ${JSON.stringify(dt)} \n\n`)
            });
            if (flag === "CONTINUE") {
                continue;
            }
        }
    } catch (error) {
        onStreamError?.(error as Error);
        res.write(`error: [ERROR]\n\n`);
        res.end();  
        return;
    }
    onStreamFinish?.({ stream_id });
    res.write(`data: [DONE]\n\n`);
    res.end();
}


export default handleStreaming;