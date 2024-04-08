import { Environment } from "../../env/Environment";
import { ICommand, PromptSystem } from "../PromptSystem";

export class REFENVCommand implements ICommand {
    arguments(): number {
        return 0;
    }
    name(): string {
        return "refreshenv";
    }
    execute(ps: PromptSystem, ...args: string[]): void {
        ps.logger.info("Refreshing Environment, please wait...")
        Environment.getEnvironment().refreshEnvironment();
        ps.logger.info("Refreshed Environment!");
    }
    
}