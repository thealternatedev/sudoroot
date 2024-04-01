import { VirtualFileSystem } from "../../vfs/VirtualFileSystem";
import { ICommand, PromptSystem } from "../PromptSystem";

export class CATCommand implements ICommand {
    arguments(): number {
        return 1;
    }
    name(): string {
        return "cat";
    }
    execute(ps: PromptSystem, ...args: string[]): void {
        const vfs: VirtualFileSystem = ps.getVirtualFileSystem();
        let dir = args[0];
        if (!dir) dir = vfs.cwd();
        dir = vfs.resolve(dir);
        if (!vfs.getFS().existsSync(dir)) return console.log("File does not exist.");
        if (vfs.getFS().statSync(dir).isDirectory()) return console.log("You cannot read a directory.")
        const data = vfs.getFS().readFileSync(dir, {
            encoding: "utf-8"
        });
        console.log(data);
    }
    
}