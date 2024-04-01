import { VirtualFileSystem } from "../../vfs/VirtualFileSystem";
import { ICommand, PromptSystem } from "../PromptSystem";
import Color from "cli-color";

export class LSCommand implements ICommand {
    arguments(): number {
        return 0;
    }
    name(): string {
        return "ls";
    }
    execute(ps: PromptSystem, ...args: string[]): void {
        const vfs: VirtualFileSystem = ps.getVirtualFileSystem();
        let dir = args[0];
        if (!dir) dir = vfs.cwd();
        dir = vfs.resolve(dir);
        if (!vfs.getFS().existsSync(dir)) return console.log("Directory does not exist.");
        if (vfs.getFS().statSync(dir).isFile()) return console.log("You cannot read a file.")
        let list = vfs.getFS().readdirSync(dir).map((v) => {
            if (vfs.getFS().statSync(`${dir}/${v}`).isFile()) {
                v = `${Color.cyanBright(v)}`;
            } else {
                v = `${Color.greenBright(v)}`
            }
            if (dir === "/") {
                return `/${v}`
            } else {
                const s = dir.split("/").map((v) => {
                    return Color.green(v);
                }).join("/");
                return `${s}/${v}`;
            }
        }).join(", ");
        if (!list.length) list = "Empty."
        console.log(list);
    }
    
}