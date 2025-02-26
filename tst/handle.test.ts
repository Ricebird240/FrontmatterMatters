
import { handle } from "../src/frontmatterHandler/handle";
import { Command, CommandTypes } from "../src/frontmatterHandler/types";
import * as fs from 'fs'

const TEST_FILE_PATH = "./tst/test-files/";
const EXPECTED_OUTPUT_PATH = "./tst/expected-output/";

test('creates', () => {
    const FILE_NAME = "create.md";
    const command: Command = {
        file: TEST_FILE_PATH + FILE_NAME,
        command: CommandTypes.Create,
        args: '{\"tags\": \"value2\", \"new empty key\": null, \"new key\":\"new-value\", \"new key list\":[\"value4\", \"value5\"]}'
    };
    const expectedOutput: string = fs.readFileSync(EXPECTED_OUTPUT_PATH + FILE_NAME, 'utf-8');
    expect(handle(command).replace(/[\r]/g, '')).toBe(expectedOutput.replace(/[\r]/g, ''));
})

test('removes key', () => {
    const FILE_NAME = "remove-key.md";
    const command: Command = {
        file: TEST_FILE_PATH + FILE_NAME,
        command: CommandTypes.RemoveKey,
        args: "bad key"
    };
    const expectedOutput: string = fs.readFileSync(EXPECTED_OUTPUT_PATH + FILE_NAME, 'utf-8');
    expect(handle(command).replace(/[\r]/g, '')).toBe(expectedOutput.replace(/[\r]/g, ''));
})

test('removes value', () => {
    const FILE_NAME = "remove-value-from-key.md";
    const command: Command = {
        file: TEST_FILE_PATH + FILE_NAME,
        command: CommandTypes.RemoveValue,
        args: '{\"tags\":\"delete-me-1\", \"bad\": \"delete-me-2\", \"bad list\": [\"delete-me-3\", \"delete-me-4\"]}'
    };
    const expectedOutput: string = fs.readFileSync(EXPECTED_OUTPUT_PATH + FILE_NAME, 'utf-8');
    expect(handle(command).replace(/[\r]/g, '')).toBe(expectedOutput.replace(/[\r]/g, ''));
})

test('replaces value', () => {
    const FILE_NAME = "replace-value.md";
    const command: Command = {
        file: TEST_FILE_PATH + FILE_NAME,
        command: CommandTypes.Replace,
        args: ['{\"tags\": \"replace-me-1\", \"change me\": \"replace-me-2\", \"replace key\": \"replace-me-3\"}', '{\"tags\": \"new1\", \"change me\": \"new2\", \"new key\": \"new3\"}']
    };
    const expectedOutput: string = fs.readFileSync(EXPECTED_OUTPUT_PATH + FILE_NAME, 'utf-8');
    expect(handle(command).replace(/[\r]/g, '')).toBe(expectedOutput.replace(/[\r]/g, ''));
})

test('updates', () => {
    const FILE_NAME = "update-or-create-new-key-value-from-key.md";
    const command: Command = {
        file: TEST_FILE_PATH + FILE_NAME,
        command: CommandTypes.CreateWhen,
        args: ['{\"tags\": \"update-flag\"}', '{\"update me\": \"new1\", \"new key\": \"new2\"}']
    };
    const expectedOutput: string = fs.readFileSync(EXPECTED_OUTPUT_PATH + FILE_NAME, 'utf-8');
    expect(handle(command).replace(/[\r]/g, '')).toBe(expectedOutput.replace(/[\r]/g, ''));
})

test('does not update', () => {
    const FILE_NAME = "do-not-update.md";
    const command: Command = {
        file: TEST_FILE_PATH + FILE_NAME,
        command: CommandTypes.CreateWhen,
        args: ['{\"tags\": \"update-flag\"}', '{\"update me\": \"new1\", \"new key\": \"new2\"}']
    };
    const expectedOutput: string = fs.readFileSync(EXPECTED_OUTPUT_PATH + FILE_NAME, 'utf-8');
    expect(handle(command).replace(/[\r]/g, '')).toBe(expectedOutput.replace(/[\r]/g, ''));
})
