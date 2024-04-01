import { SudoRoot } from "../SudoRoot";
import { ICommand } from "../prompt/PromptSystem";
import { Token } from "./SudoRuntimeExecutable";

export interface PostToken {
    startToken?: Token,
    endToken?: Token,
    command?: ICommand,
    content?: string,
    args: string[]
}

export class SudoRuntimeParser {

    private sudoroot: SudoRoot;
    constructor(sudoroot: SudoRoot) {
        this.sudoroot = sudoroot;
    }

    public parse(tokens: Token[]) {

        const commands: Record<string, ICommand> = this.sudoroot.getPromptSystem().getDefaultCommands();
        
        const postTokens: PostToken[] = [];
        let postToken: PostToken = {
            args: []
        };

        for (let i = 0; i<tokens.length; i++) {
            const token: Token = tokens[i];
        
            if (token.newline) {
                postToken.startToken = token;
                const peek = tokens[i + 1];
                postToken.content = token.value;
                postToken.command = commands[token.value];
                
                if ((peek && peek.newline) || i >= tokens.length) {
                    postToken.endToken = token;
                    postTokens.push(postToken);
                    postToken = {
                        args: []
                    };
                }
                
            } else {

                const peek = tokens[i + 1];
                let end = false;
                if ((peek && peek.newline) || i >= tokens.length) {
                    end = true;
                }

                postToken.content += ` ${token.value}`;
                postToken.args.push(token.value)
                if (end) {
                    postToken.endToken = token;
                    postTokens.push(postToken);
                    postToken = {
                        args: []
                    };
                }
            }

        }

        if (postToken.startToken) {
            if (!postToken.endToken) {
                const last = tokens[tokens.length - 1];
                postToken.endToken = last;
            }
            postTokens.push(postToken);
            postToken = {
                args: []
            };
        }

        return postTokens;

    }

    executePostTokens(post: PostToken[]) {
        for (const p of post) {
            if (p.command) {
                p.command.execute(this.sudoroot.getPromptSystem(), ...p.args);
            }
        }
    }

}