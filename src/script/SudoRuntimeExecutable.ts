import { SudoRoot } from "../SudoRoot";
import { SudoRuntimeParser } from "./SudoRuntimeParser";

export enum TokenType {
    Argument,
    StringLiteral,
    Command,
    Boolean,
    Number,
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

    isNumber(value: string) {
        return !isNaN(parseInt(value));
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
                } else if (this.isNumber(char)) {
                    tokens.push({ type: TokenType.Number, value: parseInt(char), newline: isNewline });
                } else if ((char === '') && !inString) {
                    if (line.startsWith(currentWord)) {
                        isNewline = true;
                    }
                    if (currentWord !== '') {
                        if (currentWord === "true" || currentWord === "false") {
                            tokens.push({ type: TokenType.Boolean, value: currentWord === "true" ? true : false, newline: false });
                        } else {
                            tokens.push({ type: TokenType.Argument, value: currentWord, newline: isNewline });
                        }
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
            if (currentWord === "true" || currentWord === "false") {
                tokens.push({ type: TokenType.Boolean, value: currentWord === "true" ? true : false, newline: false });
            } else {
                tokens.push({ type: inString ? TokenType.StringLiteral : TokenType.Argument, value: currentWord, newline: false });
            }
        }

    
        return tokens;
    }
}