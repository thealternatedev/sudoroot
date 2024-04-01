import { SudoRoot } from "../SudoRoot";
import { SudoRuntimeParser } from "./SudoRuntimeParser";

export enum TokenType {
    Argument,
    StringLiteral,
    Command,
}
export interface Token {
    type: TokenType,
    value: any,
    newline?: boolean
}

export class SudoRuntimeExecutable {

    public parser: SudoRuntimeParser;
    private sudoroot: SudoRoot;

    constructor(sudoroot: SudoRoot) {
        this.parser = new SudoRuntimeParser(sudoroot);
        this.sudoroot = sudoroot;
    }

    tokenize(code: string): Token[] {
        const script = code.trim();
        const tokens: Token[] = [];
        let currentWord = '';
        let inString = false;
    
        const lines = script.split('\n');
    
        for (const line of lines) {
    
            for (let i = 0; i < line.length; i++) {
                const char = line[i].trim();
                let isNewline = false;

                
                if (char === '"') {
                    if (inString) {
                        // End of the string literal
                        tokens.push({ type: TokenType.StringLiteral, value: currentWord, newline: isNewline });
                        currentWord = '';
                        inString = false;
                    } else {
                        // Start of a string literal
                        inString = true;
                    }
                } else if ((char === '') && !inString) {
                    if (line.startsWith(currentWord)) {
                        isNewline = true;
                    }
                    if (currentWord !== '') {
                        tokens.push({ type: TokenType.Argument, value: currentWord, newline: isNewline });
                        currentWord = '';
                    }
                } else {
                    // Regular character
                    currentWord += char;
                    
                }
            }
        }
    
        // Add the last word if it exists
        if (currentWord !== '') {
            const before = tokens[tokens.length - 1];
            tokens.push({ type: inString ? TokenType.StringLiteral : TokenType.Argument, value: currentWord, newline: false });
        }
    
        return tokens;
    }
}