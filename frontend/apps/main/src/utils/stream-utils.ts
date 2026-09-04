export const getDataWithStreamReader = async <T>({
    stream,
    onStreamStart,
    onChunkToParsedData,
    onFinishedStream,
}: {
    stream: ReadableStream;
    onStreamStart: () => void;
    onChunkToParsedData: (parsedData: T) => void;
    onFinishedStream: () => void;
}): Promise<Partial<{ isFinishedRead: boolean; error: string }> | null | undefined> => {
    const reader = stream?.getReader();
    const decoder = new TextDecoder("utf-8");

    if (!reader) {
        return { error: "Reader not found" };
    }

    onStreamStart();

    while (true) {
        const { done, value } = await reader.read();

        if (done) {
            onFinishedStream();
            break;
        }

        const chunkString = decoder.decode(value, { stream: true });
        const lines = chunkString.split('\n\n');

        for (const line of lines) {
            if (!line.startsWith('data: ')) continue;

            const dataStr = line.replace('data: ', '').trim();

            if (dataStr === '[DONE]') break;

            try {
                onChunkToParsedData(JSON.parse(dataStr) as T);
            } catch (e) {
                console.error("JSON parse error while reading agent stream:", e);
            }
        }
    }

    return { isFinishedRead: true };
}
