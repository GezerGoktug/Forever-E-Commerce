import fs from "fs/promises";

const initStaticFolder = async () => {
    let isExistStaticFolder = false;
    try {
        await fs.access("./static")
        isExistStaticFolder = true;
    } catch {
        isExistStaticFolder = false;
    }
    if (isExistStaticFolder) {
        let isExistDistFolder = false;
        try {
            await fs.access("./dist")
            isExistDistFolder = true;
        } catch {
            isExistDistFolder = false;
        }
        if (!isExistDistFolder) {
            await fs.mkdir("./dist");
            await fs.mkdir("./dist/static");
        }
        await fs.cp("./static", "./dist/static", { recursive: true });
    }
    else {
        console.warn("Not accessed static folder")
    }
}

initStaticFolder();