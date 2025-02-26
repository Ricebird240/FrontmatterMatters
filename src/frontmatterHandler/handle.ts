import { FrontMatterResult } from 'front-matter';
import { Command, CommandTypes } from './types'
import { extractFrontMatter, create, createWhen, removeValue, removeKey, replace } from './utils'
import * as fs from 'fs'
import * as YAML from 'js-yaml'

function checkInputType(expectedType: string, recieved: unknown) {
    if (expectedType != typeof recieved) {
        if (expectedType.includes("[]")) {
            if (Array.isArray(recieved)) {
                return;
            }
        }
        const errorMessage = `Expected type ${expectedType}, instead got ${recieved} of type ${typeof recieved}`
        throw new TypeError(errorMessage)
    }
    return;
}

/**
 * Takes a command and returns string of modified file
 * Does not support nested arrays or nested properities
 * 
 * @param command
 * @returns 
 */
export function handle(command: Command): string {
    const file: string = fs.readFileSync(command.file, 'utf-8');
    const parsedFile: FrontMatterResult<unknown> = extractFrontMatter(file);
    const frontmatter: Record<string, unknown> = (parsedFile.attributes as Record<string, unknown>);
    let yaml: object = {};
    switch (command.command) {
        case CommandTypes.Create:
            checkInputType("string", command.args);
            yaml = create(frontmatter, JSON.parse(command.args as string));
            break;
        case CommandTypes.RemoveKey:
            checkInputType("string", command.args);
            yaml = removeKey(frontmatter, command.args as string);
            break;
        case CommandTypes.RemoveValue:
            checkInputType("string", command.args);
            yaml = removeValue(frontmatter, JSON.parse(command.args as string));
            break;
        case CommandTypes.Replace:
            checkInputType("string[]", command.args);
            yaml = replace(frontmatter, JSON.parse(command.args[0]), JSON.parse(command.args[1]));
            break;
        case CommandTypes.CreateWhen:
            checkInputType("string[]", command.args);
            yaml = createWhen(frontmatter, JSON.parse(command.args[0]), JSON.parse(command.args[1]));
            break;
        default:
            throw new TypeError(`Unexpected command ${command.command}`);
    }
    return "---\n" + YAML.dump(yaml, {indent: 4}) + "---\n" + parsedFile.body;
}