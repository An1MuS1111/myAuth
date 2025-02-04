import path from "path";

export default function consoleLog(message: any) {
    console.log(`[${path.basename(__filename)}] ${message}`);
}
