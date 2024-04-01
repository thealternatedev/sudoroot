import { VirtualFileSystem } from "../../vfs/VirtualFileSystem";
import { ICommand, PromptSystem } from "../PromptSystem";

export class MKDIRCommand implements ICommand {
    arguments(): number {
        return 1;
    }
    name(): string {
        return "mkdir";
    }
    execute(ps: PromptSystem, ...args: string[]): void {
        const vfs: VirtualFileSystem = ps.getVirtualFileSystem();
        let dir = args[0];
        dir = vfs.resolve(dir);

        vfs.getFS().mkdirSync(dir);
    }
    
}