import memfs from "memfs";
import { VirtualFileSystem } from "./vfs/VirtualFileSystem";
import { PromptSystem } from "./prompt/PromptSystem";
import { Globals } from "./Globals";

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

    boot() {
        Globals.registerGlobals();
        this.vfs.createDefaultDirectories();
        this.promptSystem.call();

    }
}