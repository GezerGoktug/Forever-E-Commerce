export const initStreamReader = async <T>({
    streamer,
    onStreamStart,
    onChunkParseToData,
    onStreamFinish,
    onStreamError,
}: {
    streamer: ReadableStream;
    onStreamStart: () => void;
    onChunkParseToData: (parsedData: T) => void;
    onStreamFinish: () => void;
    onStreamError: () => void;
}): Promise<Partial<{ isFinishedRead: boolean; error: string }> | null | undefined> => {
    const reader = streamer?.getReader();
    const decoder = new TextDecoder("utf-8");

    if (!reader) {
        return { error: "Reader not found" };
    }

    onStreamStart();

    let isError = false;

    while (true) {
        const { done, value } = await reader.read();

        if (done) {
            if (isError) {
                onStreamError();
            }
            onStreamFinish();
            break;
        }

        const chunkString = decoder.decode(value, { stream: true });
        const lines = chunkString.split('\n\n');

        for (const line of lines) {
            if (line.startsWith('error: ')) {
                isError = true;
                break;
            };
            if (!line.startsWith('data: ')) continue;

            const dataStr = line.replace('data: ', '').trim();

            if (dataStr === '[DONE]') break;

            try {
                onChunkParseToData(JSON.parse(dataStr) as T);
            } catch (e) {
                console.error("JSON parse error while reading agent stream:", e);
            }
        }
    }

    return { isFinishedRead: true };
}
