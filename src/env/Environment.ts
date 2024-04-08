import dotenv from "dotenv";
import memfs from "memfs";

export class Environment {

    private static environment: Environment = new Environment();

    public static getEnvironment(): Environment {
        return this.environment;
    }

    private data: Record<string, string> = {};
    private memfs: memfs.IFs = memfs.fs;
    private mainEnvironmentFile: string = "/sudoroot/sys/env/preset_.env"

    public refreshEnvironment() {
        const read = this.memfs.readFileSync(this.mainEnvironmentFile, {
            encoding: 'utf-8'
        }).toString("utf-8");

        const pasrsed = dotenv.parse<Record<string, string>>(read);
        this.data = pasrsed;
        return true;
    }

    public fetch(name: string) {
        return this.data[name];
    }

    public add(name: string, value: string): this {
        this.data[name] = value;
        this.save();
        return this;
    }

    public save() {
        let str = "";
        for (const [key, value] of Object.entries(this.data)) {
            str += `${key}=${value}\n`;
        }
        str = str.trim();
        this.memfs.writeFileSync(this.mainEnvironmentFile, str);
        return true;
    }

}