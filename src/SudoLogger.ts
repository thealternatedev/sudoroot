import Color from "cli-color";

export class SudoLogger {
    constructor() {

    }

    info(content: string) {
        console.log(`${Color.greenBright("INFO >")} ${content}`);
    }

    warn(content: string) {
        console.log(`${Color.yellowBright("WARN >")} ${content}`);
    }

    error(content: string) {
        console.log(`${Color.redBright("ERR >")} ${content}`);
    }

    debug(content: string) {
        console.log(`${Color.magentaBright("DEBUG >")} ${content}`);
    }

    fatal(content: string) {
        console.log(`${Color.red("FATAl >")} ${content}`);
    }
}