import { VirtualFileSystem } from "../vfs/VirtualFileSystem";
import Readline from "readline";
import { CWDCommand } from "./commands/cwd";
import { LSCommand } from "./commands/ls";
import { CDCommand } from "./commands/cd";
import { MKDIRCommand } from "./commands/mkdir";
import { CATCommand } from "./commands/cat";
import $P from "path/posix";
import Color from "cli-color";
import * as ts from "typescript";
import { SudoRuntimeExecutable } from "../script/SudoRuntimeExecutable";
import { SudoRoot } from "../SudoRoot";
import { ECHOCommand } from "./commands/echo";
import { SudoLogger } from "../SudoLogger";
import { SRUTILCommand } from "./commands/srutil";

export interface ICommand {

    name(): string;
    arguments(): number;
    execute(ps: PromptSystem, ...args: string[]): void;

}

export class PromptSystem {


    private defaultCommands: Record<string, ICommand> = {};
    private vfs: VirtualFileSystem;
    private interface: Readline.Interface;
    private sudoroot: SudoRoot;
    public logger: SudoLogger;

    constructor(sudoroot: SudoRoot, vfs: VirtualFileSystem) {
        this.sudoroot = sudoroot;
        this.vfs = vfs;
        this.interface = Readline.createInterface(process.stdin, process.stdout);
        this.logger = new SudoLogger();
        this.registerDefaultCommands()
    }

    registerDefaultCommands() {
        this.registerCommands(
            new CWDCommand(),
            new LSCommand(),
            new CDCommand(),
            new MKDIRCommand(),
            new CATCommand(),
            new ECHOCommand(),
            new SRUTILCommand(),
        )

    }

    registerCommand(cmd: ICommand) {
        this.defaultCommands[cmd.name()] = cmd;
    }
    registerCommands(...cmd: ICommand[]) {
        for (const command of cmd) {
            this.registerCommand(command);
        }
    }

    getInterface() {
        return this.interface;
    }

    getVirtualFileSystem() {
        return this.vfs;
    }

    getDefaultCommands() {
        return this.defaultCommands;
    }

    executeSRE(path: string) {

        const res = $P.resolve(path);
        const data = this.vfs.getFS().readFileSync(path, {
            encoding: 'utf-8'
        }).toString("utf-8");
        const sre = new SudoRuntimeExecutable(this.sudoroot);
        const tokens = sre.tokenize(data);
        const parse = sre.parser.parse(tokens);
        sre.parser.executePostTokens(parse);
        return this.call();
    }

    call() {

        this.getInterface().question(`${Color.blueBright(`$`)} ${Color.greenBright(this.vfs.cwd())} ${Color.blueBright(`>`)} `, async (res) => {
            if (!res.length) return this.call();
            const [ cmd, ...args ] = res.split(" ");
            if (this.defaultCommands[cmd] != null) {
                const command = this.defaultCommands[cmd];
                const argsLen: number = command.arguments();
                if (argsLen === 0) 
                    try {
                        await command.execute(this, ...args);
                    } catch (err: any) {
                        console.log(Color.redBright("ERR >") + " Could not run this file because an error occured. \n     " + Color.redBright("Message >") + " " + err.message)
                    }
                else {

                    if (args.length < argsLen) {
                        console.log(Color.redBright("ERR >") + " Not enough arguments.");
                        return this.call();
                    }
                    try {
                        await command.execute(this, ...args);
                    } catch (err: any) {
                        console.log(Color.redBright("ERR >") + " Could not run this file because an error occured. \n     " + Color.redBright("Message >") + " " + err.message)
                    }

                }
            } else {

                const path1 = `/sudoapps/${cmd}`;
                const path2 = `/sudousers/MainUser/apps/${cmd}`;

                if (this.vfs.getFS().existsSync(path1)) {
                    if (path1.endsWith(".sre")) {
                        return this.executeSRE(path1)
                    }
                    if (this.vfs.getFS().statSync(path1).isDirectory()) {
                        const main = $P.join(path1, "sudo_main");
                        const data = this.vfs.getFS().readFileSync(main, {
                            encoding: "utf-8"
                        }).toString("utf-8");
                        const d = ts.transpile(data);
                        const t = eval(d);
                        let command: ICommand;
                        if (typeof t === "function") {
                            command = t();;
                        } else {
                            command = t;
                        }
                        if (!command) {
                            console.log(Color.redBright("ERR >") + " Invalid Command file.")
                            return this.call()
                        }
                        const argsLen: number = command.arguments();
                        if (argsLen === 0) 
                            try {
                                await command.execute(this, ...args);
                            } catch (err: any) {
                                console.log(Color.redBright("ERR >") + " Could not run this file because an error occured. \n     " + Color.redBright("Message >") + " " + err.message)
                            }
                        else {
    
                            if (args.length < argsLen) {
                                console.log(Color.redBright("ERR >") + " Not enough arguments.");
                                return this.call();
                            }
                            try {
                                await command.execute(this, ...args);
                            } catch (err: any) {
                                console.log(Color.redBright("ERR >") + " Could not run this file because an error occured. \n     " + Color.redBright("Message >") + " " + err.message)
                            }
    
                        }
                    } else {
                        const data = this.vfs.getFS().readFileSync(path1, {
                            encoding: "utf-8"
                        }).toString("utf-8");
                        const d = ts.transpile(data);
                        const t = eval(d);
                        let command: ICommand;
                        if (typeof t === "function") {
                            command = t();;
                        } else {
                            command = t;
                        }
                        if (!command) {
                            console.log(Color.redBright("ERR >") + " Invalid Command file.")
                            return this.call()
                        }
                        const argsLen: number = command.arguments();
                        if (argsLen === 0) 
                            try {
                                await command.execute(this, ...args);
                            } catch (err: any) {
                                console.log(Color.redBright("ERR >") + " Could not run this file because an error occured. \n     " + Color.redBright("Message >") + " " + err.message)
                            }
                        else {
    
                            if (args.length < argsLen) {
                                console.log(Color.redBright("ERR >") + " Not enough arguments.");
                                return this.call();
                            }
                            try {
                                await command.execute(this, ...args);
                            } catch (err: any) {
                                console.log(Color.redBright("ERR >") + " Could not run this file because an error occured. \n     " + Color.redBright("Message >") + " " + err.message)
                            }
    
                        }
                    }
                } else if (this.vfs.getFS().existsSync(path2)) {
                    if (path2.endsWith(".sre")) {
                        return this.executeSRE(path2)
                    }
                    if (this.vfs.getFS().statSync(path2).isDirectory()) {
                        const main = $P.join(path2, "sudo_main");
                        const data = this.vfs.getFS().readFileSync(main, {
                            encoding: "utf-8"
                        }).toString("utf-8");
                        const d = ts.transpile(data);
                        const t = eval(d);
                        let command: ICommand;
                        if (typeof t === "function") {
                            command = t();;
                        } else {
                            command = t;
                        }
                        if (!command) {
                            console.log(Color.redBright("ERR >") + " Invalid Command file.")
                            return this.call()
                        }
                        const argsLen: number = command.arguments();
                        if (argsLen === 0) 
                            try {
                                await command.execute(this, ...args);
                            } catch (err: any) {
                                console.log(Color.redBright("ERR >") + " Could not run this file because an error occured. \n     " + Color.redBright("Message >") + " " + err.message)
                            }
                        else {
    
                            if (args.length < argsLen) {
                                console.log(Color.redBright("ERR >") + " Not enough arguments.");
                                return this.call();
                            }
                            try {
                                await command.execute(this, ...args);
                            } catch (err: any) {
                                console.log(Color.redBright("ERR >") + " Could not run this file because an error occured. \n     " + Color.redBright("Message >") + " " + err.message)
                            }
    
                        }
                    } else {
                        const data = this.vfs.getFS().readFileSync(path2, {
                            encoding: "utf-8"
                        }).toString("utf-8");
                        const d = ts.transpile(data);
                        const t = eval(d);
                        let command: ICommand;
                        if (typeof t === "function") {
                            command = t();;
                        } else {
                            command = t;
                        }
                        if (!command) {
                            console.log(Color.redBright("ERR >") + " Invalid Command file.")
                            return this.call()
                        }
                        const argsLen: number = command.arguments();
                        if (argsLen === 0) 
                            try {
                                await command.execute(this, ...args);
                            } catch (err: any) {
                                console.log(Color.redBright("ERR >") + " Could not run this file because an error occured. \n     " + Color.redBright("Message >") + " " + err.message)
                            }
                        else {
    
                            if (args.length < argsLen) {
                                console.log(Color.redBright("ERR >") + " Not enough arguments.");
                                return this.call();
                            }
                            try {
                                await command.execute(this, ...args);
                            } catch (err: any) {
                                console.log(Color.redBright("ERR >") + " Could not run this file because an error occured. \n     " + Color.redBright("Message >") + " " + err.message)
                            }
    
                        }
                    }
                } else {
                    console.log(Color.redBright("ERR >") + " No such command.")
                    return this.call();
                }

            }
            
            this.call();
        })

    }

}