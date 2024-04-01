import memfs from "memfs";
import * as ts from "typescript";
import path from "path/posix";
import ProgressBar from "progress";
import download from "download";
import ini from "ini";

export class SudoUtilities {

    public static MAIN_LIBRARY_FILE = `sudo_lib_main`;
    public static IFS: memfs.IFs = memfs.fs;

    public static loadLibrary(name: string): any {
        const p = `/sudoroot/lib/${name}`;
        if (!this.IFS.existsSync(p)) {
            console.log("> Directory not found")
            return null;
        }
        if (!this.IFS.statSync(p).isDirectory()) {
            console.log("> Cannot load a file directly.")
            return null;
        }
        const p2 = path.resolve(p, this.MAIN_LIBRARY_FILE);
        if (!this.IFS.existsSync(p2)) {
            console.log("> Main file is not found.")
            return null;
        }
        if (!this.IFS.statSync(p2).isFile()) {
            console.log("> Cannot load main file as a directory.")
            return null;
        }
        const read = this.IFS.readFileSync(p2, {
            encoding: "utf-8"
        }).toString("utf-8");
        const transpile = ts.transpile(read);
        const evaled = eval(transpile);
        return evaled;
    }

    public static loadCustomLibFile(name: string, file: string): any {
        const p = `/sudoroot/lib/${name}`;
        if (!this.IFS.existsSync(p)) {
            console.log("> Directory not found")
            return null;
        }
        if (!this.IFS.statSync(p).isDirectory()) {
            console.log("> Cannot load a file directly.")
            return null;
        }
        const p2 = path.resolve(p, file);
        if (!this.IFS.existsSync(p2)) {
            console.log("> Main file is not found.")
            return null;
        }
        if (!this.IFS.statSync(p2).isFile()) {
            console.log("> Cannot load main file as a directory.")
            return null;
        }
        const read = this.IFS.readFileSync(p2, {
            encoding: "utf-8"
        }).toString("utf-8");
        const transpile = ts.transpile(read);
        const evaled = eval(transpile);
        return evaled;
    }

    public static async $Download(url: string, dest: string): Promise<void> {
     let downloaded = 0;
     let totalSize = 0;
     const progressBar = new ProgressBar("Downloading [:bar>] :percent :etas", {
       complete: "=",
       incomplete: " ",
       width: 20,
       total: totalSize,
       clear: true, // Clear the progress bar on completion
     });
     // Get total file size
     await download(url, { extract: false })
       .on("response", (res: any) => {
         totalSize = parseInt(res.headers["content-length"], 10);
         // Download the file with progress tracking
         res.on("data", (data: any) => {
           downloaded += data.length;
           progressBar.tick(data.length);
         });
         res.on("close", () => {
           progressBar.terminate();
         })
       })
       .then((data: any) => {
         this.IFS.writeFileSync(dest, data);
         console.log("=> Finished Downloading!")
       });
   }

   public static async loadNodeJSLibrary(name: string): Promise<any> {
    const systemConfig = this.loadSystemConfiguration();
    const sudoDisable = systemConfig.system.DisableSudoRequiring;
    let disable = sudoDisable && typeof sudoDisable === "string" && sudoDisable.toUpperCase() === "T";
    if (disable) return null;
    const d: any = require(name);
    return d.default ?? d;
   }
   public static loadSystemConfiguration(): any {
        const content = this.IFS.readFileSync("/sudoroot/sys/sys.ini", { encoding: "utf-8" }).toString("utf-8");
        return ini.parse(content);
   }
}