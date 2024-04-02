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

        if (!vfs.getFS().existsSync(dir)) return console.log("Does not exist.");
        if (!vfs.getFS().statSync(dir).isDirectory()) return console.log("Cannot remove a file using rmdir");
        if (vfs.getFS().readdirSync(dir).length) return console.log("Directory is not empty");

        vfs.getFS().rmdirSync(dir);
    }
    
}
