import { ICommand, PromptSystem } from "../PromptSystem";

export class CWDCommand implements ICommand {
    arguments(): number {
        return 0;
    }
    name(): string {
        return "cwd";
    }
    execute(ps: PromptSystem, ...args: string[]): void {
        console.log(`${ps.getVirtualFileSystem().cwd()}`);
    }
    
}