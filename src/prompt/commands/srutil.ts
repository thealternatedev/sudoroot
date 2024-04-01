import { VirtualFileSystem } from "../../vfs/VirtualFileSystem";
import { ICommand, PromptSystem } from "../PromptSystem";

export class SRUTILCommand implements ICommand {
    arguments(): number {
        return 1;
    }
    name(): string {
        return "srutil";
    }
    execute(ps: PromptSystem, ...args: string[]): void {
        const vfs: VirtualFileSystem = ps.getVirtualFileSystem();
        const command = args[0];

        switch(command) {
            case "shutdown": {
                ps.logger.info("Shutting down system.");
                process.exit(0);
                break;
            }

            default: {
                ps.logger.error("No Command was found by that name.");
                break;
            }
        }
    }
    
}