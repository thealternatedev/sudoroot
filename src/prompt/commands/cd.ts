import { ICommand, PromptSystem } from "../PromptSystem";

export class CDCommand implements ICommand {
    arguments(): number {
        return 1;
    }
    name(): string {
        return "cd";
    }
    execute(ps: PromptSystem, ...args: string[]): void {
        const vfs = ps.getVirtualFileSystem();
        let arg = args[0];
        
        if (vfs.cwd() === arg) return console.log("Already in that directory");
        arg = vfs.resolve(arg);
        vfs.cwd(arg);
    }
    
}