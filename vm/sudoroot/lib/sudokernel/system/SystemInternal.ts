// @ts-nocheck

export class SudoSystemInternal {

    private logger: any;

    constructor() {
        const logger = SudoUtilities.loadLibrary("sudologger");
        this.logger = new logger();
    }

    shutdown() {
        this.logger.info("Shutting down system.");
        process.exit(0)
    }

}