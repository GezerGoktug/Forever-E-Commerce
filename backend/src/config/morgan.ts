import morgan, { Options } from "morgan";
import { ExtendedRequest } from "../types/types";
import logger from "./logger";
import { Response } from "express";

morgan.token("user-info", (req: ExtendedRequest) => {
    if (req.user) {
        return `{\n- userId: ${req.user.userId || "-"}\n- Role: ${req.user.role || "-"}\n- Email: ${req.user.email || "-"}\n}`;
    }
    return "NULL";
});

const morganFormat = [
    '--- REQUEST LOG START ---',
    '-> IP: :remote-addr',
    '-> URL: :url',
    '-> Status: :status',
    '-> Method: :method',
    '-> Response-Length: :res[content-length]',
    '-> Response-Time: :response-time ms',
    '-> User: :user-info',
    '--- REQUEST LOG END ---\n'
].join('\n');

const morganOptions: Options<ExtendedRequest, Response> = {
    stream: {
        write: (message: string) => logger.info(message.trim()),
    },
}

export default morgan(morganFormat, morganOptions);