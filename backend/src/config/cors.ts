import cors, { CorsOptions } from "cors"

const conventionalCommitsName = [
    'feat',
    'fix',
    'docs',
    'ui',
    'style',
    'refactor',
    'perf',
    'test',
    'chore',
    'revert',
    'ci',
    'security'
];

// this function check what passed urls compatibility to  branch deployment urls at Netlify
const isPatternCompatibility = (url: string = "") => {
    try {
        const { hostname: urlHostName } = new URL(url);
        const { hostname: mainHostName } = new URL(process.env.CLIENT_URL || "");

        if (urlHostName.endsWith(`--${mainHostName}`)) {
            const branchPart = urlHostName.split('--')[0]; 

            return conventionalCommitsName.some(prefix => branchPart.startsWith(`${prefix}-`));
        }
        return false;
    } catch (error) {
        return false
    }
}

const corsConfig: CorsOptions = {
    origin: (origin, callback) => {        
        const isMainClientUrl = origin === process.env.CLIENT_URL
        const isMainServerUrl = origin === process.env.SERVER_URL

        if (!origin || isMainClientUrl || isMainServerUrl || isPatternCompatibility(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("CORS Policy: This origin is not allowed."))
        }
    },
    methods: ["GET,POST,PUT,DELETE"],
    credentials: true,
}

export default cors(corsConfig);