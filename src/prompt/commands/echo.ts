import { ICommand, PromptSystem } from "../PromptSystem";

export class ECHOCommand implements ICommand {
    arguments(): number {
        return 0;
    }
    name(): string {
        return "echo";
    }
    execute(ps: PromptSystem, ...args: string[]): void {
        console.log(args.join(" "));
    }
    
}