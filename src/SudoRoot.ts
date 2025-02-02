import { VirtualFileSystem } from "./vfs/VirtualFileSystem";
import { PromptSystem } from "./prompt/PromptSystem";
import { Globals } from "./Globals";
import { Environment } from "./env/Environment";

export class SudoRoot {

    public static createContext(): SudoRoot {
        return new SudoRoot();
    }

    /* * */
    private vfs: VirtualFileSystem = new VirtualFileSystem();
    private promptSystem: PromptSystem;

    constructor() {
        this.promptSystem = new PromptSystem(this, this.vfs);
    }

    getPromptSystem() {
        return this.promptSystem;
    }

    getVFS() {
        return this.vfs;
    }

    async boot() {
        await this.vfs.createDefaultDirectories();
        Globals.registerGlobals();
        Environment.getEnvironment().refreshEnvironment()
        this.promptSystem.call();

    }
}