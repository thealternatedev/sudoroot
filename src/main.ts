import { SudoRoot } from "./SudoRoot";

(async () => {

    const sudoroot = SudoRoot.createContext();
    sudoroot.boot();
    /*sudoroot.getVFS().createDefaultDirectories()
    const example = `
ls
    `
    const executable = new SudoRuntimeExecutable(sudoroot)
    const tokens: Token[] = executable.tokenize(example);
    const posttokens = executable.parser.parse(tokens);
    console.log(tokens, posttokens)
    executable.parser.executePostTokens(posttokens);
    executable.parser.parse(tokens);*/
    

})();